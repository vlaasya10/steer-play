export type InterestCategory = 'food' | 'gaming' | 'entertainment' | 'lifestyle' | 'science';
export type QuestionKind = 'interest' | 'bridge' | 'discovery';

export interface QuizQuestion {
  id: string;
  category: InterestCategory | 'health';
  kind: QuestionKind;
  prompt: string;
  choices: readonly [string, string, string];
  correctIndex: number;
  explanation: string;
  sourceIds?: string[];
  reviewStatus: 'pending' | 'approved';
}

export interface QuizSession {
  interest: InterestCategory;
  seed: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, number>;
  completed: boolean;
}
