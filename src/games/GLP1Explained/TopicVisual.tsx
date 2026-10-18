import { Brain, ShieldCheck, Utensils, Dumbbell, HeartHandshake, ClipboardList, Route, Sprout, Plus, Check, ArrowRight } from 'lucide-react';
import { glp1Copy } from '../../data/glp1Questions';
import type { HealthQuestion } from '../../types/healthQuestion';

const symbols = {
  organs: [Utensils, Sprout, Brain], safety: [ShieldCheck, ClipboardList, HeartHandshake],
  strength: [Utensils, Dumbbell, HeartHandshake], paths: [Route, Route],
  distinction: [Sprout, ClipboardList], care: [ClipboardList, ShieldCheck, HeartHandshake, Route],
};

function ConnectionArt({ topic, active }: { topic: HealthQuestion; active: number | null }) {
  if (topic.visual === 'organs') return <svg className="glp-connections" viewBox="0 0 420 180" role="img" aria-label="Simplified selected connections between gut, pancreas and brain. Tap the labels below to explore.">
    <path className="glp-signal" d="M96 83H324M109 75l-13 8 13 8m202-16 13 8-13 8M210 91v38" stroke="var(--color-rust)" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
    <rect x="28" y="50" width="78" height="59" rx="16" fill={active === 0 ? '#E6CBBD' : '#F8F2EB'} stroke="#B58777" /><path d="M40 65h53q8 0 4 8H49q-8 0-4 8h48q8 0 4 8H49" fill="none" stroke="#661414" strokeWidth="2" />
    <path d="M326 96q-25-7-13-27q-1-20 18-18q17-19 32-1q22-3 23 18q15 23-10 28Z" fill={active === 2 ? '#E6CBBD' : '#F8F2EB'} stroke="#661414" strokeWidth="1.8" /><path d="M338 52q16 20-2 42m19-42q-8 17 11 40" fill="none" stroke="#B58777" />
    <path d="M166 142q37-22 88-7q14 8-4 15q-51 17-84 4Z" fill={active === 1 ? '#E6CBBD' : '#F8F2EB'} stroke="#661414" strokeWidth="1.8" />
    <g textAnchor="middle" fontSize="15" fill="#351D1D" fontFamily="DM Sans, sans-serif"><text x="67" y="133">Gut</text><text x="350" y="124">Brain</text><text x="210" y="175">Pancreas</text></g>
    <circle cx="210" cy="83" r="23" fill="#F5EBDF" stroke="#C04E2A" /><text x="210" y="88" fontSize="12" fill="#661414" textAnchor="middle">GLP-1</text>
  </svg>;
  if (topic.visual === 'paths') return <svg className="glp-path-art" viewBox="0 0 420 135" role="img" aria-label="Two illustrative planning paths. No weight outcome is predicted."><path d="M210 25v28Q100 53 72 103m138-50q110 0 138 50" fill="none" stroke="#B58777" strokeWidth="2" /><circle cx="210" cy="25" r="17" fill="#E6CBBD" stroke="#661414" />{[72,348].map((x,i) => <g key={x}><circle cx={x} cy="103" r="18" fill={active === i ? '#661414' : '#F8F2EB'} stroke="#661414" /><text x={x} y="108" fontSize="13" textAnchor="middle" fill={active === i ? '#F8F2EB' : '#661414'}>{i === 0 ? 'A' : 'B'}</text></g>)}</svg>;
  if (topic.visual === 'strength') return <svg className="glp-strength-art" viewBox="0 0 420 135" aria-hidden="true"><path d="M75 96 210 27 345 96Z" fill="none" stroke="#B58777" strokeWidth="1.5" strokeDasharray="5 5" />{[[75,96],[210,27],[345,96]].map(([x,y],i) => <g key={i}><circle cx={x} cy={y} r="24" fill={active === i ? '#E6CBBD' : '#F8F2EB'} stroke="#661414" /><path d={`M${x-8} ${y}h16m-8-8v16`} stroke="#661414" /></g>)}</svg>;
  return null;
}

export default function TopicVisual({ topic, active, explored, onSelect }: { topic: HealthQuestion; active: number | null; explored: number[]; onSelect: (index: number) => void }) {
  const icons = symbols[topic.visual];
  return <figure className={`glp-visual glp-visual-${topic.visual}`}>
    <p className="glp-visual-prompt">{topic.visualPrompt}</p><ConnectionArt topic={topic} active={active} />
    {topic.visual === 'safety' ? <div className="glp-safety-cards">{topic.nodes.map((node,index) => { const Icon = icons[index]; return <details key={node.label} onToggle={event => { if (event.currentTarget.open) onSelect(index); }}><summary><Icon size={21} aria-hidden="true" /><span>{node.label}</span><Plus size={16} aria-hidden="true" /></summary><p>{node.explanation}</p></details>; })}</div> : <>
      <div className="glp-node-controls" role="group" aria-label="Explore the illustration">{topic.nodes.map((node,index) => { const Icon = icons[index]; return <button key={node.label} aria-pressed={active === index} aria-expanded={topic.visual === 'distinction' ? active === index : undefined} aria-controls="glp-visual-answer" onClick={() => onSelect(index)}><span className="glp-node-icon"><Icon size={23} aria-hidden="true" /></span><span>{topic.visual === 'care' && <small>0{index+1} / </small>}{node.label}</span>{explored.includes(index) ? <Check size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</button>; })}</div>
      <div id="glp-visual-answer" className="glp-visual-answer" role="status" aria-live="polite">{active !== null ? <><h2>{topic.nodes[active].label}</h2><p>{topic.nodes[active].explanation}</p></> : <p>Choose a label to reveal its part in the picture.</p>}</div>
    </>}
    <figcaption>{glp1Copy.illustration}</figcaption>
  </figure>;
}
