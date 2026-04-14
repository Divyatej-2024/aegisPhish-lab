import { Routes } from "@angular/router";

import { adminGuard } from "./guards/admin.guard";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  { path: "", loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent) },
  { path: "start", loadComponent: () => import("./pages/start/start.component").then((m) => m.StartComponent) },
  { path: "demo", loadComponent: () => import("./pages/demo/demo.component").then((m) => m.DemoComponent) },
  {
    path: "pricing",
    loadComponent: () => import("./pages/pricing/pricing.component").then((m) => m.PricingComponent),
  },
  {
    path: "compliance",
    loadComponent: () => import("./pages/compliance/compliance.component").then((m) => m.ComplianceComponent),
  },
  { path: "login", loadComponent: () => import("./pages/auth/auth.component").then((m) => m.AuthComponent) },
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: "reports",
    loadComponent: () => import("./pages/reports/reports.component").then((m) => m.ReportsComponent),
    canActivate: [authGuard],
  },
  {
    path: "billing",
    loadComponent: () => import("./pages/billing/billing.component").then((m) => m.BillingComponent),
    canActivate: [authGuard],
  },
  {
    path: "support",
    loadComponent: () => import("./pages/support/support.component").then((m) => m.SupportComponent),
    canActivate: [authGuard],
  },
  {
    path: "settings",
    loadComponent: () => import("./pages/settings/settings.component").then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: "settings/profile",
    loadComponent: () => import("./pages/profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: "settings/security",
    loadComponent: () => import("./pages/security/security.component").then((m) => m.SecurityComponent),
    canActivate: [authGuard],
  },
  {
    path: "training",
    loadComponent: () => import("./pages/training/training.component").then((m) => m.TrainingComponent),
    canActivate: [authGuard],
  },
  {
    path: "training/:page",
    loadComponent: () => import("./pages/training/training.component").then((m) => m.TrainingComponent),
    canActivate: [authGuard],
  },
  {
    path: "simulator",
    loadComponent: () => import("./pages/simulator/simulator.component").then((m) => m.SimulatorComponent),
    canActivate: [authGuard],
  },
  {
    path: "ctf",
    loadComponent: () => import("./pages/ctf/ctf.component").then((m) => m.CtfComponent),
    canActivate: [authGuard],
  },
  {
    path: "admin/login",
    loadComponent: () => import("./pages/admin-login/admin-login.component").then((m) => m.AdminLoginComponent),
  },
  {
    path: "admin",
    loadComponent: () => import("./pages/admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [adminGuard],
    canMatch: [adminGuard],
  },
  { path: "**", redirectTo: "" },
];
