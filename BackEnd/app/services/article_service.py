"""
app/services/article_service.py

文章相关业务逻辑：
- 创建文章
- 删除文章
- 更新文章
- 获取文章详情（可使用 Redis 缓存做示例）
- 获取所有文章列表（亦可使用缓存示例）
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import json

from app.crud.article import (
    create_article,
    get_article_by_id,
    get_all_articles,
    delete_article,
    update_article,
    increment_view_count
)
from app.core.redis import get_redis_client
from app.db.models import Article, User
from app.schemas.article import ArticleCreate, ArticleUpdate

def create_new_article(db: Session, article_data: ArticleCreate, author_id: int) -> Article:
    return create_article(db, article_data, author_id)

def remove_article_by_id(db: Session, article_id: int, current_user_id: int):
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="文章不存在")
    if db_article.author_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权删除此文章")

    # 删数据库前，可以删缓存
    redis_client = get_redis_client()
    redis_key = f"article:{article_id}"
    redis_client.delete(redis_key)

    delete_article(db, db_article)

def modify_article_by_id(db: Session, article_id: int, update_data: ArticleUpdate, current_user_id: int) -> Article:
    db_article = get_article_by_id(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="文章不存在")
    if db_article.author_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权修改此文章")

    updated_article = update_article(db, db_article, update_data)

    # 同步更新缓存
    redis_client = get_redis_client()
    redis_key = f"article:{article_id}"
    redis_client.delete(redis_key)  # 简单做法：删缓存，后续获取再写入
    return updated_article

def get_article_detail_info(db: Session, article_id: int, current_user_id: int) -> dict:
    """
    获取文章详情，并自动+1浏览量。可使用 Redis 做缓存示例。
    """
    redis_client = get_redis_client()
    redis_key = f"article:{article_id}"

    cached = redis_client.get(redis_key)
    if cached:
        # 如果已经有缓存，可以选择是否也要增加一次浏览量
        # 这里演示还是去操作数据库以保证计数真实
        db_article = get_article_by_id(db, article_id)
        if not db_article:
            raise HTTPException(status_code=404, detail="文章不存在")
        increment_view_count(db, db_article)

        # 也要更新缓存中的 view_count
        cached_data = json.loads(cached)
        cached_data["view_count"] = db_article.view_count
        redis_client.set(redis_key, json.dumps(cached_data))
        return cached_data

    # 如果缓存没有，则从数据库取
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

    # 写回缓存
    redis_client.set(redis_key, json.dumps(result))
    return result

def get_all_articles_list(db: Session, current_user_id: int) -> list:
    """
    获取全部文章列表，可根据业务需要添加缓存
    """
    # 这里只是简单示例，实际也可以在 Redis 中缓存列表
    articles = get_all_articles(db)
    return articles
