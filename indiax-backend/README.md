# IndiaX — Unified Farm Chemical Intelligence & Traceability Platform (Backend)

Enterprise Node.js + TypeScript + Express + PostgreSQL + PostGIS + Prisma API backend for agricultural and livestock chemical compliance, AI risk assessment, and end-to-end crop traceability.

---

## 🏗️ Architecture & Responsibility Separation

- **Frontend**: React + Vite UI. Communicates **strictly** via HTTPS REST (`/api/v1`). Never accesses database or AI models directly.
- **Backend**: Express + TypeScript + Prisma. Central authority for Auth, Validation, Business Logic, AI Orchestration, and Audit Logging.
- **Database**: PostgreSQL with PostGIS extensions for spatial farm parcels.
- **AI Model Service**: Modular inference interface for pattern risk scoring with deterministic fallback.

---

## 🚀 Quickstart

### 1. Start PostgreSQL (Docker)
```bash
docker-compose up -d
```

### 2. Install Dependencies & Generate Prisma Client
```bash
npm install
npx prisma generate
npx prisma db push # or npx prisma migrate dev --name init
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```
The API will be live at `http://localhost:5000/api/v1`.

---

## 🔑 Demo Seed Accounts

| Role | Email | Password |
|---|---|---|
| **Farmer** | `farmer@indiax.app` | `Demo@1234` |
| **Veterinarian** | `vet@indiax.app` | `Demo@1234` |
| **Admin** | `admin@indiax.app` | `Demo@1234` |

---

## 📡 API Endpoint Index (`/api/v1`)

### 1. Authentication (`/api/v1/auth`)
- `POST /auth/register` — Create account with role
- `POST /auth/login` — Authenticate and receive JWT
- `GET  /auth/me` — Current user profile

### 2. Farms & Parcels (`/api/v1/farms`)
- `POST /farms` — Create farm
- `GET  /farms` — List accessible farms
- `GET  /farms/:farmId` — Detailed farm profile
- `PUT  /farms/:farmId` — Update farm

### 3. Fields & Parcels (`/api/v1/fields` & `/api/v1/farms/:farmId/fields`)
- `POST /farms/:farmId/fields` — Register parcel polygon
- `GET  /farms/:farmId/fields` — List parcels
- `GET  /fields/:fieldId` — Parcel details + active cycle + risk
- `PUT  /fields/:fieldId` — Update parcel

### 4. Crop Cycles (`/api/v1/crops` & `/api/v1/fields/:fieldId/crop-cycles`)
- `GET  /crops` — List registry crops
- `POST /fields/:fieldId/crop-cycles` — Sowing / planting cycle
- `GET  /fields/:fieldId/crop-cycles` — History
- `PUT  /crop-cycles/:id` — Update cycle status

### 5. Chemical Registry & Applications (`/api/v1/chemicals` & `/api/v1/applications`)
- `GET  /chemicals` — Registry search with MRL & CPCB limits
- `POST /fields/:fieldId/applications` — **Core pipeline**: Validation -> Ownership -> Regulatory Check -> AI Risk Scoring -> Traceability -> Notifications
- `GET  /applications` — History & filtering

### 6. Livestock & Veterinary Treatments (`/api/v1/livestock` & `/api/v1/treatments`)
- `POST /farms/:farmId/livestock` — Create herd / unit
- `POST /livestock/:unitId/treatments` — Record AMU treatment + auto-calculate withdrawal periods (meat/milk) + AMU risk scoring

### 7. Harvest Batches & Lab Analysis (`/api/v1/harvest-batches` & `/api/v1/lab-results`)
- `POST /harvest-batches` — Create harvest batch with unique code (`TOM-2026-001`)
- `POST /harvest-batches/:batchId/qr` — Generate official QR code
- `POST /batches/:batchId/lab-results` — Upload NABL test parameters & certificate

### 8. Traceability & Public QR Verification (`/api/v1/traceability` & `/api/v1/public`)
- `GET  /traceability/batches/:batchId` — Complete 8-stage audit lineage
- `GET  /public/verify/:batchCode` — Safe consumer verification (no PII exposure)

### 9. Intelligence & Platform (`/api/v1/dashboard`, `/api/v1/risk`, `/api/v1/notifications`, `/api/v1/search`)
- `GET  /dashboard` — Unified aggregated metrics & alerts
- `GET  /risk/farms/:farmId` — Composite risk rating
- `GET  /notifications` — In-app alerts
- `GET  /search?q=` — Global search across farms, fields, batches, and chemicals
