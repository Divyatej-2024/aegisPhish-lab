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
    <section class="ctf-shell anim-fade-up">
      <div class="ctf-hero">
        <p class="ctf-eyebrow">Aegis CTF</p>
        <h1>Cyber CTF Arena</h1>
        <p class="ctf-subtitle">
          Solve challenges, submit flags, and climb the scoreboard. Every solve is tracked to your account.
        </p>
        <div class="ctf-tabs">
          <button
            class="ctf-tab"
            (click)="activeTab.set('challenges')"
            [class.active]="activeTab() === 'challenges'"
          >
            Challenges
          </button>
          <button
            class="ctf-tab"
            (click)="activeTab.set('scoreboard')"
            [class.active]="activeTab() === 'scoreboard'"
          >
            Scoreboard
          </button>
        </div>
      </div>

      <div class="ctf-stats">
        <div class="ctf-stat">
          <p class="ctf-stat-label">Solved</p>
          <p class="ctf-stat-value">{{ progress()?.solvedCount ?? 0 }}</p>
        </div>
        <div class="ctf-stat">
          <p class="ctf-stat-label">Points</p>
          <p class="ctf-stat-value">{{ progress()?.totalPoints ?? 0 }}</p>
        </div>
        <div class="ctf-stat">
          <p class="ctf-stat-label">Status</p>
          <p class="ctf-stat-value accent">{{ statusLabel() }}</p>
        </div>
      </div>

      <div class="ctf-panel" *ngIf="activeTab() === 'challenges'">
        <div class="ctf-panel-header">
          <h2>Challenges</h2>
          <button class="ctf-link" (click)="loadAll()">
            Refresh
          </button>
        </div>

        <div class="ctf-grid">
          <div
            class="ctf-card"
            *ngFor="let challenge of challenges()"
            [class.solved]="isSolved(challenge.slug)"
          >
            <div class="ctf-card-header">
              <div>
                <p class="ctf-card-category">{{ challenge.category }}</p>
                <h3>{{ challenge.title }}</h3>
              </div>
              <span class="ctf-pill">
                {{ challenge.points }} pts
              </span>
            </div>
            <p class="ctf-card-desc">{{ challenge.description }}</p>
            <p class="ctf-card-hint" *ngIf="challenge.hint">Hint: {{ challenge.hint }}</p>

            <div class="ctf-incident" *ngIf="challenge.slug === 'attack-chain-sim'">
              <div class="ctf-incident-header">
                <p>Incident Notes (Fictional)</p>
                <span>Case ID: AP-042</span>
              </div>
              <ul>
                <li>08:14 - User reports a payroll email with a "Secure Doc" link.</li>
                <li>08:16 - User opens link, sees fake login portal, enters credentials.</li>
                <li>08:20 - Unknown device logs in from new IP using stolen creds.</li>
                <li>08:22 - MFA prompt approved by user after push fatigue.</li>
                <li>08:25 - New mail rule created to forward invoices externally.</li>
                <li>08:31 - VPN connection established; internal file share accessed.</li>
                <li>08:33 - Admin share probed with the same credentials.</li>
              </ul>
              <p class="ctf-incident-footer">
                Question: Identify the technique used to pivot from phishing to internal access.
              </p>
            </div>

            <div class="ctf-input-row">
              <input
                class="ctf-input"
                type="text"
                placeholder="CTF{...}"
                [value]="flagInputs()[challenge.slug] ?? ''"
                (input)="updateFlag(challenge.slug, $event)"
                [disabled]="isSolved(challenge.slug)"
              />
              <button
                class="ctf-submit"
                (click)="submitFlag(challenge.slug)"
                [disabled]="isSolved(challenge.slug) || loading()"
              >
                Submit
              </button>
            </div>

            <p class="ctf-card-status" [class.solved]="isSolved(challenge.slug)">
              {{ statusBySlug()[challenge.slug] ?? (isSolved(challenge.slug) ? "Solved" : "") }}
            </p>
          </div>
        </div>
      </div>

      <div class="ctf-panel" *ngIf="activeTab() === 'scoreboard'">
        <div class="ctf-panel-header">
          <h2>Scoreboard</h2>
          <button class="ctf-link" (click)="loadScoreboard()">
            Refresh
          </button>
        </div>
        <div class="ctf-table-wrap">
          <table class="ctf-table">
            <thead>
              <tr>
                <th class="py-2 pr-4">Rank</th>
                <th class="py-2 pr-4">Player</th>
                <th class="py-2 pr-4">Solved</th>
                <th class="py-2 pr-4">Score</th>
                <th class="py-2">Last Solve</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of scoreboard(); let i = index">
                <td class="rank">{{ i + 1 }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.solved }}</td>
                <td class="score">{{ row.score }}</td>
                <td class="muted">
                  {{ row.lastSolveAt ? (row.lastSolveAt | date: "medium") : "—" }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="ctf-empty" *ngIf="!scoreboard().length">No solves yet.</p>
        </div>
      </div>

      <p class="ctf-error" *ngIf="error()">{{ error() }}</p>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        background: radial-gradient(circle at top, #ffe4e6, #f8fafc 45%, #dbeafe);
        min-height: 100%;
      }

      .ctf-shell {
        max-width: 1100px;
        margin: 0 auto;
        padding: 2rem 1.5rem 3rem;
        display: grid;
        gap: 1.5rem;
      }

      .ctf-hero {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(15, 23, 42, 0.15);
        border-radius: 1.5rem;
        padding: 1.75rem;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
      }

      .ctf-eyebrow {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.25em;
        color: #be123c;
        margin: 0;
      }

      .ctf-hero h1 {
        margin: 0.5rem 0 0 0;
        font-size: 2rem;
        font-weight: 700;
        color: #0f172a;
      }

      .ctf-subtitle {
        margin: 0.75rem 0 0 0;
        color: #475569;
        max-width: 720px;
      }

      .ctf-tabs {
        margin-top: 1.25rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .ctf-tab {
        border-radius: 999px;
        border: 1px solid #0f172a;
        padding: 0.5rem 1.1rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: #0f172a;
        background: transparent;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }

      .ctf-tab:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
      }

      .ctf-tab.active {
        background: #0f172a;
        color: #ffffff;
      }

      .ctf-stats {
        display: grid;
        gap: 1rem;
      }

      .ctf-stat {
        background: #ffffff;
        border-radius: 1rem;
        border: 1px solid rgba(15, 23, 42, 0.12);
        padding: 1rem 1.25rem;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
      }

      .ctf-stat-label {
        margin: 0;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #64748b;
      }

      .ctf-stat-value {
        margin: 0.5rem 0 0 0;
        font-size: 1.6rem;
        font-weight: 700;
        color: #0f172a;
      }

      .ctf-stat-value.accent {
        color: #be123c;
      }

      .ctf-panel {
        background: #ffffff;
        border-radius: 1.5rem;
        border: 1px solid rgba(15, 23, 42, 0.12);
        padding: 1.5rem;
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
      }

      .ctf-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .ctf-panel-header h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #0f172a;
      }

      .ctf-link {
        background: none;
        border: none;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
      }

      .ctf-grid {
        margin-top: 1.25rem;
        display: grid;
        gap: 1rem;
      }

      .ctf-card {
        border-radius: 1.1rem;
        border: 1px solid rgba(15, 23, 42, 0.12);
        padding: 1.25rem;
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }

      .ctf-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
      }

      .ctf-card.solved {
        border-color: rgba(16, 185, 129, 0.6);
        background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
      }

      .ctf-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .ctf-card-category {
        margin: 0;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #64748b;
      }

      .ctf-card h3 {
        margin: 0.35rem 0 0 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #0f172a;
      }

      .ctf-pill {
        border-radius: 999px;
        border: 1px solid rgba(15, 23, 42, 0.2);
        padding: 0.25rem 0.8rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #0f172a;
        background: #ffffff;
      }

      .ctf-card-desc {
        margin: 0.9rem 0 0 0;
        color: #475569;
      }

      .ctf-card-hint {
        margin: 0.35rem 0 0 0;
        color: #94a3b8;
        font-size: 0.85rem;
      }

      .ctf-incident {
        margin-top: 0.9rem;
        border-radius: 0.9rem;
        border: 1px dashed rgba(15, 23, 42, 0.2);
        padding: 0.85rem 1rem;
        background: #fef2f2;
      }

      .ctf-incident-header {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: #9f1239;
        margin-bottom: 0.6rem;
      }

      .ctf-incident ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.35rem;
        font-size: 0.88rem;
        color: #4b5563;
      }

      .ctf-incident ul li {
        padding-left: 0.75rem;
        position: relative;
      }

      .ctf-incident ul li::before {
        content: "";
        width: 6px;
        height: 6px;
        background: #f97316;
        border-radius: 999px;
        position: absolute;
        left: 0;
        top: 0.5rem;
      }

      .ctf-incident-footer {
        margin: 0.75rem 0 0 0;
        font-weight: 600;
        color: #0f172a;
      }

      .ctf-input-row {
        margin-top: 0.9rem;
        display: grid;
        gap: 0.6rem;
      }

      .ctf-input {
        border-radius: 0.75rem;
        border: 1px solid rgba(15, 23, 42, 0.2);
        padding: 0.7rem 0.9rem;
        font-size: 0.9rem;
      }

      .ctf-submit {
        border-radius: 0.75rem;
        border: none;
        background: #0f172a;
        color: #ffffff;
        font-weight: 600;
        padding: 0.7rem 1rem;
        cursor: pointer;
      }

      .ctf-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .ctf-card-status {
        margin: 0.6rem 0 0 0;
        font-weight: 600;
        color: #0f172a;
      }

      .ctf-card-status.solved {
        color: #059669;
      }

      .ctf-table-wrap {
        margin-top: 1.25rem;
        overflow-x: auto;
      }

      .ctf-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }

      .ctf-table thead tr {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.65rem;
        color: #64748b;
      }

      .ctf-table tbody tr {
        border-top: 1px solid rgba(15, 23, 42, 0.08);
      }

      .ctf-table td,
      .ctf-table th {
        padding: 0.75rem 0.5rem;
      }

      .ctf-table .rank {
        font-weight: 700;
        color: #0f172a;
      }

      .ctf-table .score {
        font-weight: 700;
        color: #be123c;
      }

      .ctf-table .muted {
        color: #94a3b8;
        font-size: 0.8rem;
      }

      .ctf-empty {
        margin: 1rem 0 0 0;
        color: #94a3b8;
      }

      .ctf-error {
        color: #dc2626;
        font-weight: 600;
      }

      @media (min-width: 768px) {
        .ctf-stats {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .ctf-input-row {
          grid-template-columns: 1fr auto;
          align-items: center;
        }
      }
    `,
  ],
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
    const total = this.challenges().length || 0;
    if (total > 0 && solved >= total) return "CTF Finisher";
    if (total > 0 && solved >= Math.ceil(total * 0.6)) return "Operator Mode";
    if (total > 0 && solved >= Math.ceil(total * 0.2)) return "Analyst Mode";
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
