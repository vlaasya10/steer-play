import { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import InterestSelector from './InterestSelector';
import { getInterestConfig } from '../data/interestConfigs';
import { createQuizSession, getQuizPath } from '../utils/quizEngine';
import type { InterestCategory } from '../types/quiz';
import { HealthAudiencePreview } from './GLP1Demo';

export default function AudiencePreview() {
  const [interest, setInterest] = useState<InterestCategory | 'health'>('food');
  const entertainmentInterest = interest === 'health' ? 'food' : interest;
  const config = getInterestConfig(entertainmentInterest);
  const question = useMemo(() => createQuizSession(entertainmentInterest, 'demo123').questions[0], [entertainmentInterest]);
  return <section className="audience-demo" aria-labelledby="audience-demo-heading">
    <div className="eyebrow">SIMULATED AUDIENCE PERSONALISATION</div>
    <h2 id="audience-demo-heading">Five interests. One shared discovery.</h2>
    <p>Five entertainment interests lead to the quiz. Health interest opens a dedicated GLP-1 learning journey. Scientific content is sourced. Qualified clinical review is pending.</p>
    <InterestSelector value={interest === 'health' ? undefined : interest} onChange={setInterest} />
    <button className="health-audience-tab" aria-pressed={interest === 'health'} onClick={() => setInterest('health')}>Health interest · GLP-1 questions</button>
    {interest === 'health' ? <HealthAudiencePreview /> : <><div className="audience-preview" aria-live="polite" aria-atomic="true">
      <div className="audience-ad-copy"><span className="eyebrow">SPONSORED · SIMULATED REEL</span><p className="audience-label">Audience: {config.label}</p><h3>{config.adHeadline}</h3><p>{config.description}</p></div>
      <div className="audience-question"><span className="eyebrow">QUIZ PREVIEW · QUESTION 1 OF 5</span><h3>{question.prompt}</h3><ol>{question.choices.map(choice => <li key={choice}>{choice}</li>)}</ol></div>
    </div>
    <div className="audience-actions"><Link className="button primary" to={`/ad/quiz?interest=${interest}&seed=demo123`}>Preview this Reel <ArrowUpRight size={17} /></Link><Link className="text-link" to={getQuizPath(entertainmentInterest, 'demo123')}>Play this quiz <ArrowRight size={16} /></Link></div></>}
    <p className="audience-limit">Illustrative interests selected by you. No access to actual Instagram Reel histories or Meta profiling. No health information is inferred.</p>
  </section>;
}
