"""
app/core/config.py

在这里集中管理项目配置，比如数据库连接、JWT 密钥、Token 过期时间等。
生产环境中通常也可以通过环境变量来获取这些信息。
"""

import os

# JWT 密钥
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_secret_key")
 Token 过期时间（分钟）
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 720))
# 数据库配置（SQLAlchemy）
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")
