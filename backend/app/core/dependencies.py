from typing import AsyncGenerator, Dict, Any
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db_session, redis_client
from app.core.exceptions import PermissionDeniedException, UnauthorizedException
from app.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency returning an async SQLAlchemy DB Session.
    """
    async for session in get_db_session():
        yield session


async def get_redis() -> Redis:
    """
    Dependency returning the shared Redis client.
    """
    return redis_client


async def get_current_user_payload(
    token: str = Depends(oauth2_scheme),
) -> Dict[str, Any]:
    """
    Dependency verifying access token and returning decoded payload dictionary.
    """
    try:
        payload = decode_token(token)
        token_type = payload.get("type")
        if token_type != "access":
            raise UnauthorizedException("Invalid token type. Expected access token.")
        subject = payload.get("sub")
        if subject is None:
            raise UnauthorizedException("Token payload missing subject.")
        return payload
    except JWTError:
        raise UnauthorizedException("Could not validate credentials.")


class PermissionChecker:
    """
    Dependency class evaluating required permissions against user token claims.
    """

    def __init__(self, required_permissions: list[str]):
        self.required_permissions = required_permissions

    def __call__(self, payload: Dict[str, Any] = Depends(get_current_user_payload)) -> Dict[str, Any]:
        user_permissions: list[str] = payload.get("permissions", [])
        user_roles: list[str] = payload.get("roles", [])

        # Bypass check for Admin role
        if "admin" in user_roles:
            return payload

        for required in self.required_permissions:
            if required not in user_permissions:
                raise PermissionDeniedException(
                    detail=f"Required permission '{required}' is missing from user privileges."
                )
        return payload
