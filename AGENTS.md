# aegisPhish-lab

This file provides context about the project for AI assistants.

## Project Overview

- **Ecosystem**: Typescript

## Tech Stack

- **Runtime**: bun
- **Package Manager**: pnpm

### Frontend

- Framework: angular
- CSS: tailwind
- UI Library: daisyui

### Backend

- Framework: nitro
- Validation: zod

### Database

- Database: mongodb
- ORM: prisma

### Authentication

- Provider: better-auth

### Additional Features

- Testing: vitest
- Email: react-email

## Project Structure

```
aegisPhish-lab/
|-- frontend/
|   |-- web/         # Frontend application
|-- backend/
|   |-- server/      # Backend API
|-- ai/              # AI component (shared logic)
|-- logs/            # SIEM-style alert logs (JSONL)
|-- packages/
|   |-- auth/        # Authentication
|   |-- config/      # Shared configs
|   |-- db/          # Database schema
|   |-- env/         # Environment validation
|-- backend/
|   |-- server/
|   |   |-- alerts/    # SOC alert generation, logging, correlation
|   |   |-- incidents/ # Incident response workflow logic
```

## Common Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm db:push` - Push database schema
- `pnpm db:studio` - Open database UI

## Maintenance

Keep AGENTS.md updated when:

- Adding/removing dependencies
- Changing project structure
- Adding new features or services
- Modifying build/dev workflows

AI assistants should suggest updates to this file when they notice relevant changes.
