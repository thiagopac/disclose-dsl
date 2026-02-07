import { ShapeBuilder } from './Shape';

export type CustomDraw = (ctx: CanvasRenderingContext2D, time: number) => void;

export function Custom(draw: CustomDraw): ShapeBuilder {
  return new ShapeBuilder('custom', { kind: 'custom', draw });
}
