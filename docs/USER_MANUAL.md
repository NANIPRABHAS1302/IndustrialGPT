# IndustrialGPT End-User Operating Manual

Welcome to **IndustrialGPT – Unified Asset & Operations Brain**. This manual provides step-by-step instructions for operating all platform modules.

---

## 1. Login & Authentication Portal

![Login Screen](screenshots/01_login.png)

1. Open your browser and navigate to `http://localhost:3000/login`.
2. Enter your authorized enterprise credentials:
   - **Default Admin Email**: `admin@industrial.ai`
   - **Default Admin Password**: `admin123`
3. Click **Sign In to IndustrialGPT** to authenticate and receive your JWT token.

---

## 2. Operations Dashboard Overview

![Dashboard](screenshots/02_dashboard.png)

The **Unified Operations Dashboard** serves as your central command center:
- **Top Metrics**: View total active assets, plant health score, active anomaly alerts, and average Remaining Useful Life (RUL).
- **Telemetry Charts**: Monitor real-time plant vibration and temperature trends.
- **Urgent Maintenance Alerts**: Review flagged equipment requiring immediate intervention.

---

## 3. Grounded RAG AI Assistant

![AI Chat](screenshots/03_ai_chat.png)

1. Select **AI Assistant** from the left navigation menu.
2. Type your natural language operational query in the chat prompt (e.g., *"How do I perform a fluid flush on Gas Turbine B?"*).
3. The AI retrieves grounded passages from ingested SOP manuals and returns a step-by-step procedure with **verified document citations**.

---

## 4. Document Ingestion & OCR Processing

![Document Processing](screenshots/04_document_upload.png)

1. Navigate to the **Documents** section.
2. Drag and drop PDF manuals, scanned schematics, or equipment datasheets into the upload dropzone.
3. Track real-time OCR extraction (Tesseract/PaddleOCR) and ChromaDB vector indexing progress in the table below.

---

## 5. Neo4j Knowledge Graph Explorer

![Knowledge Graph](screenshots/05_knowledge_graph.png)

1. Click on **Knowledge Graph** in the sidebar.
2. Explore the interactive 2D/3D topology map showing assets, sensors, SOPs, and maintenance logs.
3. Click any node to open the **Node Details Panel** or run custom Cypher queries in the top terminal.

---

## 6. Predictive Maintenance Workbench

![Predictive Maintenance](screenshots/06_predictive_maintenance.png)

1. Open the **Predictive Maintenance** module.
2. View real-time sensor dials for **Vibration (mm/s)**, **Temperature (°C)**, and **Oil Quality (%)**.
3. Inspect the calculated **Remaining Useful Life (RUL hours)** and failure probability risk score.

---

## 7. Analytics & System Settings

![Analytics](screenshots/07_analytics.png)

- **Analytics**: Analyze monthly downtime costs, anomaly frequency distributions, and equipment category breakdowns.
- **Settings**: Manage Role-Based Access Control (RBAC) permissions matrix and inspect immutable PostgreSQL security audit logs.
