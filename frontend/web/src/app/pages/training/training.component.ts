import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";

import { ApiError, apiFetchJson } from "../../lib/api";

@Component({
  selector: "app-training",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="training-shell anim-fade-up">
      <div class="training-toolbar">
        <div>
          <h1>Security Simulation Lab</h1>
          <p>Run scenarios, score decisions, and improve defensive instincts.</p>
        </div>
        <button class="training-link" (click)="loadScenarios()" [disabled]="loading()">
          Refresh
        </button>
      </div>

      <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="catalog">
          <h2 class="section-title">Scenario Catalog</h2>
          <p class="section-sub">Select a simulation to begin.</p>

          <div class="status" *ngIf="loading()">Loading scenarios...</div>
          <div class="status error" *ngIf="error()">{{ error() }}</div>

          <div class="scenario-list" *ngIf="!loading() && !error()">
            <button
              class="scenario-card"
              *ngFor="let scenario of scenarios()"
              (click)="selectScenario(scenario)"
              [class.active]="selected()?.slug === scenario.slug"
            >
              <div class="scenario-title">{{ scenario.title }}</div>
              <div class="scenario-summary">{{ scenario.summary }}</div>
              <div class="scenario-meta">
                <span>{{ scenario.category }}</span>
                <span>{{ scenario.difficulty }}</span>
                <span>{{ scenario.estimatedMinutes }} min</span>
              </div>
              <div class="scenario-tags">
                <span *ngFor="let tag of scenario.tags">#{{ tag }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="runner">
          <div *ngIf="!selected()" class="placeholder">
            Choose a scenario to preview the simulation.
          </div>

          <div *ngIf="selected()" class="runner-inner">
            <div class="runner-header">
              <div>
                <h2>{{ selected()?.title }}</h2>
                <p>{{ selected()?.summary }}</p>
              </div>
              <button class="start-btn" (click)="startRun()" [disabled]="starting()">
                Start Simulation
              </button>
            </div>

            <div class="artifact" *ngIf="activeScenario()">
              <h3>Scenario Brief</h3>
              <p>{{ activeScenario()?.steps?.intro }}</p>

              <div class="artifact-card" *ngIf="activeScenario()?.type === 'email-triage'">
                <div class="artifact-row"><strong>From:</strong> {{ activeScenario()?.steps?.artifact?.from }}</div>
                <div class="artifact-row"><strong>Reply-To:</strong> {{ activeScenario()?.steps?.artifact?.replyTo }}</div>
                <div class="artifact-row"><strong>Subject:</strong> {{ activeScenario()?.steps?.artifact?.subject }}</div>
                <div class="artifact-body">{{ activeScenario()?.steps?.artifact?.body }}</div>
                <div class="artifact-attachments">
                  <span *ngFor="let file of activeScenario()?.steps?.artifact?.attachments">{{ file }}</span>
                </div>
              </div>

              <div class="artifact-card" *ngIf="activeScenario()?.type === 'mfa-fatigue'">
                <div class="artifact-row"><strong>Prompts:</strong> {{ activeScenario()?.steps?.artifact?.prompts }}</div>
                <div class="artifact-row"><strong>Window:</strong> {{ activeScenario()?.steps?.artifact?.timeWindow }}</div>
                <div class="artifact-row"><strong>Location:</strong> {{ activeScenario()?.steps?.artifact?.location }}</div>
              </div>

              <div class="artifact-card" *ngIf="activeScenario()?.type === 'qr-phish'">
                <div class="artifact-row"><strong>Sender:</strong> {{ activeScenario()?.steps?.artifact?.sender }}</div>
                <div class="artifact-row"><strong>QR Prompt:</strong> {{ activeScenario()?.steps?.artifact?.qrLabel }}</div>
                <div class="artifact-row"><strong>URL Preview:</strong> {{ activeScenario()?.steps?.artifact?.urlPreview }}</div>
              </div>
            </div>

            <div class="questions" *ngIf="activeScenario()">
              <h3>Decision Checkpoint</h3>
              <div class="question-card" *ngFor="let question of activeScenario()?.steps?.questions; let idx = index">
                <div class="question-title">{{ idx + 1 }}. {{ question.prompt }}</div>
                <div class="options">
                  <label class="option" *ngFor="let option of question.options; let optIdx = index">
                    <input
                      type="radio"
                      [name]="'q' + idx"
                      [checked]="answerFor(idx) === optIdx"
                      (change)="setAnswer(idx, optIdx)"
                    />
                    <span>{{ option }}</span>
                  </label>
                </div>
              </div>
              <button class="submit-btn" (click)="submitRun()" [disabled]="submitting()">
                Submit Answers
              </button>
            </div>

            <div class="result" *ngIf="result()">
              <h3>Simulation Results</h3>
              <p>Score: {{ result()?.score }} / {{ result()?.total }}</p>
              <div class="graded" *ngFor="let item of result()?.graded">
                <div class="graded-title">{{ item.prompt }}</div>
                <div class="graded-status" [class.good]="item.correct" [class.bad]="!item.correct">
                  {{ item.correct ? "Correct" : "Needs improvement" }}
                </div>
                <div class="graded-explanation">{{ item.explanation }}</div>
              </div>
              <button class="reset-btn" (click)="resetRun()">Run Another Scenario</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .training-shell {
        padding: 1.5rem;
        display: grid;
        gap: 1rem;
      }

      .training-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 1rem 1.25rem;
        background: #ffffff;
      }

      .training-toolbar h1 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
      }

      .training-toolbar p {
        margin: 0;
        color: #6b7280;
        font-size: 0.9rem;
      }

      .training-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 0.9rem;
        border-radius: 999px;
        border: 1px solid #111827;
        background: #111827;
        color: #ffffff;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .catalog,
      .runner {
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        padding: 1rem;
        background: #ffffff;
      }

      .section-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .section-sub {
        margin-top: 0.35rem;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .scenario-list {
        margin-top: 1rem;
        display: grid;
        gap: 0.75rem;
      }

      .scenario-card {
        text-align: left;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
        background: #f9fafb;
        cursor: pointer;
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      .scenario-card.active {
        border-color: #111827;
        background: #ffffff;
      }

      .scenario-title {
        font-weight: 600;
        font-size: 0.95rem;
      }

      .scenario-summary {
        margin-top: 0.35rem;
        font-size: 0.8rem;
        color: #6b7280;
      }

      .scenario-meta {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
        font-size: 0.72rem;
        color: #4b5563;
      }

      .scenario-tags {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        font-size: 0.7rem;
        color: #2563eb;
      }

      .status {
        margin-top: 1rem;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .status.error {
        color: #dc2626;
      }

      .runner-inner {
        display: grid;
        gap: 1rem;
      }

      .runner-header {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
      }

      .runner-header h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .runner-header p {
        margin: 0.35rem 0 0;
        color: #6b7280;
        font-size: 0.85rem;
      }

      .start-btn,
      .submit-btn,
      .reset-btn {
        border: none;
        background: #111827;
        color: #ffffff;
        padding: 0.55rem 1rem;
        border-radius: 0.6rem;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .artifact {
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
      }

      .artifact-card {
        margin-top: 0.75rem;
        border-radius: 0.65rem;
        background: #f8fafc;
        padding: 0.75rem;
        font-size: 0.8rem;
        color: #374151;
      }

      .artifact-row {
        margin-bottom: 0.35rem;
      }

      .artifact-body {
        margin-top: 0.5rem;
        font-size: 0.78rem;
        color: #4b5563;
      }

      .artifact-attachments {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .artifact-attachments span {
        background: #e5e7eb;
        padding: 0.2rem 0.4rem;
        border-radius: 0.4rem;
        font-size: 0.7rem;
      }

      .questions {
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
      }

      .question-card {
        margin-top: 0.75rem;
        border-radius: 0.6rem;
        background: #f9fafb;
        padding: 0.75rem;
      }

      .question-title {
        font-weight: 600;
        font-size: 0.85rem;
      }

      .options {
        margin-top: 0.5rem;
        display: grid;
        gap: 0.4rem;
      }

      .option {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        font-size: 0.8rem;
        color: #374151;
      }

      .result {
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 0.75rem;
      }

      .graded {
        margin-top: 0.75rem;
        border-top: 1px solid #e5e7eb;
        padding-top: 0.5rem;
      }

      .graded-title {
        font-weight: 600;
        font-size: 0.82rem;
      }

      .graded-status.good {
        color: #16a34a;
        font-size: 0.75rem;
      }

      .graded-status.bad {
        color: #dc2626;
        font-size: 0.75rem;
      }

      .graded-explanation {
        font-size: 0.75rem;
        color: #6b7280;
      }

      .placeholder {
        color: #6b7280;
        font-size: 0.9rem;
      }

      @media (max-width: 1024px) {
        .training-shell {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class TrainingComponent {
  readonly scenarios = signal<any[]>([]);
  readonly selected = signal<any | null>(null);
  readonly activeScenario = signal<any | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly starting = signal(false);
  readonly submitting = signal(false);
  readonly runId = signal<string | null>(null);
  readonly answers = signal<(number | null)[]>([]);
  readonly result = signal<any | null>(null);

  constructor() {
    void this.loadScenarios();
  }

  async loadScenarios() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const payload = await apiFetchJson<{ scenarios?: any[] }>("/api/lab/scenarios");
      this.scenarios.set(payload.scenarios ?? []);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : "Unable to load scenarios.");
      this.scenarios.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  selectScenario(scenario: any) {
    this.selected.set(scenario);
    this.activeScenario.set(null);
    this.runId.set(null);
    this.answers.set([]);
    this.result.set(null);
  }

  async startRun() {
    if (!this.selected()) return;
    this.error.set(null);
    this.starting.set(true);

    try {
      const payload = await apiFetchJson<{ scenario?: any; run?: { id?: string } }>("/api/lab/runs", {
        method: "POST",
        body: JSON.stringify({ slug: this.selected()?.slug }),
      });

      this.activeScenario.set(payload.scenario);
      this.runId.set(payload.run?.id ?? null);
      this.answers.set(
        Array.isArray(payload.scenario?.steps?.questions)
          ? new Array(payload.scenario.steps.questions.length).fill(null)
          : [],
      );
      this.result.set(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        this.error.set("Session expired. Please sign in again.");
      } else {
        this.error.set(err instanceof Error ? err.message : "Unable to start scenario.");
      }
    } finally {
      this.starting.set(false);
    }
  }

  answerFor(index: number) {
    return this.answers()[index];
  }

  setAnswer(index: number, value: number) {
    const next = [...this.answers()];
    next[index] = value;
    this.answers.set(next);
  }

  async submitRun() {
    if (!this.runId()) return;
    if (this.answers().some((value) => value === null || value === undefined)) {
      this.error.set("Please answer all questions before submitting.");
      return;
    }

    this.error.set(null);
    this.submitting.set(true);

    try {
      const payload = await apiFetchJson<{ result?: any }>(`/api/lab/runs/${this.runId()}/complete`, {
        method: "POST",
        body: JSON.stringify({ answers: this.answers() }),
      });

      this.result.set(payload.result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        this.error.set("This run is already completed. Start a new scenario.");
      } else if (err instanceof ApiError && err.status === 401) {
        this.error.set("Session expired. Please sign in again.");
      } else {
        this.error.set(err instanceof Error ? err.message : "Unable to submit answers.");
      }
    } finally {
      this.submitting.set(false);
    }
  }

  resetRun() {
    this.activeScenario.set(null);
    this.runId.set(null);
    this.answers.set([]);
    this.result.set(null);
  }
}
