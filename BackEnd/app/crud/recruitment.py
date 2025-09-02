# app/crud/recruitment.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import uuid4

from app.db.models import ProjectRecruitment
from app.schemas.recruitment import RecruitmentCreate, RecruitmentUpdate

def _ensure_card_id(db: Session, card_id: str | None) -> str:
    cid = card_id or uuid4().hex
    existed = db.query(ProjectRecruitment).filter(ProjectRecruitment.card_id == cid).first()
    if existed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="card_id 已存在")
    return cid

def create_recruitment(db: Session, data: RecruitmentCreate, creator_id: int) -> ProjectRecruitment:
    cid = _ensure_card_id(db, data.card_id)
    obj = ProjectRecruitment(
        card_id=cid,
        creator_id=creator_id,
        teacher_name=data.teacher_name,
        teacher_avatar_url=data.teacher_avatar_url,
        institution=data.institution,
        project_summary=data.project_summary,
        recruitment_info=data.recruitment_info,
        assessment_method=data.assessment_method,
        contacts=data.contacts or {},
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def get_recruitment_by_id(db: Session, rid: int) -> ProjectRecruitment:
    obj = db.query(ProjectRecruitment).filter(ProjectRecruitment.id == rid).first()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="招聘信息不存在")
    return obj

def get_recruitment_by_card_id(db: Session, card_id: str) -> ProjectRecruitment | None:
    return db.query(ProjectRecruitment).filter(ProjectRecruitment.card_id == card_id).first()

def list_recruitments(db: Session) -> list[ProjectRecruitment]:
    return db.query(ProjectRecruitment).order_by(ProjectRecruitment.created_at.desc()).all()

def update_recruitment(db: Session, rid: int, data: RecruitmentUpdate) -> ProjectRecruitment:
    obj = get_recruitment_by_id(db, rid)

    payload = data.dict(exclude_unset=True)
    if "card_id" in payload and payload["card_id"] and payload["card_id"] != obj.card_id:
        # 唯一性校验
        existed = get_recruitment_by_card_id(db, payload["card_id"])
        if existed and existed.id != rid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="card_id 已被占用")
        obj.card_id = payload.pop("card_id")

    for k, v in payload.items():
        setattr(obj, k, v)

    db.commit()
    db.refresh(obj)
    return obj

def delete_recruitment(db: Session, rid: int) -> None:
    obj = get_recruitment_by_id(db, rid)
    db.delete(obj)
    db.commit()
