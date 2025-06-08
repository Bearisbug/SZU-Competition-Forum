"""
app/crud/team.py

队伍相关最基本的数据库操作（Create, Read, Update, Delete）。
"""

from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models import Team, TeamMember
from app.schemas.team import TeamCreate, TeamUpdate

def create_team(db: Session, team_data: TeamCreate) -> Team:
    team = Team(
        name=team_data.name,
        description=team_data.description,
        goals=team_data.goals,
        requirements=team_data.requirements,
        max_members=team_data.max_members,
        competition_id=team_data.competition_id,
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

def create_team_member(db: Session, team_id: int, user_id: int) -> TeamMember:
    """
    用户申请加入队伍（待审核）
    """
    team_member = TeamMember(
        team_id=team_id,
        user_id=user_id,
        role="队员",
        status=0  # 待审核
    )
    db.add(team_member)
    db.commit()
    db.refresh(team_member)
    return team_member

def get_team_by_id(db: Session, team_id: int) -> Optional[Team]:
    return db.query(Team).filter(Team.id == team_id).first()

def get_team_list(db: Session, skip: int = 0, limit: int = 10) -> List[Team]:
    return db.query(Team).offset(skip).limit(limit).all()

def update_team(db: Session, team: Team, team_data: TeamUpdate) -> Team:
    if team_data.name is not None:
        team.name = team_data.name
    if team_data.description is not None:
        team.description = team_data.description
    if team_data.goals is not None:
        team.goals = team_data.goals
    if team_data.requirements is not None:
        team.requirements = team_data.requirements
    if hasattr(team_data, "competition_id") and team_data.competition_id is not None:
        team.competition_id = team_data.competition_id

    db.add(team)
    db.commit()
    db.refresh(team)
    return team

def delete_team(db: Session, team: Team):
    db.query(TeamMember).filter(TeamMember.team_id == team.id).delete()
    db.delete(team)
    db.commit()

def get_team_member(db: Session, team_id: int, user_id: int) -> Optional[TeamMember]:
    return db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()

def get_team_member_by_id(db: Session, member_id: int) -> Optional[TeamMember]:
    return db.query(TeamMember).filter(TeamMember.id == member_id).first()

def delete_team_member(db: Session, team_member: TeamMember):
    db.delete(team_member)
    db.commit()

def count_team_members(db: Session, team_id: int) -> int:
    return db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.status == 1
    ).count()

def get_team_members(db: Session, team_id: int) -> List[TeamMember]:
    return db.query(TeamMember).filter(TeamMember.team_id == team_id).all()

def update_team_member_status(db: Session, team_member: TeamMember, status: int):
    team_member.status = status
    db.add(team_member)
    db.commit()
    db.refresh(team_member)

def get_captain(db: Session, team_id: int) -> Optional[TeamMember]:
    return db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.role == "队长"
    ).first()
