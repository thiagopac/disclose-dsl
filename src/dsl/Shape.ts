import { Diagnostics } from '../core/Diagnostics';

export type Vec2 = { x: number; y: number };
export type TimeRef = number | string;

export type EaseSpec =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | { type: 'cubicBezier'; x1: number; y1: number; x2: number; y2: number };

export type MoveSpec = {
  x?: [number, number];
  y?: [number, number];
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  keyframes?: { time: number; x?: number; y?: number }[];
};

export type CurveSpec = {
  from: Vec2;
  control: Vec2;
  to: Vec2;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
};

export type PositionSpec = {
  x: number;
  y: number;
};

export type TextPathSpec = {
  path: Vec2[] | { points: Vec2[]; closed?: boolean } | ShapeBuilder;
  align?: 'start' | 'center' | 'end';
  offset?: number;
};

export type PathMotionSpec = {
  path: Vec2[] | { points: Vec2[]; closed?: boolean } | ShapeBuilder;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
};

export type OrientToPathSpec = {
  path?: Vec2[] | { points: Vec2[]; closed?: boolean } | ShapeBuilder;
  duration?: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  offset?: number;
};

export type VelocitySpec = {
  x?: number;
  y?: number;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
};

export type AccelerationSpec = VelocitySpec;

export type SpringSpec = {
  x?: [number, number];
  y?: [number, number];
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
};

