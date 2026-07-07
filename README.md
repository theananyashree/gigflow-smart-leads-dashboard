# 🚀 GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript and clean architecture.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — Register, Login, Protected Routes, bcrypt password hashing
- 📋 **Leads CRUD** — Create, Read, Update, Delete leads with full validation
- 🔍 **Advanced Filtering** — Filter by Status, Source, Search by name/email, Sort by date
- 📄 **Backend Pagination** — 10 records per page with full metadata
- 📊 **Dashboard Stats** — Real-time lead counts by status and source with progress bars

### Mandatory Additional Features
- ⚡ **Debounced Search** — 400ms debounce to prevent unnecessary API calls
- 📥 **CSV Export** — Export filtered leads as a downloadable CSV file
- 🛡️ **Role-Based Access Control (RBAC)** — Admin and Sales User roles with permission enforcement
- 🐳 **Docker Setup** — Full Docker Compose with MongoDB, Backend, and Frontend services

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Containerization | Docker, Docker Compose |
| HTTP Client | Axios |
| Validation | express-validator |
| Logging | Winston, Morgan |

---

## 📁 Project Structure

```
gigflow-smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # authController, leadController
│   │   ├── middleware/       # auth, errorHandler, validate
│   │   ├── models/          # User, Lead (Mongoose schemas)
│   │   ├── routes/          # authRoutes, leadRoutes
│   │   ├── types/           # TypeScript interfaces & enums
│   │   ├── utils/           # apiResponse, csvExport, logger
│   │   ├── validators/      # express-validator chains
│   │   └── index.ts         # Server entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # axios client, auth & leads API
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute
│   │   │   ├── layout/      # AppLayout, Sidebar, MobileHeader
│   │   │   ├── leads/       # LeadCard, LeadTable, LeadForm, LeadFilters, LeadDetail
│   │   │   └── ui/          # Modal, Spinner, EmptyState, Pagination
│   │   ├── context/         # AuthContext (JWT + user state)
│   │   ├── hooks/           # useDebounce, useLeads
│   │   ├── pages/           # DashboardPage, LeadsPage, LoginPage, RegisterPage, UsersPage
│   │   ├── types/           # Shared TypeScript interfaces & enums
│   │   └── utils/           # formatDate, getInitials, downloadBlob
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

---

### Option 1 — Run with Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/gigflow-smart-leads-dashboard.git
cd gigflow-smart-leads-dashboard

# 2. Create environment file
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# 3. Start all services
docker-compose up --build
```

App will be available at **http://localhost**

---

### Option 2 — Run Locally (Manual)

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# App runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smartleads` |
| `JWT_SECRET` | Secret key for JWT signing (use a long random string) | `your_strong_secret_here` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and receive JWT |
| GET | `/auth/me` | ✅ | Get current user |
| GET | `/auth/users` | ✅ Admin | List all users |

#### POST `/auth/register`
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "admin"
}
```

#### POST `/auth/login`
```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "Rahul Sharma", "email": "...", "role": "admin" }
  }
}
```

---

### Leads Endpoints

All leads endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/leads` | All | Get paginated leads with filters |
| GET | `/leads/:id` | All | Get single lead |
| POST | `/leads` | All | Create a new lead |
| PUT | `/leads/:id` | All* | Update a lead |
| DELETE | `/leads/:id` | All* | Delete a lead |
| GET | `/leads/stats` | All | Get lead statistics |
| GET | `/leads/export/csv` | All | Export leads as CSV |

*Sales users can only modify their own leads.

#### GET `/leads` — Query Parameters

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10, max: 50) |
| `status` | string | Filter: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter: `Website`, `Instagram`, `Referral` |
| `search` | string | Search by name or email |
| `sort` | string | `latest` (default) or `oldest` |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&page=1`

**Response:**
```json
{
  "success": true,
  "message": "Leads fetched",
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### POST `/leads`
```json
{
  "name": "Priya Singh",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in premium plan"
}
```

---

## 👥 RBAC — Role-Based Access Control

| Feature | Admin | Sales |
|---|---|---|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit any lead | ✅ | ❌ (own only) |
| Delete any lead | ✅ | ❌ (own only) |
| View Users page | ✅ | ❌ |
| Export CSV | ✅ | ✅ (filtered) |

---

## 🐳 Docker Services

| Service | Port | Description |
|---|---|---|
| `frontend` | 80 | React app served via Nginx |
| `backend` | 5000 (internal) | Express API |
| `mongo` | 27017 (internal) | MongoDB 7.0 |

---

## 📝 Default Credentials (after registration)

No seed data is included. Register your first user via `/register` and select **Admin** role to get full access.

---

## 🧑‍💻 Author 

Ananya Shree 🕊️

--- Thank You ---
