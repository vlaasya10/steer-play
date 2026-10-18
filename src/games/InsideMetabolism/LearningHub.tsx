import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { metabolismChapters, metabolismLessons as lessons, type MetabolismChapterId } from '../../data/metabolismLessons';
import LessonNotes from './LessonNotes';
import { BiologyMap, ConversationDiagram, GlucoseDiagram, TopicWeb } from './ScienceDiagrams';

export const deeperPath = (chapter?: MetabolismChapterId) => `/learn/metabolism?${new URLSearchParams({ view: 'deeper', ...(chapter ? { chapter } : {}) })}`;

export function TreatmentNote() {
  return <details className="treatment-note" data-content-id={lessons.treatments.id}><summary>{lessons.treatments.title}</summary><p>{lessons.treatments.simpleExplanation}</p><p>{lessons.treatments.detailedExplanation}</p><p className="lesson-caveat">{lessons.treatments.caveats[0]}</p><span>Pending clinical review</span></details>;
}

function Chapter({ chapterId }: { chapterId: MetabolismChapterId }) {
  const chapter = metabolismChapters.find(item => item.id === chapterId)!;
  const [active, setActive] = useState(0);
  const value = lessons[chapter.lesson];
  const selected = lessons[chapter.topics[active]];
  const notes = { ...value, sourceIds: [...new Set([ ...value.sourceIds, ...chapter.topics.flatMap(key => lessons[key].sourceIds) ])] };
  const index = metabolismChapters.findIndex(item => item.id === chapterId);
  return <article className="metabolism-chapter" data-content-id={value.id}>
    <Link className="text-link" to={deeperPath()}><ArrowLeft size={15} /> All chapters</Link>
    <span className="eyebrow">CHAPTER {String(index + 1).padStart(2, '0')} / 07 · OPTIONAL LEARNING</span>
    <h1>{value.title}</h1><p className="chapter-intro">{value.simpleExplanation}</p>
    {chapter.diagram === 'organs' ? <BiologyMap active={active} onSelect={setActive} /> : chapter.diagram === 'glp1' ? <BiologyMap mode="glp1" active={active} onSelect={setActive} /> : chapter.diagram === 'glucose' ? <><GlucoseDiagram active={active} /><div className="chapter-topic-buttons" role="group" aria-label="Explore glucose relationships">{chapter.topics.map((key, i) => <button key={key} aria-pressed={active === i} onClick={() => setActive(i)}>{i + 1}. {lessons[key].title}</button>)}</div></> : chapter.diagram === 'conversation' ? <><ConversationDiagram /><div className="chapter-topic-buttons" role="group" aria-label="Explore gut–brain communication">{chapter.topics.map((key, i) => <button key={key} aria-pressed={active === i} onClick={() => setActive(i)}>{lessons[key].title}</button>)}</div></> : <TopicWeb topics={chapter.topics} active={active} onSelect={setActive} />}
    <div className="chapter-discovery" role="status" aria-live="polite" data-content-id={selected.id}><h2>{selected.title}</h2><p>{selected.simpleExplanation}</p></div>
    {value.detailedExplanation && <details className="deeper-explanation"><summary>A little more detail</summary><p>{value.detailedExplanation}</p></details>}
    {chapter.id === 'glp1' && <TreatmentNote />}
    <LessonNotes lesson={notes} />
    <nav className="chapter-navigation" aria-label="Chapter navigation">{index > 0 && <Link className="text-link" to={deeperPath(metabolismChapters[index - 1].id)}><ArrowLeft size={15} /> Previous chapter</Link>}{index < 6 && <Link className="text-link" to={deeperPath(metabolismChapters[index + 1].id)}>Next chapter <ArrowRight size={15} /></Link>}</nav>
    <Link className="text-link" to="/"><BookOpen size={15} /> Return to the game library</Link>
  </article>;
}

export default function LearningHub({ chapterId, completed }: { chapterId: string | null; completed: boolean }) {
  const chapter = metabolismChapters.find(item => item.id === chapterId);
  if (chapter) return <Chapter key={chapter.id} chapterId={chapter.id} />;
  return <section className="metabolism-hub" aria-labelledby="learning-hub-heading">
    <Link className="text-link" to="/learn/metabolism"><ArrowLeft size={15} /> {completed ? 'Back to your discovery' : 'Back to Quick Play'}</Link>
    <span className="eyebrow">GO AS DEEP AS YOUR CURIOSITY TAKES YOU</span><h1 id="learning-hub-heading">A little more<br /><em>understanding.</em></h1><p>Seven short chapters. Tap, explore, and take your time. No game completion or account needed.</p>
    {chapterId && <p className="lesson-caveat">That chapter isn’t available. Choose one below.</p>}
    <ol className="chapter-list">{metabolismChapters.map((item, index) => <li key={item.id}><Link to={deeperPath(item.id)}><span>{String(index + 1).padStart(2, '0')}</span><span>{lessons[item.lesson].title}</span><ArrowRight size={17} /></Link></li>)}</ol>
    <p className="lesson-caveat">Educational content · Pending clinical review. These chapters cannot assess your health.</p>
    <Link className="text-link" to="/"><BookOpen size={15} /> Return to the game library</Link>
  </section>;
}
