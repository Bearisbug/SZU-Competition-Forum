"""
app/services/user_service.py

用户相关业务逻辑，包含：
1. 创建用户
2. 获取用户信息
3. 更新用户信息
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.user import create_user, get_user_by_id, update_user
from app.schemas.user import UserCreate, UserUpdate
from app.db.models import User

def create_new_user(db: Session, user_data: UserCreate) -> User:
    """
    创建新用户的业务逻辑
    """
    # 你可以在这里加更多业务校验，比如 ID 是否已存在等。
    return create_user(db, user_data.id, user_data.password, user_data.email, user_data.role)

def get_user_info(db: Session, user_id: int) -> User:
    """
    获取用户信息
    """
    user_db = get_user_by_id(db, user_id)
    if not user_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户未找到")
    
    return user_db

def update_user_info(db: Session, user_id: int, user_update: UserUpdate, token_user_id: str) -> User:
    """
    更新用户信息
    token_user_id 用于判断权限（必须是本人才能改）。
    """
    if token_user_id != str(user_id):
        raise HTTPException(
            status_code=403,
            detail="您没有权限修改此用户信息"
        )

    db_user = update_user(db, user_id,
                          name=user_update.name,
                          email=user_update.email,
                          avatar_url=user_update.avatar_url,
                          grade=user_update.grade,
                          major=user_update.major,
                          role=user_update.role)
    if not db_user:
        raise HTTPException(status_code=404, detail="用户未找到")

    return db_user
