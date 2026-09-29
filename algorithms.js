/** Step shape: { type, indices, array, message } */

function at(arr, i) {
  return arr[i];
}

/**
 * Bubble sort — repeatedly compare adjacent pairs and swap if out of order.
 */
function* bubbleSort(input) {
  const arr = input.slice();
  const n = arr.length;

  for (let end = n - 1; end > 0; end--) {
    let swapped = false;

    for (let i = 0; i < end; i++) {
      const a = at(arr, i);
      const b = at(arr, i + 1);
      if (a > b) {
        yield {
          type: "compare",
          indices: [i, i + 1],
          array: arr.slice(),
          message: `Compare ${a} and ${b} at indices ${i} and ${i + 1}: ${a} > ${b}, so they are out of order.`,
        };
        arr[i] = b;
        arr[i + 1] = a;
        swapped = true;
        yield {
          type: "swap",
          indices: [i, i + 1],
          array: arr.slice(),
          message: `Swap ${a} and ${b} so the smaller value moves left.`,
        };
      } else {
        yield {
          type: "compare",
          indices: [i, i + 1],
          array: arr.slice(),
          message: `Compare ${a} and ${b} at indices ${i} and ${i + 1}: already in order, move on.`,
        };
      }
    }

    yield {
      type: "sorted",
      indices: [end],
      array: arr.slice(),
      message: `${at(arr, end)} at index ${end} is in its final sorted position.`,
    };

    if (!swapped) {
      const rest = [];
      for (let i = 0; i < end; i++) rest.push(i);
      if (rest.length) {
        yield {
          type: "sorted",
          indices: rest,
          array: arr.slice(),
          message: "No swaps this pass — the remaining prefix is already sorted.",
        };
      }
      break;
    }
  }

  if (n > 0) {
    yield {
      type: "sorted",
      indices: [0],
      array: arr.slice(),
      message: `${at(arr, 0)} at index 0 is in its final sorted position.`,
    };
  }

  yield {
    type: "done",
    indices: [],
    array: arr.slice(),
    message: "Bubble sort finished — the array is fully sorted.",
  };
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
      const curMin = at(arr, minIdx);
      const cand = at(arr, j);
      if (cand < curMin) {
        yield {
          type: "compare",
          indices: [minIdx, j],
          array: arr.slice(),
          message: `Compare current min ${curMin} with ${cand}: ${cand} is smaller, so the new min is at index ${j}.`,
        };
        minIdx = j;
      } else {
        yield {
          type: "compare",
          indices: [minIdx, j],
          array: arr.slice(),
          message: `Compare current min ${curMin} with ${cand}: ${cand} is not smaller, keep min at index ${minIdx}.`,
        };
      }
    }

    if (minIdx !== i) {
      const from = at(arr, i);
      const to = at(arr, minIdx);
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
      yield {
        type: "swap",
        indices: [i, minIdx],
        array: arr.slice(),
        message: `Swap ${from} at index ${i} with minimum ${to} from index ${minIdx}.`,
      };
    }

    yield {
      type: "sorted",
      indices: [i],
      array: arr.slice(),
      message: `${at(arr, i)} is locked in as the next sorted element at index ${i}.`,
    };
  }

  if (n > 0) {
    yield {
      type: "sorted",
      indices: [n - 1],
      array: arr.slice(),
      message: `${at(arr, n - 1)} at index ${n - 1} is in its final sorted position.`,
    };
  }

  yield {
    type: "done",
    indices: [],
    array: arr.slice(),
    message: "Selection sort finished — the array is fully sorted.",
  };
}

/**
 * Insertion sort — shift larger elements right with swap.
 */
