import { SceneFn } from '../dsl/Scene';
import { Timeline } from './Timeline';
import { Renderer } from './Renderer';

type PlayOptions = {
  timeline?: Timeline;
};

type PlayHandle = {
  renderer: Renderer;
  timeline: Timeline;
  stop: () => void;
};

export function play(canvas: HTMLCanvasElement, scene: SceneFn, options: PlayOptions = {}): PlayHandle {
  const renderer = new Renderer(canvas, scene);
  const timeline = options.timeline ?? new Timeline();
  let raf = 0;

  const tick = () => {
    renderer.render(timeline.now());
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);

  return {
    renderer,
    timeline,
    stop: () => {
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
