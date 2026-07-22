# IndustrialGPT – AI for Industrial Knowledge Intelligence

![IndustrialGPT System Architecture](../05_Diagrams/system_architecture.svg)

> **ET AI Hackathon Submission** — Problem Statement PS 8: *AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain*  
> **Author:** Solo Participant  
> **Status:** Production-Ready / Enterprise Grade  

---

## 📌 Project Overview

**IndustrialGPT** is an enterprise AI solution engineered to transform industrial operations, asset maintenance, and plant troubleshooting. By unifying legacy document processing, vector search, knowledge graphs, and predictive sensor analytics, IndustrialGPT acts as a **Unified Asset & Operations Brain**.

Plant engineers and operators can interact with the system via a natural language RAG interface grounded in verified Standard Operating Procedures (SOPs), explore complex asset dependency topologies in 2D/3D, monitor real-time sensor health scores, and predict equipment Remaining Useful Life (RUL).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Lucide Icons, Recharts, Cytoscape / Three.js |
| **Backend** | FastAPI (Python 3.11), Uvicorn, Pydantic v2, SQLAlchemy 2.x (Async), Structlog |
| **Databases** | PostgreSQL 16 (Relational), Neo4j 5 (Graph), ChromaDB 0.4.24 (Vector) |
| **AI & ML** | LangChain, SentenceTransformers, Tesseract OCR, PaddleOCR, PyMuPDF, Pandas, NumPy |
| **Task Queue & Cache** | Redis 7, Celery 5 |
| **DevOps & Infrastructure** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 📊 Application Screenshots

| Feature | Screenshot Preview |
| :--- | :--- |
| **Login Portal** | ![Login Screen](../06_Screenshots/01_login.png) |
| **Unified Operations Dashboard** | ![Dashboard](../06_Screenshots/02_dashboard.png) |
| **RAG AI Chat Assistant** | ![AI Chat](../06_Screenshots/03_ai_chat.png) |
| **Document Ingestion & OCR** | ![Documents](../06_Screenshots/04_document_upload.png) |
| **Neo4j Knowledge Graph** | ![Knowledge Graph](../06_Screenshots/05_knowledge_graph.png) |
| **Predictive Maintenance Workbench** | ![Predictive Maintenance](../06_Screenshots/06_predictive_maintenance.png) |
