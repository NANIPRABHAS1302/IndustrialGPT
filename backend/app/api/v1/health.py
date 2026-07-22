import time
from typing import Dict, Any
from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db_session, redis_client

router = APIRouter()
start_time = time.time()


@router.get("", response_model=Dict[str, Any])
@router.get("/", response_model=Dict[str, Any])
async def health_check(
    db: AsyncSession = Depends(get_db_session),
) -> Dict[str, Any]:
    """
    Enterprise Liveness & Readiness Health Endpoint.
    Checks PostgreSQL and Redis connections and reports system status.
    """
    db_status = "healthy"
    redis_status = "healthy"

    # Check PostgreSQL
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    # Check Redis
    try:
        await redis_client.ping()
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    overall_healthy = db_status == "healthy" and redis_status == "healthy"

    return {
        "status": "healthy" if overall_healthy else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "uptime_seconds": round(time.time() - start_time, 2),
        "dependencies": {
            "postgres": db_status,
            "redis": redis_status,
        },
    }
