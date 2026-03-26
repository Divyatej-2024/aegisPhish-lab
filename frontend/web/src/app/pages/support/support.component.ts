import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-support",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-5xl px-4 py-8">
      <h1 class="text-xl font-semibold">Support</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Open a ticket or browse help resources.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Open Ticket</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Reach the security team with priority handling.
          </p>
          <button class="mt-4 rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-gray-400">
            New Ticket
          </button>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Knowledge Base</h2>
          <ul class="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>Setting up MFA</li>
            <li>Managing API keys</li>
            <li>Account recovery steps</li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class SupportComponent {}
