import { SceneFn } from '../dsl/Scene';
import type { ShapeBuilder, Vec2 } from '../dsl/Shape';
import { ShapeInstance } from '../dsl/Shape';
import { Diagnostics } from '../core/Diagnostics';

type TimeRef = number | string;
type EaseSpec =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | { type: 'cubicBezier'; x1: number; y1: number; x2: number; y2: number };
type FillAnimSpec = {
  from: string;
  to: string;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  stagger?: number;
  keyframes?: { time: number; value: string }[];
};
type OpacityAnimSpec = {
  from: number;
  to: number;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  stagger?: number;
  keyframes?: { time: number; value: number }[];
};
type NumberAnimSpec = {
  from: number;
  to: number;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  keyframes?: { time: number; value: number }[];
};
type TrimAnimSpec = {
  from: number;
  to: number;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  steps?: number;
};
type GradientStop = { pos: number | NumberAnimSpec; color: FillAnimSpec | string };
type GradientSpec =
  | { type: 'linear'; from: { x: number; y: number }; to: { x: number; y: number }; stops: GradientStop[] }
  | { type: 'radial'; from: { x: number; y: number }; to: { x: number; y: number }; r0: number; r1: number; stops: GradientStop[] };

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scene: SceneFn;
  private imageCache = new Map<string, { img: HTMLImageElement; loaded: boolean; error: boolean }>();
  private pendingImages = false;

  constructor(canvas: HTMLCanvasElement, scene: SceneFn) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.canvas = canvas;
    this.ctx = ctx;
    this.scene = scene;
  }

  setScene(scene: SceneFn): void {
    this.scene = scene;
  }

  render(time: number): boolean {
    const dpr = window.devicePixelRatio || 1;
    const cssW = this.canvas.clientWidth;
    const cssH = this.canvas.clientHeight;
    if (cssW === 0 || cssH === 0) {
      this.pendingImages = true;
      return false;
    }
    const nextW = Math.floor(cssW * dpr);
    const nextH = Math.floor(cssH * dpr);
    if (this.canvas.width !== nextW || this.canvas.height !== nextH) {
      this.canvas.width = nextW;
      this.canvas.height = nextH;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const width = cssW;
    const height = cssH;
    if (width === 0 || height === 0) {
      this.pendingImages = true;
      return false;
    }
    this.ctx.clearRect(0, 0, width, height);
    this.pendingImages = false;
    let shapes: ShapeInstance[];
    try {
      shapes = this.flatten(this.scene(time), time);
    } catch (err) {
      const detail = err instanceof Error ? err.stack ?? err.message : String(err);
      const normalized = normalizeRuntimeError(err);
      const key = `runtime:${normalized.message}`;
      Diagnostics.addOnce(key, 'error', normalized.message, normalized.detail ?? detail);
      return false;
    }
    shapes.sort((a, b) => a.zIndex - b.zIndex);
    for (const shape of shapes) {
      this.draw(shape, width, height, time);
    }
    return !this.pendingImages;
  }

  private flatten(list: any[], time: number): ShapeInstance[] {
    const out: ShapeInstance[] = [];
    for (const item of list) {
      if (!item) continue;
      if (typeof item.evaluate === 'function') {
        out.push(...item.evaluate(time));
      } else {
        out.push(item);
      }
    }
    return out;
  }

  private draw(shape: ShapeInstance, width: number, height: number, time: number): void {
    const { x, y, scale, rotation, scaleX, scaleY, skewX, skewY } = shape.transform;
    this.ctx.save();
    this.ctx.globalAlpha = shape.opacity;
    let imageRecord: { img: HTMLImageElement; loaded: boolean; error: boolean } | null = null;
    let imageSize: { w: number; h: number } | null = null;
    if (shape.kind === 'image') {
      const src = shape.geom.src;
      if (!src) {
        this.ctx.restore();
        return;
      }
      const record = this.getImage(src);
      if (!record.loaded) {
        if (!record.error) this.pendingImages = true;
        this.ctx.restore();
        return;
      }
      const w = shape.geom.width ?? record.img.naturalWidth;
      const h = shape.geom.height ?? record.img.naturalHeight;
      if (w <= 0 || h <= 0) {
        this.ctx.restore();
        return;
      }
      imageRecord = record;
      imageSize = { w, h };
    }

    if (shape.kind === 'text' && shape.text) {
      this.ctx.font = shape.text.font;
      this.ctx.textAlign = shape.text.align;
      this.ctx.textBaseline = shape.text.baseline;
    }
    let anchorOffset = getAnchorOffset(this.ctx, shape);
    if (imageSize && shape.anchor && shape.anchor !== 'center') {
      anchorOffset = anchorOffsetForSize(shape.anchor, imageSize.w, imageSize.h);
    }
    this.ctx.translate(width / 2 + x + anchorOffset.x, height / 2 + y + anchorOffset.y);
    if (rotation) this.ctx.rotate(rotation);
    if (skewX || skewY) this.ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
    this.ctx.scale(scale * scaleX, scale * scaleY);
    if (shape.blendMode) this.ctx.globalCompositeOperation = shape.blendMode;
    if (shape.shadow) {
      this.ctx.shadowColor = shape.shadow.color;
      this.ctx.shadowBlur = shape.shadow.blur;
      this.ctx.shadowOffsetX = shape.shadow.offsetX;
      this.ctx.shadowOffsetY = shape.shadow.offsetY;
    }
    const fillStyle = shape.gradient
      ? evalGradient(this.ctx, shape.gradient as unknown as GradientSpec, time)
      : shape.fill;
    this.ctx.fillStyle = fillStyle;

    let clipActive = false;
    if (shape.clip && shape.clip.length > 0) {
      this.ctx.save();
      this.ctx.beginPath();
      let hasClipPath = false;
      for (const clipShape of shape.clip) {
        if (this.buildClipPath(clipShape, width, height, time)) hasClipPath = true;
      }
      if (hasClipPath) {
        this.ctx.clip();
        clipActive = true;
      } else {
        this.ctx.restore();
      }
    }

    if (shape.trim && shape.kind !== 'text' && shape.kind !== 'custom') {
      applyTrimClip(this.ctx, shape, time);
    }

    const strokeStyle =
      shape.stroke?.gradient
        ? evalGradient(this.ctx, shape.stroke.gradient as unknown as GradientSpec, time)
        : shape.stroke?.color;

    if (shape.kind === 'circle') {
      const r = shape.geom.radius ?? 0;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
      this.ctx.fill();
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
    } else if (shape.kind === 'rect') {
      const w = shape.geom.width ?? 0;
      const h = shape.geom.height ?? 0;
      this.ctx.beginPath();
      this.ctx.rect(-w / 2, -h / 2, w, h);
      this.ctx.fill();
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
    } else if (shape.kind === 'ellipse') {
      const rx = shape.geom.rx ?? 0;
      const ry = shape.geom.ry ?? 0;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      this.ctx.fill();
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
    } else if (shape.kind === 'roundRect') {
      const w = shape.geom.width ?? 0;
      const h = shape.geom.height ?? 0;
      const r = shape.geom.roundRadius ?? 0;
      this.ctx.beginPath();
      buildRoundRect(this.ctx, -w / 2, -h / 2, w, h, r);
      this.ctx.fill();
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
    } else if (shape.kind === 'ring') {
      const outer = shape.geom.outer ?? 0;
      const inner = shape.geom.inner ?? 0;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, outer, 0, Math.PI * 2, false);
      this.ctx.arc(0, 0, inner, 0, Math.PI * 2, true);
      this.ctx.fill('evenodd');
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
    } else if (shape.kind === 'arc') {
      const radius = shape.geom.radius ?? 0;
      const start = shape.geom.startAngle ?? 0;
      const end = shape.geom.endAngle ?? 0;
      const ccw = shape.geom.counterclockwise ?? false;
      const inner = shape.geom.innerRadius ?? 0;
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle && !shape.fillSet) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, start, end, ccw);
        strokeShape(this.ctx, shape, strokeStyle);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, start, end, ccw);
        if (inner > 0) {
          this.ctx.arc(0, 0, inner, end, start, !ccw);
        } else {
          this.ctx.lineTo(0, 0);
        }
        this.ctx.closePath();
        this.ctx.fill();
        if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
      }
    } else if (shape.kind === 'image') {
      if (!imageRecord || !imageSize) return;
      this.ctx.drawImage(imageRecord.img, -imageSize.w / 2, -imageSize.h / 2, imageSize.w, imageSize.h);
      if (shape.fillSet) {
        this.ctx.save();
        const mode = shape.fillMode ?? 'tint';
        if (mode === 'multiply') this.ctx.globalCompositeOperation = 'multiply';
        else if (mode === 'screen') this.ctx.globalCompositeOperation = 'screen';
        else this.ctx.globalCompositeOperation = 'source-atop';
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(-imageSize.w / 2, -imageSize.h / 2, imageSize.w, imageSize.h);
        this.ctx.restore();
      }
    } else if (shape.kind === 'path') {
      const points = shape.geom.points ?? [];
      if (points.length > 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        if (shape.geom.closed) this.ctx.closePath();
        this.ctx.fill();
        if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
      }
    } else if (shape.kind === 'bezier') {
      const commands = shape.geom.commands ?? [];
      if (commands.length > 0) {
        this.ctx.beginPath();
        buildBezierPath(this.ctx, commands);
        this.ctx.fill();
        if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
      }
    } else if (shape.kind === 'compound') {
      const paths = shape.geom.paths ?? [];
      if (paths.length > 0) {
        this.ctx.beginPath();
        for (const p of paths) {
          if (p.points.length === 0) continue;
          this.ctx.moveTo(p.points[0].x, p.points[0].y);
          for (let i = 1; i < p.points.length; i++) {
            this.ctx.lineTo(p.points[i].x, p.points[i].y);
          }
          if (p.closed) this.ctx.closePath();
        }
        this.ctx.fill();
        if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
      }
    } else if (shape.kind === 'pie') {
      const r = shape.geom.radius ?? 0;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, r, 0, Math.PI * 2, false);
      this.ctx.closePath();
      this.ctx.fill();
      if (shape.stroke && shape.stroke.width > 0 && strokeStyle) strokeShape(this.ctx, shape, strokeStyle);
    } else if (shape.kind === 'text' && shape.text) {
      const layout = layoutText(this.ctx, shape.text.value, shape.text, shape.text.wrap, shape.text.maxWidth);
      const split =
        (shape.text.fillSpec && (shape.text.fillSpec as any).split) ||
        (shape.text.opacitySpec && (shape.text.opacitySpec as any).split) ||
        'letter';
      if (shape.text.textPath) {
        drawTextOnPath(this.ctx, layout, shape.text.textPath, time, shape, split, strokeStyle);
      } else {
        drawTextLines(this.ctx, layout, shape, time, split, strokeStyle);
      }
      this.ctx.globalAlpha = shape.opacity;
    } else if (shape.kind === 'custom' && shape.draw) {
      shape.draw(this.ctx, time);
    }

    if (shape.trim && shape.kind !== 'text' && shape.kind !== 'custom') {
      this.ctx.restore();
    }
    if (clipActive) {
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  private buildClipPath(shape: ShapeInstance, width: number, height: number, time: number): boolean {
    const { x, y, scale, rotation, scaleX, scaleY, skewX, skewY } = shape.transform;
    this.ctx.save();
    if (shape.kind === 'text' && shape.text) {
      this.ctx.font = shape.text.font;
      this.ctx.textAlign = shape.text.align;
      this.ctx.textBaseline = shape.text.baseline;
    }
    const anchorOffset = getAnchorOffset(this.ctx, shape);
    // Clip shapes are evaluated in local space of the parent, so no scene-center translate here.
    this.ctx.translate(x + anchorOffset.x, y + anchorOffset.y);
    if (rotation) this.ctx.rotate(rotation);
    if (skewX || skewY) this.ctx.transform(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);
    this.ctx.scale(scale * scaleX, scale * scaleY);

    let drew = false;
    if (shape.kind === 'circle') {
      const r = shape.geom.radius ?? 0;
      if (r > 0) drew = true;
      this.ctx.moveTo(r, 0);
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
    } else if (shape.kind === 'rect') {
      const w = shape.geom.width ?? 0;
      const h = shape.geom.height ?? 0;
      if (w > 0 && h > 0) drew = true;
      this.ctx.rect(-w / 2, -h / 2, w, h);
    } else if (shape.kind === 'ellipse') {
      const rx = shape.geom.rx ?? 0;
      const ry = shape.geom.ry ?? 0;
      if (rx > 0 && ry > 0) drew = true;
      this.ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    } else if (shape.kind === 'roundRect') {
      const w = shape.geom.width ?? 0;
      const h = shape.geom.height ?? 0;
      const r = shape.geom.roundRadius ?? 0;
      if (w > 0 && h > 0) drew = true;
      buildRoundRect(this.ctx, -w / 2, -h / 2, w, h, r);
    } else if (shape.kind === 'ring') {
      const outer = shape.geom.outer ?? 0;
      const inner = shape.geom.inner ?? 0;
      if (outer > 0) drew = true;
      this.ctx.arc(0, 0, outer, 0, Math.PI * 2, false);
      this.ctx.arc(0, 0, inner, 0, Math.PI * 2, true);
    } else if (shape.kind === 'arc') {
      const radius = shape.geom.radius ?? 0;
      const start = shape.geom.startAngle ?? 0;
      const end = shape.geom.endAngle ?? 0;
      const ccw = shape.geom.counterclockwise ?? false;
      const inner = shape.geom.innerRadius ?? 0;
      if (radius > 0) drew = true;
      this.ctx.arc(0, 0, radius, start, end, ccw);
      if (inner > 0) {
        this.ctx.arc(0, 0, inner, end, start, !ccw);
      } else {
        this.ctx.lineTo(0, 0);
      }
      this.ctx.closePath();
    } else if (shape.kind === 'image') {
      let w = shape.geom.width ?? 0;
      let h = shape.geom.height ?? 0;
      if ((w <= 0 || h <= 0) && shape.geom.src) {
        const record = this.getImage(shape.geom.src);
        if (!record.loaded) {
          if (!record.error) this.pendingImages = true;
        } else {
          w = w > 0 ? w : record.img.naturalWidth;
          h = h > 0 ? h : record.img.naturalHeight;
        }
      }
      if (w > 0 && h > 0) drew = true;
      this.ctx.rect(-w / 2, -h / 2, w, h);
    } else if (shape.kind === 'path') {
      const points = shape.geom.points ?? [];
      if (points.length > 0) {
        drew = true;
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        if (shape.geom.closed) this.ctx.closePath();
      }
    } else if (shape.kind === 'bezier') {
      const commands = shape.geom.commands ?? [];
      if (commands.length > 0) {
        drew = true;
        buildBezierPath(this.ctx, commands);
      }
    } else if (shape.kind === 'compound') {
      const paths = shape.geom.paths ?? [];
      for (const p of paths) {
        if (p.points.length === 0) continue;
        drew = true;
        this.ctx.moveTo(p.points[0].x, p.points[0].y);
        for (let i = 1; i < p.points.length; i++) {
          this.ctx.lineTo(p.points[i].x, p.points[i].y);
        }
        if (p.closed) this.ctx.closePath();
      }
    } else if (shape.kind === 'pie') {
      const r = shape.geom.radius ?? 0;
      if (r > 0) drew = true;
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, r, 0, Math.PI * 2, false);
      this.ctx.closePath();
    } else if (shape.kind === 'text' && shape.text) {
      const layout = layoutText(this.ctx, shape.text.value, shape.text, shape.text.wrap, shape.text.maxWidth);
      if (layout.width > 0 && layout.height > 0) drew = true;
      this.ctx.rect(-layout.width / 2, -layout.height / 2, layout.width, layout.height);
    }

    this.ctx.restore();
    return drew;
  }

  private getImage(src: string): { img: HTMLImageElement; loaded: boolean; error: boolean } {
    const cached = this.imageCache.get(src);
    if (cached) return cached;
    const img = new Image();
    const record = { img, loaded: false, error: false };
    img.onload = () => {
      record.loaded = true;
    };
    img.onerror = () => {
      record.error = true;
    };
    img.src = src;
    this.imageCache.set(src, record);
    return record;
  }
}

