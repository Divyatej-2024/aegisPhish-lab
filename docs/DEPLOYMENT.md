# Deployment Guide

## Local Development

1. Copy `.env` files:

```bash
cp backend/.env.example backend/.env
cp frontend/app/.env.local.example frontend/app/.env.local
```

2. Install dependencies:

```bash
pnpm install
```

3. Start local stack:

```bash
docker-compose up -d
```

4. Open services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/api`

## Production Deployment

### Frontend on Vercel

1. Connect repository in Vercel.
2. Set `ROOT` or build directory to `frontend/app`.
3. Add environment variable:

```text
NEXT_PUBLIC_API_URL=https://<your-backend-host>/api
```

4. Deploy.

### Backend on Render or Railway

1. Create a new web service.
2. Set build command:

```bash
go build -o aegisphish-backend ./backend/cmd/main.go
```

3. Set start command:

```bash
./aegisphish-backend
```

4. Add environment variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `REDIS_URL`

### Database on Supabase

1. Create a Supabase project.
2. Copy `DATABASE_URL` to your backend service.
3. Use `backend/schema.sql` to initialize the schema.

## Kubernetes Deployment

Apply manifests in `infra/k8s`:

```bash
kubectl apply -f infra/k8s/postgres-deployment.yaml
kubectl apply -f infra/k8s/redis-deployment.yaml
kubectl apply -f infra/k8s/backend-deployment.yaml
kubectl apply -f infra/k8s/frontend-deployment.yaml
kubectl apply -f infra/k8s/ingress.yaml
```

## CI/CD

- `/.github/workflows/ci.yml` runs frontend and backend build checks.
- `/.github/workflows/deploy.yml` deploys frontend to Vercel and backend to Render on `main` and `production`.
