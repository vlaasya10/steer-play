import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, Check } from 'lucide-react';
import GameShell from '../../components/GameShell';
import GameProgress from '../../components/GameProgress';
import ScienceReveal from '../../components/ScienceReveal';
import EntertainmentCompletion from '../../components/EntertainmentCompletion';
import RoundOutcome from '../../components/RoundOutcome';
import { SignalGlyph } from '../../components/GameIllustrations';
import { gameScience } from '../../data/gameScienceContent';
import { createSeed, isValidSeed } from '../../utils/quizEngine';
import { useGameEvents } from '../../hooks/useGameEvents';
import { generateSignalPatterns } from './signalPatterns';
import { advanceSignal, chooseSignal, createSignalState, togglePattern, validateSignalAnswer } from './signalLogic';
import '../../styles/entertainment.css';

function Challenge({ seed }: { seed: string }) {
  const rounds = useMemo(() => generateSignalPatterns(seed), [seed]);
  const [state, setState] = useState(createSignalState);
  const [run, setRun] = useState(0);
  const current = rounds[state.round];
  const selected = state.answers[state.round];
  const memory = current.id === 'memory';
  const observing = memory && state.memoryVisible;
  const firstChoice = useRef<HTMLButtonElement>(null);
  const hideButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (memory && state.stage === 'play' && selected === null) (observing ? hideButton : firstChoice).current?.focus({ preventScroll: true });
  }, [memory, observing, state.stage, selected]);
  useGameEvents('signal-rush', run, state.stage, state.round, state.answers.filter(answer => answer !== null).length);
  const next = () => setState(previous => advanceSignal(previous));
  function replay() { setState(createSignalState()); setRun(previous => previous + 1); }
  const step = state.stage === 'play' ? state.round : state.stage === 'science' ? 3 : 4;

  return <GameShell scrollOnStageChange title="SIGNAL RUSH" duration="3 signals · ~30 sec" step={step} stageKey={`signal-${state.stage}-${state.round}`} progress={<GameProgress step={step} labels={['Match', 'Remember', 'Focus', 'Discover', 'Take away']} />}>
    {state.stage === 'play' && <section className="signal-game" aria-labelledby="signal-heading">
      <span className="eyebrow">ROUND {state.round + 1} / 3 · YOU CONTROL THE PACE</span>
      <h1 id="signal-heading">{state.round === 0 ? 'Can you match the signal?' : current.title}</h1>
      <p className="signal-instruction">{memory && !observing ? 'Which symbol was in the middle?' : current.instruction}</p>
      <div className={`signal-stage ${current.id === 'focus' ? 'competing-signals' : ''}`}>
        {memory ? <div className="memory-pattern" role="img" aria-label={observing ? `Pattern: ${current.sequence!.join(', ')}` : 'Pattern hidden. Remember the middle symbol.'}>{current.sequence!.map((symbol, index) => <span key={index}>{observing ? <SignalGlyph symbol={symbol} /> : <span className="hidden-symbol" aria-hidden="true">{index === 1 ? '?' : '·'}</span>}</span>)}</div> : <>
          {current.id === 'focus' && <ArrowLeft className="distractor-arrow" size={36} aria-hidden="true" />}
          <div className="target-symbol"><span className="eyebrow">{current.id === 'focus' ? 'MATCH THIS SHAPE' : 'YOUR TARGET'}</span><SignalGlyph symbol={current.target} /><span>{current.target}</span></div>
          {current.id === 'focus' && <ArrowRight className="distractor-arrow" size={36} aria-hidden="true" />}
        </>}
      </div>
      {observing ? <button ref={hideButton} className="button primary hide-pattern" onClick={() => setState(previous => togglePattern(previous))}>I’ve got the pattern <ArrowRight size={17} /></button> : <fieldset className="symbol-choices" disabled={selected !== null} aria-label="Choose the matching symbol"><legend className="sr-only">{memory ? 'Choose the middle symbol' : 'Match the target symbol'}</legend>{current.options.map((symbol, index) => <button ref={index === 0 ? firstChoice : undefined} key={`${current.id}-${symbol}`} onClick={() => setState(previous => chooseSignal(previous, index, rounds))} className={`${selected === index ? 'selected' : ''} ${selected !== null && validateSignalAnswer(current, index) ? 'supported' : ''}`}><SignalGlyph symbol={symbol} /><span>{symbol}</span>{selected !== null && validateSignalAnswer(current, index) && <small><Check size={12} aria-hidden="true" /> Correct match</small>}{selected === index && !validateSignalAnswer(current, index) && <small>Your choice</small>}</button>)}</fieldset>}
      {memory && !observing && selected === null && <button className="text-link show-pattern" onClick={() => setState(previous => togglePattern(previous))}><Eye size={15} /> Show the pattern again</button>}
      {selected !== null && <RoundOutcome heading={validateSignalAnswer(current, selected) ? 'Signal found.' : 'Here’s the match.'} body={memory ? `The middle symbol was ${current.target}. You can always look again on a replay.` : `The matching shape is ${current.target}.${current.id === 'focus' ? ' The arrows were just distractions.' : ' Next, try holding a pattern in mind.'}`} nextLabel={state.round === 2 ? 'Follow the science' : 'Next signal'} onNext={next} />}
      {selected === null && <p className="entertainment-quiet">No countdown. No audio. Each new round waits for you.</p>}
    </section>}
    {state.stage === 'science' && <ScienceReveal article={gameScience.signal} onContinue={next} />}
    {state.stage === 'complete' && <EntertainmentCompletion game="signal-rush" article={gameScience.signal} path={`/play/signal-rush?seed=${encodeURIComponent(seed)}`} title="Three signals. A new perspective." onReplay={replay} />}
  </GameShell>;
}

export default function SignalRush() {
  const [params] = useSearchParams();
  const seed = params.get('seed');
  if (!isValidSeed(seed)) return <Navigate replace to={`/play/signal-rush?seed=${createSeed()}`} />;
  return <Challenge key={seed} seed={seed} />;
}
