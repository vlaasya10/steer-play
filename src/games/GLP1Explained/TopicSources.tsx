import { scienceSources } from '../../data/scientificContent';
import type { HealthQuestion } from '../../types/healthQuestion';
import { trackEvent } from '../../utils/events';

export default function TopicSources({ topic }: { topic: HealthQuestion }) {
  return <div className="glp-sources" data-content-id={topic.id}>
    <span>Educational content · {topic.reviewStatus === 'pending' ? 'Pending clinical review' : 'Clinically reviewed'}</span>
    <details onToggle={event => { if (event.currentTarget.open) trackEvent({ name: 'source_viewed', game: 'glp1' }); }}>
      <summary>View sources and scientific notes</summary>
      {topic.caveats.map(caveat => <p key={caveat}>{caveat}</p>)}
      <p>{topic.sourceVerification === 'verified' ? 'Supporting references verified; clinical review of this wording is pending.' : 'Source verification pending.'}</p>
      <ul>{topic.sourceNotes.map(note => <li key={note.sourceId}><a href={scienceSources[note.sourceId].url} target="_blank" rel="noopener noreferrer">{scienceSources[note.sourceId].title} ↗</a><p><strong>Supports: </strong>{note.supports}</p><p><strong>Limits: </strong>{note.limitation}</p></li>)}</ul>
    </details>
  </div>;
}
export function DeeperExplanation({ topic }: { topic: HealthQuestion }) {
  return <details className="glp-deeper" onToggle={event => { if (event.currentTarget.open) trackEvent({ name: 'deeper_explanation_opened', game: 'glp1' }); }}><summary>A little more detail</summary><p>{topic.detailedExplanation}</p></details>;
}
