import { beforeEach, describe, expect, it } from 'vitest';
import { Diagnostics } from '../src/core/Diagnostics';

describe('Diagnostics', () => {
  beforeEach(() => {
    Diagnostics.clear();
  });

  it('stores entries and clears them', () => {
    Diagnostics.add('warn', 'One');
    Diagnostics.add('error', 'Two');

    const items = Diagnostics.getAll();
    expect(items.length).toBe(2);
    expect(items[0].message).toBe('One');
    expect(items[1].level).toBe('error');

    Diagnostics.clear();
    expect(Diagnostics.getAll().length).toBe(0);
  });

  it('deduplicates with addOnce', () => {
    Diagnostics.addOnce('dup', 'warn', 'First');
    Diagnostics.addOnce('dup', 'warn', 'Second');

    const items = Diagnostics.getAll();
    expect(items.length).toBe(1);
    expect(items[0].message).toBe('First');
  });

  it('notifies listeners and allows unsubscribe', () => {
    let calls = 0;
    let lastCount = 0;
    const unsubscribe = Diagnostics.on((items) => {
      calls += 1;
      lastCount = items.length;
    });

    Diagnostics.add('warn', 'Hello');
    expect(calls).toBe(2); // initial + add
    expect(lastCount).toBe(1);

    unsubscribe();
    Diagnostics.add('warn', 'Bye');
    expect(calls).toBe(2);
  });
});
