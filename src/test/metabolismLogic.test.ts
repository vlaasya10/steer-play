import { describe, expect, it } from 'vitest';
import { createMetabolismState, metabolismReducer as reduce, canAdvanceMetabolism } from '../games/InsideMetabolism/metabolismLogic';
import { metabolismChapters, metabolismLessons } from '../data/metabolismLessons';
import { scienceSources } from '../data/scientificContent';

describe('metabolism learning state', () => {
  it('accepts a wrong opening choice without preventing learning, and locks repeat submissions', () => {
    const initial = createMetabolismState();
    expect(reduce(initial, { type: 'next' })).toBe(initial);
    expect(reduce(initial, { type: 'answer-meal', choice: 9 })).toBe(initial);
    const answered = reduce(initial, { type: 'answer-meal', choice: 2 });
    expect(answered.mealAnswer).toBe(2);
    expect(reduce(answered, { type: 'answer-meal', choice: 0 })).toBe(answered);
    expect(reduce(answered, { type: 'next' }).stage).toBe('digestion');
    expect(initial.mealAnswer).toBeNull();
  });
  it('requires digestion in order while allowing revisiting already explored organs', () => {
    let state = reduce(reduce(createMetabolismState(), { type: 'answer-meal', choice: 0 }), { type: 'next' });
    expect(reduce(state, { type: 'digest', index: 2 })).toBe(state);
    expect(reduce(state, { type: 'digest', index: -1 })).toBe(state);
    expect(reduce(state, { type: 'next' })).toBe(state);
    for (const index of [0, 1, 2]) state = reduce(state, { type: 'digest', index });
    state = reduce(state, { type: 'digest', index: 0 });
    expect(state.digestionStep).toBe(2);
    expect(reduce(state, { type: 'next' }).stage).toBe('glucose');
  });
  it('provides a correction hint without advancing the glucose sequence on an incorrect choice', () => {
    let state = { ...createMetabolismState(), stage: 'glucose' as const };
    state = reduce(state, { type: 'connect-glucose', index: 2 }) as typeof state;
    expect(state.sequenceHint).toBe(0);
    expect(state.glucoseOrder).toEqual([]);
    expect(canAdvanceMetabolism(state)).toBe(false);
    for (const index of [0, 1, 2]) state = reduce(state, { type: 'connect-glucose', index }) as typeof state;
    expect(state.glucoseOrder).toEqual([0, 1, 2]);
    expect(state.sequenceHint).toBeNull();
    expect(reduce(state, { type: 'connect-glucose', index: 1 })).toBe(state);
    expect(reduce(state, { type: 'next' }).stage).toBe('conversation');
  });
  it('requires exploring a signal, allows wrong checks, and resets all interaction state on replay', () => {
    let state = { ...createMetabolismState(), stage: 'conversation' as const };
    expect(reduce(state, { type: 'answer-gut', choice: 1 })).toBe(state);
    state = reduce(state, { type: 'explore-signal' }) as typeof state;
    expect(reduce(state, { type: 'explore-signal' })).toBe(state);
    state = reduce(state, { type: 'answer-gut', choice: 0 }) as typeof state;
    let progressing = reduce(state, { type: 'next' });
    expect(progressing.stage).toBe('glp1');
    progressing = reduce(progressing, { type: 'next' });
    expect(progressing.stage).toBe('check');
    expect(reduce(progressing, { type: 'next' })).toBe(progressing);
    progressing = reduce(progressing, { type: 'answer-final', choice: 0 });
    progressing = reduce(reduce(progressing, { type: 'next' }), { type: 'next' });
    expect(progressing.stage).toBe('complete');
    expect(reduce(progressing, { type: 'next' })).toBe(progressing);
    expect(reduce(progressing, { type: 'replay' })).toEqual(createMetabolismState());
  });
});

describe('science records and optional chapters', () => {
  it('provides unique IDs, limitations, pending review and verified source records for every lesson', () => {
    const values = Object.values(metabolismLessons);
    expect(new Set(values.map(value => value.id)).size).toBe(values.length);
    for (const value of values) {
      expect(value.id).toMatch(/-v1$/);
      expect(value.simpleExplanation.length).toBeGreaterThan(10);
      expect(value.caveats.length).toBeGreaterThan(0);
      expect(value.reviewStatus).toBe('pending');
      expect(value.sourceVerification).toBe('verified');
      expect(value.sourceIds.length).toBeGreaterThan(0);
      for (const id of value.sourceIds) expect(scienceSources[id].url).toMatch(/^https:\/\/(www\.)?(niddk.nih.gov|nhlbi.nih.gov|medlineplus.gov)\//);
    }
  });
  it('defines seven independently accessible chapters with interactive topics and optional depth', () => {
    expect(metabolismChapters).toHaveLength(7);
    expect(new Set(metabolismChapters.map(item => item.id)).size).toBe(7);
    for (const chapter of metabolismChapters) {
      expect(metabolismLessons[chapter.lesson].detailedExplanation).toBeTruthy();
      expect(chapter.topics.length).toBeGreaterThanOrEqual(2);
      for (const key of chapter.topics) expect(metabolismLessons[key]).toBeTruthy();
    }
    expect(metabolismLessons.glpPancreas.simpleExplanation).toContain('when blood glucose is elevated');
    expect(metabolismLessons.treatments.detailedExplanation).toContain('not identical');
  });
});
