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
├── apps/
│   ├── web/         # Frontend application
│   └── server/      # Backend API
├── packages/
│   ├── auth/        # Authentication
│   └── db/          # Database schema
```

## Common Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm db:push` - Push database schema
- `pnpm db:studio` - Open database UI

## Maintenance

Keep CLAUDE.md updated when:

- Adding/removing dependencies
- Changing project structure
- Adding new features or services
- Modifying build/dev workflows

AI assistants should suggest updates to this file when they notice relevant changes.
