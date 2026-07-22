from typing import Optional
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

from app.core.exceptions import UnauthorizedException
from app.core.security import decode_token


class AuthenticationMiddleware(BaseHTTPMiddleware):
    """
    Middleware that parses Authorization header into request state for request logging & telemetry context.
    Does not block unauthenticated paths (FastAPI route dependencies handle route authorization).
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        auth_header: Optional[str] = request.headers.get("Authorization")
        request.state.user_id = None
        request.state.roles = []
        request.state.permissions = []

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = decode_token(token)
                request.state.user_id = payload.get("sub")
                request.state.roles = payload.get("roles", [])
                request.state.permissions = payload.get("permissions", [])
            except Exception:
                # Malformed/Expired tokens will be rejected when hit protected route dependencies
                pass

        response = await call_next(request)
        return response
