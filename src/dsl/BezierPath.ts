import { BezierCommand, ShapeBuilder } from './Shape';

export function BezierPath(commands: BezierCommand[]): ShapeBuilder {
  return new ShapeBuilder('bezier', { kind: 'bezier', commands });
}
