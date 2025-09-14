"""
app/api/competition_endpoints.py

比赛相关路由。
"""

from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
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
    get_competition_teams_info, list_competition_levels
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
    """
    创建比赛：仅管理员。保持前端 JSON 返回样式不变（由 Pydantic response_model 保证）。
    """
    competition = create_competition(db, competition_in, current_user.role)
    competition.competition_level = competition.competition_level_ref.zh_CN
    competition.competition_subtype = competition.competition_subtype_ref.zh_CN
    return competition


@router.get("/", response_model=List[Competition])
def list_competitions_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    列出全部比赛
    """
    model_competitions = list_competitions(db)
    schema_competitions = list()
    for model_competition in model_competitions:
        add_schema_competition = model_competition
        add_schema_competition.competition_level = model_competition.competition_level_ref.zh_CN
        add_schema_competition.competition_subtype = model_competition.competition_subtype_ref.zh_CN
        schema_competitions.append(add_schema_competition)

    return schema_competitions

@router.get("/levels")
def list_competition_levels_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    model_levels = list_competition_levels(db)
    schema_levels = list()

    for model_level in model_levels:
        add_schema_level = model_level
        add_schema_level.translation = model_level.zh_CN
        for add_schema_subtype in add_schema_level.subtypes:
            add_schema_subtype.translation = add_schema_subtype.zh_CN

        schema_levels.append(add_schema_level)

    return schema_levels

@router.get("/detail/{competition_id}")
def get_competition_detail_endpoint(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    获取比赛详情（保持现有 JSON 结构：在 Competition 基础上附带 announcements）。
    注：沿用原先的 __dict__ 组合返回，避免破坏前端字段名/结构。
    """
    competition = get_competition_detail_info(db, competition_id)
    competition.competition_level = competition.competition_level_ref.zh_CN
    competition.competition_subtype = competition.competition_subtype_ref.zh_CN
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
    """
    更新比赛：仅管理员
    """
    competition = update_competition_info(db, competition_id, competition_in, current_user.role)
    competition.competition_level = competition.competition_level_ref.zh_CN
    competition.competition_subtype = competition.competition_subtype_ref.zh_CN
    return competition

@router.delete("/{competition_id}")
def delete_competition_endpoint(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    删除比赛：仅管理员。保持前端 JSON 返回样式不变。
    """
    delete_competition_info(db, competition_id, current_user.role)
    return {"msg": "比赛已删除"}

@router.post("/detail/{competition_id}/announcements", response_model=CompetitionAnnouncement)
def create_competition_announcement_endpoint(
    competition_id: int,
    announcement_in: CompetitionAnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    创建比赛公告：保持现有逻辑（不额外限制），以避免改变前端行为。
    """
    return create_competition_announcement(db, competition_id, announcement_in, current_user.role)

@router.delete("/detail/{competition_id}/announcements/{announcement_id}")
def delete_competition_announcement_endpoint(
    competition_id: int,
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    删除比赛公告：保持现有逻辑（不额外限制），以避免改变前端行为。
    """
    delete_competition_announcement(db, competition_id, announcement_id, current_user.role)
    return {"msg": "公告已成功删除"}

@router.post("/{competition_id}/register/{team_id}")
def register_competition_endpoint(
    competition_id: int,
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    报名比赛：队长权限
    """
    registration = register_competition_service(db, competition_id, team_id, current_user)
    return {"msg": "报名成功", "registration_id": registration.id}

@router.get("/{competition_id}/registrations/teams-info", response_model=List[Dict])
def get_competition_teams_info_endpoint(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    获取报名队伍信息及其成员详情
    """
    return get_competition_teams_info(db, competition_id)
