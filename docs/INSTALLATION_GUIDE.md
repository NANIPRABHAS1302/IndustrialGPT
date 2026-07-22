# IndustrialGPT Enterprise Installation & Deployment Guide

This document provides step-by-step installation instructions for deploying **IndustrialGPT** across Windows, Linux, Docker, and Production Kubernetes environments.

---

## 1. System Requirements

### Hardware Requirements
- **CPU**: 8 Cores (x86_64 or ARM64)
- **RAM**: 16 GB Minimum (32 GB Recommended for multi-modal OCR + Vector indexing)
- **Disk Space**: 50 GB SSD

### Software Dependencies
- **Operating System**: Windows 11 / Windows Server 2022 / Ubuntu 22.04 LTS
- **Docker**: Version 24.0+
- **Docker Compose**: Version 2.20+
- **Python**: Version 3.11+
- **Node.js**: Version 20.x LTS

---

## 2. Docker Compose Deployment (Recommended)

Docker Compose provisions all 7 microservices in isolated containers on a single internal bridge network.

```bash
# 1. Clone the repository
git clone https://github.com/industrial-ai/IndustrialGPT.git
cd IndustrialGPT

# 2. Copy environment file
cp .env.example .env

# 3. Build and launch all services in detached mode
docker-compose up -d --build

# 4. Verify container health status
docker-compose ps
```

---

## 3. Windows Native Installation

### Step 1: Clone Repository
```powershell
git clone https://github.com/industrial-ai/IndustrialGPT.git
cd IndustrialGPT
```

### Step 2: Backend Setup
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Step 3: Frontend Setup
```powershell
cd ..\frontend
npm install
npm run dev
```

---

## 4. Linux Ubuntu 22.04 Deployment

```bash
# Update System Packages & Install Dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv nodejs npm tesseract-ocr redis-server

# Backend Virtual Environment Setup
cd IndustrialGPT/backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Start Backend via Systemd Service or Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 5. Production Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name industrial.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
