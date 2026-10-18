import { useEffect, useRef } from 'react';
import type { GLP1State } from '../games/GLP1Explained/glp1Logic';
import { trackEvent, type LocalEventName } from '../utils/events';

export function useGLP1Events(state: GLP1State, run: number, playing: boolean) {
  const seen = useRef(new Set<LocalEventName>());
  const previousRun = useRef(run);
  useEffect(() => {
    if (previousRun.current !== run) { seen.current.clear(); previousRun.current = run; }
    if (!playing) return;
    const once = (name: LocalEventName, condition: boolean) => { if (condition && !seen.current.has(name)) { seen.current.add(name); trackEvent({ name, game: 'glp1' }); } };
    once('topic_selected', true);
    once('myth_answered', state.answer !== null);
    once('educational_reveal_viewed', state.stage === 'explanation');
    once('topic_completed', state.stage === 'complete');
  }, [state, run, playing]);
}
