# Aegis Phish Lab

**Human Attack Surface Training Platform**

A production-grade, cloud-native cybersecurity awareness and phishing simulation platform designed for universities, SMEs, and enterprise security teams.

## 🎯 Overview

Aegis Phish Lab is a comprehensive phishing awareness platform that enables organizations to:

- 📧 Create and manage phishing simulation campaigns
- 📊 Track user interactions in real-time
- 📈 Measure security awareness with detailed analytics
- 👥 Manage departments, teams, and individual users
- 🎓 Train employees with realistic phishing scenarios
- 📋 Generate compliance reports and metrics

## 🏗️ Architecture

```
Frontend (Next.js 15)
  ↓ REST API (Gin, JWT Auth) ↓
Backend (Golang)
  ↓
PostgreSQL Database
```

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Go 1.23** - Programming language
- **Gin** - Web framework
- **GORM** - ORM for database operations
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Deployment
- **Docker** - Container images
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
aegisPhish-lab/
├── backend/                    # Golang REST API
│   ├── cmd/
│   │   └── main.go            # Entry point
│   ├── internal/
│   │   ├── config/            # Configuration
│   │   ├── handlers/          # HTTP handlers
│   │   ├── middleware/        # Auth middleware
│   │   ├── models/            # Data models
│   │   ├── repositories/      # Data layer
│   │   ├── routes/            # Route definitions
│   │   └── services/          # Business logic
│   ├── pkg/
│   │   ├── database/          # DB initialization
│   │   └── utils/             # Utilities
│   ├── go.mod                 # Go dependencies
│   ├── schema.sql             # Database schema
│   ├── Dockerfile
│   └── README.md
│
├── web/                        # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Pages & routing
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── store/             # State management
│   │   ├── types/             # TypeScript types
│   │   └── globals.css        # Global styles
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml         # Local dev setup
├── docker-compose.prod.yml    # Production setup
├── .env.example               # Environment template
├── .github/workflows/         # CI/CD pipelines
├── .circleci/                 # CircleCI config
└── README.md

```

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Go 1.23+
- PostgreSQL 13+
- Docker & Docker Compose
- pnpm package manager

### 1. Clone & Setup

```bash
git clone https://github.com/aegisphish/lab.git
cd aegisPhish-lab
cp .env.example .env.local
```

### 2. Start with Docker Compose

```bash
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

### 3. Manual Setup (Development)

#### Backend

```bash
cd backend
go mod download
go run cmd/main.go
```

#### Frontend

```bash
cd web
pnpm install
pnpm dev
```

## 🔐 Authentication

### User Roles
- **admin**: Full system access
- **trainer**: Create campaigns, view analytics
- **employee**: Participate in campaigns

### Auth Flow
```
Register/Login → Password Hashing (bcrypt) → JWT Token
  ↓
Store Token → Include in API Requests → Validate JWT
  ↓
Access Granted
```

## 📊 Key Features

### Campaign Management
- Create phishing campaigns
- Schedule for specific dates
- Track status (draft, scheduled, active, paused, completed)
- Bulk target management
- Custom email templates

### Email Templates
- Pre-built templates
- Dynamic variables: {{name}}, {{email}}, {{company}}
- Categories: credential-reset, executive-wire, document-share
- Public/private access

### Tracking Engine
- Email opens
- Link clicks
- Credential submissions
- IP address & device capture
- Real-time updates

### Analytics
- Interactive charts
- Click rates, open rates, submission rates
- User risk scoring
- Department metrics
- Exportable reports

### User Management
- User registration
- CSV bulk import
- Department assignment
- RBAC
- Activity logging

## 🔒 Security

- Password hashing with bcrypt
- JWT-based authentication
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention (GORM)
- XSS protection
- Secure headers

## 🛣️ API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

### Campaigns
```
GET    /api/campaigns
POST   /api/campaigns
GET    /api/campaigns/:id
PUT    /api/campaigns/:id
DELETE /api/campaigns/:id
GET    /api/campaigns/:id/stats
```

### Health
```
GET    /api/health
```

## 🚢 Deployment

### Docker Compose (Development)
```bash
docker-compose up -d
```

### Docker Compose (Production)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel + Render

**Frontend (Vercel):**
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on push

**Backend (Render):**
1. Create new Web Service
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
3. Deploy

### Supabase (Database)
```bash
# Create Supabase project and get connection string
export DATABASE_URL="postgresql://..."

# Create database
createdb aegisphish

# Run schema
psql $DATABASE_URL < backend/schema.sql
```

## 🧪 Testing

### Backend
```bash
cd backend
go test ./...
go test ./... -cover
```

### Frontend
```bash
cd web
pnpm test
pnpm test --coverage
```

## 📚 Documentation

- [Backend README](backend/README.md) - API & server setup
- [Frontend README](web/README.md) - UI & client setup
- [Database Schema](backend/schema.sql) - PostgreSQL schema
- [API Documentation](#-api-endpoints) - Endpoint reference

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- 📧 Email: support@aegisphish.com
- 🐛 Issues: [GitHub Issues](https://github.com/aegisphish/lab/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/aegisphish/lab/discussions)

## 🗺️ Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced ML phishing detection
- [ ] Email provider integrations
- [ ] Webhook support
- [ ] GraphQL API
- [ ] Kubernetes manifests
- [ ] SOC 2 compliance
- [ ] Multi-language support
- [ ] Custom branding
- [ ] API rate limiting dashboard

## 📈 Performance

- Backend response time: < 100ms (p95)
- Database queries: < 50ms (p95)
- Frontend load time: < 2s (FCP)
- Concurrent users: 10,000+
- API rate limit: 1000 req/min per user

---

**Built for cybersecurity education and awareness training.**
