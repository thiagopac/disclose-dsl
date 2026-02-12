import { describe, expect, it } from 'vitest';
import { Rect } from '../src/dsl/Rect';
import { Polygon } from '../src/dsl/Polygon';

describe('distort modifier', () => {
  it('converts rect to path and offsets corners', () => {
    const [shape] = Rect(100, 50)
      .distort({
        tl: { x: -10, y: 0 },
        tr: { x: 10, y: 0 },
      })
      .evaluate(0);

    expect(shape.kind).toBe('path');
    expect(shape.geom.points?.length).toBe(4);
    expect(shape.geom.points?.[0]).toEqual({ x: -60, y: -25 });
    expect(shape.geom.points?.[1]).toEqual({ x: 60, y: -25 });
  });

  it('distorts path points through the bounding box mapping', () => {
    const [shape] = Polygon([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ])
      .distort({
        bl: { x: 0, y: 20 },
      })
      .evaluate(0);

    expect(shape.kind).toBe('path');
    expect(shape.geom.points?.[3]).toEqual({ x: 0, y: 120 });
  });
});
