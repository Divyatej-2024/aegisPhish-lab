import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";

import { apiFetch } from "../../lib/api";

@Component({
  selector: "app-simulator",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container mx-auto max-w-6xl px-4 py-8 anim-fade-up">
      <div class="header">
        <div>
          <h1 class="text-xl font-semibold">Phishing Walkthrough Simulator</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Run realistic phishing levels and get instant detection feedback.
          </p>
        </div>
        <div class="stats" *ngIf="analysis()">
          <div>
            <span class="label">Avg Score</span>
            <span class="value">{{ analysis()?.averageScore }}</span>
          </div>
          <div>
            <span class="label">Report Rate</span>
            <span class="value">{{ analysis()?.reportRate }}%</span>
          </div>
          <div>
            <span class="label">Risky Actions</span>
            <span class="value">{{ analysis()?.riskyActionRate }}%</span>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="panel">
          <div class="panel-head">
            <h2 class="text-sm font-semibold">Levels</h2>
            <button class="link" (click)="loadLevels()" [disabled]="loading()">Refresh</button>
          </div>
          <div class="status" *ngIf="loading()">Loading levels...</div>
          <div class="status error" *ngIf="error()">{{ error() }}</div>

          <div class="level-list" *ngIf="!loading() && !error()">
            <button
              class="level-card"
              *ngFor="let level of levels()"
              (click)="selectLevel(level)"
              [class.active]="selected()?.slug === level.slug"
            >
              <div class="level-title">{{ level.title }}</div>
              <div class="level-summary">{{ level.summary }}</div>
              <div class="level-meta">
                <span>{{ level.category }}</span>
                <span>{{ level.difficulty }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="panel">
          <div *ngIf="!selected()" class="placeholder">Choose a level to begin.</div>

          <div *ngIf="selected()" class="runner">
            <div class="runner-head">
              <div>
                <h2>{{ selected()?.title }}</h2>
                <p>{{ selected()?.summary }}</p>
              </div>
              <button class="primary" (click)="startRun()" [disabled]="starting()">Start Level</button>
            </div>

            <div *ngIf="activeLevel()" class="step">
              <div class="step-title">{{ currentStep()?.title }}</div>
              <div class="step-prompt">{{ currentStep()?.prompt }}</div>

              <div class="email-card">
                <div class="row"><strong>From:</strong> {{ currentStep()?.email?.from }}</div>
                <div class="row" *ngIf="currentStep()?.email?.replyTo">
                  <strong>Reply-To:</strong> {{ currentStep()?.email?.replyTo }}
                </div>
                <div class="row"><strong>Subject:</strong> {{ currentStep()?.email?.subject }}</div>
                <div class="body">{{ currentStep()?.email?.body }}</div>
                <div class="attachments" *ngIf="currentStep()?.email?.attachments?.length">
                  <span *ngFor="let file of currentStep()?.email?.attachments">{{ file }}</span>
                </div>
                <div class="link" *ngIf="currentStep()?.email?.linkText">
                  {{ currentStep()?.email?.linkText }} · {{ currentStep()?.email?.linkUrl }}
                </div>
              </div>

              <div class="actions">
                <button
                  class="action"
                  *ngFor="let action of currentStep()?.actions; let idx = index"
                  (click)="takeAction(action.type, action.label)"
                  [disabled]="acting()"
                >
                  {{ action.label }}
                </button>
              </div>

              <div class="feedback" *ngIf="actionResult()">
                <div class="feedback-title">Outcome</div>
                <p>{{ actionResult()?.feedback }}</p>
                <div class="prediction">
                  <span>Detection:</span>
                  <strong>{{ actionResult()?.prediction?.label }}</strong>
                  <span class="muted">
                    ({{ actionResult()?.prediction?.confidence | number : "1.0-2" }})
                  </span>
                </div>
                <div class="score">Score: {{ runScore() }}</div>
                <button class="secondary" (click)="nextStep()" [disabled]="!canAdvance()">
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .header {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .stats {
        display: flex;
        gap: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
        background: #ffffff;
        font-size: 0.75rem;
      }

      .stats .label {
        display: block;
        color: #6b7280;
      }

      .stats .value {
        font-weight: 600;
        color: #111827;
      }

      .panel {
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        padding: 1rem;
        background: #ffffff;
      }

      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .link {
        font-size: 0.75rem;
        color: #2563eb;
        background: none;
        border: none;
      }

      .level-list {
        margin-top: 1rem;
        display: grid;
        gap: 0.75rem;
      }

      .level-card {
        text-align: left;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
        background: #f9fafb;
      }

      .level-card.active {
        border-color: #111827;
        background: #ffffff;
      }

      .level-title {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .level-summary {
        margin-top: 0.35rem;
        font-size: 0.8rem;
        color: #6b7280;
      }

      .level-meta {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
        font-size: 0.7rem;
        color: #4b5563;
      }

      .runner-head {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
      }

      .runner-head p {
        margin: 0.35rem 0 0;
        color: #6b7280;
        font-size: 0.85rem;
      }

      .primary,
      .secondary,
      .action {
        border: none;
        border-radius: 0.6rem;
        padding: 0.5rem 0.9rem;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .primary {
        background: #111827;
        color: #ffffff;
      }

      .secondary {
        background: #e5e7eb;
        color: #111827;
      }

      .step {
        margin-top: 1rem;
        display: grid;
        gap: 1rem;
      }

      .step-title {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .step-prompt {
        color: #6b7280;
        font-size: 0.85rem;
      }

      .email-card {
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
        background: #f8fafc;
        font-size: 0.8rem;
      }

      .row {
        margin-bottom: 0.35rem;
      }

      .body {
        margin-top: 0.5rem;
        color: #4b5563;
      }

      .attachments {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
      }

      .attachments span {
        background: #e5e7eb;
        padding: 0.2rem 0.4rem;
        border-radius: 0.4rem;
        font-size: 0.7rem;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .action {
        background: #111827;
        color: #ffffff;
      }

      .feedback {
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
        background: #ffffff;
        font-size: 0.8rem;
      }

      .feedback-title {
        font-weight: 600;
        margin-bottom: 0.35rem;
      }

      .prediction {
        margin-top: 0.5rem;
      }

      .muted {
        color: #6b7280;
      }

      .score {
        margin-top: 0.5rem;
        font-weight: 600;
      }

      .status {
        margin-top: 1rem;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .status.error {
        color: #dc2626;
      }

      .placeholder {
        color: #6b7280;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class SimulatorComponent {
  readonly levels = signal<any[]>([]);
  readonly selected = signal<any | null>(null);
  readonly activeLevel = signal<any | null>(null);
  readonly runId = signal<string | null>(null);
  readonly runScore = signal(0);
  readonly stepIndex = signal(0);
  readonly actionResult = signal<any | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly starting = signal(false);
  readonly acting = signal(false);
  readonly analysis = signal<any | null>(null);

  readonly currentStep = computed(() => {
    const level = this.activeLevel();
    if (!level?.steps) return null;
    return level.steps[this.stepIndex()];
  });

  constructor() {
    void this.loadLevels();
    void this.loadAnalysis();
  }

  async loadLevels() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await apiFetch("/api/sim/levels");
      if (!response.ok) {
        const message = await response.text();
        this.error.set(message || "Unable to load levels.");
        this.levels.set([]);
        return;
      }

      const payload = await response.json();
      this.levels.set(payload.levels ?? []);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to load levels.");
      this.levels.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadAnalysis() {
    try {
      const response = await apiFetch("/api/sim/analysis");
      if (!response.ok) return;
      const payload = await response.json();
      this.analysis.set(payload.summary ?? null);
    } catch {
      this.analysis.set(null);
    }
  }

  selectLevel(level: any) {
    this.selected.set(level);
    this.activeLevel.set(null);
    this.runId.set(null);
    this.stepIndex.set(0);
    this.actionResult.set(null);
    this.runScore.set(0);
  }

  async startRun() {
    if (!this.selected()) return;
    this.starting.set(true);
    this.error.set(null);

    try {
      const response = await apiFetch("/api/sim/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: this.selected()?.slug }),
      });

      if (!response.ok) {
        const message = await response.text();
        this.error.set(message || "Unable to start level.");
        return;
      }

      const payload = await response.json();
      this.activeLevel.set(payload.level);
      this.runId.set(payload.run?.id ?? null);
      this.stepIndex.set(0);
      this.actionResult.set(null);
      this.runScore.set(payload.run?.score ?? 0);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to start level.");
    } finally {
      this.starting.set(false);
    }
  }

  async takeAction(type: string, label: string) {
    if (!this.runId()) return;
    this.acting.set(true);
    this.error.set(null);

    try {
      const response = await apiFetch(`/api/sim/runs/${this.runId()}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepIndex: this.stepIndex(),
          type,
          label,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        this.error.set(message || "Unable to submit action.");
        return;
      }

      const payload = await response.json();
      this.actionResult.set(payload.action);
      this.runScore.set(payload.run?.score ?? this.runScore());
      await this.loadAnalysis();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to submit action.");
    } finally {
      this.acting.set(false);
    }
  }

  canAdvance() {
    const level = this.activeLevel();
    if (!level?.steps) return false;
    return this.stepIndex() < level.steps.length - 1;
  }

  nextStep() {
    if (!this.canAdvance()) return;
    this.stepIndex.set(this.stepIndex() + 1);
    this.actionResult.set(null);
  }
}
