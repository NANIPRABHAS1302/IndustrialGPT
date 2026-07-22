from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class IndustrialGPTException(HTTPException):
    """
    Base HTTP Exception for all custom exceptions in IndustrialGPT.
    """

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: str = "An unexpected error occurred in IndustrialGPT system.",
        headers: Optional[Dict[str, str]] = None,
        error_code: Optional[str] = "INTERNAL_ERROR",
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code


class EntityNotFoundException(IndustrialGPTException):
    def __init__(self, entity_name: str, entity_id: Any):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity_name} with ID '{entity_id}' was not found.",
            error_code="ENTITY_NOT_FOUND",
        )


class UnauthorizedException(IndustrialGPTException):
    def __init__(self, detail: str = "Invalid or expired credentials."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
            error_code="UNAUTHORIZED",
        )


class PermissionDeniedException(IndustrialGPTException):
    def __init__(self, detail: str = "Operation not permitted for current user privileges."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="PERMISSION_DENIED",
        )


class BadRequestException(IndustrialGPTException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="BAD_REQUEST",
        )


class DuplicateEntityException(IndustrialGPTException):
    def __init__(self, entity_name: str, field_name: str, value: Any):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{entity_name} with {field_name} '{value}' already exists.",
            error_code="DUPLICATE_ENTITY",
        )


class DatabaseConnectionException(IndustrialGPTException):
    def __init__(self, db_name: str, details: str):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unavailable due to connectivity issues with {db_name}: {details}",
            error_code="DATABASE_CONNECTION_ERROR",
        )
