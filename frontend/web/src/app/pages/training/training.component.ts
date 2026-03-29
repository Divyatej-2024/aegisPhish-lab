import { Component, computed, inject, signal } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

const TRAINING_PAGES = new Set([
  "menu.html",
  "soceng.html",
  "phar.html",
  "whl.html",
  "wesp.html",
  "sph.html",
  "htph.html",
  "emph.html",
  "anph.html",
  "clph.html",
  "viph.html",
  "whph.html",
  "puph.html",
  "dcph.html",
  "etph.html",
  "seph.html",
  "iph.html",
  "smh.html",
  "dmph.html",
  "mitm.html",
  "smph.html",
  "end.html",
]);

@Component({
  selector: "app-training",
  standalone: true,
  template: `
    <section class="training-shell anim-fade-up">
      <div class="training-toolbar">
        <div>
          <h1>Phishing Training</h1>
          <p>Work through the scenarios and track your progress.</p>
        </div>
        <a class="training-link" [href]="rawSrc()" target="_blank" rel="noopener"
          >Open in new tab</a
        >
      </div>
      <div class="training-frame">
        <iframe [src]="safeSrc()" title="Phishing Training"></iframe>
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
        color: #111827;
        font-size: 0.85rem;
        font-weight: 600;
        text-decoration: none;
      }

      .training-frame {
        border: 1px solid #e5e7eb;
        border-radius: 1rem;
        overflow: hidden;
        min-height: 70vh;
        background: #f9fafb;
      }

      iframe {
        width: 100%;
        height: 100%;
        min-height: 70vh;
        border: none;
        background: #ffffff;
      }

      @media (max-width: 768px) {
        .training-shell {
          padding: 1rem;
        }

        .training-toolbar {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class TrainingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly page = signal("menu.html");

  readonly rawSrc = computed(() => `/pages/${this.page()}`);
  readonly safeSrc = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.rawSrc()),
  );

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const requested = params.get("page");
      if (requested && TRAINING_PAGES.has(requested)) {
        this.page.set(requested);
      } else {
        this.page.set("menu.html");
      }
    });
  }
}
