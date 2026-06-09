# Smart Project & Task Collaboration System

A production-ready full-stack SaaS project management platform similar to Jira, Trello, ClickUp, and Asana. Built with Next.js 15, NestJS, PostgreSQL, and Prisma.

## Project Overview

SmartCollab provides comprehensive project and task management with:

- JWT authentication with refresh tokens and demo login
- Role-based access control (Admin, Project Manager, Team Member)
- Project and task management with validation rules
- Team collaboration with member workload tracking
- Analytics dashboard with Recharts visualizations
- Activity logging and in-app notifications
- Search, filtering, sorting, and server-side pagination
- Dark/light mode with localStorage persistence
- Cloudinary file upload support for task attachments
- Swagger API documentation

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Zustand
- Recharts
- Axios

### Backend
- NestJS
- TypeScript
- JWT + Passport.js
- Class Validator
- Prisma ORM
- Swagger

### Database
- PostgreSQL

## Prerequisites

- Node.js 20.19+ (or 22.12+)
- PostgreSQL 14+
- npm
- (Optional) Cloudinary account for file uploads

## Quick Start

### 1. Clone and install

```bash
cd smart-project-collaboration

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

**Backend** (`backend/.env`):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_collab?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Project Manager | manager@example.com | password123 |
| Team Member | member@example.com | password123 |

Use the **Quick Demo Login** buttons on the login page for one-click access.

## Prisma Commands

```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create and apply migrations
npx prisma db seed       # Seed demo data
npx prisma studio        # Open Prisma Studio GUI
npx prisma migrate reset # Reset database (destructive)
```

## API Documentation

Swagger documentation is auto-generated and available at:

```
http://localhost:3001/api/docs
```

### Key Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/signup`, `/login`, `/refresh`, `/logout`, `/demo/*` |
| Users | `GET /users`, `GET /users/:id/summary` |
| Projects | `CRUD /projects`, `POST /projects/:id/members` |
| Tasks | `CRUD /tasks` with filters and pagination |
| Comments | `POST /comments`, `GET /comments/task/:taskId` |
| Attachments | `POST /attachments/:taskId` (multipart) |
| Notifications | `GET /notifications`, `PATCH /notifications/:id/read` |
| Activity Logs | `GET /activity-logs` |
| Dashboard | `GET /dashboard` |

## Role Permissions

| Feature | Admin | Project Manager | Team Member |
|---------|-------|-----------------|-------------|
| Manage all users | Yes | No | No |
| Create/edit/delete projects | Yes | Yes | No |
| Add/remove members | Yes | Yes | No |
| Create/assign tasks | Yes | Yes | No |
| Update task status | Yes | Yes | Assigned only |
| Add comments | Yes | Yes | Yes |
| View analytics | Yes | Yes | Limited |

## Task Validation Rules

1. **Duplicate titles** — Tasks cannot share the same title within a project
2. **Reassignment** — Completed tasks cannot be reassigned
3. **Past dates** — Due dates must be today or in the future

## Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel, set root to `frontend/`
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
4. Deploy

### Backend (Render / Railway)

1. Create a new Web Service
2. Set root directory to `backend/`
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npx prisma migrate deploy && npm run start:prod`
5. Add environment variables from `.env.example`
6. Attach a PostgreSQL database and set `DATABASE_URL`

### Database (PostgreSQL)

- **Render**: Create a PostgreSQL instance and copy the internal connection URL
- **Railway**: Add PostgreSQL plugin and use the provided `DATABASE_URL`
- **Supabase**: Use the connection pooling URL for production

## Project Structure

```
smart-project-collaboration/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── projects/
│       ├── tasks/
│       ├── comments/
│       ├── attachments/
│       ├── notifications/
│       ├── activity-logs/
│       ├── dashboard/
│       └── common/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
└── README.md
```

## License

MIT
