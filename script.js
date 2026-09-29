const MAX_ITEMS = 100;
const DEFAULT_RANDOM_N = 20;
const RANDOM_MIN = 5;
const RANDOM_MAX = 100;
const LABEL_THRESHOLD = 40;

/** @type {number[]} */
let currentArray = [];

const arrayInput = document.getElementById("array-input");
const arrayError = document.getElementById("array-error");
const autofillBtn = document.getElementById("autofill-btn");
const barsContainer = document.getElementById("bars-container");

/**
 * Split a comma-separated string into validated numbers.
 * @returns {{ ok: true, values: number[] } | { ok: false, error: string }}
 */
function parseInput(str) {
  const trimmed = str.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter comma-separated numbers." };
  }

  const parts = trimmed.split(",");
  if (parts.length > MAX_ITEMS) {
    return { ok: false, error: `At most ${MAX_ITEMS} numbers allowed.` };
  }

  const values = [];
  for (const part of parts) {
    const token = part.trim();
    if (token === "") {
      return { ok: false, error: "Empty values are not allowed." };
    }
    const n = Number(token);
    if (!Number.isFinite(n)) {
      return { ok: false, error: `"${token}" is not a valid number.` };
    }
    values.push(n);
  }

  return { ok: true, values };
}

function showError(message) {
  arrayError.textContent = message;
  arrayError.hidden = !message;
  arrayInput.classList.toggle("input--invalid", Boolean(message));
}

function clearError() {
  showError("");
}

/** Fill the input with n random ints and render. */
function generateRandomArray(n = DEFAULT_RANDOM_N) {
  const values = Array.from({ length: n }, () =>
    Math.floor(Math.random() * (RANDOM_MAX - RANDOM_MIN + 1)) + RANDOM_MIN
  );
  arrayInput.value = values.join(", ");
  currentArray = values;
  clearError();
  render({ type: null, indices: [], array: currentArray });
}

/**
 * Draw bars from step.array, scaled to the max value.
 * Color classes come from step.type on step.indices.
 */
function render(step) {
  const arr = step.array ?? currentArray;
  const max = Math.max(...arr, 1);
  const indices = new Set(step.indices ?? []);
  const typeClass = step.type && step.type !== "done" ? step.type : null;

  barsContainer.classList.toggle("show-labels", arr.length <= LABEL_THRESHOLD);
  barsContainer.replaceChildren();

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / max) * 100}%`;
    bar.dataset.value = String(value);
    bar.title = String(value);

    if (typeClass && indices.has(i)) {
      bar.classList.add(typeClass);
    }

    barsContainer.appendChild(bar);
  }
}

function syncFromInput() {
  const result = parseInput(arrayInput.value);
  if (!result.ok) {
    // Keep previous bars when the field is mid-edit / invalid
    if (arrayInput.value.trim() === "") {
      currentArray = [];
      clearError();
      barsContainer.replaceChildren();
      return;
    }
    showError(result.error);
    return;
  }

  clearError();
  currentArray = result.values;
  render({ type: null, indices: [], array: currentArray });
}

arrayInput.addEventListener("input", syncFromInput);
autofillBtn.addEventListener("click", () => generateRandomArray());

// Seed with a sample so the page isn't empty on load
generateRandomArray(DEFAULT_RANDOM_N);
