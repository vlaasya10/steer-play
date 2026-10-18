import type { ScienceSourceId } from '../data/scientificContent';

export interface ScienceLesson {
  id: string;
  title: string;
  simpleExplanation: string;
  detailedExplanation?: string;
  caveats: string[];
  sourceIds: ScienceSourceId[];
  reviewStatus: 'pending' | 'approved';
  sourceVerification: 'verified' | 'pending';
}
