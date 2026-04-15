import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./components/header.component";
import { startAuthListener } from "./lib/auth-state";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-xs focus:text-white"
    >
      Skip to main content
    </a>
    <div class="grid grid-rows-[auto_1fr] min-h-screen">
      <app-header />
      <main id="main-content">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  constructor() {
    startAuthListener();
  }
}
