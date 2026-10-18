import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock3, Eye, VolumeX } from 'lucide-react';
import GameShell from '../../components/GameShell';
import { TableScene } from '../../components/Artwork';
import GameFeedback from '../../components/GameFeedback';
import ScienceReveal from '../../components/ScienceReveal';
import GameCompletionScreen from '../../components/GameCompletionScreen';
import { scientificContent } from '../../data/scientificContent';

type Stage = 'observe' | 'guess' | 'feedback' | 'science' | 'complete';
const options = ['Chai cup', 'Chutney bowl', 'Spoon', 'Napkin'];

export default function MissingClue() {
  const [stage, setStage] = useState<Stage>('observe');
  const [answer, setAnswer] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const started = useRef(Date.now());
  useEffect(() => {
    if (stage !== 'observe') return;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);
  function replay() { setAnswer(null); setElapsed(0); setReviewed(false); started.current = Date.now(); setStage('observe'); }
  const step = stage === 'observe' ? 0 : stage === 'guess' || stage === 'feedback' ? 1 : stage === 'science' ? 2 : 3;
  return <GameShell step={step} stageKey={stage}>
    {(stage === 'observe' || stage === 'guess' || stage === 'feedback') && <>
      <div className="puzzle-heading"><span className="eyebrow">{stage === 'observe' ? 'A BREAKFAST TABLE. A LITTLE TEST OF ATTENTION.' : 'SAME TABLE. ONE SMALL CHANGE.'}</span><h1>{stage === 'observe' ? 'Take a good look.' : stage === 'guess' ? 'What’s missing?' : answer === 'Chutney bowl' ? 'A sharp eye for detail.' : 'Let’s look a little closer.'}</h1><p>{stage === 'observe' ? 'Remember what’s on the table. When you’re ready, we’ll take one thing away.' : stage === 'guess' ? 'One object has disappeared. Which one was it?' : 'The smallest details can tell an interesting story.'}</p></div>
      <div className="puzzle-scene"><TableScene missing={stage !== 'observe'} decorative />{stage === 'observe' && <span className="scene-caption"><Eye size={14} /> Look at all five objects</span>}{stage === 'feedback' && <span className="scene-caption">The missing detail: chutney bowl</span>}</div>
      {stage === 'observe' && <><p className="accessible-scene">On the table: a plate of idlis, chai cup, spoon, napkin and chutney bowl.</p><div className="observe-actions"><span><Clock3 size={15} /> {elapsed < 5 ? 'Take about 5 seconds. No rush.' : 'Ready when you are.'}</span><button className="button primary" onClick={() => setStage('guess')}>I’m ready <ArrowRight size={18} /></button></div><p className="quiet-note"><VolumeX size={13} /> No sound. No timer pressure. Just a little attention.</p></>}
      {stage === 'guess' && <><fieldset className="answer-options"><legend className="sr-only">Choose the missing object</legend>{options.map((option, i) => <button key={option} className="answer-option" onClick={() => { setAnswer(option); setStage('feedback'); }}><span>{String.fromCharCode(65 + i)}</span>{option}<ArrowUpRightIcon /></button>)}</fieldset><button className="text-link review-button" onClick={() => { setReviewed(true); started.current = Date.now(); setElapsed(0); setStage('observe'); }}><Eye size={15} /> {reviewed ? 'Look at the original again' : 'Need another look?'}</button></>}
      {stage === 'feedback' && <GameFeedback correct={answer === 'Chutney bowl'} onContinue={() => setStage('science')} />}
    </>}
    {stage === 'science' && <ScienceReveal onContinue={() => setStage('complete')} />}
    {stage === 'complete' && <GameCompletionScreen takeaway={scientificContent.takeaway} onReplay={replay} />}
  </GameShell>;
}
function ArrowUpRightIcon() { return <ArrowRight size={16} className="answer-arrow" aria-hidden="true" />; }
