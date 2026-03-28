import { Routes } from "@angular/router";

import { HomeComponent } from "./pages/home/home.component";
import { AdminComponent } from "./pages/admin/admin.component";
import { adminGuard } from "./guards/admin.guard";
import { authGuard } from "./guards/auth.guard";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { BillingComponent } from "./pages/billing/billing.component";
import { SupportComponent } from "./pages/support/support.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { SecurityComponent } from "./pages/security/security.component";
import { SettingsComponent } from "./pages/settings/settings.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { TrainingComponent } from "./pages/training/training.component";
import { AdminLoginComponent } from "./pages/admin-login/admin-login.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: AuthComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [authGuard] },
  { path: "reports", component: ReportsComponent, canActivate: [authGuard] },
  { path: "billing", component: BillingComponent, canActivate: [authGuard] },
  { path: "support", component: SupportComponent, canActivate: [authGuard] },
  { path: "settings", component: SettingsComponent, canActivate: [authGuard] },
  { path: "settings/profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: "settings/security", component: SecurityComponent, canActivate: [authGuard] },
  { path: "training", component: TrainingComponent, canActivate: [authGuard] },
  { path: "training/:page", component: TrainingComponent, canActivate: [authGuard] },
  { path: "admin/login", component: AdminLoginComponent },
  { path: "admin", component: AdminComponent, canActivate: [adminGuard], canMatch: [adminGuard] },
  { path: "**", redirectTo: "" },
];
