"""
app/crud/user.py

只负责最基础的数据库操作(CRUD)。不包含复杂业务逻辑。
"""

from sqlalchemy.orm import Session
from app.db.models import User
from typing import Optional

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """通过用户ID获取用户"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """通过邮箱获取用户"""
    return db.query(User).filter(User.email == email).first()

def set_user_password(db: Session, user_id: int, password_hash: str) -> Optional[User]:
    """为指定用户ID的用户设置密码"""
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db_user.password = password_hash
        db.commit()
        db.refresh(db_user)
    return db_user

def update_user(db: Session,
                user_id: int,
                name: Optional[str] = None,
                email: Optional[str] = None,
                avatar_url: Optional[str] = None,
                grade: Optional[str] = None,
                major: Optional[str] = None) -> Optional[User]:
    """更新用户信息"""
    db_user = get_user_by_id(db, user_id)
    if db_user:
        if name is not None:
            db_user.name = name
        if email is not None:
            db_user.email = email
        if avatar_url is not None:
            db_user.avatar_url = avatar_url
        if grade is not None:
            db_user.grade = grade
        if major is not None:
            db_user.major = major
        db.commit()
        db.refresh(db_user)
    return db_user

# 注意：create_user 已被移除，因为用户是通过 inject_data.py 预先注入的。
# 学生注册的本质是为已存在的用户设置密码。