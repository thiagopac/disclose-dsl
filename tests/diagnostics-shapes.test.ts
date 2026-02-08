import { beforeEach, describe, expect, it } from 'vitest';
import { Diagnostics } from '../src/core/Diagnostics';
import { Arc } from '../src/dsl/Arc';
import { Image } from '../src/dsl/Image';
import { Path } from '../src/dsl/Path';

function hasDiagnostic(message: string): boolean {
  return Diagnostics.getAll().some((d) => d.message === message);
}

describe('Diagnostics (shape validation)', () => {
  beforeEach(() => {
    Diagnostics.clear();
  });

  it('warns for invalid arc radius', () => {
    Arc(0).evaluate(0);
    expect(hasDiagnostic('Arc radius must be > 0')).toBe(true);
  });

  it('warns for missing image src', () => {
    Image('').evaluate(0);
    expect(hasDiagnostic('Image src is required')).toBe(true);
  });

  it('warns for path with too few points', () => {
    Path([{ x: 0, y: 0 }]).evaluate(0);
    expect(hasDiagnostic('Path should have at least 2 points')).toBe(true);
  });
});
