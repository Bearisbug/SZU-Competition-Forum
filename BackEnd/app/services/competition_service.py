"""
app/services/competition_service.py

比赛相关业务逻辑，包含：
- 创建比赛（仅管理员）
- 更新/删除比赛（仅管理员）
- 获取比赛详情（包括公告）
- 报名比赛（队长）
- 获取比赛报名队伍及其成员信息
- 创建/删除比赛公告（保持现有逻辑：不额外限制）
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from app.db.models import (
    Competition, CompetitionAnnouncement, CompetitionRegistration,
    TeamMember, Team, User
)
from app.crud.competition import (
    create_competition as crud_create_competition,
    list_all_competitions,
    get_competition_by_id,
    update_competition as crud_update_competition,
    delete_competition,
    register_competition,
    get_competition_teams
)
from app.crud.competition_announcement import (
    create_announcement,
    delete_announcement
)
from app.schemas.competition import (
    CompetitionCreate,
    CompetitionUpdate,
    CompetitionAnnouncementCreate
)

# 统一的管理员判断，请尽量使用服务层的校验，端点层做“显示逻辑/早失败”即可。
ADMIN_ROLE = "admin"


def _ensure_admin_by_role(role: str) -> None:
    if (role or "").lower() != ADMIN_ROLE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限：需要管理员"
        )


def create_competition(db: Session, competition_in: CompetitionCreate, current_user_role: str) -> Competition:
    """
    创建比赛：仅管理员可用
    """
    _ensure_admin_by_role(current_user_role)
    return crud_create_competition(db, competition_in)

def list_competitions(db: Session) -> List[Competition]:
    return list_all_competitions(db)

def get_competition_detail_info(db: Session, competition_id: int) -> Competition:
    """
    获取比赛详情及其公告。保持现有返回结构不变，由路由层组装。
    """
    competition = get_competition_by_id(db, competition_id)
    return competition

def update_competition_info(db: Session, competition_id: int, competition_in: CompetitionUpdate, current_user_role: str):
    """
    更新比赛：仅管理员
    """
    _ensure_admin_by_role(current_user_role)
    return crud_update_competition(db, competition_id, competition_in)

def delete_competition_info(db: Session, competition_id: int, current_user_role: str):
    """
    删除比赛：仅管理员
    """
    _ensure_admin_by_role(current_user_role)
    delete_competition(db, competition_id)

def create_competition_announcement(db: Session, competition_id: int, announcement_in: CompetitionAnnouncementCreate, current_user_role: str):
    """
    创建比赛公告：仅管理员
    """
    _ensure_admin_by_role(current_user_role)
    return create_announcement(db, competition_id, announcement_in)

def delete_competition_announcement(db: Session, competition_id: int, announcement_id: int, current_user_role: str):
    """
    删除比赛公告：仅管理员
    """
    _ensure_admin_by_role(current_user_role)
    delete_announcement(db, announcement_id)

def register_competition_service(db: Session, competition_id: int, team_id: int, current_user: User):
    """
    用户选择队伍报名比赛，需要队长身份
    """
    is_captain = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id,
        TeamMember.team_id == team_id,
        TeamMember.role == "队长"
    ).first()
    if not is_captain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="您不是该队伍的队长，无法报名"
        )

    # 检查是否已报名
    existing_reg = db.query(CompetitionRegistration).filter(
        CompetitionRegistration.competition_id == competition_id,
        CompetitionRegistration.team_id == team_id
    ).first()
    if existing_reg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该队伍已报名此比赛，请勿重复报名"
        )

    registration = register_competition(db, competition_id, team_id)
    return registration

def get_competition_teams_info(db: Session, competition_id: int) -> List[Dict]:
    """
    获取某比赛的报名队伍信息及其成员详细信息
    """
    competition = get_competition_by_id(db, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="比赛不存在")

    teams = get_competition_teams(db, competition_id)
    if not teams:
        return []

    result = []
    for team in teams:
        members = db.query(TeamMember).filter(
            TeamMember.team_id == team.id,
            TeamMember.status == 1
        ).all()
        member_details = []
        for member in members:
            user = db.query(User).filter(User.id == member.user_id).first()
            if user:
                member_details.append({
                    "name": user.name,
                    "grade": user.grade,
                    "major": user.major,
                    "email": user.email
                })
        result.append({
            "team_id": team.id,
            "team_name": team.name,
            "members": member_details
        })
    return result
