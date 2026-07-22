import chromadb
from typing import AsyncGenerator, Any
from redis.asyncio import Redis, ConnectionPool
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from neo4j import AsyncGraphDatabase, AsyncDriver

from app.core.config import settings
from app.core.logging import logger

# SQLAlchemy Async Engine & Session Maker
async_engine: AsyncEngine = create_async_engine(
    settings.ASYNC_DATABASE_URI,
    echo=settings.DEBUG,
    pool_size=settings.POSTGRES_POOL_SIZE,
    max_overflow=settings.POSTGRES_MAX_OVERFLOW,
    pool_pre_ping=True,
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# Redis Connection Pool & Client
redis_pool: ConnectionPool = ConnectionPool.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    max_connections=50,
)

redis_client: Redis = Redis(connection_pool=redis_pool)

# Neo4j Driver Placeholder Reference
neo4j_driver: AsyncDriver | None = None

# ChromaDB Client Placeholder Reference
chroma_client: Any = None


async def init_db_connections() -> None:
    """
    Initialize database driver connection pools (Neo4j, ChromaDB, Redis Ping check).
    Called during application startup lifecycle.
    """
    global neo4j_driver, chroma_client

    logger.info("Initializing Database Connections & Clients...")

    # Initialize Neo4j Driver
    try:
        neo4j_driver = AsyncGraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
        )
        logger.info("Neo4j driver initialized successfully.")
    except Exception as e:
        logger.error("Failed to initialize Neo4j driver", error=str(e))

    # Initialize ChromaDB HTTP Client
    try:
        chroma_client = chromadb.HttpClient(
            host=settings.CHROMADB_HOST,
            port=settings.CHROMADB_PORT,
        )
        logger.info("ChromaDB HTTP Client initialized successfully.")
    except Exception as e:
        logger.error("Failed to initialize ChromaDB client", error=str(e))

    # Test Redis Connection
    try:
        await redis_client.ping()
        logger.info("Redis connected successfully.")
    except Exception as e:
        logger.error("Failed to connect to Redis", error=str(e))

    # Initialize PostgreSQL Tables and Seed Development User
    try:
        from sqlalchemy import select
        from app.models import Base, User, Role
        from app.core.security import get_password_hash

        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("PostgreSQL database tables verified/created.")

        async with AsyncSessionLocal() as session:
            stmt = select(User).where(User.email == "admin@industrial.ai")
            res = await session.execute(stmt)
            admin_user = res.scalars().first()

            if not admin_user:
                logger.info("Seeding default development account (admin@industrial.ai)...")
                # Ensure Administrator role exists
                role_stmt = select(Role).where(Role.name == "Administrator")
                role_res = await session.execute(role_stmt)
                admin_role = role_res.scalars().first()
                if not admin_role:
                    admin_role = Role(
                        name="Administrator",
                        description="Full administrative access to IndustrialGPT workspace."
                    )
                    session.add(admin_role)
                    await session.flush()

                admin_user = User(
                    email="admin@industrial.ai",
                    full_name="Industrial Administrator",
                    hashed_password=get_password_hash("admin123"),
                    is_active=True,
                    is_superuser=True,
                    department="Engineering Operations",
                    roles=[admin_role],
                )
                session.add(admin_user)
                await session.commit()
                logger.info("Development account 'admin@industrial.ai' created successfully.")
    except Exception as e:
        logger.warning("PostgreSQL initialization/seeding warning (running in fallback mode if DB unavailable)", error=str(e))


async def close_db_connections() -> None:
    """
    Safely close database connections and pools on application shutdown.
    """
    global neo4j_driver

    logger.info("Closing Database Connections & Clean up...")

    if async_engine:
        await async_engine.dispose()
        logger.info("PostgreSQL engine disposed.")

    if redis_client:
        await redis_client.aclose()
        logger.info("Redis client closed.")

    if neo4j_driver:
        await neo4j_driver.close()
        logger.info("Neo4j driver closed.")


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI Dependency yielding Async Database Sessions with automatic cleanup.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()