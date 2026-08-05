# Job Application Tracker

A full-stack app for tracking job applications — company, position, status, and interview notes — all in one place.

Built as a learning project to practice React, REST APIs, and PostgreSQL, and later extended with Docker for local development.

## Features

- Add, view, update, and delete job applications
- Track status through the pipeline: Applied → Interview → Offer / Rejected
- Attach interview notes and follow-up reminders to each application
- Search by company or position, filter by status
- At-a-glance stats: total applications and count per status
- Custom toast notifications and confirm dialogs (no browser `alert`/`confirm`)

## Tech Stack

**Frontend**
- React (Vite)
- Vanilla CSS with custom design tokens
- React Context API for toast & confirm dialog state

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL

**Infrastructure**
- Docker & Docker Compose for local development

## Project Structure

```
job-tracker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # database schema
│   │   └── migrations/
│   ├── src/
│   │   ├── index.js            # Express server entry point
│   │   ├── prisma.js           # shared Prisma Client instance
│   │   └── routes/
│   │       ├── applications.js
│   │       └── notes.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api.js              # API client functions
│   │   └── App.jsx
│   └── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Option A — Run with Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

```bash
docker compose up --build
```

This starts three containers: PostgreSQL, the Express API, and the React dev server, all networked together.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Option B — Run manually

Requires Node.js and a local PostgreSQL instance.

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env   # then edit DATABASE_URL with your local Postgres credentials
npx prisma migrate dev
npm run dev
```

**2. Frontend** (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```

## API Overview

| Method | Endpoint                              | Description                    |
|--------|----------------------------------------|---------------------------------|
| GET    | `/api/applications`                    | List all applications          |
| GET    | `/api/applications/:id`                | Get one application + its notes|
| POST   | `/api/applications`                    | Create an application          |
| PUT    | `/api/applications/:id`                | Update an application          |
| DELETE | `/api/applications/:id`                | Delete an application          |
| GET    | `/api/applications/:appId/notes`       | List notes for an application  |
| POST   | `/api/applications/:appId/notes`       | Add a note or reminder         |
| PUT    | `/api/notes/:id`                       | Update a note                  |
| DELETE | `/api/notes/:id`                       | Delete a note                  |

## Database Schema

Two tables with a one-to-many relationship:

- **Application** — company, position, status, job URL, applied date
- **Note** — content, type (interview note / reminder), optional reminder date, linked to one application

## What I Learned

- Building a REST API with Express and connecting it to PostgreSQL via Prisma
- Designing a relational schema with one-to-many relationships
- Managing state in React with hooks (`useState`, `useEffect`) and the Context API
- Containerizing a multi-service app with Docker Compose, including service discovery between containers

## License

This project is for personal portfolio use.
