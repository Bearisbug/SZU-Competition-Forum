"""
app/api/team_endpoints.py (续)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.db.session import get_db
from app.db.models import User, Team
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse
from app.services.team_service import (
    create_new_team,
    list_teams,
    update_team_info,
    disband_team,
    apply_to_team,
    approve_member,
    reject_member,
    leave_team,
    get_team_detail,
    get_all_team_details,
    get_my_captain_teams
)
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/", response_model=TeamResponse)
def create_team_endpoint(
    team_data: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    创建队伍，当前用户自动成为队长
    """
    # 检测队伍名称是否已经存在
    existing_team = db.query(Team).filter(Team.name == team_data.name).first()
    if existing_team:
        raise HTTPException(
            status_code=400,
            detail=f"队伍名称 '{team_data.name}' 已被使用，请选择其他名称。"
        )
    created_team = create_new_team(db, team_data, current_user.id)
    return created_team

@router.get("/", response_model=List[TeamResponse])
def list_teams_endpoint(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取队伍列表，支持分页
    """
    return list_teams(db, skip, limit)

@router.put("/{team_id}", response_model=TeamResponse)
def update_team_info_endpoint(
    team_id: int,
    team_data: TeamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    修改队伍信息并踢出成员，需要队长身份。
    如果提供 remove_member_id，则移除队员。
    """
    updated_team = update_team_info(db, team_id, team_data, current_user.id)
    return updated_team

@router.delete("/{team_id}")
def disband_team_endpoint(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    解散队伍，需要队长身份
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    # 校验队长
    # 在 service 层也会二次校验，这里只演示
    disband_team(db, team)
    return {"msg": "队伍已解散，并已通知所有成员。"}

@router.post("/{team_id}/apply")
def apply_to_team_endpoint(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    申请加入队伍，status = 0，等待队长审核
    """
    apply_to_team(db, team_id, current_user)
    return {"msg": "申请加入队伍成功，等待队长审核。"}

@router.post("/{team_id}/approve/{user_id}")
def approve_member_endpoint(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    队长批准某个成员的加入申请
    """
    approve_member(db, team_id, user_id, current_user.id)
    return {"msg": "成功批准加入请求"}

@router.post("/{team_id}/reject/{user_id}")
def reject_member_endpoint(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    队长拒绝某个成员的加入申请
    """
    reject_member(db, team_id, user_id, current_user.id)
    return {"msg": "成功拒绝加入请求"}

@router.delete("/{team_id}/leave")
def leave_team_endpoint(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    当前用户退出队伍
    """
    leave_team(db, team_id, current_user)
    return {"msg": f"您已成功退出队伍 {team_id}。"}

@router.get("/{team_id}/detail", response_model=dict)
def get_team_detail_endpoint(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取队伍信息及其成员信息
    """
    return get_team_detail(db, team_id)

@router.get("/all/details", response_model=list)
def get_all_team_details_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取所有队伍及其成员信息
    """
    return get_all_team_details(db)

@router.get("/my-captain-teams", response_model=list)
def get_my_captain_teams_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    获取当前用户作为队长的队伍及其成员信息
    """
    return get_my_captain_teams(db, current_user)
