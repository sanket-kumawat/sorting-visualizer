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