function evalFill(spec: FillAnimSpec, time: number, index: number): string {
  const start = resolveStart(spec.start, 0);
  if ((spec as any).keyframes && (spec as any).keyframes.length > 0) {
    return keyframeColor(time, (spec as any).keyframes, spec as any, start, index, spec.stagger);
  }
  const t = phase(time, durationOf(spec), spec.loop, start, spec.delay, spec.repeatDelay, spec.ease, spec.stagger, index);
  return lerpColor(spec.from, spec.to, t);
}

function evalOpacity(spec: OpacityAnimSpec, time: number, index: number): number {
  const start = resolveStart(spec.start, 0);
  if ((spec as any).keyframes && (spec as any).keyframes.length > 0) {
    return keyframeNumber(time, (spec as any).keyframes, spec as any, start, index, spec.stagger);
  }
  const t = phase(time, durationOf(spec), spec.loop, start, spec.delay, spec.repeatDelay, spec.ease, spec.stagger, index);
  return lerp(spec.from, spec.to, t);
}

function evalTrim(spec: TrimAnimSpec, time: number): number {
  let t = phase(time, durationOf(spec), spec.loop, resolveStart(spec.start, 0), spec.delay, spec.repeatDelay, spec.ease, 0, 0);
  if (spec.steps && spec.steps > 1) {
    const steps = spec.steps;
    const buckets = steps + 1;
    const index = Math.floor(t * buckets);
    const clamped = index > steps ? steps : index;
    t = steps === 0 ? 1 : (steps - clamped) / steps;
  }
  return lerp(spec.from, spec.to, t);
}

