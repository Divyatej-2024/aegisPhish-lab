import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { currentUser, isAdmin, startAuthListener } from "../lib/auth-state";
import { signOutUser } from "../lib/firebase-auth";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="anim-fade flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="font-semibold">AegisPhish Suite</span>
        <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-600 dark:bg-gray-900 dark:text-gray-400">
          full product
        </span>
      </div>
      <nav class="flex flex-wrap items-center gap-3">
        <a
          routerLink="/"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Home
        </a>
        <a
          routerLink="/dashboard"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Dashboard
        </a>
        <a
          routerLink="/reports"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Reports
        </a>
        <a
          routerLink="/billing"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Billing
        </a>
        <a
          routerLink="/support"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Support
        </a>
        <a
          routerLink="/settings"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Settings
        </a>
        <a
          routerLink="/training"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Training
        </a>
        <a
          routerLink="/admin"
          routerLinkActive="text-gray-900 dark:text-gray-100"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          *ngIf="admin()"
        >
          Admin
        </a>
        <a
          *ngIf="!user()"
          routerLink="/login"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Sign in
        </a>
        <button
          *ngIf="user()"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          (click)="handleSignOut()"
        >
          Sign out
        </button>
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  readonly user = currentUser;
  readonly admin = isAdmin;

  constructor() {
    startAuthListener();
  }

  async handleSignOut() {
    await signOutUser();
  }
}
