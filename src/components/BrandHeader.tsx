import { ArrowUpRight, MoveLeft } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function BrandHeader({ compact = false }: { compact?: boolean }) {
  return <header className="brand-header page-width">
    <Link className="brand" to="/" aria-label="Steer Play home"><span className="wordmark">steer<span className="brand-period">.</span></span><span className="brand-divider" /><span className="play-word">PLAY</span></Link>
    {compact ? <Link className="text-link back-link" to="/"><MoveLeft size={16} /> Back to discovery</Link> : <nav aria-label="Main navigation"><NavLink to="/" end className="nav-discover">Discover</NavLink><NavLink to="/demo">The idea <ArrowUpRight size={14} /></NavLink><a className="nav-steer" href="https://steerclub.com" target="_blank" rel="noopener noreferrer">Meet Steer <ArrowUpRight size={14} /></a></nav>}
  </header>;
}