function applyTrimClip(ctx: CanvasRenderingContext2D, shape: ShapeInstance, time: number): void {
  const trim = shape.trim;
  if (!trim) return;
  const fraction = evalTrim(trim, time);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle - Math.PI * 2 * fraction; // clockwise by default
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 2000, startAngle, endAngle, false);
  ctx.closePath();
  ctx.clip();
}

function phase(
  time: number,
  duration: number,
  loop = false,
  start = 0,
  delay = 0,
  repeatDelay = 0,
  ease?: EaseSpec,
  stagger = 0,
  index = 0
): number {
  if (duration <= 0) return 1;
  const local = time - start - delay - index * stagger;
  if (local <= 0) return 0;
  if (loop) {
    const cycle = duration + repeatDelay;
    const inCycle = cycle > 0 ? local % cycle : local;
    if (inCycle > duration) return 1;
    return applyEase(inCycle / duration, ease);
  }
  const t = local / duration;
  return applyEase(t > 1 ? 1 : t, ease);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number): string {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return a;
  const r = Math.round(lerp(ca.r, cb.r, t));
  const g = Math.round(lerp(ca.g, cb.g, t));
  const bl = Math.round(lerp(ca.b, cb.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}

function durationOf(spec: { duration?: number; keyframes?: { time: number }[] }): number {
  if (spec.keyframes && spec.keyframes.length > 0) {
    const last = spec.keyframes[spec.keyframes.length - 1];
    return spec.duration ?? last.time;
  }
  return spec.duration ?? 0;
}

function resolveStart(start: TimeRef | undefined, prevEnd: number): number {
  if (typeof start === 'number' || start === undefined) return start ?? 0;
  const s = start.replace(/\s+/g, '');
  if (s.startsWith('scene')) {
    return parseOffset(0, s.slice('scene'.length));
  }
  if (s.startsWith('prev.end')) {
    return parseOffset(prevEnd, s.slice('prev.end'.length));
  }
  return 0;
}

function parseOffset(base: number, offset: string): number {
  if (!offset) return base;
  const m = offset.match(/^([+-]\d+(\.\d+)?)$/);
  if (!m) return base;
  return base + Number(m[1]);
}

function applyEase(t: number, ease?: EaseSpec): number {
  if (!ease || ease === 'linear') return t;
  if (ease === 'easeIn') return t * t;
  if (ease === 'easeOut') return 1 - (1 - t) * (1 - t);
  if (ease === 'easeInOut') return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return cubicBezier(ease.x1, ease.y1, ease.x2, ease.y2, t);
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number, t: number): number {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return uuu * 0 + 3 * uu * t * y1 + 3 * u * tt * y2 + ttt * 1;
}

function keyframeNumber(
  time: number,
  keyframes: { time: number; value: number }[],
  spec: { loop?: boolean; delay?: number; repeatDelay?: number; ease?: EaseSpec; duration?: number },
  start: number,
  index = 0,
  stagger = 0
): number {
  const local = localTimeForKeyframes(time, spec, start, index, stagger);
  if (keyframes.length === 1) return keyframes[0].value;
  const { a, b, t } = segmentForKeyframes(local, keyframes);
  return lerp(a.value, b.value, applyEase(t, spec.ease));
}

function keyframeColor(
  time: number,
  keyframes: { time: number; value: string }[],
  spec: { loop?: boolean; delay?: number; repeatDelay?: number; ease?: EaseSpec; duration?: number },
  start: number,
  index = 0,
  stagger = 0
): string {
  const local = localTimeForKeyframes(time, spec, start, index, stagger);
  if (keyframes.length === 1) return keyframes[0].value;
  const { a, b, t } = segmentForKeyframes(local, keyframes);
  return lerpColor(a.value, b.value, applyEase(t, spec.ease));
}

function localTimeForKeyframes(
  time: number,
  spec: { loop?: boolean; delay?: number; repeatDelay?: number; duration?: number; keyframes?: { time: number }[] },
  start: number,
  index = 0,
  stagger = 0
): number {
  const delay = spec.delay ?? 0;
  let local = time - start - delay - index * stagger;
  if (local <= 0) return 0;
  const duration = durationOf(spec);
  if (spec.loop) {
    const cycle = duration + (spec.repeatDelay ?? 0);
    local = cycle > 0 ? local % cycle : local;
    if (local > duration) return duration;
  }
  return local > duration ? duration : local;
}

function segmentForKeyframes<T extends { time: number }>(
  local: number,
  keyframes: T[]
): { a: T; b: T; t: number } {
  if (local <= keyframes[0].time) return { a: keyframes[0], b: keyframes[0], t: 0 };
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (local <= b.time) {
      const span = b.time - a.time;
      const t = span <= 0 ? 1 : (local - a.time) / span;
      return { a, b, t };
    }
  }
  const last = keyframes[keyframes.length - 1];
  return { a: last, b: last, t: 1 };
}

function parseColor(input: string): { r: number; g: number; b: number } | null {
  const s = input.trim().toLowerCase();
  const named: Record<string, [number, number, number]> = {
    red: [255, 0, 0],
    blue: [0, 0, 255],
    green: [0, 128, 0],
    black: [0, 0, 0],
    white: [255, 255, 255],
    yellow: [255, 255, 0],
    cyan: [0, 255, 255],
    magenta: [255, 0, 255],
    gray: [128, 128, 128],
  };
  if (named[s]) {
    const [r, g, b] = named[s];
    return { r, g, b };
  }
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
  }
  const m = s.match(/rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)/);
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
  }
  return null;
}

