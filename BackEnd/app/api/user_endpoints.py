"""
app/api/user_endpoints.py

用户相关路由，仅负责请求->调用service->返回结果，不直接编写业务逻辑。
"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import (
    UserResponse, LoginResponse, UserUpdate,
    StudentRegisterRequest, StudentLoginRequest, TeacherLoginRequest, EmailRequest
)
from app.services import auth_service, user_service
from app.db.models import User
from app.core.logging_config import log_user_login

router = APIRouter()

# --- 认证与授权 ---

@router.post("/register/student", response_model=UserResponse, summary="学生注册")
def register_student_endpoint(
    student_data: StudentRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    学生注册接口。学号必须已存在于数据库中，且密码未设置。
    """
    db_user = auth_service.register_student(db, student_data)
    return db_user

@router.post("/login/student", response_model=LoginResponse, summary="学生或管理员登录")
def login_student_endpoint(
    login_data: StudentLoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    学生或管理员使用ID和密码登录。
    """
    client_ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "")
    try:
        access_token = auth_service.authenticate_user_by_id(db, login_data)
        user = db.query(User).filter(User.id == login_data.id).first()
        if user:
            log_user_login(user.id, user.name, client_ip, user_agent, success=True)
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        log_user_login(login_data.id, f"ID:{login_data.id}", client_ip, user_agent, success=False)
        raise e

@router.post("/login/teacher", response_model=LoginResponse, summary="教师登录")
def login_teacher_endpoint(
    login_data: TeacherLoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    教师使用邮箱和验证码登录。
    """
    client_ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent", "")
    user = db.query(User).filter(User.email == login_data.email).first()
    user_id = user.id if user else "unknown"
    username = user.name if user else login_data.email
    try:
        access_token = auth_service.authenticate_teacher(db, login_data)
        if user:
            log_user_login(user_id, username, client_ip, user_agent, success=True)
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        log_user_login(user_id, username, client_ip, user_agent, success=False)
        raise e

@router.post("/send-email-code", summary="发送教师登录验证码")
def send_email_code_endpoint(
    email_data: EmailRequest,
    db: Session = Depends(get_db)
):
    """
    为教师登录发送邮箱验证码。邮箱必须是已录入的教师邮箱。
    """
    return auth_service.send_email_code(db, email_data)


# --- 用户信息管理 ---

@router.get("/info/{user_id}", response_model=UserResponse, summary="获取用户信息")
def get_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    获取指定ID的用户信息。
    """
    return user_service.get_user_info(db, user_id)

@router.put("/info/update", response_model=UserResponse, summary="更新当前用户信息")
def update_current_user_endpoint(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_service.get_current_user)
):
    """
    更新当前登录用户的信息。
    """
    updated_user = user_service.update_user_info(db, current_user.id, user_update)
    return updated_user

@router.get("/me", response_model=UserResponse, summary="获取当前用户信息")
def read_users_me(current_user: User = Depends(auth_service.get_current_user)):
    """
    获取当前登录用户的信息。
    """
    return current_user

# --- 辅助函数 ---

def get_client_ip(request: Request) -> str:
    """获取客户端真实IP地址"""
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    x_real_ip = request.headers.get("X-Real-IP")
    if x_real_ip:
        return x_real_ip
    return request.client.host if request.client else "unknown"

# --- 其他关联数据接口 ---

@router.get("/articles/{user_id}", summary="获取用户发布的文章")
def get_user_articles(user_id: int, db: Session = Depends(get_db)):
    from app.db.models import Article
    return db.query(Article).filter(Article.author_id == user_id).all()

@router.get("/teams/{user_id}", summary="获取用户所在的队伍")
def get_user_teams(user_id: int, db: Session = Depends(get_db)):
    from app.db.models import TeamMember, Team
    team_memberships = db.query(TeamMember).filter(TeamMember.user_id == user_id, TeamMember.status == 1).all()
    team_ids = [tm.team_id for tm in team_memberships]
    if not team_ids:
        return []
    teams = db.query(Team).filter(Team.id.in_(team_ids)).all()
    return teams