import { ShapeBuilder } from './Shape';

export function Image(
  src: string,
  width?: number,
  height?: number
): ShapeBuilder {
  return new ShapeBuilder('image', { kind: 'image', src, width, height });
}