function evalNumber(spec: number | NumberAnimSpec, time: number): number {
  if (typeof spec === 'number') return spec;
  const start = resolveStart(spec.start, 0);
  if (spec.keyframes && spec.keyframes.length > 0) {
    return keyframeNumber(time, spec.keyframes, spec, start, 0, 0);
  }
  const t = phase(time, durationOf(spec), spec.loop, start, spec.delay, spec.repeatDelay, spec.ease, 0, 0);
  return lerp(spec.from, spec.to, t);
}

function evalGradient(ctx: CanvasRenderingContext2D, spec: GradientSpec, time: number): CanvasGradient {
  const gradient =
    spec.type === 'linear'
      ? ctx.createLinearGradient(spec.from.x, spec.from.y, spec.to.x, spec.to.y)
      : ctx.createRadialGradient(spec.from.x, spec.from.y, spec.r0, spec.to.x, spec.to.y, spec.r1);
  for (const stop of spec.stops) {
    const pos = evalNumber(stop.pos, time);
    const color =
      typeof stop.color === 'string'
        ? stop.color
        : stop.color.keyframes && stop.color.keyframes.length > 0
          ? keyframeColor(time, stop.color.keyframes, stop.color, resolveStart(stop.color.start, 0), 0, 0)
          : lerpColor(
              stop.color.from,
              stop.color.to,
              phase(
                time,
                durationOf(stop.color),
                stop.color.loop,
                resolveStart(stop.color.start, 0),
                stop.color.delay,
                stop.color.repeatDelay,
                stop.color.ease,
                0,
                0
              )
            );
    gradient.addColorStop(pos, color);
  }
  return gradient;
}

