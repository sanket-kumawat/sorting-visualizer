/**
 * Bubble sort — yields visualization steps.
 * Step shape: { type, indices, array }
 * Types: compare | swap | sorted | done
 */
function* bubbleSort(input) {
  const arr = input.slice();
  const n = arr.length;

  for (let end = n - 1; end > 0; end--) {
    let swapped = false;

    for (let i = 0; i < end; i++) {
      yield { type: "compare", indices: [i, i + 1], array: arr.slice() };

      if (arr[i] > arr[i + 1]) {
        const tmp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = tmp;
        swapped = true;
        yield { type: "swap", indices: [i, i + 1], array: arr.slice() };
      }
    }

    // Index `end` is in final position after this pass
    yield { type: "sorted", indices: [end], array: arr.slice() };

    if (!swapped) {
      // Remaining prefix is already sorted
      const rest = [];
      for (let i = 0; i < end; i++) rest.push(i);
      if (rest.length) {
        yield { type: "sorted", indices: rest, array: arr.slice() };
      }
      break;
    }
  }

  if (n > 0) {
    yield { type: "sorted", indices: [0], array: arr.slice() };
  }

  yield { type: "done", indices: [], array: arr.slice() };
}

/**
 * Selection sort — scan for min each pass, then one swap.
 */
function* selectionSort(input) {
  const arr = input.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", indices: [minIdx, j], array: arr.slice() };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
      yield { type: "swap", indices: [i, minIdx], array: arr.slice() };
    }

    yield { type: "sorted", indices: [i], array: arr.slice() };
  }

  if (n > 0) {
    yield { type: "sorted", indices: [n - 1], array: arr.slice() };
  }

  yield { type: "done", indices: [], array: arr.slice() };
}

/**
 * Insertion sort — shift larger elements right with swap.
 */
function* insertionSort(input) {
  const arr = input.slice();
  const n = arr.length;

  if (n > 0) {
    yield { type: "sorted", indices: [0], array: arr.slice() };
  }

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0) {
      yield { type: "compare", indices: [j - 1, j], array: arr.slice() };

      if (arr[j - 1] <= arr[j]) break;

      const tmp = arr[j - 1];
      arr[j - 1] = arr[j];
      arr[j] = tmp;
      yield { type: "swap", indices: [j - 1, j], array: arr.slice() };
      j -= 1;
    }

    // Prefix [0..i] is sorted after inserting arr[i]
    const sortedPrefix = [];
    for (let k = 0; k <= i; k++) sortedPrefix.push(k);
    yield { type: "sorted", indices: sortedPrefix, array: arr.slice() };
  }

  yield { type: "done", indices: [], array: arr.slice() };
}

/**
 * Merge sort — yield set when writing merged values back (no swaps).
 */
function* mergeSort(input) {
  const arr = input.slice();
  const n = arr.length;

  function* merge(lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;

    while (i < left.length && j < right.length) {
      // Highlight the two half-heads being decided between
      yield {
        type: "compare",
        indices: [lo + i, mid + 1 + j],
        array: arr.slice(),
      };

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i += 1;
      } else {
        arr[k] = right[j];
        j += 1;
      }
      yield { type: "set", indices: [k], array: arr.slice() };
      k += 1;
    }

    while (i < left.length) {
      arr[k] = left[i];
      yield { type: "set", indices: [k], array: arr.slice() };
      i += 1;
      k += 1;
    }

    while (j < right.length) {
      arr[k] = right[j];
      yield { type: "set", indices: [k], array: arr.slice() };
      j += 1;
      k += 1;
    }
  }

  function* sortRange(lo, hi) {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    yield* sortRange(lo, mid);
    yield* sortRange(mid + 1, hi);
    yield* merge(lo, mid, hi);
  }

  if (n > 0) {
    yield* sortRange(0, n - 1);
    const all = [];
    for (let i = 0; i < n; i++) all.push(i);
    yield { type: "sorted", indices: all, array: arr.slice() };
  }

  yield { type: "done", indices: [], array: arr.slice() };
}

/**
 * Quick sort — pivot at partition start, then compare and swap.
 */
function* quickSort(input) {
  const arr = input.slice();
  const n = arr.length;

  function* partition(lo, hi) {
    // Last element as pivot
    yield { type: "pivot", indices: [hi], array: arr.slice() };
    const pivot = arr[hi];
    let i = lo;

    for (let j = lo; j < hi; j++) {
      yield { type: "compare", indices: [j, hi], array: arr.slice() };
      if (arr[j] < pivot) {
        if (i !== j) {
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
          yield { type: "swap", indices: [i, j], array: arr.slice() };
        }
        i += 1;
      }
    }

    if (i !== hi) {
      const tmp = arr[i];
      arr[i] = arr[hi];
      arr[hi] = tmp;
      yield { type: "swap", indices: [i, hi], array: arr.slice() };
    }

    yield { type: "sorted", indices: [i], array: arr.slice() };
    return i;
  }

  function* sortRange(lo, hi) {
    if (lo > hi) return;
    if (lo === hi) {
      yield { type: "sorted", indices: [lo], array: arr.slice() };
      return;
    }
    const p = yield* partition(lo, hi);
    yield* sortRange(lo, p - 1);
    yield* sortRange(p + 1, hi);
  }

  if (n > 0) {
    yield* sortRange(0, n - 1);
  }

  yield { type: "done", indices: [], array: arr.slice() };
}

/**
 * Heap sort — build max-heap, then extract root with compare/swap.
 */
function* heapSort(input) {
  const arr = input.slice();
  const n = arr.length;

  function* siftDown(start, end) {
    let root = start;

    while (true) {
      const left = 2 * root + 1;
      if (left > end) break;

      let swapIdx = root;
      yield { type: "compare", indices: [swapIdx, left], array: arr.slice() };
      if (arr[left] > arr[swapIdx]) swapIdx = left;

      const right = left + 1;
      if (right <= end) {
        yield { type: "compare", indices: [swapIdx, right], array: arr.slice() };
        if (arr[right] > arr[swapIdx]) swapIdx = right;
      }

      if (swapIdx === root) break;

      const tmp = arr[root];
      arr[root] = arr[swapIdx];
      arr[swapIdx] = tmp;
      yield { type: "swap", indices: [root, swapIdx], array: arr.slice() };
      root = swapIdx;
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(i, n - 1);
  }

  // Extract max repeatedly
  for (let end = n - 1; end > 0; end--) {
    const tmp = arr[0];
    arr[0] = arr[end];
    arr[end] = tmp;
    yield { type: "swap", indices: [0, end], array: arr.slice() };
    yield { type: "sorted", indices: [end], array: arr.slice() };
    yield* siftDown(0, end - 1);
  }

  if (n > 0) {
    yield { type: "sorted", indices: [0], array: arr.slice() };
  }

  yield { type: "done", indices: [], array: arr.slice() };
}
