import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Moon } from 'lucide-react';
import GameShell from '../../components/GameShell';
import GameProgress from '../../components/GameProgress';
import ScienceReveal from '../../components/ScienceReveal';
import EntertainmentCompletion from '../../components/EntertainmentCompletion';
import RoundOutcome from '../../components/RoundOutcome';
import { StoryIllustration, EndingIllustration } from '../../components/GameIllustrations';
import { gameScience } from '../../data/gameScienceContent';
import { useGameEvents } from '../../hooks/useGameEvents';
import { predictionScenarios, resolveScenario, scenarioIds, type ScenarioId } from './scenarios';
import { advancePrediction, choosePrediction, createPredictionState, predictionIsSupported } from './predictionLogic';
import '../../styles/entertainment.css';

function Story({ scenarioId, onScenarioChange, fallback }: { scenarioId: ScenarioId; onScenarioChange: (id: string) => void; fallback: boolean }) {
  const [state, setState] = useState(createPredictionState);
  const [run, setRun] = useState(0);
  const scenario = predictionScenarios[scenarioId];
  const second = state.stage === 'second';
  const round = second ? 1 : 0;
  const selected = state.answers[round];
  const stage = state.stage === 'first' || state.stage === 'second' ? 'play' : state.stage;
  useGameEvents('predict', run, stage, round, state.answers.filter(answer => answer !== null).length);
  const next = () => setState(previous => advancePrediction(previous));
  function replay() { setState(createPredictionState()); setRun(previous => previous + 1); }
  const step = state.stage === 'first' ? 0 : second ? 1 : state.stage === 'science' ? 2 : 3;

  return <GameShell scrollOnStageChange title="PREDICT THE TWIST" duration="A ~40-second story" step={step} stageKey={`predict-${state.stage}`} progress={<GameProgress step={step} labels={['The scene', 'The twist', 'Discover', 'Take away']} />}>
    {stage === 'play' && <section className="predict-game" aria-labelledby="prediction-heading">
      <div className="story-toolbar"><span className="eyebrow">AN EVERYDAY STORY · FICTIONAL ADULTS</span><label><span className="sr-only">Story setting</span><select value={scenarioId} onChange={event => onScenarioChange(event.target.value)}>{scenarioIds.map(id => <option key={id} value={id}>{predictionScenarios[id].label}</option>)}</select></label></div>
      {fallback && <p className="parameter-note">That story isn’t available. You’re playing Office lunch.</p>}
      <h1 id="prediction-heading">{second ? 'A new clue changes the story.' : 'Two people. One meal. What happens next?'}</h1>
      {!second ? <div className="story-panel"><div className="story-panel-label"><span>{scenario.setting}</span><span>01 / THE SCENE</span></div><StoryIllustration setting={scenarioId} /><div className="character-notes">{scenario.people.map((person, i) => <div key={person}><strong>{person}</strong><span>{scenario.notes[i]}</span></div>)}</div><p>{scenario.scene}</p></div> : <div className="story-followup"><div className="evening-mark"><Moon size={32} aria-hidden="true" /><span>02 / LATER THAT EVENING</span></div><p>{scenario.followup}</p></div>}
      <fieldset className={second ? 'story-endings' : 'prediction-cards'} disabled={selected !== null} aria-label={second ? 'Choose a story ending' : 'Make your prediction'}><legend>{second ? 'Tap the ending you would keep.' : 'Make your prediction.'}</legend>
        {(second ? scenario.endings : scenario.choices).map((choice, index) => <button type="button" key={`${round}-${index}`} onClick={() => setState(previous => choosePrediction(previous, index))} className={`prediction-card ${selected === index ? 'selected' : ''} ${selected !== null && predictionIsSupported(index) ? 'supported' : ''}`}>
          {second ? <><EndingIllustration context={index === 1} /><span className="eyebrow">{scenario.alternatives[index]}</span></> : <span className="prediction-letter">{String.fromCharCode(65 + index)}</span>}
          <span className="prediction-copy">{choice}{selected !== null && index === 1 && <small>Best supported by the clues</small>}{selected === index && index !== 1 && <small>Your prediction</small>}</span>
          {selected !== null && index === 1 ? <Check size={18} aria-hidden="true" /> : !second && <ArrowRight size={17} aria-hidden="true" />}
        </button>)}
      </fieldset>
      {selected !== null && <RoundOutcome heading={second ? gameScience.routine.title : gameScience.prediction.title} body={predictionIsSupported(selected) ? 'You left room for the unknowns.' : 'That is one possible ending to question. Here’s what the clues support.'} article={second ? gameScience.routine : gameScience.prediction} nextLabel={second ? 'Discover the science' : 'Turn the page'} onNext={next} />}
      {selected === null && <p className="entertainment-quiet">A story to explore, not a test of your health.</p>}
    </section>}
    {state.stage === 'science' && <ScienceReveal article={gameScience.predict} onContinue={next} />}
    {state.stage === 'complete' && <EntertainmentCompletion game="predict" article={gameScience.predict} path={`/play/predict?scenario=${scenarioId}`} title="There’s always more to the story." onReplay={replay} />}
  </GameShell>;
}

export default function PredictTheTwist() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('scenario');
  const scenario = resolveScenario(requested);
  return <Story key={scenario} scenarioId={scenario} fallback={requested !== null && requested !== scenario} onScenarioChange={id => setParams({ scenario: id })} />;
}
