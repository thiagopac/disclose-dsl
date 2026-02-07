import { ShapeBuilder, Vec2 } from './Shape';

export function RegularPolygon(
  sides = 6,
  radius = 60,
  options: { rotation?: number } = {}
): ShapeBuilder {
  const count = Math.max(3, Math.floor(sides));
  const rot = options.rotation ?? -Math.PI / 2;
  const points: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    const a = rot + (i * Math.PI * 2) / count;
    points.push({ x: Math.cos(a) * radius, y: Math.sin(a) * radius });
  }
  return new ShapeBuilder('path', { kind: 'path', points, closed: true });
}
