import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-[#070b16] text-white">
      <section class="relative mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div class="absolute -top-24 right-10 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div class="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]"></div>
        <div class="relative grid items-center gap-10 lg:grid-cols-2">
          <div class="space-y-6">
            <p class="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs uppercase tracking-widest text-blue-200">
              Cybersecurity Training Platform
            </p>
            <h1 class="text-4xl font-semibold leading-tight md:text-5xl">
              AegisPhish Lab helps teams reduce phishing risk with safe, realistic training.
            </h1>
            <p class="text-base text-blue-100/80 md:text-lg">
              Built for IT and security leaders who need measurable awareness, improved
              employee behavior, and clear reporting without disrupting work.
            </p>
            <div class="flex flex-wrap gap-4">
              <a
                class="rounded-md bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
                routerLink="/start"
              >
                Request Setup
              </a>
              <a
                class="rounded-md border border-blue-400/40 bg-white/5 px-6 py-3 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:bg-white/10"
                routerLink="/demo"
              >
                View Demo
              </a>
            </div>
            <p class="text-xs text-blue-200/70">No credit card. Setup takes minutes.</p>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-500/10 backdrop-blur-md">
            <div class="rounded-xl border border-white/10 bg-[#0b1222] p-4">
              <div class="mb-4 flex items-center justify-between text-xs text-blue-200/70">
                <span>Dashboard Preview</span>
                <span class="rounded-full bg-blue-500/20 px-2 py-1 text-[10px] uppercase">
                  Live
                </span>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                  <p class="text-xs text-blue-200/60">Phish Click Rate</p>
                  <p class="mt-2 text-2xl font-semibold">12%</p>
                  <p class="mt-1 text-xs text-blue-300">Down 18%</p>
                </div>
                <div class="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                  <p class="text-xs text-blue-200/60">Training Completion</p>
                  <p class="mt-2 text-2xl font-semibold">86%</p>
                  <p class="mt-1 text-xs text-blue-300">Up 24%</p>
                </div>
                <div class="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                  <p class="text-xs text-blue-200/60">High-Risk Users</p>
                  <p class="mt-2 text-2xl font-semibold">14</p>
                  <p class="mt-1 text-xs text-blue-300">Down 9%</p>
                </div>
                <div class="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                  <p class="text-xs text-blue-200/60">Reported Attempts</p>
                  <p class="mt-2 text-2xl font-semibold">312</p>
                  <p class="mt-1 text-xs text-blue-300">Up 31%</p>
                </div>
              </div>
              <div class="mt-5 h-2 w-full rounded-full bg-white/10">
                <div class="h-2 w-2/3 rounded-full bg-blue-500/70"></div>
              </div>
              <p class="mt-2 text-xs text-blue-200/60">
                Awareness score improved over the last 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-12">
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-blue-400/40">
            <h3 class="text-lg font-semibold">Employees still click phishing links</h3>
            <p class="mt-3 text-sm text-blue-100/70">
              Well-crafted attacks continue to bypass awareness and put accounts at risk.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-blue-400/40">
            <h3 class="text-lg font-semibold">Training is inconsistent or forgotten</h3>
            <p class="mt-3 text-sm text-blue-100/70">
              Most programs are one-time events that do not change behavior long-term.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-blue-400/40">
            <h3 class="text-lg font-semibold">Real attacks cost time and money</h3>
            <p class="mt-3 text-sm text-blue-100/70">
              A single incident can trigger downtime, remediation, and compliance impact.
            </p>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-12">
        <div class="mb-8">
          <h2 class="text-3xl font-semibold">
            AegisPhish Lab is the safer way to train.
          </h2>
          <p class="mt-3 text-blue-100/70">
            Run realistic simulations without risk, measure behavior instantly, and deliver
            targeted coaching where it is needed most.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-4">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur-md transition hover:bg-white/10">
            <span class="text-blue-300">✔</span>
            <p class="mt-2">Safe, controlled simulations</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur-md transition hover:bg-white/10">
            <span class="text-blue-300">✔</span>
            <p class="mt-2">Real-time tracking and scoring</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur-md transition hover:bg-white/10">
            <span class="text-blue-300">✔</span>
            <p class="mt-2">Easy setup for admins</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm backdrop-blur-md transition hover:bg-white/10">
            <span class="text-blue-300">✔</span>
            <p class="mt-2">Actionable insights for leadership</p>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-12">
        <h2 class="text-3xl font-semibold">How it works</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm backdrop-blur-md">
            <p class="text-xs uppercase tracking-widest text-blue-300">Step 1</p>
            <h3 class="mt-2 text-lg font-semibold">Create phishing campaign</h3>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm backdrop-blur-md">
            <p class="text-xs uppercase tracking-widest text-blue-300">Step 2</p>
            <h3 class="mt-2 text-lg font-semibold">Send simulated emails</h3>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm backdrop-blur-md">
            <p class="text-xs uppercase tracking-widest text-blue-300">Step 3</p>
            <h3 class="mt-2 text-lg font-semibold">Track user behavior and results</h3>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-12">
        <h2 class="text-3xl font-semibold">Features built for security teams</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              ★
            </div>
            <p class="text-sm font-medium">Dashboard analytics</p>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              ★
            </div>
            <p class="text-sm font-medium">Campaign builder</p>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              ★
            </div>
            <p class="text-sm font-medium">Email templates</p>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              ★
            </div>
            <p class="text-sm font-medium">User tracking</p>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              ★
            </div>
            <p class="text-sm font-medium">Reporting</p>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-12">
        <div class="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6 backdrop-blur-md">
          <h2 class="text-2xl font-semibold">Trust and Safety</h2>
          <p class="mt-3 text-blue-100/80">
            For authorized training use only. AegisPhish Lab is designed for ethical
            awareness training and compliance-approved simulations.
          </p>
          <div class="mt-6 grid gap-4 text-xs uppercase tracking-widest text-blue-200/70 sm:grid-cols-3 md:grid-cols-6">
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              SOC2
            </div>
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              ISO27001
            </div>
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              GDPR
            </div>
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              HIPAA
            </div>
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              NIST
            </div>
            <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">
              PCI
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 class="text-3xl font-semibold">
          Get Your Phishing Simulation Lab Set Up Today
        </h2>
        <p class="mt-3 text-blue-100/70">
          Start with a guided setup and see results in your first campaign.
        </p>
        <div class="mt-6">
          <a
            class="rounded-md bg-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
            routerLink="/start"
          >
            Request Setup
          </a>
        </div>
      </section>

      <footer class="border-t border-white/10 bg-black/30 px-6 py-10 text-sm text-blue-200/70">
        <div class="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="font-semibold text-white">AegisPhish Lab</p>
            <p class="text-xs">Cybersecurity Training Platform</p>
          </div>
          <div class="flex flex-wrap gap-4">
            <a class="hover:text-white" routerLink="/demo">Product</a>
            <a class="hover:text-white" routerLink="/pricing">Pricing</a>
            <a class="hover:text-white" routerLink="/support">Support</a>
            <a class="hover:text-white" routerLink="/compliance">Contact</a>
          </div>
          <p class="text-xs">Disclaimer: For authorized training use only.</p>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {
}