function* insertionSort(input) {
  const arr = input.slice();
  const n = arr.length;

  if (n > 0) {
    yield {
      type: "sorted",
      indices: [0],
      array: arr.slice(),
      message: `Start with ${at(arr, 0)} as a sorted prefix of length 1.`,
    };
  }

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0) {
      const left = at(arr, j - 1);
      const right = at(arr, j);
      if (left <= right) {
        yield {
          type: "compare",
          indices: [j - 1, j],
          array: arr.slice(),
          message: `Compare ${left} and ${right}: ${right} belongs here — stop shifting.`,
        };
        break;
      }

      yield {
        type: "compare",
        indices: [j - 1, j],
        array: arr.slice(),
        message: `Compare ${left} and ${right}: ${left} > ${right}, so shift ${left} one step right.`,
      };

      arr[j - 1] = right;
      arr[j] = left;
      yield {
        type: "swap",
        indices: [j - 1, j],
        array: arr.slice(),
        message: `Swap ${left} and ${right} to move the key leftward.`,
      };
      j -= 1;
    }

    const sortedPrefix = [];
    for (let k = 0; k <= i; k++) sortedPrefix.push(k);
    yield {
      type: "sorted",
      indices: sortedPrefix,
      array: arr.slice(),
      message: `Inserted key into place — indices 0…${i} are now a sorted prefix.`,
    };
  }

  yield {
    type: "done",
    indices: [],
    array: arr.slice(),
    message: "Insertion sort finished — the array is fully sorted.",
  };
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
      const L = left[i];
      const R = right[j];
      yield {
        type: "compare",
        indices: [lo + i, mid + 1 + j],
        array: arr.slice(),
        message: `Merge [${lo}…${hi}]: compare ${L} and ${R} to choose the next smaller value.`,
      };

      if (L <= R) {
        arr[k] = L;
        i += 1;
        yield {
          type: "set",
          indices: [k],
          array: arr.slice(),
          message: `Write ${L} into index ${k} from the left half.`,
        };
      } else {
        arr[k] = R;
        j += 1;
        yield {
          type: "set",
          indices: [k],
          array: arr.slice(),
          message: `Write ${R} into index ${k} from the right half.`,
        };
      }
      k += 1;
    }

    while (i < left.length) {
      arr[k] = left[i];
      yield {
        type: "set",
        indices: [k],
        array: arr.slice(),
        message: `Left half remainder: write ${left[i]} into index ${k}.`,
      };
      i += 1;
      k += 1;
    }

    while (j < right.length) {
      arr[k] = right[j];
      yield {
        type: "set",
        indices: [k],
        array: arr.slice(),
        message: `Right half remainder: write ${right[j]} into index ${k}.`,
      };
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
    yield {
      type: "sorted",
      indices: all,
      array: arr.slice(),
      message: "Merge sort complete — every index is in sorted order.",
    };
  }

  yield {
    type: "done",
    indices: [],
    array: arr.slice(),
    message: "Merge sort finished — the array is fully sorted.",
  };
}

/**
 * Quick sort — pivot at partition start, then compare and swap.
 */
