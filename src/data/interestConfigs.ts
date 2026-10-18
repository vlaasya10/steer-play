import type { InterestCategory } from '../types/quiz';

export interface InterestConfig {
  id: InterestCategory;
  label: string;
  shortLabel: string;
  hook: string;
  adHeadline: string;
  description: string;
  bridge: string;
  analogy: string;
}

export const interestConfigs: InterestConfig[] = [
  {
    id: 'food', label: 'Food & Cooking', shortLabel: 'Food',
    hook: 'Think you know your Indian food? Let’s find out.',
    adHeadline: 'How much do you really know about Indian food?',
    description: 'A pinch of trivia. A surprising discovery.',
    bridge: 'From the kitchen to the signals within.',
    analogy: 'Fullness involves more than what you can see on a plate. Food composition and gut–brain signals can both play a part. No single Indian food is inherently good or bad.',
  },
  {
    id: 'gaming', label: 'Gaming & Challenges', shortLabel: 'Gaming',
    hook: 'Five quick levels. Can you clear them all?',
    adHeadline: 'Five levels. Think you can clear them?',
    description: 'Follow the pattern. Find a new perspective.',
    bridge: 'You spotted patterns. Now meet another kind of signal.',
    analogy: 'A game uses signals to coordinate what happens next. Your body coordinates appetite through biological signals too. This is an analogy: your score says nothing about your metabolic health or intelligence.',
  },
  {
    id: 'entertainment', label: 'Entertainment & Movies', shortLabel: 'Movies',
    hook: 'Can you predict the next twist?',
    adHeadline: 'Think you can predict the twist?',
    description: 'Small stories. Unexpected discoveries.',
    bridge: 'A good story has layers. So does appetite.',
    analogy: 'Stories rarely turn on one clue alone. Appetite also involves several influences, including hormones, routines and environment. Fictional clues are not medical evidence.',
  },
  {
    id: 'lifestyle', label: 'Everyday Life & Lifestyle', shortLabel: 'Everyday life',
    hook: 'How well do you understand everyday mysteries?',
    adHeadline: 'Five everyday mysteries. How many can you solve?',
    description: 'Familiar routines. A little food for thought.',
    bridge: 'Everyday routines meet everyday biology.',
    analogy: 'Sleep, meal timing, routines and biological signals can influence hunger. A fictional daily-life scenario cannot explain or diagnose an individual’s health.',
  },
  {
    id: 'science', label: 'Science & Curiosity', shortLabel: 'Science',
    hook: 'Five questions. How much science do you really know?',
    adHeadline: 'How much do you actually know about your body?',
    description: 'Everyday wonders. Science worth knowing.',
    bridge: 'From everyday wonders to the science within.',
    analogy: 'The gut and brain exchange signals that help regulate appetite. GLP-1 is one naturally occurring hormone involved in appetite and glucose regulation, within a much wider system.',
  },
];

export function isInterest(value: string | null): value is InterestCategory {
  return interestConfigs.some(interest => interest.id === value);
}
export function getInterestConfig(interest: InterestCategory) {
  return interestConfigs.find(config => config.id === interest)!;
}
