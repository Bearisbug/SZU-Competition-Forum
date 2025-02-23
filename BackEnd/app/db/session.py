from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from sqlalchemy import Column, Integer, String
# 数据库连接字符串
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"

# 创建数据库引擎
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# 创建 SessionLocal 类，用于生成 Session 实例
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 获取数据库会话的函数
def get_db():
    db = SessionLocal()  # 创建一个 Session 实例
    try:
        yield db  # 将 db 作为生成器返回给调用者
    finally:
        db.close()  # 确保会话最终被关闭
