"""
app/services/auth_service.py

与用户认证、授权相关的业务逻辑：JWT token 生成、校验，当前用户获取等。
"""

import jwt
import random
import smtplib
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import json
import threading
from pathlib import Path

from app.db.models import User
from email.mime.text import MIMEText
from email.header import Header
from email.utils import formataddr
from typing import Optional
from app.crud.user import get_user_by_id

from app.core.config import JWT_SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud.user import get_user_by_id
from app.db.session import get_db
from app.schemas.user import LoginRequest, TeacherLoginRequest

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# ========== 发件邮箱配置 ==========
SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 465
SENDER_EMAIL = "1992898402@qq.com"
SENDER_PASS = "rrwrlnkeztxibeff"  #授权码

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    创建 JWT 令牌，默认过期时间在 config 中设定，可通过 expires_delta 指定。
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    密码验证逻辑，此处为了演示，直接进行明文比对。
    若需要更安全，可以使用 passlib 或 bcrypt 等进行哈希验证。
    """
    return plain_password == hashed_password

def authenticate_user(db: Session, user_id: int, password: str) -> str:
    """
    验证用户用户名和密码是否匹配，成功则返回生成的 JWT token。
    """
    db_user = get_user_by_id(db, user_id)
    if not db_user or not verify_password(password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="登录失败，用户名或密码错误"
        )
    # 如果认证成功，创建访问令牌
    token = create_access_token(data={"sub": str(user_id)})
    return token

def verify_token(token: str = Depends(oauth2_scheme)) -> dict:
    """
    通过依赖项的形式自动解析并验证 Token 的有效性。
    返回解码后的 payload(包含sub等信息)。
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        exp = payload.get("exp")
        if exp < datetime.utcnow().timestamp():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token 已过期",
            )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token 中未找到用户信息",
            )
        return {"user_id": user_id}
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无法验证用户身份，Token 无效",
        )

def get_current_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    获取当前登录用户信息，若用户不存在或被删除则抛出 401。
    """
    user_id = token.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 中未找到用户信息",
        )
    user = get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在或已被删除",
        )
    return user

def is_admin(role_or_user) -> bool:
    """
    允许传入 User 实例或 role 字符串，统一判断是否为管理员。
    """
    if hasattr(role_or_user, "role"):  # User 实例
        value = (role_or_user.role or "")
    else:
        value = (role_or_user or "")
    return value.lower() == "admin"

def ensure_admin(role_or_user) -> None:
    """
    不满足管理员时抛出 403。
    """
    if not is_admin(role_or_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限：需要管理员"
        )

CODE_FILE = Path("email_codes.jsonl")
lock = threading.Lock()

def set_code(email: str, code: str, expire_seconds: int = 300):
    expire_at = (datetime.utcnow() + timedelta(seconds=expire_seconds)).isoformat()
    record = {"email": email, "code": code, "expire_at": expire_at}
    with lock, open(CODE_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")

def get_code(email: str):
    now = datetime.utcnow()
    valid_records = []
    found_code = None

    with lock:
        if not CODE_FILE.exists():
            return None
        with open(CODE_FILE, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    rec = json.loads(line.strip())
                except:
                    continue
                expire_at = datetime.fromisoformat(rec["expire_at"])
                if expire_at > now:
                    valid_records.append(rec)
                    if rec["email"] == email:
                        found_code = rec["code"]

        # 覆盖写入（清理过期的）
        with open(CODE_FILE, "w", encoding="utf-8") as f:
            for rec in valid_records:
                f.write(json.dumps(rec) + "\n")

    return found_code

def delete_code(email: str):
    now = datetime.utcnow()
    valid_records = []

    with lock:
        if not CODE_FILE.exists():
            return
        with open(CODE_FILE, "r", encoding="utf-8") as f:
            for line in f:
                rec = json.loads(line.strip())
                expire_at = datetime.fromisoformat(rec["expire_at"])
                if expire_at > now and rec["email"] != email:
                    valid_records.append(rec)

        with open(CODE_FILE, "w", encoding="utf-8") as f:
            for rec in valid_records:
                f.write(json.dumps(rec) + "\n")


# ========== 生成验证码 ==========
def generate_code(length=6):
    return "".join([str(random.randint(0, 9)) for _ in range(length)])

# ========== 发送邮件 ==========
def send_mail(receiver_email, code):
    subject = "你的验证码"
    content = f"您的验证码是：{code}，请在5分钟内使用。"

    message = MIMEText(content, "plain", "utf-8")
    message["From"] = formataddr(("验证码系统", SENDER_EMAIL))
    message["To"] = formataddr(("收件人", receiver_email))
    message["Subject"] = Header(subject, "utf-8")

    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, SENDER_PASS)
        server.sendmail(SENDER_EMAIL, [receiver_email], message.as_string())
        server.quit()
        print("验证码已发送到", receiver_email)
    except Exception as e:
        print("发送失败:", e)

def verify_email_code(email: str, code: str):
    saved_code = get_code(email)
    if not saved_code:
        raise HTTPException(status_code=400, detail="验证码不存在或已过期")
    if saved_code != code:
        raise HTTPException(status_code=400, detail="验证码错误")
    delete_code(email)  # 验证通过删除
    return True

def send_email_code(email: str, db: Session, code_length: int = 6, expire_seconds: int = 300):
    """
    检查邮箱是否存在，若存在则尝试发送验证码
    """
    code = generate_code(code_length)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="邮箱未注册")
    try:
        send_mail(email, code)
        set_code(email, code, expire_seconds)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"发送验证码失败: {e}")

    return {"message": "验证码已发送"}

def login_teacher_for_access_token(db: Session, login: TeacherLoginRequest) -> str:
    """
    教师登录逻辑：
    1. 校验账号+密码
    2. 校验邮箱验证码
    3. 返回 JWT 令牌
    """
    # 1. 账号+密码校验
    db_user = get_user_by_id(db, login.id)
    if not db_user:
        raise HTTPException(status_code=401, detail="用户不存在")
    if db_user.role.lower() != "教师":
        raise HTTPException(status_code=403, detail="非教师账号无法使用该接口")
    if not verify_password(login.password, db_user.password):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    # 2. 验证邮箱验证码
    try:
        verify_email_code(login.email, login.code)  # 成功返回 True，失败会抛 HTTPException
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=f"邮箱验证码错误或已过期: {e.detail}")

    # 3. 生成 JWT
    access_token = create_access_token(data={"sub": str(login.id)})
    return access_token
