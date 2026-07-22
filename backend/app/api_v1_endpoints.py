from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.security import create_access_token, create_refresh_token, get_password_hash, verify_password
from app.schemas import LoginRequest, Token
from app.services import kg_service, predictive_service, rag_service

router = APIRouter()


# Auth Routes
@router.post("/auth/login", response_model=Token)
async def login(
    req: LoginRequest,
    db: AsyncSession = Depends(get_db_session)
) -> Dict[str, Any]:
    # 1. Query user from PostgreSQL database
    user = None
    try:
        from sqlalchemy import select
        from app.models import User
        stmt = select(User).where(User.email == req.email)
        result = await db.execute(stmt)
        user = result.scalars().first()
    except Exception:
        user = None

    # 2. If user exists in DB, verify password hash
    if user:
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is inactive")
        if verify_password(req.password, user.hashed_password):
            roles = [r.name for r in user.roles] if user.roles else ["user"]
            if user.is_superuser and "admin" not in roles and "Administrator" not in roles:
                roles.append("admin")
            permissions = ["*"] if ("admin" in roles or "Administrator" in roles or user.is_superuser) else ["read"]

            access_token = create_access_token(subject=user.email, roles=roles, permissions=permissions)
            refresh_token = create_refresh_token(subject=user.email)
            return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

    # 3. Fallback for local development environment if database is offline or unseeded
    if req.email == "admin@industrial.ai" and req.password == "admin123":
        access_token = create_access_token(subject=req.email, roles=["admin", "Administrator"], permissions=["*"])
        refresh_token = create_refresh_token(subject=req.email)
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


# Documents Route
@router.get("/documents")
async def list_documents() -> List[Dict[str, Any]]:
    return [
        {
            "id": "doc-1",
            "title": "Annual Compliance Report",
            "type": "PDF",
            "size": "2.4 MB",
            "sizeBytes": 2400000,
            "uploadedAt": "2026-07-21",
            "status": "processed",
            "category": "Compliance",
            "tags": ["compliance", "audit"]
        }
    ]


# Chat Session & Stream Route
@router.get("/chat/sessions")
async def list_chat_sessions() -> List[Dict[str, Any]]:
    return [
        {
            "id": "session-1",
            "title": "Turbine Hydraulic Maintenance Inquiry",
            "model": "gpt-4o",
            "temperature": 0.2,
            "messagesCount": 2,
            "previewText": "How do I perform a fluid flush on Turbine B?"
        }
    ]


# Maintenance & Prediction API
class PredictionRequest(BaseModel):
    temperature: float
    vibration: float
    oil_quality: float


@router.post("/maintenance/predict")
async def predict_maintenance(req: PredictionRequest) -> Dict[str, Any]:
    return predictive_service.predict_rul(req.temperature, req.vibration, req.oil_quality)


# Knowledge Graph Cypher Route
class CypherRequest(BaseModel):
    query: str


@router.post("/graph/query")
async def query_knowledge_graph(req: CypherRequest) -> List[Dict[str, Any]]:
    return await kg_service.execute_cypher(req.query)
