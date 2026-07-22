from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.database import close_db_connections, init_db_connections
from app.core.logging import logger, setup_logging
from app.middleware.auth import AuthenticationMiddleware
from app.middleware.cors import setup_cors
from app.middleware.error_handler import setup_error_handlers
from app.middleware.request_logger import RequestLoggerMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    FastAPI Lifespan context manager for application startup & shutdown hooks.
    """
    # Startup tasks
    setup_logging()
    logger.info(
        "Starting IndustrialGPT Enterprise Backend Service...",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
    )
    await init_db_connections()

    yield

    # Shutdown tasks
    logger.info("Shutting down IndustrialGPT Enterprise Backend Service...")
    await close_db_connections()


def create_application() -> FastAPI:
    """
    Application Factory constructing the FastAPI instance with all routes, middleware, and exception handlers.
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=f"{settings.API_V1_STR}/docs",
        redoc_url=f"{settings.API_V1_STR}/redoc",
        lifespan=lifespan,
    )

    # Middleware Setup (CORSMiddleware MUST be added LAST so Starlette executes it FIRST in the outer stack)
    app.add_middleware(RequestLoggerMiddleware)
    app.add_middleware(AuthenticationMiddleware)
    setup_cors(app)

    # Global Error Handlers Setup
    setup_error_handlers(app)

    # API Routers Setup
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)

    return app


app = create_application()
