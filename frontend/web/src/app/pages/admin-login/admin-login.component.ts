import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { isAdminUser, signInWithEmail, signInWithGoogle, signOutUser } from "../../lib/firebase-auth";
import { currentUser, startAuthListener } from "../../lib/auth-state";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container mx-auto max-w-md px-4 py-10">
      <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h1 class="text-2xl font-semibold">Admin Sign In</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Admin access requires a verified account with the admin claim.
        </p>

        <div class="mt-6 space-y-4" *ngIf="!user()">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
            Email
            <input
              class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm"
              type="email"
              [(ngModel)]="email"
              autocomplete="email"
            />
          </label>

          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
            Password
            <input
              class="mt-1 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm"
              type="password"
              [(ngModel)]="password"
              autocomplete="current-password"
            />
          </label>

          <div class="text-xs text-red-600" *ngIf="error()">{{ error() }}</div>

          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
              (click)="handleEmailAuth()"
              [disabled]="loading()"
            >
              Sign in
            </button>
            <button
              class="rounded-md border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
              (click)="handleGoogleAuth()"
              [disabled]="loading()"
            >
              Continue with Google
            </button>
          </div>
        </div>

        <div class="mt-6" *ngIf="user()">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Signed in as <span class="font-medium">{{ user()?.email }}</span>
          </p>
          <div class="mt-4 flex gap-3">
            <button
              class="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
              (click)="goToAdmin()"
            >
              Go to Admin
            </button>
            <button
              class="rounded-md border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
              (click)="handleSignOut()"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminLoginComponent {
  email = "";
  password = "";
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly user = currentUser;

  constructor(private readonly router: Router) {
    startAuthListener();
  }

  async handleEmailAuth() {
    this.loading.set(true);
    this.error.set(null);

    try {
      await signInWithEmail(this.email.trim(), this.password);
      await this.ensureAdminAccess();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to authenticate.");
    } finally {
      this.loading.set(false);
    }
  }

  async handleGoogleAuth() {
    this.loading.set(true);
    this.error.set(null);

    try {
      await signInWithGoogle();
      await this.ensureAdminAccess();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      this.loading.set(false);
    }
  }

  async ensureAdminAccess() {
    const admin = await isAdminUser();
    if (!admin) {
      await signOutUser();
      this.error.set("Admin access required. Ask an admin to grant your account access.");
      return;
    }
    await this.router.navigateByUrl("/admin");
  }

  async handleSignOut() {
    await signOutUser();
  }

  async goToAdmin() {
    await this.router.navigateByUrl("/admin");
  }
}