function strokeShape(ctx: CanvasRenderingContext2D, shape: ShapeInstance, strokeStyle: string | CanvasGradient): void {
  if (!shape.stroke) return;
  ctx.save();
  ctx.lineWidth = shape.stroke.width;
  if (shape.stroke.cap) ctx.lineCap = shape.stroke.cap;
  if (shape.stroke.join) ctx.lineJoin = shape.stroke.join;
  if (shape.stroke.dash) ctx.setLineDash(shape.stroke.dash);
  if (shape.stroke.dashOffset !== undefined) ctx.lineDashOffset = shape.stroke.dashOffset;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
  ctx.restore();
}

function strokeText(ctx: CanvasRenderingContext2D, shape: ShapeInstance, strokeStyle: string | CanvasGradient): void {
  if (!shape.stroke || !shape.text) return;
  ctx.save();
  applyStrokeStyle(ctx, shape, strokeStyle);
  ctx.strokeText(shape.text.value, 0, 0);
  ctx.restore();
}

function applyStrokeStyle(
  ctx: CanvasRenderingContext2D,
  shape: ShapeInstance,
  strokeStyle: string | CanvasGradient
): void {
  if (!shape.stroke) return;
  ctx.lineWidth = shape.stroke.width;
  if (shape.stroke.cap) ctx.lineCap = shape.stroke.cap;
  if (shape.stroke.join) ctx.lineJoin = shape.stroke.join;
  if (shape.stroke.dash) ctx.setLineDash(shape.stroke.dash);
  if (shape.stroke.dashOffset !== undefined) ctx.lineDashOffset = shape.stroke.dashOffset;
  ctx.strokeStyle = strokeStyle;
}

