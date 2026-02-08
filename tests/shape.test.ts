import { describe, expect, it } from 'vitest';
import { Circle } from '../src/dsl/Circle';
import { Copy, estimateDuration } from '../src/dsl/Shape';

describe('ShapeBuilder', () => {
  it('evaluates movement over time', () => {
    const shape = Circle(10).move({ x: [0, 10], duration: 1000 });

    const [start] = shape.evaluate(0);
    const [end] = shape.evaluate(1000);

    expect(start.transform.x).toBeCloseTo(0);
    expect(end.transform.x).toBeCloseTo(10);
  });

  it('applies static fill', () => {
    const [shape] = Circle(8).fill('#ff0000').evaluate(0);
    expect(shape.fill).toBe('#ff0000');
    expect(shape.fillSet).toBe(true);
  });

  it('accounts for prev.end offsets in duration', () => {
    const shape = Circle(10)
      .move({ x: [0, 10], duration: 1000 })
      .move({ x: [0, 5], duration: 500, start: 'prev.end+200' });

    expect(estimateDuration(shape)).toBe(1700);
  });

  it('creates copies with every()', () => {
    const shape = Circle(6).every(1000, () => Copy());

    expect(shape.evaluate(0).length).toBe(2);
    expect(shape.evaluate(1000).length).toBe(3);
  });
});
