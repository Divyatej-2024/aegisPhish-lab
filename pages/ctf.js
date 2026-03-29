const CTF_STORAGE_KEY = "ap_ctf_solved_flags";

const FLAGS = {
  osint: "CTF{source_sleuth}",
  crypto: "CTF{base64_mastery}",
  web: "CTF{cookie_monster}",
  forensics: "CTF{hex_hunter}",
  logic: "CTF{logic_shift_master}",
};

const STATUS_TIERS = [
  { min: 0, label: "Rookie Mode" },
  { min: 2, label: "Analyst Mode" },
  { min: 4, label: "Operator Mode" },
  { min: 5, label: "CTF Finisher" },
];

function getSolvedFlags() {
  try {
    const raw = localStorage.getItem(CTF_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveSolvedFlags(solved) {
  localStorage.setItem(CTF_STORAGE_KEY, JSON.stringify([...solved]));
}

function normalizeFlag(value) {
  return value.trim();
}

function hasCookie(name, expectedValue) {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie === `${name}=${expectedValue}`);
}

function updateProgress() {
  const solved = getSolvedFlags();
  const count = solved.size;
  const total = Object.keys(FLAGS).length;
  const label = document.getElementById("ctf-progress-label");
  const bar = document.getElementById("ctf-progress-bar");
  const status = document.getElementById("ctf-status");

  if (label) {
    label.textContent = `${count}/${total} flags captured`;
  }
  if (bar) {
    const percent = Math.round((count / total) * 100);
    bar.style.width = `${percent}%`;
  }
  if (status) {
    const tier = STATUS_TIERS.slice().reverse().find((item) => count >= item.min);
    status.textContent = tier ? tier.label : "Rookie Mode";
  }
}

function setSolvedState(card, flagId) {
  const input = card.querySelector("[data-flag-input]");
  const result = card.querySelector("[data-flag-result]");
  const button = card.querySelector("[data-flag-submit]");

  card.classList.add("solved");
  if (input) {
    input.value = FLAGS[flagId];
    input.setAttribute("disabled", "disabled");
  }
  if (button) {
    button.setAttribute("disabled", "disabled");
  }
  if (result) {
    result.textContent = "Flag accepted. Challenge solved.";
  }
}

function attachChallengeHandlers() {
  const solved = getSolvedFlags();
  document.querySelectorAll("[data-flag-id]").forEach((card) => {
    const flagId = card.getAttribute("data-flag-id");
    if (!flagId || !(flagId in FLAGS)) {
      return;
    }

    if (solved.has(flagId)) {
      setSolvedState(card, flagId);
      return;
    }

    const input = card.querySelector("[data-flag-input]");
    const result = card.querySelector("[data-flag-result]");
    const button = card.querySelector("[data-flag-submit]");

    if (!button || !input || !result) {
      return;
    }

    button.addEventListener("click", () => {
      result.textContent = "";
      const guess = normalizeFlag(input.value);

      if (flagId === "web" && !hasCookie("ap_ctf_token", "trustno1")) {
        result.textContent = "Cookie missing. Set ap_ctf_token=trustno1 first.";
        return;
      }

      if (guess === FLAGS[flagId]) {
        solved.add(flagId);
        saveSolvedFlags(solved);
        setSolvedState(card, flagId);
        updateProgress();
        return;
      }

      result.textContent = "Nope. Try again.";
    });
  });
}

function attachResetHandler() {
  const reset = document.getElementById("reset-ctf");
  if (!reset) {
    return;
  }
  reset.addEventListener("click", () => {
    if (window.confirm("Reset all CTF progress?")) {
      localStorage.removeItem(CTF_STORAGE_KEY);
      window.location.reload();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachChallengeHandlers();
  attachResetHandler();
  updateProgress();
});
