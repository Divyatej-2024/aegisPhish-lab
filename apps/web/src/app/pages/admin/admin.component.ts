import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";

import { authClient } from "../../lib/auth-client";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8">
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

        <div class="mt-6 grid gap-4 md:grid-cols-3">
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

        <div class="mt-8">
          <div class="flex items-center justify-between">
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
                  </tr>
                  <tr *ngIf="users().length === 0">
                    <td colspan="4" class="px-4 py-3 text-center text-gray-500">
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
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly users = computed(() => this.usersData());
  readonly sessionUserEmail = computed(() => this.sessionData()?.user?.email);

  constructor() {
    void this.loadUsers();
  }

  async loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const sessionResponse = await authClient.getSession();
      this.sessionData.set(sessionResponse.data ?? null);

      const response = await authClient.admin.listUsers({
        query: {
          limit: 20,
          offset: 0,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (response.error) {
        this.error.set(response.error.message ?? "Failed to load users.");
        this.usersData.set([]);
      } else {
        this.usersData.set(response.data?.users ?? []);
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Failed to load users.");
      this.usersData.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
