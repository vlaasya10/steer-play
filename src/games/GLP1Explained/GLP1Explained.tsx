import { useEffect, useReducer, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Share2, Sparkles, Check } from 'lucide-react';
import GameShell from '../../components/GameShell';
import GameProgress from '../../components/GameProgress';
import GameCompletionScreen from '../../components/GameCompletionScreen';
import ShareChallenge from '../../components/ShareChallenge';
import { glp1Questions, getHealthQuestion, glp1Path, glp1Copy } from '../../data/glp1Questions';
import { scienceSources } from '../../data/scientificContent';
import type { HealthQuestion } from '../../types/healthQuestion';
import { trackEvent } from '../../utils/events';
import { useGLP1Events } from '../../hooks/useGLP1Events';
import { createGLP1State, glp1Reducer } from './glp1Logic';
import TopicSources, { DeeperExplanation } from './TopicSources';
import TopicVisual from './TopicVisual';
import '../../styles/glp1.css';

export function TopicCards({ library = false }: { library?: boolean }) {
  return <div className="glp-topic-grid" aria-label="Choose a learning topic">{glp1Questions.map((question,index) => <Link key={question.id} className="glp-topic-card" to={glp1Path(question.slug, library ? 'library' : undefined)}><span className="glp-card-number">0{index+1}</span><span>{question.title}</span><ArrowRight size={17} aria-hidden="true" /></Link>)}</div>;
}
function Selection({ library, invalid }: { library: boolean; invalid: boolean }) {
  return <section className="glp-selection"><span className="eyebrow">YOUR QUESTIONS. CLEAR EXPLANATIONS.</span><h1>{library ? 'A question worth exploring.' : <>GLP-1.<br /><em>Without the confusion.</em></>}</h1><p className="glp-subtitle">{library ? 'Six topics. Explore in any order, at your own pace.' : 'Pick a question. Discover what the science actually says.'}</p>{invalid && <p className="glp-caveat">That topic or section isn’t available. Choose one below.</p>}<h2>{library ? 'Explore All Questions' : 'GLP-1: Myth or Fact?'}</h2><p className="glp-selection-hint">{library ? 'No challenge required. Open a topic to explore its explanation.' : 'Choose what you want to understand.'}</p><TopicCards library={library} /><p className="glp-scope">{glp1Copy.scope}</p>{!library && <Link className="text-link" to={glp1Path(undefined, 'library')}><BookOpen size={16} />Explore All Questions</Link>}<p className="glp-review">Educational content · Pending clinical review</p><Link className="text-link glp-library-return" to="/"><ArrowLeft size={15} />Back to discovery</Link></section>;
}
function TopicReading({ topic }: { topic: HealthQuestion }) {
  const [active, setActive] = useState<number | null>(null);
  const [explored, setExplored] = useState<number[]>([]);
  return <section className="glp-reading"><Link className="text-link" to={glp1Path(undefined, 'library')}><ArrowLeft size={15} />All questions</Link><span className="eyebrow">{topic.category} · OPTIONAL LEARNING</span><h1>{topic.title}</h1><p className="glp-essential">{topic.shortExplanation}</p><TopicVisual topic={topic} active={active} explored={explored} onSelect={index => { setActive(index); setExplored(previous => [...new Set([...previous,index])]); }} /><aside className="glp-takeaway"><span className="eyebrow">THE IDEA TO KEEP</span><p>{topic.keyTakeaway}</p></aside><DeeperExplanation topic={topic} /><TopicSources topic={topic} /><div className="glp-actions"><Link className="button primary" to={glp1Path(topic.slug)}>Try this question <ArrowRight size={17} /></Link><Link className="button outline" to={glp1Path(topic.slug, 'share')}><Share2 size={16} />Share What You Learned</Link><a className="text-link" href="https://steerclub.com" target="_blank" rel="noopener noreferrer" onClick={exploreSteer}>Explore Steer ↗</a><Link className="text-link" to="/">Explore More Games <ArrowRight size={15} /></Link></div></section>;
}
function exploreSteer() { trackEvent({ name: 'explore_steer_clicked', game: 'glp1' }); trackEvent({ name: 'steer_cta_clicked', game: 'glp1' }); }
function EducationalCard({ topic }: { topic: HealthQuestion }) {
  return <section className="glp-share-page"><Link className="text-link" to={glp1Path(topic.slug)}><ArrowLeft size={15} />Back to your question</Link><article className="glp-knowledge-card"><div className="glp-card-brand"><span className="wordmark">steer.</span><span className="eyebrow">SOMETHING WORTH KNOWING</span></div><Sparkles className="glp-share-star" size={38} aria-hidden="true" /><span className="eyebrow">GLP-1, EXPLAINED</span><h1>{topic.shareTitle}</h1><p>{topic.shareText}</p><p className="glp-review">Educational content · Pending clinical review</p><p className="glp-scope">{glp1Copy.scope}</p><Link className="text-link" to={glp1Path(topic.slug, 'library')}>Read the explanation <ArrowRight size={16} /></Link></article><ShareChallenge linkKind="learning" path={glp1Path(topic.slug, 'library')} title={`Steer Play · ${topic.shareTitle}`} text={topic.shareText} label="Share What You Learned" onResult={result => { if (result === 'shared') trackEvent({ name: 'knowledge_card_shared', game: 'glp1' }); if (result === 'copied') trackEvent({ name: 'knowledge_card_copied', game: 'glp1' }); }} /><TopicSources topic={topic} /><Link className="text-link glp-library-return" to={glp1Path(undefined, 'library')}>Explore All Questions <ArrowRight size={16} /></Link></section>;
}

