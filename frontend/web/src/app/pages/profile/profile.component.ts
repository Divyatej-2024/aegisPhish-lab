import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-5xl px-4 py-8">
      <h1 class="text-xl font-semibold">Profile</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Keep your account details up to date.
      </p>

      <div class="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="text-xs text-gray-500">Name</label>
            <input
              class="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
              value="Admin User"
            />
          </div>
          <div>
            <label class="text-xs text-gray-500">Email</label>
            <input
              class="mt-1 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
              value="admin@example.com"
            />
          </div>
        </div>
        <button class="mt-4 rounded-md bg-gray-900 px-3 py-2 text-xs text-white hover:bg-gray-800">
          Save Changes
        </button>
      </div>
    </section>
  `,
})
export class ProfileComponent {}
