# Disclose DSL

Disclose DSL is an experimental animation, transformation, and timing DSL for composing scenes and shapes with a fluent, declarative API. It targets canvas rendering but keeps the core DSL portable and testable.

## Status

Work in progress. The public API is unstable and may change without notice.

## Documentation

https://thiagopac.github.io/disclose-docs/

## Why Disclose DSL

Disclose DSL is designed to make motion design feel like writing a short script instead of building a framework. You define shapes, chain universal modifiers, and compose time with just a few lines. The goal is to be fast, expressive, and easy to remix.

What you can do quickly:
- Build shapes and symbols from primitives (circles, rects, paths, polygons, stars).
- Chain universal modifiers (`fill`, `stroke`, `move`, `scale`, `rotate`, `opacity`, `trim`, `morph`).
- Animate colors, gradients, strokes, and opacity over time.
- Orchestrate timelines with `sequence`, `parallel`, `on`, and `when`.
- Bring in images and text alongside vector shapes.

If you like writing motion as code, this is built for you.

## Examples

### Logo Pulse (few lines)

```ts
import { Scene, Circle } from 'disclose-dsl';

const scene = Scene((t) => [
  Circle(64)
    .fill('#111827')
    .stroke({ color: '#ffffff', width: 4 })
    .scale({ from: 0.9, to: 1.05, duration: 800, loop: true, ease: 'easeInOut' })
    .opacity({ from: 0.7, to: 1, duration: 800, loop: true }),
]);
```

### Orbiting Dots

```ts
import { Scene, Circle } from 'disclose-dsl';

const scene = Scene((t) => [
  Circle(6)
    .fill('#22d3ee')
    .move({ x: [-120, 120], duration: 2000, loop: true, ease: 'easeInOut' })
    .every(200, () =>
      Circle(6)
        .fill('#22d3ee')
        .opacity({ from: 1, to: 0, duration: 800, ease: 'easeOut' })
    ),
]);
```

### Staggered Text Reveal

```ts
import { Scene, Text } from 'disclose-dsl';

const scene = Scene((t) => [
  Text('Disclose', { fontSize: 64, fontWeight: 600 })
    .fill({ from: '#94a3b8', to: '#ffffff', duration: 900, stagger: 30, split: 'letter' })
    .opacity({ from: 0, to: 1, duration: 900, stagger: 30, split: 'letter' }),
]);
```

### Composed Timing

```ts
import { Scene, Circle, Rect, sequence, on } from 'disclose-dsl';

const scene = Scene((t) => [
  sequence(
    Circle(48).fill('#f97316').scale({ from: 0, to: 1, duration: 600, ease: 'easeOut' }),
    Rect(140, 80).fill('#0ea5e9').rotate({ from: 0, to: Math.PI / 8, duration: 600 })
  ),
  on('scene+1200', Circle(10).fill('#22c55e').move({ y: [-80, 80], duration: 900, loop: true })),
]);
```

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

Contributions are welcome. See `CONTRIBUTING.md` for workflow, conventions, and release steps.

## License

MIT. See `LICENSE`.
