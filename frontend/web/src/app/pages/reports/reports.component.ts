import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <h1 class="text-xl font-semibold">Reports</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Export insights and audit-ready summaries.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-2 anim-stagger">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Security Overview</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            MFA adoption, risk events, and session anomalies.
          </p>
          <button class="mt-4 rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-gray-400">
            Export PDF
          </button>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Usage Analytics</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Active users, retention, and product adoption.
          </p>
          <button class="mt-4 rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-gray-400">
            Export CSV
          </button>
        </div>
      </div>
    </section>
  `,
})
export class ReportsComponent {}
