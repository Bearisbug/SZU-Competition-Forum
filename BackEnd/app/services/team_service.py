"""
app/services/team_service.py

队伍相关业务逻辑。
- 创建队伍并自动将创建者设为队长
- 更新队伍信息
- 解散队伍
- 申请加入队伍、审批、拒绝
- 退出队伍等
"""
from sqlalchemy.orm import Session
from typing import List, Dict
from fastapi import HTTPException, status

from app.crud.team import (
    create_team,
    create_team_member,
    get_team_by_id,
    get_team_list,
    update_team,
    delete_team,
    get_team_member,
    get_team_member_by_id,
    delete_team_member,
    count_team_members,
    get_team_members,
    update_team_member_status,
    get_captain
)
from app.crud.notification import create_notification
from app.schemas.team import TeamCreate, TeamUpdate
from app.schemas.notification import NotificationCreate
from app.db.models import Team, TeamMember, User


def create_new_team(db: Session, team_data: TeamCreate, creator_id: int) -> Team:
    """
    创建队伍并自动将创建者设为队长
    """
    # 创建队伍
    team = create_team(db, team_data)
    # 创建者自动成为队长
    team_member = TeamMember(
        team_id=team.id,
        user_id=creator_id,
        role="队长",
        status=1  # 队长默认直接加入
    )
    db.add(team_member)
    db.commit()
    db.refresh(team_member)
    return team

def list_teams(db: Session, skip: int, limit: int) -> List[Team]:
    return get_team_list(db, skip, limit)

def update_team_info(db: Session, team_id: int, team_data: TeamUpdate, current_user_id: int):
    """
    修改队伍信息并可移除成员，需要队长权限。如果提供 remove_member_id，则踢出该成员。
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    # 判断是否队长
    captain_member = get_team_member(db, team_id, current_user_id)
    if not captain_member or captain_member.role != "队长":
        raise HTTPException(status_code=403, detail="无权操作，需要队长权限")

    old_name = team.name

    # 如果要移除成员
    if team_data.remove_member_id is not None:
        target_member = get_team_member_by_id(db, team_data.remove_member_id)
        if not target_member or target_member.team_id != team_id:
            raise HTTPException(status_code=404, detail="要移除的成员不存在或不在队伍中")

        if target_member.user_id == current_user_id:
            raise HTTPException(status_code=400, detail="队长不能将自己踢出队伍")

        delete_team_member(db, target_member)

        # 通知被移除的成员
        notification_data = NotificationCreate(
            receiver_id=target_member.user_id,
            title="您被移出了队伍",
            content=f"您已被移出队伍 {team.name}。"
        )
        create_notification(db, notification_data)

    # 判断是否修改了队伍名称
    if team_data.name and team_data.name != old_name:
        update_team(db, team, team_data)
        # 通知所有队员队伍名称变更
        team_members = get_team_members(db, team_id)
        for member in team_members:
            notification_data = NotificationCreate(
                receiver_id=member.user_id,
                title="队伍名称已更新",
                content=f"队伍 {old_name} 的名称已被更新为 {team_data.name}。"
            )
            create_notification(db, notification_data)

    # 更新其他信息
    updated_team = update_team(db, team, team_data)
    return updated_team

def disband_team(db: Session, team: Team):
    """
    解散队伍并通知所有成员
    """
    members = get_team_members(db, team.id)
    delete_team(db, team)
    for member in members:
        notification_data = NotificationCreate(
            receiver_id=member.user_id,
            title="队伍解散通知",
            content=f"您所在的队伍（ID: {team.id}, 名称: {team.name}）已被解散。"
        )
        create_notification(db, notification_data)

def apply_to_team(db: Session, team_id: int, current_user: User):
    """
    用户申请加入队伍
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    # 检查用户是否已是成员或已在待审核
    existing_member = get_team_member(db, team_id, current_user.id)
    if existing_member:
        raise HTTPException(status_code=400, detail="你已经申请或加入该队伍")

    create_team_member(db, team_id, current_user.id)

    captain = get_captain(db, team_id)
    if captain:
        notification_data = NotificationCreate(
            receiver_id=captain.user_id,
            title="新的队伍申请",
            content=f"用户 {current_user.name}(ID: {current_user.id}) 申请加入队伍 {team.name}(ID: {team.id})"
        )
        create_notification(db, notification_data)

