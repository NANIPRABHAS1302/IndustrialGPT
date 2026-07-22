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

---

## 2. Authentication Endpoints

### 2.1 User Login & Token Generation

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates user credentials against PostgreSQL DB and issues JWT access and refresh tokens.
- **Authentication**: Public

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

---

## 3. Document Management Endpoints

### 3.1 List Knowledge Base Documents

- **URL**: `/documents`
- **Method**: `GET`
- **Description**: Retrieves list of uploaded industrial SOP documents and wiring schematics.
- **Authentication**: Bearer Token Required

#### Success Response (`200 OK`)
```json
[
  {
    "id": "doc-1",
    "title": "Annual Compliance Report",
    "type": "PDF",
    "size": "2.4 MB",
    "status": "processed",
    "category": "Compliance"
  }
]
```

---

## 4. Predictive Maintenance & RUL Endpoints

### 4.1 Predict Asset Remaining Useful Life (RUL)

- **URL**: `/maintenance/predict`
- **Method**: `POST`
- **Description**: Evaluates telemetry inputs (Vibration, Temperature, Oil Quality) against RUL risk formula.
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

## 5. Knowledge Graph Cypher Endpoints

### 5.1 Execute Cypher Graph Query

- **URL**: `/graph/query`
- **Method**: `POST`
- **Description**: Executes custom Cypher graph queries against Neo4j to retrieve plant asset topologies.
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
