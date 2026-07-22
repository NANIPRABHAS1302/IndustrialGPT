from fastapi import APIRouter
from app.api.v1 import health
from app.api_v1_endpoints import router as domain_router

api_v1_router = APIRouter()

# Include health router
api_v1_router.include_router(health.router, prefix="/health", tags=["Health & System"])
# Include domain router
api_v1_router.include_router(domain_router, tags=["Domain APIs"])
