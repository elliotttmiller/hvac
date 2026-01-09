// Lightweight console capture utility — scoped, safe, and reversible.
// Usage: const stop = startConsoleCapture((line) => { ... });
// Call stop() to restore original console methods.

type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

function safeSerialize(arg: any, maxLen = 2000): string {
  try {
    if (typeof arg === 'string') return arg;
    if (arg instanceof Error) return arg.stack || arg.message || String(arg);
    // Try JSON stringify; fall back to String
    const s = JSON.stringify(arg, null, 2);
    if (s.length > maxLen) return s.slice(0, maxLen) + '...';
    return s;
  } catch (e) {
    try { return String(arg); } catch { return '[unserializable]'; }
  }
}

export function startConsoleCapture(emit: (line: string) => void) {
  const levels: ConsoleLevel[] = ['log','info','warn','error','debug'];
  const originals: Partial<Record<ConsoleLevel, (...args: any[]) => void>> = {};

  levels.forEach((lvl) => {
    originals[lvl] = (console as any)[lvl].bind(console);
    (console as any)[lvl] = (...args: any[]) => {
      try {
        const text = args.map(a => safeSerialize(a)).join(' ');
        const ts = new Date().toISOString();
        const line = `${ts} [${lvl}] ${text}`;
        // Best-effort emit without throwing
        try { emit(line); } catch(e) { /* swallow */ }
      } catch (e) {
        // swallow
      }
      // Always call original so DevTools still shows logs
      originals[lvl]!.apply(console, args as any);
    };
  });

  return function stopConsoleCapture() {
    levels.forEach((lvl) => {
      if (originals[lvl]) (console as any)[lvl] = originals[lvl]!;
    });
  };
}

export default startConsoleCapture;
