# IndustrialGPT Enterprise AI Platform Backend

Enterprise-grade AI Assistant backend built for manufacturing operations, manuals, SOPs, maintenance logs, inspection reports, and industrial assets using Clean Architecture, FastAPI, SQLAlchemy Async, Celery, Neo4j, ChromaDB, and LangChain/LangGraph Multi-Agent workflows.

## Tech Stack
- **Language**: Python 3.12
- **Web Framework**: FastAPI (Async)
- **Database**: PostgreSQL with SQLAlchemy 2.x Async ORM & AsyncPG
- **Cache & Session**: Redis
- **Message Broker**: RabbitMQ
- **Task Queue**: Celery Workers
- **Knowledge Graph**: Neo4j
- **Vector DB**: ChromaDB & FAISS
- **OCR & Extraction**: PyMuPDF, PaddleOCR, Tesseract OCR, python-docx
- **Authentication**: OAuth2 / JWT (Access & Refresh tokens) with fine-grained RBAC

## Running Locally

1. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```

2. **Run via Docker Compose**:
   ```bash
   docker compose up --build
   ```

3. **Run Locally with Uvicorn**:
   ```bash
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. **API Documentation**:
   - Swagger UI: `http://localhost:8000/api/v1/docs`
   - Health Check: `http://localhost:8000/api/v1/health`
