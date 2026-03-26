import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-billing",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8">
      <h1 class="text-xl font-semibold">Billing</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Manage plans, invoices, and payment methods.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Plan</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Current plan: Pro
          </p>
          <button class="mt-4 rounded-md bg-gray-900 px-3 py-1 text-xs text-white hover:bg-gray-800">
            Upgrade
          </button>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Invoices</h2>
          <ul class="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>Mar 2026 - Paid</li>
            <li>Feb 2026 - Paid</li>
            <li>Jan 2026 - Paid</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class BillingComponent {}
