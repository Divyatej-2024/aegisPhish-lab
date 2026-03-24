import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-security",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-5xl px-4 py-8">
      <h1 class="text-xl font-semibold">Security</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Configure MFA and review sessions.
      </p>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Multi-Factor Authentication</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Add an authenticator app to protect your account.
          </p>
          <button class="mt-4 rounded-md bg-gray-900 px-3 py-1 text-xs text-white hover:bg-gray-800">
            Enable MFA
          </button>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-medium">Active Sessions</h2>
          <ul class="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>London - Chrome - Active</li>
            <li>New York - Safari - 2 days ago</li>
          </ul>
          <button class="mt-4 rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-gray-400">
            Revoke Other Sessions
          </button>
        </div>
      </div>
    </section>
  `,
})
export class SecurityComponent {}
