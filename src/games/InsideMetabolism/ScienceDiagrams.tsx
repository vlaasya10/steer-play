import { Check, Radio, ArrowRight } from 'lucide-react';
import { metabolismLessons as lessons, type MetabolismLessonKey } from '../../data/metabolismLessons';

export function LunchIllustration() {
  return <svg className="lunch-illustration" viewBox="0 0 520 160" role="img" aria-label="Illustrated Indian lunch: rice, roti, dal and vegetables. No food score.">
    <rect width="520" height="160" rx="8" fill="#E6CBBD" /><ellipse cx="260" cy="83" rx="163" ry="65" fill="#F8F2EB" stroke="#B58777" strokeWidth="2" /><ellipse cx="260" cy="83" rx="150" ry="54" fill="none" stroke="#E6CBBD" />
    <path d="M135 88q7-49 54-42q38 10 37 52q-51 16-91-10Z" fill="#F5EBDF" stroke="#B58777" />
    <g stroke="#B58777" strokeWidth="1.4" strokeLinecap="round"><path d="m157 65 5 2m12-8 4 3m-27 19 6 2m13-11 5 3m13 1 6 2m-29 16 6 2m17-5 4 3m-3-31 4 3m12 16 5 3" /></g>
    <ellipse cx="280" cy="92" rx="47" ry="30" fill="#F5EBDF" stroke="#B58777" /><ellipse cx="280" cy="92" rx="39" ry="23" fill="none" stroke="#E6CBBD" /><path d="M261 79h1m31 14h1m-14 14h1m-4-21h1" stroke="#B58777" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="339" cy="55" rx="36" ry="25" fill="#F8F2EB" stroke="#B58777" /><ellipse cx="339" cy="55" rx="29" ry="18" fill="#C04E2A" /><path d="m327 52 4 3m10-10 2 4m8 9-3 3" stroke="#F5EBDF" strokeWidth="2" />
    <g fill="#B58777" stroke="#661414"><path d="M351 90q21-14 34 2q-9 16-27 12Z" /><path d="M332 111q17-19 29-7q-1 16-29 7Z" /><path d="M374 114q7-15 18-11q6 16-18 11Z" /></g>
    <path d="M61 45v28m8-28v28m7-28v28M61 61h15m-8 12v53m388-80v80m0-80q-18 20-12 38h12" fill="none" stroke="#661414" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

type Organ = 'mouth' | 'stomach' | 'intestine' | 'brain' | 'pancreas';
export function OrganArt({ active }: { active: Organ }) {
  const fill = (organ: Organ) => active === organ ? '#E6CBBD' : '#F8F2EB';
  const stroke = (organ: Organ) => active === organ ? '#C04E2A' : '#661414';
  return <svg viewBox="0 0 300 330" className="organ-art" role="img" aria-label={`Simplified digestive system, pancreas and brain. Highlighted: ${active === 'intestine' ? 'small intestine' : active}.`}>
    <path d="M110 100q-58 7-66 55v157h200V155q-8-48-66-55m-68-1v20m68-20v20" fill="#F5EBDF" stroke="#B58777" strokeWidth="1.3" />
    <path d="M100 99q-37-51-3-81q33-27 68 0q33 24 8 62l-8 22" fill="#F5EBDF" stroke="#B58777" strokeWidth="1.3" />
    <path d="M105 54q-17-7-7-21q1-16 18-14q15-14 24 0q22-3 25 15q13 16-6 23Z" fill={fill('brain')} stroke={stroke('brain')} strokeWidth="2.5" /><path d="M117 23q14 16 0 30m21-30q-9 16 8 29m-40-14 10 5m25-4 13-2" fill="none" stroke="#B58777" />
    <path d="M152 79h17" stroke={stroke('mouth')} strokeWidth="4" strokeLinecap="round" /><path d="M160 84v55q0 17 15 25" className={`organ-connector ${active === 'mouth' || active === 'stomach' ? 'active' : ''}`} fill="none" stroke="#B58777" strokeWidth="2.5" />
    <path d="M171 145q-3 17 14 18q24-8 26 18q2 29-28 34q-29 0-35-26q-1-18 13-18" fill={fill('stomach')} stroke={stroke('stomach')} strokeWidth="2.5" />
    <path d="M140 209q27-15 71-4q17 4-1 13q-32 13-68 1Z" fill={fill('pancreas')} stroke={stroke('pancreas')} strokeWidth="2.5" />
    <rect x="105" y="232" width="91" height="68" rx="18" fill={fill('intestine')} stroke={stroke('intestine')} strokeWidth="2.5" /><path d="M115 246h66q12 0 6 10h-64q-12 0-6 10h64q12 0 6 10h-64q-12 0-5 10h60" fill="none" stroke={stroke('intestine')} strokeWidth="2.5" strokeLinecap="round" />
    <g fontFamily="DM Sans, sans-serif" fontSize="16" fill="#351D1D"><text x="212" y="39">Brain</text><text x="17" y="88">Mouth</text><text x="214" y="162">Stomach</text><text x="209" y="222">Pancreas</text><text x="14" y="266">Small</text><text x="14" y="284">intestine</text></g>
    <g stroke="#B58777" strokeWidth="1" fill="none"><path d="M169 38h36M65 84h81m64 81h3m-8 50h4M62 265h36" /></g>
  </svg>;
}

export function BiologyMap({ mode = 'digestion', active, completed = -1, sequential = false, onSelect }: { mode?: 'digestion' | 'glp1'; active: number; completed?: number; sequential?: boolean; onSelect: (index: number) => void }) {
  const keys = mode === 'digestion' ? ['mouth', 'stomach', 'intestine'] as const : ['glpGut', 'glpPancreas', 'glpBrain'] as const;
  const organs: Organ[] = mode === 'digestion' ? ['mouth', 'stomach', 'intestine'] : ['intestine', 'pancreas', 'brain'];
  return <figure className="biology-map"><div className="biology-map-inner"><OrganArt active={organs[Math.max(0, active)]} /><div className="organ-controls" role="group" aria-label={mode === 'digestion' ? 'Follow the food' : 'Explore GLP-1 relationships'}>{keys.map((key, index) => <button key={key} aria-pressed={active === index} disabled={sequential && index > completed + 1} onClick={() => onSelect(index)}><span>{sequential && index <= completed ? <Check size={14} aria-hidden="true" /> : String(index + 1).padStart(2, '0')}</span>{lessons[key].title}</button>)}</div></div><figcaption>Simplified educational illustration. {sequential ? 'Tap each point in order.' : 'Tap a label to explore a selected relationship.'}</figcaption></figure>;
}

export function GlucoseDiagram({ active }: { active: number }) {
  return <figure className="glucose-diagram"><svg viewBox="0 0 520 250" role="img" aria-label="Simplified relationships between the small intestine, bloodstream, pancreas and body cells. No glucose measurement or timing is shown.">
    <path d="M157 67h173M163 182h165M395 95v57" fill="none" stroke="#B58777" strokeWidth="2" strokeDasharray="5 6" className={active >= 1 ? 'learning-connection active' : ''} />
    <path d="m319 61 11 6-11 6m-2 103 11 6-11 6m61-42 7 10 7-10" fill="none" stroke="#C04E2A" strokeWidth="2" />
    <rect x="35" y="32" width="128" height="72" rx="12" fill={active === 0 ? '#E6CBBD' : '#F8F2EB'} stroke="#B58777" /><path d="M60 48h69q10 0 4 9H68q-10 0-4 9h65q10 0 4 9H68" stroke="#661414" strokeWidth="2" fill="none" />
    <rect x="335" y="32" width="145" height="72" rx="12" fill={active === 1 ? '#E6CBBD' : '#F8F2EB'} stroke="#B58777" /><path d="M350 51h114m-114 24h114" stroke="#C04E2A" /><g fill="#C04E2A"><circle cx="366" cy="63" r="4" /><circle cx="404" cy="63" r="4" /><circle cx="444" cy="63" r="4" /></g>
    <rect x="35" y="155" width="128" height="66" rx="12" fill={active === 2 ? '#E6CBBD' : '#F8F2EB'} stroke="#B58777" /><path d="M54 180q29-17 82-4q10 7-5 13q-45 15-77 3Z" fill="#E6CBBD" stroke="#661414" strokeWidth="2" />
    <rect x="335" y="155" width="145" height="66" rx="12" fill={active === 2 ? '#E6CBBD' : '#F8F2EB'} stroke="#B58777" /><g fill="#F5EBDF" stroke="#661414" strokeWidth="2"><circle cx="371" cy="183" r="15" /><circle cx="416" cy="183" r="15" /><circle cx="453" cy="183" r="10" /></g>
    <g fill="#351D1D" fontSize="14" fontFamily="DM Sans, sans-serif" textAnchor="middle"><text x="99" y="123">Small intestine</text><text x="405" y="123">Bloodstream</text><text x="99" y="243">Pancreas</text><text x="405" y="243">Body cells</text></g><text x="245" y="175" fill="#661414" fontSize="12" fontFamily="DM Sans, sans-serif" textAnchor="middle">Insulin signalling</text>
  </svg><figcaption>Selected relationships, not a timed or complete biological pathway.</figcaption></figure>;
}

export function ConversationDiagram({ explored, onExplore }: { explored?: boolean; onExplore?: () => void }) {
  return <figure className="conversation-diagram"><svg viewBox="0 0 520 220" role="img" aria-label="Gut and brain communicate in both directions through nerves and hormonal signals. This is a simplified illustration.">
    <path d="M162 83h186m-173-8-13 8 13 8m160-16 13 8-13 8M256 98v41" className="learning-connection active" fill="none" stroke="#C04E2A" strokeWidth="2" strokeDasharray="5 6" />
    <rect x="40" y="42" width="108" height="80" rx="21" fill="#F8F2EB" stroke="#B58777" /><path d="M55 60h73q10 0 4 11H65q-10 0-4 11h67q10 0 4 11H65" fill="none" stroke="#661414" strokeWidth="3" />
    <path d="M385 103q-31-8-16-33q-1-24 23-22q21-22 40-1q26-3 27 23q18 28-12 34Z" fill="#F8F2EB" stroke="#661414" strokeWidth="2.5" /><path d="M397 50q20 24-2 50m24-50q-10 21 13 47" stroke="#B58777" fill="none" />
    <ellipse cx="256" cy="162" rx="81" ry="25" fill="#E6CBBD" stroke="#B58777" /><g fill="#351D1D" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="17"><text x="94" y="151">Gut</text><text x="411" y="151">Brain</text><text x="256" y="168" fontSize="13">Hormonal signals</text></g>
  </svg>{onExplore && <button className={`conversation-signal ${explored ? 'explored' : ''}`} onClick={onExplore} disabled={explored} aria-label={explored ? 'Gut–brain signal explored' : 'Explore the gut–brain signal'}>{explored ? <Check size={24} /> : <Radio size={26} />}</button>}<figcaption>{onExplore && !explored ? 'Tap the signal on the pathway.' : 'Simplified educational illustration. Multiple pathways interact.'}</figcaption></figure>;
}

export function TopicWeb({ topics, active, onSelect }: { topics: readonly MetabolismLessonKey[]; active: number; onSelect: (index: number) => void }) {
  return <figure className="topic-web"><svg viewBox="0 0 460 185" aria-hidden="true"><g fill="none" stroke="#B58777" strokeWidth="1.5"><path d="M230 88 85 66m145 22 145-22m-145 22v64M85 66h290" strokeDasharray="4 5" /></g>{[[85,66],[375,66],[230,152]].slice(0, topics.length).map(([x,y], index) => <g key={index}><circle cx={x} cy={y} r="23" fill={index === active ? '#661414' : '#F8F2EB'} stroke="#B58777" /><text x={x} y={y + 5} fill={index === active ? '#F8F2EB' : '#661414'} textAnchor="middle" fontSize="14" fontFamily="DM Sans, sans-serif">{index + 1}</text></g>)}<circle cx="230" cy="88" r="42" fill="#F8F2EB" stroke="#C04E2A" strokeWidth="1.5" /><path d="M214 88h32m-16-16v32" stroke="#C04E2A" strokeWidth="2" /></svg><div role="group" aria-label="Explore the connections">{topics.map((key, index) => <button key={key} aria-pressed={index === active} onClick={() => onSelect(index)}><span>{index + 1}</span>{lessons[key].title}</button>)}</div><figcaption>Selected connections, not an exhaustive map of metabolism.</figcaption></figure>;
}

export function TeamSummary() {
  return <div className="team-summary"><div className="summary-food-chain" aria-label="Food, digestion and nutrient absorption"><span>Food</span><ArrowRight size={16} /><span>Digestion</span><ArrowRight size={16} /><span>Nutrient absorption</span></div><svg viewBox="0 0 460 135" role="img" aria-label="Pancreas, gut and brain contribute to interacting signals, among many other processes."><path d="M78 60h301M78 60q147 91 301 0" stroke="#C04E2A" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />{['Pancreas', 'Gut', 'Brain'].map((name, index) => <g key={name}><circle cx={78 + index * 151} cy="60" r="39" fill="#F8F2EB" stroke="#B58777" /><text x={78 + index * 151} y="65" fontFamily="DM Serif Display, Georgia, serif" fontSize="17" fill="#661414" textAnchor="middle">{name}</text></g>)}</svg><p>Interacting signals · selected systems, not the whole picture.</p></div>;
}
