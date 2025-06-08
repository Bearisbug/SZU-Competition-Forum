# app/schemas/team.py
from pydantic import BaseModel
from typing import Optional, List

class TeamCreate(BaseModel):
    """
    创建队伍所需数据
    """
    name: str
    description: Optional[str] = None
    goals: Optional[str] = None
    requirements: Optional[str] = None
    max_members: Optional[int] = 5
    competition_id: Optional[int] = None


class TeamUpdate(BaseModel):
    """
    更新队伍信息所需数据
    """
    name: Optional[str] = None
    description: Optional[str] = None
    goals: Optional[str] = None
    requirements: Optional[str] = None
    max_members: Optional[int] = None
    remove_member_id: Optional[int] = None
    competition_id: Optional[int] = None

class TeamMemberBase(BaseModel):
    """
    队伍成员基本信息
    """
    user_id: int
    role: Optional[str] = None
    status: Optional[int] = 0

class TeamResponse(BaseModel):
    """
    队伍信息响应结构
    """
    id: int
    name: str
    description: Optional[str]
    goals: Optional[str]
    requirements: Optional[str]
    max_members: Optional[int]
    competition_id: Optional[int]

    class Config:
        orm_mode = True

class TeamMemberResponse(BaseModel):
    """
    队伍成员信息响应结构
    """
    id: int
    team_id: int
    user_id: int
    role: Optional[str]
    status: int

    class Config:
        orm_mode = True