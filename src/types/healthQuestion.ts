import type { ScienceSourceId } from '../data/scientificContent';

export type HealthTopicId = 'works' | 'safety' | 'muscle' | 'stopping' | 'beyond-diabetes' | 'assessment';
export interface HealthQuestion {
  id: string;
  slug: HealthTopicId;
  title: string;
  category: string;
  question: string;
  choices: readonly string[];
  correctIndex: number;
  answerLabel: string;
  shortExplanation: string;
  detailedExplanation: string;
  keyTakeaway: string;
  caveats: string[];
  sourceIds: ScienceSourceId[];
  sourceNotes: { sourceId: ScienceSourceId; supports: string; limitation: string }[];
  reviewStatus: 'pending' | 'approved';
  sourceVerification: 'verified' | 'pending';
  visual: 'organs' | 'safety' | 'strength' | 'paths' | 'distinction' | 'care';
  visualPrompt: string;
  nodes: { label: string; explanation: string }[];
  shareTitle: string;
  shareText: string;
}
