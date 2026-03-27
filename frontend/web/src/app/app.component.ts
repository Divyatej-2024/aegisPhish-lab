import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./components/header.component";
import { startAuthListener } from "./lib/auth-state";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="grid grid-rows-[auto_1fr] min-h-screen">
      <app-header />
      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  title = "Better T Stack";

  constructor() {
    startAuthListener();
  }
}
