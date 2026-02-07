import { ShapeBuilder, Vec2 } from './Shape';

export function Polyline(points: Vec2[]): ShapeBuilder {
  return new ShapeBuilder('path', { kind: 'path', points, closed: false });
}
