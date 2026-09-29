const MAX_ITEMS = 100;
const DEFAULT_RANDOM_N = 20;
const RANDOM_MIN = 5;
const RANDOM_MAX = 100;
const LABEL_THRESHOLD = 30;

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
/** Swaps + set writes (merge sort). */
let writes = 0;
let totalSteps = 0;

/** Indices marked sorted so later steps keep the green state. */
const sortedIndices = new Set();

const arrayInput = document.getElementById('array-input');
const arrayError = document.getElementById('array-error');
const autofillBtn = document.getElementById('autofill-btn');
const algorithmSelect = document.getElementById('algorithm-select');
const barsContainer = document.getElementById('bars-container');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stepBackBtn = document.getElementById('step-back-btn');
const stepFwdBtn = document.getElementById('step-fwd-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const comparisonsEl = document.getElementById('comparisons-count');
const swapsEl = document.getElementById('swaps-count');
const stepsEl = document.getElementById('steps-count');
const stepMessageEl = document.getElementById('step-message');

const IDLE_STEP_MESSAGE =
  'Press Start or step forward to see what the algorithm is doing.';

const algorithms = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

const complexityBest = document.getElementById('complexity-best');
const complexityAvg = document.getElementById('complexity-avg');
const complexityWorst = document.getElementById('complexity-worst');
const complexitySpace = document.getElementById('complexity-space');
const complexityStable = document.getElementById('complexity-stable');
const complexityDesc = document.getElementById('complexity-desc');
const complexityHeading = document.getElementById('complexity-heading');
const algorithmDefinition = document.getElementById('algorithm-definition');
const codeLangTabs = document.getElementById('code-lang-tabs');
const codeView = document.getElementById('code-view');

/** Remembered for the session; default JavaScript. */
let selectedLanguage = 'javascript';

function updateComplexityPanel(key = algorithmSelect.value) {
  const meta = info[key];
  if (!meta) return;

  complexityHeading.textContent = meta.name;
  complexityDesc.textContent = meta.desc;
  algorithmDefinition.textContent = meta.definition;
  complexityBest.textContent = meta.best;
  complexityAvg.textContent = meta.avg;
  complexityWorst.textContent = meta.worst;
  complexitySpace.textContent = meta.space;
  complexityStable.textContent = meta.stable ? 'Yes' : 'No';
}

function updateCodePanel(
  algoKey = algorithmSelect.value,
  lang = selectedLanguage,
) {
  const byAlgo = codeSnippets[algoKey];
  const source = byAlgo && byAlgo[lang];
  codeView.textContent = source || '// No snippet available.';

  for (const btn of codeLangTabs.querySelectorAll('.code-tabs__btn')) {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
    btn.setAttribute('aria-selected', btn.dataset.lang === lang ? 'true' : 'false');
  }
}

function buildCodeLangTabs() {
  codeLangTabs.replaceChildren();
  for (const { id, label } of CODE_LANGUAGES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-tabs__btn';
    btn.dataset.lang = id;
    btn.textContent = label;
    btn.setAttribute('role', 'tab');
    btn.addEventListener('click', () => {
      selectedLanguage = id;
      updateCodePanel();
    });
    codeLangTabs.appendChild(btn);
  }
}

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
  swapsEl.textContent = String(writes);
  stepsEl.textContent = `${stepIndex} / ${totalSteps}`;
}

function clearStats() {
  comparisons = 0;
  writes = 0;
  totalSteps = 0;
  sortedIndices.clear();
  updateStats();
}

/** Count compare / swap / set from a step's type. */
function countStepType(type) {
  if (type === 'compare') comparisons += 1;
  if (type === 'swap' || type === 'set') writes += 1;
}

/** Mid-sort pause, or finished with steps kept for scrubbing. */
function isPaused() {
  return (
    !isRunning && steps.length > 0 && stepIndex > 0 && stepIndex < steps.length
  );
}

function hasPreparedSteps() {
  return steps.length > 0;
}

