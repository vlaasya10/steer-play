import type { ScenarioId } from '../games/PredictTheTwist/scenarios';
import type { SignalSymbolName } from '../games/SignalRush/signalPatterns';

export function StoryIllustration({ setting = 'office' }: { setting?: ScenarioId }) {
  return <svg viewBox="0 0 560 250" preserveAspectRatio="xMidYMid slice" className="story-illustration" aria-hidden="true">
    <rect width="560" height="250" rx="8" fill="#E6CBBD" />
    <path d="M20 222H540" stroke="#B58777" />
    <rect x="218" y="24" width="123" height="90" rx="4" fill="#F8F2EB" stroke="#B58777" />
    {setting === 'family' ? <><path d="M239 89V62l40-24 40 24v27Z" fill="#F5EBDF" stroke="#C04E2A" strokeWidth="2" /><path d="M271 89V68h17v21" fill="none" stroke="#C04E2A" /></> : setting === 'college' ? <g fill="#F5EBDF" stroke="#C04E2A" strokeWidth="2"><rect x="239" y="47" width="16" height="47" /><rect x="259" y="42" width="18" height="52" /><rect x="282" y="49" width="18" height="45" transform="rotate(-12 282 94)" /></g> : <><path d="M280 25v89m-61-45h121" stroke="#B58777" /><circle cx="314" cy="46" r="9" fill="#C04E2A" /><path d="M224 101l30-21 22 21 27-13 31 13" fill="none" stroke="#B58777" /></>}
    <g stroke="#661414" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M78 216v-39q0-36 50-36t50 36v39" fill="#F8F2EB" /><path d="M91 177l38 15 35-17" fill="none" />
      <ellipse cx="129" cy="104" rx="28" ry="34" fill="#F5EBDF" /><path d="M100 103q-7-48 32-42q37-4 26 45l-10-21q-30 10-48 18Z" fill="#661414" /><path d="M123 120q7 6 14 0" fill="none" /><path d="M119 140v8m20-8v8" />
      <path d="M382 216v-39q0-36 50-36t50 36v39" fill="#C04E2A" /><path d="M397 176l35 17 35-17" fill="none" />
      <ellipse cx="431" cy="104" rx="28" ry="34" fill="#F5EBDF" /><path d="M403 98q-6-34 31-36q29 0 27 33l-13-15q-21 9-45 5" fill="#661414" /><path d="M424 120q7 6 14 0" fill="none" /><path d="M422 140v8m20-8v8" />
      <path d="M118 108h1m20 0h1m-20-1h17m283 1h1m20 0h1" />
    </g>
    <rect x="48" y="207" width="465" height="13" rx="5" fill="#B58777" />
    <ellipse cx="205" cy="200" rx="36" ry="10" fill="#F8F2EB" stroke="#661414" /><ellipse cx="349" cy="200" rx="36" ry="10" fill="#F8F2EB" stroke="#661414" />
    <path d="M186 196q7-15 14-1m5 0q8-17 16 0m112 1q7-15 14-1m5 0q8-17 16 0" fill="#F5EBDF" stroke="#B58777" />
    <rect x="264" y="169" width="27" height="35" rx="4" fill="#F5EBDF" stroke="#661414" /><path d="M291 177q19-5 15 10q-2 9-15 6" fill="none" stroke="#661414" strokeWidth="2" />
    <path d="M45 181v-39m0 18q-26-8-17-25q22 2 17 25m1-10q-3-27 18-28q9 19-18 28" fill="none" stroke="#661414" strokeWidth="2" /><path d="M32 182h28l-4 22H36Z" fill="#C04E2A" />
  </svg>;
}

export function ClueIllustration({ kind }: { kind: 'clock' | 'plate' | 'calendar' }) {
  return <svg viewBox="0 0 100 100" className="clue-illustration" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'clock' && <><circle cx="50" cy="51" r="32" /><path d="M50 28v25l16 10M39 13h22M50 12v7M28 29l-5-5M73 28l5-5" /><circle cx="50" cy="51" r="3" /></>}
    {kind === 'plate' && <><circle cx="50" cy="50" r="29" /><circle cx="50" cy="50" r="21" /><path d="M10 20v21m8-21v21M10 31h8m-4 10v39m73-60v60m0-60q-12 13-10 27h10" /><path d="M40 54q10-21 23-4q-1 15-23 4" stroke="#C04E2A" /></>}
    {kind === 'calendar' && <><rect x="17" y="23" width="66" height="58" rx="5" /><path d="M17 39h66M32 16v15m36-15v15M30 51h8m13 0h8m13 0h0M30 65h8m13 0h8" /><circle cx="70" cy="65" r="7" stroke="#C04E2A" /></>}
  </svg>;
}

export function SignalGlyph({ symbol }: { symbol: SignalSymbolName }) {
  return <svg viewBox="0 0 100 100" className="signal-glyph" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
    {symbol === 'Circle' && <circle cx="50" cy="50" r="30" />}
    {symbol === 'Diamond' && <path d="M50 12 88 50 50 88 12 50Z" />}
    {symbol === 'Triangle' && <path d="M50 15 87 81H13Z" />}
    {symbol === 'Square' && <rect x="22" y="22" width="56" height="56" rx="3" />}
  </svg>;
}

export function EndingIllustration({ context }: { context: boolean }) {
  return <svg viewBox="0 0 180 100" className="ending-illustration" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
    {context ? <><path d="m49 30 43 40 41-44M49 30l84-4" strokeDasharray="4 5" /><circle cx="49" cy="30" r="13" /><circle cx="92" cy="70" r="13" /><circle cx="133" cy="26" r="13" /><path d="M90 15v22m-11-11h22" stroke="#C04E2A" /></> : <><circle cx="51" cy="50" r="18" /><path d="M70 50h60m-12-12 13 12-13 12" /><rect x="135" y="38" width="22" height="24" rx="3" /></>}
  </svg>;
}
