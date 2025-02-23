# app/core/redis.py

import redis
from redis.exceptions import ConnectionError
from app.core.config import REDIS_HOST, REDIS_PORT, REDIS_DB

ENABLE_REDIS = True

_redis_client = None

def get_redis_client():
    global _redis_client
    if not ENABLE_REDIS:
        return None  # 直接返回 None 表示不启用 Redis

    if _redis_client is None:
        try:
            _redis_client = redis.Redis(
                host=REDIS_HOST,
                port=REDIS_PORT,
                db=REDIS_DB,
                decode_responses=True
            )
            # 测试一下连接
            _redis_client.ping()
        except ConnectionError:
            print("Redis 连接失败，自动降级为 None")
            _redis_client = None
    return _redis_client
