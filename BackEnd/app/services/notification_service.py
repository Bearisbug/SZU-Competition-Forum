"""
app/services/notification_service.py

通知相关业务逻辑封装：实际大部分都在 CRUD 里，此处仅做简单包装。
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
import re
from fastapi import HTTPException, status
from app.db.models import Notification, TeamMember
from app.crud.notification import (
    create_notification as crud_create_notification,
    get_notifications_by_user,
    get_notification_by_id,
    delete_notification,
    clear_notifications_by_user
)
from app.schemas.notification import NotificationCreate

def create_notification(db: Session, notification_data: NotificationCreate) -> Notification:
    return crud_create_notification(db, notification_data)

def get_user_notifications(db: Session, user_id: int) -> List[Notification]:
    return get_notifications_by_user(db, user_id)

def delete_user_notification(db: Session, notification_id: int):
    notif = get_notification_by_id(db, notification_id)
    if not notif:
        return

    # 若为“入队申请”且仍处于待审批，则不允许删除
    parsed = _parse_join_request(notif.content)
    if parsed and _has_pending_request(db, parsed[0], parsed[1]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="存在未处理的入队申请，无法删除相关通知"
        )
    delete_notification(db, notif)

def clear_user_notifications(db: Session, user_id: int):
    # 在清空前检查是否包含未处理的入队申请通知
    notifs = get_notifications_by_user(db, user_id)
    for n in notifs:
        parsed = _parse_join_request(n.content)
        if parsed and _has_pending_request(db, parsed[0], parsed[1]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="存在未处理的入队申请，无法清空通知"
            )
    clear_notifications_by_user(db, user_id)


def _parse_join_request(content: str) -> Optional[Tuple[int, int]]:
    """解析加入队伍通知中的 team_id/user_id。返回 (team_id, user_id) 或 None。"""
    # 兼容两种格式：
    # 1) 用户 {name}(ID: {uid}) 申请加入队伍 {team}(ID: {tid})
    m = re.search(r"用户\s*.+?\(ID:\s*(\d+)\)\s*申请加入队伍\s*.+?\(ID:\s*(\d+)\)", content)
    if m:
        user_id = int(m.group(1))
        team_id = int(m.group(2))
        return (team_id, user_id)
    # 2) 用户名为 {name}，用户 ID 为 {uid} 申请加入队伍 {team} (队伍 ID：{tid})
    m = re.search(r"用户名为\s*.+?，\s*用户\s*ID\s*为\s*(\d+)\s*申请加入队伍\s*.+?\(队伍\s*ID[:：]\s*(\d+)\)", content)
    if m:
        user_id = int(m.group(1))
        team_id = int(m.group(2))
        return (team_id, user_id)
    return None


def _has_pending_request(db: Session, team_id: int, user_id: int) -> bool:
    tm = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()
    return bool(tm and tm.status == 0)
