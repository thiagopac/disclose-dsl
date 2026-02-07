export class Timeline {
  private start: number;
  private offset: number;
  private playing: boolean;
  private duration: number | null;
  private timeScale: number;

  constructor() {
    this.start = performance.now();
    this.offset = 0;
    this.playing = true;
    this.duration = null;
    this.timeScale = 1;
  }

  now(): number {
    if (this.playing) {
      const t = (performance.now() - this.start) * this.timeScale + this.offset;
      return this.clamp(t);
    }
    return this.clamp(this.offset);
  }

  reset(): void {
    this.start = performance.now();
    this.offset = 0;
  }

  play(): void {
    if (this.playing) return;
    this.start = performance.now();
    this.playing = true;
  }

  pause(): void {
    if (!this.playing) return;
    this.offset = this.now();
    this.playing = false;
  }

  seek(ms: number): void {
    this.offset = this.clamp(ms);
    if (this.playing) {
      this.start = performance.now();
    }
  }

  scrub(ms: number): void {
    this.seek(ms);
    this.pause();
  }

  setDuration(ms: number | null): void {
    this.duration = ms;
  }

  setTimeScale(value: number): void {
    this.timeScale = value;
  }

  private clamp(ms: number): number {
    if (this.duration == null) return ms;
    if (ms < 0) return 0;
    if (ms > this.duration) return this.duration;
    return ms;
  }
}
