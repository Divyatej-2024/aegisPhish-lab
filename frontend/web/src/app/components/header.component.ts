import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

import { currentUser, isAdmin } from "../lib/auth-state";
import { signOutUser } from "../lib/firebase-auth";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="anim-fade border-b border-gray-200/70 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/70">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div class="flex items-center gap-2">
          <a routerLink="/" class="text-sm font-semibold tracking-wide">AegisPhish Lab</a>
          <span class="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-700 md:inline">
            secure mode
          </span>
        </div>

        <button
          type="button"
          class="rounded-md border border-gray-300 px-2 py-1 text-xs md:hidden"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <nav class="hidden items-center gap-2 md:flex" aria-label="Main navigation">
          <a
            *ngFor="let item of visibleNav()"
            [routerLink]="item.path"
            routerLinkActive="active-link"
            class="nav-link"
          >
            {{ item.label }}
          </a>
          <a *ngIf="!user()" routerLink="/login" class="btn-secondary">Sign in</a>
          <button *ngIf="user()" type="button" class="btn-secondary" (click)="handleSignOut()">Sign out</button>
        </nav>
      </div>

      <nav
        *ngIf="menuOpen()"
        class="mx-auto grid max-w-7xl gap-1 border-t border-gray-200/70 px-4 pb-4 pt-2 md:hidden"
        aria-label="Mobile navigation"
      >
        <a
          *ngFor="let item of visibleNav()"
          [routerLink]="item.path"
          routerLinkActive="active-link"
          class="nav-link nav-link-mobile"
          (click)="menuOpen.set(false)"
        >
          {{ item.label }}
        </a>
        <a *ngIf="!user()" routerLink="/login" class="btn-secondary" (click)="menuOpen.set(false)">Sign in</a>
        <button *ngIf="user()" type="button" class="btn-secondary text-left" (click)="handleSignOut()">
          Sign out
        </button>
      </nav>
    </header>
  `,
  styles: [`
    .nav-link {
      border-radius: 0.5rem;
      padding: 0.38rem 0.58rem;
      color: #475569;
      font-size: 0.8rem;
      transition: background-color 160ms ease, color 160ms ease;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .nav-link-mobile {
      padding: 0.55rem 0.6rem;
      border: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .active-link {
      background: #0f172a;
      color: #ffffff !important;
    }

    .btn-secondary {
      border: 1px solid #cbd5e1;
      border-radius: 0.5rem;
      background: #ffffff;
      color: #0f172a;
      padding: 0.38rem 0.72rem;
      font-size: 0.8rem;
      line-height: 1.1rem;
    }

    .btn-secondary:hover {
      background: #f8fafc;
    }
  `],
})
export class HeaderComponent {
  readonly user = currentUser;
  readonly admin = isAdmin;
  readonly menuOpen = signal(false);

  private readonly publicNav = [
    { label: "Home", path: "/" },
    { label: "Start", path: "/start" },
    { label: "Demo", path: "/demo" },
    { label: "Pricing", path: "/pricing" },
    { label: "Compliance", path: "/compliance" },
  ];

  private readonly privateNav = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Reports", path: "/reports" },
    { label: "Training", path: "/training" },
    { label: "Simulator", path: "/simulator" },
    { label: "CTF", path: "/ctf" },
    { label: "Settings", path: "/settings" },
  ];

  readonly visibleNav = computed(() => {
    const nav = [...this.publicNav];
    if (this.user()) nav.push(...this.privateNav);
    if (this.admin()) nav.push({ label: "Admin", path: "/admin" });
    return nav;
  });

  async handleSignOut() {
    await signOutUser();
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }
}