function getAnchorOffset(ctx: CanvasRenderingContext2D, shape: ShapeInstance): { x: number; y: number } {
  if (!shape.anchor || shape.anchor === 'center') return { x: 0, y: 0 };
  if (shape.kind === 'circle') {
    const r = shape.geom.radius ?? 0;
    return anchorOffset(shape.anchor, r * 2, r * 2);
  }
  if (shape.kind === 'rect') {
    const w = shape.geom.width ?? 0;
    const h = shape.geom.height ?? 0;
    return anchorOffset(shape.anchor, w, h);
  }
  if (shape.kind === 'ellipse') {
    const rx = shape.geom.rx ?? 0;
    const ry = shape.geom.ry ?? 0;
    return anchorOffset(shape.anchor, rx * 2, ry * 2);
  }
  if (shape.kind === 'roundRect') {
    const w = shape.geom.width ?? 0;
    const h = shape.geom.height ?? 0;
    return anchorOffset(shape.anchor, w, h);
  }
  if (shape.kind === 'ring' || shape.kind === 'arc') {
    const r = shape.geom.outer ?? shape.geom.radius ?? 0;
    return anchorOffset(shape.anchor, r * 2, r * 2);
  }
  if (shape.kind === 'image') {
    const w = shape.geom.width ?? 0;
    const h = shape.geom.height ?? 0;
    return anchorOffset(shape.anchor, w, h);
  }
  if (shape.kind === 'path' && shape.geom.points) {
    const bbox = pathBounds(shape.geom.points);
    return anchorOffset(shape.anchor, bbox.w, bbox.h);
  }
  if (shape.kind === 'bezier' && shape.geom.commands) {
    const bbox = bezierBounds(shape.geom.commands);
    return anchorOffset(shape.anchor, bbox.w, bbox.h);
  }
  if (shape.kind === 'compound' && shape.geom.paths) {
    const points: { x: number; y: number }[] = [];
    for (const p of shape.geom.paths) points.push(...p.points);
    if (points.length > 0) {
      const bbox = pathBounds(points);
      return anchorOffset(shape.anchor, bbox.w, bbox.h);
    }
  }
  if (shape.kind === 'text' && shape.text) {
    const layout = layoutText(ctx, shape.text.value, shape.text, shape.text.wrap, shape.text.maxWidth);
    return anchorOffsetForSize(shape.anchor, layout.width, layout.height);
  }
  return { x: 0, y: 0 };
}

function anchorOffset(anchor: NonNullable<ShapeInstance['anchor']>, w: number, h: number): { x: number; y: number } {
  return anchorOffsetForSize(anchor, w, h);
}

function anchorOffsetForSize(anchor: NonNullable<ShapeInstance['anchor']>, w: number, h: number): { x: number; y: number } {
  const halfW = w / 2;
  const halfH = h / 2;
  switch (anchor) {
    case 'top':
      return { x: 0, y: halfH };
    case 'bottom':
      return { x: 0, y: -halfH };
    case 'left':
      return { x: halfW, y: 0 };
    case 'right':
      return { x: -halfW, y: 0 };
    case 'topLeft':
      return { x: halfW, y: halfH };
    case 'topRight':
      return { x: -halfW, y: halfH };
    case 'bottomLeft':
      return { x: halfW, y: -halfH };
    case 'bottomRight':
      return { x: -halfW, y: -halfH };
    default:
      return { x: 0, y: 0 };
  }
}

function pathBounds(points: { x: number; y: number }[]): { w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { w: maxX - minX, h: maxY - minY };
}

function bezierBounds(commands: { cmd: string }[]): { w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let x = 0;
  let y = 0;
  const sample = (px: number, py: number) => {
    if (px < minX) minX = px;
    if (py < minY) minY = py;
    if (px > maxX) maxX = px;
    if (py > maxY) maxY = py;
  };
  sample(x, y);
  for (const c of commands as any[]) {
    if (c.cmd === 'moveTo') {
      x = c.x;
      y = c.y;
      sample(x, y);
    } else if (c.cmd === 'lineTo') {
      x = c.x;
      y = c.y;
      sample(x, y);
    } else if (c.cmd === 'quadTo') {
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const inv = 1 - t;
        const px = inv * inv * x + 2 * inv * t * c.cpx + t * t * c.x;
        const py = inv * inv * y + 2 * inv * t * c.cpy + t * t * c.y;
        sample(px, py);
      }
      x = c.x;
      y = c.y;
    } else if (c.cmd === 'cubicTo') {
      const steps = 30;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const inv = 1 - t;
        const px =
          inv * inv * inv * x +
          3 * inv * inv * t * c.cp1x +
          3 * inv * t * t * c.cp2x +
          t * t * t * c.x;
        const py =
          inv * inv * inv * y +
          3 * inv * inv * t * c.cp1y +
          3 * inv * t * t * c.cp2y +
          t * t * t * c.y;
        sample(px, py);
      }
      x = c.x;
      y = c.y;
    }
  }
  if (minX === Infinity) return { w: 0, h: 0 };
  return { w: maxX - minX, h: maxY - minY };
}

function buildBezierPath(ctx: CanvasRenderingContext2D, commands: { cmd: string }[]): void {
  for (const c of commands as any[]) {
    if (c.cmd === 'moveTo') ctx.moveTo(c.x, c.y);
    else if (c.cmd === 'lineTo') ctx.lineTo(c.x, c.y);
    else if (c.cmd === 'quadTo') ctx.quadraticCurveTo(c.cpx, c.cpy, c.x, c.y);
    else if (c.cmd === 'cubicTo') ctx.bezierCurveTo(c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y);
    else if (c.cmd === 'close') ctx.closePath();
  }
}

