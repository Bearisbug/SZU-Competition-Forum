# app/services/recruitment_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.recruitment import RecruitmentCreate, RecruitmentUpdate
from app.db.models import ProjectRecruitment, User
from app.crud.recruitment import (
    create_recruitment as crud_create,
    update_recruitment as crud_update,
    delete_recruitment as crud_delete,
    get_recruitment_by_id as crud_get,
    list_recruitments as crud_list,
)
from app.services.auth_service import ensure_admin  # 统一管理员校验

def create_recruitment(db: Session, data: RecruitmentCreate, current_user: User) -> ProjectRecruitment:
    # 允许管理员和教师发布招聘
    user_role = (current_user.role or "").lower()
    
    if user_role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限：需要管理员或教师权限"
        )
    return crud_create(db, data, current_user.id)

def update_recruitment(db: Session, rid: int, data: RecruitmentUpdate, current_user: User) -> ProjectRecruitment:
    # 获取招募信息
    recruitment = crud_get(db, rid)
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="招募信息不存在"
        )
    
    user_role = (current_user.role or "").lower()
    
    # 管理员可以修改所有招募信息，教师只能修改自己创建的
    if user_role == "admin" or recruitment.creator_id == current_user.id:
        return crud_update(db, rid, data)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限：只能修改自己发布的招募信息"
        )

def delete_recruitment(db: Session, rid: int, current_user: User) -> None:
    # 获取招募信息
    recruitment = crud_get(db, rid)
    if not recruitment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="招募信息不存在"
        )
    
    user_role = (current_user.role or "").lower()
    
    # 管理员可以删除所有招募信息，教师只能删除自己创建的
    if user_role == "admin" or recruitment.creator_id == current_user.id:
        crud_delete(db, rid)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="无权限：只能删除自己发布的招募信息"
        )

def get_recruitment_detail(db: Session, rid: int) -> ProjectRecruitment:
    return crud_get(db, rid)

def list_recruitments(db: Session) -> list[ProjectRecruitment]:
    return crud_list(db)
