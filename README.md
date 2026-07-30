# Nnawa — Nigerian Nutrition Awareness Web Application

Nnawa is an educational web application that helps people understand the
nutritional content of packaged foods commonly available in Nigeria. Users
search for a product, view its nutrition facts and a plain-language health
indicator, read about any nutritional concerns, and discover healthier
packaged and whole-food alternatives. An admin dashboard lets an
administrator maintain the product database without touching the code.

## Live demo

- **URL:** https://nnawa.duckdns.org
- **Admin login:** https://nnawa.duckdns.org/admin/login
  - Email: `nnawa_admin@gmail.com`
  - Password: `Success100%`

The admin credentials are demo credentials provided for evaluation.

## Tech stack

| Layer            | Technology            |
| ---------------- | --------------------- |
| Frontend         | React + Vite          |
| Backend          | Node.js + Express     |
| Database         | SQLite (better-sqlite3) |
| Session storage  | SQLite (better-sqlite3-session-store) |
| Auth             | express-session + bcrypt |

## API

The backend exposes a REST API under the `/api/v1` prefix. See
[API.md](API.md) for full endpoint documentation, including request and
response formats and authentication requirements.

## Features

- Search packaged food products by name
- Product details: nutrition facts, health indicator, nutritional concerns
- Health indicators: Healthier Choice, Consume in Moderation, High
  Nutritional Concern
- Healthier processed and whole-food alternative recommendations
- Admin dashboard with full create, read, update, and delete of products
  and all related data
- Single-administrator authentication with hashed passwords and
  session-based login

Nutritional values, health indicators, concerns, and recommendations are
curated manually and are not generated automatically by the application.

## Requirements

- Node.js 18 or later
- npm

## Running locally

The project has two parts: `backend/` (Express API + SQLite) and
`frontend/` (React). In development they run as two servers; the frontend
proxies API requests to the backend.

### 1. Clone

```bash
git clone https://github.com/Bangnyfe/Nigerian_Nutrition_Awareness_Web_Application_Nnawa.git
cd Nigerian_Nutrition_Awareness_Web_Application_Nnawa
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set at least `ADMIN_PASSWORD` (minimum 8 characters). In
development you can leave `SESSION_SECRET` blank. A development fallback is
used with a warning. Example development `.env`:

Start the backend:

```bash
npm run dev
```

On first startup the database is created and seeded, and the administrator
account is created automatically from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if
one does not already exist. The backend runs on http://localhost:4000.

To change the administrator password later, update `ADMIN_PASSWORD` in
`.env` and run:

```bash
npm run create-admin
```

This rotates the password and signs out any active sessions. It does not
create a second administrator — the application supports one.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on http://localhost:5173 and proxies API requests to the
backend.

### 4. Log in

Open http://localhost:5173, go to `/admin/login`, and sign in with the
`ADMIN_EMAIL` and password that YOU set from the backend `.env`.

## Production build (single service)

In production, Express serves the built React app and the API from one
port. To build and run this way locally:

```bash
cd frontend && npm run build      # produces frontend/dist
cd ../backend
NODE_ENV=production npm start
```

With `NODE_ENV=production`, the backend serves the built frontend on its own
port and handles client-side routes (for example, refreshing `/about` works
without a 404). `SESSION_SECRET` is required in production.

## Deployment

The live instance runs on an Oracle Cloud (Always Free) Ubuntu VM as a
single service:

- The React app is built and served by Express in production mode.
- **PM2** runs the app and restarts it on crash or server reboot.
- **Nginx** sits in front as a reverse proxy.
- **Let's Encrypt** provides HTTPS, with automatic renewal.
- The SQLite database lives on the VM's persistent disk, so data survives
  restarts and redeploys.

Environment variables (`SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
and the database paths) are configured on the server and are not committed
to the repository.

## Project structure

```
.
├── backend/          Express API, SQLite database, admin auth
│   └── src/
│       ├── routes/         API endpoints
│       ├── controllers/    request handling
│       ├── services/       database access (all SQL lives here)
│       ├── middleware/     auth guard, error handling
│       ├── database/       schema, seed, admin bootstrap
│       └── config/         env and session configuration
└── frontend/         React + Vite user interface
    └── src/
        ├── pages/          route-level pages
        ├── components/     shared UI components
        ├── context/        authentication state
        └── services/       API client
```

## Notes

- The application supports a single administrator. There is no public
  registration, password reset, or multi-user management by design.
- Nutritional data is curated manually; the application does not compute or
  invent nutritional assessments.
