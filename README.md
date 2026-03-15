# TalentLaunch Rwanda

> A platform helping Rwandan youth explore, develop, and showcase their talents.

Built with **HTML + CSS + JavaScript** (frontend) and **Node.js + Express + MySQL** (backend).

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Full Project Structure](#-full-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Project](#-running-the-project)
- [Deploying on GitHub Codespaces](#-deploying-on-github-codespaces)
- [API Reference](#-api-reference)
- [Admin Access](#-admin-access)
- [Frontend Pages](#-frontend-pages)
- [Tech Stack](#-tech-stack)

---

## 🌍 Project Overview

TalentLaunch Rwanda is a web platform designed for Rwandan youth to:

- **Register & login** securely with JWT authentication
- **Discover workshops** across photography, coding, public speaking, and more
- **Connect with mentors** onboarded by the platform admin
- **Upload and showcase** their talents to the community

---

## 📁 Full Project Structure

```
talentlaunch/                          ← Root project folder
│
├── index.html                         ← Homepage
├── login.html                         ← Login & Register page
├── dashboard.html                     ← User dashboard
├── showcase.html                      ← Talent showcase & upload
│
├── js/
│   └── api.js                         ← Shared API layer (all pages use this)
│
└── talentlaunch-backend/              ← Backend (Node.js + Express + MySQL)
    │
    ├── server.js                      ← Entry point — start here
    ├── package.json                   ← Dependencies
    ├── .env.example                   ← Copy to .env and fill in your values
    │
    ├── config/
    │   ├── db.js                      ← MySQL connection pool
    │   └── schema.sql                 ← Database table definitions (run once)
    │
    ├── controllers/
    │   ├── authController.js          ← Register, login, get profile
    │   ├── mentorController.js        ← Add, edit, delete, list mentors
    │   ├── workshopController.js      ← Manage workshops + enrollments
    │   └── talentController.js        ← Upload, view, delete talents
    │
    ├── middleware/
    │   ├── auth.js                    ← JWT authentication guard
    │   └── upload.js                  ← File upload handler (Multer)
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── mentorRoutes.js
    │   ├── workshopRoutes.js
    │   └── talentRoutes.js
    │
    └── uploads/                       ← Uploaded files stored here (auto-created)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) v8 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone or open your repository

```bash
git clone https://github.com/your-username/talentlaunch.git
cd talentlaunch
```

### 2. Go into the backend folder

```bash
cd talentlaunch-backend
```

### 3. Install dependencies

```bash
npm install
```

---

## 🔧 Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Then open `.env` and update:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=talentlaunch
DB_USER=root
DB_PASSWORD=your_mysql_password_here

JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d

UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
```

> ⚠️ Never commit your `.env` file to GitHub. Add it to `.gitignore`.

---

## 🗄️ Database Setup

Run the schema file once to create the database and all tables:

```bash
mysql -u root -p < config/schema.sql
```

This creates the `talentlaunch` database with these 5 tables:

| Table | Description |
|-------|-------------|
| `users` | Registered youth members and admins |
| `mentors` | Mentors added by the admin |
| `workshops` | Workshops created and managed by admin |
| `workshop_enrollments` | Tracks which users enrolled in which workshops |
| `talents` | Talent posts uploaded by users |

---

## ▶️ Running the Project

### Start the backend

Inside the `talentlaunch-backend/` folder:

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start
```

You should see:

```
✅  MySQL connected successfully
🚀  TalentLaunch API running on http://localhost:5000
```

### Serve the frontend

Open a **second terminal** from the root project folder:

```bash
npx serve .
```

Or simply open `index.html` directly in your browser.

---

## ☁️ Deploying on GitHub Codespaces

GitHub Codespaces gives every port its own public URL. Follow these steps:

### 1. Start the backend
```bash
cd talentlaunch-backend
npm run dev
```

### 2. Find your backend URL
- In VS Code, click the **Ports** tab at the bottom
- Find port `5000`
- Copy the **Forwarded Address** — it looks like:
  ```
  https://your-codespace-name-5000.app.github.dev
  ```

### 3. Update the frontend API URL
Open `js/api.js` and update line 4:

```js
// Change this:
const API_BASE = 'http://localhost:5000/api';

// To your Codespace URL:
const API_BASE = 'https://your-codespace-name-5000.app.github.dev/api';
```

### 4. Make port 5000 public
In the **Ports** tab, right-click port `5000` → **Port Visibility** → set to **Public**.
This allows your frontend to reach the backend without authentication errors.

### 5. Serve the frontend
In a second terminal from the root folder:
```bash
npx serve .
```
Codespaces will give the frontend its own URL too (usually port `3000`).

---

## 🔌 API Reference

All endpoints are prefixed with `/api`. Base URL: `http://localhost:5000`

---

### 🔑 Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create a new account |
| POST | `/login` | Public | Login and receive a JWT token |
| GET | `/me` | 🔒 User | Get the currently logged-in user |

**Register — request body:**
```json
{
  "name": "Amina Uwera",
  "email": "amina@example.com",
  "password": "secure123",
  "location": "Kigali"
}
```

**Login — request body:**
```json
{
  "email": "amina@example.com",
  "password": "secure123"
}
```

**Login — response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Amina Uwera",
    "email": "amina@example.com",
    "role": "youth",
    "location": "Kigali"
  }
}
```

> 💡 Save the token and include it in all protected requests:
> `Authorization: Bearer <your_token>`

---

### 🤝 Mentors — `/api/mentors`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all active mentors |
| GET | `/:id` | Public | Get one mentor + their workshops |
| POST | `/` | 🔒 Admin | Add a new mentor |
| PUT | `/:id` | 🔒 Admin | Update mentor details |
| DELETE | `/:id` | 🔒 Admin | Remove a mentor |

**Add mentor — multipart/form-data fields:**
```
name          (required)
email         (required)
specialty     (required)
bio           (optional)
contact_info  (optional)
avatar        (optional — image file)
```

---

### 📚 Workshops — `/api/workshops`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all workshops — filter with `?status=upcoming` |
| GET | `/:id` | Public | Get a single workshop with details |
| POST | `/` | 🔒 Admin | Create a new workshop |
| PUT | `/:id` | 🔒 Admin | Update workshop details |
| DELETE | `/:id` | 🔒 Admin | Delete a workshop |
| POST | `/:id/enroll` | 🔒 User | Enroll in a workshop |
| DELETE | `/:id/enroll` | 🔒 User | Unenroll from a workshop |

**Create workshop — request body:**
```json
{
  "title": "Photography Basics",
  "description": "Learn the fundamentals of photography.",
  "mentor_id": 1,
  "date": "2026-04-05T09:00:00",
  "location": "Kigali Innovation Centre",
  "capacity": 25
}
```

**Workshop status values:** `upcoming` · `live` · `completed` · `cancelled`

---

### ⭐ Talents — `/api/talents`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all talents — filter with `?category=` or `?user_id=` |
| GET | `/:id` | Public | Get one talent (also increments view count) |
| POST | `/` | 🔒 User | Upload a new talent |
| PUT | `/:id` | 🔒 Owner | Edit your talent |
| DELETE | `/:id` | 🔒 Owner/Admin | Delete a talent |

**Upload talent — multipart/form-data fields:**
```
title        (required)
description  (required)
category     (required — e.g. "Visual Arts", "Technology")
file         (optional — image, PDF, audio, or video — max 10MB)
```

---

### 🩺 Health Check

```
GET /api/health
```
```json
{ "success": true, "message": "TalentLaunch API is running 🚀", "env": "development" }
```

Use this to confirm the server is up before testing other endpoints.

---

## 🔐 Admin Access

Users who register get the `youth` role by default. To make yourself an admin, run this in MySQL after registering:

```sql
USE talentlaunch;
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

As an admin you can:
- Add, edit, and remove mentors
- Create, update, and delete workshops
- Delete any talent post

---

## 🖥️ Frontend Pages

| File | Description |
|------|-------------|
| `index.html` | Public homepage with hero, features, mentors section, and CTA |
| `login.html` | Sign In / Create Account with tab switcher — connects to `/api/auth` |
| `dashboard.html` | Protected — shows live stats, workshops, and mentors loaded from the API |
| `showcase.html` | Protected — upload talents with file attachment, view and delete community posts |
| `js/api.js` | Shared JS layer — all API calls, token management, and UI helpers |

> All protected pages redirect to `login.html` automatically if no valid token is found.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| Backend | Node.js v18+, Express.js |
| Database | MySQL 8 with mysql2/promise |
| Auth | JSON Web Tokens (JWT) + bcryptjs password hashing |
| File Uploads | Multer |
| Validation | express-validator |
| Dev Tools | nodemon, dotenv |

---

## 📝 Additional Notes

- The `uploads/` folder is created automatically on first file upload — no need to create it manually
- JWT tokens expire after **7 days** by default — change `JWT_EXPIRES_IN` in `.env` to adjust
- File uploads are capped at **10MB** — change `MAX_FILE_SIZE_MB` in `.env` to adjust
- In development, CORS is open to all origins (`*`) — in production, update `server.js` to restrict it to your frontend domain

---

*© 2026 TalentLaunch Rwanda — Empowering youth across Rwanda.* 🇷🇼
