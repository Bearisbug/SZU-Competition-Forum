"""
app/services/user_service.py

用户相关业务逻辑，包含：
1. 创建用户
2. 获取用户信息（增加 Redis 缓存示例）
3. 更新用户信息（同步更新数据库并失效缓存）
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import json

from app.crud.user import create_user, get_user_by_id, update_user
from app.core.redis import get_redis_client
from app.schemas.user import UserCreate, UserUpdate
from app.db.models import User

def create_new_user(db: Session, user_data: UserCreate) -> User:
    """
    创建新用户：将 id 与 password 传入 CRUD 层写入数据库。
    """
    # 你可以在这里加更多业务校验，比如 ID 是否已存在等。
    return create_user(db, user_data.id, user_data.password)

def get_user_info(db: Session, user_id: int) -> User:
    """
    获取用户信息，优先从 Redis 缓存读取，若缓存失效或不存在则从数据库拉取并写回缓存。
    """
    redis_client = get_redis_client()
    cache_key = f"user:{user_id}"

    cached_data = redis_client.get(cache_key)
    if cached_data:
        # 如果缓存中有数据，则直接返回
        user_dict = json.loads(cached_data)
        # 注意，这里仅演示从缓存读数据，如果需要返回 ORM 模型，需要自己再转换或直接返回 dict。
        # 也可只在 service 层做数据拼装，然后直接给 API 层返回。
        # 这里简单返回一个临时对象或字典即可。
        user_obj = User(**user_dict)
        return user_obj

    # 如果缓存中没有，则从数据库获取
    user_db = get_user_by_id(db, user_id)
    if not user_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户未找到")

    # 写回缓存
    user_data_dict = {
        "id": user_db.id,
        "password": user_db.password,
        "name": user_db.name,
        "email": user_db.email,
        "avatar_url": user_db.avatar_url,
        "grade": user_db.grade,
        "major": user_db.major,
        "role": user_db.role
    }
    redis_client.set(cache_key, json.dumps(user_data_dict))

    return user_db

def update_user_info(db: Session, user_id: int, user_update: UserUpdate, token_user_id: str) -> User:
    """
    更新用户信息，如更新成功则失效缓存。
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

    # 删除缓存
    redis_client = get_redis_client()
    cache_key = f"user:{user_id}"
    redis_client.delete(cache_key)

    return db_user
