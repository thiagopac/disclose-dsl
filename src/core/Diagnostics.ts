export type DiagnosticLevel = 'error' | 'warn';

export type Diagnostic = {
  level: DiagnosticLevel;
  message: string;
  detail?: string;
  time: number;
};

type Listener = (items: Diagnostic[]) => void;

class DiagnosticsStore {
  private items: Diagnostic[] = [];
  private listeners: Listener[] = [];
  private keys = new Set<string>();

  add(level: DiagnosticLevel, message: string, detail?: string): void {
    this.items.push({ level, message, detail, time: Date.now() });
    this.emit();
  }

  addOnce(key: string, level: DiagnosticLevel, message: string, detail?: string): void {
    if (this.keys.has(key)) return;
    this.keys.add(key);
    this.add(level, message, detail);
  }

  clear(): void {
    this.items = [];
    this.keys.clear();
    this.emit();
  }

  getAll(): Diagnostic[] {
    return [...this.items];
  }

  on(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.getAll());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(): void {
    const snapshot = this.getAll();
    for (const listener of this.listeners) listener(snapshot);
  }
}

export const Diagnostics = new DiagnosticsStore();
