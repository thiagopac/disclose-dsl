import { Diagnostics } from '../core/Diagnostics';
import { ShapeBuilder } from './Shape';

export type TextOptions = {
  font?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  lineHeight?: number;
  maxWidth?: number;
  wrap?: boolean;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  letterSpacing?: number;
};

export function Text(text: string, options: TextOptions = {}): ShapeBuilder {
  if (typeof text !== 'string') {
    Diagnostics.addOnce('text-arg:type', 'error', 'Text() expects a string');
    return new ShapeBuilder('text', { kind: 'text', text: String(text), options });
  }
  return new ShapeBuilder('text', { kind: 'text', text, options });
}