function syncControlState() {
  const paused = isPaused();
  const scrubbing = hasPreparedSteps() && stepIndex > 0 && stepIndex < steps.length;
  const inSession = isRunning || scrubbing;

  startBtn.disabled = isRunning;
  pauseBtn.disabled = !inSession;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  stepBackBtn.disabled = isRunning || !hasPreparedSteps() || stepIndex <= 0;
  stepFwdBtn.disabled =
    isRunning || (hasPreparedSteps() && stepIndex >= steps.length);

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

function setStepMessage(text) {
  stepMessageEl.textContent = text || IDLE_STEP_MESSAGE;
}

function applyStep(step) {
  currentArray = step.array.slice();
  countStepType(step.type);

  if (step.type === 'sorted') {
    for (const i of step.indices) sortedIndices.add(i);
  }

  setStepMessage(step.message);
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
  // Keep steps so the user can step back after finishing
  stepIndex = totalSteps;

  for (let i = 0; i < currentArray.length; i++) sortedIndices.add(i);
  render({ type: 'sorted', indices: [...sortedIndices], array: currentArray });
  if (steps.length) {
    setStepMessage(steps[steps.length - 1].message);
  }
  updateStats();
  syncControlState();
}

/**
 * Stop playback timer, restore originalArray, clear stats, stepIndex = 0.
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
  setStepMessage(IDLE_STEP_MESSAGE);
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
  totalSteps = steps.length;
  stepIndex = 0;
  isRunning = true;
  syncControlState();
  updateStats();
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

/** Ensure steps exist from the current original array; returns false on error. */
function ensureStepsReady() {
  if (hasPreparedSteps()) return true;

  const result = parseInput(arrayInput.value);
  if (!result.ok) {
    showError(result.error);
    return false;
  }

  clearError();
  currentArray = result.values;
  originalArray = result.values.slice();

  const algoFn = algorithms[algorithmSelect.value];
  if (!algoFn) {
    showError('That algorithm is not implemented yet.');
    return false;
  }

  clearStats();
  steps = precomputeSteps(algoFn, currentArray);
  totalSteps = steps.length;
  stepIndex = 0;
  updateStats();
  return true;
}

/** Replay steps[0..targetIndex) to rebuild array, stats, and sorted set. */
function rebuildStateTo(targetIndex) {
  comparisons = 0;
  writes = 0;
  sortedIndices.clear();
  currentArray = originalArray.slice();

  for (let i = 0; i < targetIndex; i++) {
    const step = steps[i];
    currentArray = step.array.slice();
    countStepType(step.type);
    if (step.type === 'sorted') {
      for (const idx of step.indices) sortedIndices.add(idx);
    }
  }

  stepIndex = targetIndex;

  if (targetIndex === 0) {
    setStepMessage(IDLE_STEP_MESSAGE);
    render({ type: null, indices: [], array: currentArray });
  } else {
    const step = steps[targetIndex - 1];
    setStepMessage(step.message);
    render(step);
  }
  updateStats();
}

function stepForward() {
  if (isRunning) return;
  if (!ensureStepsReady()) return;

  if (stepIndex >= steps.length) {
    syncControlState();
    return;
  }

  const step = steps[stepIndex];
  stepIndex += 1;
  applyStep(step);

  if (step.type === 'done' || stepIndex >= steps.length) {
    stepIndex = totalSteps;
    for (let i = 0; i < currentArray.length; i++) sortedIndices.add(i);
    render({ type: 'sorted', indices: [...sortedIndices], array: currentArray });
    updateStats();
  }

  syncControlState();
}

function stepBackward() {
  if (isRunning || !hasPreparedSteps() || stepIndex <= 0) return;
  rebuildStateTo(stepIndex - 1);
  syncControlState();
}

function isTypingTarget(el) {
  if (!el || !(el instanceof Element)) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  );
}

function onKeyDown(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (isTypingTarget(e.target)) return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (isRunning || isPaused()) {
      pauseOrResume();
    } else {
      start();
    }
    return;
  }

  if (e.code === 'ArrowRight') {
    e.preventDefault();
    stepForward();
    return;
  }

  if (e.code === 'ArrowLeft') {
    e.preventDefault();
    stepBackward();
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
  updateComplexityPanel();
  updateCodePanel();
  reset();
}

arrayInput.addEventListener('input', onArrayInput);
autofillBtn.addEventListener('click', () => generateRandomArray());
algorithmSelect.addEventListener('change', onAlgorithmChange);
startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pauseOrResume);
stepBackBtn.addEventListener('click', stepBackward);
stepFwdBtn.addEventListener('click', stepForward);
resetBtn.addEventListener('click', reset);
document.addEventListener('keydown', onKeyDown);

speedSlider.addEventListener('input', () => {
  speedValue.textContent = speedSlider.value;
});

speedValue.textContent = speedSlider.value;
syncControlState();
buildCodeLangTabs();
updateComplexityPanel();
updateCodePanel();

// Seed with a sample so the page isn't empty on load
generateRandomArray(DEFAULT_RANDOM_N);
