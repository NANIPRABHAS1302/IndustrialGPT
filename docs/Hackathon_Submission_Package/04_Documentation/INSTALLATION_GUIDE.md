# IndustrialGPT Enterprise Installation & Deployment Guide

This document provides step-by-step installation instructions for deploying **IndustrialGPT** across Windows, Linux, Docker, and Production Kubernetes environments.

---

## 1. System Requirements

- **CPU**: 8 Cores (x86_64 or ARM64)
- **RAM**: 16 GB Minimum (32 GB Recommended)
- **Disk Space**: 50 GB SSD

---

## 2. Docker Compose Deployment (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/industrial-ai/IndustrialGPT.git
cd IndustrialGPT

# 2. Launch all microservices via Docker Compose
docker-compose up -d --build
```

---

## 3. Local Development Setup

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
