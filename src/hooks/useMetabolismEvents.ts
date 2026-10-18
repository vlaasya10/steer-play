import { useEffect, useRef } from 'react';
import { trackEvent, type LocalEventName } from '../utils/events';
import type { MetabolismState } from '../games/InsideMetabolism/metabolismLogic';

export function useMetabolismEvents(state: MetabolismState, run: number, view: string) {
  const opened = useRef(false);
  const seen = useRef(new Set<LocalEventName>());
  const previousRun = useRef(run);
  const previousView = useRef('');
  useEffect(() => {
    if (!opened.current) { opened.current = true; trackEvent({ name: 'metabolism_opened', game: 'metabolism' }); }
    if (previousRun.current !== run) { seen.current.clear(); previousRun.current = run; }
    const once = (name: LocalEventName, condition: boolean) => { if (condition && !seen.current.has(name)) { seen.current.add(name); trackEvent({ name, game: 'metabolism' }); } };
    once('digestion_interaction_completed', state.digestionStep === 2);
    once('glucose_sequence_completed', state.glucoseOrder.length === 3);
    once('gut_brain_explored', state.signalExplored);
    once('glp1_explanation_viewed', state.stage === 'glp1');
    once('knowledge_check_completed', state.finalAnswer !== null);
    once('metabolism_quickplay_completed', state.stage === 'complete');
    if (view === 'deeper' && previousView.current !== view) trackEvent({ name: 'deeper_learning_opened', game: 'metabolism' });
    previousView.current = view;
  }, [state, run, view]);
}
