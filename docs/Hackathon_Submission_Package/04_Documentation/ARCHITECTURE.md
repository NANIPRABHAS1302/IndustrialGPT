# IndustrialGPT Technical Architecture Document

![System Architecture](../05_Diagrams/system_architecture.svg)

## 1. High-Level Architecture Overview

IndustrialGPT is engineered around **Clean Architecture** and **SOLID Principles**, maintaining strict layer separation:

- **Presentation Layer**: React 19 single-page application with modular feature directories (`features/chat`, `features/documents`, `features/graph`, `features/maintenance`, `features/analytics`, `features/settings`).
- **Application Layer**: FastAPI endpoints with request lifecycle validation, dependency injection, and security middleware.
- **Business Service Layer**: Async domain services (`RAGService`, `KnowledgeGraphService`, `PredictiveMaintenanceService`).
- **Data Persistence Layer**: PostgreSQL via SQLAlchemy 2.x Async ORM, ChromaDB vector store, Redis caching, and Neo4j graph cluster.

---

## 2. RAG & AI Pipeline

![AI Pipeline Diagram](../05_Diagrams/ai_pipeline.svg)

---

## 3. Knowledge Graph Architecture

![Knowledge Graph Workflow](../05_Diagrams/knowledge_graph_workflow.svg)

---

## 4. Security Architecture

![Auth Flow Diagram](../05_Diagrams/auth_flow.svg)
