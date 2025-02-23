"""
app/crud/article.py

文章相关最基本的数据库操作。
"""

from sqlalchemy.orm import Session
from typing import List
from app.db.models import Article
from app.schemas.article import ArticleCreate, ArticleUpdate

def create_article(db: Session, article_data: ArticleCreate, author_id: int) -> Article:
    db_article = Article(
        author_id=author_id,
        title=article_data.title,
        summary=article_data.summary,
        content=article_data.content,
        cover_image=article_data.cover_image,
        category=article_data.category
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def get_article_by_id(db: Session, article_id: int) -> Article:
    return db.query(Article).filter(Article.id == article_id).first()

def get_all_articles(db: Session) -> List[Article]:
    return db.query(Article).all()

def delete_article(db: Session, article: Article):
    db.delete(article)
    db.commit()

def update_article(db: Session, article: Article, update_data: ArticleUpdate) -> Article:
    if update_data.title is not None:
        article.title = update_data.title
    if update_data.summary is not None:
        article.summary = update_data.summary
    if update_data.content is not None:
        article.content = update_data.content
    if update_data.cover_image is not None:
        article.cover_image = update_data.cover_image
    if update_data.category is not None:
        article.category = update_data.category

    db.commit()
    db.refresh(article)
    return article

def increment_view_count(db: Session, article: Article) -> Article:
    article.view_count += 1
    db.commit()
    db.refresh(article)
    return article
