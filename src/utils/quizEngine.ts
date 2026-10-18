import { interestQuestions, getBridgeQuestion, discoveryQuestion } from '../data/quizQuestions';
import type { InterestCategory, QuizSession } from '../types/quiz';

// Non-identifying random seed: no device ID, timestamp, score or answer data.
export function createSeed(): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(2)), value => value.toString(36)).join('-');
}
export function isValidSeed(seed: string | null): seed is string {
  return seed !== null && /^[a-zA-Z0-9_-]{1,48}$/.test(seed);
}

function seededRandom(seed: string) {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  return () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createQuizSession(interest: InterestCategory, seed: string): QuizSession {
  const pool = [...interestQuestions[interest]];
  const random = seededRandom(`${interest}:${seed}`);
  for (let index = pool.length - 1; index > 0; index--) {
    const next = Math.floor(random() * (index + 1));
    [pool[index], pool[next]] = [pool[next], pool[index]];
  }
  return { interest, seed, questions: [...pool.slice(0, 3), getBridgeQuestion(interest), discoveryQuestion], currentIndex: 0, answers: {}, completed: false };
}

export function recordAnswer(session: QuizSession, choice: number): QuizSession {
  const question = session.questions[session.currentIndex];
  if (session.completed || !Number.isInteger(choice) || choice < 0 || choice >= question.choices.length || session.answers[question.id] !== undefined) return session;
  return { ...session, answers: { ...session.answers, [question.id]: choice } };
}

export function advanceQuestion(session: QuizSession): QuizSession {
  if (session.completed || session.answers[session.questions[session.currentIndex].id] === undefined) return session;
  return session.currentIndex === session.questions.length - 1
    ? { ...session, completed: true }
    : { ...session, currentIndex: session.currentIndex + 1 };
}

export function getQuizPath(interest: InterestCategory, seed: string) {
  return `/play/quiz?${new URLSearchParams({ interest, seed })}`;
}
