/* Strong password generator */
function generatePassword(length) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{};:,.<>?";

  const all = upper + lower + digits + symbols;
  let password = "";

  // Ensure at least one of each type
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password;
}

/* Memorable passphrase generator */
function generatePassphrase(wordCount) {
  const words = [
    "river","sun","cloud","forest","moon","stone","ember","silver",
    "ocean","storm","meadow","shadow","valley","crystal","autumn"
  ];

  let chosen = [];
  for (let i = 0; i < wordCount; i++) {
    chosen.push(words[Math.floor(Math.random() * words.length)]);
  }

  return chosen.join("-") + "-" + Math.floor(Math.random() * 100);
}

/* UI elements */
const lengthControls = document.getElementById("lengthControls");
const lengthSlider = document.getElementById("length");
const manualLength = document.getElementById("manualLength");
const lengthValue = document.getElementById("lengthValue");

const memorableMode = document.getElementById("memorableMode");
const wordCountContainer = document.getElementById("wordCountContainer");
const wordCountSelect = document.getElementById("wordCount");

const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");

/* Sync slider → manual input */
lengthSlider.oninput = () => {
  manualLength.value = lengthSlider.value;
  lengthValue.textContent = lengthSlider.value;
};

/* Sync manual input → slider */
manualLength.oninput = () => {
  let val = parseInt(manualLength.value, 10);
  if (isNaN(val)) return;
  if (val < 6) val = 6;
  if (val > 32) val = 32;
  manualLength.value = val;
  lengthSlider.value = val;
  lengthValue.textContent = val;
};

/* Toggle memorable mode UI */
memorableMode.onchange = () => {
  if (memorableMode.checked) {
    lengthControls.style.display = "none";
    wordCountContainer.style.display = "block";
  } else {
    lengthControls.style.display = "block";
    wordCountContainer.style.display = "none";
  }
};

/* Generate password */
generateBtn.onclick = () => {
  let pwd;

  if (memorableMode.checked) {
    const wordCount = parseInt(wordCountSelect.value, 10);
    pwd = generatePassphrase(wordCount);
  } else {
    const length = parseInt(lengthSlider.value, 10);
    pwd = generatePassword(length);
  }

  output.textContent = pwd;
  updateStrengthMeter(pwd);

  // Reset visibility
  output.classList.remove("visible");
};

/* Improved strength meter */
function updateStrengthMeter(password) {
  const bar = document.getElementById("strengthBar");
  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety scoring
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Passphrase scoring
  if (password.includes("-")) score += 2;

  // Apply strength levels
  if (score <= 3) {
    bar.style.background = "red";
    bar.textContent = "Weak";
  } else if (score <= 6) {
    bar.style.background = "orange";
    bar.textContent = "Medium";
  } else {
    bar.style.background = "green";
    bar.textContent = "Strong";
  }
}

/* Copy to clipboard */
document.getElementById("copyBtn").onclick = () => {
  const pwd = output.textContent;
  if (!pwd) return;

  navigator.clipboard.writeText(pwd);
  alert("Password copied!");
};

/* Click-to-reveal password */
output.onclick = () => {
  output.classList.toggle("visible");
};

/* Dark mode */
document.getElementById("darkModeToggle").onchange = (e) => {
  document.body.classList.toggle("dark", e.target.checked);
};