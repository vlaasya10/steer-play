import { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import ScienceFootnote from './ScienceFootnote';
import type { ScienceArticle } from '../data/gameScienceContent';

export default function RoundOutcome({ heading, body, article, nextLabel = 'Continue the story', onNext }: { heading: string; body?: string; article?: ScienceArticle; nextLabel?: string; onNext: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { panel.current?.focus({ preventScroll: true }); panel.current?.scrollIntoView?.({ block: 'nearest', behavior: 'instant' }); }, []);
  return <div className="round-outcome" tabIndex={-1} ref={panel} role="status"><h2><Sparkles size={18} aria-hidden="true" />{heading}</h2>{body && <p>{body}</p>}{article && <><p data-content-id={article.id}>{article.statement}</p><ScienceFootnote article={article} /></>}<button className="button primary" onClick={onNext}>{nextLabel}<ArrowRight size={17} /></button></div>;
}
