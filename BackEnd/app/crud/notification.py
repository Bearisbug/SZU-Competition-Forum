"""
app/crud/notification.py

通知相关最基本的数据库操作。
"""

from sqlalchemy.orm import Session
from typing import List
from app.db.models import Notification
from app.schemas.notification import NotificationCreate

def create_notification(db: Session, notification_data: NotificationCreate) -> Notification:
    notification = Notification(
        receiver_id=notification_data.receiver_id,
        title=notification_data.title,
        content=notification_data.content
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def get_notifications_by_user(db: Session, user_id: int) -> List[Notification]:
    return db.query(Notification).filter(Notification.receiver_id == user_id).all()

def get_notification_by_id(db: Session, notification_id: int) -> Notification:
    return db.query(Notification).filter(Notification.id == notification_id).first()

def delete_notification(db: Session, notification: Notification):
    db.delete(notification)
    db.commit()

def clear_notifications_by_user(db: Session, user_id: int):
    db.query(Notification).filter(Notification.receiver_id == user_id).delete()
    db.commit()
