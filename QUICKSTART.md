# Quick Start Guide

## Aegis Phish Lab - Getting Started

### 🚀 30-Second Setup

```bash
# Clone and enter directory
git clone https://github.com/aegisphish/lab.git
cd aegisPhish-lab

# Start everything with Docker Compose
cp .env.example .env.local
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080/api
# Database: localhost:5432
```

### 📝 Create First Account

1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill registration form:
   - First Name: Your Name
   - Last Name: Your Surname
   - Email: test@example.com
   - Password: SecurePassword123
   - Organization ID: (leave default or create one)
4. Click "Create Account"
5. Login with your credentials

### 📧 Create First Campaign

1. Login to dashboard
2. Click "Create Campaign"
3. Fill campaign details:
   - Name: Test Campaign
   - Description: Testing phishing awareness
   - Select email template
   - Set scheduled date
4. Click "Create"

### 📊 View Analytics

1. Go to Dashboard
2. View statistics:
   - Total campaigns
   - Active campaigns
   - Total targets
   - Click rate
3. View charts for performance trends

---

## Manual Setup (Development)

### Prerequisites
```bash
# Check versions
node --version    # 18+
go version       # 1.23+
psql --version   # 13+
pnpm --version   # 10+
```

### Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Create environment file
cp .env.example .env

# Update .env with your database details:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aegisphish

# Create database
createdb aegisphish

# Run migrations
psql aegisphish < schema.sql

# Start server
go run cmd/main.go

# Server runs on http://localhost:8080
```

### Frontend Setup

```bash
cd web

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Update .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Start development server
pnpm dev

# Frontend runs on http://localhost:3000
```

---

## 📁 Important Files

### Backend
- `cmd/main.go` - Application entry point
- `internal/models/models.go` - Data models
- `internal/routes/routes.go` - API routes
- `schema.sql` - Database schema
- `.env.example` - Environment template

### Frontend
- `src/app/page.tsx` - Home page
- `src/app/dashboard/page.tsx` - Dashboard
- `src/components/auth/LoginForm.tsx` - Login
- `src/store/auth.ts` - Auth state
- `src/types/index.ts` - TypeScript types

---

## 🔌 API Examples

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "organization_id": "org-id"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Campaign
```bash
curl -X POST http://localhost:8080/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Training Campaign",
    "description": "Security awareness training",
    "email_template_id": "template-id"
  }'
```

### Get Campaigns
```bash
curl -X GET http://localhost:8080/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
lsof -i :8080

# Check database connection
psql -U postgres -h localhost -d aegisphish -c "SELECT 1"

# Check environment variables
echo $DATABASE_URL
echo $JWT_SECRET
```

### Frontend won't load
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build

# Check API URL
echo $NEXT_PUBLIC_API_URL
```

### Database errors
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l | grep aegisphish

# Reinitialize database
dropdb aegisphish
createdb aegisphish
psql aegisphish < schema.sql
```

### Port conflicts
```bash
# Change ports in .env files
# Backend: PORT=3001
# Frontend: Dev server port in package.json

# Or kill existing processes
# Linux/Mac: lsof -ti:8080 | xargs kill -9
# Windows: netstat -ano | findstr :8080 (then taskkill)
```

---

## 📚 Documentation

- 📖 [Main README](README.md) - Complete project overview
- 🚀 [Deployment Guide](DEPLOYMENT.md) - How to deploy
- 🤝 [Contributing](CONTRIBUTING.md) - How to contribute
- 🔒 [Security](SECURITY.md) - Security policies
- 📝 [Backend README](backend/README.md) - Backend details
- 🎨 [Frontend README](web/README.md) - Frontend details
- 🔄 [Project Summary](PROJECT_SUMMARY.md) - What was built
- 📋 [Changelog](CHANGELOG.md) - Version history

---

## 🛠️ Common Tasks

### Add New API Endpoint

**Backend (Go):**
```go
// In internal/handlers/new_handler.go
func (h *YourHandler) GetData(c *gin.Context) {
    // Implementation
}

// In internal/routes/routes.go
router.GET("/api/data", yourHandler.GetData)
```

**Frontend (React):**
```typescript
// In src/hooks/useData.ts
export const useData = () => {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const response = await apiService.getClient().get('/data');
      return response.data.data;
    },
  });
};
```

### Add New Component

```bash
cd web/src/components
mkdir feature
# Create Feature.tsx with component code
# Use existing components as templates
```

### Add New Model

```bash
# Edit backend/internal/models/models.go
# Define struct with GORM tags
# Create repository in internal/repositories/
# Create service methods in internal/services/
```

---

## 🚀 Deployment

### Quick Deploy to Vercel (Frontend)
```bash
cd web
vercel deploy --prod
```

### Quick Deploy to Render (Backend)
1. Connect GitHub repository
2. Set environment variables
3. Render auto-deploys on push

### Using Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 Tech Stack Reference

```
┌─────────────────────────────┐
│   Frontend: Next.js 15      │
│   TypeScript, TailwindCSS   │
│   React Query, Zustand      │
└──────────────┬──────────────┘
               │ REST API
               │ JWT Auth
┌──────────────▼──────────────┐
│  Backend: Golang + Gin      │
│  GORM, PostgreSQL           │
│  Clean Architecture         │
└──────────────┬──────────────┘
               │ SQL Queries
┌──────────────▼──────────────┐
│    PostgreSQL Database      │
│    Supabase Compatible      │
└─────────────────────────────┘
```

---

## 🆘 Need Help?

- 📧 Email: support@aegisphish.com
- 🐛 Issues: [GitHub Issues](https://github.com/aegisphish/lab/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/aegisphish/lab/discussions)
- 📖 Wiki: [Project Wiki](https://github.com/aegisphish/lab/wiki)

---

## ✨ What's Next?

After getting familiar with the platform:

1. ✅ Explore the codebase
2. ✅ Create test campaigns
3. ✅ Customize email templates
4. ✅ Deploy to production
5. ✅ Add organization users
6. ✅ Run phishing simulations
7. ✅ Analyze campaign results
8. ✅ Generate reports

**Happy training! 🎓**
