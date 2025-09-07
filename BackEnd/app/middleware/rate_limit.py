import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logging_config import get_logger, log_security_event
from typing import Dict, Deque
import threading

logger = get_logger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """IP限流中间件 - 不使用Redis，基于内存实现"""
    
    def __init__(self, app, requests_per_minute: int = 60, requests_per_hour: int = 1000):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        
        # 使用字典存储每个IP的请求记录
        # key: IP地址, value: deque存储请求时间戳
        self.minute_requests: Dict[str, Deque[float]] = defaultdict(deque)
        self.hour_requests: Dict[str, Deque[float]] = defaultdict(deque)
        
        self.lock = threading.Lock()
        self.last_cleanup = time.time()
        
    async def dispatch(self, request: Request, call_next):
        client_ip = self.get_client_ip(request)
        current_time = time.time()
        # 定期清理过期数据
        if current_time - self.last_cleanup > 300:  # 每5分钟清理一次
            self.cleanup_expired_records(current_time)
            self.last_cleanup = current_time
        
        # 检查限流
        if not self.is_request_allowed(client_ip, current_time):
            # 记录限流事件
            log_security_event(
                event_type="RATE_LIMIT_EXCEEDED",
                ip_address=client_ip,
                details=f"IP {client_ip} 超过限流阈值",
                severity="WARNING"
            )
            
            raise HTTPException(
                status_code=429,
                detail="请求过于频繁，请稍后再试"
            )
        
        # 记录请求
        self.record_request(client_ip, current_time)
        
        response = await call_next(request)
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
    
    def is_request_allowed(self, ip: str, current_time: float) -> bool:
        """检查请求是否被允许"""
        with self.lock:
            # 清理过期的请求记录
            self.clean_expired_requests(ip, current_time)
            
            # 检查分钟级限制
            minute_count = len(self.minute_requests[ip])
            if minute_count >= self.requests_per_minute:
                logger.warning(f"IP {ip} 超过分钟级限流: {minute_count}/{self.requests_per_minute}")
                return False
            
            # 检查小时级限制
            hour_count = len(self.hour_requests[ip])
            if hour_count >= self.requests_per_hour:
                logger.warning(f"IP {ip} 超过小时级限流: {hour_count}/{self.requests_per_hour}")
                return False
            
            return True
    
    def record_request(self, ip: str, current_time: float):
        """记录请求"""
        with self.lock:
            self.minute_requests[ip].append(current_time)
            self.hour_requests[ip].append(current_time)
    
    def clean_expired_requests(self, ip: str, current_time: float):
        """清理指定IP的过期请求记录"""
        # 清理1分钟前的记录
        minute_cutoff = current_time - 60
        while self.minute_requests[ip] and self.minute_requests[ip][0] < minute_cutoff:
            self.minute_requests[ip].popleft()
        
        # 清理1小时前的记录
        hour_cutoff = current_time - 3600
        while self.hour_requests[ip] and self.hour_requests[ip][0] < hour_cutoff:
            self.hour_requests[ip].popleft()
    
    def cleanup_expired_records(self, current_time: float):
        """清理所有过期的请求记录"""
        with self.lock:
            # 清理空的或过期的IP记录
            minute_cutoff = current_time - 60
            hour_cutoff = current_time - 3600
            
            # 收集需要删除的IP
            ips_to_remove = []
            
            for ip in list(self.minute_requests.keys()):
                # 清理过期记录
                while self.minute_requests[ip] and self.minute_requests[ip][0] < minute_cutoff:
                    self.minute_requests[ip].popleft()
                
                # 如果队列为空，标记删除
                if not self.minute_requests[ip]:
                    ips_to_remove.append(ip)
            
            # 删除空的记录
            for ip in ips_to_remove:
                if ip in self.minute_requests:
                    del self.minute_requests[ip]
            
            # 对小时记录做同样处理
            ips_to_remove = []
            for ip in list(self.hour_requests.keys()):
                while self.hour_requests[ip] and self.hour_requests[ip][0] < hour_cutoff:
                    self.hour_requests[ip].popleft()
                
                if not self.hour_requests[ip]:
                    ips_to_remove.append(ip)
            
            for ip in ips_to_remove:
                if ip in self.hour_requests:
                    del self.hour_requests[ip]
            
            logger.info(f"清理过期限流记录完成，当前活跃IP数量: {len(self.minute_requests)}")
    
    def get_rate_limit_status(self, ip: str) -> dict:
        """获取指定IP的限流状态"""
        current_time = time.time()
        with self.lock:
            self.clean_expired_requests(ip, current_time)
            
            return {
                "ip": ip,
                "minute_requests": len(self.minute_requests[ip]),
                "minute_limit": self.requests_per_minute,
                "hour_requests": len(self.hour_requests[ip]),
                "hour_limit": self.requests_per_hour,
                "minute_remaining": max(0, self.requests_per_minute - len(self.minute_requests[ip])),
                "hour_remaining": max(0, self.requests_per_hour - len(self.hour_requests[ip]))
            }


