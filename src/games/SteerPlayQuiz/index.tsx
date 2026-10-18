import { useEffect, useRef, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, ArrowLeft } from 'lucide-react';
import GameShell from '../../components/GameShell';
import GameCompletionScreen from '../../components/GameCompletionScreen';
import InterestSelector, { interestIcons } from '../../components/InterestSelector';
import BrandHeader from '../../components/BrandHeader';
import MobileLayout from '../../components/MobileLayout';
import { getInterestConfig, isInterest } from '../../data/interestConfigs';
import { quizScienceContent, scienceSources, type ScienceSourceId } from '../../data/scientificContent';
import { advanceQuestion, createQuizSession, createSeed, getQuizPath, isValidSeed, recordAnswer } from '../../utils/quizEngine';
import { trackEvent } from '../../utils/events';
import type { InterestCategory } from '../../types/quiz';

function QuizProgress({ index, completed }: { index: number; completed: boolean }) {
  return <div className="quiz-progress"><div><span>{completed ? 'Five discoveries, one new perspective' : `Question ${index + 1} of 5`}</span><span>{completed ? 'Complete' : index < 3 ? 'Follow your curiosity' : 'A little science'}</span></div><div role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={completed ? 5 : index} aria-valuetext={completed ? 'All five questions completed' : `Question ${index + 1} of 5`} className="quiz-progress-bars">{[0, 1, 2, 3, 4].map(i => <i key={i} className={completed || i <= index ? 'active' : ''} />)}</div></div>;
}

