import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { campaignPath, getProfile, isCreative, resolveCreative, type InterestProfile } from '../data/campaigns';
import { scientificContent } from '../data/scientificContent';
import AudienceControl from './campaign/AudienceControl';
import CampaignCreative from './campaign/CampaignCreative';
import ShareChallenge from './ShareChallenge';

const stages = [
  ['Attention has company.', 'An ad enters a feed full of entertainment. In this simulation, viewers can keep scrolling. Steer Play offers a small challenge worth choosing.'],
  ['Choose the invitation.', 'Select an illustrative interest. The headline, visual and actual game change together. No account history or medical information is used.'],
  ['One tap. Real play.', 'Open the fictional feed, or play this challenge. Complete the experience to reach its sourced science reveal and optional next step.'],
  ['Pass on the curiosity.', 'A friend gets the same public challenge in a fresh playthrough. Answers and health information stay out of the link.'],
  ['An optional next step.', 'Every completion offers replay, more games, sharing and Explore Steer. Education remains available without a consultation or sign-up.'],
];
export default function GuidedDemo() {
  const [params,setParams] = useSearchParams();
  const profile = getProfile(params.get('audience')).id;
  const active = params.get('guided') === '1';
  const raw = Number(params.get('step') ?? 0);
  const step = Number.isFinite(raw) ? Math.max(0,Math.min(stages.length-1,Math.trunc(raw))) : 0;
  useEffect(() => { if(active) { const panel=document.getElementById('guided-demo'); panel?.scrollIntoView({behavior:'instant',block:'start'}); document.getElementById('guided-heading')?.focus({preventScroll:true}); } },[active,step]);
  if(!active) return null;
  function setProfile(value:InterestProfile) { setParams({guided:'1',step:String(step),audience:value},{replace:true}); }
  const audience = getProfile(profile);
  const requested = params.get('creative');
  const id = isCreative(requested) && audience.creatives.includes(requested) ? requested : audience.creatives[0];
  const creative = resolveCreative(id,profile);
  function move(value:number) { setParams({guided:'1',step:String(value),audience:profile,creative:creative.id},{replace:true}); }
  return <section id="guided-demo" className="guided-demo" aria-labelledby="guided-heading">
    <span className="eyebrow">GUIDED DEMO · ABOUT TWO MINUTES</span>
    <p role="status">Step {step+1} of {stages.length}</p><h2 id="guided-heading" tabIndex={-1}>{stages[step][0]}</h2><p>{stages[step][1]}</p>
    {step === 0 && <Link className="button outline" to={`/demo/reels?profile=${profile}`} state={{demoReturn:`/demo?guided=1&step=1&audience=${profile}`}}>Try scrolling past a challenge →</Link>}
    {step === 1 && <><AudienceControl label="Guided audience" value={profile} onChange={setProfile} /><div className="guided-creative"><CampaignCreative creative={creative} /></div></>}
    {step === 2 && <div className="guided-actions"><Link className="button primary" to={campaignPath(creative)} state={{demoReturn:`/demo?guided=1&step=3&audience=${profile}&creative=${creative.id}`}}>Play the real challenge →</Link><Link className="button outline" to={`/demo/reels?profile=${profile}&creative=${creative.id}&reel=2`} state={{demoReturn:`/demo?guided=1&step=3&audience=${profile}&creative=${creative.id}`}}>Open its simulated Reel →</Link></div>}
    {step === 3 && <ShareChallenge path={creative.gameRoute} title={`Steer Play · ${creative.title}`} text="Can you solve this challenge too?" linkKind={creative.id==='metabolism'||creative.id==='glp1'?'learning':'challenge'} />}
    {step === 4 && <><p>{scientificContent.steer}</p><a className="button primary" href="https://steerclub.com" target="_blank" rel="noopener noreferrer">Explore Steer →</a><p className="medical-note">Public-site-aligned description; brand approval and clinical review remain pending. No engagement or health outcomes have been measured.</p></>}
    <div className="guided-navigation"><button className="button outline" disabled={step===0} onClick={()=>move(step-1)}>Previous step</button><button className="button primary" onClick={()=>move(step===stages.length-1?0:step+1)}>{step===stages.length-1?'Restart demo':'Next step'}</button></div>
  </section>;
}