function* quickSort(input) {
  const arr = input.slice();
  const n = arr.length;

  function* partition(lo, hi) {
    const pivot = at(arr, hi);
    yield {
      type: "pivot",
      indices: [hi],
      array: arr.slice(),
      message: `Choose pivot ${pivot} at index ${hi}; values less than ${pivot} will move left.`,
    };
    let i = lo;

    for (let j = lo; j < hi; j++) {
      const val = at(arr, j);
      if (val < pivot) {
        yield {
          type: "compare",
          indices: [j, hi],
          array: arr.slice(),
          message: `Compare ${val} with pivot ${pivot}: ${val} < ${pivot}, so it belongs on the left.`,
        };
        if (i !== j) {
          const leftVal = at(arr, i);
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
          yield {
            type: "swap",
            indices: [i, j],
            array: arr.slice(),
            message: `Swap ${leftVal} and ${val} to grow the “less than pivot” region.`,
          };
        }
        i += 1;
      } else {
        yield {
          type: "compare",
          indices: [j, hi],
          array: arr.slice(),
          message: `Compare ${val} with pivot ${pivot}: ${val} ≥ ${pivot}, leave it on the right for now.`,
        };
      }
    }

    if (i !== hi) {
      const leftVal = at(arr, i);
      const tmp = arr[i];
      arr[i] = arr[hi];
      arr[hi] = tmp;
      yield {
        type: "swap",
        indices: [i, hi],
        array: arr.slice(),
        message: `Place pivot ${pivot} at index ${i} (swapped with ${leftVal}).`,
      };
    }

    yield {
      type: "sorted",
      indices: [i],
      array: arr.slice(),
      message: `Pivot ${at(arr, i)} is in its final position at index ${i}.`,
    };
    return i;
  }

  function* sortRange(lo, hi) {
    if (lo > hi) return;
    if (lo === hi) {
      yield {
        type: "sorted",
        indices: [lo],
        array: arr.slice(),
        message: `Single element ${at(arr, lo)} at index ${lo} is already sorted.`,
      };
      return;
    }
    const p = yield* partition(lo, hi);
    yield* sortRange(lo, p - 1);
    yield* sortRange(p + 1, hi);
  }

  if (n > 0) {
    yield* sortRange(0, n - 1);
  }

  yield {
    type: "done",
    indices: [],
    array: arr.slice(),
    message: "Quick sort finished — the array is fully sorted.",
  };
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
      const rootVal = at(arr, root);
      const leftVal = at(arr, left);
      if (leftVal > rootVal) {
        yield {
          type: "compare",
          indices: [root, left],
          array: arr.slice(),
          message: `Sift down: compare ${rootVal} with left child ${leftVal} — child is larger.`,
        };
        swapIdx = left;
      } else {
        yield {
          type: "compare",
          indices: [root, left],
          array: arr.slice(),
          message: `Sift down: compare ${rootVal} with left child ${leftVal} — parent stays larger so far.`,
        };
      }

      const right = left + 1;
      if (right <= end) {
        const best = at(arr, swapIdx);
        const rightVal = at(arr, right);
        if (rightVal > best) {
          yield {
            type: "compare",
            indices: [swapIdx, right],
            array: arr.slice(),
            message: `Sift down: compare ${best} with right child ${rightVal} — right child is larger.`,
          };
          swapIdx = right;
        } else {
          yield {
            type: "compare",
            indices: [swapIdx, right],
            array: arr.slice(),
            message: `Sift down: compare ${best} with right child ${rightVal} — no larger child.`,
          };
        }
      }

      if (swapIdx === root) break;

      const a = at(arr, root);
      const b = at(arr, swapIdx);
      const tmp = arr[root];
      arr[root] = arr[swapIdx];
      arr[swapIdx] = tmp;
      yield {
        type: "swap",
        indices: [root, swapIdx],
        array: arr.slice(),
        message: `Swap ${a} with child ${b} to restore the max-heap property.`,
      };
      root = swapIdx;
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(i, n - 1);
  }

  for (let end = n - 1; end > 0; end--) {
    const max = at(arr, 0);
    const leaf = at(arr, end);
    const tmp = arr[0];
    arr[0] = arr[end];
    arr[end] = tmp;
    yield {
      type: "swap",
      indices: [0, end],
      array: arr.slice(),
      message: `Extract max ${max}: swap root with index ${end} (was ${leaf}).`,
    };
    yield {
      type: "sorted",
      indices: [end],
      array: arr.slice(),
      message: `${at(arr, end)} is fixed at the end of the heap range.`,
    };
    yield* siftDown(0, end - 1);
  }

  if (n > 0) {
    yield {
      type: "sorted",
      indices: [0],
      array: arr.slice(),
      message: `${at(arr, 0)} at index 0 is in its final sorted position.`,
    };
  }

  yield {
    type: "done",
    indices: [],
    array: arr.slice(),
    message: "Heap sort finished — the array is fully sorted.",
  };
}
