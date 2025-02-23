# app/schemas/notification.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationCreate(BaseModel):
    """
    创建通知所需数据
    """
    receiver_id: int
    title: str
    content: str

class NotificationResponse(BaseModel):
    """
    通知响应数据结构
    """
    id: int
    receiver_id: int
    title: str
    content: str
    timestamp: datetime

    class Config:
        orm_mode = True