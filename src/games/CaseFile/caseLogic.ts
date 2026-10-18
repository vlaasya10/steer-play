export interface CaseState { stage: 'board' | 'deduction' | 'science' | 'complete'; inspected: boolean[]; expanded: boolean[]; answer: number | null }
export function createCaseState(): CaseState { return { stage: 'board', inspected: [false, false, false], expanded: [false, false, false], answer: null }; }
export function inspectClue(state: CaseState, index: number): CaseState {
  if (state.stage !== 'board' || !Number.isInteger(index) || index < 0 || index > 2) return state;
  return { ...state, inspected: state.inspected.map((value, i) => value || i === index), expanded: state.expanded.map((value, i) => i === index ? !value : value) };
}
export function chooseDeduction(state: CaseState, index: number): CaseState {
  if (state.stage !== 'deduction' || state.answer !== null || !Number.isInteger(index) || index < 0 || index > 2) return state;
  return { ...state, answer: index };
}
export function advanceCase(state: CaseState): CaseState {
  if (state.stage === 'board' && state.inspected.every(Boolean)) return { ...state, stage: 'deduction' };
  if (state.stage === 'deduction' && state.answer !== null) return { ...state, stage: 'science' };
  if (state.stage === 'science') return { ...state, stage: 'complete' };
  return state;
}
