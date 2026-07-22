# IndustrialGPT Database Schema Documentation

![Database ER Diagram](../05_Diagrams/database_er_diagram.svg)

## PostgreSQL Relational Schema (SQLAlchemy 2.x Async ORM)

### 1. `users` Table
- `id`: UUID (PK)
- `email`: VARCHAR(255) (Unique, Indexed)
- `full_name`: VARCHAR(255)
- `hashed_password`: VARCHAR(255)
- `is_active`: BOOLEAN
- `department`: VARCHAR(100)

### 2. `documents` Table
- `id`: UUID (PK)
- `title`: VARCHAR(255)
- `filename`: VARCHAR(255)
- `file_type`: VARCHAR(50)
- `storage_path`: VARCHAR(512)
- `category`: VARCHAR(100)
- `status`: VARCHAR(50)

### 3. `assets` Table
- `id`: UUID (PK)
- `serial_number`: VARCHAR(100) (Unique)
- `name`: VARCHAR(255)
- `category`: VARCHAR(100)
- `health_score`: FLOAT
- `rul_hours`: FLOAT
- `vibration_mms`: FLOAT
- `temperature_c`: FLOAT
- `oil_quality_pct`: FLOAT

---

## Neo4j Graph Database Ontology

![Knowledge Graph Workflow](../05_Diagrams/knowledge_graph_workflow.svg)
