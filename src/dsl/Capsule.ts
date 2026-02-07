import { ShapeBuilder } from './Shape';

export function Capsule(width = 160, height = 60): ShapeBuilder {
  const radius = Math.min(width, height) / 2;
  return new ShapeBuilder('roundRect', { kind: 'roundRect', width, height, radius });
}
