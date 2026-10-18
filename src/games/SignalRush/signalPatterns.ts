export const symbolNames = ['Circle', 'Diamond', 'Triangle', 'Square'] as const;
export type SignalSymbolName = typeof symbolNames[number];
export interface SignalRound {
  id: 'match' | 'memory' | 'focus';
  title: string;
  instruction: string;
  target: SignalSymbolName;
  options: SignalSymbolName[];
  sequence?: [SignalSymbolName, SignalSymbolName, SignalSymbolName];
}

export function generateSignalPatterns(seed: string): SignalRound[] {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  function next() { state ^= state << 13; state ^= state >>> 17; state ^= state << 5; return (state >>> 0) / 4294967296; }
  function pick() { return symbolNames[Math.floor(next() * symbolNames.length)]; }
  function choices(target: SignalSymbolName) {
    const pool = symbolNames.filter(symbol => symbol !== target);
    const options = [target, ...pool.slice(0, 2)];
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
    return options;
  }
  const first = pick();
  const outer = pick();
  const middle = symbolNames[(symbolNames.indexOf(outer) + 1 + Math.floor(next() * 3)) % 4];
  const final = pick();
  return [
    { id: 'match', title: 'Match the signal.', instruction: 'Tap the symbol that matches the target.', target: first, options: choices(first) },
    { id: 'memory', title: 'Hold that pattern.', instruction: 'Remember the middle symbol. Hide the pattern when you’re ready.', target: middle, sequence: [outer, middle, outer], options: choices(middle) },
    { id: 'focus', title: 'Follow the shape.', instruction: 'Ignore the arrows. Match the shape in the middle.', target: final, options: choices(final) },
  ];
}
