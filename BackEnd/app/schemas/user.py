from pydantic import BaseModel, EmailStr
from typing import Optional

# --- 请求模型 ---

class StudentRegisterRequest(BaseModel):
    """学生注册请求模型"""
    id: int
    password: str

class StudentLoginRequest(BaseModel):
    """学生登录请求模型"""
    id: int
    password: str

class TeacherLoginRequest(BaseModel):
    """教师登录请求模型"""
    email: EmailStr
    code: str

class EmailRequest(BaseModel):
    """发送邮箱验证码请求模型"""
    email: EmailStr

# --- 响应模型 ---

class LoginResponse(BaseModel):
    """统一登录响应模型"""
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    """返回的用户信息模型"""
    id: int
    name: str
    email: EmailStr
    avatar_url: str
    grade: str
    major: str
    role: str

    class Config:
        orm_mode = True

# --- 其他模型 ---

class UserUpdate(BaseModel):
    """用户信息更新模型"""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    grade: Optional[str] = None
    major: Optional[str] = None

    class Config:
        orm_mode = True