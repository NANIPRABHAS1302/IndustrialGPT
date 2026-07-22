# IndustrialGPT Deployment & Infrastructure Guide

## 1. Docker Compose Production Deployment

The platform is fully containerized into 6 microservices:

```bash
docker compose up -d --build
```

### Container Stack Services
1. `industrial_gpt_api` (FastAPI Application Server on port 8000)
2. `industrial_gpt_postgres` (PostgreSQL 16 Database on port 5432)
3. `industrial_gpt_redis` (Redis 7 Cache on port 6379)
4. `industrial_gpt_rabbitmq` (RabbitMQ Message Broker on port 5672)
5. `industrial_gpt_neo4j` (Neo4j Graph Database on port 7474 & 7687)
6. `industrial_gpt_chromadb` (ChromaDB Vector Store on port 8001)

---

## 2. Environment Variables Checklist

Ensure `.env` contains valid production secrets:

```env
SECRET_KEY="industrial-gpt-super-secret-key-change-in-production-min-32-chars"
POSTGRES_SERVER="postgres"
POSTGRES_USER="industrial_admin"
POSTGRES_PASSWORD="industrial_password_2026"
POSTGRES_DB="industrial_gpt_db"
REDIS_HOST="redis"
RABBITMQ_HOST="rabbitmq"
NEO4J_URI="bolt://neo4j:7687"
CHROMADB_HOST="chromadb"
```

---

## 3. Production Health Checks

Run container diagnostic checks:

```bash
curl http://localhost:8000/api/v1/health
```
