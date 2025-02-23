"""
app/api/article_endpoints.py

文章相关路由，仅做路由和请求处理，不写业务逻辑。
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.db.models import User
from app.schemas.article import ArticleCreate, ArticleResponse, ArticleUpdate
from app.services.article_service import (
    create_new_article,
    remove_article_by_id,
    modify_article_by_id,
    get_article_detail_info,
    get_all_articles_list
)
from app.services.auth_service import get_current_user

router = APIRouter()

@router.post("/create", response_model=ArticleResponse)
def create_new_article_endpoint(
    article_data: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    创建文章，并将当前登录用户视为作者
    """
    new_article = create_new_article(db, article_data, current_user.id)
    return new_article

@router.delete("/delete/{article_id}")
def delete_article_by_id_endpoint(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    删除文章：只有作者本人才能删除
    """
    remove_article_by_id(db, article_id, current_user.id)
    return {"message": "文章已删除"}

@router.put("/update/{article_id}", response_model=ArticleResponse)
def update_article_by_id_endpoint(
    article_id: int,
    update_data: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    修改文章内容：只有作者本人才能修改
    """
    updated_article = modify_article_by_id(db, article_id, update_data, current_user.id)
    return updated_article

@router.get("/detail/{article_id}", response_model=ArticleResponse)
def get_article_detail_endpoint(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取文章详情，包括作者信息，并自动增加浏览量
    """
    article_data = get_article_detail_info(db, article_id, current_user.id)
    return article_data

@router.get("/all", response_model=List[ArticleResponse])
def get_all_articles_list_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 如果查看所有也不需要登录，可去掉
):
    """
    获取全部文章列表
    """
    return get_all_articles_list(db, current_user.id)
