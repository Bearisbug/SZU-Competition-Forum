"""
app/services/auth_service.py

与用户认证、授权相关的业务逻辑：JWT token 生成、校验，密码哈希，邮件发送等。
"""

import jwt
import random
import smtplib
import json
import threading
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import hashlib
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr

from app.db.models import User
from app.crud import user as crud_user
from app.core.config import JWT_SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db.session import get_db
from app.schemas.user import StudentRegisterRequest, StudentLoginRequest, TeacherLoginRequest, EmailRequest

# --- 密码哈希 ---
# 哈希操作已移至前端，后端只进行哈希值的比较

def verify_password(sent_hash: str, stored_hash: str) -> bool:
    """比较前端发送的哈希值与数据库存储的哈希值是否一致"""
    if not stored_hash:
        return False
    return sent_hash == stored_hash

# --- JWT Token ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/student") # 示例URL

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """创建 JWT 令牌"""
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# --- 用户认证与注册 ---

def register_student(db: Session, student_data: StudentRegisterRequest) -> User:
    """学生注册逻辑"""
    db_user = crud_user.get_user_by_id(db, student_data.id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="该学号未录入数据库，无法注册")
    if db_user.role != 'student':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="该账号不是学生账号")
    if db_user.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="该学号已注册，请直接登录或找回密码")

    # 直接使用前端传递过来的哈希值
    return crud_user.set_user_password(db, user_id=student_data.id, password_hash=student_data.password)

def authenticate_user_by_id(db: Session, login_data: StudentLoginRequest) -> str:
    """通过ID和密码哈希认证用户（学生或管理员）"""
    db_user = crud_user.get_user_by_id(db, login_data.id)

    # 检查用户是否存在
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="账号不存在")

    # 检查角色是否允许（学生或管理员）
    if db_user.role not in ['student', 'admin']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="该账号类型不允许使用此方式登录")

    # 检查密码是否已设置
    if not db_user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="账号尚未设置密码，请先注册")

    # 验证密码哈希
    if not verify_password(login_data.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="密码错误")

    # 创建Token
    token = create_access_token(data={"sub": str(db_user.id)})
    return token

def authenticate_teacher(db: Session, login_data: TeacherLoginRequest) -> str:
    """教师登录认证"""
    verify_email_code(login_data.email, login_data.code) # 验证码校验失败会抛出异常
    db_user = crud_user.get_user_by_email(db, login_data.email)
    # 验证码已通过，此处无需再验证用户是否存在，因为发码时已验证
    
    token = create_access_token(data={"sub": str(db_user.id)})
    return token


# --- 当前用户依赖 ---

def verify_token(token: str = Depends(oauth2_scheme)) -> dict:
    """验证Token有效性，返回payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        # 检查Token是否过期
        if datetime.fromtimestamp(payload.get("exp", 0)) < datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 已过期")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 无效，无法解析用户信息")
        return {"user_id": user_id}
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 无效或已损坏")

def get_current_user(token: dict = Depends(verify_token), db: Session = Depends(get_db)) -> User:
    """获取当前登录用户"""
    user_id = token.get("user_id")
    user = crud_user.get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在或已被删除")
    return user

# --- 权限控制 ---

def is_admin(role_or_user) -> bool:
    """判断是否为管理员"""
    role = getattr(role_or_user, "role", role_or_user or "")
    return role.lower() == "admin"

def ensure_admin(user: User = Depends(get_current_user)):
    """依赖项：确保当前用户是管理员"""
    if not is_admin(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权限：需要管理员")


# --- 邮箱验证码服务 ---

CODE_FILE = Path("email_codes.jsonl")
lock = threading.Lock()
SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 465
SENDER_EMAIL = "1992898402@qq.com"
SENDER_PASS = "rrwrlnkeztxibeff"  # 授权码

def set_code(email: str, code: str, expire_seconds: int = 300):
    """将验证码记录到文件"""
    expire_at = (datetime.utcnow() + timedelta(seconds=expire_seconds)).isoformat()
    record = {"email": email, "code": code, "expire_at": expire_at}
    with lock, open(CODE_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")

def get_code(email: str) -> Optional[str]:
    """从文件获取有效验证码并清理过期记录"""
    now = datetime.utcnow()
    valid_records = []
    found_code = None

    with lock:
        if not CODE_FILE.exists():
            return None
        with open(CODE_FILE, "r+", encoding="utf-8") as f:
            lines = f.readlines()
            f.seek(0)
            f.truncate()
            for line in lines:
                try:
                    rec = json.loads(line.strip())
                    expire_at = datetime.fromisoformat(rec["expire_at"])
                    if expire_at > now:
                        valid_records.append(rec)
                        if rec["email"] == email:
                            found_code = rec["code"]
                except (json.JSONDecodeError, KeyError):
                    continue
            # 回写有效记录
            for rec in valid_records:
                f.write(json.dumps(rec) + "\n")
    return found_code

def delete_code(email: str):
    """删除指定邮箱的验证码"""
    with lock:
        if not CODE_FILE.exists():
            return
        valid_records = []
        with open(CODE_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for line in lines:
            try:
                rec = json.loads(line.strip())
                if rec.get("email") != email:
                    valid_records.append(line)
            except json.JSONDecodeError:
                continue
        with open(CODE_FILE, "w", encoding="utf-8") as f:
            f.writelines(valid_records)

def generate_code(length=6) -> str:
    """生成指定长度的随机数字验证码"""
    return "".join([str(random.randint(0, 9)) for _ in range(length)])

def send_mail(receiver_email: str, code: str):
    """发送邮件"""
    subject = "登录验证码"
    content = f"您的验证码是：{code}，请在5分钟内使用。"
    message = MIMEText(content, "plain", "utf-8")
    message["From"] = formataddr(("深大组队平台", SENDER_EMAIL))
    message["To"] = formataddr(("用户", receiver_email))
    message["Subject"] = Header(subject, "utf-8")

    try:
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, SENDER_PASS)
            server.sendmail(SENDER_EMAIL, [receiver_email], message.as_string())
        print(f"验证码已发送到 {receiver_email}")
    except Exception as e:
        print(f"发送邮件失败: {e}")
        raise HTTPException(status_code=500, detail="邮件服务异常，发送失败")

def send_email_code(db: Session, email_data: EmailRequest):
    """为教师发送邮箱验证码"""
    user = crud_user.get_user_by_email(db, email_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="该邮箱未录入数据库")
    if user.role != 'teacher':
        raise HTTPException(status_code=403, detail="只有教师账号才能使用邮箱登录")
    
    code = generate_code()
    send_mail(email_data.email, code)
    set_code(email_data.email, code)
    return {"message": "验证码已成功发送"}

def verify_email_code(email: str, code: str):
    """验证邮箱验证码"""
    saved_code = get_code(email)
    if not saved_code or saved_code != code:
        raise HTTPException(status_code=400, detail="验证码错误或已过期")
    delete_code(email)  # 验证成功后立即删除
    return True