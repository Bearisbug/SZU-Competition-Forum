# app/api/recruitment_endpoints.py
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import User
from app.schemas.recruitment import RecruitmentCreate, RecruitmentUpdate, RecruitmentInDB
from app.services.recruitment_service import (
    create_recruitment as svc_create,
    update_recruitment as svc_update,
    delete_recruitment as svc_delete,
    get_recruitment_detail as svc_detail,
    list_recruitments as svc_list,
)
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/create", response_model=RecruitmentInDB)
def create_recruitment_endpoint(
    payload: RecruitmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    创建招聘卡片（仅管理员）
    """
    return svc_create(db, payload, current_user)

@router.put("/update/{recruitment_id}", response_model=RecruitmentInDB)
def update_recruitment_endpoint(
    recruitment_id: int,
    payload: RecruitmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    修改招聘卡片（仅管理员）
    """
    return svc_update(db, recruitment_id, payload, current_user)

@router.delete("/{recruitment_id}")
def delete_recruitment_endpoint(
    recruitment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    删除招聘卡片（仅管理员）
    """
    svc_delete(db, recruitment_id, current_user)
    return {"msg": "招聘信息已删除"}

@router.get("/detail/{recruitment_id}", response_model=RecruitmentInDB)
def get_recruitment_detail_endpoint(
    recruitment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    获取招聘卡片详情（任意登录用户可查）
    """
    return svc_detail(db, recruitment_id)

@router.get("/", response_model=List[RecruitmentInDB])
def list_recruitments_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    获取招聘卡片列表（任意登录用户可查）
    """
    return svc_list(db)
