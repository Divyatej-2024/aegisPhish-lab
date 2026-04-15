import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";

import { ApiError, apiFetchJson } from "../../lib/api";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <h1 class="text-xl font-semibold">User Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Your training progress, simulator performance, and activity timeline.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-4 anim-stagger">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Sim Runs</h2>
          <p class="mt-2 text-2xl font-semibold">{{ summary()?.simRuns ?? 0 }}</p>
          <p class="text-xs text-gray-500">walkthrough levels</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Lab Runs</h2>
          <p class="mt-2 text-2xl font-semibold">{{ summary()?.labRuns ?? 0 }}</p>
          <p class="text-xs text-gray-500">scenario drills</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">CTF Submissions</h2>
          <p class="mt-2 text-2xl font-semibold">{{ summary()?.ctfSubmissions ?? 0 }}</p>
          <p class="text-xs text-gray-500">practice flags</p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Latest Sim Score</h2>
          <p class="mt-2 text-2xl font-semibold">
            {{ summary()?.latestSimScore ?? "--" }}
          </p>
          <p class="text-xs text-gray-500">most recent level</p>
        </div>
      </div>

      <div class="mt-8 rounded-lg border border-gray-200 dark:border-gray-800 p-4 anim-fade">
        <h2 class="text-sm font-medium">Last Activity</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ formatDate(summary()?.lastActivity) }}
        </p>
      </div>

      <p class="mt-4 text-sm text-red-600" *ngIf="error()">{{ error() }}</p>
    </section>
  `,
})
export class DashboardComponent {
  readonly summary = signal<any | null>(null);
  readonly error = signal<string | null>(null);

  constructor() {
    void this.loadSummary();
  }

  async loadSummary() {
    this.error.set(null);
    try {
      const payload = await apiFetchJson<{ summary?: any }>("/api/me/summary");
      this.summary.set(payload.summary ?? null);
    } catch (err) {
      this.summary.set(null);
      if (err instanceof ApiError && err.status === 401) {
        this.error.set("Session expired. Please sign in again.");
        return;
      }
      this.error.set("Unable to load dashboard summary.");
    }
  }

  formatDate(value: string | null) {
    if (!value) return "No recent activity yet.";
    return new Date(value).toLocaleString();
  }
}
