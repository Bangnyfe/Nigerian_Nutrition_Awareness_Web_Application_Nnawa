# Nnawa — Nigerian Nutrition Awareness Web Application

Educational web application that helps users interpret the nutritional
information of packaged food products commonly available in Nigeria.

## Requirements

- Node.js 18 or later
- npm

## Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Frontend         | React + Vite      |
| Backend          | Node.js + Express |
| Database         | SQLite            |
| Database library | better-sqlite3    |

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The database file is created automatically on first launch.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on http://localhost:5173 and proxies `/api` requests
to the backend during development.

## Project structure

## Notice

Nutritional values, health summaries, nutritional concerns and
alternative recommendations are curated manually and are not generated
by the application. Products seeded during development contain names and
categories only.