def approve_member(db: Session, team_id: int, user_id: int, current_user_id: int):
    """
    队长批准某个成员加入队伍
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    # 验证队长权限
    captain_member = get_team_member(db, team_id, current_user_id)
    if not captain_member or captain_member.role != "队长":
        raise HTTPException(status_code=403, detail="无权操作，需要队长权限")

    apply_member = get_team_member(db, team_id, user_id)
    if not apply_member or apply_member.status != 0:
        raise HTTPException(status_code=400, detail="该成员没有待审批请求")

    # 检查队伍是否满员
    current_member_count = count_team_members(db, team_id)
    if current_member_count >= team.max_members:
        update_team_member_status(db, apply_member, -1)
        raise HTTPException(status_code=400, detail="队伍已满，无法加入")

    update_team_member_status(db, apply_member, 1)

    # 通知
    notification_data = NotificationCreate(
        receiver_id=user_id,
        title="加入申请已通过",
        content=f"您加入队伍 {team.name} 的申请已被批准。"
    )
    create_notification(db, notification_data)

def reject_member(db: Session, team_id: int, user_id: int, current_user_id: int):
    """
    队长拒绝某个成员加入队伍
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    # 验证队长
    captain_member = get_team_member(db, team_id, current_user_id)
    if not captain_member or captain_member.role != "队长":
        raise HTTPException(status_code=403, detail="无权操作，需要队长权限")

    apply_member = get_team_member(db, team_id, user_id)
    if not apply_member or apply_member.status != 0:
        raise HTTPException(status_code=400, detail="该成员没有待审批请求")

    update_team_member_status(db, apply_member, -1)

    # 通知
    notification_data = NotificationCreate(
        receiver_id=user_id,
        title="加入申请已被拒绝",
        content=f"您加入队伍 {team.name} 的申请已被拒绝。"
    )
    create_notification(db, notification_data)

def leave_team(db: Session, team_id: int, current_user: User):
    """
    用户退出队伍，队长无法主动退出
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    team_member = get_team_member(db, team_id, current_user.id)
    if not team_member:
        raise HTTPException(status_code=400, detail="你不在该队伍中")

    if team_member.role == "队长":
        raise HTTPException(status_code=400, detail="队长无法主动退出，请先解散队伍")

    delete_team_member(db, team_member)

    # 通知其他成员
    members = get_team_members(db, team_id)
    for member in members:
        notification_data = NotificationCreate(
            receiver_id=member.user_id,
            title="队员离队通知",
            content=f"队员 {current_user.name} 已退出队伍 {team.name}。"
        )
        create_notification(db, notification_data)

def get_team_detail(db: Session, team_id: int) -> Dict:
    """
    获取队伍信息及其成员信息
    """
    team = get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="队伍不存在")

    members = get_team_members(db, team_id)
    member_details = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        if user:
            member_details.append({
                "id": member.id,
                "team_id": member.team_id,
                "user_id": member.user_id,
                "name": user.name,
                "role": member.role,
                "position": user.grade,
                "major": user.major,
                "avatarUrl": user.avatar_url,
                "status": member.status
            })

    result = {
        "team": {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "goals": team.goals,
            "requirements": team.requirements.split(",") if team.requirements else [],
            "max_members": team.max_members,
        },
        "members": member_details
    }
    return result

def get_all_team_details(db: Session) -> List[Dict]:
    """
    获取所有队伍及其成员信息（仅 status=1 的队员）
    """
    teams = get_team_list(db, 0, 999999)  # 随意大数或其他分页策略
    all_team_details = []

    for team in teams:
        members = get_team_members(db, team.id)
        member_details = []
        for member in members:
            if member.status == 1:
                user = db.query(User).filter(User.id == member.user_id).first()
                if user:
                    member_details.append({
                        "id": member.id,
                        "team_id": member.team_id,
                        "user_id": member.user_id,
                        "name": user.name,
                        "role": member.role,
                        "position": user.grade,
                        "major": user.major,
                        "avatarUrl": user.avatar_url,
                        "status": member.status
                    })

        all_team_details.append({
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

    return all_team_details

def get_my_captain_teams(db: Session, current_user: User) -> List[Dict]:
    """
    获取当前用户作为队长的队伍及其成员信息（status=1）
    """
    from app.db.models import TeamMember, Team
    captain_team_ids = db.query(TeamMember.team_id).filter(
        TeamMember.user_id == current_user.id,
        TeamMember.role == "队长"
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
                user = db.query(User).filter(User.id == member.user_id).first()
                if user:
                    member_details.append({
                        "id": member.id,
                        "team_id": member.team_id,
                        "user_id": member.user_id,
                        "name": user.name,
                        "role": member.role,
                        "position": user.grade,
                        "major": user.major,
                        "avatarUrl": user.avatar_url,
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
