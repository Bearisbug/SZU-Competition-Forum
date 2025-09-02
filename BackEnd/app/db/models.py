"""
app/db/models.py

定义数据库模型。使用 SQLAlchemy 的 ORM 模型。
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

from app.db.session import engine

Base = declarative_base()


class User(Base):
    """
    用户表
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    password = Column(String)
    name = Column(String, index=True)
    email = Column(String, index=True)
    avatar_url = Column(String, index=True)
    grade = Column(String, index=True)
    major = Column(String, index=True)
    role = Column(String, index=True)  # 预留用户在系统中的角色
    notifications = relationship("Notification", back_populates="receiver")


class Team(Base):
    """
    队伍表
    """
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    goals = Column(String, index=True)
    requirements = Column(String, index=True)
    max_members = Column(Integer, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"), nullable=True, index=True)
    competition = relationship("Competition", backref="teams")


class TeamMember(Base):
    """
    队伍成员表：
    - role: 用户在队伍中的角色，如“队长”、“队员”等
    - status: -1: 拒绝, 0: 待审核, 1: 已加入
    """
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, index=True)
    status = Column(Integer, index=True)


class Notification(Base):
    """
    系统通知表：
    - 每条通知包含标题、内容、时间戳，以及接收者ID
    """
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    receiver = relationship("User", back_populates="notifications")


class Article(Base):
    """
    文章表：
    - id: 文章 ID（自增主键）
    - author_id: 文章作者的用户 ID
    - title: 文章标题
    - summary: 文章简介
    - content: 文章内容
    - cover_image: 文章封面图 URL
    - category: 文章分类
    - view_count: 浏览量
    - created_at: 创建时间
    - post_type: 帖子类型
    """
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    summary = Column(String, index=True)
    content = Column(String)
    cover_image = Column(String, index=True)
    category = Column(String, index=True)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    post_type = Column(String, default="share", index=True)

    author = relationship("User", backref="articles")


class Competition(Base):
    """
    比赛表：
    - sign_up_start_time, sign_up_end_time: 报名时间
    - competition_start_time, competition_end_time: 比赛时间
    - details: 比赛详情
    - organizer: 主办方
    - competition_type: 比赛类型
    - competition_level: 比赛级别
    - competition_subtype: 比赛子类
    - cover_image: 比赛封面图
    - announcements: 比赛公告关联
    """
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sign_up_start_time = Column(DateTime, nullable=False)
    sign_up_end_time = Column(DateTime, nullable=False)
    competition_start_time = Column(DateTime, nullable=False)
    competition_end_time = Column(DateTime, nullable=False)

    details = Column(String, nullable=True)
    organizer = Column(String, index=True, nullable=True)
    competition_type = Column(String, index=True, nullable=True)
    competition_level = Column(String, index=True, nullable=True)
    competition_subtype = Column(String, index=True, nullable=True)
    cover_image = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    registrations = relationship("CompetitionRegistration", back_populates="competition")
    announcements = relationship("CompetitionAnnouncement", back_populates="competition")


class CompetitionRegistration(Base):
    """
    比赛报名中间表：
    - 记录了哪个队伍报名了哪个比赛
    """
    __tablename__ = "competition_registrations"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    competition = relationship("Competition", back_populates="registrations")
    team = relationship("Team")


class CompetitionAnnouncement(Base):
    """
    比赛公告表
    """
    __tablename__ = "competition_announcements"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    published_at = Column(DateTime, default=datetime.utcnow)

    competition = relationship("Competition", back_populates="announcements")


class ProjectRecruitment(Base):
    """
    老师项目招聘卡片
    - card_id: 业务侧卡片唯一标识（便于前端卡片化展示/路由）
    - creator_id: 创建者用户ID（用于权限控制）
    - teacher_name: 老师姓名
    - teacher_avatar_url: 老师头像
    - institution: 老师所属机构
    - project_summary: 项目简介
    - recruitment_info: 招聘信息
    - assessment_method: 考核方式
    - contacts: 联系方式（字典，示例：{"email":"xxx@xx.com","wechat":"io-xyz"}）
    """
    __tablename__ = "project_recruitments"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(String, unique=True, index=True, nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    teacher_name = Column(String, index=True, nullable=False)
    teacher_avatar_url = Column(String, nullable=True)
    institution = Column(String, index=True, nullable=True)
    project_summary = Column(String, nullable=True)
    recruitment_info = Column(String, nullable=True)
    assessment_method = Column(String, nullable=True)

    contacts = Column(JSON, nullable=False, default={})  # SQLite 下 JSON 会以 TEXT 存储

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", backref="recruitments")

if __name__ == "__main__":
    Base.metadata.create_all(engine)