export type ScaleSpec = {
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

export type ScaleAxisSpec = ScaleSpec;

export type NumberAnimSpec = {
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

export type RotateSpec = {
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

export type SkewSpec = RotateSpec;

export type FlipSpec = {
  from: number;
  to: number;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  keyframes?: { time: number; value: number }[];
  axis?: 'x' | 'y';
};

export type OpacitySpec =
  | number
  | {
      from: number;
      to: number;
      duration: number;
      loop?: boolean;
      start?: TimeRef;
      delay?: number;
      repeatDelay?: number;
      ease?: EaseSpec;
      stagger?: number;
      split?: 'letter' | 'word' | 'line';
      keyframes?: { time: number; value: number }[];
    };

export type FillSpec =
  | string
  | {
      from: string;
      to: string;
      duration: number;
      loop?: boolean;
      start?: TimeRef;
      delay?: number;
      repeatDelay?: number;
      ease?: EaseSpec;
      stagger?: number;
      split?: 'letter' | 'word' | 'line';
      keyframes?: { time: number; value: string }[];
    };

export type StrokeSpec = {
  color?: FillSpec;
  gradient?: GradientSpec;
  width?: number | NumberAnimSpec;
  cap?: CanvasLineCap;
  join?: CanvasLineJoin;
  dash?: number[];
  dashOffset?: number | NumberAnimSpec;
};

export type GradientStop = {
  pos: number | NumberAnimSpec;
  color: FillSpec;
};

export type GradientSpec =
  | {
      type: 'linear';
      from: Vec2;
      to: Vec2;
      stops: GradientStop[];
    }
  | {
      type: 'radial';
      from: Vec2;
      to: Vec2;
      r0: number;
      r1: number;
      stops: GradientStop[];
    };

export type BlendMode = GlobalCompositeOperation;

export type FillMode = 'tint' | 'multiply' | 'screen';

export type ShadowSpec = {
  color?: FillSpec;
  blur?: number | NumberAnimSpec;
  offsetX?: number | NumberAnimSpec;
  offsetY?: number | NumberAnimSpec;
};

export type MorphSpec = {
  from: any;
  to: any;
  duration: number;
  loop?: boolean;
  start?: TimeRef;
  delay?: number;
  repeatDelay?: number;
  ease?: EaseSpec;
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
};

export type ClipSpec = ShapeBuilder | ShapeBuilder[];

export type Modifier =
  | { type: 'at'; spec: PositionSpec }
  | { type: 'move'; spec: MoveSpec }
  | { type: 'curve'; spec: CurveSpec }
  | { type: 'pathMotion'; spec: PathMotionSpec }
  | { type: 'orientToPath'; spec: OrientToPathSpec }
  | { type: 'velocity'; spec: VelocitySpec }
  | { type: 'acceleration'; spec: AccelerationSpec }
  | { type: 'spring'; spec: SpringSpec }
  | { type: 'scale'; spec: ScaleSpec }
  | { type: 'scaleX'; spec: ScaleAxisSpec }
  | { type: 'scaleY'; spec: ScaleAxisSpec }
  | { type: 'rotate'; spec: RotateSpec }
  | { type: 'skewX'; spec: SkewSpec }
  | { type: 'skewY'; spec: SkewSpec }
  | { type: 'flip'; spec: FlipSpec }
  | { type: 'opacity'; spec: OpacitySpec }
  | { type: 'fill'; spec: FillSpec }
  | { type: 'stroke'; spec: StrokeSpec }
  | { type: 'gradient'; spec: GradientSpec }
  | { type: 'blendMode'; spec: BlendMode }
  | { type: 'fillMode'; spec: FillMode }
  | { type: 'shadow'; spec: ShadowSpec }
  | { type: 'zIndex'; spec: number }
  | { type: 'timeScale'; spec: number }
  | { type: 'morph'; spec: MorphSpec }
  | { type: 'trim'; spec: TrimSpec }
  | { type: 'anchor'; spec: MorphSpec['anchor'] }
  | { type: 'clip'; spec: ClipSpec }
  | { type: 'textPath'; spec: TextPathSpec };

export type ShapeKind =
  | 'circle'
  | 'rect'
  | 'ellipse'
  | 'roundRect'
  | 'ring'
  | 'arc'
  | 'image'
  | 'path'
  | 'bezier'
  | 'compound'
  | 'text'
  | 'pie'
  | 'custom'
  | 'copy';

export type ShapeGeometry =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }
  | { kind: 'ellipse'; rx: number; ry: number }
  | { kind: 'roundRect'; width: number; height: number; radius: number | { tl: number; tr: number; br: number; bl: number } }
  | { kind: 'ring'; outer: number; inner: number }
  | { kind: 'arc'; radius: number; startAngle: number; endAngle: number; counterclockwise: boolean; innerRadius: number }
  | { kind: 'image'; src: string; width?: number; height?: number }
  | { kind: 'path'; points: Vec2[]; closed: boolean }
  | { kind: 'bezier'; commands: BezierCommand[] }
  | { kind: 'compound'; paths: { points: Vec2[]; closed: boolean }[] }
  | {
      kind: 'text';
      text: string;
      options: {
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
    }
  | { kind: 'pie'; radius: number }
  | { kind: 'custom'; draw: (ctx: CanvasRenderingContext2D, time: number) => void }
  | { kind: 'copy' };

export type BezierCommand =
  | { cmd: 'moveTo'; x: number; y: number }
  | { cmd: 'lineTo'; x: number; y: number }
  | { cmd: 'quadTo'; cpx: number; cpy: number; x: number; y: number }
  | { cmd: 'cubicTo'; cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }
  | { cmd: 'close' };

export type ShapeInstance = {
  kind: 'circle' | 'rect' | 'ellipse' | 'roundRect' | 'ring' | 'arc' | 'image' | 'path' | 'bezier' | 'compound' | 'text' | 'pie' | 'custom';
  geom: {
    radius?: number;
    width?: number;
    height?: number;
    rx?: number;
    ry?: number;
    outer?: number;
    inner?: number;
    startAngle?: number;
    endAngle?: number;
    counterclockwise?: boolean;
    innerRadius?: number;
    roundRadius?: number | { tl: number; tr: number; br: number; bl: number };
    src?: string;
    points?: Vec2[];
    closed?: boolean;
    paths?: { points: Vec2[]; closed: boolean }[];
    commands?: BezierCommand[];
  };
  fill: string;
  fillSet: boolean;
  gradient?: GradientSpec;
  opacity: number;
  zIndex: number;
  transform: { x: number; y: number; scale: number; rotation: number; scaleX: number; scaleY: number; skewX: number; skewY: number };
  anchor?: MorphSpec['anchor'];
  trim?: TrimSpec;
  clip?: ShapeInstance[];
  stroke?: {
    color: string;
    gradient?: GradientSpec;
    width: number;
    cap?: CanvasLineCap;
    join?: CanvasLineJoin;
    dash?: number[];
    dashOffset?: number;
  };
  blendMode?: BlendMode;
  fillMode?: FillMode;
  shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
  text?: {
    value: string;
    font: string;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
    letterSpacing: number;
    lineHeight: number;
    maxWidth?: number;
    wrap: boolean;
    textPath?: TextPathSpec;
    fillSpec?: FillSpec;
    opacitySpec?: OpacitySpec;
  };
  draw?: (ctx: CanvasRenderingContext2D, time: number) => void;
};

export type TrimSpec = {
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

export type EverySpec = {
  interval: number;
  factory: () => ShapeBuilder;
  snapshot: ShapeBuilder;
};

export class ShapeBuilder {
  readonly kind: ShapeKind;
  readonly geom: ShapeGeometry;
  readonly modifiers: Modifier[];
  readonly copies: EverySpec[];
  readonly isCopyPlaceholder: boolean;

  constructor(
    kind: ShapeKind,
    geom: ShapeGeometry,
    modifiers: Modifier[] = [],
    copies: EverySpec[] = [],
    isCopyPlaceholder = false
  ) {
    this.kind = kind;
    this.geom = geom;
    this.modifiers = modifiers;
    this.copies = copies;
    this.isCopyPlaceholder = isCopyPlaceholder;
  }

  fill(color: FillSpec): ShapeBuilder {
    return this.cloneWith({ type: 'fill', spec: color });
  }

  gradient(spec: GradientSpec): ShapeBuilder {
    return this.cloneWith({ type: 'gradient', spec });
  }

  stroke(spec: StrokeSpec): ShapeBuilder {
    return this.cloneWith({ type: 'stroke', spec });
  }

  blendMode(mode: BlendMode): ShapeBuilder {
    return this.cloneWith({ type: 'blendMode', spec: mode });
  }

  fillMode(mode: FillMode): ShapeBuilder {
    return this.cloneWith({ type: 'fillMode', spec: mode });
  }

  shadow(spec: ShadowSpec): ShapeBuilder {
    return this.cloneWith({ type: 'shadow', spec });
  }

  opacity(value: OpacitySpec): ShapeBuilder {
    return this.cloneWith({ type: 'opacity', spec: value });
  }

  zIndex(value: number): ShapeBuilder {
    return this.cloneWith({ type: 'zIndex', spec: value });
  }

  timeScale(value: number): ShapeBuilder {
    return this.cloneWith({ type: 'timeScale', spec: value });
  }

  move(spec: MoveSpec): ShapeBuilder {
    return this.cloneWith({ type: 'move', spec });
  }

  curve(spec: CurveSpec): ShapeBuilder {
    return this.cloneWith({ type: 'curve', spec });
  }

  pathMotion(spec: PathMotionSpec): ShapeBuilder {
    return this.cloneWith({ type: 'pathMotion', spec });
  }

  orientToPath(spec: OrientToPathSpec = {}): ShapeBuilder {
    return this.cloneWith({ type: 'orientToPath', spec });
  }

  velocity(spec: VelocitySpec): ShapeBuilder {
    return this.cloneWith({ type: 'velocity', spec });
  }

  acceleration(spec: AccelerationSpec): ShapeBuilder {
    return this.cloneWith({ type: 'acceleration', spec });
  }

  spring(spec: SpringSpec): ShapeBuilder {
    return this.cloneWith({ type: 'spring', spec });
  }

  at(pos: PositionSpec): ShapeBuilder {
    return this.cloneWith({ type: 'at', spec: pos });
  }

  anchor(anchor: MorphSpec['anchor']): ShapeBuilder {
    return this.cloneWith({ type: 'anchor', spec: anchor });
  }

  scale(spec: ScaleSpec): ShapeBuilder {
    return this.cloneWith({ type: 'scale', spec });
  }

  scaleX(spec: ScaleAxisSpec): ShapeBuilder {
    return this.cloneWith({ type: 'scaleX', spec });
  }

  scaleY(spec: ScaleAxisSpec): ShapeBuilder {
    return this.cloneWith({ type: 'scaleY', spec });
  }

  rotate(spec: RotateSpec): ShapeBuilder {
    return this.cloneWith({ type: 'rotate', spec });
  }

  skewX(spec: SkewSpec): ShapeBuilder {
    return this.cloneWith({ type: 'skewX', spec });
  }

  skewY(spec: SkewSpec): ShapeBuilder {
    return this.cloneWith({ type: 'skewY', spec });
  }

  flip(spec: FlipSpec): ShapeBuilder {
    return this.cloneWith({ type: 'flip', spec });
  }

  morph(
    from: any,
    to: any,
    duration: number,
    options: { start?: TimeRef; loop?: boolean; delay?: number; repeatDelay?: number; ease?: EaseSpec; anchor?: MorphSpec['anchor'] } = {}
  ): ShapeBuilder {
    return this.cloneWith({
      type: 'morph',
      spec: {
        from,
        to,
        duration,
        start: options.start,
        loop: options.loop,
        delay: options.delay,
        repeatDelay: options.repeatDelay,
        ease: options.ease,
        anchor: options.anchor,
      },
    });
  }

  trim(spec: TrimSpec): ShapeBuilder {
    return this.cloneWith({ type: 'trim', spec });
  }

  textPath(spec: TextPathSpec): ShapeBuilder {
    return this.cloneWith({ type: 'textPath', spec });
  }

  clip(shape: ClipSpec): ShapeBuilder {
    return this.cloneWith({ type: 'clip', spec: shape });
  }

  path(points: Vec2[], closed = true): ShapeBuilder {
    return this.cloneWithGeom({ kind: 'path', points, closed });
  }

  paths(paths: { points: Vec2[]; closed?: boolean }[]): ShapeBuilder {
    const normalized = paths.map((p) => ({ points: p.points, closed: p.closed ?? true }));
    return this.cloneWithGeom({ kind: 'compound', paths: normalized });
  }

  every(interval: number, factory: () => ShapeBuilder): ShapeBuilder {
    const snapshot = this.cloneWithoutCopies();
    const spec: EverySpec = { interval, factory, snapshot };
    return new ShapeBuilder(
      this.kind,
      this.geom,
      this.modifiers,
      [...this.copies, spec],
      this.isCopyPlaceholder
    );
  }

  evaluate(time: number): ShapeInstance[] {
    if (this.isCopyPlaceholder || this.kind === 'copy') return [];
    const base = evaluateBuilder(this, time);
    const out: ShapeInstance[] = [base];
    for (const copy of this.copies) {
      const count = Math.floor(time / copy.interval);
      for (let i = 0; i <= count; i++) {
        const localTime = time - i * copy.interval;
        let builder = copy.factory();
        if (builder.isCopyPlaceholder || builder.kind === 'copy') {
          builder = copy.snapshot;
        }
        out.push(...builder.evaluate(localTime));
      }
    }
    return out;
  }

  private cloneWith(mod: Modifier): ShapeBuilder {
    return new ShapeBuilder(
      this.kind,
      this.geom,
      [...this.modifiers, mod],
      this.copies,
      this.isCopyPlaceholder
    );
  }

  private cloneWithoutCopies(): ShapeBuilder {
    return new ShapeBuilder(
      this.kind,
      this.geom,
      this.modifiers,
      [],
      this.isCopyPlaceholder
    );
  }

  private cloneWithGeom(geom: ShapeGeometry): ShapeBuilder {
    return new ShapeBuilder(
      geom.kind === 'compound' ? 'path' : 'path',
      geom,
      this.modifiers,
      this.copies,
      this.isCopyPlaceholder
    );
  }
}

export function Copy(): ShapeBuilder {
  return new ShapeBuilder('copy', { kind: 'copy' }, [], [], true);
}

export function Shape(): ShapeBuilder {
  return new ShapeBuilder('path', { kind: 'path', points: [], closed: true });
}

export function estimateDuration(builder: ShapeBuilder): number {
  let prevEnd = 0;
  for (const mod of builder.modifiers) {
    const spec: any = (mod as any).spec;
    if (spec && typeof spec === 'object' && 'duration' in spec) {
      const resolvedStart = resolveStart(spec.start, prevEnd);
      const delay = spec.delay ?? 0;
      const duration = durationOf(spec);
      const end = resolvedStart + delay + duration;
      if (end > prevEnd) prevEnd = end;
    }
  }
  return prevEnd;
}

function evaluateBuilder(builder: ShapeBuilder, time: number): ShapeInstance {
  let fill = '#000000';
  let fillSet = false;
  let gradient: GradientSpec | undefined;
  let opacity = 1;
  let zIndex = 0;
  let x = 0;
  let y = 0;
  let hasAt = false;
  let scale = 1;
  let rotation = 0;
  let scaleX = 1;
  let scaleY = 1;
  let skewX = 0;
  let skewY = 0;
  let timeScale = 1;
  let morphOffsetX = 0;
  let morphOffsetY = 0;
  let anchor: MorphSpec['anchor'] | undefined;
  let clip: ShapeInstance[] | undefined;
  let lastPathAngle: number | undefined;
  let stroke:
    | {
        color: string;
        gradient?: GradientSpec;
        width: number;
        cap?: CanvasLineCap;
        join?: CanvasLineJoin;
        dash?: number[];
        dashOffset?: number;
      }
    | undefined;
  let blendMode: BlendMode | undefined;
  let fillMode: FillMode | undefined;
  let shadow: { color: string; blur: number; offsetX: number; offsetY: number } | undefined;

  let geom: ShapeInstance['geom'] = {};
  let text: ShapeInstance['text'] | undefined;
  let draw: ShapeInstance['draw'] | undefined;
  let trim: ShapeInstance['trim'] | undefined;
  if (builder.geom.kind === 'circle') {
    geom.radius = builder.geom.radius;
  } else if (builder.geom.kind === 'rect') {
    geom.width = builder.geom.width;
    geom.height = builder.geom.height;
  } else if (builder.geom.kind === 'ellipse') {
    geom.rx = builder.geom.rx;
    geom.ry = builder.geom.ry;
  } else if (builder.geom.kind === 'roundRect') {
    geom.width = builder.geom.width;
    geom.height = builder.geom.height;
    geom.roundRadius = builder.geom.radius;
  } else if (builder.geom.kind === 'ring') {
    geom.outer = builder.geom.outer;
    geom.inner = builder.geom.inner;
  } else if (builder.geom.kind === 'arc') {
    geom.radius = builder.geom.radius;
    geom.startAngle = builder.geom.startAngle;
    geom.endAngle = builder.geom.endAngle;
    geom.counterclockwise = builder.geom.counterclockwise;
    geom.innerRadius = builder.geom.innerRadius;
    if (builder.geom.radius <= 0) {
      Diagnostics.addOnce(`arc-radius:${builder.geom.radius}`, 'error', 'Arc radius must be > 0');
    }
  } else if (builder.geom.kind === 'image') {
    geom.src = builder.geom.src;
    geom.width = builder.geom.width;
    geom.height = builder.geom.height;
    if (!builder.geom.src) {
      Diagnostics.addOnce('image-src:missing', 'error', 'Image src is required');
    }
  } else if (builder.geom.kind === 'path') {
    geom.points = builder.geom.points;
    geom.closed = builder.geom.closed;
    if (!builder.geom.points || builder.geom.points.length < 2) {
      Diagnostics.addOnce('path-points:min', 'warn', 'Path should have at least 2 points');
    }
  } else if (builder.geom.kind === 'bezier') {
    geom.commands = builder.geom.commands;
    if (!builder.geom.commands || builder.geom.commands.length === 0) {
      Diagnostics.addOnce('bezier-commands:min', 'warn', 'BezierPath has no commands');
    }
  } else if (builder.geom.kind === 'compound') {
    geom.paths = builder.geom.paths;
    if (!builder.geom.paths || builder.geom.paths.length === 0) {
      Diagnostics.addOnce('compound-paths:min', 'warn', 'Compound path has no subpaths');
    }
  } else if (builder.geom.kind === 'text') {
    const options = builder.geom.options || {};
    const font = buildFont(options);
    const lineHeight =
      options.lineHeight ?? Math.round((parseFontSize(font) || 24) * 1.2);
    text = {
      value: builder.geom.text,
      font,
      align: options.align ?? 'center',
      baseline: options.baseline ?? 'middle',
      letterSpacing: options.letterSpacing ?? 0,
      lineHeight,
      maxWidth: options.maxWidth,
      wrap: options.wrap ?? false,
    };
    if (typeof builder.geom.text !== 'string') {
      Diagnostics.addOnce('text-value:type', 'error', 'Text value must be a string');
    }
    if (options.lineHeight !== undefined && (typeof options.lineHeight !== 'number' || options.lineHeight <= 0)) {
      Diagnostics.addOnce('text-lineHeight:invalid', 'warn', 'Text lineHeight must be a number > 0');
    }
    if (options.maxWidth !== undefined && typeof options.maxWidth !== 'number') {
      Diagnostics.addOnce('text-maxWidth:type', 'warn', 'Text maxWidth must be a number');
    }
    if (options.maxWidth !== undefined && options.maxWidth <= 0) {
      Diagnostics.addOnce('text-maxWidth:invalid', 'warn', 'Text maxWidth must be > 0');
    }
  } else if (builder.geom.kind === 'pie') {
    geom.radius = builder.geom.radius;
  } else if (builder.geom.kind === 'custom') {
    draw = builder.geom.draw;
  }

  for (const mod of builder.modifiers) {
    if (mod.type === 'timeScale') {
      timeScale *= mod.spec;
    }
  }

  const localTime = time * timeScale;
  let prevEnd = 0;

  for (let i = 0; i < builder.modifiers.length; i++) {
    const mod = builder.modifiers[i];
    const specAny: any = (mod as any).spec;
    validateDurationSpec(specAny, `mod:${builder.kind}:${mod.type}:${i}`);
    switch (mod.type) {
      case 'fill': {
        const spec = mod.spec;
        if (typeof spec === 'string') {
          validateColorSpec(spec, 'fill-color');
          fill = spec;
          fillSet = true;
        } else {
          validateColorSpec(spec, 'fill-color');
          validateDurationSpec(spec, 'fill');
          if (!('from' in spec) || !('to' in spec)) {
            Diagnostics.addOnce('fill:range', 'error', 'Fill animation requires from/to');
          }
          if (text && spec.stagger && spec.stagger > 0) {
            text.fillSpec = spec;
          } else {
            const resolvedStart = resolveStart(spec.start, prevEnd);
            const t = phase(
              localTime,
              durationOf(spec),
              spec.loop,
              resolvedStart,
              spec.delay,
              spec.repeatDelay,
              spec.ease
            );
            if (spec.keyframes && spec.keyframes.length > 0) {
              const value = keyframeColor(localTime, spec.keyframes, spec, resolvedStart);
              fill = value;
            } else {
              fill = lerpColor(spec.from, spec.to, t);
            }
            fillSet = true;
          }
        }
        break;
      }
      case 'gradient': {
        gradient = mod.spec;
        fillSet = true;
        validateGradientSpec(mod.spec, 'gradient');
        const end = maxAnimEnd(prevEnd, [
          ...mod.spec.stops.map((s) => (typeof s.pos === 'number' ? undefined : s.pos)),
          ...mod.spec.stops.map((s) => (typeof s.color === 'string' ? undefined : s.color)),
        ]);
        if (end !== undefined) prevEnd = end;
        break;
      }
      case 'stroke': {
        const spec = mod.spec;
        if (spec.width !== undefined && typeof spec.width !== 'number' && !isNumberAnimSpec(spec.width)) {
          Diagnostics.addOnce('stroke-width:invalid', 'error', 'Stroke width must be a number or number animation spec');
        }
        if (spec.dash !== undefined && (!Array.isArray(spec.dash) || spec.dash.some((n) => typeof n !== 'number'))) {
          Diagnostics.addOnce('stroke-dash:invalid', 'warn', 'Stroke dash must be an array of numbers');
        }
        const color =
          spec.color === undefined
            ? stroke?.color ?? '#000000'
            : typeof spec.color === 'string'
              ? (validateColorSpec(spec.color, 'stroke-color'), spec.color)
              : (() => {
                  validateColorSpec(spec.color, 'stroke-color');
                  validateDurationSpec(spec.color, 'stroke-color');
                  const resolvedStart = resolveStart(spec.color.start, prevEnd);
                  if (spec.color.keyframes && spec.color.keyframes.length > 0) {
                    return keyframeColor(localTime, spec.color.keyframes, spec.color, resolvedStart);
                  }
                  const t = phase(
                    localTime,
                    durationOf(spec.color),
                    spec.color.loop,
                    resolvedStart,
                    spec.color.delay,
                    spec.color.repeatDelay,
                    spec.color.ease
                  );
                  return lerpColor(spec.color.from, spec.color.to, t);
                })();
        const width = evalNumberSpec(spec.width ?? stroke?.width ?? 0, localTime, prevEnd);
        const dashOffset = spec.dashOffset !== undefined ? evalNumberSpec(spec.dashOffset, localTime, prevEnd) : stroke?.dashOffset;
        stroke = {
          color,
          gradient: spec.gradient ?? stroke?.gradient,
          width,
          cap: spec.cap ?? stroke?.cap,
          join: spec.join ?? stroke?.join,
          dash: spec.dash ?? stroke?.dash,
          dashOffset,
        };
        if (spec.gradient) validateGradientSpec(spec.gradient, 'stroke-gradient');
        const end = maxAnimEnd(prevEnd, [
          typeof spec.color === 'string' || spec.color === undefined ? undefined : spec.color,
          spec.gradient
            ? {
                duration: maxGradientDuration(spec.gradient),
                start: 0,
              }
            : undefined,
          typeof spec.width === 'number' || spec.width === undefined ? undefined : spec.width,
          typeof spec.dashOffset === 'number' || spec.dashOffset === undefined ? undefined : spec.dashOffset,
        ]);
        if (end !== undefined) prevEnd = end;
        break;
      }
      case 'blendMode': {
        blendMode = mod.spec;
        break;
      }
      case 'fillMode': {
        fillMode = mod.spec;
        break;
      }
      case 'shadow': {
        const spec = mod.spec;
        const color =
          spec.color === undefined
            ? shadow?.color ?? 'rgba(0, 0, 0, 0)'
            : typeof spec.color === 'string'
              ? (validateColorSpec(spec.color, 'shadow-color'), spec.color)
              : (() => {
                  validateColorSpec(spec.color, 'shadow-color');
                  validateDurationSpec(spec.color, 'shadow-color');
                  const resolvedStart = resolveStart(spec.color.start, prevEnd);
                  if (spec.color.keyframes && spec.color.keyframes.length > 0) {
                    return keyframeColor(localTime, spec.color.keyframes, spec.color, resolvedStart);
                  }
                  const t = phase(
                    localTime,
                    durationOf(spec.color),
                    spec.color.loop,
                    resolvedStart,
                    spec.color.delay,
                    spec.color.repeatDelay,
                    spec.color.ease
                  );
                  return lerpColor(spec.color.from, spec.color.to, t);
                })();
        const blur = evalNumberSpec(spec.blur ?? shadow?.blur ?? 0, localTime, prevEnd);
        const offsetX = evalNumberSpec(spec.offsetX ?? shadow?.offsetX ?? 0, localTime, prevEnd);
        const offsetY = evalNumberSpec(spec.offsetY ?? shadow?.offsetY ?? 0, localTime, prevEnd);
        shadow = { color, blur, offsetX, offsetY };
        const end = maxAnimEnd(prevEnd, [
          typeof spec.color === 'string' || spec.color === undefined ? undefined : spec.color,
          typeof spec.blur === 'number' || spec.blur === undefined ? undefined : spec.blur,
          typeof spec.offsetX === 'number' || spec.offsetX === undefined ? undefined : spec.offsetX,
          typeof spec.offsetY === 'number' || spec.offsetY === undefined ? undefined : spec.offsetY,
        ]);
        if (end !== undefined) prevEnd = end;
        break;
      }
      case 'opacity': {
        const spec = mod.spec;
        if (typeof spec === 'number') {
          opacity = spec;
        } else {
          validateDurationSpec(spec, 'opacity');
          if (text && spec.stagger && spec.stagger > 0) {
            text.opacitySpec = spec;
          } else {
            const resolvedStart = resolveStart(spec.start, prevEnd);
            const t = phase(
              localTime,
              durationOf(spec),
              spec.loop,
              resolvedStart,
              spec.delay,
              spec.repeatDelay,
              spec.ease
            );
            if (spec.keyframes && spec.keyframes.length > 0) {
              opacity = keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
            } else {
              opacity = lerp(spec.from, spec.to, t);
            }
          }
        }
        break;
      }
      case 'zIndex': {
        zIndex = mod.spec;
        break;
      }
      case 'move': {
        const spec = mod.spec;
        if (spec.x && (!Array.isArray(spec.x) || spec.x.length !== 2 || !spec.x.every(isFiniteNumber))) {
          Diagnostics.addOnce('move-x:invalid', 'error', 'Move x must be [number, number]');
        }
        if (spec.y && (!Array.isArray(spec.y) || spec.y.length !== 2 || !spec.y.every(isFiniteNumber))) {
          Diagnostics.addOnce('move-y:invalid', 'error', 'Move y must be [number, number]');
        }
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          const point = keyframePoint(localTime, spec.keyframes, spec, resolvedStart);
          if (point.x !== undefined) x += point.x;
          if (point.y !== undefined) y += point.y;
        } else {
          if (spec.x) x += lerp(spec.x[0], spec.x[1], t);
          if (spec.y) y += lerp(spec.y[0], spec.y[1], t);
        }
        break;
      }
      case 'curve': {
        const spec = mod.spec;
        if (!isFiniteNumber(spec.from?.x) || !isFiniteNumber(spec.from?.y)) {
          Diagnostics.addOnce('curve-from:invalid', 'error', 'Curve.from must be {x,y} numbers');
        }
        if (!isFiniteNumber(spec.control?.x) || !isFiniteNumber(spec.control?.y)) {
          Diagnostics.addOnce('curve-control:invalid', 'error', 'Curve.control must be {x,y} numbers');
        }
        if (!isFiniteNumber(spec.to?.x) || !isFiniteNumber(spec.to?.y)) {
          Diagnostics.addOnce('curve-to:invalid', 'error', 'Curve.to must be {x,y} numbers');
        }
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        const px = quadBezier(spec.from.x, spec.control.x, spec.to.x, t);
        const py = quadBezier(spec.from.y, spec.control.y, spec.to.y, t);
        x += px;
        y += py;
        break;
      }
      case 'pathMotion': {
        const spec = mod.spec;
        validateDurationSpec(spec, 'pathMotion');
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        const path = resolvePathForMotion(spec.path, localTime);
        if (path && path.points.length > 0) {
          const sample = samplePath(path.points, path.closed, t);
          x += sample.point.x;
          y += sample.point.y;
          lastPathAngle = sample.angle;
        }
        break;
      }
      case 'orientToPath': {
        const spec = mod.spec;
        if (spec.duration !== undefined) validateDurationSpec(spec, 'orientToPath');
        let angle = lastPathAngle;
        if (spec.path) {
          const resolvedStart = resolveStart(spec.start, prevEnd);
          const t = phase(
            localTime,
            durationOf(spec),
            spec.loop,
            resolvedStart,
            spec.delay,
            spec.repeatDelay,
            spec.ease
          );
          const path = resolvePathForMotion(spec.path, localTime);
          if (path && path.points.length > 0) {
            angle = samplePath(path.points, path.closed, t).angle;
          }
        }
        if (angle !== undefined) rotation += angle + (spec.offset ?? 0);
        break;
      }
      case 'velocity': {
        const spec = mod.spec;
        validateDurationSpec(spec, 'velocity');
        if (spec.x !== undefined && !isFiniteNumber(spec.x)) {
          Diagnostics.addOnce('velocity-x:invalid', 'error', 'Velocity x must be number');
        }
        if (spec.y !== undefined && !isFiniteNumber(spec.y)) {
          Diagnostics.addOnce('velocity-y:invalid', 'error', 'Velocity y must be number');
        }
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const elapsed = phaseElapsed(localTime, durationOf(spec), spec.loop, resolvedStart, spec.delay, spec.repeatDelay);
        if (spec.x) x += spec.x * elapsed;
        if (spec.y) y += spec.y * elapsed;
        break;
      }
      case 'acceleration': {
        const spec = mod.spec;
        validateDurationSpec(spec, 'acceleration');
        if (spec.x !== undefined && !isFiniteNumber(spec.x)) {
          Diagnostics.addOnce('acceleration-x:invalid', 'error', 'Acceleration x must be number');
        }
        if (spec.y !== undefined && !isFiniteNumber(spec.y)) {
          Diagnostics.addOnce('acceleration-y:invalid', 'error', 'Acceleration y must be number');
        }
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const elapsed = phaseElapsed(localTime, durationOf(spec), spec.loop, resolvedStart, spec.delay, spec.repeatDelay);
        const half = 0.5 * elapsed * elapsed;
        if (spec.x) x += spec.x * half;
        if (spec.y) y += spec.y * half;
        break;
      }
      case 'spring': {
        const spec = mod.spec;
        validateDurationSpec(spec, 'spring');
        if (spec.x && (!Array.isArray(spec.x) || spec.x.length !== 2 || !spec.x.every(isFiniteNumber))) {
          Diagnostics.addOnce('spring-x:invalid', 'error', 'Spring x must be [number, number]');
        }
        if (spec.y && (!Array.isArray(spec.y) || spec.y.length !== 2 || !spec.y.every(isFiniteNumber))) {
          Diagnostics.addOnce('spring-y:invalid', 'error', 'Spring y must be [number, number]');
        }
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const elapsed = phaseElapsed(localTime, durationOf(spec), spec.loop, resolvedStart, spec.delay, spec.repeatDelay);
        const s = springFactor(elapsed / 1000, spec.stiffness, spec.damping, spec.mass);
        if (spec.x) x += lerp(spec.x[0], spec.x[1], s);
        if (spec.y) y += lerp(spec.y[0], spec.y[1], s);
        break;
      }
      case 'at': {
        const spec = mod.spec;
        if (!hasAt) {
          x = spec.x;
          y = spec.y;
          hasAt = true;
        } else {
          x = spec.x;
          y = spec.y;
        }
        break;
      }
      case 'scale': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          scale *= keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
        } else {
          scale *= lerp(spec.from, spec.to, t);
        }
        break;
      }
      case 'scaleX': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          scaleX *= keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
        } else {
          scaleX *= lerp(spec.from, spec.to, t);
        }
        break;
      }
      case 'scaleY': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          scaleY *= keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
        } else {
          scaleY *= lerp(spec.from, spec.to, t);
        }
        break;
      }
      case 'rotate': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          rotation += keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
        } else {
          rotation += lerp(spec.from, spec.to, t);
        }
        break;
      }
      case 'skewX': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          skewX += keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
        } else {
          skewX += lerp(spec.from, spec.to, t);
        }
        break;
      }
      case 'skewY': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (spec.keyframes && spec.keyframes.length > 0) {
          skewY += keyframeNumber(localTime, spec.keyframes, spec, resolvedStart);
        } else {
          skewY += lerp(spec.from, spec.to, t);
        }
        break;
      }
      case 'flip': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        const angle =
          spec.keyframes && spec.keyframes.length > 0
            ? keyframeNumber(localTime, spec.keyframes, spec, resolvedStart)
            : lerp(spec.from, spec.to, t);
        const factor = Math.cos(angle);
        if (spec.axis === 'x') {
          scaleY *= factor;
        } else {
          scaleX *= factor;
        }
        break;
      }
      case 'timeScale': {
        break;
      }
      case 'morph': {
        const spec = mod.spec;
        const resolvedStart = resolveStart(spec.start, prevEnd);
        const t = phase(
          localTime,
          durationOf(spec),
          spec.loop,
          resolvedStart,
          spec.delay,
          spec.repeatDelay,
          spec.ease
        );
        if (builder.geom.kind === 'circle') {
          const from = Number(spec.from);
          const to = Number(spec.to);
          geom.radius = lerp(from, to, t);
        } else if (builder.geom.kind === 'rect') {
          const from = spec.from || { width: 0, height: 0 };
          const to = spec.to || { width: 0, height: 0 };
          const w = lerp(from.width, to.width, t);
          const h = lerp(from.height, to.height, t);
          geom.width = w;
          geom.height = h;
          if (spec.anchor && spec.anchor !== 'center') {
            const dw = w - from.width;
            const dh = h - from.height;
            const offset = anchorOffset(spec.anchor, dw, dh);
            morphOffsetX += offset.x;
            morphOffsetY += offset.y;
          }
        } else if (builder.geom.kind === 'path') {
          const fromPath = normalizeMorphPath(spec.from, builder.geom.points, builder.geom.closed);
          const toPath = normalizeMorphPath(spec.to, builder.geom.points, builder.geom.closed);
          const targetCount = Math.max(fromPath.points.length, toPath.points.length, 2);
          const a = resamplePath(fromPath.points, targetCount, fromPath.closed);
          const b = resamplePath(toPath.points, targetCount, toPath.closed);
          const matched = fromPath.closed && toPath.closed ? rotateToBestMatch(a, b) : a;
          const points: Vec2[] = [];
          for (let i = 0; i < targetCount; i++) {
            points.push({
              x: lerp(matched[i].x, b[i].x, t),
              y: lerp(matched[i].y, b[i].y, t),
            });
          }
          geom.points = points;
          geom.closed = fromPath.closed && toPath.closed;
        }
        break;
      }
      case 'trim': {
        trim = mod.spec;
        break;
      }
      case 'anchor': {
        anchor = mod.spec;
        break;
      }
      case 'textPath': {
        if (text) {
          text.textPath = mod.spec;
        }
        break;
      }
      case 'clip': {
        const spec = mod.spec;
        const clipList = Array.isArray(spec) ? spec : [spec];
        const collected: ShapeInstance[] = [];
        for (const item of clipList) {
          if (item && typeof (item as any).evaluate === 'function') {
            collected.push(...(item as ShapeBuilder).evaluate(localTime));
          }
        }
        clip = collected.length > 0 ? collected : undefined;
        break;
      }
    }

    const spec: any = (mod as any).spec;
    if (spec && typeof spec === 'object' && 'duration' in spec) {
      const resolvedStart = resolveStart(spec.start, prevEnd);
      const delay = spec.delay ?? 0;
      const duration = durationOf(spec);
      prevEnd = resolvedStart + delay + duration;
    }
  }

  return {
    kind:
      builder.geom.kind === 'circle'
        ? 'circle'
        : builder.geom.kind === 'rect'
          ? 'rect'
          : builder.geom.kind === 'ellipse'
            ? 'ellipse'
            : builder.geom.kind === 'roundRect'
              ? 'roundRect'
              : builder.geom.kind === 'ring'
                ? 'ring'
                : builder.geom.kind === 'arc'
                  ? 'arc'
                  : builder.geom.kind === 'image'
                    ? 'image'
                  : builder.geom.kind === 'path'
                    ? 'path'
                    : builder.geom.kind === 'bezier'
                      ? 'bezier'
                    : builder.geom.kind === 'compound'
                      ? 'compound'
                    : builder.geom.kind === 'text'
                      ? 'text'
                      : builder.geom.kind === 'pie'
                        ? 'pie'
                        : 'custom',
    geom,
    fill,
    fillSet,
    gradient,
    opacity,
    zIndex,
    transform: { x: x + morphOffsetX, y: y + morphOffsetY, scale, rotation, scaleX, scaleY, skewX, skewY },
    anchor,
    trim,
    clip,
    stroke,
    blendMode,
    fillMode,
    shadow,
    text,
    draw,
  };
}

