export const metabolismStages = ['meal', 'digestion', 'glucose', 'conversation', 'glp1', 'check', 'summary', 'complete'] as const;
export type MetabolismStage = typeof metabolismStages[number];
export interface MetabolismState {
  stage: MetabolismStage;
  mealAnswer: number | null;
  digestionStep: number;
  glucoseOrder: number[];
  sequenceHint: number | null;
  signalExplored: boolean;
  gutAnswer: number | null;
  finalAnswer: number | null;
}
export type MetabolismAction =
  | { type: 'answer-meal' | 'answer-gut' | 'answer-final'; choice: number }
  | { type: 'digest' | 'connect-glucose'; index: number }
  | { type: 'explore-signal' | 'next' | 'replay' };

export function createMetabolismState(): MetabolismState {
  return { stage: 'meal', mealAnswer: null, digestionStep: -1, glucoseOrder: [], sequenceHint: null, signalExplored: false, gutAnswer: null, finalAnswer: null };
}
const choiceValid = (choice: number, count: number) => Number.isInteger(choice) && choice >= 0 && choice < count;
export function canAdvanceMetabolism(state: MetabolismState) {
  switch (state.stage) {
    case 'meal': return state.mealAnswer !== null;
    case 'digestion': return state.digestionStep === 2;
    case 'glucose': return state.glucoseOrder.length === 3;
    case 'conversation': return state.signalExplored && state.gutAnswer !== null;
    case 'check': return state.finalAnswer !== null;
    case 'glp1': case 'summary': return true;
    default: return false;
  }
}
export function metabolismReducer(state: MetabolismState, action: MetabolismAction): MetabolismState {
  switch (action.type) {
    case 'replay': return createMetabolismState();
    case 'answer-meal': return state.stage === 'meal' && state.mealAnswer === null && choiceValid(action.choice, 3) ? { ...state, mealAnswer: action.choice } : state;
    case 'answer-gut': return state.stage === 'conversation' && state.signalExplored && state.gutAnswer === null && choiceValid(action.choice, 2) ? { ...state, gutAnswer: action.choice } : state;
    case 'answer-final': return state.stage === 'check' && state.finalAnswer === null && choiceValid(action.choice, 3) ? { ...state, finalAnswer: action.choice } : state;
    case 'digest': return state.stage === 'digestion' && choiceValid(action.index, 3) && action.index <= state.digestionStep + 1 ? { ...state, digestionStep: Math.max(state.digestionStep, action.index) } : state;
    case 'connect-glucose': {
      if (state.stage !== 'glucose' || !choiceValid(action.index, 3) || state.glucoseOrder.includes(action.index)) return state;
      return action.index === state.glucoseOrder.length ? { ...state, glucoseOrder: [...state.glucoseOrder, action.index], sequenceHint: null } : { ...state, sequenceHint: state.glucoseOrder.length };
    }
    case 'explore-signal': return state.stage === 'conversation' && !state.signalExplored ? { ...state, signalExplored: true } : state;
    case 'next': return canAdvanceMetabolism(state) ? { ...state, stage: metabolismStages[metabolismStages.indexOf(state.stage) + 1] } : state;
  }
}
