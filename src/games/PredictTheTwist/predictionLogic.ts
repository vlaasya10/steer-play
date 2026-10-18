export type PredictionStage = 'first' | 'second' | 'science' | 'complete';
export interface PredictionState { stage: PredictionStage; answers: [number | null, number | null] }
export function createPredictionState(): PredictionState { return { stage: 'first', answers: [null, null] }; }
export function choosePrediction(state: PredictionState, choice: number): PredictionState {
  if (state.stage !== 'first' && state.stage !== 'second') return state;
  const round = state.stage === 'first' ? 0 : 1;
  if (!Number.isInteger(choice) || choice < 0 || choice >= (round === 0 ? 3 : 2) || state.answers[round] !== null) return state;
  const answers: PredictionState['answers'] = [...state.answers];
  answers[round] = choice;
  return { ...state, answers };
}
export function advancePrediction(state: PredictionState): PredictionState {
  if (state.stage === 'first' && state.answers[0] !== null) return { ...state, stage: 'second' };
  if (state.stage === 'second' && state.answers[1] !== null) return { ...state, stage: 'science' };
  if (state.stage === 'science') return { ...state, stage: 'complete' };
  return state;
}
export function predictionIsSupported(choice: number) { return choice === 1; }
