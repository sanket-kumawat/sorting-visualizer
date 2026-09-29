/** Metadata for the About / complexity panel. No DOM here. */
const info = {
  bubble: {
    name: 'Bubble Sort',
    source: 'https://www.geeksforgeeks.org/dsa/bubble-sort-algorithm/',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    desc: 'Repeatedly swaps adjacent out-of-order pairs.',
    definition:
      'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not efficient for large data sets as its average and worst-case time complexity are quite high.',
    steps: [
      'Sorts the array using multiple passes. After the first pass, the maximum goes to end (its correct position). Same way, after second pass, the second largest goes to second last position and so on.',
      'In every pass, process only those that have already not moved to correct position. After k passes, the largest k must have been moved to the last k positions.',
      'In a pass, we consider remaining elements and compare all adjacent and swap if larger element is before a smaller element. If we keep doing this, we get the largest (among the remaining elements) at its correct position.',
    ],
  },
  selection: {
    name: 'Selection Sort',
    source: 'https://www.geeksforgeeks.org/dsa/selection-sort-algorithm-2/',
    best: 'O(n²)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    desc: 'Scans for the minimum and swaps it into place each pass.',
    definition:
      'Selection Sort is a comparison-based sorting algorithm. It sorts by repeatedly selecting the smallest (or largest) element from the unsorted portion and swapping it with the first unsorted element.',
    steps: [
      'Find the smallest element and swap it with the first element. This way we get the smallest element at its correct position.',
      'Then find the smallest among remaining elements (or second smallest) and swap it with the second element.',
      'We keep doing this until we get all elements moved to correct position.',
    ],
  },
  insertion: {
    name: 'Insertion Sort',
    source: 'https://www.geeksforgeeks.org/dsa/insertion-sort-algorithm/',
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    desc: 'Inserts each element into the sorted prefix by shifting larger ones.',
    definition:
      'Insertion sort is a simple sorting algorithm that works by iteratively inserting each element of an unsorted list into its correct position in a sorted portion of the list.',
    steps: [
      'Start with the second element as the first element is assumed to be sorted.',
      'Compare the second element with the first if the second is smaller then swap them.',
      'Move to the third element, compare it with the first two, and put it in its correct position',
      'Repeat until the entire array is sorted.',
    ],
  },
  merge: {
    name: 'Merge Sort',
    source: 'https://www.geeksforgeeks.org/dsa/merge-sort/',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    desc: 'Divides the array in half, sorts each half, then merges them.',
    definition:
      'Merge sort is a popular sorting algorithm known for its efficiency and stability. It follows the Divide and Conquer approach. It works by recursively dividing the input array into two halves, recursively sorting the two halves and finally merging them back together to obtain the sorted array.',
    steps: [
      'Divide the list or array recursively into two halves until it can no more be divided.',
      'Each subarray is sorted individually using the merge sort algorithm.',
      'The sorted subarrays are merged back together in sorted order. The process continues until all elements from both subarrays have been merged.',
    ],
  },
  quick: {
    name: 'Quick Sort',
    source: 'https://www.geeksforgeeks.org/dsa/quick-sort-algorithm/',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    desc: 'Partitions around a pivot, then sorts the two sides recursively.',
    definition:
      'QuickSort is a sorting algorithm based on the Divide and Conquer that picks an element as a pivot and partitions the given array around the picked pivot by placing the pivot in its correct position in the sorted array.',
    steps: [
      'Choose a Pivot: Select an element from the array as the pivot. The choice of pivot can vary (e.g., first element, last element, random element, or median).',
      'Partition the Array: Re arrange the array around the pivot. After partitioning, all elements smaller than the pivot will be on its left, and all elements greater than the pivot will be on its right.',
      'Recursively Call: Recursively apply the same process to the two partitioned sub-arrays.',
      'Base Case: The recursion stops when there is only one element left in the sub-array, as a single element is already sorted.',
    ],
  },
  heap: {
    name: 'Heap Sort',
    source: 'https://www.geeksforgeeks.org/dsa/heap-sort/',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    desc: 'Builds a max-heap, then repeatedly extracts the largest element.',
    definition:
      'Heap sort is a comparison-based algorithm that uses a binary max-heap to repeatedly move the largest remaining value into its final position.',
    steps: [
      'Treat the array as a complete binary tree.',
      'Rearrange it into a max-heap, where every parent is at least as large as its children.',
      'Swap the root (the maximum) with the last value in the unsorted range.',
      'Shrink the heap, restore its property by sifting down, and repeat until sorted.',
    ],
  },
};
