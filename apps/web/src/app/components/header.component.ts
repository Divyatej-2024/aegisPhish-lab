import { Component } from "@angular/core";

@Component({
  selector: "app-header",
  standalone: true,
  template: `
    <header class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="font-semibold">Better Fullstack</span>
      </div>
      <nav class="flex items-center gap-4">
        <a href="https://github.com/Marve10s/Better-Fullstack"
           target="_blank"
           rel="noopener noreferrer"
           class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          GitHub
        </a>
        <a href="https://better-fullstack-web.vercel.app"
           target="_blank"
           rel="noopener noreferrer"
           class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          Docs
        </a>
      </nav>
    </header>
  `,
})
export class HeaderComponent {}
