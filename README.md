# 🎤 PressPilot v1.2 🤘

A full-stack Press Contact Management Portal for tracking publicists, managers, labels, and media contacts for bands and festivals.

Built as a modern TypeScript monorepo using React, NestJS, Prisma, and PostgreSQL.

---

## Live Demo

Live Demo is unavailable at the moment. Vercel deployment is planned.

![Press Contact Portal screen 1.](/apps/web/src/assets/screen-01.png 'Press Contact Portal screen 1.')
![Press Contact Portal screen 2.](/apps/web/src/assets/screen-02.png 'Press Contact Portal screen 2.')
![Press Contact Portal screen 3.](/apps/web/src/assets/screen-03.png 'Press Contact Portal screen 3.')
![Press Contact Portal screen 4.](/apps/web/src/assets/screen-04.png 'Press Contact Portal screen 4.')
![Press Contact Portal screen 5.](/apps/web/src/assets/screen-05.png 'Press Contact Portal screen 5.')
![Press Contact Portal screen 6.](/apps/web/src/assets/screen-06.png 'Press Contact Portal screen 6.')
![Press Contact Portal screen 7.](/apps/web/src/assets/screen-07.png 'Press Contact Portal screen 7.')
![Press Contact Portal screen 8.](/apps/web/src/assets/screen-08.png 'Press Contact Portal screen 8.')
![Press Contact Portal screen 9.](/apps/web/src/assets/screen-09.png 'Press Contact Portal screen 9.')

---

## 🚀 Tech Stack

### Frontend

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- SCSS modules (shared layout and list patterns)
- Recharts (dashboard charts)

### Backend

- NestJS (TypeScript)
- Prisma ORM (v7)
- PostgreSQL
- Docker (for local DB)

### Tooling

- pnpm workspaces (monorepo)
- ESLint (flat config)
- TypeScript strict mode

---

## 🗂 Monorepo Structure

```code
press-portal/
│
├── apps/
│   ├── web/        # React frontend (Vite)
│   └── api/        # NestJS backend
│
├── packages/
│   └── shared/     # Shared types/schemas (optional)
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

---

## 🧠 Core Data Model

### Contact

- Name / Display Name
- Role (Publicist, Manager, Label, etc.)
- Company
- Email / Phone
- Tags
- Status
- lastContactedAt

### Interaction

- Type (EMAIL, CALL, DM, NOTE, etc.)
- Subject
- Notes
- Outcome
- nextFollowUpAt
- Linked to Contact (optionally Band or Festival)

### Band & Festival

- Basic profile info
- Many-to-many relationship with Contacts
- Associated Interactions

---

## ✨ Current Features

**Data & API**

- Contacts, bands, and festivals CRUD
- JWT authentication
- Prisma relational schema (Contacts, Bands, Festivals, Interactions)
- Interaction logging with auto-update of `lastContactedAt` (transactional)
- Dockerized PostgreSQL; Prisma migrations committed

**App behavior**

- Dashboard: KPIs (Due / Due soon / Scheduled link to the follow-up queue), follow-up pipeline charts, recent activity, upcoming festivals
- **Follow-ups** page (`/follow-ups`): full queue of interactions with a next follow-up date, filterable (All / Due / Due soon / Scheduled); API: `GET /dashboard/follow-up-queue`
- Contact detail: profile, tags, linked bands/festivals, interaction timeline
- Band & festival detail: profile and linked press contacts; recent interactions for that entity (band/festival APIs include interaction history)
- Contacts list: search and filters (status, tag, needs follow-up), with **filters reflected in the URL** (`q`, `status`, `tag`, `followup`) for bookmarking and sharing
- Command palette for quick navigation and creates
- Responsive list views: **card-based lists** (`ResourceList`) for Contacts, Bands, and Festivals—one pattern for all breakpoints (no separate desktop table vs mobile cards)
- Detail pages: **two-column layout** (details left, interactions right) for Contact, Band, and Festival, using shared layout styles (`EntityDetailLayout`)

---

## 🏃 Running locally

1. **Database** — from the repo root:

   ```bash
   docker compose up -d
   ```

2. **Environment** — set `DATABASE_URL` in `apps/api/.env` (PostgreSQL URL matching `docker-compose.yml`, e.g. user `postgres`, database `press_portal`).

3. **Install & migrate**:

   ```bash
   pnpm install
   pnpm --filter @press/api exec prisma generate
   pnpm --filter @press/api exec prisma migrate deploy
   ```

4. **Dev servers** (API + Vite):

   ```bash
   pnpm dev
   ```

   Or run separately: `pnpm dev:web` / `pnpm dev:api`.

The API listens on **http://localhost:3000** by default. Vite defaults to **http://localhost:5173** (CORS allows common localhost ports). The web client uses `VITE_API_URL` if set; otherwise it defaults to `http://localhost:3000`.

---

## 🛠 Architecture Notes

- Prisma v7 uses driver adapters (@prisma/adapter-pg)
- Prisma Client is wrapped in a global PrismaService inside NestJS
- Interactions are created inside a transaction to update lastContactedAt
- TanStack Query handles API state + cache invalidation
- Monorepo uses pnpm workspaces for shared dependency graph

---

## 🔐 Environment & Git

- .env files are NOT committed
- node_modules is NOT committed
- Prisma migrations ARE committed
- Docker is used for consistent local DB setup

---

## 🗺 Roadmap

- CSV import/export
- Calendar or richer sorting for follow-ups (beyond the current queue + filters)
- Reminders or notifications for due follow-ups
- Auth hardening + multi-workspace / multi-user
- Swagger API documentation

---
