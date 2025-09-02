"""
app/crud/user.py

只负责最基础的数据库操作(CRUD)。不包含复杂业务逻辑。
"""

from sqlalchemy.orm import Session
from app.db.models import User

def create_user(db: Session, user_id: int, password: str) -> User:
    db_user = User(
        id=user_id,
        password=password,
        name="未定义",
        email="未定义",
        avatar_url="uploads/images/default_avatar.png",
        grade="未定义",
        major="未定义",
        role="学生",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

def update_user(db: Session,
                user_id: int,
                name: str = "未定义",
                email: str = "未定义",
                avatar_url: str = "未定义",
                grade: str = "未定义",
                major: str = "未定义",
                role: str = "未定义") -> User:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.name = name
        db_user.email = email
        db_user.avatar_url = avatar_url
        db_user.grade = grade
        db_user.major = major
        db_user.role = role
        db.commit()
        db.refresh(db_user)
    return db_user
