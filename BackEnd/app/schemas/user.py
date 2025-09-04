from pydantic import BaseModel
from typing import Optional

# 创建用户时的输入模型
class UserCreate(BaseModel):
    id: int
    password: str
    email: str
    role: str  # 默认为学生，可选择 "student" 或 "teacher"

    class Config:
        orm_mode = True

# 用户信息更新模型
class UserUpdate(BaseModel):
    name: Optional[str] = "未定义"
    email: Optional[str] = "未定义"
    avatar_url: Optional[str] = "未定义"
    grade: Optional[str] = "未定义"
    major: Optional[str] = "未定义"
    role: Optional[str] = "未定义"

    class Config:
        orm_mode = True

# 返回的用户信息模型
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar_url: str
    grade: str
    major: str
    role: str

    class Config:
        orm_mode = True

# 登录请求模型
class LoginRequest(BaseModel):
    id: int
    password: str

#教师登录请求
class TeacherLoginRequest(BaseModel):
    id: int
    password: str
    email: str
    code: str

# 登录响应模型
class LoginResponse(BaseModel):
    access_token: str