class APIRateLimitMiddleware(BaseHTTPMiddleware):
    """API接口专用限流中间件 - 针对不同接口设置不同限制"""
    
    def __init__(self, app):
        super().__init__(app)
        
        # 不同接口的限流配置 (格式是每分钟请求数, 每小时请求数) - 已为开发环境放宽限制
        self.endpoint_limits = {
            "/api/user/login": (1000, 10000),      # 登录接口
            "/api/user/register": (500, 2000),     # 注册接口
            "/api/user/": (3000, 5000),           # 用户相关接口
            "/api/teams/": (2000, 3000),          # 团队相关接口
            "/api/articles/": (4000, 8000),       # 文章相关接口
            "/api/competitions/": (2000, 4000),   # 比赛相关接口
            "/api/recruitments/": (2000, 3000),   # 招聘相关接口
        }
        
        self.default_limit = (6000, 10000)
        
        # 存储每个IP+接口的请求记录
        self.requests: Dict[str, Dict[str, Deque[float]]] = defaultdict(lambda: defaultdict(deque))
        self.lock = threading.Lock()
        self.last_cleanup = time.time()
    
    async def dispatch(self, request: Request, call_next):
        client_ip = self.get_client_ip(request)
        endpoint = self.get_endpoint_key(request.url.path)
        current_time = time.time()
        
        # 定期清理
        if current_time - self.last_cleanup > 300:
            self.cleanup_expired_records(current_time)
            self.last_cleanup = current_time
        
        # 获取该接口的限制
        minute_limit, hour_limit = self.endpoint_limits.get(endpoint, self.default_limit)
        
        # 检查限流
        if not self.is_request_allowed(client_ip, endpoint, current_time, minute_limit, hour_limit):
            log_security_event(
                event_type="API_RATE_LIMIT_EXCEEDED",
                ip_address=client_ip,
                details=f"IP {client_ip} 在接口 {endpoint} 超过限流阈值",
                severity="WARNING"
            )
            
            raise HTTPException(
                status_code=429,
                detail=f"接口 {endpoint} 请求过于频繁，请稍后再试"
            )
        
        # 记录请求
        self.record_request(client_ip, endpoint, current_time)
        
        response = await call_next(request)
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """获取客户端真实IP地址"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    def get_endpoint_key(self, path: str) -> str:
        """获取接口键值"""
        for endpoint in self.endpoint_limits.keys():
            if path.startswith(endpoint):
                return endpoint
        return "default"
    
    def is_request_allowed(self, ip: str, endpoint: str, current_time: float, 
                          minute_limit: int, hour_limit: int) -> bool:
        """检查请求是否被允许"""
        with self.lock:
            key = f"{ip}:{endpoint}"
            
            # 清理过期记录
            self.clean_expired_requests(key, current_time)
            
            # 检查限制
            minute_count = len(self.requests[key]["minute"])
            hour_count = len(self.requests[key]["hour"])
            
            if minute_count >= minute_limit:
                logger.warning(f"IP {ip} 接口 {endpoint} 超过分钟级限流: {minute_count}/{minute_limit}")
                return False
            
            if hour_count >= hour_limit:
                logger.warning(f"IP {ip} 接口 {endpoint} 超过小时级限流: {hour_count}/{hour_limit}")
                return False
            
            return True
    
    def record_request(self, ip: str, endpoint: str, current_time: float):
        """记录请求"""
        with self.lock:
            key = f"{ip}:{endpoint}"
            self.requests[key]["minute"].append(current_time)
            self.requests[key]["hour"].append(current_time)
    
    def clean_expired_requests(self, key: str, current_time: float):
        """清理过期请求记录"""
        minute_cutoff = current_time - 60
        hour_cutoff = current_time - 3600
        
        while self.requests[key]["minute"] and self.requests[key]["minute"][0] < minute_cutoff:
            self.requests[key]["minute"].popleft()
        
        while self.requests[key]["hour"] and self.requests[key]["hour"][0] < hour_cutoff:
            self.requests[key]["hour"].popleft()
    
    def cleanup_expired_records(self, current_time: float):
        """清理所有过期记录"""
        with self.lock:
            keys_to_remove = []
            
            for key in list(self.requests.keys()):
                self.clean_expired_requests(key, current_time)
                
                # 如果记录为空，标记删除
                if not self.requests[key]["minute"] and not self.requests[key]["hour"]:
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                del self.requests[key]
            
            logger.info(f"清理API限流记录完成，当前活跃记录数: {len(self.requests)}")