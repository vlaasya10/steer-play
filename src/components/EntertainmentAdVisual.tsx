import { StoryIllustration, SignalGlyph, ClueIllustration } from './GameIllustrations';
import { generateSignalPatterns } from '../games/SignalRush/signalPatterns';

export default function EntertainmentAdVisual({ game }: { game: string }) {
  if (game === 'predict') return <div className="entertainment-ad-visual story-ad-visual"><StoryIllustration /><p><span>Early meeting.</span><span>Late shift.</span></p><small>Same lunch break. A different story?</small></div>;
  if (game === 'signal-rush') {
    const round = generateSignalPatterns('steer')[0];
    return <div className="entertainment-ad-visual signal-ad-visual"><span className="eyebrow">MATCH THIS SIGNAL</span><SignalGlyph symbol={round.target} /><div>{round.options.map(symbol => <span key={symbol}><SignalGlyph symbol={symbol} /><small>{symbol}</small></span>)}</div></div>;
  }
  return <div className="entertainment-ad-visual case-ad-visual"><span className="eyebrow">THE CHANGING ROUTINE · CASE 001</span><div>{(['clock', 'plate', 'calendar'] as const).map((kind, index) => <span key={kind}><ClueIllustration kind={kind} /><small>{['Sleep', 'Meals', 'Work'][index]}</small></span>)}</div><p>One clue never tells the whole story.</p></div>;
}
