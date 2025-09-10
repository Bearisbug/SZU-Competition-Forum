# app/schemas/article.py
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class ArticleBase(BaseModel):
    title: str
    summary: str
    content: str
    cover_image: str
    category: str

class ArticleCreate(ArticleBase):
    """
    创建文章时需要的字段
    """
    pass

class ArticleUpdate(BaseModel):
    """
    更新文章时，可选地修改部分或全部字段
    """
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None

class AuthorResponse(BaseModel):
    id: int
    name: str
    grade: Optional[str]
    major: Optional[str]
    avatar_url: Optional[str]
    role: Optional[str]

class ArticleResponse(BaseModel):
    id: int
    title: str
    summary: str
    content: str
    cover_image: Optional[str]
    category: Optional[str]
    view_count: int
    created_at: datetime
    author: AuthorResponse
