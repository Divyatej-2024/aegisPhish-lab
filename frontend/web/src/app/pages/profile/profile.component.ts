import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";

import { apiFetch } from "../../lib/api";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-5xl px-4 py-8 anim-fade-up">
      <h1 class="text-xl font-semibold">Profile</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Your account details and training history.
      </p>

      <div class="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 anim-fade">
        <div class="grid gap-4 md:grid-cols-2 anim-stagger">
          <div>
            <label class="text-xs text-gray-500">Name</label>
            <input
              class="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
              [value]="profile()?.name || ''"
              readonly
            />
          </div>
          <div>
            <label class="text-xs text-gray-500">Email</label>
            <input
              class="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
              [value]="profile()?.email || ''"
              readonly
            />
          </div>
        </div>
        <div class="mt-3 text-xs text-gray-500">Role: {{ profile()?.role || "user" }}</div>
      </div>

      <div class="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 anim-fade">
        <h2 class="text-sm font-semibold">Recent Simulator Runs</h2>
        <ul class="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <li *ngFor="let run of history()?.simRuns">
            {{ run.level?.title || "Unknown level" }} — {{ run.status }} — score {{ run.score ?? 0 }}
          </li>
          <li *ngIf="history()?.simRuns?.length === 0">No simulator runs yet.</li>
        </ul>
      </div>

      <div class="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 anim-fade">
        <h2 class="text-sm font-semibold">Recent Lab Scenarios</h2>
        <ul class="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <li *ngFor="let run of history()?.labRuns">
            {{ run.scenario?.title || "Unknown scenario" }} — {{ run.status }}
          </li>
          <li *ngIf="history()?.labRuns?.length === 0">No lab runs yet.</li>
        </ul>
      </div>

      <div class="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 anim-fade">
        <h2 class="text-sm font-semibold">Recent CTF Submissions</h2>
        <ul class="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <li *ngFor="let submission of history()?.ctfSubmissions">
            {{ submission.challenge?.title || "Unknown challenge" }} —
            {{ submission.correct ? "Correct" : "Incorrect" }}
          </li>
          <li *ngIf="history()?.ctfSubmissions?.length === 0">No CTF submissions yet.</li>
        </ul>
      </div>
    </section>
  `,
})
export class ProfileComponent {
  readonly profile = signal<any | null>(null);
  readonly history = signal<any | null>(null);

  constructor() {
    void this.loadProfile();
    void this.loadHistory();
  }

  async loadProfile() {
    try {
      const response = await apiFetch("/api/me/profile");
      if (!response.ok) return;
      const payload = await response.json();
      this.profile.set(payload.profile ?? null);
    } catch {
      this.profile.set(null);
    }
  }

  async loadHistory() {
    try {
      const response = await apiFetch("/api/me/history");
      if (!response.ok) return;
      const payload = await response.json();
      this.history.set(payload.history ?? null);
    } catch {
      this.history.set(null);
    }
  }
}
