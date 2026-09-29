# Sorting Visualizer

Watch comparison-based sorting algorithms unfold step by step.

Sorting Visualizer is a client-side learning tool for students, teachers, and
interview preparation. It connects an animated bar visualization with narrated
operations, live statistics, complexity details, and reference implementations
so you can see how each algorithm moves data.

## Live Demo

[Open Sorting Visualizer](https://sorting-visualizer.kumawatsanket.workers.dev/)

## Features

- Visualizes Bubble, Selection, Insertion, Merge, Quick, and Heap Sort.
- Narrates comparisons, swaps, writes, pivots, and completed regions.
- Supports start, pause, resume, step forward, step backward, and reset.
- Accepts custom comma-separated arrays or generates a random sample.
- Adjusts playback speed while a sort is running.
- Tracks comparisons, writes, and current step progress.
- Shows time complexity, space complexity, stability, and algorithm steps.
- Includes copyable JavaScript, Python, Java, and C++ implementations.
- Provides persistent light and dark themes.
- Runs entirely in the browser with no backend or build step.

## Getting Started

### Requirements

- A modern web browser
- Python 3 or another static file server (recommended)

### Installation

Clone the repository:

```bash
git clone https://github.com/sanket-kumawat/sorting-visualizer.git
cd sorting-visualizer
```

Start a local server:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also open `index.html` directly, but serving the project locally gives
browser features such as clipboard access a more consistent environment.

## Usage

1. Enter comma-separated numbers or select **Auto-fill**.
2. Choose a sorting algorithm.
3. Select **Start** to play the full visualization.
4. Pause or use the arrow controls to inspect individual operations.
5. Adjust the speed slider at any time.
6. Review the live narration, bar states, statistics, complexity, and code.

Arrays may contain up to 100 finite numbers.

### Keyboard Shortcuts

- `Space`: start, pause, or resume
- `Right Arrow`: step forward
- `Left Arrow`: step backward

Shortcuts are ignored while typing in a form control.

## Color States

- **Compare:** values currently being compared
- **Swap / Set:** values being moved or written
- **Pivot:** the active pivot in pivot-based sorting
- **Sorted:** values in their final positions

The narration and labels provide the same information without relying on color
alone.

## Project Structure

- `index.html` — application structure and controls
- `style.css` — responsive light and dark visual themes
- `script.js` — UI state, playback, validation, and interactions
- `algorithms.js` — generator-based sorting implementations
- `algorithm-info.js` — definitions and complexity metadata
- `code-snippets.js` — reference implementations in four languages
- `favicon.svg` — project favicon

The project uses plain HTML, CSS, and JavaScript. It has no runtime dependencies
and does not send array data to a server.

## Contributing

Contributions are welcome.

1. Fork the repository and create a focused branch.
2. Make your changes while preserving the client-only architecture.
3. Test custom input, playback controls, keyboard shortcuts, both themes, and
   responsive layouts.
4. Open a pull request describing the behavior you changed and how you tested
   it.

For substantial changes, open an
[issue](https://github.com/sanket-kumawat/sorting-visualizer/issues) first to
discuss the approach.

## Support

Report bugs or request improvements through the
[GitHub issue tracker](https://github.com/sanket-kumawat/sorting-visualizer/issues).

## License

No license has been added to this repository yet.
