import { ShapeBuilder } from './Shape';

export function Circle(radius: number): ShapeBuilder {
  return new ShapeBuilder('circle', { kind: 'circle', radius });
}
