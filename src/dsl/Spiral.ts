import { ShapeBuilder, Vec2 } from './Shape';

export function Spiral(
  turns = 3,
  radius = 80,
  points = 200,
  options: { startRadius?: number; rotation?: number; clockwise?: boolean } = {}
): ShapeBuilder {
  const count = Math.max(3, Math.floor(points));
  const startRadius = options.startRadius ?? 0;
  const rot = options.rotation ?? -Math.PI / 2;
  const dir = options.clockwise === false ? -1 : 1;
  const maxT = Math.PI * 2 * turns;
  const out: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * maxT;
    const r = startRadius + (radius - startRadius) * (t / maxT);
    const a = rot + dir * t;
    out.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }
  return new ShapeBuilder('path', { kind: 'path', points: out, closed: false });
}
