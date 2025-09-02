import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# 日志格式
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

def setup_logging():
    """设置日志配置"""
    # 创建根日志器
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # 清除现有的处理器
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # 控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter(LOG_FORMAT)
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # 应用日志文件处理器
    app_handler = RotatingFileHandler(
        LOG_DIR / "app.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    app_handler.setLevel(logging.INFO)
    app_formatter = logging.Formatter(LOG_FORMAT)
    app_handler.setFormatter(app_formatter)
    root_logger.addHandler(app_handler)

def get_logger(name: str):
    """获取指定名称的日志器"""
    return logging.getLogger(name)

def log_user_login(user_id: int, username: str, ip_address: str, user_agent: str = None, success: bool = True):
    """记录用户登录日志"""
    login_logger = logging.getLogger("user_login")
    
    # 登录日志文件处理器
    if not login_logger.handlers:
        login_handler = RotatingFileHandler(
            LOG_DIR / "login.log",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        login_handler.setLevel(logging.INFO)
        login_formatter = logging.Formatter(
            "%(asctime)s - LOGIN - %(levelname)s - %(message)s"
        )
        login_handler.setFormatter(login_formatter)
        login_logger.addHandler(login_handler)
        login_logger.setLevel(logging.INFO)
        login_logger.propagate = False
    
    status = "SUCCESS" if success else "FAILED"
    message = f"User {username} (ID: {user_id}) login {status} from IP: {ip_address}"
    if user_agent:
        message += f" | User-Agent: {user_agent}"
    
    if success:
        login_logger.info(message)
    else:
        login_logger.warning(message)

def log_user_operation(user_id: int, username: str, operation: str, resource: str, ip_address: str, details: str = None):
    """记录用户操作日志"""
    operation_logger = logging.getLogger("user_operation")
    
    # 操作日志文件处理器
    if not operation_logger.handlers:
        operation_handler = RotatingFileHandler(
            LOG_DIR / "operations.log",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        operation_handler.setLevel(logging.INFO)
        operation_formatter = logging.Formatter(
            "%(asctime)s - OPERATION - %(levelname)s - %(message)s"
        )
        operation_handler.setFormatter(operation_formatter)
        operation_logger.addHandler(operation_handler)
        operation_logger.setLevel(logging.INFO)
        operation_logger.propagate = False
    
    message = f"User {username} (ID: {user_id}) performed {operation} on {resource} from IP: {ip_address}"
    if details:
        message += f" | Details: {details}"
    
    operation_logger.info(message)

def log_security_event(event_type: str, ip_address: str, details: str, severity: str = "WARNING"):
    """记录安全事件日志"""
    security_logger = logging.getLogger("security")
    
    # 安全日志文件处理器
    if not security_logger.handlers:
        security_handler = RotatingFileHandler(
            LOG_DIR / "security.log",
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        security_handler.setLevel(logging.WARNING)
        security_formatter = logging.Formatter(
            "%(asctime)s - SECURITY - %(levelname)s - %(message)s"
        )
        security_handler.setFormatter(security_formatter)
        security_logger.addHandler(security_handler)
        security_logger.setLevel(logging.WARNING)
        security_logger.propagate = False
    
    message = f"{event_type} from IP: {ip_address} | {details}"
    
    if severity.upper() == "ERROR":
        security_logger.error(message)
    elif severity.upper() == "CRITICAL":
        security_logger.critical(message)
    else:
        security_logger.warning(message)