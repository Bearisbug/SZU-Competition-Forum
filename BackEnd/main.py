"""
app/main.py

FastAPI 入口文件，启动应用，加载路由，配置中间件和静态文件等。
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
import uvicorn
import logging

# 导入路由
from app.api import (
    user_endpoints,
    upload_endpoints,
    team_endpoints,
    notification_endpoints,
    article_endpoints,
    competition_endpoints,
    recruitment_endpoints 
)

from app.db.session import SessionLocal
from app.db.models import User
app = FastAPI()

# 配置 CORS
origins = [
    "172.31.234.146:8000",   # 开发服务器
    "http://172.31.234.146", # Nginx (80端口)
    "http://localhost",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载路由
app.include_router(user_endpoints.router, prefix='/api/user', tags=["Users"])
app.include_router(team_endpoints.router, prefix='/api/teams', tags=["Teams"])
app.include_router(notification_endpoints.router, prefix='/api/notifications', tags=["Notifications"])
app.include_router(article_endpoints.router, prefix='/api/articles', tags=["Articles"])
app.include_router(competition_endpoints.router, prefix='/api/competitions', tags=["Competitions"])
app.include_router(upload_endpoints.upload_router)
app.include_router(recruitment_endpoints.router, prefix="/api/recruitments", tags=["Recruitments"])
# 配置静态文件路径
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.on_event("startup")
def ensure_default_admin():
    admin_id = 123456
    admin_password = "lzl003921"
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == admin_id).first()
        if not user:
            user = User(
                id=admin_id,
                password=admin_password,
                name="管理员",
                email="未定义",
                avatar_url="未定义",
                grade="未定义",
                major="未定义",
                role="admin",
            )
            db.add(user)
            db.commit()
            logging.info("Default admin created: id=2022152002")
        else:
            if (user.role or "").lower() != "admin":
                user.role = "admin"
                db.commit()
                logging.info("Existing user promoted to admin: id=2022152002")
    except Exception as e:
        logging.error(f"Ensure default admin failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
