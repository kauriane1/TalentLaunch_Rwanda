# TalentLaunch Rwanda

A simple full-stack web application for discovering and managing Rwandan talent.

- Frontend: static HTML/CSS/JavaScript pages in `Front-end/`
- Backend: Node.js + Express in root folder
- Database: PostgreSQL (Neon, local Postgres, or any provider)
- Authentication: JWT + role-based (admin / user)

---

## Table of Contents

1. Quick start (local)
2. Prerequisites
3. Setup
   - Backend
   - Database
   - Frontend
4. Running the app
5. Testing
6. Data seeding (admin and sample data)
7. API reference
8. Troubleshooting

---

## 1. Quick start (local)

1. Clone repository
   ```bash
   git clone https://github.com/kauriane1/TalentLaunch_Rwanda.git
   cd TalentLaunch_Rwanda
   ```
2. Install backend dependencies
   ```bash
   npm install
   ```
3. Create `.env` file (see section below)
4. Initialize database schema
   ```bash
   psql "$DATABASE_URL" -f config/schema.sql
   ```
5. Start backend
   ```bash
   npm start
   ```
6. Open frontend in browser:
   - `Front-end/index.html` for public pages
   - `Front-end/login.html` for login
   - `Front-end/dashboard.html` for user dashboard
   - `Front-end/admin.html` for admin panel

---

## 2. Prerequisites

- Node.js 18+ (recommended)
- npm 10+ (or yarn)
- PostgreSQL 15+ (local or managed)
- Git

Optional:
- pgAdmin or DBeaver for DB inspection
- `curl` or Postman for API tests

---

## 3. Setup

### 3.1 Backend configuration

1. Copy `.env.example` to `.env` (create if missing)
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and set these variables:
   - `PORT=5000`
   - `DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME`
   - `JWT_SECRET=your-secret-key`
   - `JWT_EXPIRATION=1h`

### 3.2 Database setup

1. Create database:
   ```bash
   createdb talentlaunch_db
   ```
2. Apply schema:
   ```bash
   psql "$DATABASE_URL" -f config/schema.sql
   ```
3. Verify tables exist:
   - users
   - mentors
   - talents
   - workshops

### 3.3 Frontend setup

No build step required. Files are under `Front-end/`.

- `Front-end/index.html` - landing page
- `Front-end/login.html` - login flow
- `Front-end/dashboard.html` - user dashboard
- `Front-end/admin.html` - admin management
- `Front-end/js/api.js` - API helper methods and auth token handling

---

## 4. Running the app

1. Launch backend:
   ```bash
   npm start
   ```
2. Confirm health check
   ```bash
   curl http://localhost:5000/api/health
   ```
3. Open frontend static page in browser using local file path or local static server.

> For development, use a static server (recommended):
> ```bash
> npx serve Front-end
> ```
> and open `http://localhost:3000`.

---

## 5. Testing

- Manual: use login/register forms and admin workflows
- API via curl/Postman:
  - `POST /api/auth/login`
  - `GET /api/mentors`

No automated tests included currently.

---

## 6. Data seeding

### Admin account

Default (if not inserted automatically):

- email: `admin@talentlaunch.rw`
- password: `Admin1234`

If missing, insert manually (password is bcrypt-hashed):

```sql
INSERT INTO users (name,email,password,role,location)
VALUES ('Admin User','admin@talentlaunch.rw','$2a$12$8lgiZNKr1.4UYAlvQ6M2duAgaP0HcXiQNrqBaxjsiWSIdbZY5wwL.','admin','Kigali');
```

### Seed sample data (optional)

```sql
INSERT INTO mentors(name,email,expertise) VALUES ('Jane Doe','jane@example.com','Web Dev');
INSERT INTO talents(name,skills,location) VALUES ('John Doe','JavaScript,React','Kigali');
INSERT INTO workshops(title,description,date) VALUES ('Intro to Node', 'Node.js workshop', '2026-07-10');
```

---

## 7. API reference

### Auth
- `POST /api/auth/login` - body: `{ "email", "password" }`
- `POST /api/auth/register` - body: `{ "name", "email", "password", "location" }`
- `POST /api/auth/admin` - admin-only operations, requires bearer token

### Mentors
- `GET /api/mentors`
- `GET /api/mentors/:id`
- `POST /api/mentors` (admin)
- `PUT /api/mentors/:id` (admin)
- `DELETE /api/mentors/:id` (admin)

### Workshops
- `GET /api/workshops`
- `GET /api/workshops/:id`
- `POST /api/workshops` (admin)
- `PUT /api/workshops/:id` (admin)
- `DELETE /api/workshops/:id` (admin)

### Talents
- `GET /api/talents`
- `GET /api/talents/:id`
- `POST /api/talents` (registered user)
- `PUT /api/talents/:id` (registered user)
- `DELETE /api/talents/:id` (registered user)

---

## 8. Troubleshooting

- `ECONNREFUSED` => backend not running or wrong URL.
- `Database connection failed` => confirm `DATABASE_URL` and DB service status.
- `401/403` => missing or expired JWT token; log in from `Front-end/login.html` and retry.
- `CORS` (if hosting frontend separately): add CORS origin in backend middleware.

---

## Deployment notes

- Use Render, Heroku, Vercel (API only), or other Node/Postgres host.
- Set env var `DATABASE_URL` to your managed Postgres connection string.
- Set `PORT` and `JWT_SECRET` in deployment settings.
- Add migrations and seed script if needed.

---

## Contact

For issues, open a GitHub issue in this repository.

