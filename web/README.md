# Aegis Phish Lab - Frontend

Modern Next.js 15 frontend for Aegis Phish Lab.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API Client**: Axios
- **Query**: TanStack React Query
- **Animation**: Framer Motion
- **Charts**: Recharts

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
cd web
pnpm install
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Running Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory and pages
├── components/       # Reusable React components
│   ├── auth/        # Authentication components
│   ├── dashboard/   # Dashboard components
│   ├── campaigns/   # Campaign management components
│   └── ui/          # UI primitives
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API clients
├── services/        # API service functions
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
└── globals.css      # Global styles
```

## Key Features

- ✅ JWT Authentication
- ✅ Dashboard with analytics
- ✅ Campaign management
- ✅ Real-time charts and statistics
- ✅ Responsive design
- ✅ Dark mode (default)
- ✅ Glassmorphism UI effects

## Building

```bash
pnpm build
pnpm start
```

## Deployment

### Vercel

```bash
vercel deploy
```

### Docker

```bash
docker build -t aegisphish-web .
docker run -p 3000:3000 aegisphish-web
```

## License

MIT
