# Disclose DSL

Disclose DSL is an experimental animation, transformation, and timing DSL for composing scenes and shapes with a Swift-like fluent API. It targets canvas rendering but keeps the core DSL portable and testable.

## Status

Work in progress. The public API is unstable and may change without notice. Documentation and an interactive editor are planned for GitHub Pages.

## Install

```bash
npm install disclose-dsl
```

## Quick Start (Module)

```ts
import { Scene, Circle, Rect, play } from 'disclose-dsl';

const scene = Scene({ duration: 4000 }, (t) => [
  Circle(60)
    .fill('#ff4d4f')
    .move({ x: [-200, 200], duration: 2000, ease: 'easeInOut' })
    .opacity({ from: 0, to: 1, duration: 800 }),

  Rect(140, 90)
    .fill('#2f54eb')
    .scale({ from: 0.7, to: 1.1, duration: 1200, ease: 'easeOut' })
    .rotate({ from: 0, to: Math.PI / 8, duration: 1200 }),
]);

const canvas = document.querySelector('#stage');
if (!canvas) throw new Error('Canvas not found');

play(canvas, scene);
```

`requestAnimationFrame` is the browser's animation loop. We use it to redraw the scene every frame.

## Quick Start (CDN + HTML)

```html
<canvas id="stage" style="width: 800px; height: 400px;"></canvas>
<script type="module">
  import {
    Scene,
    Circle,
    Rect,
    play
  } from 'https://unpkg.com/disclose-dsl@0.1.0/dist/index.js';

  const scene = Scene({ duration: 4000 }, (t) => [
    Circle(60)
      .fill('#ff4d4f')
      .move({ x: [-200, 200], duration: 2000, ease: 'easeInOut' })
      .opacity({ from: 0, to: 1, duration: 800 }),

    Rect(140, 90)
      .fill('#2f54eb')
      .scale({ from: 0.7, to: 1.1, duration: 1200, ease: 'easeOut' })
      .rotate({ from: 0, to: Math.PI / 8, duration: 1200 }),
  ]);

  const canvas = document.querySelector('#stage');
  play(canvas, scene);
</script>
```

## CDN

```txt
https://unpkg.com/disclose-dsl@0.1.0/dist/index.js
https://cdn.jsdelivr.net/npm/disclose-dsl@0.1.0/dist/index.js
```

## Concepts

- **Scenes**: `Scene(options, factory)` creates a time-aware list of shapes.
- **Shapes**: `Circle`, `Rect`, `Ellipse`, `Path`, `Text`, `Image`, and more build geometry.
- **Modifiers**: chain `fill`, `stroke`, `move`, `scale`, `rotate`, `opacity`, `trim`, `morph`, `clip`, etc.
- **Time refs**: many modifiers accept `start` as a number or string like `scene+200` or `prev.end+150`.
- **Flow helpers**: `parallel`, `sequence`, `on`, and `when` help orchestrate timing between multiple items.

## Tests

```bash
npm test
```

## Contributing

See `CONTRIBUTING.md`.

## License

MIT. See `LICENSE`.
