# Aegis Phish Lab - Backend

Production-grade Golang backend for Aegis Phish Lab using Gin framework.

## Tech Stack

- **Language**: Go 1.23
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL with GORM
- **Authentication**: JWT with bcrypt password hashing
- **Architecture**: Clean Architecture with Repository Pattern

## Project Structure

```
backend/
├── cmd/
│   └── main.go              # Application entry point
├── internal/
│   ├── config/              # Configuration management
│   ├── handlers/            # HTTP request handlers
│   ├── middleware/          # HTTP middleware
│   ├── models/              # Data models
│   ├── repositories/        # Data access layer
│   ├── routes/              # Route definitions
│   └── services/            # Business logic layer
└── pkg/
    ├── database/            # Database initialization
    └── utils/               # Utility functions
```

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Campaign management
- ✅ Email template system
- ✅ Tracking engine
- ✅ Analytics API
- ✅ CORS support
- ✅ Error handling middleware
- ✅ Database migrations with GORM

## Setup

### Prerequisites

- Go 1.23+
- PostgreSQL 13+
- Git

### Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
go mod download
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Update environment variables in `.env`

5. Run database migrations
```bash
go run cmd/main.go
```

## Environment Variables

```
PORT=8080
ENVIRONMENT=development
DATABASE_URL=postgres://user:password@localhost:5432/aegisphish
JWT_SECRET=your-super-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=aegisphish
DB_PORT=5432
DB_SSLMODE=disable
EMAIL_FROM=noreply@aegisphish.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Running the Server

```bash
go run cmd/main.go
```

Server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `GET /api/campaigns/:id/stats` - Get campaign statistics

### Health
- `GET /api/health` - Health check

## Building

```bash
go build -o aegisphish-backend cmd/main.go
```

## Deployment

See deployment guide in root README.md

## Testing

```bash
go test ./...
```

## License

MIT
