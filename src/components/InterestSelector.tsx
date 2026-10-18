import { CookingPot, Gamepad2, Clapperboard, Coffee, Orbit, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { interestConfigs } from '../data/interestConfigs';
import type { InterestCategory } from '../types/quiz';

export const interestIcons = { food: CookingPot, gaming: Gamepad2, entertainment: Clapperboard, lifestyle: Coffee, science: Orbit };
export default function InterestSelector({ value, onChange }: { value?: InterestCategory; onChange?: (interest: InterestCategory) => void }) {
  return <div className={`interest-selector ${onChange ? 'interest-tabs' : ''}`} role="group" aria-label="Choose an interest">{interestConfigs.map(interest => {
    const Icon = interestIcons[interest.id];
    const content = <><Icon size={20} aria-hidden="true" /><span>{onChange ? interest.shortLabel : interest.label}</span>{!onChange && <ArrowUpRight size={17} aria-hidden="true" />}</>;
    return onChange ? <button key={interest.id} type="button" aria-pressed={value === interest.id} onClick={() => onChange(interest.id)}>{content}</button> : <Link key={interest.id} to={`/play/quiz?interest=${interest.id}`}>{content}</Link>;
  })}</div>;
}
