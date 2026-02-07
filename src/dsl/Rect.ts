import { ShapeBuilder } from './Shape';

export function Rect(width = 80, height = 80): ShapeBuilder {
  return new ShapeBuilder('rect', { kind: 'rect', width, height });
}
