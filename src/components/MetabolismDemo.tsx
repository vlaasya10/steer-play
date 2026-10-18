import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/metabolism.css';

export default function MetabolismDemo() {
  return <section className="metabolism-demo" aria-labelledby="metabolism-demo-heading"><span className="eyebrow">06 / SCIENCE YOU CAN EXPLORE</span><h2 id="metabolism-demo-heading">Inside Your Metabolism</h2><p>Follow a meal through an interactive diagram, connect a glucose sequence, and discover how signals work together.</p><div><Link className="button primary" to="/learn/metabolism">Preview Quick Play <ArrowRight size={17} /></Link><Link className="text-link" to="/learn/metabolism?view=deeper"><BookOpen size={16} /> Explore the seven chapters</Link></div><p className="lesson-caveat">A simplified educational experience for adults. Scientific content is pending clinical review; this is not a health assessment.</p></section>;
}