function parseFontSize(font: string): number {
  const m = font.match(/(\\d+(?:\\.\\d+)?)px/);
  if (!m) return 0;
  return Number(m[1]);
}

type TextLayoutGlyph = {
  ch: string;
  x: number;
  y: number;
  width: number;
  index: number;
  wordIndex: number;
  lineIndex: number;
};

type TextLayout = {
  glyphs: TextLayoutGlyph[];
  width: number;
  height: number;
  lineHeight: number;
  lines: number;
};

function layoutText(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: { letterSpacing: number; align: CanvasTextAlign; baseline: CanvasTextBaseline; lineHeight: number },
  wrap: boolean,
  maxWidth?: number
): TextLayout {
  const rawLines = text.split('\\n');
  const lines: string[] = [];
  for (const raw of rawLines) {
    if (!wrap || !maxWidth) {
      lines.push(raw);
      continue;
    }
    const words = raw.split(' ');
    let current = '';
    for (const word of words) {
      const test = current.length === 0 ? word : `${current} ${word}`;
      const width = measureTextWidth(ctx, test, options.letterSpacing);
      if (width <= maxWidth || current.length === 0) {
        current = test;
      } else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }

  const lineHeight = options.lineHeight;
  const blockHeight = lines.length * lineHeight;
  const yStart =
    options.baseline === 'top'
      ? 0
      : options.baseline === 'bottom'
        ? -blockHeight + lineHeight
        : -blockHeight / 2 + lineHeight / 2;

  const glyphs: TextLayoutGlyph[] = [];
  let globalIndex = 0;
  let maxLineWidth = 0;
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const lineWidth = measureTextWidth(ctx, line, options.letterSpacing);
    if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
    const baseX =
      options.align === 'left' || options.align === 'start'
        ? 0
        : options.align === 'right' || options.align === 'end'
          ? -lineWidth
          : -lineWidth / 2;
    const y = yStart + li * lineHeight;
    let xCursor = baseX;
    let wordIndex = -1;
    let inWord = false;
    for (const ch of Array.from(line)) {
      const isSpace = ch === ' ';
      if (!isSpace && !inWord) {
        inWord = true;
        wordIndex += 1;
      } else if (isSpace) {
        inWord = false;
      }
      const w = ctx.measureText(ch).width;
      glyphs.push({
        ch,
        x: xCursor + w / 2,
        y,
        width: w,
        index: globalIndex++,
        wordIndex: Math.max(0, wordIndex),
        lineIndex: li,
      });
      xCursor += w + options.letterSpacing;
    }
  }

  return { glyphs, width: maxLineWidth, height: blockHeight, lineHeight, lines: lines.length };
}

function measureTextWidth(ctx: CanvasRenderingContext2D, text: string, letterSpacing: number): number {
  const letters = Array.from(text);
  if (letters.length === 0) return 0;
  const widths = letters.map((ch) => ctx.measureText(ch).width);
  return widths.reduce((acc, w) => acc + w, 0) + letterSpacing * (letters.length - 1);
}

function drawTextLines(
  ctx: CanvasRenderingContext2D,
  layout: TextLayout,
  shape: ShapeInstance,
  time: number,
  split: 'letter' | 'word' | 'line',
  strokeStyle?: string | CanvasGradient
): void {
  for (const g of layout.glyphs) {
    const unitIndex = split === 'line' ? g.lineIndex : split === 'word' ? g.wordIndex : g.index;
    const fill = shape.text?.fillSpec ? evalFill(shape.text.fillSpec as any, time, unitIndex) : shape.fill;
    const opacity = shape.text?.opacitySpec ? evalOpacity(shape.text.opacitySpec as any, time, unitIndex) : 1;
    ctx.globalAlpha = shape.opacity * opacity;
    ctx.fillStyle = fill;
    ctx.fillText(g.ch, g.x, g.y);
    if (shape.stroke && shape.stroke.width > 0 && strokeStyle) {
      applyStrokeStyle(ctx, shape, strokeStyle);
      ctx.strokeText(g.ch, g.x, g.y);
    }
  }
}

function drawTextOnPath(
  ctx: CanvasRenderingContext2D,
  layout: TextLayout,
  spec: { path: any; align?: 'start' | 'center' | 'end'; offset?: number },
  time: number,
  shape: ShapeInstance,
  split: 'letter' | 'word' | 'line',
  strokeStyle?: string | CanvasGradient
): void {
  const resolved = resolveTextPath(spec.path, time);
  if (!resolved || resolved.points.length < 2) return;
  const path = buildPathData(resolved.points, resolved.closed);
  const spacing = shape.text?.letterSpacing ?? 0;
  const totalTextWidth = layout.glyphs.reduce((acc, g, i) => acc + g.width + (i > 0 ? spacing : 0), 0);
  const align = spec.align ?? 'start';
  const baseOffset =
    align === 'center'
      ? (path.length - totalTextWidth) / 2
      : align === 'end'
        ? path.length - totalTextWidth
        : 0;
  let advance = spec.offset ?? 0;
  for (const g of layout.glyphs) {
    const unitIndex = split === 'line' ? g.lineIndex : split === 'word' ? g.wordIndex : g.index;
    const fill = shape.text?.fillSpec ? evalFill(shape.text.fillSpec as any, time, unitIndex) : shape.fill;
    const opacity = shape.text?.opacitySpec ? evalOpacity(shape.text.opacitySpec as any, time, unitIndex) : 1;
    const dist = baseOffset + advance + g.width / 2;
    const sample = samplePathAtDistance(path, dist);
    ctx.save();
    ctx.translate(sample.point.x, sample.point.y);
    ctx.rotate(sample.angle);
    ctx.globalAlpha = shape.opacity * opacity;
    ctx.fillStyle = fill;
    ctx.fillText(g.ch, 0, 0);
    if (shape.stroke && shape.stroke.width > 0 && strokeStyle) {
      applyStrokeStyle(ctx, shape, strokeStyle);
      ctx.strokeText(g.ch, 0, 0);
    }
    ctx.restore();
    advance += g.width + spacing;
  }
}

