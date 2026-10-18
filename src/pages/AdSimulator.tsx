import { ArrowRight, ArrowLeft, Sparkles, Play, Eye } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import BrandHeader from '../components/BrandHeader';
import MobileLayout from '../components/MobileLayout';
import { TableScene } from '../components/Artwork';
import { getInterestConfig, isInterest } from '../data/interestConfigs';
import { createQuizSession, getQuizPath, isValidSeed } from '../utils/quizEngine';
import { interestIcons } from '../components/InterestSelector';
import { entertainmentAds } from '../data/entertainmentAds';
import EntertainmentAdVisual from '../components/EntertainmentAdVisual';
import '../styles/entertainment.css';

export default function AdSimulator() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const quiz = pathname === '/ad/quiz';
  const entertainment = entertainmentAds.find(ad => ad.adRoute === pathname);
  const requestedInterest = params.get('interest');
  const interest = isInterest(requestedInterest) ? requestedInterest : 'food';
  const seed = params.get('seed');
  const config = getInterestConfig(interest);
  const previewSeed = isValidSeed(seed) ? seed : 'demo123';
  const question = createQuizSession(interest, previewSeed).questions[0];
  const Icon = interestIcons[interest];

  return <MobileLayout><BrandHeader compact /><main id="main-content" className="ad-page page-width">
    <div className="ad-context"><span className="eyebrow">INTEREST → CURIOSITY → DISCOVERY</span><h1>A reason<br />to <em>stop scrolling.</em></h1>
      <p>{entertainment ? entertainment.audience : quiz ? `${config.label}: ${config.description}` : 'A visual challenge for a puzzle-loving audience. The first frame is the invitation.'}</p>
      <div className="simulation-note"><Eye size={20} /><div><strong>Simulated Reel advertisement</strong><p>Illustrative audience targeting. No live Meta integration or access to your activity.</p></div></div>
      <Link className="text-link" to="/demo"><ArrowLeft size={15} /> Back to the idea</Link>
    </div>
    <section className={`reel ${quiz ? 'quiz-reel' : ''} ${entertainment ? 'entertainment-reel' : ''}`} aria-label="Simulated sponsored Reel">
      <div className="reel-top"><span>REEL PREVIEW</span><span className="sim-badge">SIMULATION</span></div>
      <div className="reel-brand"><span className="reel-avatar">s.</span><div><strong>steer play</strong><span>Sponsored · A little curiosity</span></div><Sparkles size={19} /></div>
      <div className="reel-headline"><span className="eyebrow">{entertainment ? `${entertainment.title.toUpperCase()} · ${entertainment.duration}` : quiz ? `FIVE QUESTIONS · ${config.shortLabel.toUpperCase()}` : 'THE FIVE-SECOND CHALLENGE'}</span><h2>{entertainment ? entertainment.headline : quiz ? config.adHeadline : <>Can you spot<br />what’s missing?</>}</h2><p>{entertainment ? 'A little play. Something worth knowing.' : quiz ? 'One minute. Something worth knowing.' : 'A familiar table. One unexpected discovery.'}</p></div>
      {entertainment ? <EntertainmentAdVisual game={entertainment.id} /> : quiz ? <div className="reel-quiz-preview"><Icon size={23} aria-hidden="true" /><span className="eyebrow">YOUR FIRST CHALLENGE</span><h3>{question.prompt}</h3><ol>{question.choices.map(choice => <li key={choice}>{choice}</li>)}</ol></div> : <div className="reel-scene"><TableScene decorative /><span className="reel-question">?</span></div>}
      <div className="reel-bottom"><span><Play size={13} fill="currentColor" /> A little play. A new perspective.</span><Link className="button primary" to={entertainment ? entertainment.playRoute : quiz ? getQuizPath(interest, previewSeed) : '/play/missing-clue'}>{entertainment ? entertainment.cta : 'Play the challenge'} <ArrowRight size={20} /></Link><small>No sign-up. Just your curiosity.</small></div>
    </section>
  </main></MobileLayout>;
}
