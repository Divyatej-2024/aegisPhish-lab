import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-pricing",
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-10 anim-fade-up">
      <div class="rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/40 md:p-10">
        <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Pricing</p>
        <h1 class="mt-3 text-3xl font-semibold md:text-4xl">
          Plans for every security maturity level
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          Start with simulations and training, then unlock advanced reporting and
          admin workflows as your program scales.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Foundations</p>
            <h2 class="mt-3 text-lg font-semibold">Starter</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              For small teams building their first phishing program.
            </p>
            <ul class="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>Campaign builder + templates</li>
              <li>Basic training library</li>
              <li>Monthly metrics export</li>
            </ul>
            <a
              class="mt-5 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
              routerLink="/start"
            >
              Start Here
            </a>
          </div>

          <div class="rounded-2xl border border-gray-900 bg-gray-900 p-6 text-white shadow-lg">
            <p class="text-xs uppercase tracking-wide text-gray-300">Most popular</p>
            <h2 class="mt-3 text-lg font-semibold">Professional</h2>
            <p class="mt-2 text-xs text-gray-300">
              For growing orgs that need readiness reporting and coaching.
            </p>
            <ul class="mt-4 space-y-2 text-xs text-gray-200">
              <li>Everything in Starter</li>
              <li>Risk scoring + timelines</li>
              <li>Executive reporting pack</li>
              <li>Department-level insights</li>
            </ul>
            <a
              class="mt-5 inline-flex items-center rounded-md bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-900 hover:bg-gray-100"
              routerLink="/demo"
            >
              View Demo
            </a>
          </div>

          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Enterprise</p>
            <h2 class="mt-3 text-lg font-semibold">Advanced</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              For regulated orgs with audit and compliance needs.
            </p>
            <ul class="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>Everything in Professional</li>
              <li>Custom roles + admin policies</li>
              <li>Audit evidence exports</li>
              <li>Dedicated onboarding</li>
            </ul>
            <a
              class="mt-5 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
              routerLink="/start"
            >
              Deploy Guide
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PricingComponent {}
