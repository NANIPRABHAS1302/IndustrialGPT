from typing import Any, List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Auth Schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    roles: List[str] = []
    permissions: List[str] = []


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    department: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    roles: List[str] = []

    model_config = ConfigDict(from_attributes=True)


# Document Schemas
class DocumentBase(BaseModel):
    title: str
    category: str = "General"
    tags: List[str] = []


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    id: UUID
    filename: str
    file_type: str
    file_size_bytes: int
    status: str
    doc_metadata: dict = {}

    model_config = ConfigDict(from_attributes=True)


# Asset Schemas
class AssetBase(BaseModel):
    name: str
    category: str
    plant_location: str
    health_score: float = 100.0
    rul_hours: float = 1000.0
    status: str = "Optimal"


class AssetResponse(AssetBase):
    id: UUID
    serial_number: str
    vibration_mms: float
    temperature_c: float
    oil_quality_pct: float

    model_config = ConfigDict(from_attributes=True)


# Chat Schemas
class ChatMessageBase(BaseModel):
    role: str
    content: str


class ChatMessageResponse(ChatMessageBase):
    id: UUID
    tokens_used: int = 0
    citations: List[dict] = []

    model_config = ConfigDict(from_attributes=True)


class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    model: str
    messages: List[ChatMessageResponse] = []

    model_config = ConfigDict(from_attributes=True)
