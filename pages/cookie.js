const AP_USERNAME_KEY = "ap_username";

function getUsername() {
  return localStorage.getItem(AP_USERNAME_KEY) || "Trainee";
}

function setUsername(name) {
  const trimmed = (name || "").trim();
  localStorage.setItem(AP_USERNAME_KEY, trimmed || "Trainee");
}
