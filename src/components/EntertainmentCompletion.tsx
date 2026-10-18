import GameCompletionScreen from './GameCompletionScreen';
import { articleSources, type ScienceArticle } from '../data/gameScienceContent';
import { trackEvent, type EntertainmentGameId } from '../utils/events';

export default function EntertainmentCompletion({ game, article, path, title, onReplay }: { game: EntertainmentGameId; article: ScienceArticle; path: string; title: string; onReplay: () => void }) {
  return <GameCompletionScreen heading={title} takeaway={article.statement} onReplay={onReplay} source={articleSources(article)[0]}
    discovery={<p className="ending-disclaimer" data-content-id={article.id}>{article.limitation}</p>}
    onExplore={() => trackEvent({ name: 'steer_cta_clicked', game })}
    share={{ path, title: `Steer Play — ${title}`, text: 'A little challenge. A new perspective. Try this Steer Play discovery.', onShare: () => trackEvent({ name: 'challenge_share_clicked', game }) }} />;
}
