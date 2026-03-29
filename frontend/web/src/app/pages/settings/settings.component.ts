import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container mx-auto max-w-5xl px-4 py-8 anim-fade-up">
      <h1 class="text-xl font-semibold">Settings</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Personalize your account and security preferences.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-2 anim-stagger">
        <a
          routerLink="/settings/profile"
          class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300"
        >
          <h2 class="text-sm font-medium">Profile</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Update contact and identity details.
          </p>
        </a>
        <a
          routerLink="/settings/security"
          class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300"
        >
          <h2 class="text-sm font-medium">Security</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Manage MFA, sessions, and devices.
          </p>
        </a>
      </div>
    </section>
  `,
})
export class SettingsComponent {}
