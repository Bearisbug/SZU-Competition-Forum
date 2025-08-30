# app/services/recruitment_service.py
from sqlalchemy.orm import Session
from app.schemas.recruitment import RecruitmentCreate, RecruitmentUpdate
from app.db.models import ProjectRecruitment
from app.crud.recruitment import (
    create_recruitment as crud_create,
    update_recruitment as crud_update,
    delete_recruitment as crud_delete,
    get_recruitment_by_id as crud_get,
    list_recruitments as crud_list,
)
from app.services.auth_service import ensure_admin  # 统一管理员校验

def create_recruitment(db: Session, data: RecruitmentCreate, role_or_user) -> ProjectRecruitment:
    ensure_admin(role_or_user)
    return crud_create(db, data)

def update_recruitment(db: Session, rid: int, data: RecruitmentUpdate, role_or_user) -> ProjectRecruitment:
    ensure_admin(role_or_user)
    return crud_update(db, rid, data)

def delete_recruitment(db: Session, rid: int, role_or_user) -> None:
    ensure_admin(role_or_user)
    crud_delete(db, rid)

def get_recruitment_detail(db: Session, rid: int) -> ProjectRecruitment:
    return crud_get(db, rid)

def list_recruitments(db: Session) -> list[ProjectRecruitment]:
    return crud_list(db)
