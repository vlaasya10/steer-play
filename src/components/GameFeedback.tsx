import { ArrowRight, Check, Eye } from 'lucide-react';

export default function GameFeedback({ correct, onContinue }: { correct: boolean; onContinue: () => void }) {
  return <div className="feedback" role="status"><div className="feedback-icon">{correct ? <Check size={21} /> : <Eye size={21} />}</div><div><h2>{correct ? 'You noticed the little things.' : 'Easy to miss, isn’t it?'}</h2><p>The chutney bowl disappeared. The plate, chai, spoon and napkin stayed exactly where they were.</p></div><button className="button primary" onClick={onContinue}>There’s more to this <ArrowRight size={18} /></button></div>;
}