function resolveTextPath(
  input: Vec2[] | { points: Vec2[]; closed?: boolean } | ShapeBuilder,
  time: number
): { points: Vec2[]; closed: boolean } | null {
  if (Array.isArray(input)) return { points: input, closed: false };
  if ((input as any).points) {
    const obj = input as { points: Vec2[]; closed?: boolean };
    return { points: obj.points, closed: obj.closed ?? false };
  }
  if (input && typeof (input as any).evaluate === 'function') {
    const shapes = (input as any).evaluate(time) as ShapeInstance[];
    const first = shapes.find((s) => s.kind === 'path' || s.kind === 'bezier' || s.kind === 'compound');
    if (first?.kind === 'path' && first.geom.points) {
      return { points: first.geom.points, closed: Boolean(first.geom.closed) };
    }
    if (first?.kind === 'bezier' && first.geom.commands) {
      const points = bezierToPoints(first.geom.commands as any);
      return { points, closed: false };
    }
    if (first?.kind === 'compound' && first.geom.paths && first.geom.paths.length > 0) {
      const pts: Vec2[] = [];
      for (const p of first.geom.paths) pts.push(...p.points);
      return { points: pts, closed: false };
    }
  }
  return null;
}

type PathData = { points: Vec2[]; lengths: number[]; length: number };

function buildPathData(points: Vec2[], closed: boolean): PathData {
  const pts = closed ? [...points, points[0]] : points.slice();
  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    lengths.push(len);
    total += len;
  }
  return { points: pts, lengths, length: total };
}

function samplePathAtDistance(path: PathData, dist: number): { point: Vec2; angle: number } {
  const clamped = Math.max(0, Math.min(path.length, dist));
  let acc = 0;
  let seg = 0;
  while (seg < path.lengths.length && acc + path.lengths[seg] < clamped) {
    acc += path.lengths[seg];
    seg++;
  }
  const segLen = path.lengths[seg] || 1;
  const t = (clamped - acc) / segLen;
  const a = path.points[seg];
  const b = path.points[seg + 1] ?? path.points[seg];
  return {
    point: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t },
    angle: Math.atan2(b.y - a.y, b.x - a.x),
  };
}

function bezierToPoints(commands: { cmd: string }[]): Vec2[] {
  const points: Vec2[] = [];
  let x = 0;
  let y = 0;
  const push = (px: number, py: number) => points.push({ x: px, y: py });
  for (const c of commands as any[]) {
    if (c.cmd === 'moveTo') {
      x = c.x;
      y = c.y;
      push(x, y);
    } else if (c.cmd === 'lineTo') {
      x = c.x;
      y = c.y;
      push(x, y);
    } else if (c.cmd === 'quadTo') {
      const steps = 20;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const inv = 1 - t;
        const px = inv * inv * x + 2 * inv * t * c.cpx + t * t * c.x;
        const py = inv * inv * y + 2 * inv * t * c.cpy + t * t * c.y;
        push(px, py);
      }
      x = c.x;
      y = c.y;
    } else if (c.cmd === 'cubicTo') {
      const steps = 30;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const inv = 1 - t;
        const px =
          inv * inv * inv * x +
          3 * inv * inv * t * c.cp1x +
          3 * inv * t * t * c.cp2x +
          t * t * t * c.x;
        const py =
          inv * inv * inv * y +
          3 * inv * inv * t * c.cp1y +
          3 * inv * t * t * c.cp2y +
          t * t * t * c.y;
        push(px, py);
      }
      x = c.x;
      y = c.y;
    } else if (c.cmd === 'close') {
      if (points.length > 0) push(points[0].x, points[0].y);
    }
  }
  return points;
}

function buildRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | { tl: number; tr: number; br: number; bl: number }
): void {
  const r =
    typeof radius === 'number'
      ? { tl: radius, tr: radius, br: radius, bl: radius }
      : { tl: radius.tl, tr: radius.tr, br: radius.br, bl: radius.bl };
  const max = Math.min(w, h) / 2;
  const tl = Math.min(Math.max(0, r.tl), max);
  const tr = Math.min(Math.max(0, r.tr), max);
  const br = Math.min(Math.max(0, r.br), max);
  const bl = Math.min(Math.max(0, r.bl), max);

  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function normalizeRuntimeError(err: unknown): { message: string; detail?: string } {
  if (err instanceof ReferenceError) {
    const msg = err.message || '';
    if (msg.includes('is not defined')) {
      return {
        message: 'Undefined identifier in DSL. Did you forget quotes around a string?',
        detail: err.stack ?? err.message,
      };
    }
  }
  if (err instanceof SyntaxError) {
    return { message: 'Syntax error in DSL', detail: err.stack ?? err.message };
  }
  if (err instanceof Error) {
    return { message: 'Runtime error', detail: err.stack ?? err.message };
  }
  return { message: 'Runtime error', detail: String(err) };
}
