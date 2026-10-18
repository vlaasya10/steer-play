export interface GLP1State { stage: 'question' | 'explanation' | 'complete'; answer: number | null; explored: number[]; active: number | null }
export type GLP1Action = { type: 'answer'; index: number } | { type: 'explore'; index: number; count: number } | { type: 'next' } | { type: 'replay' };
export function createGLP1State(): GLP1State { return { stage: 'question', answer: null, explored: [], active: null }; }
export function glp1Reducer(state: GLP1State, action: GLP1Action): GLP1State {
  switch (action.type) {
    case 'answer': return state.stage === 'question' && state.answer === null && Number.isInteger(action.index) && action.index >= 0 && action.index < 2 ? { ...state, answer: action.index } : state;
    case 'explore': return state.stage === 'explanation' && Number.isInteger(action.index) && action.index >= 0 && action.index < action.count ? { ...state, active: action.index, explored: [...new Set([...state.explored, action.index])] } : state;
    case 'next': return state.stage === 'question' && state.answer !== null ? { ...state, stage: 'explanation' } : state.stage === 'explanation' && state.explored.length > 0 ? { ...state, stage: 'complete' } : state;
    case 'replay': return createGLP1State();
  }
}
