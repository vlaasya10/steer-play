import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { glp1Questions, glp1Path } from '../data/glp1Questions';
import TopicSources from '../games/GLP1Explained/TopicSources';
import '../styles/glp1.css';

export function HealthAudiencePreview() {
  const topic = glp1Questions[0];
  const [answer, setAnswer] = useState<number | null>(null);
  return <div className="glp-demo-preview"><span className="eyebrow">HEALTH INTEREST · EDUCATIONAL PREVIEW</span><h3>Heard about GLP-1? Start with the facts.</h3><p>Audience: adults curious about metabolic health. Selected for demonstration, with no health information inferred.</p><h3>{topic.question}</h3><fieldset disabled={answer !== null} aria-label="Demo myth or fact"><legend className="sr-only">Try the example question</legend>{topic.choices.map((choice,index) => <button key={choice} onClick={() => setAnswer(index)}>{choice}</button>)}</fieldset>{answer !== null && <><div role="status"><strong>{answer === topic.correctIndex ? topic.answerLabel : 'Here’s the useful distinction.'}</strong><p>{topic.shortExplanation}</p></div><button className="text-link" onClick={() => setAnswer(null)}>Reset example</button><TopicSources topic={topic} /></>}<div className="audience-actions"><Link className="button primary" to="/ad/glp1">Preview this Reel <ArrowRight size={17} /></Link><Link className="text-link" to="/learn/glp1">Explore the science <ArrowRight size={16} /></Link></div></div>;
}
export default function GLP1Demo() {
  return <section className="glp-demo" aria-labelledby="glp-demo-heading"><span className="eyebrow">07 / QUESTIONS BEFORE A CONVERSATION</span><h2 id="glp-demo-heading">GLP-1, Explained</h2><p>People who already have questions about metabolic health need trustworthy answers, not another generic advertisement.</p><p>Six immediate topic choices lead to one question, useful feedback and an interactive illustration. Learning is complete before the optional Steer handoff.</p><div className="glp-demo-actions"><Link className="button primary" to="/learn/glp1">Preview GLP-1, Explained <ArrowRight size={17} /></Link><Link className="text-link" to={glp1Path(undefined, 'library')}><BookOpen size={16} />Explore the question library</Link><a className="text-link" href="https://steerclub.com" target="_blank" rel="noopener noreferrer">Explore Steer ↗</a></div><p className="glp-scope">Select Health interest in the audience preview above to try the source-backed myth-or-fact example and its simulated Reel. The first-screen hook, interactive learning and voluntary handoff are implemented; under-one-minute human completion is a design target awaiting usability testing.</p></section>;
}
