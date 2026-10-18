import { useId } from 'react';
import { campaignProfiles, isProfile, type InterestProfile } from '../../data/campaigns';
import { trackEvent } from '../../utils/events';
export default function AudienceControl({value,onChange,label='Campaign audience'}:{value:InterestProfile;onChange:(profile:InterestProfile)=>void;label?:string}) {
  const id=useId();
  return <label className="campaign-select" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={event => { if(isProfile(event.target.value)){onChange(event.target.value);trackEvent({name:'audience_profile_selected',game:'simulator'});} }}>{campaignProfiles.map(profile => <option key={profile.id} value={profile.id}>{profile.label}</option>)}</select></label>;
}
