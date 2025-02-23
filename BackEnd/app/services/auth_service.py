"""
app/services/auth_service.py

与用户认证、授权相关的业务逻辑：JWT token 生成、校验，当前用户获取等。
"""

import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import JWT_SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud.user import get_user_by_id
from app.db.session import get_db
from app.schemas.user import LoginRequest

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    创建 JWT 令牌，默认过期时间在 config 中设定，可通过 expires_delta 指定。
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    密码验证逻辑，此处为了演示，直接进行明文比对。
    若需要更安全，可以使用 passlib 或 bcrypt 等进行哈希验证。
    """
    return plain_password == hashed_password

def authenticate_user(db: Session, user_id: int, password: str) -> str:
    """
    验证用户用户名和密码是否匹配，成功则返回生成的 JWT token。
    """
    from app.crud.user import get_user_by_id
    db_user = get_user_by_id(db, user_id)
    if not db_user or not verify_password(password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="登录失败，用户名或密码错误"
        )
    # 如果认证成功，创建访问令牌
    token = create_access_token(data={"sub": str(user_id)})
    return token

def verify_token(token: str = Depends(oauth2_scheme)) -> dict:
    """
    通过依赖项的形式自动解析并验证 Token 的有效性。
    返回解码后的 payload(包含sub等信息)。
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        exp = payload.get("exp")
        if exp < datetime.utcnow().timestamp():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token 已过期",
            )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token 中未找到用户信息",
            )
        return {"user_id": user_id}
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无法验证用户身份，Token 无效",
        )

def get_current_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    获取当前登录用户信息，若用户不存在或被删除则抛出 401。
    """
    user_id = token.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 中未找到用户信息",
        )
    from app.crud.user import get_user_by_id
    user = get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在或已被删除",
        )
    return user
