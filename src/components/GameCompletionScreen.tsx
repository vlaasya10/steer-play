import type { ReactNode } from 'react';
import { ArrowUpRight, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareChallenge, { type ShareChallengeProps } from './ShareChallenge';
import { scientificContent } from '../data/scientificContent';

interface CompletionProps {
  takeaway: string;
  onReplay: () => void;
  heading?: ReactNode;
  discovery?: ReactNode;
  intro?: string;
  source?: { title: string; url: string };
  share?: ShareChallengeProps;
  onExplore?: () => void;
  additionalActions?: ReactNode;
  sharing?: ReactNode;
  introHeading?: string;
}
export default function GameCompletionScreen({ takeaway, onReplay, heading, discovery, intro = scientificContent.steer, source = scientificContent.source, share, onExplore, additionalActions, sharing, introHeading = 'Care that sees the bigger picture.' }: CompletionProps) {
  return <section className="completion">
    <div className="completion-star"><Sparkles size={32} /></div>
    <span className="eyebrow">A LITTLE PLAY. A NEW PERSPECTIVE.</span>
    <h1>{heading ?? <>Curiosity looks<br /><em>good on you.</em></>}</h1>
    <p className="lead">{takeaway}</p>{discovery}
    <div className="steer-intro"><span className="wordmark">steer.</span><h2>{introHeading}</h2><p>{intro}</p><a className="button primary" href="https://steerclub.com" target="_blank" rel="noopener noreferrer" onClick={onExplore}>Explore Steer <span aria-hidden="true">→</span><span className="sr-only"> (opens in a new tab)</span></a><small>Explore if you’re curious. There’s no next step required.</small></div>
    {additionalActions}
    {sharing ?? <ShareChallenge {...share} />}
    <div className="completion-secondary"><button className="text-link" onClick={onReplay}><RotateCcw size={15} /> Play Again</button><Link className="text-link" to="/">Explore More Games <ArrowRight size={15} /></Link></div>
    <p className="medical-note">{scientificContent.reviewStatus}. Educational only. Medical decisions belong with qualified clinicians.</p>
    <a className="completion-source text-link" href={source.url} target="_blank" rel="noopener noreferrer">Science source: {source.title} <ArrowUpRight size={12} /></a>
  </section>;
}
