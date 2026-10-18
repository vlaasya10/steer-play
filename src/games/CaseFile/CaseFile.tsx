import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Search, Plus, Minus } from 'lucide-react';
import GameShell from '../../components/GameShell';
import GameProgress from '../../components/GameProgress';
import ScienceReveal from '../../components/ScienceReveal';
import EntertainmentCompletion from '../../components/EntertainmentCompletion';
import RoundOutcome from '../../components/RoundOutcome';
import { ClueIllustration } from '../../components/GameIllustrations';
import { gameScience } from '../../data/gameScienceContent';
import { useGameEvents } from '../../hooks/useGameEvents';
import { officeCase } from './caseScenarios';
import { advanceCase, chooseDeduction, createCaseState, inspectClue } from './caseLogic';
import '../../styles/entertainment.css';

export default function CaseFile() {
  const [params] = useSearchParams();
  const [state, setState] = useState(createCaseState);
  const [run, setRun] = useState(0);
  const allInspected = state.inspected.every(Boolean);
  const stage = state.stage === 'board' || state.stage === 'deduction' ? 'play' : state.stage;
  const completedRounds = (allInspected ? 1 : 0) + (state.answer !== null ? 1 : 0);
  useGameEvents('case-file', run, stage, state.stage === 'board' ? 0 : 1, completedRounds);
  const next = () => setState(previous => advanceCase(previous));
  function replay() { setState(createCaseState()); setRun(previous => previous + 1); }
  const step = state.stage === 'board' ? 0 : state.stage === 'deduction' ? 1 : state.stage === 'science' ? 2 : 3;

  return <GameShell scrollOnStageChange title="THE CASE FILE" duration="A ~50-second mystery" step={step} stageKey={`case-${state.stage}`} progress={<GameProgress step={step} labels={['The clues', 'Deduce', 'Discover', 'Take away']} />}>
    {stage === 'play' && <section className="case-game" aria-labelledby="case-heading"><div className="case-file-label"><Search size={15} aria-hidden="true" /><span>CASE 001 / THE CHANGING ROUTINE</span><span>FICTIONAL ADULT</span></div>
      {params.get('case') && params.get('case') !== 'office' && <p className="parameter-note">That case isn’t available. You’re investigating the office case.</p>}
      <h1 id="case-heading">{state.stage === 'board' ? 'Three clues. One mystery. Can you solve it?' : 'What does the evidence support?'}</h1>
      {state.stage === 'board' ? <><div className="case-brief"><span className="eyebrow">{officeCase.title}</span><p>{officeCase.intro}</p></div><div className="mystery-board" aria-label="Clue board">{officeCase.clues.map((clue, index) => <article className={`clue-card ${state.expanded[index] ? 'open' : ''}`} key={clue.id}>
        <button aria-expanded={state.expanded[index]} aria-controls={`clue-${clue.id}`} onClick={() => setState(previous => inspectClue(previous, index))}><ClueIllustration kind={clue.icon} /><span><small>CLUE 0{index + 1}{state.inspected[index] ? ' · INSPECTED' : ''}</small><strong>{clue.title}</strong></span>{state.expanded[index] ? <Minus size={17} /> : <Plus size={17} />}</button>
        <div id={`clue-${clue.id}`} hidden={!state.expanded[index]} className="clue-detail"><p>{clue.detail}</p></div>
      </article>)}</div><div className="case-board-footer"><p aria-live="polite">{state.inspected.filter(Boolean).length} of 3 clues inspected.{!allInspected && ' Open each clue to build your case.'}</p><button className="button primary" disabled={!allInspected} onClick={next}>Make a deduction <ArrowRight size={17} /></button></div></> : <>
        <div className="evidence-strip" aria-label="Your evidence">{officeCase.clues.map(clue => <div key={clue.id}><ClueIllustration kind={clue.icon} /><span>{clue.title}</span><p>{clue.detail}</p></div>)}</div>
        <fieldset className="deduction-options" disabled={state.answer !== null}><legend>{officeCase.deduction}</legend>{officeCase.options.map((option, index) => <button key={option} className={`${state.answer === index ? 'selected' : ''} ${state.answer !== null && index === officeCase.correctIndex ? 'supported' : ''}`} onClick={() => setState(previous => chooseDeduction(previous, index))}><span className="prediction-letter">{String.fromCharCode(65 + index)}</span><span>{option}{state.answer !== null && index === officeCase.correctIndex && <small>Best supported conclusion</small>}{state.answer === index && index !== officeCase.correctIndex && <small>Your deduction</small>}</span>{state.answer !== null && index === officeCase.correctIndex ? <Check size={17} /> : <ArrowRight size={16} />}</button>)}</fieldset>
        {state.answer !== null && <RoundOutcome heading={gameScience.deduction.title} body={state.answer === officeCase.correctIndex ? 'You connected the clues without jumping to a cause.' : 'That conclusion asks more of the evidence than these clues can tell us.'} article={gameScience.deduction} nextLabel="Look at the bigger picture" onNext={next} />}
      </>}
    </section>}
    {state.stage === 'science' && <ScienceReveal article={gameScience.case} diagram="context" onContinue={next} />}
    {state.stage === 'complete' && <EntertainmentCompletion game="case-file" article={gameScience.case} path="/play/case-file?case=office" title="Case explored. Perspective widened." onReplay={replay} />}
  </GameShell>;
}
