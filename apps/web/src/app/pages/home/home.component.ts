import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto max-w-5xl px-4 py-10">
      <div class="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-10">
        <h1 class="text-3xl font-semibold leading-tight">
          AegisPhish Suite
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          A full product suite for admins and end users. Manage security, billing, support,
          analytics, and user experience in one place.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            routerLink="/dashboard"
          >
            Go to Dashboard
          </a>
          <a
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300"
            routerLink="/admin"
          >
            Admin Console
          </a>
        </div>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-semibold">User Experience</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Dashboards, reports, billing, and support for end users.
          </p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-semibold">Admin Control</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Roles, permissions, audit visibility, and user management.
          </p>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 class="text-sm font-semibold">Security Core</h2>
          <p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            MFA support, session management, and risk controls.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  titleText = `
 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557
 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557
 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2557     \u2588\u2588\u2551      \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D
 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u255D     \u2588\u2588\u2551      \u2588\u2588\u2551   \u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557
 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2551      \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2557
 \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D   \u255A\u2550\u255D      \u255A\u2550\u255D   \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D

 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557
 \u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D    \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551 \u2588\u2588\u2554\u255D
    \u2588\u2588\u2551       \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2554\u255D
    \u2588\u2588\u2551       \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2588\u2588\u2557
    \u2588\u2588\u2551       \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2557
    \u255A\u2550\u255D       \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D   \u255A\u2550\u255D   \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D
`;
}
