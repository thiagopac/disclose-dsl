import { ShapeBuilder } from './Shape';

export function Arc(
  radius = 80,
  startAngle = 0,
  endAngle = Math.PI / 2,
  options: { innerRadius?: number; thickness?: number; counterclockwise?: boolean } = {}
): ShapeBuilder {
  const ccw = options.counterclockwise ?? false;
  const innerRadius =
    options.innerRadius !== undefined
      ? Math.max(0, Math.min(options.innerRadius, radius))
      : options.thickness !== undefined
        ? Math.max(0, radius - Math.max(0, options.thickness))
        : 0;
  return new ShapeBuilder('arc', {
    kind: 'arc',
    radius,
    startAngle,
    endAngle,
    counterclockwise: ccw,
    innerRadius,
  });
}
