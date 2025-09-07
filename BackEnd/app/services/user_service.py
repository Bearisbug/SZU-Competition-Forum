"""
app/services/user_service.py

用户相关业务逻辑。
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import user as crud_user
from app.schemas.user import UserUpdate
from app.db.models import User

def get_user_info(db: Session, user_id: int) -> User:
    """
    获取用户信息。
    """
    db_user = crud_user.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    return db_user

def update_user_info(db: Session, user_id: int, user_update_data: UserUpdate) -> User:
    """
    更新用户信息。
    现在端点会确保用户只能更新自己的信息。
    """
    # 将 Pydantic 模型转换为字典，只包含用户设置了值的字段
    update_data = user_update_data.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="没有提供任何需要更新的信息")

    updated_user = crud_user.update_user(db, user_id=user_id, **update_data)
    
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
        
    return updated_user

# 注意：create_new_user 函数已被移除。
# 学生的创建是通过数据注入完成的，注册过程只是设置密码。