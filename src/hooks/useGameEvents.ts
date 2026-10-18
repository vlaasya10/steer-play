import { useEffect, useRef } from 'react';
import { trackEvent, type EntertainmentGameId } from '../utils/events';

export function useGameEvents(game: EntertainmentGameId, run: number, stage: 'play' | 'science' | 'complete', round: number, completedRounds: number) {
  const opened = useRef(false);
  const recorded = useRef({ run: -1, round: -1, completedRounds: 0, stage: '' });
  useEffect(() => {
    if (!opened.current) { opened.current = true; trackEvent({ name: 'game_opened', game }); }
    const last = recorded.current;
    if (last.run !== run) { last.run = run; last.round = -1; last.completedRounds = 0; last.stage = ''; }
    if (stage === 'play' && last.round !== round) { last.round = round; trackEvent({ name: 'round_started', game, roundNumber: round + 1 }); }
    for (let n = last.completedRounds; n < completedRounds; n++) trackEvent({ name: 'round_completed', game, roundNumber: n + 1 });
    last.completedRounds = completedRounds;
    if (stage === 'science' && last.stage !== stage) trackEvent({ name: 'science_reveal_viewed', game });
    if (stage === 'complete' && last.stage !== stage) trackEvent({ name: 'game_completed', game });
    last.stage = stage;
  }, [game, run, stage, round, completedRounds]);
}
