import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";

import { apiFetch } from "../../lib/api";

type Challenge = {
  slug: string;
  title: string;
  description: string;
  hint?: string | null;
  category: string;
  points: number;
};

type Progress = {
  solvedSlugs: string[];
  solvedCount: number;
  totalPoints: number;
};

type ScoreRow = {
  userId: string;
  name: string;
  score: number;
  solved: number;
  lastSolveAt: string | null;
};

@Component({
  selector: "app-ctf",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.2em] text-rose-600">Aegis CTF</p>
        <h1 class="mt-2 text-2xl font-semibold text-gray-900">Cyber CTF Arena</h1>
        <p class="mt-2 text-sm text-gray-600">
          Solve challenges, submit flags, and climb the scoreboard. Every solve is tracked to your account.
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            class="rounded-full border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5"
            (click)="activeTab.set('challenges')"
            [class.bg-gray-900]="activeTab() === 'challenges'"
            [class.text-white]="activeTab() === 'challenges'"
          >
            Challenges
          </button>
          <button
            class="rounded-full border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5"
            (click)="activeTab.set('scoreboard')"
            [class.bg-gray-900]="activeTab() === 'scoreboard'"
            [class.text-white]="activeTab() === 'scoreboard'"
          >
            Scoreboard
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-4">
          <p class="text-xs uppercase tracking-widest text-gray-500">Solved</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900">{{ progress()?.solvedCount ?? 0 }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4">
          <p class="text-xs uppercase tracking-widest text-gray-500">Points</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900">{{ progress()?.totalPoints ?? 0 }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4">
          <p class="text-xs uppercase tracking-widest text-gray-500">Status</p>
          <p class="mt-1 text-base font-semibold text-rose-600">{{ statusLabel() }}</p>
        </div>
      </div>

      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6" *ngIf="activeTab() === 'challenges'">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-gray-900">Challenges</h2>
          <button class="text-sm font-semibold text-gray-600 hover:text-gray-900" (click)="loadAll()">
            Refresh
          </button>
        </div>

        <div class="mt-4 grid gap-4">
          <div
            class="rounded-xl border border-gray-200 p-4 transition"
            *ngFor="let challenge of challenges()"
            [class.border-emerald-400]="isSolved(challenge.slug)"
            [class.bg-emerald-50]="isSolved(challenge.slug)"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-xs uppercase tracking-widest text-gray-500">{{ challenge.category }}</p>
                <h3 class="mt-1 text-base font-semibold text-gray-900">{{ challenge.title }}</h3>
              </div>
              <span class="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
                {{ challenge.points }} pts
              </span>
            </div>
            <p class="mt-2 text-sm text-gray-600">{{ challenge.description }}</p>
            <p class="mt-1 text-xs text-gray-500" *ngIf="challenge.hint">Hint: {{ challenge.hint }}</p>

            <div class="mt-3 flex flex-wrap gap-2">
              <input
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                type="text"
                placeholder="CTF{...}"
                [value]="flagInputs()[challenge.slug] ?? ''"
                (input)="updateFlag(challenge.slug, $event)"
                [disabled]="isSolved(challenge.slug)"
              />
              <button
                class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                (click)="submitFlag(challenge.slug)"
                [disabled]="isSolved(challenge.slug) || loading()"
              >
                Submit
              </button>
            </div>

            <p class="mt-2 text-sm font-semibold" [class.text-emerald-600]="isSolved(challenge.slug)">
              {{ statusBySlug()[challenge.slug] ?? (isSolved(challenge.slug) ? "Solved" : "") }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6" *ngIf="activeTab() === 'scoreboard'">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-gray-900">Scoreboard</h2>
          <button class="text-sm font-semibold text-gray-600 hover:text-gray-900" (click)="loadScoreboard()">
            Refresh
          </button>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="text-xs uppercase tracking-widest text-gray-500">
                <th class="py-2 pr-4">Rank</th>
                <th class="py-2 pr-4">Player</th>
                <th class="py-2 pr-4">Solved</th>
                <th class="py-2 pr-4">Score</th>
                <th class="py-2">Last Solve</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of scoreboard(); let i = index" class="border-t border-gray-200">
                <td class="py-3 pr-4 font-semibold">{{ i + 1 }}</td>
                <td class="py-3 pr-4">{{ row.name }}</td>
                <td class="py-3 pr-4">{{ row.solved }}</td>
                <td class="py-3 pr-4 font-semibold">{{ row.score }}</td>
                <td class="py-3 text-xs text-gray-500">
                  {{ row.lastSolveAt ? (row.lastSolveAt | date: "medium") : "—" }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="mt-4 text-sm text-gray-500" *ngIf="!scoreboard().length">No solves yet.</p>
        </div>
      </div>

      <p class="mt-6 text-sm text-red-600" *ngIf="error()">{{ error() }}</p>
    </section>
  `,
})
export class CtfComponent {
  readonly challenges = signal<Challenge[]>([]);
  readonly progress = signal<Progress | null>(null);
  readonly scoreboard = signal<ScoreRow[]>([]);
  readonly activeTab = signal<"challenges" | "scoreboard">("challenges");
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly flagInputs = signal<Record<string, string>>({});
  readonly statusBySlug = signal<Record<string, string>>({});

  readonly solvedSlugs = computed(() => new Set(this.progress()?.solvedSlugs ?? []));

  readonly statusLabel = computed(() => {
    const solved = this.progress()?.solvedCount ?? 0;
    if (solved >= 5) return "CTF Finisher";
    if (solved >= 3) return "Operator Mode";
    if (solved >= 1) return "Analyst Mode";
    return "Rookie Mode";
  });

  constructor() {
    this.loadAll();
  }

  isSolved(slug: string) {
    return this.solvedSlugs().has(slug);
  }

  updateFlag(slug: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.flagInputs.update((current) => ({ ...current, [slug]: value }));
  }

  async loadAll() {
    this.error.set(null);
    this.loading.set(true);
    try {
      const [challengeRes, progressRes, scoreboardRes] = await Promise.all([
        apiFetch("/api/ctf/challenges"),
        apiFetch("/api/ctf/progress"),
        apiFetch("/api/ctf/scoreboard"),
      ]);

      if (!challengeRes.ok) throw new Error("Unable to load challenges.");
      if (!progressRes.ok) throw new Error("Unable to load progress.");
      if (!scoreboardRes.ok) throw new Error("Unable to load scoreboard.");

      const challengeJson = await challengeRes.json();
      const progressJson = await progressRes.json();
      const scoreboardJson = await scoreboardRes.json();

      this.challenges.set(challengeJson.challenges ?? []);
      this.progress.set(progressJson ?? null);
      this.scoreboard.set(scoreboardJson.leaderboard ?? []);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to load CTF data.");
    } finally {
      this.loading.set(false);
    }
  }

  async loadScoreboard() {
    this.error.set(null);
    try {
      const response = await apiFetch("/api/ctf/scoreboard");
      if (!response.ok) throw new Error("Unable to load scoreboard.");
      const json = await response.json();
      this.scoreboard.set(json.leaderboard ?? []);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to load scoreboard.");
    }
  }

  async submitFlag(slug: string) {
    const flag = (this.flagInputs()[slug] ?? "").trim();
    if (!flag) {
      this.statusBySlug.update((current) => ({ ...current, [slug]: "Enter a flag first." }));
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const response = await apiFetch("/api/ctf/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, flag }),
      });

      if (!response.ok) {
        throw new Error("Flag submission failed.");
      }

      const json = await response.json();
      if (json.correct) {
        const message = json.alreadySolved ? "Already solved." : "Correct. Flag accepted.";
        this.statusBySlug.update((current) => ({ ...current, [slug]: message }));
        await this.loadAll();
        return;
      }

      this.statusBySlug.update((current) => ({ ...current, [slug]: "Incorrect. Try again." }));
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Flag submission failed.");
    } finally {
      this.loading.set(false);
    }
  }
}
