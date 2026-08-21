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

/* ---------- download confirm popup ---------- */
const modal        = document.getElementById("modal");
const modalConfirm = document.getElementById("modalConfirm");
const modalFile    = document.getElementById("modalFile");
const upiCopy      = document.getElementById("upiCopy");
const upiId        = document.getElementById("upiId");
let lastFocused    = null;

// every download link on the page goes through the popup first
document.querySelectorAll("a[download]").forEach(link => {
  if (link === modalConfirm) return;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(link.getAttribute("href"));
  });
});

function openModal(href) {
  lastFocused = document.activeElement;
  modalConfirm.setAttribute("href", href);
  modalFile.textContent = href.split("/").pop();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalConfirm.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  upiCopy.textContent = "copy";
  upiCopy.classList.remove("is-copied");
  if (lastFocused) lastFocused.focus();
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancel").addEventListener("click", closeModal);

// the confirm link downloads natively, then the popup gets out of the way
modalConfirm.addEventListener("click", () => setTimeout(closeModal, 150));

// click the dark area outside the card to dismiss
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "Tab") trapFocus(e);
});

function trapFocus(e) {
  const items = modal.querySelectorAll("button, a[href]");
  const first = items[0];
  const last  = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* copy the UPI id */
upiCopy.addEventListener("click", async () => {
  const id = upiId.textContent.trim();
  try {
    await navigator.clipboard.writeText(id);
  } catch {
    // clipboard API needs https or localhost, so fall back to a selection
    const r = document.createRange();
    r.selectNodeContents(upiId);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    document.execCommand("copy");
  }
  upiCopy.textContent = "copied";
  upiCopy.classList.add("is-copied");
  setTimeout(() => {
    upiCopy.textContent = "copy";
    upiCopy.classList.remove("is-copied");
  }, 1600);
});