function evalNumberSpec(
  spec: number | NumberAnimSpec,
  time: number,
  prevEnd: number
): number {
  if (typeof spec === 'number') return spec;
  if (!isNumberAnimSpec(spec)) {
    Diagnostics.addOnce('number-spec:invalid', 'error', 'Expected number or number animation spec');
    return 0;
  }
  const resolvedStart = resolveStart(spec.start, prevEnd);
  if (spec.keyframes && spec.keyframes.length > 0) {
    return keyframeNumber(time, spec.keyframes, spec, resolvedStart);
  }
  const t = phase(
    time,
    durationOf(spec),
    spec.loop,
    resolvedStart,
    spec.delay,
    spec.repeatDelay,
    spec.ease
  );
  return lerp(spec.from, spec.to, t);
}

type AnimEndSpec = NumberAnimSpec | FillSpec | { duration: number; start?: TimeRef; delay?: number; repeatDelay?: number; ease?: EaseSpec; loop?: boolean; keyframes?: { time: number; value: any }[] };

function maxAnimEnd(prevEnd: number, specs: Array<AnimEndSpec | undefined>): number | undefined {
  let max: number | undefined;
  for (const spec of specs) {
    if (!spec || typeof spec === 'string') continue;
    if (!('duration' in spec) && !('keyframes' in spec)) continue;
    const resolvedStart = resolveStart((spec as any).start, prevEnd);
    const delay = (spec as any).delay ?? 0;
    const duration = durationOf(spec as any);
    const end = resolvedStart + delay + duration;
    if (max === undefined || end > max) max = end;
  }
  return max;
}

