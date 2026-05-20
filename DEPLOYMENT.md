# Deployment Guide

This guide covers deploying Aegis Phish Lab to production environments.

## Table of Contents
1. [Docker Compose](#docker-compose)
2. [Vercel (Frontend)](#vercel-frontend)
3. [Render (Backend)](#render-backend)
4. [Railway](#railway)
5. [Kubernetes](#kubernetes)
6. [Environment Setup](#environment-setup)

## Docker Compose

### Local Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Services:**
- PostgreSQL on port 5432
- Backend on port 8080
- Frontend on port 3000

## Vercel (Frontend)

### Setup
1. Push code to GitHub
2. Connect repository to Vercel
3. Set project root: `web`
4. Configure environment variables

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Deploy
```bash
vercel deploy --prod
```

## Render (Backend)

### Setup
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure settings

### Settings
- **Build Command**: None (using Docker)
- **Start Command**: None (using Docker)
- **Root Directory**: backend

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=https://your-frontend.com
ENVIRONMENT=production
```

### Deploy
```bash
# Automatic on push to main
```

## Railway

### Setup
1. Create Railway project
2. Add PostgreSQL service
3. Add backend service
4. Add frontend service

### Configuration
Connect services and set environment variables for each.

## Kubernetes

See `k8s/` directory for manifests (coming soon).

## Environment Setup

### Backend Variables
```bash
# Server
PORT=8080
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:pass@host/db
DB_HOST=your-db-host
DB_USER=postgres
DB_PASSWORD=secure-password
DB_NAME=aegisphish
DB_PORT=5432
DB_SSLMODE=require

# Security
JWT_SECRET=min-32-character-secret-key-here-required

# CORS
FRONTEND_URL=https://aegisphish.com

# Email
EMAIL_FROM=noreply@aegisphish.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Frontend Variables
```bash
NEXT_PUBLIC_API_URL=https://api.aegisphish.com
```

## Database Backup

### PostgreSQL Backup
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore
```bash
psql $DATABASE_URL < backup.sql
```

## SSL/TLS

### Self-Signed Certificate
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

### Let's Encrypt (Nginx)
```bash
certbot certonly --standalone -d aegisphish.com
```

## Monitoring

### Health Checks
- Backend: `GET /api/health`
- Frontend: `GET /`

### Logs
```bash
docker logs aegisphish-backend
docker logs aegisphish-frontend
```

### Database
```bash
psql $DATABASE_URL
# Check active connections: SELECT * FROM pg_stat_activity;
```

## Scaling

### Horizontal Scaling
- Add multiple backend instances behind a load balancer
- Use connection pooling (PgBouncer)
- Implement caching layer (Redis)

### Vertical Scaling
- Increase CPU/Memory allocation
- Optimize database queries
- Enable database replication

## Security Checklist

- [ ] Change default passwords
- [ ] Set strong JWT secret (min 32 chars)
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Monitor access logs
- [ ] Implement rate limiting
- [ ] Set up logging & alerts
- [ ] Regular security updates
- [ ] Database encryption at rest

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker logs aegisphish-backend

# Test database connection
psql $DATABASE_URL -c "SELECT 1"
```

### Frontend won't load
```bash
# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Clear Next.js cache
rm -rf .next
npm run build
```

### Database connection errors
```bash
# Test connection
psql -U postgres -h localhost -d aegisphish

# Check environment variable
echo $DATABASE_URL
```

## Support

For deployment issues:
- Check logs: `docker logs service-name`
- Verify environment variables
- Test connectivity: `curl http://localhost:8080/api/health`
- Review error messages carefully
