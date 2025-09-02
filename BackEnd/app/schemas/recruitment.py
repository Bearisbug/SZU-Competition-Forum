# app/schemas/recruitment.py
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Dict, Optional

class RecruitmentBase(BaseModel):
    teacher_name: str = Field(..., description="老师姓名")
    teacher_avatar_url: Optional[str] = Field(None, description="老师头像 URL")
    institution: Optional[str] = Field(None, description="所属机构")
    project_summary: Optional[str] = Field(None, description="项目简介")
    recruitment_info: Optional[str] = Field(None, description="招聘信息")
    assessment_method: Optional[str] = Field(None, description="考核方式")
    contacts: Dict[str, str] = Field(default_factory=dict, description="联系方式字典")

class RecruitmentCreate(RecruitmentBase):
    # 允许前端自带 card_id；不传则服务端生成
    card_id: Optional[str] = None

class RecruitmentUpdate(BaseModel):
    teacher_name: Optional[str] = None
    teacher_avatar_url: Optional[str] = None
    institution: Optional[str] = None
    project_summary: Optional[str] = None
    recruitment_info: Optional[str] = None
    assessment_method: Optional[str] = None
    contacts: Optional[Dict[str, str]] = None
    card_id: Optional[str] = None  # 允许修改，但需保持唯一

class RecruitmentInDB(BaseModel):
    id: int
    card_id: str
    creator_id: int
    teacher_name: str
    teacher_avatar_url: Optional[str]
    institution: Optional[str]
    project_summary: Optional[str]
    recruitment_info: Optional[str]
    assessment_method: Optional[str]
    contacts: Dict[str, str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
