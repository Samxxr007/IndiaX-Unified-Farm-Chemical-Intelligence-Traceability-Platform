# IndiaX — Unified Farm Chemical Intelligence & Traceability Platform

> **SIH 2026 — Problem Statement: Development of a Unified Farm Chemical Intelligence and Traceability Platform for Integrated Monitoring of Crop Agrochemical Usage and Livestock Antimicrobial Usage**

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://indiax-unified-farm.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-blue?logo=render)](https://indiax-backend.onrender.com/health)
[![Python](https://img.shields.io/badge/AI-FastAPI-green?logo=fastapi)](https://indiax-ai.onrender.com/health)

---

## 🌾 What Is IndiaX?

**IndiaX** is a farm-level chemical intelligence and traceability platform that connects:
- Crop **pesticide and agrochemical** application records
- Livestock **veterinary drug and antimicrobial** treatment records
- **Regulatory intelligence** (FSSAI, CIBRC, ICAR, WHO)
- **Traceability** from farm soil → harvest batch → NABL lab → consumer QR

It is positioned as an **operational intelligence layer** — not a replacement for labs, vets, or regulators, but the digital evidence system that connects them.

---

## ✦ Signature Features

| Feature | Description |
|---|---|
| **Unified Chemical Ledger** | One farm identity connects crop + livestock chemical events |
| **Deterministic Regulatory Engine** | FSSAI/CIBRC rules separated from AI inferences — `COMPLIANT / REVIEW / NON-COMPLIANT / DATA UNAVAILABLE` |
| **Cross-Domain Traceability Graph** | 8-node SHA-256 cryptographic lineage: Farm → Field → Spray → Batch → Lab → QR |
| **One Health Cross-Contamination** | ML engine detecting antimicrobial residue transfer from livestock manure to crop parcels |
| **Interactive AI Scenario Simulator** | Live PHI Chronometer + pesticide risk sliders in the browser |
| **Public QR Verification Passport** | Scannable consumer food-safety passport with NABL 142-compound assay — zero PII exposed |
| **5 Role-Specific Portals** | Farmer, Veterinarian, Lab, Regulator, Admin each with dedicated dashboards |
| **Offline-First Sync** | Local state capture with server sync indicator |

---

## 🤖 Trained ML Models

All 7 AI modules are backed by **real trained Scikit-Learn / XGBoost models** on 13,500+ synthetic agronomic records.

| Model | Accuracy | Purpose |
|---|---|---|
| Pesticide Risk Classifier | **88.67%** | LOW/MEDIUM/HIGH risk with R² 0.929 regression |
| PHI Harvest Safety | **100.00%**, MAE 0.01 days | Safe harvest date chronometer |
| AMU Misuse Detector | **99.50%** | WHO HPCIA over-dosing/duration detection |
| One Health Contamination | **93.60%** | Manure-to-crop AMR transmission |
| Farm Compliance Score | Deterministic | 0–100 vigour grade (A+ to C) |

---

## 🏗️ Architecture

```
Browser (React + Vite + Tailwind)
        │
        ▼
Express.js API (Node.js + TypeScript + Prisma)
        │
   ┌────┴────┐
   ▼         ▼
PostgreSQL  FastAPI AI Engine (Python, Port 8000)
(PostGIS)   └── Trained .joblib ML Models
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ with PostGIS

### 1. Backend
```bash
cd indiax-backend
npm install
# Set up .env (copy from .env.production template)
node ./node_modules/prisma/build/index.js generate
node ./node_modules/prisma/build/index.js migrate dev
node ./node_modules/prisma/build/index.js db seed
node ./node_modules/ts-node-dev/bin/ts-node-dev.js --respawn --transpile-only src/index.ts
```

### 2. AI Engine
```bash
cd indiax-ai-engine
pip install -r requirements.txt
python generate_datasets.py     # Generate 13,500 training records
python train_models.py          # Train all 7 ML models
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
node ./node_modules/vite/bin/vite.js
```

Open http://localhost:5173 — use **Demo Access** buttons to explore each role.

---

## ☁️ Deployment

### Frontend → Vercel
1. Import `frontend/` directory on [vercel.com](https://vercel.com)
2. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
3. Vercel auto-detects Vite — deploy.

### Backend → Render
1. New **Web Service** → connect GitHub repo
2. Root directory: `indiax-backend`
3. Build command: `npm install && node ./node_modules/prisma/build/index.js generate && node ./node_modules/prisma/build/index.js migrate deploy && node ./node_modules/typescript/bin/tsc`
4. Start command: `node dist/index.js`
5. Add environment variables from `.env.production` template.
6. Add **PostgreSQL** addon on Render — copy `DATABASE_URL` into env vars.

### AI Engine → Render
1. New **Web Service** → Python environment
2. Root directory: `indiax-ai-engine`
3. Build command: `pip install -r requirements.txt && python generate_datasets.py && python train_models.py`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

---

## 📁 Repository Structure

```
IndiaX/
├── frontend/                  # React + Vite + Tailwind SPA
│   ├── src/
│   │   ├── pages/             # Role dashboards, QR, Risk Intelligence
│   │   ├── context/           # AppContext — unified state & mock fallbacks
│   │   ├── components/        # Card, Badge, Button, ProgressBar, Modal, FarmMap
│   │   └── mocks/             # Seed demo data for offline mode
│   └── vercel.json
│
├── indiax-backend/            # Express.js TypeScript API
│   ├── src/
│   │   ├── modules/           # 19 API modules (auth, farms, crops, ai, ...)
│   │   ├── services/          # ai.service.ts, regulatory.service.ts
│   │   └── middleware/        # auth, rateLimiter, errorHandler
│   └── prisma/                # PostgreSQL/PostGIS schema + seed
│
└── indiax-ai-engine/          # Python FastAPI + ML Inference
    ├── generate_datasets.py   # Generates 13,500 agronomic training records
    ├── train_models.py        # Trains all 7 Scikit-Learn models
    ├── main.py                # FastAPI REST inference server
    ├── data/                  # Generated CSVs
    └── models/                # Trained .joblib artifacts
```

---

## 📊 Data Sources & Regulatory References

| Source | Role in IndiaX |
|---|---|
| **FSSAI Pesticide Data Repository** | MRL standards and chemical commodity pairings |
| **CIBRC Registration Database** | Approved pesticide active ingredients |
| **ICAR-NIVEDI AMU Tool** | Livestock antimicrobial use benchmarks |
| **WHO CIA/HPCIA Classifications** | Critically Important Antimicrobial categories |
| **WOAH ANIMUSE** | International AMR surveillance reference |
| **APEDA HortiNet** | Export traceability and residue monitoring reference |
| **National One Health Mission** | Cross-sector data integration mandate |

---

## ⚠️ Disclaimer

This is a **SIH 2026 Hackathon Prototype**. Synthetic demo data is used for demonstration. IndiaX does **not**:
- Replace laboratory testing or veterinary judgment
- Determine legal MRL values (these are from official regulatory sources)
- Prove or certify food safety without NABL-accredited laboratory results

---

## 🏆 Team

**Team IndiaX — SIH 2026**