function maxGradientDuration(gradient: GradientSpec): number {
  let max = 0;
  for (const stop of gradient.stops) {
    if (typeof stop.pos !== 'number') {
      max = Math.max(max, durationOf(stop.pos));
    }
    if (typeof stop.color !== 'string') {
      max = Math.max(max, durationOf(stop.color));
    }
  }
  return max;
}

function isNumberAnimSpec(spec: any): spec is NumberAnimSpec {
  return spec && typeof spec === 'object' && typeof spec.from === 'number' && typeof spec.to === 'number';
}

function isFiniteNumber(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

function validateDurationSpec(spec: any, key: string): void {
  if (!spec || typeof spec !== 'object' || !('duration' in spec)) return;
  if (!isFiniteNumber(spec.duration)) {
    Diagnostics.addOnce(`${key}:duration:type`, 'error', 'Duration must be a number');
  } else if (spec.duration <= 0) {
    Diagnostics.addOnce(`${key}:duration:value`, 'error', 'Duration must be > 0');
  }
  if (spec.delay !== undefined && !isFiniteNumber(spec.delay)) {
    Diagnostics.addOnce(`${key}:delay:type`, 'error', 'Delay must be a number');
  }
  if (spec.repeatDelay !== undefined && !isFiniteNumber(spec.repeatDelay)) {
    Diagnostics.addOnce(`${key}:repeatDelay:type`, 'error', 'Repeat delay must be a number');
  }
}

function isLikelyColor(input: string): boolean {
  const s = input.trim().toLowerCase();
  if (s.startsWith('var(')) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return true;
  if (/^rgb\(/.test(s) || /^rgba\(/.test(s)) return true;
  if (/^hsl\(/.test(s) || /^hsla\(/.test(s)) return true;
  const named = new Set(['red', 'blue', 'green', 'black', 'white', 'yellow', 'cyan', 'magenta', 'gray']);
  return named.has(s);
}

function validateColorSpec(spec: FillSpec, key: string): void {
  if (typeof spec === 'string') {
    if (!isLikelyColor(spec)) Diagnostics.addOnce(`${key}:${spec}`, 'warn', 'Color looks invalid', spec);
    return;
  }
  if (!isLikelyColor(spec.from)) Diagnostics.addOnce(`${key}:from:${spec.from}`, 'warn', 'Color looks invalid', spec.from);
  if (!isLikelyColor(spec.to)) Diagnostics.addOnce(`${key}:to:${spec.to}`, 'warn', 'Color looks invalid', spec.to);
}

function validateGradientSpec(spec: GradientSpec, key: string): void {
  for (const stop of spec.stops) {
    if (typeof stop.pos === 'number') {
      if (stop.pos < 0 || stop.pos > 1) {
        Diagnostics.addOnce(`${key}:stop:${stop.pos}`, 'warn', 'Gradient stop position should be between 0 and 1');
      }
    } else if (!isNumberAnimSpec(stop.pos)) {
      Diagnostics.addOnce(`${key}:stop:invalid`, 'error', 'Gradient stop position must be number or number animation spec');
    }
    validateColorSpec(stop.color, `${key}:color`);
  }
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

function phaseElapsed(
  time: number,
  duration: number,
  loop = false,
  start = 0,
  delay = 0,
  repeatDelay = 0
): number {
  if (duration <= 0) return 0;
  const local = time - start - delay;
  if (local <= 0) return 0;
  if (loop) {
    const cycle = duration + repeatDelay;
    const inCycle = cycle > 0 ? local % cycle : local;
    if (inCycle > duration) return duration;
    return inCycle;
  }
  return local > duration ? duration : local;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function quadBezier(a: number, b: number, c: number, t: number): number {
  const inv = 1 - t;
  return inv * inv * a + 2 * inv * t * b + t * t * c;
}

function normalizeMorphPath(input: any, fallbackPoints: Vec2[], fallbackClosed: boolean): { points: Vec2[]; closed: boolean } {
  if (Array.isArray(input)) return { points: input as Vec2[], closed: fallbackClosed };
  if (input && Array.isArray(input.points)) return { points: input.points as Vec2[], closed: Boolean(input.closed) };
  return { points: fallbackPoints, closed: fallbackClosed };
}

function resamplePath(points: Vec2[], count: number, closed: boolean): Vec2[] {
  if (points.length === 0) return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  if (points.length === 1) return Array.from({ length: count }, () => ({ x: points[0].x, y: points[0].y }));
  const pts = closed ? [...points, points[0]] : points.slice();
  const segLengths: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    segLengths.push(len);
    total += len;
  }
  if (total === 0) return Array.from({ length: count }, () => ({ x: pts[0].x, y: pts[0].y }));
  const out: Vec2[] = [];
  for (let i = 0; i < count; i++) {
    const dist = (i / (count - 1)) * total;
    let acc = 0;
    let seg = 0;
    while (seg < segLengths.length && acc + segLengths[seg] < dist) {
      acc += segLengths[seg];
      seg++;
    }
    const t = segLengths[seg] === 0 ? 0 : (dist - acc) / segLengths[seg];
    const a = pts[seg];
    const b = pts[seg + 1] ?? pts[seg];
    out.push({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
  }
  return out;
}

function rotateToBestMatch(a: Vec2[], b: Vec2[]): Vec2[] {
  const n = Math.min(a.length, b.length);
  if (n === 0) return a;
  let bestOffset = 0;
  let bestScore = Infinity;
  for (let offset = 0; offset < n; offset++) {
    let score = 0;
    for (let i = 0; i < n; i++) {
      const ai = a[(i + offset) % n];
      const bi = b[i];
      const dx = ai.x - bi.x;
      const dy = ai.y - bi.y;
      score += dx * dx + dy * dy;
    }
    if (score < bestScore) {
      bestScore = score;
      bestOffset = offset;
    }
  }
  const rotated: Vec2[] = [];
  for (let i = 0; i < n; i++) rotated.push(a[(i + bestOffset) % n]);
  return rotated;
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
  // Approximate via De Casteljau on y only (t is already time fraction)
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
  start: number
): number {
  const local = localTimeForKeyframes(time, spec, start);
  if (keyframes.length === 1) return keyframes[0].value;
  const { a, b, t } = segmentForKeyframes(local, keyframes, spec);
  return lerp(a.value, b.value, applyEase(t, spec.ease));
}

function keyframeColor(
  time: number,
  keyframes: { time: number; value: string }[],
  spec: { loop?: boolean; delay?: number; repeatDelay?: number; ease?: EaseSpec; duration?: number },
  start: number
): string {
  const local = localTimeForKeyframes(time, spec, start);
  if (keyframes.length === 1) return keyframes[0].value;
  const { a, b, t } = segmentForKeyframes(local, keyframes, spec);
  return lerpColor(a.value, b.value, applyEase(t, spec.ease));
}

function keyframePoint(
  time: number,
  keyframes: { time: number; x?: number; y?: number }[],
  spec: { loop?: boolean; delay?: number; repeatDelay?: number; ease?: EaseSpec; duration?: number },
  start: number
): { x?: number; y?: number } {
  const local = localTimeForKeyframes(time, spec, start);
  if (keyframes.length === 1) return { x: keyframes[0].x, y: keyframes[0].y };
  const { a, b, t } = segmentForKeyframes(local, keyframes, spec);
  const eased = applyEase(t, spec.ease);
  const out: { x?: number; y?: number } = {};
  if (a.x !== undefined && b.x !== undefined) out.x = lerp(a.x, b.x, eased);
  else out.x = b.x ?? a.x;
  if (a.y !== undefined && b.y !== undefined) out.y = lerp(a.y, b.y, eased);
  else out.y = b.y ?? a.y;
  return out;
}

function localTimeForKeyframes(
  time: number,
  spec: { loop?: boolean; delay?: number; repeatDelay?: number; duration?: number; keyframes?: { time: number }[] },
  start: number
): number {
  const delay = spec.delay ?? 0;
  let local = time - start - delay;
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
  keyframes: T[],
  spec: { duration?: number }
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

function anchorOffset(
  anchor: MorphSpec['anchor'],
  dw: number,
  dh: number
): { x: number; y: number } {
  const halfW = dw / 2;
  const halfH = dh / 2;
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
  const m = s.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
  }
  return null;
}

function buildFont(options: {
  font?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
}): string {
  if (options.font) return options.font;
  let size = options.fontSize ?? 24;
  if (typeof size !== 'number' || !isFinite(size) || size <= 0) {
    Diagnostics.addOnce('text-fontSize:invalid', 'warn', 'Text fontSize must be a number > 0');
    size = 24;
  }
  if (options.fontFamily !== undefined && typeof options.fontFamily !== 'string') {
    Diagnostics.addOnce('text-fontFamily:invalid', 'warn', 'Text fontFamily must be string');
  }
  const family = options.fontFamily ?? 'Georgia';
  if (options.fontWeight !== undefined && typeof options.fontWeight !== 'string' && typeof options.fontWeight !== 'number') {
    Diagnostics.addOnce('text-fontWeight:invalid', 'warn', 'Text fontWeight must be string or number');
  }
  if (options.fontStyle !== undefined && typeof options.fontStyle !== 'string') {
    Diagnostics.addOnce('text-fontStyle:invalid', 'warn', 'Text fontStyle must be string');
  }
  const weight = options.fontWeight ? String(options.fontWeight) : '';
  const style = options.fontStyle ?? '';
  const parts = [style, weight, `${size}px`, family].filter(Boolean);
  return parts.join(' ');
}

function parseFontSize(font: string): number {
  const m = font.match(/(\\d+(?:\\.\\d+)?)px/);
  if (!m) return 0;
  return Number(m[1]);
}

function resolvePathForMotion(
  input: Vec2[] | { points: Vec2[]; closed?: boolean } | ShapeBuilder,
  time: number
): { points: Vec2[]; closed: boolean } | null {
  if (Array.isArray(input)) return { points: input, closed: false };
  if ((input as any).points) {
    const obj = input as { points: Vec2[]; closed?: boolean };
    return { points: obj.points, closed: obj.closed ?? false };
  }
  if (input && typeof (input as any).evaluate === 'function') {
    const shapes = (input as ShapeBuilder).evaluate(time);
    const first = shapes.find((s) => s.kind === 'path' || s.kind === 'bezier' || s.kind === 'compound');
    if (first?.kind === 'path' && first.geom.points) {
      return { points: first.geom.points, closed: Boolean(first.geom.closed) };
    }
    if (first?.kind === 'bezier' && first.geom.commands) {
      const points = bezierToPoints(first.geom.commands);
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

function samplePath(
  points: Vec2[],
  closed: boolean,
  t: number
): { point: Vec2; angle: number } {
  const pts = closed ? [...points, points[0]] : points.slice();
  if (pts.length < 2) return { point: pts[0] ?? { x: 0, y: 0 }, angle: 0 };
  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x;
    const dy = pts[i + 1].y - pts[i].y;
    const len = Math.hypot(dx, dy);
    lengths.push(len);
    total += len;
  }
  if (total === 0) return { point: pts[0], angle: 0 };
  const dist = t * total;
  let acc = 0;
  let seg = 0;
  while (seg < lengths.length && acc + lengths[seg] < dist) {
    acc += lengths[seg];
    seg++;
  }
  const segLen = lengths[seg] || 1;
  const localT = (dist - acc) / segLen;
  const a = pts[seg];
  const b = pts[seg + 1] ?? pts[seg];
  const point = { x: lerp(a.x, b.x, localT), y: lerp(a.y, b.y, localT) };
  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  return { point, angle };
}

function springFactor(
  t: number,
  stiffness = 180,
  damping = 20,
  mass = 1
): number {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const A = 1;
    const B = (zeta * w0) / wd;
    return 1 - Math.exp(-zeta * w0 * t) * (A * Math.cos(wd * t) + B * Math.sin(wd * t));
  }
  if (zeta === 1) {
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  }
  const wd = w0 * Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - Math.sqrt(zeta * zeta - 1));
  const r2 = -w0 * (zeta + Math.sqrt(zeta * zeta - 1));
  const c1 = (r2 / (r2 - r1));
  const c2 = 1 - c1;
  return 1 - (c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t));
}

function bezierToPoints(commands: BezierCommand[]): Vec2[] {
  const points: Vec2[] = [];
  let x = 0;
  let y = 0;
  const push = (px: number, py: number) => points.push({ x: px, y: py });
  for (const c of commands) {
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
