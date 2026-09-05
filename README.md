# Evotec Full-Stack Technical Assignment

A full-stack web app with customer/admin authentication, role-based access control, and a
form submission system with filtering and search — built for the Evotec Full-Stack Software
Developer technical assignment.

## Project description

Customers register, log in, and submit an application form. Admins log in separately, and can
view, search, filter, edit, and delete all submitted forms from a dashboard. Access to every
route is enforced with JWT auth and role-based middleware, not just hidden in the UI.

## Tech stack

| Layer      | Choice                                              |
|------------|------------------------------------------------------|
| Frontend   | Next.js 14 (App Router), React 18, Tailwind CSS      |
| Backend    | Node.js, Express.js                                  |
| Database   | PostgreSQL, via Prisma ORM                            |
| Auth       | JWT (access + refresh tokens), bcrypt password hashing |
| Validation | express-validator (server), inline checks (client)    |

## Project structure

```
evotec-assignment/
├── backend/          Express API, Prisma schema, controllers, routes
├── frontend/          Next.js app (App Router)
└── README.md          this file
```

Each folder also has its own `.env.example` — see setup steps below.

---

## Prerequisites

- Node.js 18 or newer (check with `node -v`)
- npm 9 or newer
- PostgreSQL 14+ running locally, or a hosted Postgres URL (Neon, Supabase, Railway, etc. all work)
- git
- Internet access — `next/font/google` fetches the Inter and Newsreader font files from Google
  Fonts the first time you build or run the frontend; a fully offline network will fail the build.

---

## 1. Get the code

Unzip the project, or clone it if you've pushed it to GitHub:

```bash
cd evotec-assignment
```

You should see two folders: `backend/` and `frontend/`.

---

## 2. Backend setup

```bash
cd backend
npm install
```

### 2.1 Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Open `.env` and set at minimum:

- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings (e.g. run `openssl rand -hex 64` twice)
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credentials for the first admin account

