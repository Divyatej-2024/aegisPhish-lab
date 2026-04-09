import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto max-w-6xl px-4 py-10 anim-fade-up">
      <section class="relative overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur md:p-10 dark:border-gray-800/70 dark:bg-black/40">
        <div class="absolute -top-24 right-6 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-400/20"></div>
        <div class="absolute -bottom-28 left-8 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/20"></div>
        <div class="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
              Phishing Readiness Platform
            </div>
            <h1 class="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              AegisPhish helps security teams run phishing simulations, train users,
              and prove readiness with real metrics.
            </h1>
            <p class="mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-300">
              Built for security operations, IT admins, and compliance leaders who need
              a clear view of user risk, training completion, and campaign outcomes.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a
                class="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                routerLink="/start"
              >
                Start Here
              </a>
              <a
                class="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
                routerLink="/demo"
              >
                Live Demo
              </a>
              <a
                class="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
                routerLink="/login"
              >
                Sign In
              </a>
            </div>
            <div class="mt-6 grid gap-4 sm:grid-cols-3">
              <div class="rounded-lg border border-gray-200 bg-white/70 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/40">
                <p class="text-xs uppercase tracking-wide text-gray-500">Target user</p>
                <p class="mt-2 font-medium">Security + IT teams</p>
                <p class="mt-2 text-xs text-gray-500">
                  Centralize campaigns, training, and audit reporting.
                </p>
              </div>
              <div class="rounded-lg border border-gray-200 bg-white/70 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/40">
                <p class="text-xs uppercase tracking-wide text-gray-500">Time to value</p>
                <p class="mt-2 font-medium">Under 10 minutes</p>
                <p class="mt-2 text-xs text-gray-500">
                  Demo flow ready without configuring data.
                </p>
              </div>
              <div class="rounded-lg border border-gray-200 bg-white/70 p-4 text-sm dark:border-gray-800 dark:bg-gray-950/40">
                <p class="text-xs uppercase tracking-wide text-gray-500">Outcome</p>
                <p class="mt-2 font-medium">Clear readiness metrics</p>
                <p class="mt-2 text-xs text-gray-500">
                  Track completion, risk, and improvement over time.
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-white/80 p-5 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-950/50">
            <h2 class="text-base font-semibold">What you can show in 60 seconds</h2>
            <div class="mt-4 space-y-4 text-xs text-gray-600 dark:text-gray-300">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">1. Demo overview</p>
                <p class="mt-1">
                  Open the demo to preview the executive dashboard and campaign timeline.
                </p>
              </div>
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">2. Start here guide</p>
                <p class="mt-1">
                  Follow the step-by-step setup to run the full suite locally.
                </p>
              </div>
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">3. Admin flow</p>
                <p class="mt-1">
                  Configure roles, review reports, and export audit-ready summaries.
                </p>
              </div>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <a
                class="rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gray-800"
                routerLink="/demo"
              >
                Launch Demo
              </a>
              <a
                class="rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
                routerLink="/start"
              >
                Setup Steps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-10 grid gap-4 md:grid-cols-3 anim-stagger">
        <div class="rounded-xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Phishing Campaigns</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Launch targeted simulations, track open rates, and benchmark failure points.
          </p>
        </div>
        <div class="rounded-xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Training + Labs</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Deliver bite-sized lessons and hands-on challenges to raise user awareness.
          </p>
        </div>
        <div class="rounded-xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Risk Reporting</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Share readiness summaries with leadership and export compliance evidence.
          </p>
        </div>
      </section>

      <section class="mt-8 rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
        <p class="text-[11px] uppercase tracking-[0.2em] text-gray-500">Trusted by teams</p>
        <div class="mt-4 grid gap-3 text-xs font-semibold uppercase tracking-widest text-gray-500 sm:grid-cols-3 md:grid-cols-6">
          <div class="rounded-lg border border-gray-200/70 bg-white/80 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40">
            Northway Health
          </div>
          <div class="rounded-lg border border-gray-200/70 bg-white/80 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40">
            Kestrel Finance
          </div>
          <div class="rounded-lg border border-gray-200/70 bg-white/80 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40">
            Harbor Tech
          </div>
          <div class="rounded-lg border border-gray-200/70 bg-white/80 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40">
            Meridian Retail
          </div>
          <div class="rounded-lg border border-gray-200/70 bg-white/80 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40">
            Vista Energy
          </div>
          <div class="rounded-lg border border-gray-200/70 bg-white/80 p-3 text-center dark:border-gray-800 dark:bg-gray-950/40">
            Civic Labs
          </div>
        </div>
      </section>

      <section class="mt-10 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Proof</p>
          <h2 class="mt-3 text-lg font-semibold">Readiness outcomes leadership can trust</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Turn campaign results into a narrative: risk down, reporting up, and training
            completion trending in the right direction.
          </p>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-gray-200/70 bg-white/70 p-4 text-center dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">-28%</p>
              <p class="mt-1 text-xs text-gray-500">Click rate reduction</p>
            </div>
            <div class="rounded-xl border border-gray-200/70 bg-white/70 p-4 text-center dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-2xl font-semibold text-sky-600 dark:text-sky-400">+41%</p>
              <p class="mt-1 text-xs text-gray-500">User reporting lift</p>
            </div>
            <div class="rounded-xl border border-gray-200/70 bg-white/70 p-4 text-center dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-2xl font-semibold text-amber-600 dark:text-amber-400">86%</p>
              <p class="mt-1 text-xs text-gray-500">Training completion</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Mini case study</p>
          <h3 class="mt-3 text-base font-semibold">Mid-size healthcare network</h3>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Quarterly simulations exposed invoice fraud risk. AegisPhish delivered new
            training paths and targeted follow-ups. Three months later, click rate fell
            by 28% and leadership received an audit-ready report pack.
          </p>
          <div class="mt-4 flex flex-wrap gap-3">
            <a
              class="rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
              routerLink="/pricing"
            >
              View Plans
            </a>
            <a
              class="rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
              routerLink="/start"
            >
              Deploy Guide
            </a>
          </div>
        </div>
      </section>

      <section class="mt-10 grid gap-4 rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40 md:grid-cols-[1fr_auto]">
        <div>
          <h2 class="text-lg font-semibold">Ready to evaluate the full suite?</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start with the demo, then follow the guided setup to connect MongoDB,
            enable authentication, and unlock the admin console.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <a
            class="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            routerLink="/start"
          >
            Start Here
          </a>
          <a
            class="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
            routerLink="/admin/login"
          >
            Admin Login
          </a>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {
}
