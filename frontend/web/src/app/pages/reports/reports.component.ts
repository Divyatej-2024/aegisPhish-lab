import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { env } from "@aegisPhish-lab/env/web";
import { apiFetch } from "../../lib/api";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl font-semibold">Phishing Campaigns</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Launch simulations, track outcomes, and coach risky users.
          </p>
        </div>
        <button
          class="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:border-gray-400"
          (click)="loadCampaigns()"
          [disabled]="loading()"
        >
          Refresh
        </button>
      </div>

      <div class="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold">Active Campaigns</h2>
            <span class="text-xs text-gray-500">Total: {{ campaigns().length }}</span>
          </div>

          <div class="mt-3 text-xs text-gray-600 dark:text-gray-400" *ngIf="loading()">
            Loading campaigns...
          </div>
          <div class="mt-3 text-xs text-red-600" *ngIf="error()">
            {{ error() }}
          </div>

          <div class="mt-3 overflow-x-auto" *ngIf="!loading() && !error()">
            <table class="min-w-full text-left text-xs">
              <thead class="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                <tr>
                  <th class="px-3 py-2 font-medium">Name</th>
                  <th class="px-3 py-2 font-medium">Status</th>
                  <th class="px-3 py-2 font-medium">Targets</th>
                  <th class="px-3 py-2 font-medium">Clicks</th>
                  <th class="px-3 py-2 font-medium">Submits</th>
                  <th class="px-3 py-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let campaign of campaigns()" class="border-b border-gray-100 dark:border-gray-900">
                  <td class="px-3 py-2">
                    <div class="font-medium">{{ campaign.name }}</div>
                    <div class="text-[11px] text-gray-500">{{ campaign.description || "No description" }}</div>
                  </td>
                  <td class="px-3 py-2 capitalize">{{ campaign.status }}</td>
                  <td class="px-3 py-2">{{ campaign.targetCount }}</td>
                  <td class="px-3 py-2">
                    {{ campaign.clickCount }}
                    <span class="text-[11px] text-gray-500">({{ rate(campaign.clickCount, campaign.targetCount) }})</span>
                  </td>
                  <td class="px-3 py-2">
                    {{ campaign.submitCount }}
                    <span class="text-[11px] text-gray-500">({{ rate(campaign.submitCount, campaign.targetCount) }})</span>
                  </td>
                  <td class="px-3 py-2">{{ formatDate(campaign.createdAt) }}</td>
                </tr>
                <tr *ngIf="campaigns().length === 0">
                  <td colspan="6" class="px-3 py-3 text-center text-gray-500">No campaigns yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-semibold">Create Campaign</h2>
          <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Add targets as one per line. Example: Jane Doe &lt;jane@acme.com&gt;.
          </p>

          <div class="mt-4 grid gap-3">
            <label class="text-xs text-gray-600 dark:text-gray-400">
              Name
              <input
                class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                type="text"
                [(ngModel)]="newName"
              />
            </label>
            <label class="text-xs text-gray-600 dark:text-gray-400">
              Description
              <input
                class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                type="text"
                [(ngModel)]="newDescription"
              />
            </label>
            <label class="text-xs text-gray-600 dark:text-gray-400">
              Status
              <select
                class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                [(ngModel)]="newStatus"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label class="text-xs text-gray-600 dark:text-gray-400">
              Targets
              <textarea
                class="mt-1 h-32 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                [(ngModel)]="newTargets"
              ></textarea>
            </label>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
              (click)="createCampaign()"
              [disabled]="creating()"
            >
              Create Campaign
            </button>
            <span class="text-xs text-red-600" *ngIf="createError()">{{ createError() }}</span>
          </div>

          <div class="mt-5 rounded-md border border-gray-200 dark:border-gray-800 p-3" *ngIf="createdTargets().length > 0">
            <h3 class="text-xs font-semibold">Tracking Links (latest campaign)</h3>
            <ul class="mt-2 space-y-1 text-[11px] text-gray-600 dark:text-gray-400">
              <li *ngFor="let target of createdTargets()">
                {{ target.email }} — {{ buildLink(target.token) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ReportsComponent {
  readonly campaignsData = signal<any[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly creating = signal(false);
  readonly createError = signal<string | null>(null);
  readonly createdTargets = signal<any[]>([]);

  newName = "";
  newDescription = "";
  newStatus = "draft";
  newTargets = "";

  readonly campaigns = computed(() => this.campaignsData());

  constructor() {
    void this.loadCampaigns();
  }

  async loadCampaigns() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await apiFetch("/api/phish/campaigns");
      if (!response.ok) {
        const message = await response.text();
        this.error.set(message || "Failed to load campaigns.");
        this.campaignsData.set([]);
        return;
      }

      const payload = await response.json();
      this.campaignsData.set(payload.campaigns ?? []);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Failed to load campaigns.");
      this.campaignsData.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async createCampaign() {
    if (!this.newName.trim()) {
      this.createError.set("Campaign name is required.");
      return;
    }

    this.creating.set(true);
    this.createError.set(null);

    try {
      const response = await apiFetch("/api/phish/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.newName.trim(),
          description: this.newDescription.trim(),
          status: this.newStatus,
          targets: this.newTargets,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        this.createError.set(message || "Unable to create campaign.");
        return;
      }

      const payload = await response.json();
      this.createdTargets.set(payload.targets ?? []);
      this.newName = "";
      this.newDescription = "";
      this.newStatus = "draft";
      this.newTargets = "";
      await this.loadCampaigns();
    } catch (err) {
      this.createError.set(err instanceof Error ? err.message : "Unable to create campaign.");
    } finally {
      this.creating.set(false);
    }
  }

  buildLink(token: string) {
    const base = env.NEXT_PUBLIC_APP_URL || window.location.origin;
    return `${base}/phish/${token}`;
  }

  formatDate(value: string) {
    if (!value) return "--";
    return new Date(value).toLocaleDateString();
  }

  rate(part: number, total: number) {
    if (!total) return "0%";
    return `${Math.round((part / total) * 100)}%`;
  }
}
