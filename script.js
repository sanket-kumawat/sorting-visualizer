const MAX_ITEMS = 100;
const DEFAULT_RANDOM_N = 20;
const RANDOM_MIN = 5;
const RANDOM_MAX = 100;
const LABEL_THRESHOLD = 40;

/** Slider 1-100 → 500ms-5ms. Read fresh every tick so speed can change mid-run. */
const DELAY_AT_MIN_SPEED = 500;
const DELAY_AT_MAX_SPEED = 5;

/** @type {number[]} */
let currentArray = [];
/** Snapshot restored by Reset. */
let originalArray = [];

/** @type {{ type: string, indices: number[], array: number[] }[]} */
let steps = [];
let stepIndex = 0;
let timerId = null;
/** True only while a timeout chain is active. Pause clears this; stepIndex is kept. */
let isRunning = false;

let comparisons = 0;
let swaps = 0;
/** Indices marked sorted so later steps keep the green state. */
const sortedIndices = new Set();

const arrayInput = document.getElementById('array-input');
const arrayError = document.getElementById('array-error');
const autofillBtn = document.getElementById('autofill-btn');
const algorithmSelect = document.getElementById('algorithm-select');
const barsContainer = document.getElementById('bars-container');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const comparisonsEl = document.getElementById('comparisons-count');
const swapsEl = document.getElementById('swaps-count');

const algorithms = {
  bubble: bubbleSort,
};

/**
 * Split a comma-separated string into validated numbers.
 * @returns {{ ok: true, values: number[] } | { ok: false, error: string }}
 */
