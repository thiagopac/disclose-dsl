import { ShapeBuilder, Vec2 } from './Shape';

export function RegularStar(
  points = 5,
  radius = 80,
  options: { innerRatio?: number; rotation?: number } = {}
): ShapeBuilder {
  const count = Math.max(2, Math.floor(points));
  const innerRatio = options.innerRatio ?? 0.5;
  const inner = radius * innerRatio;
  const rot = options.rotation ?? -Math.PI / 2;
  const vertices: Vec2[] = [];
  const total = count * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? radius : inner;
    const a = rot + (i * Math.PI * 2) / total;
    vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  return new ShapeBuilder('path', { kind: 'path', points: vertices, closed: true });
}
