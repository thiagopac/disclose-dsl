import { ShapeBuilder } from './Shape';

export function Ellipse(width = 120, height = 80): ShapeBuilder {
  const rx = width / 2;
  const ry = height / 2;
  return new ShapeBuilder('ellipse', { kind: 'ellipse', rx, ry });
}
