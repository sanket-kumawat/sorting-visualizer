/**
 * Reference implementations aligned with the visualizer.
 * codeSnippets[algorithm][language] → source string
 */
const CODE_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

const codeSnippets = {
  bubble: {
    javascript: `function bubbleSort(arr) {
  const a = arr.slice();
  const n = a.length;
  for (let end = n - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return a;
}`,
    python: `def bubble_sort(arr):
    a = list(arr)
    n = len(a)
    for end in range(n - 1, 0, -1):
        swapped = False
        for i in range(end):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        if not swapped:
            break  # already sorted
    return a`,
    java: `public static void bubbleSort(int[] a) {
    int n = a.length;
    for (int end = n - 1; end > 0; end--) {
        boolean swapped = false;
        for (int i = 0; i < end; i++) {
            if (a[i] > a[i + 1]) {
                int tmp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}`,
    cpp: `void bubbleSort(vector<int>& a) {
    int n = (int)a.size();
    for (int end = n - 1; end > 0; --end) {
        bool swapped = false;
        for (int i = 0; i < end; ++i) {
            if (a[i] > a[i + 1]) {
                swap(a[i], a[i + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}`,
  },

  selection: {
    javascript: `function selectionSort(arr) {
  const a = arr.slice();
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
  }
  return a;
}`,
    python: `def selection_sort(arr):
    a = list(arr)
    n = len(a)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
    return a`,
    java: `public static void selectionSort(int[] a) {
    int n = a.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int tmp = a[i];
            a[i] = a[minIdx];
            a[minIdx] = tmp;
        }
    }
}`,
    cpp: `void selectionSort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx != i) swap(a[i], a[minIdx]);
    }
}`,
  },

  insertion: {
    javascript: `function insertionSort(arr) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      j--;
    }
  }
  return a;
}`,
    python: `def insertion_sort(arr):
    a = list(arr)
    for i in range(1, len(a)):
        j = i
        while j > 0 and a[j - 1] > a[j]:
            a[j - 1], a[j] = a[j], a[j - 1]
            j -= 1
    return a`,
    java: `public static void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int j = i;
        while (j > 0 && a[j - 1] > a[j]) {
            int tmp = a[j - 1];
            a[j - 1] = a[j];
            a[j] = tmp;
            j--;
        }
    }
}`,
    cpp: `void insertionSort(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); ++i) {
        int j = i;
        while (j > 0 && a[j - 1] > a[j]) {
            swap(a[j - 1], a[j]);
            --j;
        }
    }
}`,
  },

  merge: {
    javascript: `function mergeSort(arr) {
  const a = arr.slice();

  function merge(lo, mid, hi) {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  if (a.length) sort(0, a.length - 1);
  return a;
}`,
    python: `def merge_sort(arr):
    a = list(arr)

    def merge(lo, mid, hi):
        left = a[lo:mid + 1]
        right = a[mid + 1:hi + 1]
        i = j = 0
        k = lo
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                a[k] = left[i]
                i += 1
            else:
                a[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            a[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            a[k] = right[j]
            j += 1
            k += 1

    def sort_range(lo, hi):
        if lo >= hi:
            return
        mid = (lo + hi) // 2
        sort_range(lo, mid)
        sort_range(mid + 1, hi)
        merge(lo, mid, hi)

    if a:
        sort_range(0, len(a) - 1)
    return a`,
    java: `public static void mergeSort(int[] a) {
    if (a.length == 0) return;
    sort(a, 0, a.length - 1);
}

private static void sort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) >>> 1;
    sort(a, lo, mid);
    sort(a, mid + 1, hi);
    merge(a, lo, mid, hi);
}

private static void merge(int[] a, int lo, int mid, int hi) {
    int[] left = Arrays.copyOfRange(a, lo, mid + 1);
    int[] right = Arrays.copyOfRange(a, mid + 1, hi + 1);
    int i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
        a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
}`,
    cpp: `void mergeRange(vector<int>& a, int lo, int mid, int hi) {
    vector<int> left(a.begin() + lo, a.begin() + mid + 1);
    vector<int> right(a.begin() + mid + 1, a.begin() + hi + 1);
    size_t i = 0, j = 0;
    int k = lo;
    while (i < left.size() && j < right.size()) {
        a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < left.size()) a[k++] = left[i++];
    while (j < right.size()) a[k++] = right[j++];
}

void sortRange(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = (lo + hi) / 2;
    sortRange(a, lo, mid);
    sortRange(a, mid + 1, hi);
    mergeRange(a, lo, mid, hi);
}

void mergeSort(vector<int>& a) {
    if (!a.empty()) sortRange(a, 0, (int)a.size() - 1);
}`,
  },

  quick: {
    javascript: `function quickSort(arr) {
  const a = arr.slice();

  function partition(lo, hi) {
    const pivot = a[hi]; // last element as pivot
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    return i;
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  if (a.length) sort(0, a.length - 1);
  return a;
}`,
    python: `def quick_sort(arr):
    a = list(arr)

    def partition(lo, hi):
        pivot = a[hi]  # last element as pivot
        i = lo
        for j in range(lo, hi):
            if a[j] < pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        return i

    def sort_range(lo, hi):
        if lo >= hi:
            return
        p = partition(lo, hi)
        sort_range(lo, p - 1)
        sort_range(p + 1, hi)

    if a:
        sort_range(0, len(a) - 1)
    return a`,
    java: `public static void quickSort(int[] a) {
    if (a.length == 0) return;
    sort(a, 0, a.length - 1);
}

private static int partition(int[] a, int lo, int hi) {
    int pivot = a[hi]; // last element as pivot
    int i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < pivot) {
            int tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
            i++;
        }
    }
    int tmp = a[i];
    a[i] = a[hi];
    a[hi] = tmp;
    return i;
}

private static void sort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    sort(a, lo, p - 1);
    sort(a, p + 1, hi);
}`,
    cpp: `int partition(vector<int>& a, int lo, int hi) {
    int pivot = a[hi]; // last element as pivot
    int i = lo;
    for (int j = lo; j < hi; ++j) {
        if (a[j] < pivot) {
            swap(a[i], a[j]);
            ++i;
        }
    }
    swap(a[i], a[hi]);
    return i;
}

void sortRange(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    sortRange(a, lo, p - 1);
    sortRange(a, p + 1, hi);
}

void quickSort(vector<int>& a) {
    if (!a.empty()) sortRange(a, 0, (int)a.size() - 1);
}`,
  },

  heap: {
    javascript: `function heapSort(arr) {
  const a = arr.slice();
  const n = a.length;

  function siftDown(start, end) {
    let root = start;
    while (true) {
      let child = 2 * root + 1;
      if (child > end) break;
      if (child + 1 <= end && a[child + 1] > a[child]) child++;
      if (a[root] >= a[child]) break;
      [a[root], a[child]] = [a[child], a[root]];
      root = child;
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(i, n - 1);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(0, end - 1);
  }
  return a;
}`,
    python: `def heap_sort(arr):
    a = list(arr)
    n = len(a)

    def sift_down(start, end):
        root = start
        while True:
            child = 2 * root + 1
            if child > end:
                break
            if child + 1 <= end and a[child + 1] > a[child]:
                child += 1
            if a[root] >= a[child]:
                break
            a[root], a[child] = a[child], a[root]
            root = child

    for i in range(n // 2 - 1, -1, -1):
        sift_down(i, n - 1)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down(0, end - 1)
    return a`,
    java: `public static void heapSort(int[] a) {
    int n = a.length;
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(a, i, n - 1);
    for (int end = n - 1; end > 0; end--) {
        int tmp = a[0];
        a[0] = a[end];
        a[end] = tmp;
        siftDown(a, 0, end - 1);
    }
}

private static void siftDown(int[] a, int start, int end) {
    int root = start;
    while (true) {
        int child = 2 * root + 1;
        if (child > end) break;
        if (child + 1 <= end && a[child + 1] > a[child]) child++;
        if (a[root] >= a[child]) break;
        int tmp = a[root];
        a[root] = a[child];
        a[child] = tmp;
        root = child;
    }
}`,
    cpp: `void siftDown(vector<int>& a, int start, int end) {
    int root = start;
    while (true) {
        int child = 2 * root + 1;
        if (child > end) break;
        if (child + 1 <= end && a[child + 1] > a[child]) ++child;
        if (a[root] >= a[child]) break;
        swap(a[root], a[child]);
        root = child;
    }
}

void heapSort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; --i) siftDown(a, i, n - 1);
    for (int end = n - 1; end > 0; --end) {
        swap(a[0], a[end]);
        siftDown(a, 0, end - 1);
    }
}`,
  },
};
