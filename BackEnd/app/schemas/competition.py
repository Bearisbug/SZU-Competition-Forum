# app/schemas/competition.py

from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

# ================== 比赛相关模型 ===================
class CompetitionBase(BaseModel):
    name: str
    sign_up_start_time: datetime
    sign_up_end_time: datetime
    competition_start_time: datetime
    competition_end_time: datetime
    details: Optional[str] = None
    organizer: Optional[str] = None
    competition_type: Optional[str] = None
    cover_image: Optional[str] = None

class CompetitionCreate(CompetitionBase):
    pass

class CompetitionUpdate(BaseModel):
    """
    更新比赛时前端可能只传部分字段
    """
    name: Optional[str] = None
    sign_up_start_time: Optional[datetime] = None
    sign_up_end_time: Optional[datetime] = None
    competition_start_time: Optional[datetime] = None
    competition_end_time: Optional[datetime] = None
    details: Optional[str] = None
    organizer: Optional[str] = None
    competition_type: Optional[str] = None
    cover_image: Optional[str] = None

class CompetitionInDBBase(CompetitionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Competition(CompetitionInDBBase):
    """
    返回给前端的比赛信息
    """
    pass


# ================== 比赛公告相关模型 ===================
class CompetitionAnnouncementBase(BaseModel):
    title: str
    content: str

class CompetitionAnnouncementCreate(CompetitionAnnouncementBase):
    """
    新建公告时用
    """
    pass

class CompetitionAnnouncementUpdate(BaseModel):
    """
    更新公告时用
    """
    title: Optional[str] = None
    content: Optional[str] = None

class CompetitionAnnouncementInDBBase(CompetitionAnnouncementBase):
    id: int
    published_at: datetime

    class Config:
        orm_mode = True

class CompetitionAnnouncement(CompetitionAnnouncementInDBBase):
    """
    返回给前端使用的公告模型
    """
    pass

# ================== 用于返回比赛时，额外包含的字段 ===================
class TeamBasicInfo(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    goals: Optional[str] = None
    requirements: Optional[str] = None
    max_members: Optional[int] = None

    class Config:
        orm_mode = True

class CompetitionWithTeams(CompetitionInDBBase):
    registered_teams: List[TeamBasicInfo] = []
    announcements: List[CompetitionAnnouncement] = []  # 返回公告列表

class CompetitionWithAnnouncements(CompetitionInDBBase):
    announcements: List[CompetitionAnnouncement] = []