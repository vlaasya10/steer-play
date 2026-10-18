import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShareChallenge from '../../components/ShareChallenge';
import { metabolismLessons as lessons } from '../../data/metabolismLessons';
import { trackEvent } from '../../utils/events';
import LessonNotes from './LessonNotes';
import { ConversationDiagram } from './ScienceDiagrams';

export const knowledgeCardPath = '/learn/metabolism?view=share';
export default function KnowledgeCard({ completed }: { completed: boolean }) {
  const value = lessons.knowledge;
  return <section className="knowledge-card-page" aria-labelledby="knowledge-card-heading"><Link className="text-link" to="/learn/metabolism"><ArrowLeft size={15} /> {completed ? 'Back to your discovery' : 'Back to Quick Play'}</Link>
    <div className="knowledge-card" data-content-id={value.id}><div className="knowledge-brand"><span className="wordmark">steer.</span><span>PLAY / SOMETHING WORTH KNOWING</span></div><span className="eyebrow">A SMALL DISCOVERY TO PASS ON</span><h1 id="knowledge-card-heading">{value.title}</h1><ConversationDiagram /><p>{value.simpleExplanation}</p><small className="knowledge-review">Educational content · Pending clinical review</small><p className="knowledge-caveat">{value.caveats[0]}</p><Link className="text-link" to="/learn/metabolism">Inside Your Metabolism <ArrowRight size={16} /></Link></div>
    <ShareChallenge linkKind="learning" label="Share What You Learned" title={value.title} text={value.simpleExplanation} path={knowledgeCardPath} onResult={result => {
      if (result === 'shared') trackEvent({ name: 'knowledge_card_shared', game: 'metabolism' });
      if (result === 'copied') trackEvent({ name: 'knowledge_card_copied', game: 'metabolism' });
    }} />
    <LessonNotes lesson={value} /><Link className="text-link" to="/">Explore More Games <ArrowRight size={15} /></Link>
  </section>;
}
