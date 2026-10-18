import { scienceSources } from '../../data/scientificContent';
import type { ScienceLesson } from '../../types/science';

export default function LessonNotes({ lesson }: { lesson: ScienceLesson }) {
  return <div className="lesson-notes" data-content-id={lesson.id}><span>Educational content · {lesson.reviewStatus === 'pending' ? 'Pending clinical review' : 'Clinically reviewed'}</span><details><summary>Sources & scientific notes</summary>{lesson.caveats.map(caveat => <p key={caveat}>{caveat}</p>)}{lesson.sourceVerification === 'pending' && <p>Source verification pending.</p>}{lesson.sourceIds.map(id => <a key={id} href={scienceSources[id].url} target="_blank" rel="noopener noreferrer">{scienceSources[id].title} ↗</a>)}</details></div>;
}
