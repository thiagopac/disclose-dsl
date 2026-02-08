import { describe, expect, it } from 'vitest';
import { Circle } from '../src/dsl/Circle';
import { on, sequence } from '../src/dsl/Flow';

describe('Flow', () => {
  it('sequences items by duration', () => {
    const first = Circle(4).move({ x: [0, 10], duration: 1000 });
    const second = Circle(4).move({ x: [0, 5], duration: 500 });

    const seq = sequence(first, second);

    expect(seq.evaluate(500).length).toBe(1);
    expect(seq.evaluate(1200).length).toBe(2);
  });

  it('starts items at a scheduled time', () => {
    const group = on('scene+200', Circle(3));

    expect(group.evaluate(100).length).toBe(0);
    expect(group.evaluate(200).length).toBe(1);
  });
});
