"""
app/crud/competition.py

比赛相关最基本的数据库操作。
"""

from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from typing import List
from app.db.models import Competition, CompetitionRegistration, Team
from app.schemas.competition import CompetitionCreate, CompetitionUpdate

def create_competition(db: Session, competition_in: CompetitionCreate) -> Competition:
    competition = Competition(**competition_in.dict())
    db.add(competition)
    db.commit()
    db.refresh(competition)
    return competition

def get_competition_by_id(db: Session, competition_id: int) -> Competition:
    competition = (db.query(Competition)
                    .options(joinedload(Competition.announcements))
                    .filter(Competition.id == competition_id).first())
    if not competition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="比赛不存在"
        )
    return competition

def update_competition(db: Session, competition_id: int, competition_in: CompetitionUpdate) -> Competition:
    competition = get_competition_by_id(db, competition_id)
    update_data = competition_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(competition, field, value)
    db.commit()
    db.refresh(competition)
    return competition

def delete_competition(db: Session, competition_id: int):
    competition = get_competition_by_id(db, competition_id)
    db.delete(competition)
    db.commit()

def list_all_competitions(db: Session) -> List[Competition]:
    return (db.query(Competition).all())

def register_competition(db: Session, competition_id: int, team_id: int) -> CompetitionRegistration:
    registration = CompetitionRegistration(
        competition_id=competition_id,
        team_id=team_id
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)
    return registration

def get_competition_teams(db: Session, competition_id: int) -> List[Team]:
    registrations = db.query(CompetitionRegistration).filter(
        CompetitionRegistration.competition_id == competition_id
    ).all()
    team_ids = [r.team_id for r in registrations]
    teams = db.query(Team).filter(Team.id.in_(team_ids)).all()
    return teams
