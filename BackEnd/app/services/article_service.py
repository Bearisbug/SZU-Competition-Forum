"""
app/services/article_service.py

文章相关业务逻辑：
- 创建文章
- 删除文章（作者或管理员）
- 更新文章（作者）
- 获取文章详情
- 获取所有文章列表
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.crud.article import (
    create_article,
    get_article_by_id,
    get_all_articles,
    delete_article,
    update_article,
    increment_view_count
)
from app.db.models import Article, User
from app.schemas.article import ArticleCreate, ArticleUpdate
from app.services.auth_service import is_admin  # 统一用一个判断，便于未来收敛

def create_new_article(db: Session, article_data: ArticleCreate, author_id: int) -> Article:
    return create_article(db, article_data, author_id)

def remove_article_by_id(db: Session, article_id: int, current_user_id: int, current_user_role: str):
    """
    删除文章：
    - 作者本人可删
    - 管理员可删任意文章
    """
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="文章不存在")

    if not (db_article.author_id == current_user_id or is_admin(current_user_role)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权删除此文章")

    delete_article(db, db_article)

def modify_article_by_id(db: Session, article_id: int, update_data: ArticleUpdate, current_user_id: int) -> Article:
    """
    修改文章内容：仅作者本人
    （如需管理员也可修改，可在此放开 is_admin 逻辑）
    """
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="文章不存在")

    if db_article.author_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权修改此文章")

    updated_article = update_article(db, db_article, update_data)
    return updated_article

def get_article_detail_info(db: Session, article_id: int, current_user_id: int) -> dict:
    """
    获取文章详情，并自动+1浏览量
    """
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="文章不存在")

    increment_view_count(db, db_article)
    # 获取作者信息
    author = db.query(User).filter(User.id == db_article.author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="作者不存在")

    result = {
        "id": db_article.id,
        "title": db_article.title,
        "summary": db_article.summary,
        "content": db_article.content,
        "cover_image": db_article.cover_image,
        "category": db_article.category,
        "view_count": db_article.view_count,
        "created_at": db_article.created_at.isoformat() if db_article.created_at else None,
        "author": {
            "id": db_article.author_id,
            "name": author.name,
            "grade": author.grade,
            "major": author.major,
            "avatar_url": author.avatar_url,
            "role": author.role,
        }
    }
    return result

def get_all_articles_list(db: Session, current_user_id: int) -> list:
    """
    获取全部文章列表
    """
    articles = get_all_articles(db)
    results = []
    for a in articles:
        author = db.query(User).filter(User.id == a.author_id).first()
        results.append({
            "id": a.id,
            "title": a.title,
            "summary": a.summary,
            "content": a.content,
            "cover_image": a.cover_image,
            "category": a.category,
            "view_count": a.view_count,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "author": {
                "id": a.author_id,
                "name": author.name if author else None,
                "grade": author.grade if author else None,
                "major": author.major if author else None,
                "avatar_url": author.avatar_url if author else None,
                "role": author.role if author else None,
            }
        })
    return results
