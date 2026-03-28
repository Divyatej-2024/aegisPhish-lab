const AP_PROGRESS_KEY = "ap_completed_levels";
const LEVELS = [
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
];

function getCompletedLevels() {
  try {
    const raw = localStorage.getItem(AP_PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveCompletedLevels(levels) {
  localStorage.setItem(AP_PROGRESS_KEY, JSON.stringify([...levels]));
}

function getCurrentPage() {
  const match = window.location.pathname.match(/\/([^/]+)$/);
  return match ? match[1] : "menu.html";
}

function markCompleted(page) {
  const completed = getCompletedLevels();
  completed.add(page);
  saveCompletedLevels(completed);
}

function checkLogin() {
  if (!localStorage.getItem("ap_username")) {
    setUsername("Trainee");
  }
}

function displayUsername() {
  const element = document.getElementById("welcome-message");
  if (element) {
    element.textContent = `Welcome, ${getUsername()}!`;
  }
}

function renderMenuProgress() {
  const completed = getCompletedLevels();
  const summary = document.getElementById("menu-summary");
  if (summary) {
    summary.textContent = `Progress: ${completed.size}/${LEVELS.length} levels completed`;
  }

  const resumeLink = document.getElementById("resume-link");
  if (resumeLink) {
    const next = LEVELS.find((level) => !completed.has(level)) || "end.html";
    resumeLink.setAttribute("href", next);
  }

  document.querySelectorAll(".menu-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && completed.has(href)) {
      link.classList.add("completed");
    }
  });
}

function updateProgressBar() {
  const completed = getCompletedLevels();
  const bar = document.getElementById("progress-bar");
  if (bar) {
    const percent = Math.round((completed.size / LEVELS.length) * 100);
    bar.style.width = `${percent}%`;
  }
}

function proceedToNextLevel() {
  const current = getCurrentPage();
  if (LEVELS.includes(current)) {
    markCompleted(current);
  }
  const completed = getCompletedLevels();
  const next = LEVELS.find((level) => !completed.has(level)) || "end.html";
  window.location.href = next;
}

function confirmResetGameProgress() {
  if (window.confirm("Reset your training progress?")) {
    localStorage.removeItem(AP_PROGRESS_KEY);
    window.location.reload();
  }
}

function renderEndSummary() {
  const completed = getCompletedLevels();
  const summary = document.getElementById("completion-summary");
  if (summary) {
    summary.textContent = `You completed ${completed.size} of ${LEVELS.length} levels. Great work!`;
  }
}

function logout() {
  localStorage.removeItem(AP_PROGRESS_KEY);
  localStorage.removeItem("ap_username");
  window.location.href = "/";
}
