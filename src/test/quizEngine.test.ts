import { describe, expect, it, beforeEach } from 'vitest';
import { interestConfigs } from '../data/interestConfigs';
import { interestQuestions, discoveryQuestion } from '../data/quizQuestions';
import { scienceSources } from '../data/scientificContent';
import { advanceQuestion, createQuizSession, createSeed, getQuizPath, isValidSeed, recordAnswer } from '../utils/quizEngine';
import { clearLocalEvents, getLocalEvents, trackEvent, type LocalEvent } from '../utils/events';

describe.each(interestConfigs)('$label question selection', ({ id }) => {
  it('has five unique, short candidates with three choices and a valid answer', () => {
    const pool = interestQuestions[id];
    expect(pool.length).toBeGreaterThanOrEqual(5);
    expect(new Set(pool.map(q => q.id)).size).toBe(pool.length);
    for (const q of pool) { expect(q.category).toBe(id); expect(q.choices).toHaveLength(3); expect(q.correctIndex).toBeGreaterThanOrEqual(0); expect(q.correctIndex).toBeLessThan(3); expect(q.explanation.length).toBeGreaterThan(10); }
  });
  it('always selects exactly three unique interest questions then its bridge and the shared discovery', () => {
    for (let n = 0; n < 20; n++) {
      const { questions } = createQuizSession(id, `seed${n}`);
      expect(questions).toHaveLength(5);
      expect(new Set(questions.map(q => q.id)).size).toBe(5);
      expect(questions.slice(0, 3).every(q => q.category === id && q.kind === 'interest')).toBe(true);
      expect(questions[3].id).toBe(`bridge-${id}`);
      expect(questions[4]).toEqual(discoveryQuestion);
      for (const q of questions.slice(3)) { expect(q.reviewStatus).toBe('pending'); for (const source of q.sourceIds!) expect(scienceSources).toHaveProperty(source); }
    }
  });
  it('reproduces a shared question order without mutating the bank', () => {
    const original = JSON.stringify(interestQuestions[id]);
    const session = createQuizSession(id, 'demo123');
    const url = new URL(getQuizPath(id, session.seed), 'https://example.test');
    expect([...url.searchParams.keys()]).toEqual(['interest', 'seed']);
    expect(createQuizSession(id, url.searchParams.get('seed')!).questions).toEqual(session.questions);
    expect(JSON.stringify(interestQuestions[id])).toBe(original);
    expect(new Set(Array.from({ length: 20 }, (_, n) => createQuizSession(id, `v${n}`).questions.map(q => q.id).join())).size).toBeGreaterThan(1);
  });
});

describe('session state and URL safety', () => {
  it('locks answers, blocks unearned progression and preserves previous answers', () => {
    const initial = createQuizSession('food', 'demo123');
    expect(advanceQuestion(initial)).toBe(initial);
    expect(recordAnswer(initial, -1)).toBe(initial);
    expect(recordAnswer(initial, 3)).toBe(initial);
    expect(recordAnswer(initial, 0.5)).toBe(initial);
    const answered = recordAnswer(initial, 0);
    expect(recordAnswer(answered, 1)).toBe(answered);
    const next = advanceQuestion(answered);
    expect(next.currentIndex).toBe(1);
    expect(next.answers[initial.questions[0].id]).toBe(0);
    expect(initial.answers).toEqual({});
    expect(advanceQuestion(next)).toBe(next);
  });
  it('completes regardless of correctness and replay creates fresh answer state', () => {
    let session = createQuizSession('gaming', 'demo123');
    for (let i = 0; i < 5; i++) session = advanceQuestion(recordAnswer(session, (session.questions[i].correctIndex + 1) % 3));
    expect(session.completed).toBe(true);
    expect(Object.keys(session.answers)).toHaveLength(5);
    expect(recordAnswer(session, 0)).toBe(session);
    expect(advanceQuestion(session)).toBe(session);
    expect(createQuizSession('gaming', session.seed).answers).toEqual({});
  });
  it('generates non-identifying seeds and rejects unsafe or oversized parameters', () => {
    expect(isValidSeed(createSeed())).toBe(true);
    for (const invalid of [null, '', 'a'.repeat(49), 'name@example.com', '../x', '<script>', 'health answer']) expect(isValidSeed(invalid)).toBe(false);
    expect(isValidSeed('demo123')).toBe(true);
  });
});

describe('memory-only events', () => {
  beforeEach(clearLocalEvents);
  it('drops extra fields and bounds the in-memory buffer', () => {
    const extra = { name: 'question_answered', game: 'quiz', questionNumber: 2, answer: 'private', seed: 'secret', interest: 'science' } as LocalEvent;
    trackEvent(extra);
    expect(getLocalEvents()).toEqual([{ name: 'question_answered', game: 'quiz', questionNumber: 2 }]);
    for (let i = 0; i < 110; i++) trackEvent({ name: 'quiz_started', game: 'quiz' });
    expect(getLocalEvents()).toHaveLength(100);
    const copy = getLocalEvents() as LocalEvent[];
    copy.length = 0;
    expect(getLocalEvents()).toHaveLength(100);
  });
});
