import { ShapeBuilder } from './Shape';

export function Pie(radius: number): ShapeBuilder {
  return new ShapeBuilder('pie', { kind: 'pie', radius });
}
