import { describe, expect, it } from 'vitest';
import { createGLP1State, glp1Reducer } from '../games/GLP1Explained/glp1Logic';
import { glp1Questions, getHealthQuestion, glp1Path } from '../data/glp1Questions';
import { scienceSources } from '../data/scientificContent';

describe('GLP-1 independent learning state', () => {
  it('guards progression and duplicate or invalid answers, then requires a purposeful exploration', () => {
    const initial = createGLP1State();
    expect(glp1Reducer(initial, { type: 'next' })).toBe(initial);
    for (const index of [-1,2,NaN,0.5]) expect(glp1Reducer(initial, { type: 'answer', index })).toBe(initial);
    const answer = glp1Reducer(initial, { type: 'answer', index: 0 });
    expect(glp1Reducer(answer, { type: 'answer', index: 1 })).toBe(answer);
    const explanation = glp1Reducer(answer, { type: 'next' });
    expect(explanation.stage).toBe('explanation');
    expect(glp1Reducer(explanation, { type: 'next' })).toBe(explanation);
    expect(glp1Reducer(explanation, { type: 'explore', index: 5, count: 3 })).toBe(explanation);
    let explored = glp1Reducer(explanation, { type: 'explore', index: 1, count: 3 });
    explored = glp1Reducer(explored, { type: 'explore', index: 1, count: 3 });
    expect(explored.explored).toEqual([1]);
    const complete = glp1Reducer(explored, { type: 'next' });
    expect(complete.stage).toBe('complete');
    expect(glp1Reducer(complete, { type: 'answer', index: 1 })).toBe(complete);
    expect(glp1Reducer(complete, { type: 'replay' })).toEqual(initial);
    expect(initial.answer).toBeNull();
  });
  it('has six traceable pending-review records with public, canonical routes', () => {
    expect(glp1Questions).toHaveLength(6);
    expect(new Set(glp1Questions.map(question => question.id)).size).toBe(6);
    for (const question of glp1Questions) {
      expect(question.reviewStatus).toBe('pending');
      expect(question.sourceVerification).toBe('verified');
      expect(question.correctIndex).toBeLessThan(question.choices.length);
      expect(question.choices).toHaveLength(2);
      expect(question.nodes.length).toBeGreaterThanOrEqual(2);
      for (const text of [question.shortExplanation,question.detailedExplanation,question.keyTakeaway,question.shareText,...question.nodes.map(node => node.explanation)]) expect(text.length).toBeGreaterThan(20);
      expect(question.caveats.length).toBeGreaterThan(1);
      for (const sourceId of question.sourceIds) {
        expect(scienceSources[sourceId].url).toMatch(/^https:\/\//);
        expect(question.sourceNotes.find(note => note.sourceId === sourceId)?.supports).toBeTruthy();
      }
      expect(getHealthQuestion(question.slug)).toBe(question);
      expect(glp1Path(question.slug,'library')).toBe(`/learn/glp1?view=library&topic=${question.slug}`);
    }
    expect(getHealthQuestion('unknown')).toBeUndefined();
  });
});
