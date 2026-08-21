// Characters the Viks font actually contains (checked against the font file).
const SUPPORTED = new Set(
  ` !"',.:;?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`.split("")
);

const output    = document.getElementById("output");
const warn      = document.getElementById("warn");
const glyphsBox = document.getElementById("glyphs");

/* ---------- theme ---------- */
const root   = document.documentElement;
const toggle = document.getElementById("themeToggle");
const icon   = toggle.querySelector(".theme-icon");

const savedTheme = localStorage.getItem("viks-theme");
if (savedTheme) setTheme(savedTheme);

toggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function setTheme(mode) {
  root.dataset.theme = mode;
  icon.textContent = mode === "dark" ? "☀" : "☾";
  localStorage.setItem("viks-theme", mode);
}

/* ---------- sliders ---------- */
const sizeRange  = document.getElementById("sizeRange");
const trackRange = document.getElementById("trackRange");
const leadRange  = document.getElementById("leadRange");

sizeRange.addEventListener("input", () => {
  output.style.fontSize = sizeRange.value + "px";
  document.getElementById("sizeVal").textContent = sizeRange.value;
});

trackRange.addEventListener("input", () => {
  output.style.letterSpacing = trackRange.value + "px";
  document.getElementById("trackVal").textContent = trackRange.value;
});

leadRange.addEventListener("input", () => {
  const lh = (leadRange.value / 100).toFixed(2);
  output.style.lineHeight = lh;
  document.getElementById("leadVal").textContent = lh;
});

/* ---------- alignment ---------- */
document.getElementById("alignRow").addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  document.querySelectorAll("#alignRow .btn").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  output.style.textAlign = btn.dataset.align;
});

/* ---------- glyph grid ---------- */
const rows = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  `!"',.:;?`
];

rows.join("").split("").forEach(ch => {
  const b = document.createElement("button");
  b.className = "glyph";
  b.textContent = ch;
  b.title = ch;
  b.addEventListener("click", () => {
    output.textContent += ch;
    checkChars();
    output.focus();
    placeCaretAtEnd(output);
  });
  glyphsBox.appendChild(b);
});

/* ---------- unsupported-character warning ---------- */
output.addEventListener("input", checkChars);

function checkChars() {
  const missing = [...new Set(output.textContent.split(""))]
    .filter(c => c.trim() !== "" && !SUPPORTED.has(c));

  if (missing.length) {
    warn.hidden = false;
    warn.textContent =
      "Not in this font, so it falls back to a plain sans: " + missing.join(" ");
  } else {
    warn.hidden = true;
  }
}

/* keep the sample editable as plain text (no pasted formatting) */
output.addEventListener("paste", (e) => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData("text/plain");
  document.execCommand("insertText", false, text);
});

function placeCaretAtEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

checkChars();
