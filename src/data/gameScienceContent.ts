import { scienceSources, type ScienceSourceId } from './scientificContent';

export interface ScienceArticle {
  id: string;
  title: string;
  statement: string;
  detail: string;
  limitation: string;
  sourceIds: ScienceSourceId[];
  reviewStatus: 'pending' | 'approved';
}

// Authoritative references support these cautious educational statements.
// No clinical approval has occurred. IDs remain stable for future review records.
export const gameScience = {
  prediction: {
    id: 'appetite-many-influences-v1',
    title: 'There’s more to the story than one meal.',
    statement: 'Food composition, sleep, daily routines and biological signals can influence hunger. Individual experiences may differ.',
    detail: 'The fictional clues cannot tell us exactly when either person will feel hungry. No one meal determines the whole story.',
    limitation: 'These are fictional adults. Neither a prediction nor a meal description measures metabolic health or establishes a cause.',
    sourceIds: ['digestion', 'sleep', 'appetite'], reviewStatus: 'pending',
  },
  routine: {
    id: 'routine-context-v1',
    title: 'A new clue adds context, not certainty.',
    statement: 'Sleep and changes in routine may influence appetite. One changed evening cannot tell us what someone will feel the next day.',
    detail: 'The best-supported ending leaves room for several influences and individual circumstances.',
    limitation: 'The scene is a story, not a diagnosis. We cannot infer a medical condition or a treatment need from a routine change.',
    sourceIds: ['sleep', 'appetite'], reviewStatus: 'pending',
  },
  predict: {
    id: 'predict-gut-brain-v1',
    title: 'Appetite has more than one storyline.',
    statement: 'The gut and brain communicate through nerves and hormones involved in appetite regulation.',
    detail: 'GLP-1 is one naturally occurring hormone involved in appetite and blood-glucose regulation. It is part of a wider system, and people may respond differently.',
    limitation: 'The story is an analogy, not a model of an individual’s biology. Your predictions do not measure health or determine treatment suitability.',
    sourceIds: ['digestion', 'appetite', 'glp1'], reviewStatus: 'pending',
  },
  signal: {
    id: 'signal-gut-brain-v1',
    title: 'Signals help systems communicate.',
    statement: 'Your gut and brain communicate using nerves and hormones. GLP-1 is one hormone involved in appetite and blood-glucose regulation.',
    detail: 'Biological signalling is far more complex than matching a symbol. The game offers a simple analogy for communication between systems.',
    limitation: 'This game does not test your metabolism, health or intelligence. Accuracy and reaction speed are entertainment mechanics only.',
    sourceIds: ['digestion', 'appetite', 'glp1'], reviewStatus: 'pending',
  },
  deduction: {
    id: 'case-context-v1',
    title: 'Not every mystery has one simple explanation.',
    statement: 'Sleep, meals, routines and biological signals may all contribute to daily experiences such as hunger. No single clue establishes a cause.',
    detail: 'Arjun’s notes describe changes, not proof. Considering the complete picture is more reasonable than diagnosing from one habit.',
    limitation: 'Arjun is a fictional adult. This case does not identify a condition or explain anyone’s individual symptoms.',
    sourceIds: ['digestion', 'sleep', 'appetite'], reviewStatus: 'pending',
  },
  case: {
    id: 'case-whole-picture-v1',
    title: 'A person is more than a single clue.',
    statement: 'Metabolic health involves interconnected processes. Understanding someone’s health needs more context than one symptom or habit.',
    detail: 'A clinician considers a person’s history and relevant assessments. Steer’s doctor-led approach includes individual assessment and ongoing care.',
    limitation: 'This mystery is not a clinical assessment. Your deduction cannot diagnose health, establish a cause or determine treatment suitability.',
    sourceIds: ['digestion', 'assessment', 'steerProgramme'], reviewStatus: 'pending',
  },
} satisfies Record<string, ScienceArticle>;

export function articleSources(article: ScienceArticle) {
  return article.sourceIds.map(id => scienceSources[id]);
}
