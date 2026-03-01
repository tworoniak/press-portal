# 🎤 Press Contact Portal 🤘

A full-stack Press Contact Management Portal for tracking publicists, managers, labels, and media contacts for bands and festivals.

Built as a modern TypeScript monorepo using React, NestJS, Prisma, and PostgreSQL.

---

## 🚀 Tech Stack

### Frontend

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Axios

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

- ✅ Contacts CRUD
- ✅ Contact detail view
- ✅ Interaction logging (email, call, DM, note, etc.)
- ✅ Timeline per contact
- ✅ Auto-update lastContactedAt when interaction is created
- ✅ Prisma relational schema (Contacts, Bands, Festivals, Interactions)
- ✅ Dockerized PostgreSQL

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

- 🔍 Search & filtering (status, tags, follow-ups)
- 📅 Follow-up dashboard (nextFollowUpAt)
- 🎟 Festival credential tracking
- 📊 “Needs follow-up” smart sorting
- 🧾 CSV import/export
- 🔐 Auth + multi-workspace support
- 📄 Swagger API documentation

---
