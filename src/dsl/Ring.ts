import { ShapeBuilder } from './Shape';

export function Ring(outer = 80, inner = 50): ShapeBuilder {
  const safeInner = Math.max(0, Math.min(inner, outer));
  return new ShapeBuilder('ring', { kind: 'ring', outer, inner: safeInner });
}
