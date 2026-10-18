import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DiscoveryHub from './pages/DiscoveryHub';
import BrandHeader from './components/BrandHeader';
import { gameConfigs } from './data/gameConfigs';
import { DemoReturnProvider } from './components/DemoReturn';
const SteerPlayQuiz = lazy(() => import('./games/SteerPlayQuiz'));

const MissingClue = lazy(() => import('./games/MissingClue'));
const DemoMode = lazy(() => import('./pages/DemoMode'));
const AdSimulator = lazy(() => import('./pages/AdSimulator'));
const PredictTheTwist = lazy(() => import('./games/PredictTheTwist/PredictTheTwist'));
const SignalRush = lazy(() => import('./games/SignalRush/SignalRush'));
const CaseFile = lazy(() => import('./games/CaseFile/CaseFile'));
const InsideMetabolism = lazy(() => import('./games/InsideMetabolism/InsideMetabolism'));
const GLP1Explained = lazy(() => import('./games/GLP1Explained/GLP1Explained'));
const HealthAd = lazy(() => import('./pages/HealthAd'));
const ReelsSimulator = lazy(() => import('./pages/ReelsSimulator'));
const PlayablePreview = lazy(() => import('./pages/PlayablePreview'));
const CampaignEntry = lazy(() => import('./pages/CampaignEntry'));
function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const game = gameConfigs.find(config => config.route === pathname || config.route === pathname.replace(/^\/ad\//, '/play/'));
    const title = pathname === '/' ? 'Follow your curiosity' : pathname === '/demo/reels' ? 'Reels simulator' : pathname === '/demo/playable' ? 'HTML5 playable preview' : pathname === '/demo' ? 'The idea behind the play' : pathname === '/ad/puzzle' ? 'Can you spot what’s missing?' : pathname === '/play/quiz' ? 'Five quick discoveries' : pathname === '/ad/quiz' ? 'An interest. An invitation.' : pathname === '/play/predict-the-twist' ? 'Predict the Twist' : game?.title ?? 'Follow your curiosity';
    document.title = `${title} — Steer Play`;
  }, [pathname]);
  return null;
}
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="state-page"><h1>Let’s try that again.</h1><p>Something interrupted this little discovery.</p><button className="button primary" onClick={() => window.location.reload()}>Reload Steer Play</button></div> : this.props.children; }
}
function Unavailable({ planned = false }: { planned?: boolean }) {
  return <><BrandHeader compact /><main id="main-content" className="state-page"><span className="eyebrow">{planned ? 'MORE CURIOSITY ON THE WAY' : 'A LITTLE OFF THE BEATEN PATH'}</span><h1>{planned ? 'Still in the making.' : 'This page wandered off.'}</h1><p>{planned ? 'This experience is planned for a future phase. There’s a complete challenge waiting for you now.' : 'Let’s get you back to something worth discovering.'}</p><Link className="button primary" to="/">Back to discovery <ArrowRight size={18} /></Link></main></>;
}
export default function App() {
  return <ErrorBoundary><DemoReturnProvider><a className="skip-link" href="#main-content">Skip to content</a><RouteEffects /><Suspense fallback={<div className="state-page" role="status"><span className="wordmark">steer.</span><p>Getting your next discovery ready…</p></div>}><Routes><Route path="/" element={<DiscoveryHub />} /><Route path="/demo" element={<DemoMode />} /><Route path="/demo/reels" element={<ReelsSimulator />} /><Route path="/demo/playable" element={<PlayablePreview />} /><Route path="/c/:creativeId" element={<CampaignEntry />} /><Route path="/ad/puzzle" element={<AdSimulator />} /><Route path="/ad/quiz" element={<AdSimulator />} /><Route path="/play/quiz" element={<SteerPlayQuiz />} /><Route path="/play/missing-clue" element={<MissingClue />} /><Route path="/play/predict" element={<PredictTheTwist />} /><Route path="/play/predict-the-twist" element={<PredictTheTwist />} /><Route path="/play/signal-rush" element={<SignalRush />} /><Route path="/play/case-file" element={<CaseFile />} /><Route path="/ad/predict" element={<AdSimulator />} /><Route path="/ad/signal-rush" element={<AdSimulator />} /><Route path="/ad/case-file" element={<AdSimulator />} /><Route path="/learn/glp1" element={<GLP1Explained />} /><Route path="/play/glp1-explained" element={<GLP1Explained />} /><Route path="/ad/glp1" element={<HealthAd />} /><Route path="/learn/metabolism" element={<InsideMetabolism />} /><Route path="/play/inside-metabolism" element={<InsideMetabolism />} />{gameConfigs.filter(g => !g.available).map(game => <Route key={game.id} path={game.route} element={<Unavailable planned />} />)}<Route path="*" element={<Unavailable />} /></Routes></Suspense></DemoReturnProvider></ErrorBoundary>;
}