function QuizExperience({ interest, seed }: { interest: InterestCategory; seed: string }) {
  const [session, setSession] = useState(() => createQuizSession(interest, seed));
  const opened = useRef(false);
  const completionTracked = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);
  const config = getInterestConfig(interest);
  const Icon = interestIcons[interest];
  const question = session.questions[session.currentIndex];
  const selected = session.answers[question.id];
  const answered = selected !== undefined;
  const isMedical = question.kind !== 'interest' || !!question.sourceIds?.length;

  useEffect(() => {
    if (opened.current) return;
    opened.current = true;
    trackEvent({ name: 'quiz_opened', game: 'quiz' });
    trackEvent({ name: 'quiz_started', game: 'quiz' });
  }, []);
  useEffect(() => { if (answered && !session.completed) feedback.current?.focus({ preventScroll: true }); }, [answered, session.completed]);
  useEffect(() => {
    if (session.completed && !completionTracked.current) {
      completionTracked.current = true;
      trackEvent({ name: 'quiz_completed', game: 'quiz' });
      trackEvent({ name: 'science_reveal_viewed', game: 'quiz' });
    }
  }, [session.completed]);
  function answer(choice: number) {
    setSession(previous => recordAnswer(previous, choice));
    if (!answered) trackEvent({ name: 'question_answered', game: 'quiz', questionNumber: session.currentIndex + 1 });
  }
  function replay() {
    completionTracked.current = false;
    setSession(createQuizSession(interest, seed));
    trackEvent({ name: 'quiz_started', game: 'quiz' });
  }

  return <GameShell title="STEER PLAY QUIZ" duration="5 questions · ~30–60 sec" step={0} stageKey={session.completed ? 'quiz-complete' : question.id} progress={<QuizProgress index={session.currentIndex} completed={session.completed} />}>
    {session.completed ? <GameCompletionScreen
      heading={quizScienceContent.heading} takeaway={quizScienceContent.takeaway} intro={quizScienceContent.steer} source={scienceSources.glp1} onReplay={replay}
      onExplore={() => trackEvent({ name: 'steer_cta_clicked', game: 'quiz' })}
      share={{ path: getQuizPath(interest, seed), title: `Steer Play — ${config.label}`, text: 'Five quick questions. A new perspective. Try the same challenge as me.', onShare: () => trackEvent({ name: 'challenge_share_clicked', game: 'quiz' }) }}
      discovery={<div className="quiz-takeaway"><span className="eyebrow">THE SCIENCE TO TAKE WITH YOU</span><p>{quizScienceContent.glp1Explanation}</p><p>{config.analogy}</p><aside>{quizScienceContent.caveat}</aside><details className="science-footnote"><summary>Sources &amp; context</summary>{(['digestion','appetite','sleep'] as const).map(id => <a key={id} href={scienceSources[id].url} target="_blank" rel="noopener noreferrer">{scienceSources[id].title} ↗</a>)}</details></div>}
    /> : <section className="quiz-experience" aria-labelledby="quiz-question">
      <div className="quiz-interest"><span><Icon size={16} /> {config.label}</span><Link to="/play/quiz">Change interest</Link></div>
      <p className="quiz-hook">{config.hook}</p>
      <div className="quiz-question-card">
        <span className="eyebrow">{question.kind === 'interest' ? `A LITTLE ${interest === 'gaming' ? 'CHALLENGE' : 'CURIOSITY'}` : question.kind === 'bridge' ? config.bridge : 'ONE HORMONE. PART OF A BIGGER PICTURE.'}</span>
        <h1 id="quiz-question">{question.prompt}</h1>
        <fieldset className="quiz-answers" disabled={answered} aria-labelledby="quiz-question"><legend className="sr-only">Choose one answer</legend>{question.choices.map((choice, index) => <button type="button" key={`${question.id}-${index}`} className={`quiz-answer ${answered && index === question.correctIndex ? 'is-correct' : ''} ${answered && index === selected ? 'is-selected' : ''}`} onClick={() => answer(index)}>
          <span className="choice-letter">{String.fromCharCode(65 + index)}</span><span className="choice-copy">{choice}{answered && index === question.correctIndex && <small>Correct answer</small>}{answered && index === selected && index !== question.correctIndex && <small>Your choice</small>}</span>{answered && index === question.correctIndex ? <Check size={18} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
        </button>)}</fieldset>
        {answered && <div className="quiz-feedback" ref={feedback} tabIndex={-1} role="status"><h2><Sparkles size={17} /> {selected === question.correctIndex ? 'You’ve got it.' : 'A new thing to know.'}</h2><p>{question.explanation}</p>
          {isMedical && <div className="quiz-sources"><span>Educational content · Pending clinical review</span>{question.sourceIds?.map(id => { const source = scienceSources[id as ScienceSourceId]; return source && <a key={id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>; })}</div>}
          <button className="button primary" onClick={() => setSession(previous => advanceQuestion(previous))}>{session.currentIndex === 4 ? 'See what you discovered' : 'Next Question'} <ArrowRight size={17} /></button>
        </div>}
      </div>
      {!answered && <p className="quiz-quiet">{isMedical ? 'Educational content · Pending clinical review' : 'No timer. No pressure. Just a little curiosity.'}</p>}
    </section>}
  </GameShell>;
}

export default function SteerPlayQuiz() {
  const [params] = useSearchParams();
  const interest = params.get('interest');
  const seed = params.get('seed');
  if (!isInterest(interest)) return <MobileLayout><BrandHeader compact /><main id="main-content" className="interest-page page-width"><span className="eyebrow">STEER PLAY QUIZ · FIVE QUICK DISCOVERIES</span><h1>What makes you<br /><em>curious?</em></h1><p>{interest ? 'That interest isn’t available yet. Pick one below to begin.' : 'Choose something you enjoy. Your first question is waiting.'}</p><InterestSelector /><p className="interest-privacy">Your choice only changes the questions. It doesn’t infer anything about your health.</p><Link className="text-link" to="/"><ArrowLeft size={15} /> Back to discovery</Link></main></MobileLayout>;
  if (!isValidSeed(seed)) return <Navigate replace to={getQuizPath(interest, createSeed())} />;
  return <QuizExperience key={`${interest}:${seed}`} interest={interest} seed={seed} />;
}
