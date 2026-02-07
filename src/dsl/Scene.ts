import { ShapeBuilder } from './Shape';

export type SceneFn = ((time: number) => ShapeBuilder[]) & { duration?: number; timeScale?: number };

type SceneFactory = (time: number) => ShapeBuilder[];
type SceneOptions = { duration?: number; timeScale?: number };

let lastScene: SceneFn | null = null;

type SceneWithLast = ((optionsOrFactory: SceneOptions | SceneFactory, maybeFactory?: SceneFactory) => SceneFn) & {
  getLast: () => SceneFn | null;
  reset: () => void;
};

export const Scene: SceneWithLast = ((optionsOrFactory: SceneOptions | SceneFactory, maybeFactory?: SceneFactory) => {
  const options = typeof optionsOrFactory === 'function' ? {} : optionsOrFactory;
  const factory = typeof optionsOrFactory === 'function' ? optionsOrFactory : (maybeFactory as SceneFactory);
  const timeScale = options.timeScale ?? 1;
  const scene: SceneFn = ((time: number) => factory(time * timeScale)) as SceneFn;
  scene.duration = options.duration;
  scene.timeScale = timeScale;
  lastScene = scene;
  return scene;
}) as SceneWithLast;

Scene.getLast = () => lastScene;
Scene.reset = () => {
  lastScene = null;
};
