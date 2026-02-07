import { ShapeBuilder } from './Shape';

export function RoundedRect(
  width = 120,
  height = 80,
  radius: number | { tl: number; tr: number; br: number; bl: number } = 16
): ShapeBuilder {
  return new ShapeBuilder('roundRect', { kind: 'roundRect', width, height, radius });
}
