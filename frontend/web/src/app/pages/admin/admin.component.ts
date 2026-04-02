import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { apiFetch } from "../../lib/api";
import { currentUser, startAuthListener } from "../../lib/auth-state";
import { getIdTokenClaims } from "../../lib/firebase-auth";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-xl font-semibold">Admin Console</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Control access, manage users, and oversee security posture.
            </p>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
            Session: {{ sessionUserEmail() || "unknown" }}
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-3 anim-stagger">
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h2 class="text-sm font-medium">MFA Enforcement</h2>
            <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Encourage two-factor authentication for privileged users.
            </p>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h2 class="text-sm font-medium">Roles & Permissions</h2>
            <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Default role model is active. Seed at least one admin account.
            </p>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h2 class="text-sm font-medium">Audit Readiness</h2>
            <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Track account actions and session activity.
            </p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-3 anim-stagger" *ngIf="summary()">
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-xs font-semibold text-gray-500">Total Users</h3>
            <p class="mt-2 text-2xl font-semibold">{{ summary()?.users }}</p>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-xs font-semibold text-gray-500">Active Campaigns</h3>
            <p class="mt-2 text-2xl font-semibold">{{ summary()?.campaigns }}</p>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-xs font-semibold text-gray-500">Phish Events</h3>
            <p class="mt-2 text-2xl font-semibold">{{ summary()?.phishEvents }}</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]" *ngIf="analytics()">
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-xs font-semibold text-gray-500">Campaign Analytics (7 days)</h3>
            <div class="mt-3 overflow-x-auto">
              <table class="min-w-full text-left text-xs">
                <thead class="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                  <tr>
                    <th class="px-3 py-2 font-medium">Campaign</th>
                    <th class="px-3 py-2 font-medium">Status</th>
                    <th class="px-3 py-2 font-medium">Opens</th>
                    <th class="px-3 py-2 font-medium">Clicks</th>
                    <th class="px-3 py-2 font-medium">Submits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of analytics()?.campaignRows" class="border-b border-gray-100 dark:border-gray-900">
                    <td class="px-3 py-2">{{ row.name }}</td>
                    <td class="px-3 py-2 capitalize">{{ row.status }}</td>
                    <td class="px-3 py-2">{{ row.opens }}</td>
                    <td class="px-3 py-2">{{ row.clicks }}</td>
                    <td class="px-3 py-2">{{ row.submits }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4">
            <h3 class="text-xs font-semibold text-gray-500">Risky Users</h3>
            <ul class="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li *ngFor="let user of analytics()?.riskyUsers">
                {{ user.email }} — score {{ user.score }}
              </li>
              <li *ngIf="analytics()?.riskyUsers?.length === 0">No recent risky actions.</li>
            </ul>
            <div class="mt-4 text-xs text-gray-500">
              Sim runs: {{ analytics()?.simRuns }} · Lab runs: {{ analytics()?.labRuns }}
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div class="rounded-md border border-gray-200 dark:border-gray-800 p-4 anim-fade">
            <h2 class="text-sm font-semibold">Admin Actions</h2>
            <p class="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Create users and manage admin access directly from the console.
            </p>

            <div class="mt-4 grid gap-3 md:grid-cols-4">
              <label class="text-xs text-gray-600 dark:text-gray-400">
                Email
                <input
                  class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                  type="email"
                  [(ngModel)]="newEmail"
                />
              </label>
              <label class="text-xs text-gray-600 dark:text-gray-400">
                Password
                <input
                  class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                  type="password"
                  [(ngModel)]="newPassword"
                />
              </label>
              <label class="text-xs text-gray-600 dark:text-gray-400">
                Display Name
                <input
                  class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                  type="text"
                  [(ngModel)]="newName"
                />
              </label>
              <label class="text-xs text-gray-600 dark:text-gray-400">
                Role
                <input
                  class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-xs"
                  type="text"
                  placeholder="admin or user"
                  [(ngModel)]="newRole"
                />
              </label>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-3">
              <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" [(ngModel)]="newAdmin" />
                Make admin
              </label>
              <button
                class="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
                (click)="createUser()"
                [disabled]="creating()"
              >
                Create User
              </button>
              <span class="text-xs text-red-600" *ngIf="actionError()">{{ actionError() }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between mt-6">
            <h2 class="text-sm font-semibold">Users</h2>
            <button
              class="text-xs text-blue-600 hover:text-blue-500"
              (click)="loadUsers()"
              [disabled]="loading()"
            >
              Refresh
            </button>
          </div>

          <div class="mt-3 rounded-md border border-gray-200 dark:border-gray-800">
            <div class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400" *ngIf="loading()">
              Loading users...
            </div>
            <div class="px-4 py-3 text-xs text-red-600" *ngIf="error()">
              {{ error() }}
            </div>
            <div class="overflow-x-auto" *ngIf="!loading() && !error()">
              <table class="min-w-full text-left text-xs">
                <thead class="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                  <tr>
                    <th class="px-4 py-2 font-medium">Name</th>
                    <th class="px-4 py-2 font-medium">Email</th>
                    <th class="px-4 py-2 font-medium">Role</th>
                    <th class="px-4 py-2 font-medium">Status</th>
                    <th class="px-4 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of users()" class="border-b border-gray-100 dark:border-gray-900">
                    <td class="px-4 py-2">{{ user.name || "--" }}</td>
                    <td class="px-4 py-2">{{ user.email || "--" }}</td>
                    <td class="px-4 py-2">{{ user.role || "user" }}</td>
                    <td class="px-4 py-2">
                      <span [class]="user.banned ? 'text-red-600' : 'text-emerald-600'">
                        {{ user.banned ? "Banned" : "Active" }}
                      </span>
                    </td>
                    <td class="px-4 py-2">
                      <div class="flex flex-wrap gap-2">
                        <button
                          class="rounded-full border border-gray-300 px-3 py-1 text-[11px]"
                          (click)="toggleAdmin(user)"
                        >
                          {{ user.admin ? "Remove admin" : "Make admin" }}
                        </button>
                        <button
                          class="rounded-full border border-gray-300 px-3 py-1 text-[11px]"
                          (click)="toggleDisabled(user)"
                        >
                          {{ user.banned ? "Enable" : "Disable" }}
                        </button>
                        <button
                          class="rounded-full border border-gray-300 px-3 py-1 text-[11px]"
                          (click)="promptRole(user)"
                        >
                          Set role
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="users().length === 0">
                    <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminComponent {
  private readonly sessionData = signal<any | null>(null);
  private readonly usersData = signal<any[]>([]);
  readonly summary = signal<any | null>(null);
  readonly analytics = signal<any | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly creating = signal(false);
  readonly actionError = signal<string | null>(null);

  newEmail = "";
  newPassword = "";
  newName = "";
  newRole = "";
  newAdmin = false;

  readonly users = computed(() => this.usersData());
  readonly sessionUserEmail = computed(() => this.sessionData()?.email);

  constructor() {
    startAuthListener();
    void this.loadUsers();
    void this.loadSummary();
    void this.loadAnalytics();
  }

  async loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const user = currentUser();
      this.sessionData.set(user ? { email: user.email } : null);

      const response = await apiFetch(`/api/admin/users?limit=20`);
      if (!response.ok) {
        const message = await response.text();
        this.error.set(message || "Failed to load users.");
        this.usersData.set([]);
        return;
      }

      const payload = await response.json();
      this.usersData.set(payload.users ?? []);

      const claims = await getIdTokenClaims();
      if (!claims?.["admin"] && !claims?.["role"]) {
        this.error.set("Admin claims missing. Add Firebase custom claim: { admin: true }.");
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Failed to load users.");
      this.usersData.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async createUser() {
    if (!this.newEmail.trim() || !this.newPassword) {
      this.actionError.set("Email and password are required.");
      return;
    }

    this.creating.set(true);
    this.actionError.set(null);

    try {
      const response = await apiFetch(`/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.newEmail.trim(),
          password: this.newPassword,
          displayName: this.newName.trim(),
          role: this.newRole.trim(),
          admin: this.newAdmin,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        this.actionError.set(message || "Unable to create user.");
        return;
      }

      this.newEmail = "";
      this.newPassword = "";
      this.newName = "";
      this.newRole = "";
      this.newAdmin = false;

      await this.loadUsers();
    } catch (err) {
      this.actionError.set(err instanceof Error ? err.message : "Unable to create user.");
    } finally {
      this.creating.set(false);
    }
  }

  async loadSummary() {
    try {
      const response = await apiFetch("/api/admin/summary");
      if (!response.ok) return;
      const payload = await response.json();
      this.summary.set(payload.summary ?? null);
    } catch {
      this.summary.set(null);
    }
  }

  async loadAnalytics() {
    try {
      const response = await apiFetch("/api/admin/analytics");
      if (!response.ok) return;
      const payload = await response.json();
      this.analytics.set(payload.analytics ?? null);
    } catch {
      this.analytics.set(null);
    }
  }

  async toggleAdmin(user: { uid: string; admin?: boolean }) {
    await this.updateUser(user.uid, { admin: !user.admin });
  }

  async toggleDisabled(user: { uid: string; banned?: boolean }) {
    await this.updateUser(user.uid, { disabled: !user.banned });
  }

  async promptRole(user: { uid: string; role?: string }) {
    const next = window.prompt("Enter role (admin, trainer, user):", user.role ?? "user");
    if (next === null) return;
    await this.updateUser(user.uid, { role: next.trim() });
  }

  private async updateUser(uid: string, payload: Record<string, unknown>) {
    this.actionError.set(null);
    try {
      const response = await apiFetch(`/api/admin/users/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        this.actionError.set(message || "Unable to update user.");
        return;
      }

      await this.loadUsers();
    } catch (err) {
      this.actionError.set(err instanceof Error ? err.message : "Unable to update user.");
    }
  }
}
