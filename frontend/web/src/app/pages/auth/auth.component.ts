import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { signInWithEmail, signInWithGoogle, signOutUser, signUpWithEmail } from "../../lib/firebase-auth";
import { currentUser, startAuthListener } from "../../lib/auth-state";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container mx-auto max-w-md px-4 py-10 anim-fade-up">
      <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 anim-fade">
        <h1 class="text-2xl font-semibold">Sign in to AegisPhish</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Email/password + Google sign-in are enabled for compliance-grade access control.
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
              {{ mode() === "signin" ? "Sign in" : "Create account" }}
            </button>
            <button
              class="rounded-md border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
              (click)="handleGoogleAuth()"
              [disabled]="loading()"
            >
              Continue with Google
            </button>
          </div>

          <button class="mt-2 text-xs text-blue-600 hover:text-blue-500" (click)="toggleMode()">
            {{ mode() === "signin" ? "Need an account? Sign up" : "Have an account? Sign in" }}
          </button>
        </div>

        <div class="mt-6" *ngIf="user()">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Signed in as <span class="font-medium">{{ user()?.email }}</span>
          </p>
          <div class="mt-4 flex gap-3">
            <button
              class="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
              (click)="goToDashboard()"
            >
              Go to Dashboard
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
export class AuthComponent {
  email = "";
  password = "";
  readonly mode = signal<"signin" | "signup">("signin");
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly user = currentUser;

  constructor(private readonly router: Router) {
    startAuthListener();
  }

  toggleMode() {
    this.mode.set(this.mode() === "signin" ? "signup" : "signin");
  }

  async handleEmailAuth() {
    this.loading.set(true);
    this.error.set(null);

    try {
      if (this.mode() === "signin") {
        await signInWithEmail(this.email.trim(), this.password);
      } else {
        await signUpWithEmail(this.email.trim(), this.password);
      }
      await this.router.navigateByUrl("/dashboard");
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
      await this.router.navigateByUrl("/dashboard");
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      this.loading.set(false);
    }
  }

  async handleSignOut() {
    await signOutUser();
  }

  async goToDashboard() {
    await this.router.navigateByUrl("/dashboard");
  }
}
