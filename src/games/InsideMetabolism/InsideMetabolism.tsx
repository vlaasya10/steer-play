import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowLeft, Check, BookOpen, Share2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import GameShell from '../../components/GameShell';
import GameCompletionScreen from '../../components/GameCompletionScreen';
import ScienceReveal from '../../components/ScienceReveal';
import { metabolismLessons as lessons, metabolismCopy as copy, lessonAsArticle } from '../../data/metabolismLessons';
import { scienceSources } from '../../data/scientificContent';
import { useMetabolismEvents } from '../../hooks/useMetabolismEvents';
import { trackEvent } from '../../utils/events';
import LessonNotes from './LessonNotes';
import LearningHub, { deeperPath, TreatmentNote } from './LearningHub';
import KnowledgeCard, { knowledgeCardPath } from './KnowledgeCard';
import { BiologyMap, ConversationDiagram, GlucoseDiagram, LunchIllustration, TeamSummary } from './ScienceDiagrams';
import { canAdvanceMetabolism, createMetabolismState, metabolismReducer, metabolismStages } from './metabolismLogic';
import '../../styles/entertainment.css';
import '../../styles/metabolism.css';

function Feedback({ children }: { children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { panel.current?.focus({ preventScroll: true }); panel.current?.scrollIntoView?.({ block: 'nearest', behavior: 'instant' }); }, []);
  return <div className="metabolism-feedback" tabIndex={-1} ref={panel} role="status">{children}</div>;
}
function Choices({ label, choices, selected, correct, onAnswer }: { label: string; choices: readonly string[]; selected: number | null; correct: number; onAnswer: (choice: number) => void }) {
  return <fieldset className="metabolism-choices" disabled={selected !== null} aria-label={label}><legend className="sr-only">{label}</legend>{choices.map((choice, index) => <button key={choice} className={`${selected === index ? 'chosen' : ''} ${selected !== null && index === correct ? 'correct' : ''}`} onClick={() => onAnswer(index)}><span>{String.fromCharCode(65 + index)}</span><span>{choice}{selected !== null && index === correct && <small>Correct explanation</small>}{selected === index && index !== correct && <small>Your choice</small>}</span>{selected !== null && index === correct ? <Check size={17} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</button>)}</fieldset>;
}

export default function InsideMetabolism() {
  const [params] = useSearchParams();
  const requestedView = params.get('view');
  const view = requestedView === 'deeper' || requestedView === 'share' ? requestedView : 'quick';
  const [state, dispatch] = useReducer(metabolismReducer, undefined, createMetabolismState);
  const [run, setRun] = useState(0);
  const [digestFocus, setDigestFocus] = useState(0);
  const [glpFocus, setGlpFocus] = useState(0);
  const glucosePanel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.stage !== 'glucose' || state.glucoseOrder.length === 0) return;
    const target = state.glucoseOrder.length < 3
      ? glucosePanel.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')
      : glucosePanel.current?.closest('section')?.querySelector<HTMLButtonElement>('.metabolism-next');
    target?.focus({ preventScroll: true });
  }, [state.stage, state.glucoseOrder.length]);
  const stageIndex = metabolismStages.indexOf(state.stage);
  useMetabolismEvents(state, run, view);
  function replay() { dispatch({ type: 'replay' }); setDigestFocus(0); setGlpFocus(0); setRun(value => value + 1); }
  const next = () => dispatch({ type: 'next' });
  const nextButton = (label: string) => <button className="button primary metabolism-next" disabled={!canAdvanceMetabolism(state)} onClick={next}>{label}<ArrowRight size={17} /></button>;
  const stageLabels = ['After lunch', 'Follow the food', 'Glucose', 'Gut + brain', 'Meet GLP-1', 'A wider picture', 'Your discovery', 'Complete'];
  const progress = view === 'quick' ? <div className="metabolism-progress"><div><span>{stageIndex < 7 ? `${stageIndex + 1} / 7 · ${stageLabels[stageIndex]}` : 'A new perspective, yours to keep.'}</span><Link to={deeperPath()}>Explore deeper <ArrowRight size={12} /></Link></div><div role="progressbar" aria-label="Learning progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={stageIndex} aria-valuetext={stageLabels[stageIndex]}><i style={{ width: `${stageIndex / 7 * 100}%` }} /></div></div> : <div className="learning-mode-label"><BookOpen size={15} /> {view === 'deeper' ? 'Explore deeper · optional learning' : 'A nonpersonal discovery to share'}</div>;

  return <GameShell title="INSIDE YOUR METABOLISM" duration="Quick Play · ~40–60 sec" step={0} stageKey={`metabolism-${view}-${params.get('chapter') ?? ''}-${state.stage}`} progress={progress} scrollOnStageChange>
    {view === 'deeper' ? <LearningHub chapterId={params.get('chapter')} completed={state.stage === 'complete'} /> : view === 'share' ? <KnowledgeCard completed={state.stage === 'complete'} /> : <div className="metabolism-experience">
      {requestedView && view === 'quick' && <p className="lesson-caveat">That section isn’t available. Quick Play is ready below.</p>}
      {state.stage === 'meal' && <section aria-labelledby="metabolism-heading"><span className="eyebrow">A LITTLE SCIENCE, STARTING WITH LUNCH.</span><h1 id="metabolism-heading">{copy.openingTitle}</h1><p className="metabolism-subtitle">Follow the signals. Discover the science.</p><LunchIllustration /><h2 className="meal-question">{copy.openingPrompt}</h2><Choices label="What happens after lunch?" choices={copy.openingChoices} selected={state.mealAnswer} correct={0} onAnswer={choice => dispatch({ type: 'answer-meal', choice })} />
        {state.mealAnswer !== null && <Feedback><h2>{state.mealAnswer === 0 ? 'That’s the first step.' : 'Here’s what happens first.'}</h2><p data-content-id={lessons.opening.id}>{lessons.opening.simpleExplanation}</p>{nextButton('Follow the food')}</Feedback>}<LessonNotes lesson={lessons.opening} />
      </section>}
      {state.stage === 'digestion' && <section aria-labelledby="metabolism-heading"><span className="eyebrow">THREE PLACES. A CONNECTED JOURNEY.</span><h1 id="metabolism-heading">Let’s follow what happens next.</h1><p className="metabolism-subtitle">Tap Mouth, Stomach, then Small intestine.</p><BiologyMap active={digestFocus} completed={state.digestionStep} sequential onSelect={index => { dispatch({ type: 'digest', index }); setDigestFocus(index); }} />
        {state.digestionStep >= 0 && <div className="organ-explanation" role="status" aria-live="polite" data-content-id={lessons[(['mouth', 'stomach', 'intestine'] as const)[digestFocus]].id}><h2>{lessons[(['mouth', 'stomach', 'intestine'] as const)[digestFocus]].title}</h2><p>{lessons[(['mouth', 'stomach', 'intestine'] as const)[digestFocus]].simpleExplanation}</p></div>}
        {nextButton('Connect the glucose story')}<LessonNotes lesson={lessons[(['mouth', 'stomach', 'intestine'] as const)[digestFocus]]} />
      </section>}
      {state.stage === 'glucose' && <section aria-labelledby="metabolism-heading"><span className="eyebrow">A SUGAR. A MESSENGER. SEVERAL PROCESSES.</span><h1 id="metabolism-heading">What happens to glucose after a meal?</h1><p className="metabolism-definition" data-content-id={lessons.insulin.id}>{lessons.insulin.detailedExplanation}</p><GlucoseDiagram active={Math.max(0, state.glucoseOrder.length - 1)} /><p className="sequence-instruction">Connect these three cards in learning order. Start with digestion.</p><div ref={glucosePanel} className="glucose-sequence" role="group" aria-label="Connect the glucose sequence">{[...state.glucoseOrder, ...[2, 0, 1].filter(index => !state.glucoseOrder.includes(index))].map(index => { const value = lessons[(['sugars', 'bloodstream', 'insulin'] as const)[index]]; return <button key={value.id} data-content-id={value.id} disabled={state.glucoseOrder.includes(index)} className={state.glucoseOrder.includes(index) ? 'placed' : ''} onClick={() => dispatch({ type: 'connect-glucose', index })}><span>{state.glucoseOrder.includes(index) ? index + 1 : '+'}</span><span>{value.simpleExplanation}</span>{state.glucoseOrder.includes(index) && <Check size={17} />}</button>; })}</div>
        {state.glucoseOrder.length > 0 && state.glucoseOrder.length < 3 && state.sequenceHint === null && <p className="sequence-hint" role="status">{state.glucoseOrder.length} of 3 cards connected. Find the next link.</p>}{state.sequenceHint !== null && <p className="sequence-hint" role="status">Try “{lessons[(['sugars', 'bloodstream', 'insulin'] as const)[state.sequenceHint]].title}” next. You can correct the sequence.</p>}
        {state.glucoseOrder.length === 3 && <p className="sequence-hint" role="status">Connected. {lessons.glucoseChapter.simpleExplanation}</p>}{nextButton('Follow a different signal')}<LessonNotes lesson={{ ...lessons.insulin, sourceIds: ['glucose', 'digestion', 'glp1'] }} />
      </section>}
      {state.stage === 'conversation' && <section aria-labelledby="metabolism-heading"><span className="eyebrow">MESSAGES YOU CAN’T SEE.</span><h1 id="metabolism-heading">{lessons.conversation.title}</h1><ConversationDiagram explored={state.signalExplored} onExplore={() => dispatch({ type: 'explore-signal' })} />
        {state.signalExplored && <><p className="organ-explanation" data-content-id={lessons.conversation.id}>{lessons.conversation.simpleExplanation}</p><h2 className="meal-question">{copy.gutPrompt}</h2><Choices label={copy.gutPrompt} choices={copy.gutChoices} selected={state.gutAnswer} correct={1} onAnswer={choice => dispatch({ type: 'answer-gut', choice })} />{state.gutAnswer !== null && <Feedback><h2>Several processes contribute.</h2><p data-content-id={lessons.multiple.id}>{lessons.multiple.simpleExplanation}</p>{nextButton('Meet one of the messengers')}</Feedback>}</>}
        <LessonNotes lesson={state.gutAnswer !== null ? lessons.multiple : lessons.conversation} />
      </section>}
      {state.stage === 'glp1' && <section aria-labelledby="metabolism-heading"><span className="eyebrow">ONE HORMONE. PART OF A MUCH BIGGER SYSTEM.</span><h1 id="metabolism-heading">{lessons.glp1.title}</h1><p className="metabolism-definition" data-content-id={lessons.glp1.id}>{lessons.glp1.simpleExplanation}</p><BiologyMap mode="glp1" active={glpFocus} onSelect={setGlpFocus} /><div className="organ-explanation" role="status" data-content-id={lessons[(['glpGut', 'glpPancreas', 'glpBrain'] as const)[glpFocus]].id}><h2>{lessons[(['glpGut', 'glpPancreas', 'glpBrain'] as const)[glpFocus]].title}</h2><p>{lessons[(['glpGut', 'glpPancreas', 'glpBrain'] as const)[glpFocus]].simpleExplanation}</p></div><p className="lesson-caveat">{lessons.glp1.detailedExplanation}</p><TreatmentNote />{nextButton('See the bigger picture')}<LessonNotes lesson={lessons.glp1} /></section>}
      {state.stage === 'check' && <section aria-labelledby="metabolism-heading"><span className="eyebrow">ONE IDEA TO TAKE WITH YOU.</span><h1 id="metabolism-heading">{copy.finalPrompt}</h1><TeamSummary /><Choices label={copy.finalPrompt} choices={copy.finalChoices} selected={state.finalAnswer} correct={1} onAnswer={choice => dispatch({ type: 'answer-final', choice })} />{state.finalAnswer !== null && <Feedback><h2>{state.finalAnswer === 1 ? 'Exactly. It’s a team effort.' : 'Here’s the bigger picture.'}</h2><p data-content-id={lessons.check.id}>{lessons.check.simpleExplanation}</p>{nextButton('See your discovery')}</Feedback>}<LessonNotes lesson={lessons.check} /></section>}
      {state.stage === 'summary' && <ScienceReveal article={lessonAsArticle(lessons.summary)} visual={<TeamSummary />} notesLabel="Sources & scientific notes" onContinue={next} />}
      {state.stage === 'complete' && <GameCompletionScreen heading={lessons.summary.title} takeaway={lessons.summary.simpleExplanation} introHeading="Curious about the bigger picture?" intro={copy.steerIntro} source={scienceSources.metabolism} onReplay={replay} onExplore={() => trackEvent({ name: 'steer_cta_clicked', game: 'metabolism' })}
        discovery={<TeamSummary />}
        additionalActions={<Link className="button outline metabolism-extra-action" to={deeperPath()}><BookOpen size={17} />Explore Deeper</Link>}
        sharing={<Link className="button outline metabolism-extra-action" to={knowledgeCardPath}><Share2 size={17} />Share What You Learned</Link>} />}
      {state.stage !== 'complete' && <Link className="text-link metabolism-back-library" to="/"><ArrowLeft size={14} /> Back to the game library</Link>}
    </div>}
  </GameShell>;
}
