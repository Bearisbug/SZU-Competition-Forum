"""
app/main.py

FastAPI 入口文件，启动应用，加载路由，配置中间件和静态文件等。
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
import uvicorn

# 导入路由
from app.api import (
    user_endpoints,
    upload_endpoints,
    team_endpoints,
    notification_endpoints,
    article_endpoints,
    competition_endpoints
)

app = FastAPI()

# 配置 CORS
origins = [
    "172.31.69.242:8000",  # 开发服务器
    "http://172.31.69.242",       # Nginx (80端口)
    "http://localhost",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

# 配置静态文件路径
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
