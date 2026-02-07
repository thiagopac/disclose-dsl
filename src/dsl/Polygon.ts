import { ShapeBuilder, Vec2 } from './Shape';

export function Polygon(points: Vec2[], closed = true): ShapeBuilder {
  return new ShapeBuilder('path', { kind: 'path', points, closed });
}
