# IndustrialGPT – Complete REST API Specification

> **Base URL**: `http://localhost:8000/api/v1`  
> **OpenAPI Schema**: `http://localhost:8000/api/v1/openapi.json`  
> **Interactive Swagger UI**: `http://localhost:8000/api/v1/docs`  
> **ReDoc Documentation**: `http://localhost:8000/api/v1/redoc`  

---

## 1. Authentication & Security Architecture

All protected API endpoints require an HTTP `Authorization` header containing a valid JSON Web Token (JWT) Bearer token:

```http
Authorization: Bearer <jwt_access_token>
```

### JWT Token Payload Schema
```json
{
  "sub": "admin@industrial.ai",
  "roles": ["admin", "Administrator"],
  "permissions": ["*"],
  "exp": 1784770000,
  "type": "access"
}
```

---

## 2. Authentication Endpoints

### 2.1 User Login & Token Generation

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates user credentials against PostgreSQL DB (or local dev fallback) and issues JWT access and refresh tokens.
- **Authentication**: Public

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "admin@industrial.ai",
  "password": "admin123"
}
```

#### Success Response (`200 OK`)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Error Responses
- `401 Unauthorized`: Invalid credentials or inactive user account.
```json
{
  "detail": "Invalid credentials"
}
```
- `422 Unprocessable Entity`: Request body validation failed.

---

## 3. Document Management & OCR Endpoints

### 3.1 List Knowledge Base Documents

- **URL**: `/documents`
- **Method**: `GET`
- **Description**: Retrieves a paginated list of uploaded industrial SOP documents, PDFs, and wiring schematics.
- **Authentication**: Bearer Token Required

#### Request Headers
```http
Authorization: Bearer <access_token>
```

#### Success Response (`200 OK`)
```json
[
  {
    "id": "doc-1",
    "title": "Annual Compliance Report",
    "type": "PDF",
    "size": "2.4 MB",
    "sizeBytes": 2400000,
    "uploadedAt": "2026-07-21",
    "status": "processed",
    "category": "Compliance",
    "tags": ["compliance", "audit"]
  }
]
```

---

## 4. RAG AI Chat Endpoints

### 4.1 List Active Chat Sessions

- **URL**: `/chat/sessions`
- **Method**: `GET`
- **Description**: Fetches all active AI conversation threads for the authenticated user.
- **Authentication**: Bearer Token Required

#### Success Response (`200 OK`)
```json
[
  {
    "id": "session-1",
    "title": "Turbine Hydraulic Maintenance Inquiry",
    "model": "gpt-4o",
    "temperature": 0.2,
    "messagesCount": 2,
    "previewText": "How do I perform a fluid flush on Turbine B?"
  }
]
```

---

## 5. Predictive Maintenance & RUL Endpoints

### 5.1 Predict Asset Remaining Useful Life (RUL)

- **URL**: `/maintenance/predict`
- **Method**: `POST`
- **Description**: Evaluates telemetry inputs (Vibration, Temperature, Oil Quality) against the RUL risk score formula and returns remaining operating hours.
- **Authentication**: Bearer Token Required

#### Request Body
```json
{
  "vibration": 4.5,
  "temperature": 78.2,
  "oil_quality": 85.0
}
```

#### Success Response (`200 OK`)
```json
{
  "risk_score": 50.1,
  "rul_hours": 1098.2,
  "status": "Warning",
  "failure_probability": 0.5
}
```

---

## 6. Knowledge Graph Cypher Endpoints

### 6.1 Execute Cypher Graph Query

- **URL**: `/graph/query`
- **Method**: `POST`
- **Description**: Executes custom Cypher graph queries against Neo4j to retrieve plant asset topologies, sensors, and SOP links.
- **Authentication**: Bearer Token Required

#### Request Body
```json
{
  "query": "MATCH (a:Asset)-[r:MONITORS]->(s:Sensor) RETURN a.name AS asset, s.serial AS sensor LIMIT 10"
}
```

#### Success Response (`200 OK`)
```json
[
  {
    "asset": "Turbine-B",
    "sensor": "Vib-04"
  }
]
```