function parseInput(str) {
  const trimmed = str.trim();
  if (!trimmed) {
    return { ok: false, error: 'Enter comma-separated numbers.' };
  }

  const parts = trimmed.split(',');
  if (parts.length > MAX_ITEMS) {
    return { ok: false, error: `At most ${MAX_ITEMS} numbers allowed.` };
  }

  const values = [];
  for (const part of parts) {
    const token = part.trim();
    if (token === '') {
      return { ok: false, error: 'Empty values are not allowed.' };
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
  arrayInput.classList.toggle('input--invalid', Boolean(message));
}

function clearError() {
  showError('');
}

function getDelayMs() {
  const speed = Number(speedSlider.value);
  // 1 → 500ms, 100 → 5ms
  return (
    DELAY_AT_MIN_SPEED -
    ((speed - 1) / 99) * (DELAY_AT_MIN_SPEED - DELAY_AT_MAX_SPEED)
  );
}

function updateStats() {
  comparisonsEl.textContent = String(comparisons);
  swapsEl.textContent = String(swaps);
}

function clearStats() {
  comparisons = 0;
  swaps = 0;
  sortedIndices.clear();
  updateStats();
}

/** Mid-sort pause: steps remain and stepIndex is between 0 and length. */
function isPaused() {
  return (
    !isRunning && steps.length > 0 && stepIndex > 0 && stepIndex < steps.length
  );
}

function syncControlState() {
  const paused = isPaused();
  const inSession = isRunning || paused;

  startBtn.disabled = isRunning;
  pauseBtn.disabled = !inSession;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';

  arrayInput.disabled = inSession;
  autofillBtn.disabled = inSession;
  algorithmSelect.disabled = inSession;
}

function clearTimer() {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
}

/**
 * Draw bars from step.array, scaled to the max value.
 * Color classes come from step.type on step.indices; sorted bars stay green.
 */
function render(step) {
  const arr = step.array ?? currentArray;
  const max = Math.max(...arr, 1);
  const active = new Set(step.indices ?? []);
  const typeClass = step.type && step.type !== 'done' ? step.type : null;

  barsContainer.classList.toggle('show-labels', arr.length <= LABEL_THRESHOLD);
  barsContainer.replaceChildren();

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(value / max) * 100}%`;
    bar.dataset.value = String(value);
    bar.title = String(value);

    if (sortedIndices.has(i)) {
      bar.classList.add('sorted');
    }
    if (typeClass && active.has(i)) {
      bar.classList.remove('sorted');
      bar.classList.add(typeClass);
    }

    barsContainer.appendChild(bar);
  }
}

/** Drain a generator into a step list before playback. */
function precomputeSteps(algoFn, arr) {
  return Array.from(algoFn(arr));
}

function applyStep(step) {
  currentArray = step.array.slice();

  if (step.type === 'compare') comparisons += 1;
  if (step.type === 'swap') swaps += 1;
  if (step.type === 'sorted') {
    for (const i of step.indices) sortedIndices.add(i);
  }

  updateStats();
  render(step);
}

function scheduleNext() {
  clearTimer();
  if (!isRunning) return;

  if (stepIndex >= steps.length) {
    finishPlayback();
    return;
  }

  // Delay read every tick — speed slider can change mid-run
  timerId = setTimeout(tick, getDelayMs());
}

function tick() {
  timerId = null;
  if (!isRunning) return;

  const step = steps[stepIndex];
  stepIndex += 1;
  applyStep(step);

  if (step.type === 'done' || stepIndex >= steps.length) {
    finishPlayback();
    return;
  }

  scheduleNext();
}

function finishPlayback() {
  clearTimer();
  isRunning = false;
  steps = [];
  stepIndex = 0;

  for (let i = 0; i < currentArray.length; i++) sortedIndices.add(i);
  render({ type: 'sorted', indices: [...sortedIndices], array: currentArray });
  syncControlState();
}

/**
 * Stop the timer, restore originalArray, clear stats, stepIndex = 0.
 * Does not change originalArray itself.
 */
function reset() {
  clearTimer();
  isRunning = false;
  steps = [];
  stepIndex = 0;

  currentArray = originalArray.slice();
  arrayInput.value = currentArray.join(', ');
  clearError();
  clearStats();
  render({ type: null, indices: [], array: currentArray });
  syncControlState();
}

function start() {
  // Resume from the same stepIndex after a pause
  if (isPaused()) {
    isRunning = true;
    syncControlState();
    scheduleNext();
    return;
  }

  if (isRunning) return;

  const result = parseInput(arrayInput.value);
  if (!result.ok) {
    showError(result.error);
    return;
  }

  clearError();
  currentArray = result.values;
  originalArray = result.values.slice();
  clearStats();

  const algoFn = algorithms[algorithmSelect.value];
  if (!algoFn) {
    showError('That algorithm is not implemented yet.');
    return;
  }

  steps = precomputeSteps(algoFn, currentArray);
  stepIndex = 0;
  isRunning = true;
  syncControlState();
  render({ type: null, indices: [], array: currentArray });
  scheduleNext();
}

/** Toggle isRunning: clear timeout on pause, restart it on resume. Keeps stepIndex. */
function pauseOrResume() {
  if (isRunning) {
    isRunning = false;
    clearTimer();
    syncControlState();
    return;
  }

  if (isPaused()) {
    isRunning = true;
    syncControlState();
    scheduleNext();
  }
}

/** Fill the input with n random ints and render. */
function generateRandomArray(n = DEFAULT_RANDOM_N) {
  const values = Array.from(
    { length: n },
    () =>
      Math.floor(Math.random() * (RANDOM_MAX - RANDOM_MIN + 1)) + RANDOM_MIN,
  );
  arrayInput.value = values.join(', ');
  originalArray = values.slice();
  reset();
}

/** Array edits always reset playback state to the new values. */
function onArrayInput() {
  const raw = arrayInput.value;
  const result = parseInput(raw);

  if (!result.ok) {
    clearTimer();
    isRunning = false;
    steps = [];
    stepIndex = 0;

    if (raw.trim() === '') {
      currentArray = [];
      originalArray = [];
      clearError();
      clearStats();
      barsContainer.replaceChildren();
      syncControlState();
      return;
    }

    showError(result.error);
    syncControlState();
    return;
  }

  clearError();
  originalArray = result.values.slice();
  reset();
}

function onAlgorithmChange() {
  reset();
}

arrayInput.addEventListener('input', onArrayInput);
autofillBtn.addEventListener('click', () => generateRandomArray());
algorithmSelect.addEventListener('change', onAlgorithmChange);
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pauseOrResume);
resetBtn.addEventListener('click', reset);

speedSlider.addEventListener('input', () => {
  speedValue.textContent = speedSlider.value;
});

speedValue.textContent = speedSlider.value;
syncControlState();

// Seed with a sample so the page isn't empty on load
generateRandomArray(DEFAULT_RANDOM_N);
