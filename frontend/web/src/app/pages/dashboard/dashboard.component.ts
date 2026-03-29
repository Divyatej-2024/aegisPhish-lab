import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <h1 class="text-xl font-semibold">User Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Quick view of activity, status, and recent changes.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-3 anim-stagger">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Active Projects</h2>
          <p class="mt-2 text-2xl font-semibold">3</p>
          <p class="text-xs text-gray-500">across 2 teams</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Open Alerts</h2>
          <p class="mt-2 text-2xl font-semibold">1</p>
          <p class="text-xs text-gray-500">needs review</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Last Login</h2>
          <p class="mt-2 text-2xl font-semibold">Today</p>
          <p class="text-xs text-gray-500">08:21</p>
        </div>
      </div>

      <div class="mt-8 rounded-lg border border-gray-200 dark:border-gray-800 p-4 anim-fade">
        <h2 class="text-sm font-medium">Activity Feed</h2>
        <ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>Report export completed</li>
          <li>Security policy updated</li>
          <li>Billing invoice paid</li>
        </ul>
      </div>
    </section>
  `,
})
export class DashboardComponent {}
