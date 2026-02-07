import { ShapeBuilder, ShapeInstance, TimeRef, estimateDuration } from './Shape';

type ShapeLike = ShapeBuilder | ShapeBuilder[] | (() => ShapeBuilder | ShapeBuilder[]);

type TriggerPredicate = boolean | ((time: number) => boolean);

class Group {
  private items: ShapeLike[];
  private resolver?: (time: number) => boolean;
  private offset = 0;

  constructor(items: ShapeLike[], resolver?: (time: number) => boolean, offset = 0) {
    this.items = items;
    this.resolver = resolver;
    this.offset = offset;
  }

  evaluate(time: number): ShapeInstance[] {
    if (this.resolver && !this.resolver(time)) return [];
    return flattenItems(this.items, time - this.offset, this.offset);
  }
}

class SequenceGroup {
  private entries: { offset: number; item: ShapeLike }[];

  constructor(items: ShapeLike[]) {
    const entries: { offset: number; item: ShapeLike }[] = [];
    let cursor = 0;
    for (const item of items) {
      entries.push({ offset: cursor, item });
      cursor += durationOfItem(item);
    }
    this.entries = entries;
  }

  evaluate(time: number): ShapeInstance[] {
    const out: ShapeInstance[] = [];
    for (const entry of this.entries) {
      if (time < entry.offset) continue;
      out.push(...flattenItems([entry.item], time - entry.offset, entry.offset));
    }
    return out;
  }
}

export function parallel(...items: ShapeLike[]): Group {
  return new Group(items);
}

export function sequence(...items: ShapeLike[]): SequenceGroup {
  return new SequenceGroup(items);
}

export function when(condition: TriggerPredicate, ...items: ShapeLike[]): Group {
  const predicate = typeof condition === 'function' ? condition : () => Boolean(condition);
  return new Group(items, predicate);
}

export function on(start: TimeRef, ...items: ShapeLike[]): Group {
  const resolvedStart = resolveStart(start, 0);
  return new Group(items, (time) => time >= resolvedStart, resolvedStart);
}

function flattenItems(items: ShapeLike[], time: number, offset: number): ShapeInstance[] {
  const out: ShapeInstance[] = [];
  for (const item of items) {
    if (typeof item === 'function') {
      const built = item();
      out.push(...flattenItems([built], time, offset));
    } else if (Array.isArray(item)) {
      for (const b of item) out.push(...b.evaluate(time));
    } else if (item && typeof item.evaluate === 'function') {
      out.push(...item.evaluate(time));
    }
  }
  return out;
}

function durationOfItem(item: ShapeLike): number {
  if (typeof item === 'function') {
    return durationOfItem(item());
  }
  if (Array.isArray(item)) {
    return item.reduce((acc, b) => Math.max(acc, estimateDuration(b)), 0);
  }
  return estimateDuration(item);
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
