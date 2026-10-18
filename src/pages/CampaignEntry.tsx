import { useEffect, useRef } from 'react';
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getProfile, isCreative, resolveCreative } from '../data/campaigns';
import { trackEvent } from '../utils/events';

function Launch({destination}:{destination:string}) {
  const location=useLocation();
  const tracked=useRef(false);
  useEffect(()=>{if(!tracked.current){tracked.current=true;trackEvent({name:'game_launched_from_ad',game:'simulator'});}},[]);
  return <Navigate replace state={location.state} to={destination} />;
}
export default function CampaignEntry() {
  const {creativeId}=useParams();const [params]=useSearchParams();
  const requested=creativeId??null;
  if(!isCreative(requested)) return <main id="main-content" className="state-page"><h1>That challenge isn’t available.</h1><Link className="button primary" to="/">Explore the game library</Link></main>;
  const creative=resolveCreative(requested,getProfile(params.get('profile')).id,{seed:params.get('seed'),scenario:params.get('scenario')});
  return <Launch destination={creative.gameRoute} />;
}
