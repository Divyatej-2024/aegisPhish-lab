import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-start",
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container mx-auto max-w-5xl px-4 py-10 anim-fade-up">
      <div class="rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/40 md:p-10">
        <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Start Here</p>
        <h1 class="mt-3 text-3xl font-semibold md:text-4xl">
          Launch the AegisPhish demo, then wire up the full stack.
        </h1>
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
          This guide keeps expectations honest: the demo is a UI preview, while
          the full suite needs MongoDB and authentication configured.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Step 1</p>
            <h2 class="mt-2 text-sm font-semibold">Open the live demo</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Preview the executive dashboard and campaign story without logins.
            </p>
            <a
              class="mt-4 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gray-800"
              routerLink="/demo"
            >
              Launch Demo
            </a>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Step 2</p>
            <h2 class="mt-2 text-sm font-semibold">Run locally</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Install dependencies and spin up the frontend and API.
            </p>
            <div class="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <div>pnpm install</div>
              <div>pnpm dev</div>
            </div>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Step 3</p>
            <h2 class="mt-2 text-sm font-semibold">Connect MongoDB</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Add your MongoDB URI and push the schema to unlock the data layer.
            </p>
            <div class="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              <div>pnpm db:push</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <div
          id="deploy"
          class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40"
        >
          <h2 class="text-sm font-semibold">Need a deploy path?</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            You can deploy the frontend as a preview build while configuring the backend.
            Follow the README for the Vercel build settings and environment variables.
          </p>
          <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <div>Build: pnpm run build</div>
            <div>Output: frontend/web/dist/web/browser</div>
            <div>Env: VITE_SERVER_URL for the API</div>
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Backend deploy checklist</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            One-click backend deploy isn’t included yet, but this checklist gets you
            to a production-ready API fast.
          </p>
          <div class="mt-4 space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <div class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
              Set `MONGODB_URI` + `BETTER_AUTH_SECRET`
            </div>
            <div class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
              Run `pnpm db:push`
            </div>
            <div class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
              Deploy `backend/server` and expose `/api`
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Already have access?</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Sign in to the full suite to reach dashboards, training, and admin tools.
          </p>
          <div class="mt-4 flex flex-wrap gap-3">
            <a
              class="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gray-800"
              routerLink="/login"
            >
              Sign In
            </a>
            <a
              class="rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
              routerLink="/admin/login"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StartComponent {}
