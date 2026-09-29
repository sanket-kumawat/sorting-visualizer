/** Metadata for the About / complexity panel. No DOM here. */
const info = {
  bubble: {
    name: 'Bubble Sort',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    desc: 'Repeatedly swaps adjacent out-of-order pairs.',
    definition:
      'Bubble sort walks the array from left to right, comparing each pair of neighbors and swapping them when they are out of order. Each full pass pushes the next-largest value toward the end, like a bubble rising through water. An early-exit variant stops when a pass makes no swaps, which gives O(n) time on already-sorted input. It is stable and uses constant extra memory, but its quadratic average cost makes it mainly useful for teaching.',
  },
  selection: {
    name: 'Selection Sort',
    best: 'O(n²)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    desc: 'Scans for the minimum and swaps it into place each pass.',
    definition:
      'Selection sort divides the array into a sorted prefix and an unsorted suffix. On every pass it scans the suffix for the smallest remaining value, then swaps that value into the next position of the prefix. It always performs Θ(n²) comparisons, even when the input is already sorted, but it does at most n−1 swaps. The algorithm is not stable because a swap can move equal keys past each other.',
  },
  insertion: {
    name: 'Insertion Sort',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    desc: 'Inserts each element into the sorted prefix by shifting larger ones.',
    definition:
      'Insertion sort grows a sorted prefix one element at a time. The next key is compared with neighbors to its left and shifted (via swaps or moves) until it sits in the correct place inside the prefix. On nearly sorted data it runs in near-linear time, which is why it often appears as a base case inside hybrid sorts. It is stable and works in-place with O(1) extra space.',
  },
  merge: {
    name: 'Merge Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    desc: 'Divides the array in half, sorts each half, then merges them.',
    definition:
      'Merge sort is a divide-and-conquer algorithm: it splits the range in half, recursively sorts each half, then merges the two sorted runs into one. The merge step walks both halves and always writes the smaller head value next, which preserves relative order of equal keys (stability). Its time bound is Θ(n log n) in every case, at the cost of O(n) auxiliary memory for the temporary buffers used while merging.',
  },
  quick: {
    name: 'Quick Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    desc: 'Partitions around a pivot, then sorts the two sides recursively.',
    definition:
      'Quick sort picks a pivot, partitions the range so smaller values lie left of the pivot and larger ones lie right, then recursively sorts both sides. With a balanced pivot the expected cost is O(n log n); adversarial pivots can degrade to O(n²). The in-place Lomuto/Hoare partition uses O(log n) stack space on average. Standard in-place quick sort is not stable.',
  },
  heap: {
    name: 'Heap Sort',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    desc: 'Builds a max-heap, then repeatedly extracts the largest element.',
    definition:
      'Heap sort first rearranges the array into a max-heap so every parent is at least as large as its children. It then repeatedly swaps the root (the current maximum) with the last unsorted position and sifts the new root down to restore the heap on the shrinking prefix. The result is an in-place O(n log n) sort in the worst case with O(1) extra memory, but swaps during sifting make it unstable.',
  },
};
