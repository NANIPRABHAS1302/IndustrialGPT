import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response

from app.core.logging import logger


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """
    Enterprise Structured Request Logger Middleware.
    Tracks execution time, request IDs, status codes, and HTTP metadata.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        start_time = time.time()
        client_host = request.client.host if request.client else "unknown"

        logger.info(
            "Incoming API HTTP Request",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            client_host=client_host,
        )

        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.4f}s"

            logger.info(
                "Completed API HTTP Request",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                process_time_seconds=round(process_time, 4),
            )
            return response
        except Exception as exc:
            process_time = time.time() - start_time
            logger.error(
                "Unhandled Exception during HTTP Request",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                process_time_seconds=round(process_time, 4),
                error=str(exc),
            )
            raise exc