function Journey({ topic, view, invalid }: { topic?: HealthQuestion; view: string; invalid: boolean }) {
  const [state, dispatch] = useReducer(glp1Reducer, undefined, createGLP1State);
  const [run, setRun] = useState(0);
  const feedback = useRef<HTMLDivElement>(null);
  const playing = !!topic && view === 'quick';
  useGLP1Events(state, run, playing);
  useEffect(() => { if (state.answer !== null && state.stage === 'question') feedback.current?.focus({ preventScroll: true }); }, [state.answer, state.stage]);
  const step = !topic ? 0 : state.stage === 'question' ? 1 : state.stage === 'explanation' ? 2 : 3;
  const next = () => dispatch({ type: 'next' });
  const replay = () => { dispatch({ type: 'replay' }); setRun(value => value+1); };
  return <GameShell title="GLP-1, EXPLAINED" duration="One question · ~30–60 sec" step={step} stageKey={`glp1-${topic?.slug ?? 'choose'}-${view}-${state.stage}`} scrollOnStageChange progress={view === 'quick' ? <GameProgress step={step} labels={['Choose', 'Answer', 'Explore', 'Take away']} /> : <div className="glp-mode-label"><BookOpen size={15} />{view === 'share' ? 'An educational card to share' : 'Explore All Questions · optional learning'}</div>}>
    <div className="glp-experience">
      {!topic ? <Selection library={view === 'library'} invalid={invalid} /> : view === 'library' ? <TopicReading topic={topic} /> : view === 'share' ? <EducationalCard topic={topic} /> : <>
        {state.stage === 'question' && <section className="glp-question"><Link className="text-link" to={glp1Path()}><ArrowLeft size={15} />Choose another topic</Link><span className="eyebrow">{topic.category} · MYTH OR FACT?</span><h1>{topic.question}</h1><p className="glp-answer-hint">One question. A useful explanation either way.</p><fieldset className="glp-answers" disabled={state.answer !== null} aria-label="Choose an answer"><legend className="sr-only">Choose an answer</legend>{topic.choices.map((choice,index) => <button key={choice} className={`${state.answer === index ? 'selected' : ''} ${state.answer !== null && topic.correctIndex === index ? 'supported' : ''}`} onClick={() => dispatch({ type: 'answer', index })}><span>{choice}</span>{state.answer !== null && topic.correctIndex === index ? <Check size={18} /> : <ArrowRight size={18} />}{state.answer !== null && topic.correctIndex === index && <small>Correct explanation</small>}{state.answer === index && topic.correctIndex !== index && <small>Your choice</small>}</button>)}</fieldset>{state.answer !== null && <div className="glp-feedback" ref={feedback} tabIndex={-1} role="status"><h2>{state.answer === topic.correctIndex ? topic.answerLabel : 'Here’s the useful distinction.'}</h2><p>{state.answer !== topic.correctIndex && <strong>{topic.choices[topic.correctIndex]}. </strong>}{topic.shortExplanation}</p><button className="button primary" onClick={next}>Explore the explanation <ArrowRight size={17} /></button></div>}<TopicSources topic={topic} /></section>}
        {state.stage === 'explanation' && <section className="glp-explanation"><span className="eyebrow">{topic.category} · FOLLOW THE IDEA</span><h1>{topic.title}</h1><p className="glp-essential">{topic.shortExplanation}</p><TopicVisual topic={topic} active={state.active} explored={state.explored} onSelect={index => dispatch({ type: 'explore', index, count: topic.nodes.length })} />{state.explored.length > 0 && <aside className="glp-takeaway"><span className="eyebrow">ONE IDEA TO KEEP</span><p>{topic.keyTakeaway}</p></aside>}<button className="button primary glp-finish" disabled={state.explored.length === 0} onClick={next}>Take this idea with you <ArrowRight size={17} /></button>{state.explored.length === 0 && <p className="glp-scope">Explore a label above to reveal the takeaway.</p>}<DeeperExplanation topic={topic} /><TopicSources topic={topic} /></section>}
        {state.stage === 'complete' && <GameCompletionScreen heading="One question clearer." takeaway={topic.keyTakeaway} intro={glp1Copy.intro} introHeading="Care that starts with understanding." source={scienceSources[topic.sourceIds[0]]} onReplay={replay} onExplore={exploreSteer} discovery={<TopicSources topic={topic} />} additionalActions={<Link className="button outline glp-extra-action" to={glp1Path(undefined, 'library')}><BookOpen size={17} />Explore Another Question</Link>} sharing={<Link className="button outline glp-extra-action" to={glp1Path(topic.slug, 'share')}><Share2 size={17} />Share What You Learned</Link>} />}
        {state.stage !== 'complete' && <Link className="text-link glp-library-return" to={glp1Path(undefined, 'library')}>Explore All Questions <ArrowRight size={15} /></Link>}
      </>}
    </div>
  </GameShell>;
}

export default function GLP1Explained() {
  const [params] = useSearchParams();
  const opened = useRef(false);
  useEffect(() => { if (!opened.current) { opened.current = true; trackEvent({ name: 'glp1_explained_opened', game: 'glp1' }); } }, []);
  const topic = getHealthQuestion(params.get('topic'));
  const requested = params.get('view');
  const view = requested === 'library' || requested === 'share' && topic ? requested : 'quick';
  const invalid = !!(params.get('topic') && !topic || requested && !['library','share'].includes(requested) || requested === 'share' && !topic);
  return <Journey key={topic?.slug ?? 'index'} topic={topic} view={view} invalid={invalid} />;
}

