import { ArrowRight, ArrowUpRight, Play, ScanEye, Brain, Share2, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import GuidedDemo from '../components/GuidedDemo';
import CampaignStudio from '../components/campaign/CampaignStudio';
import GLP1Demo from '../components/GLP1Demo';
import MetabolismDemo from '../components/MetabolismDemo';
import EntertainmentDemo from '../components/EntertainmentDemo';
import '../styles/entertainment.css';
import AudiencePreview from '../components/AudiencePreview';
import BrandHeader from '../components/BrandHeader';
import MobileLayout from '../components/MobileLayout';

const steps = [
  { icon: ScanEye, title: 'Attention has company.', body: 'Conventional ads compete with entertainment. In the simulated feed, a viewer can keep scrolling.', tag: '01 / THE PROBLEM', route:'/demo/reels?profile=food', action:'Scroll the fictional feed' },
  { icon: Play, title: 'Curiosity has different starting points.', body: 'Seven explicitly selected profiles demonstrate different interests without real account data or medical inference.', tag: '02 / THE INSIGHT', route:'/demo/reels?profile=gaming', action:'Try a gaming audience' },
  { icon: Play, title: 'Match the invitation.', body: 'An interest changes the hook, artwork and game destination. The CTA opens the real first round.', tag: '03 / THE APPROACH', route:'/demo/playable?profile=food&creative=quiz', action:'Play the first round' },
  { icon: Brain, title: 'Make a useful discovery.', body: 'Play leads to sourced educational explanations. Clinical review is pending, and learning time remains a design target.', tag: '04 / THE VALUE', route:'/learn/metabolism', action:'Explore the learning experience' },
  { icon: Share2, title: 'Pass on the curiosity.', body: 'A public link lets a friend start the same variation, with no answers, accounts or pressure to share.', tag: '05 / THE SHARING LOOP', route:'#sharing-loop', action:'Create a friend challenge' },
  { icon: HeartHandshake, title: 'Open a door to care.', body: 'Every game ends with an optional Steer website link. Finishing never requires a consultation or contact details.', tag: '06 / THE HANDOFF', route:'/learn/glp1?topic=works', action:'Try a complete learning journey' },
];
export default function DemoMode() {
  return <MobileLayout><BrandHeader compact /><main id="main-content" className="demo-page page-width"><section className="demo-hero"><span className="eyebrow">THE IDEA BEHIND THE PLAY · JUDGE DEMO</span><h1>Attention is earned.<br /><em>Curiosity is the invitation.</em></h1><p>A playable introduction to metabolic health, starting with what people already enjoy.</p><div className="demo-journey-actions"><Link className="button primary" to="/demo?guided=1#guided-demo">Start Guided Demo <Play size={18} /></Link><Link className="button primary" to="/demo/reels?profile=food">Scroll the Reels demo <ArrowRight size={19} /></Link><Link className="button outline" to="/ad/puzzle">Experience the journey <ArrowUpRight size={19} /></Link></div></section><div className="demo-disclosure"><strong>A simulation, with a real playable experience.</strong><p>Audience example: someone who enjoys visual puzzles. Targeting is illustrative only. We do not access Instagram engagement history or run a live Meta integration.</p></div><GuidedDemo /><CampaignStudio /><AudiencePreview /><section className="demo-steps" aria-label="The six steps of Steer Play">{steps.map(({ icon: Icon, title, body, tag, route, action }, i) => <article key={title}><span className="step-num">0{i + 1}</span><div className="step-icon"><Icon size={23} /></div><div><span className="eyebrow">{tag}</span><h2>{title}</h2><p>{body}</p>{route.startsWith('#') ? <a className="text-link" href={route}>{action} <ArrowRight size={15} /></a> : <Link className="text-link" to={route}>{action} <ArrowRight size={15} /></Link>}</div></article>)}</section><EntertainmentDemo /><MetabolismDemo /><GLP1Demo /><div className="demo-end"><div><h2>One complete journey. Seven ways in.</h2><p>All seven experiences are ready: five entertainment games and two interactive science-learning journeys.</p></div><Link className="button outline" to="/">See the discovery hub <ArrowRight size={17} /></Link></div><p className="medical-note">All educational medical copy is pending clinical review. The puzzle is an analogy, not a health assessment. No clinical outcomes or engagement results are claimed.</p></main></MobileLayout>;
}

