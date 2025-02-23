"""
app/api/competition_endpoints.py

比赛相关路由。
"""

from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User
from app.services.competition_service import (
    create_competition,
    list_competitions,
    get_competition_detail_info,
    update_competition_info,
    delete_competition_info,
    create_competition_announcement,
    delete_competition_announcement,
    register_competition_service,
    get_competition_teams_info
)
from app.services.auth_service import get_current_user
from app.schemas.competition import (
    CompetitionCreate,
    CompetitionUpdate,
    Competition,
    CompetitionAnnouncementCreate,
    CompetitionAnnouncement
)

router = APIRouter()

@router.post("/create", response_model=Competition)
def create_competition_endpoint(
    competition_in: CompetitionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 只有管理员才能创建比赛（示例中注释掉可选逻辑）
    # if current_user.role != "admin":
    #     ...
    return create_competition(db, competition_in)

@router.get("/", response_model=List[Competition])
def list_competitions_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_competitions(db)

@router.get("/detail/{competition_id}")
def get_competition_detail_endpoint(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    competition = get_competition_detail_info(db, competition_id)
    # 仅获取比赛+公告
    return {
        **competition.__dict__,
        "announcements": competition.announcements
    }

@router.put("/update/{competition_id}", response_model=Competition)
def update_competition_endpoint(
    competition_id: int,
    competition_in: CompetitionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_competition_info(db, competition_id, competition_in, current_user.role)

@router.delete("/{competition_id}")
def delete_competition_endpoint(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_competition_info(db, competition_id, current_user.role)
    return {"msg": "比赛已删除"}

@router.post("/detail/{competition_id}/announcements", response_model=CompetitionAnnouncement)
def create_competition_announcement_endpoint(
    competition_id: int,
    announcement_in: CompetitionAnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_competition_announcement(db, competition_id, announcement_in, current_user.role)

@router.delete("/detail/{competition_id}/announcements/{announcement_id}")
def delete_competition_announcement_endpoint(
    competition_id: int,
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_competition_announcement(db, competition_id, announcement_id, current_user.role)
    return {"msg": "公告已成功删除"}

@router.post("/{competition_id}/register/{team_id}")
def register_competition_endpoint(
    competition_id: int,
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    registration = register_competition_service(db, competition_id, team_id, current_user)
    return {"msg": "报名成功", "registration_id": registration.id}

@router.get("/{competition_id}/registrations/teams-info", response_model=List[Dict])
def get_competition_teams_info_endpoint(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_competition_teams_info(db, competition_id)
