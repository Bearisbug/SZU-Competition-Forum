"""
app/services/notification_service.py

通知相关业务逻辑封装：实际大部分都在 CRUD 里，此处仅做简单包装。
"""

from sqlalchemy.orm import Session
from typing import List
from app.db.models import Notification
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
    if notif:
        delete_notification(db, notif)

def clear_user_notifications(db: Session, user_id: int):
    clear_notifications_by_user(db, user_id)
