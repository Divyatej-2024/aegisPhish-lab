# AegisPhish Lab

AegisPhish is a phishing readiness platform for security teams. It combines simulations,
user training, and executive reporting in one suite so you can measure risk and prove
improvement over time.

## Target Users

- Security operations teams
- IT administrators managing user risk
- Compliance and audit stakeholders

## Start Here

1. **Open the live demo**
   Run `pnpm dev`, then visit `http://localhost:3001/demo` for a read-only preview.
2. **Run the full stack**
   Start the apps with `pnpm dev` after installing dependencies.
3. **Connect MongoDB**
   Add your MongoDB URI in `backend/server/.env`, then run `pnpm db:push`.

## One-Click Deploy (Frontend Preview)

You can deploy the Angular frontend as a preview on Vercel while you finish backend setup.
Replace `YOUR_REPO_URL` with your fork URL.

```
https://vercel.com/new/clone?repository-url=YOUR_REPO_URL
```

Vercel settings:

- Build Command: `pnpm run build`
- Output Directory: `frontend/web/dist/web/browser`
- Env: `VITE_SERVER_URL` (API base URL)

## Backend Deploy Checklist

One-click backend deploy is not bundled yet. Use this checklist to ship the API:

- Set `MONGODB_URI` in `backend/server/.env`
- Set `BETTER_AUTH_SECRET` (and related auth envs)
- Run `pnpm db:push` before deploying
- Deploy `backend/server` and expose `/api`

## What You Can Show in 60 Seconds

- Executive readiness snapshot with risk, completion, and high-risk users
- Campaign timeline with click-rate changes
- Training completion and coaching signals

## Features

- **Phishing simulations** to measure user risk
- **Training and labs** for awareness and skill-building
- **Reporting** for leadership and compliance
- **Admin console** for roles, permissions, and audit visibility

## Tech Stack

- **Frontend**: Angular, Tailwind, daisyUI
- **Backend**: Nitro, Zod
- **Database**: MongoDB + Prisma
- **Auth**: Better Auth
- **Testing**: Vitest
- **Email**: React Email

## Project Structure

```
aegisPhish-lab/
|-- frontend/
|   |-- web/         # Frontend application (Angular)
|-- backend/
|   |-- server/      # Backend API (Nitro)
|-- ai/              # AI component (shared logic)
|-- packages/
|   |-- auth/        # Authentication configuration & logic
|   |-- config/      # Shared configs (tsconfig, lint)
|   |-- db/          # Database schema & queries
|   |-- env/         # Environment validation
```

## Local Development

1. Install dependencies:
   `pnpm install`
2. Start the dev servers:
   `pnpm dev`

Frontend runs at `http://localhost:3001` and API at `http://localhost:3000`.

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI
