# NOVA — Backend API Foundation (Node.js, Express & MySQL)

The backend foundation for **NOVA — Personal 3D AI Assistant**, providing persistent session storage, single-owner authentication, conversation tracking, user preferences, and dependency health readiness probes.

---

## 🏗️ Architecture & Features

- **Express 4.x REST API** with modular MVC architecture (Routes, Controllers, Services, Middleware, Migrations).
- **MySQL2 Connection Pool** with 100% parameterized SQL queries (`?`) preventing SQL injection.
- **Single-Owner Authentication** tailored for local development with JWT-like HMAC-SHA256 signed bearer tokens and direct `X-API-Key` headers.
- **Dependency Readiness Checks:** `GET /api/health` and `GET /api/health/ready` providing structured diagnostics for MySQL readiness.
- **Centralized Error & Response Format:** Consistent JSON response envelopes for all endpoints (`success`, `data`, `error`, `meta.requestId`).
- **Declarative Input Validation:** Reusable validation middleware enforcing field presence, length, and types.
- **Security Protections:** Request-size limits (1MB maximum payload), restricted CORS origin, and request ID tracking.

---

## 📋 API Response Contract

Every response adheres to the documented JSON contract:

### Success Response (`200`, `201`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_1a2b3c4d-...",
    "timestamp": "2026-11-04T09:30:00.000Z"
  }
}
```

### Error Response (`400`, `401`, `404`, `413`, `500`, `503`)
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_UNAVAILABLE",
    "message": "Human-readable explanation of error.",
    "details": { ... }
  },
  "meta": {
    "requestId": "req_1a2b3c4d-...",
    "timestamp": "2026-11-04T09:30:00.000Z"
  }
}
```

---

## 🛠️ API Endpoints Summary

### Health & Readiness
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Liveness check (status, uptime, version) |
| `GET` | `/api/health/ready` | Public | Dependency readiness probe (MySQL ping) |

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with single-owner credentials to get a Bearer token |
| `GET` | `/api/auth/me` | Protected | Get currently authenticated owner info |

### Sessions (Conversations)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sessions` | Protected | Create new conversation session |
| `GET` | `/api/sessions` | Protected | List all sessions with message counts |
| `GET` | `/api/sessions/:id` | Protected | Get session details and full message history |
| `PATCH` | `/api/sessions/:id` | Protected | Update session title |
| `DELETE` | `/api/sessions/:id` | Protected | Delete session and cascade messages |

### Messages
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sessions/:sessionId/messages` | Protected | Append message and generate assistant response |
| `GET` | `/api/sessions/:sessionId/messages` | Protected | Get message stream for session |

### Preferences & Audit
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/preferences` | Protected | Retrieve user UI settings |
| `PUT` | `/api/preferences` | Protected | Update user UI settings |
| `POST` | `/api/action-logs` | Public/Protected | Record operational action log |
| `GET` | `/api/action-logs` | Protected | Retrieve operational action logs |

---

## ⚙️ Configuration (`.env`)

Copy `.env.example` to `.env` in the `backend/` directory:

```ini
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# MySQL Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nova_db

# Single-Owner Authentication
OWNER_USERNAME=nova_owner
OWNER_PASSWORD=nova_local_2026
OWNER_API_KEY=nova_dev_api_key_8f1c4e92
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Running the Backend

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Run Database Migrations
npm run db:migrate

# 3. Start Server
npm start
# Or with auto-reload:
npm run dev

# 4. Run Automated API Checks
npm run test:api
```

