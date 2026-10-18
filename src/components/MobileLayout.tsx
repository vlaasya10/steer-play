import type { ReactNode } from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';

export default function MobileLayout({ children }: { children: ReactNode }) {
  return <div className="site-layout">{children}<footer className="site-footer page-width"><div><span className="footer-brand">steer play</span><span>A little play. A new perspective.</span></div><p>Made for curious minds <Heart size={13} aria-hidden="true" /></p><a href="https://steerclub.com" target="_blank" rel="noopener noreferrer">Doctor-led. Human-first. <ArrowUpRight size={14} /></a></footer></div>;
}
