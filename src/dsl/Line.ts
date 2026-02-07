import { ShapeBuilder, Vec2 } from './Shape';

export function Line(from: Vec2, to: Vec2): ShapeBuilder {
  return new ShapeBuilder('path', { kind: 'path', points: [from, to], closed: false });
}
