import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import get_logger, log_user_operation
import json

logger = get_logger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """日志记录中间件"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # 获取客户端IP
        client_ip = self.get_client_ip(request)
        
        # 记录请求信息
        logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")
        
        # 处理请求
        response = await call_next(request)
        
        # 计算处理时间
        process_time = time.time() - start_time
        
        # 记录响应信息
        logger.info(
            f"Response: {request.method} {request.url.path} "
            f"Status: {response.status_code} "
            f"Time: {process_time:.3f}s "
            f"IP: {client_ip}"
        )
        
        # 记录用户操作（如果是已认证用户的操作，没认证就不记录哈[默认不认证只能看首页]）
        await self.log_user_operation(request, response, client_ip)
        
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """获取客户端真实IP地址"""
        # 检查代理头
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # 返回直接连接的IP
        return request.client.host if request.client else "unknown"
    
    async def log_user_operation(self, request: Request, response: Response, client_ip: str):
        """记录用户操作日志"""
        try:
            if request.url.path.startswith("/api/") and request.method in ["POST", "PUT", "DELETE"]:
                authorization = request.headers.get("Authorization")
                if authorization and authorization.startswith("Bearer "):
                    token = authorization.split(" ")[1]
                    try:
                        import jwt
                        from app.core.config import JWT_SECRET_KEY
                        from app.db.session import SessionLocal
                        from app.db.models import User
                        from datetime import datetime
                        
                        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
                        exp = payload.get("exp")
                        if exp and exp > datetime.utcnow().timestamp():
                            user_id = payload.get("sub")
                            if user_id:
                                db = SessionLocal()
                                try:
                                    user = db.query(User).filter(User.id == int(user_id)).first()
                                    if user:
                                        operation = self.get_operation_description(request.method, request.url.path)
                                        log_user_operation(
                                            user_id=user.id,
                                            username=user.name,
                                            operation=request.method,
                                            resource=request.url.path,
                                            ip_address=client_ip,
                                            details=operation
                                        )
                                finally:
                                    db.close()
                    except Exception:
                        # Token无效或过期，不记录用户操作
                        pass
        except Exception as e:
            logger.error(f"记录用户操作日志失败: {e}")
    
    def get_operation_description(self, method: str, path: str) -> str:
        """获取操作描述"""
        operation_map = {
            "POST": "创建",
            "PUT": "更新", 
            "DELETE": "删除",
            "GET": "查询"
        }
        
        resource_map = {
            "/api/user": "用户",
            "/api/teams": "团队",
            "/api/articles": "文章",
            "/api/competitions": "比赛",
            "/api/recruitments": "招聘",
            "/api/notifications": "通知"
        }
        
        operation = operation_map.get(method, method)
        
        for resource_path, resource_name in resource_map.items():
            if path.startswith(resource_path):
                return f"{operation}{resource_name}"
        
        return f"{operation} {path}"