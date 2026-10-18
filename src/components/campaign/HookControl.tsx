import { hookVariants, resolveHook, type HookVariant } from '../../data/campaigns';
export default function HookControl({ value, onChange }: { value: HookVariant; onChange: (value: HookVariant) => void }) {
  return <label className="campaign-select"><span>Opening hook</span><select aria-label="Opening hook" value={value} onChange={event => onChange(resolveHook(event.target.value))}>{hookVariants.map((id,index) => <option key={id} value={id}>{['Original opening','Alternative A · curiosity','Alternative B · challenge'][index]}</option>)}</select></label>;
}
