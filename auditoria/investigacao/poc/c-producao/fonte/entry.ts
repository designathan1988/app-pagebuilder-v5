// Minimal entry: the app calls the probe behind import.meta.env.DEV and behind a constant the build replaces.
declare const __PROBE__: boolean;
export function start(): string {
  if (import.meta.env.DEV || __PROBE__) void import('./probe.ts').then((m) => m.installProbe());
  return 'app';
}
start();
