"""
app/api/notification_endpoints.py

通知相关路由。
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.notification import NotificationResponse
from app.services.notification_service import (
    get_user_notifications,
    delete_user_notification,
    clear_user_notifications
)
from app.services.auth_service import get_current_user
from app.db.models import User

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def get_notifications_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户所有通知
    """
    return get_user_notifications(db, current_user.id)

@router.delete("/{notification_id}")
def delete_notification_endpoint(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    删除单条通知
    """
    delete_user_notification(db, notification_id)
    return {"msg": f"通知 {notification_id} 已删除"}

@router.delete("/clear/all")
def clear_all_notifications_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    清空当前用户所有通知
    """
    clear_user_notifications(db, current_user.id)
    return {"msg": "已清空所有通知"}
