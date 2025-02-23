"""
app/api/user_endpoints.py

用户相关路由，仅负责请求->调用service->返回结果，不直接编写业务逻辑。
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse, LoginRequest, LoginResponse, UserUpdate
from app.services import auth_service, user_service
from app.services.auth_service import get_current_user
from app.db.models import User

router = APIRouter()

@router.post("/create/", response_model=UserResponse)
def create_user_endpoint(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    创建用户
    """
    db_user = user_service.create_new_user(db, user)
    return db_user

@router.post("/login/", response_model=LoginResponse)
def login_for_access_token(
    login: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    用户登录，返回 Access Token
    """
    access_token = auth_service.authenticate_user(db, login.id, login.password)
    return {"access_token": access_token}

@router.get("/info/{user_id}", response_model=UserResponse)
def get_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    获取用户信息
    """
    return user_service.get_user_info(db, user_id)

@router.put("/info/{user_id}/update", response_model=UserResponse)
def update_user_endpoint(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(auth_service.verify_token)
):
    """
    更新用户信息（需要登录并与 user_id 匹配）
    """
    updated_user = user_service.update_user_info(db, user_id, user, token_data["user_id"])
    return updated_user

@router.get("/articles/{user_id}")
def get_user_articles(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    获取指定用户发布的所有文章
    """
    from app.db.models import Article
    articles = db.query(Article).filter(Article.author_id == user_id).all()
    return articles

@router.get("/teams/{user_id}")
def get_user_teams(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    获取指定用户所在的所有队伍（此处的实现仅演示，用于兼容旧接口）
    """
    from app.db.models import TeamMember, Team, User
    captain_team_ids = db.query(TeamMember.team_id).filter(
        TeamMember.user_id == user_id
    ).all()
    if not captain_team_ids:
        return []
    captain_team_ids = [row[0] for row in captain_team_ids]
    teams = db.query(Team).filter(Team.id.in_(captain_team_ids)).all()

    my_team_details = []
    for team in teams:
        members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()
        member_details = []
        for member in members:
            if member.status == 1:
                user_data = db.query(User).filter(User.id == member.user_id).first()
                if user_data:
                    member_details.append({
                        "id": member.id,
                        "team_id": member.team_id,
                        "user_id": member.user_id,
                        "name": user_data.name,
                        "role": member.role,
                        "position": user_data.grade,
                        "major": user_data.major,
                        "avatarUrl": user_data.avatar_url,
                        "status": member.status
                    })

        my_team_details.append({
            "team": {
                "id": team.id,
                "name": team.name,
                "description": team.description,
                "goals": team.goals,
                "requirements": team.requirements.split(",") if team.requirements else [],
                "max_members": team.max_members,
            },
            "members": member_details
        })

    return my_team_details
