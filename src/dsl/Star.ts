import { ShapeBuilder, Vec2 } from './Shape';

export function Star(
  points = 5,
  outer = 80,
  inner = 40,
  options: { rotation?: number } = {}
): ShapeBuilder {
  const count = Math.max(2, Math.floor(points));
  const rot = options.rotation ?? -Math.PI / 2;
  const vertices: Vec2[] = [];
  const total = count * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rot + (i * Math.PI * 2) / total;
    vertices.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  return new ShapeBuilder('path', { kind: 'path', points: vertices, closed: true });
}
