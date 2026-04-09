import { Component } from "@angular/core";

@Component({
  selector: "app-demo",
  standalone: true,
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-10 anim-fade-up">
      <div class="rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/40 md:p-10">
        <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Live Demo</p>
        <h1 class="mt-3 text-3xl font-semibold md:text-4xl">
          Executive readiness snapshot
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          This is a read-only preview of the AegisPhish experience.
          Launch the full stack to connect real data and authentication.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-4">
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Risk Index</p>
            <p class="mt-3 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              72
            </p>
            <p class="mt-1 text-xs text-gray-500">Up 8 points this quarter</p>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Active Campaigns</p>
            <p class="mt-3 text-2xl font-semibold">3</p>
            <p class="mt-1 text-xs text-gray-500">Operations, Finance, Retail</p>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">Training Completion</p>
            <p class="mt-3 text-2xl font-semibold">86%</p>
            <p class="mt-1 text-xs text-gray-500">Last 30 days</p>
          </div>
          <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-950/40">
            <p class="text-xs uppercase tracking-wide text-gray-500">High Risk Users</p>
            <p class="mt-3 text-2xl font-semibold">14</p>
            <p class="mt-1 text-xs text-gray-500">Needs coaching</p>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Campaign timeline</h2>
          <div class="mt-4 space-y-4 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">Payroll Reset</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">47% click rate</p>
              </div>
              <span class="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                High risk
              </span>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">Vendor Invoice</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">22% click rate</p>
              </div>
              <span class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                Monitor
              </span>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/40">
              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">Helpdesk MFA</p>
                <p class="mt-1 font-medium text-gray-800 dark:text-gray-200">8% click rate</p>
              </div>
              <span class="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                On track
              </span>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
          <h2 class="text-sm font-semibold">Top risk signals</h2>
          <div class="mt-4 space-y-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <div class="flex items-center justify-between">
                <span>Credential capture</span>
                <span>62%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div class="h-2 w-[62%] rounded-full bg-rose-500"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <span>Attachment opens</span>
                <span>41%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div class="h-2 w-[41%] rounded-full bg-amber-500"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <span>Reporting rate</span>
                <span>78%</span>
              </div>
              <div class="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div class="h-2 w-[78%] rounded-full bg-emerald-500"></div>
              </div>
            </div>
          </div>

          <div class="mt-6 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 dark:border-gray-700">
            Full analytics unlock when the backend API is connected.
          </div>
        </div>
      </div>

      <div class="mt-8 rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-gray-800 dark:bg-gray-950/40">
        <h2 class="text-sm font-semibold">Interactive product tour</h2>
        <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Click through the key moments a buyer wants to see fast.
        </p>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          <button
            class="rounded-xl border border-gray-200/70 bg-white/80 p-4 text-left text-xs text-gray-700 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300"
          >
            <p class="text-[11px] uppercase tracking-wide text-gray-500">Step 1</p>
            <p class="mt-2 font-medium">Executive snapshot</p>
            <p class="mt-1 text-gray-500">Risk, completion, and high-risk users.</p>
          </button>
          <button
            class="rounded-xl border border-gray-200/70 bg-white/80 p-4 text-left text-xs text-gray-700 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300"
          >
            <p class="text-[11px] uppercase tracking-wide text-gray-500">Step 2</p>
            <p class="mt-2 font-medium">Campaign outcomes</p>
            <p class="mt-1 text-gray-500">See click-rate shifts and alerts.</p>
          </button>
          <button
            class="rounded-xl border border-gray-200/70 bg-white/80 p-4 text-left text-xs text-gray-700 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300"
          >
            <p class="text-[11px] uppercase tracking-wide text-gray-500">Step 3</p>
            <p class="mt-2 font-medium">Coaching signals</p>
            <p class="mt-1 text-gray-500">Spot who needs follow-up training.</p>
          </button>
        </div>
      </div>
    </section>
  `,
})
export class DemoComponent {}
