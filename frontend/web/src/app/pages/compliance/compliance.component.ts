import { Component } from "@angular/core";

@Component({
  selector: "app-compliance",
  standalone: true,
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-10 anim-fade-up">
      <div class="rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/40 md:p-10">
        <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Security + Compliance</p>
        <h1 class="mt-3 text-3xl font-semibold md:text-4xl">
          Audit-ready reporting without the scramble
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          AegisPhish turns training and campaign data into compliance-ready exports,
          executive summaries, and evidence packs.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <h2 class="text-sm font-semibold">Evidence Pack</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Export a quarterly PDF summary with campaign results, risk scoring,
              and training completion.
            </p>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <h2 class="text-sm font-semibold">Policy Alignment</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Map training modules to policies and document attestation dates.
            </p>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-gray-800 dark:bg-gray-950/40">
            <h2 class="text-sm font-semibold">Executive Brief</h2>
            <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Share a one-page readiness scorecard with leadership.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Sample export preview</h2>
          <div class="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-400">
            <div class="rounded-xl border border-gray-200/70 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-[11px] uppercase tracking-wide text-gray-500">Quarterly summary</p>
              <p class="mt-2 font-medium text-gray-800 dark:text-gray-200">
                Readiness index: 72 (↑ 8)
              </p>
              <p class="mt-2">Training completion: 86%</p>
              <p>High-risk users: 14</p>
              <p>Campaigns reviewed: 3</p>
            </div>
            <div class="rounded-xl border border-gray-200/70 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-950/40">
              <p class="text-[11px] uppercase tracking-wide text-gray-500">Policy mapping</p>
              <p class="mt-2">Acceptable Use: 92% attested</p>
              <p>Credential Handling: 88% attested</p>
              <p>Reporting Procedures: 79% attested</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Audit timeline</h2>
          <div class="mt-4 space-y-3 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">Q1 evidence pack</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">Delivered Mar 28</p>
              </div>
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                Complete
              </span>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">Policy attestations</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">Due Apr 30</p>
              </div>
              <span class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                In progress
              </span>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">SOC2 snapshot</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">Scheduled May 12</p>
              </div>
              <span class="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                Planned
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ComplianceComponent {}
