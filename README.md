# TalentLaunch Rwanda

A simple full-stack web app for Rwandan talent discovery.

- Frontend: HTML/CSS/JS (admin/dashboard/showcase)
- Backend: Node.js + Express + MySQL
- Auth: JWT + role-based admin protection

## Quick start (local)

1. Ensure Docker is running.
2. In project root:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
3. Verify:
   - Frontend: https://improved-parakeet-q74p7qq54pwx26xwq-3000.app.github.dev/
   - API: https://improved-parakeet-q74p7qq54pwx26xwq-5000.app.github.dev/api/health
4. Open the app in browser:
   - https://improved-parakeet-q74p7qq54pwx26xwq-3000.app.github.dev/login.html

## Admin account (pre-seeded)

- Email: `admin@talentlaunch.rw`
- Password: `Admin1234`

> If not present, run once in MySQL:
> ```sql
> USE talentlaunch;
> INSERT INTO users (name,email,password,role,location)
> VALUES ('Admin User','admin@talentlaunch.rw','$2a$12$8lgiZNKr1.4UYAlvQ6M2duAgaP0HcXiQNrqBaxjsiWSIdbZY5wwL.','admin','Kigali');
> ```

## How to use

1. Login using admin credentials.
2. Visit admin panel: `/admin.html`.
3. Add mentors, workshops, talents.
4. Use dashboard for data stats.

## API endpoints

- `POST /api/auth/login` (body: email, password)
- `POST /api/auth/register` (name, email, password, location)
- `POST /api/auth/admin` (admin only)
- `GET /api/mentors`, `POST /api/mentors` (admin)
- `GET /api/workshops`, `POST /api/workshops` (admin)
- `GET /api/talents`, `POST /api/talents` (user)

## Docker cleanup

```bash
docker-compose down
```

## Notes

- `admin.html` requires valid auth token and admin role.
- If app shows Access Denied, clear localStorage token and login again.
- In GitHub Codespaces, use port 3000 URL for UI and 5000 for API.
