import { ArrowRight, ArrowUpRight, Clock3, Sparkles, Play, MousePointer2, ShieldCheck, MoveDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandHeader from '../components/BrandHeader';
import MobileLayout from '../components/MobileLayout';
import Artwork from '../components/Artwork';
import { gameConfigs, type GameConfig } from '../data/gameConfigs';

function GameCard({ game, index }: { game: GameConfig; index: number }) {
  return <article className={`game-card ${game.available ? 'featured-card' : 'upcoming-card'}`}>
    <div className="card-visual"><Artwork kind={game.art} /><span className="card-number">0{index + 1}</span>{game.available && <span className="live-pill"><span /> {game.category === 'science' ? 'EXPLORE NOW' : 'PLAYABLE NOW'}</span>}</div>
    <div className="card-content"><div className="card-eyebrow">{game.tag}{game.available && <span><Clock3 size={12} /> {game.duration ?? '~45 sec'}</span>}</div><h3>{game.title}</h3><p>{game.description}</p>{game.available ? <Link className="card-action" to={game.route}>{game.category === 'science' ? 'Follow the science' : 'Let’s play'} <ArrowRight size={19} /></Link> : <div className="coming-soon"><span className="small-dot" /> In the making <span>Coming soon</span></div>}</div>
  </article>;
}

export default function DiscoveryHub() {
  return <MobileLayout><BrandHeader /><main id="main-content" className="page-width">
    <section className="hero">
      <div>
        <div className="eyebrow"><span className="tiny-star">✳</span> FOLLOW YOUR CURIOSITY</div>
        <h1>A little curiosity<br />goes a <em>long way.</em><span className="headline-spark" aria-hidden="true">✳</span></h1>
        <p className="hero-description">Play something interesting.<br className="mobile-break" /> Discover something worth knowing.</p>
        <div className="hero-actions"><Link className="button primary" to="/play/missing-clue">Find your first clue <ArrowUpRight size={19} /></Link><span className="hero-time"><Clock3 size={15} /> A minute well spent.</span></div>
      </div>
      <div className="hero-note"><span className="note-orbit" aria-hidden="true"><Sparkles size={25} /></span><p>A small challenge.<br />An unexpected discovery.<br /><em>Something to take with you.</em></p><svg aria-hidden="true" viewBox="0 0 100 65"><path d="M77 5Q89 58 20 45m15-13L18 45l20 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></div>
    </section>
    <div className="benefit-strip"><span><MousePointer2 size={16} /> No downloads. No sign-ups.</span><span><Clock3 size={16} /> Little games, real discoveries.</span><span><ShieldCheck size={16} /> Science at the heart.</span></div>
    <section className="games-section" aria-labelledby="play-heading"><div className="section-heading"><div><div className="eyebrow muted">01 / A LITTLE PLAY</div><h2 id="play-heading">Start with what you love.</h2></div><span className="section-aside">Follow a hunch. Find something new. <MoveDown size={16} /></span></div><div className="game-grid">{gameConfigs.filter(g => g.category === 'entertainment').map((game, i) => <GameCard key={game.id} game={game} index={i} />)}</div></section>
    <section className="games-section science-section" aria-labelledby="science-heading"><div className="section-heading"><div><div className="eyebrow muted">02 / A NEW PERSPECTIVE</div><h2 id="science-heading">Get curious about you.</h2></div><span className="section-aside">Extraordinary science. Everyday language.</span></div><div className="science-grid">{gameConfigs.filter(g => g.category === 'science').map((game, i) => <GameCard key={game.id} game={game} index={i + 5} />)}</div></section>
    <section className="why-banner"><div className="why-symbol" aria-hidden="true">✳</div><div><div className="eyebrow">THERE’S A LITTLE SCIENCE IN EVERY STORY.</div><h2>Good for your curiosity.<br /><em>Grounded in your biology.</em></h2><p>Small discoveries about the way your body works.<br />Brought to you by Steer, a doctor-led metabolic-health programme.</p></div><Link className="button outline" to="/demo">The idea behind the play <ArrowUpRight size={17} /></Link></section>
    <div className="hub-footnote"><Play size={13} /> Phase 6 preview · All seven experiences ready to explore.</div>
  </main></MobileLayout>;
}

