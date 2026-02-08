import { describe, expect, it } from 'vitest';
import { Scene } from '../src/dsl/Scene';
import { Circle } from '../src/dsl/Circle';

describe('Scene', () => {
  it('applies timeScale to the factory time', () => {
    let captured = 0;
    const scene = Scene({ timeScale: 2 }, (time) => {
      captured = time;
      return [Circle(10)];
    });

    scene(10);
    expect(captured).toBe(20);
  });

  it('tracks the last scene', () => {
    Scene.reset();
    expect(Scene.getLast()).toBeNull();

    const scene = Scene(() => [Circle(5)]);
    expect(Scene.getLast()).toBe(scene);
  });
});
