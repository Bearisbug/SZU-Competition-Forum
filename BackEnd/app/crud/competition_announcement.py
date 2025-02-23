"""
app/crud/competition_announcement.py

比赛公告相关最基本的数据库操作。
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime

from app.db.models import Competition, CompetitionAnnouncement
from app.schemas.competition import (
    CompetitionAnnouncementCreate,
    CompetitionAnnouncementUpdate
)

def create_announcement(db: Session, competition_id: int, announcement_in: CompetitionAnnouncementCreate):
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="比赛不存在")

    announcement = CompetitionAnnouncement(
        competition_id=competition_id,
        title=announcement_in.title,
        content=announcement_in.content,
        published_at=datetime.utcnow()
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

def get_announcement_by_id(db: Session, announcement_id: int) -> CompetitionAnnouncement:
    announcement = db.query(CompetitionAnnouncement).filter(
        CompetitionAnnouncement.id == announcement_id
    ).first()
    if not announcement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="公告不存在")
    return announcement

def update_announcement(db: Session, announcement_id: int, announcement_in: CompetitionAnnouncementUpdate):
    announcement = get_announcement_by_id(db, announcement_id)
    data = announcement_in.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(announcement, field, value)

    db.commit()
    db.refresh(announcement)
    return announcement

def delete_announcement(db: Session, announcement_id: int):
    announcement = get_announcement_by_id(db, announcement_id)
    db.delete(announcement)
    db.commit()

def list_announcements_of_competition(db: Session, competition_id: int):
    return db.query(CompetitionAnnouncement).filter(
        CompetitionAnnouncement.competition_id == competition_id
    ).order_by(CompetitionAnnouncement.published_at.desc()).all()
