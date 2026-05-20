# Aegis Phish Lab

**Human Attack Surface Training Platform**

Aegis Phish Lab is a production-grade cybersecurity awareness SaaS monorepo for local development and cloud deployment.

## Monorepo Structure

```text
aegis-phish-lab/
├── frontend/
│   └── app/                 # Next.js frontend package
├── backend/                 # Go Gin backend service
├── infra/                   # Docker, NGINX, and Kubernetes manifests
├── docs/                    # Architecture and deployment documentation
├── .github/                 # CI/CD workflows
├── docker-compose.yml       # Local development stack definition
├── docker-compose.prod.yml  # Production container stack definition
└── README.md                # Project overview and setup
```

## Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript
- TailwindCSS
- shadcn-style UI components
- Framer Motion
- Zustand
- React Query
- Axios

### Backend
- Go 1.23
- Gin framework
- GORM ORM
- PostgreSQL
- JWT authentication
- Redis-ready cache architecture
- Clean architecture layers

### Database
- PostgreSQL
- Supabase compatible
- Models for users, organizations, departments, campaigns, and tracking events

### Deployment
- Docker Compose local deployment
- Frontend deployable to Vercel
- Backend deployable to Render / Railway
- Kubernetes manifests in `infra/k8s`
- GitHub Actions CI/CD

## Core Features

- Authentication: register, login, logout
- JWT tokens with bcrypt password hashing
- Protected API routes and RBAC roles
- Organization and department management
- Campaign creation, scheduling, updating, and deletion
- Tracking of opens, clicks, IP address, user agent, and timestamps
- Admin dashboards and campaign statistics
- Secure CORS and headers
- Rate limiting and input validation

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 10+
- Go 1.23+
- Docker

### Install dependencies

```bash
pnpm install
```

### Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/app/.env.local.example frontend/app/.env.local
```

### Start local stack

```bash
docker-compose up -d
```

### Access services

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`

## Backend API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/organizations`
- `POST /api/organizations`
- `GET /api/organizations/:id`
- `GET /api/organizations/:id/departments`
- `POST /api/organizations/:id/departments`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `GET /api/campaigns/:id`
- `PUT /api/campaigns/:id`
- `DELETE /api/campaigns/:id`
- `GET /api/campaigns/:id/stats`
- `POST /api/tracking`
- `GET /api/dashboard/overview`

## Deployment

- Local: `docker-compose up -d`
- Developer Docker stack: `infra/docker/docker-compose.dev.yml`
- Kubernetes: manifests under `infra/k8s`
- CI: `.github/workflows/ci.yml`
- Deploy: `.github/workflows/deploy.yml`

## Documentation

- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`

## Notes

This repository is designed for scalable SaaS development with environment-driven configuration, modular code structure, and secure production defaults.
