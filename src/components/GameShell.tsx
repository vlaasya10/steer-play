import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import DemoReturnLink from './DemoReturn';
import BrandHeader from './BrandHeader';
import MobileLayout from './MobileLayout';
import GameProgress from './GameProgress';

export default function GameShell({ children, step, stageKey, title = 'FIND WHAT EVERYONE MISSED', duration = 'A ~45-second discovery', progress, scrollOnStageChange = false }: { children: ReactNode; step: number; stageKey: string; title?: string; duration?: string; progress?: ReactNode; scrollOnStageChange?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { panel.current?.focus({ preventScroll: true }); if (scrollOnStageChange) window.scrollTo({ top: 0, behavior: 'instant' }); }, [stageKey, scrollOnStageChange]);
  return <MobileLayout><BrandHeader compact /><DemoReturnLink /><main id="main-content" className="game-page page-width"><div className="game-topline"><span className="eyebrow">{title}</span><span>{duration}</span></div>{progress ?? <GameProgress step={step} />}<motion.div ref={panel} tabIndex={-1} key={stageKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }} className="game-panel">{children}</motion.div></main></MobileLayout>;
}
