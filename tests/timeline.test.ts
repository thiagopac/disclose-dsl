import { describe, expect, it } from 'vitest';
import { Timeline } from '../src/runtime/Timeline';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Timeline', () => {
  it('advances time when playing', async () => {
    const timeline = new Timeline();
    const t1 = timeline.now();
    await sleep(20);
    const t2 = timeline.now();
    expect(t2).toBeGreaterThan(t1);
  });

  it('pauses and resumes', async () => {
    const timeline = new Timeline();
    await sleep(10);
    timeline.pause();
    const paused = timeline.now();
    await sleep(10);
    expect(timeline.now()).toBeCloseTo(paused, -1);

    timeline.play();
    await sleep(10);
    expect(timeline.now()).toBeGreaterThan(paused);
  });

  it('clamps with duration', async () => {
    const timeline = new Timeline();
    timeline.setDuration(30);
    await sleep(50);
    expect(timeline.now()).toBeLessThanOrEqual(30);
  });

  it('seeks and scrubs', () => {
    const timeline = new Timeline();
    timeline.seek(100);
    expect(timeline.now()).toBeCloseTo(100, -1);

    timeline.scrub(200);
    const t1 = timeline.now();
    expect(t1).toBeCloseTo(200, -1);
  });

  it('applies timeScale', async () => {
    const timeline = new Timeline();
    timeline.setTimeScale(2);
    const t1 = timeline.now();
    await sleep(10);
    const t2 = timeline.now();
    expect(t2 - t1).toBeGreaterThan(10);
  });
});
