import type { SignalRound } from './signalPatterns';
export interface SignalState { stage: 'play' | 'science' | 'complete'; round: number; answers: (number | null)[]; memoryVisible: boolean }
export function createSignalState(): SignalState { return { stage: 'play', round: 0, answers: [null, null, null], memoryVisible: true }; }
export function togglePattern(state: SignalState): SignalState {
  return state.stage === 'play' && state.round === 1 && state.answers[1] === null ? { ...state, memoryVisible: !state.memoryVisible } : state;
}
export function validateSignalAnswer(round: SignalRound, index: number) {
  return Number.isInteger(index) && index >= 0 && index < round.options.length && round.options[index] === round.target;
}
export function chooseSignal(state: SignalState, index: number, rounds: SignalRound[]): SignalState {
  if (state.stage !== 'play' || state.answers[state.round] !== null || (state.round === 1 && state.memoryVisible) || !Number.isInteger(index) || index < 0 || index >= rounds[state.round].options.length) return state;
  const answers = [...state.answers];
  answers[state.round] = index;
  return { ...state, answers };
}
export function advanceSignal(state: SignalState): SignalState {
  if (state.stage === 'science') return { ...state, stage: 'complete' };
  if (state.stage !== 'play' || state.answers[state.round] === null) return state;
  return state.round === 2 ? { ...state, stage: 'science' } : { ...state, round: state.round + 1, memoryVisible: true };
}