If you don't have Postgres installed locally, the fastest option is a free
[Neon](https://neon.tech) or [Supabase](https://supabase.com) database — create one, copy the
connection string it gives you into `DATABASE_URL`.

### 2.2 Create the database schema

This runs Prisma's migration against your database and generates the Prisma client:

```bash
npx prisma migrate dev --name init
```

### 2.3 Seed the first admin account

There's no public "become an admin" endpoint on purpose — admin creation is itself an
admin-only route. To bootstrap the very first admin, run the seed script:

```bash
npm run seed
```

This creates one admin account using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your
`.env` file. Use these credentials to log in at `/admin/login`, and from there you can create
additional admin accounts through the dashboard ("+ New admin").

### 2.4 Run the backend

```bash
npm run dev
```

The API starts on `http://localhost:5000` (or whatever `PORT` you set). Confirm it's up:

```bash
curl http://localhost:5000/api/health
```

---

## 3. Frontend setup

Open a **new terminal** (keep the backend running) and:

```bash
cd frontend
npm install
```

### 3.1 Configure environment variables

```bash
cp .env.example .env.local
```

By default `NEXT_PUBLIC_API_URL` points to `http://localhost:5000/api`, which matches the
backend's default port. Change it if you changed `PORT` in the backend `.env`.

### 3.2 Run the frontend

```bash
npm run dev
```

Visit `http://localhost:3000`.

---

## 4. Try it out

1. Go to `http://localhost:3000/register` and create a customer account.
2. Log in at `/login`, then submit the application form at `/application`.
3. Log in as admin at `/admin/login` using the seeded credentials from step 2.3.
4. On `/admin/dashboard`, search, filter by gender, edit, or delete submissions.
5. Use "+ New admin" on the dashboard to create additional admin accounts — the temporary
   password is shown once, so save it.

---

## Environment variables reference

### Backend (`backend/.env`)

| Variable                 | Description                                         |
|---------------------------|------------------------------------------------------|
| `PORT`                    | Port the API listens on (default `5000`)            |
| `NODE_ENV`                | `development` or `production`                        |
| `CORS_ORIGIN`             | Allowed frontend origin(s), comma-separated           |
| `DATABASE_URL`            | PostgreSQL connection string                          |
| `JWT_ACCESS_SECRET`       | Secret used to sign access tokens                     |
| `JWT_REFRESH_SECRET`      | Secret used to sign refresh tokens                    |
| `JWT_ACCESS_EXPIRES_IN`   | Access token lifetime (default `15m`)                 |
| `JWT_REFRESH_EXPIRES_IN`  | Refresh token lifetime (default `7d`)                 |
| `SEED_ADMIN_EMAIL`        | Email used by `npm run seed`                          |
| `SEED_ADMIN_PASSWORD`     | Password used by `npm run seed`                       |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window in ms                                |
| `RATE_LIMIT_MAX`          | Max requests per window per IP                         |

### Frontend (`frontend/.env.local`)

| Variable               | Description                          |
|--------------------------|---------------------------------------|
| `NEXT_PUBLIC_API_URL`   | Base URL of the backend API           |

---

## API endpoint documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require an `Authorization: Bearer <accessToken>` header.
All responses follow the shape `{ success, message?, data?, errors? }`.

### Auth

| Method | Endpoint                | Access          | Description                                  |
|--------|--------------------------|-----------------|-----------------------------------------------|
| POST   | `/auth/register`         | Public          | Register a new customer                       |
| POST   | `/auth/customer/login`   | Public          | Log in as customer, returns tokens             |
| POST   | `/auth/admin/login`      | Public          | Log in as admin, returns tokens                |
| POST   | `/auth/admin/create`     | Admin           | Create a new admin, returns a temp password    |
| POST   | `/auth/refresh`          | Public          | Exchange refresh token for a new access token  |
| POST   | `/auth/logout`           | Public          | Revoke a refresh token                         |
| GET    | `/auth/me`               | Authenticated   | Get the current user's profile                 |

**Register**
```
POST /auth/register
{ "email": "jane@example.com", "password": "abcd", "confirmPassword": "abcd" }
```

**Customer / Admin login**
```
POST /auth/customer/login   (or /auth/admin/login)
{ "email": "jane@example.com", "password": "abcd" }

→ { "success": true, "data": { "user": {...}, "accessToken": "...", "refreshToken": "..." } }
```

**Create admin** (requires an admin's access token)
```
POST /auth/admin/create
Authorization: Bearer <admin access token>
{ "email": "new-admin@evotec.software" }

→ { "success": true, "data": { "user": {...}, "temporaryPassword": "..." } }
```

### Submissions

| Method | Endpoint             | Access    | Description                                       |
|--------|-----------------------|-----------|-----------------------------------------------------|
| POST   | `/submissions`         | Customer  | Create a submission                                 |
| GET    | `/submissions`         | Admin     | List submissions — supports filter/search/pagination |
| GET    | `/submissions/:id`     | Admin     | Get one submission                                   |
| PUT    | `/submissions/:id`     | Admin     | Update a submission                                   |
| DELETE | `/submissions/:id`     | Admin     | Delete a submission                                   |

**Create submission** (requires a customer's access token)
```
POST /submissions
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "gender": "FEMALE",
  "mobileNumber": "0917 123 4567",
  "address": "123 Main St",
  "feedback": "Optional comment"
}
```

**List / filter / search submissions** (requires an admin's access token)
```
GET /submissions?gender=FEMALE&search=jane&page=1&limit=20
```
- `gender` — one of `MALE`, `FEMALE`, `OTHER`
- `search` — matches first OR last name, case-insensitive, partial match
- `page`, `limit` — pagination

**Update submission**
```
PUT /submissions/:id
{ "firstName": "Updated Name" }   // any subset of fields
```

**Delete submission**
```
DELETE /submissions/:id
```

---

## Security notes

- Passwords are hashed with bcrypt (12 salt rounds) — never stored in plain text.
- Access tokens are short-lived (15 min default); refresh tokens are longer-lived (7 days),
  stored server-side as a SHA-256 hash (not the raw token), and rotated on every refresh so a
  stolen refresh token can't be replayed indefinitely.
- Every protected route checks both a valid JWT **and** the correct role — customer and admin
  routes are fully separated at the middleware level, not just hidden in the UI.
- Login responses use the same generic error message for "no such user" and "wrong password"
  to avoid leaking which emails are registered.
- Global and auth-specific rate limiting is applied to slow down brute-force attempts.
- `helmet` sets standard security headers; CORS is restricted to the configured frontend origin.
- All request bodies are validated server-side with `express-validator` — the frontend checks
  are a UX convenience, not the source of truth.

## Known limitations / things to improve for real production use

- New admins log in with a temporary password shown once; there's no forced "change password
  on first login" flow (out of scope for this assignment, but noted).
- Refresh tokens are stored in `localStorage` on the frontend for simplicity; a stricter setup
  would use an httpOnly cookie for the refresh token.
- No automated test suite is included; given more time this would include Jest/Supertest
  coverage for the API and React Testing Library coverage for the frontend.
