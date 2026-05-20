# Aegis Phish Lab Architecture

## Overview

Aegis Phish Lab is designed as a modular monorepo with separate frontend and backend packages, shared infrastructure, and deployment-ready infrastructure files.

## Monorepo Structure

- `frontend/app/` — Next.js 15 frontend application with TailwindCSS and authentication UI
- `backend/` — Golang Gin backend with clean architecture, GORM, and JWT auth
- `infra/` — Docker, NGINX, and Kubernetes manifests
- `docs/` — architecture and deployment documentation
- `.github/` — CI/CD workflows

## Backend Architecture

The backend uses layered architecture:
- `cmd/main.go` — application bootstrap and dependency wiring
- `internal/config/` — environment and config loading
- `internal/database/` — database initialization and migrations
- `internal/models/` — Postgres models and GORM hooks
- `internal/repositories/` — data access repository layer
- `internal/services/` — business logic and use cases
- `internal/handlers/` — HTTP handlers
- `internal/middleware/` — authentication, CORS, security, and rate limiting
- `internal/routes/` — route definitions
- `pkg/cache/` — Redis-ready cache client
- `pkg/utils/` — JWT, password hashing, response helpers

## Frontend Architecture

The frontend is a Next.js app with:
- App Router based layout and pages
- Zustand for auth state and session management
- React Query for data fetching
- Axios client with JWT support
- TailwindCSS styling and custom design system
- Reusable UI components

## Database Model

The Postgres schema includes:
- `users`
- `organizations`
- `departments`
- `campaigns`
- `email_templates`
- `campaign_targets`
- `tracking_events`

## Deployment Modes

- Local development via `docker-compose.yml`
- Production via `docker-compose.prod.yml`
- Cloud frontend deployment on Vercel
- Cloud backend deployment on Render/Railway
- Postgres hosted on Supabase
- Kubernetes deployment manifests under `infra/k8s`
