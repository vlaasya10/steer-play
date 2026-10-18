import { articleSources, type ScienceArticle } from '../data/gameScienceContent';

export default function ScienceFootnote({ article, label = 'Sources & context' }: { article: ScienceArticle; label?: string }) {
  return <div className="science-footnote" data-content-id={article.id}><span>Educational content · {article.reviewStatus === 'pending' ? 'Pending clinical review' : 'Clinically reviewed'}</span><details><summary>{label}</summary><p>{article.limitation}</p>{articleSources(article).map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>)}</details></div>;
}
