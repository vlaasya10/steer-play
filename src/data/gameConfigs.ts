export type GameId = 'quiz' | 'missing-clue' | 'predict-the-twist' | 'signal-rush' | 'case-file' | 'inside-metabolism' | 'glp1-explained';
export type GameConfig = { id: GameId; title: string; category: 'entertainment' | 'science'; description: string; tag: string; route: string; available: boolean; duration?: string; art: 'table' | 'quiz' | 'prediction' | 'signal' | 'case' | 'metabolism' | 'glp1' };

export const gameConfigs: GameConfig[] = [
  { id: 'missing-clue', title: 'Find What Everyone Missed', category: 'entertainment', description: 'A familiar scene. One missing detail. How much do you really notice?', tag: 'OBSERVATION', route: '/play/missing-clue', available: true, art: 'table' },
  { id: 'quiz', title: 'Steer Play Quiz', category: 'entertainment', description: 'A few good questions. A few surprising answers.', tag: 'TRIVIA', route: '/play/quiz', available: true, art: 'quiz' },
  { id: 'predict-the-twist', title: 'Predict the Twist', category: 'entertainment', description: 'Everyday stories. Unexpected possibilities.', tag: 'PREDICTION', route: '/play/predict', available: true, duration: '~40 sec', art: 'prediction' },
  { id: 'signal-rush', title: 'Signal Rush', category: 'entertainment', description: 'Find the pattern. Follow the right signal.', tag: 'QUICK THINKING', route: '/play/signal-rush', available: true, duration: '~30 sec', art: 'signal' },
  { id: 'case-file', title: 'The Case File', category: 'entertainment', description: 'Connect the clues hiding in plain sight.', tag: 'MYSTERY', route: '/play/case-file', available: true, duration: '~50 sec', art: 'case' },
  { id: 'inside-metabolism', title: 'Inside Your Metabolism', category: 'science', description: 'Meet the remarkable systems working within you.', tag: 'BODY SCIENCE', route: '/learn/metabolism', available: true, duration: '~1 min', art: 'metabolism' },
  { id: 'glp1-explained', title: 'GLP-1, Explained', category: 'science', description: 'The science, the questions, and the bigger picture.', tag: 'GUIDED LEARNING', route: '/learn/glp1', available: true, duration: '~1 min', art: 'glp1' },
];

