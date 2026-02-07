import { ShapeBuilder, Vec2 } from './Shape';

export type TriangleDirection = 'up' | 'down' | 'left' | 'right';
export type RightAngleCorner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export function Triangle(
  width = 120,
  height = 100,
  options: { direction?: TriangleDirection; rightAngle?: RightAngleCorner } = {}
): ShapeBuilder {
  const w = width;
  const h = height;
  const dir = options.direction ?? 'up';
  const right = options.rightAngle;

  let points: Vec2[];
  if (right === 'topLeft') {
    points = [
      { x: -w / 2, y: -h / 2 },
      { x: w / 2, y: -h / 2 },
      { x: -w / 2, y: h / 2 },
    ];
  } else if (right === 'topRight') {
    points = [
      { x: -w / 2, y: -h / 2 },
      { x: w / 2, y: -h / 2 },
      { x: w / 2, y: h / 2 },
    ];
  } else if (right === 'bottomLeft') {
    points = [
      { x: -w / 2, y: -h / 2 },
      { x: w / 2, y: h / 2 },
      { x: -w / 2, y: h / 2 },
    ];
  } else if (right === 'bottomRight') {
    points = [
      { x: -w / 2, y: h / 2 },
      { x: w / 2, y: h / 2 },
      { x: w / 2, y: -h / 2 },
    ];
  } else if (dir === 'down') {
    points = [
      { x: -w / 2, y: -h / 2 },
      { x: w / 2, y: -h / 2 },
      { x: 0, y: h / 2 },
    ];
  } else if (dir === 'left') {
    points = [
      { x: w / 2, y: -h / 2 },
      { x: w / 2, y: h / 2 },
      { x: -w / 2, y: 0 },
    ];
  } else if (dir === 'right') {
    points = [
      { x: -w / 2, y: -h / 2 },
      { x: -w / 2, y: h / 2 },
      { x: w / 2, y: 0 },
    ];
  } else {
    points = [
      { x: -w / 2, y: h / 2 },
      { x: 0, y: -h / 2 },
      { x: w / 2, y: h / 2 },
    ];
  }

  return new ShapeBuilder('path', { kind: 'path', points, closed: true });
}
