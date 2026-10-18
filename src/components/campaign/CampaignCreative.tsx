import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, VolumeX } from 'lucide-react';
import { campaignPath, type AdCreative } from '../../data/campaigns';
import { trackEvent } from '../../utils/events';
import { validReturn } from '../DemoReturn';
import CreativeArtwork from './CreativeArtwork';

export default function CampaignCreative({ creative, active = false, launch = true }: { creative:AdCreative; active?:boolean; launch?:boolean }) {
  const location = useLocation();
  const supplied:unknown = location.state?.demoReturn;
  let demoReturn = validReturn(supplied) ? supplied : location.pathname.startsWith('/demo') ? `${location.pathname}${location.search}` : undefined;
  if(demoReturn){
    const destination = new URL(demoReturn,'https://demo.invalid');
    if(destination.pathname === '/demo' && destination.searchParams.get('guided') === '1'){
      destination.searchParams.set('step','3');
      destination.searchParams.set('audience',creative.interest);
      destination.searchParams.set('creative',creative.id);
      demoReturn=destination.pathname+destination.search;
    }
  }
  return <article className={`campaign-creative creative-${creative.id}`} data-creative={creative.id} data-active={active} aria-label={`${creative.title} advertisement preview`}>
    <div className="campaign-brand"><span className="wordmark">steer.</span><div><strong>steer play</strong><small>Sponsored · Prototype</small></div><VolumeX size={17} aria-label="Sound off" /></div>
    <div className="campaign-hook"><span className="eyebrow">{creative.title}</span><h2>{creative.headline}</h2><p>{creative.subheading}</p></div>
    <div className="campaign-art"><CreativeArtwork creative={creative} active={active} /></div>
    <div className="campaign-play"><span>Visual preview · play opens the real experience</span>{launch ? <Link className="button primary" state={demoReturn ? {demoReturn} : undefined} to={campaignPath(creative)} onClick={() => trackEvent({name:'ad_cta_clicked',game:'simulator'})}>{creative.cta}<ArrowRight size={18} /></Link> : <span className="campaign-static-cta">{creative.cta} →</span>}<small>{creative.id==='metabolism'||creative.id==='glp1'?'Educational content · Pending clinical review':'No sign-up. Sharing and Steer exploration are optional.'}</small></div>
  </article>;
}
