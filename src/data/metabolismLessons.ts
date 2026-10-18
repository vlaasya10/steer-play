import { steerProgrammeDescription } from './scientificContent';
import type { ScienceLesson } from '../types/science';
import type { ScienceArticle } from './gameScienceContent';
import type { ScienceSourceId } from './scientificContent';

const illustrationCaveat = 'Simplified educational illustration. Selected relationships are shown, not a timed simulation or a complete biological pathway.';
const contextCaveat = 'Individual responses vary. This experience cannot diagnose health or determine treatment suitability.';
function lesson(id: string, title: string, simpleExplanation: string, sourceIds: ScienceSourceId[], detailedExplanation?: string, caveats = [illustrationCaveat, contextCaveat]): ScienceLesson {
  return { id, title, simpleExplanation, detailedExplanation, sourceIds, caveats, reviewStatus: 'pending', sourceVerification: 'verified' };
}

export const metabolismLessons = {
  opening: lesson('metabolism-meal-v1', 'First, digestion.', 'Digestion breaks food down so nutrients can be absorbed and used by the body.', ['digestion'], undefined, ['This lunch is a familiar example, not a food score. Digestion and responses vary.']),
  mouth: lesson('metabolism-mouth-v1', 'Mouth', 'Chewing makes smaller pieces. Saliva starts digesting some carbohydrates.', ['digestion']),
  stomach: lesson('metabolism-stomach-v1', 'Stomach', 'The stomach mixes food with digestive fluids and gradually passes it onward.', ['digestion']),
  intestine: lesson('metabolism-intestine-v1', 'Small intestine', 'Much digestion and nutrient absorption happens here.', ['digestion']),
  sugars: lesson('metabolism-sugars-v1', 'Break down', 'Digestible carbohydrates are broken down into absorbable sugars, including glucose.', ['digestion', 'glucose']),
  bloodstream: lesson('metabolism-absorb-v1', 'Absorb', 'Glucose is absorbed into the bloodstream.', ['digestion', 'glucose']),
  insulin: lesson('metabolism-insulin-v1', 'Regulate', 'Insulin helps regulate blood glucose, including supporting glucose uptake by certain cells.', ['glucose', 'glp1'], 'Insulin is a hormone made by the pancreas. A hormone is a chemical messenger. Glucose is a sugar used for energy.', ['Not all cells depend on insulin for glucose uptake. Other hormones and organs also help regulate glucose.', illustrationCaveat]),
  conversation: lesson('metabolism-conversation-v1', 'Your gut and brain are in conversation.', 'Nerves and hormones carry messages between the gut and brain, contributing to appetite and fullness.', ['digestion', 'appetite']),
  multiple: lesson('metabolism-many-signals-v1', 'Several processes contribute.', 'Appetite involves interacting signals. Sleep, routines, food and individual circumstances can also matter.', ['appetite', 'sleep'], undefined, [contextCaveat]),
  glp1: lesson('metabolism-glp1-v1', 'Meet GLP-1.', 'GLP-1 is a natural hormone, or chemical messenger, released by specialised gut cells, particularly after eating. It contributes to blood-glucose regulation and appetite-related signalling.', ['glp1', 'appetite'], 'Hormones carry chemical messages. GLP-1 is one messenger within a wider network; it does not control appetite or metabolic health alone.'),
  glpGut: lesson('metabolism-glp1-gut-v1', 'Gut · release', 'Specialised cells in the gut release GLP-1 in response to nutrients.', ['glp1', 'appetite']),
  glpPancreas: lesson('metabolism-glp1-pancreas-v1', 'Pancreas · insulin response', 'GLP-1 can enhance insulin release when blood glucose is elevated.', ['glp1'], undefined, ['This is one glucose-dependent action, not the only process regulating insulin or blood glucose.', illustrationCaveat]),
  glpBrain: lesson('metabolism-glp1-appetite-v1', 'Brain · appetite pathways', 'GLP-1 participates in appetite-related pathways alongside other signals.', ['appetite', 'glp1']),
  treatments: lesson('metabolism-treatments-v1', 'Why do people talk about GLP-1 treatments?', 'Some prescription treatments act on GLP-1-related pathways. Benefits, limitations, risks and suitability depend on the treatment and individual clinical assessment.', ['glp1', 'treatmentOverview', 'medicineSafety'], 'The body’s GLP-1 is a naturally occurring hormone. GLP-1 receptor agonists are medicines that activate related receptors, often with longer action; they are not identical to the body’s short-lived hormone signals.', ['This explanation is not a treatment recommendation. No medicine is suitable for everyone; decisions belong with qualified clinicians.']),
  check: lesson('metabolism-interconnected-v1', 'Your body works as a team.', 'Hormones, glucose regulation, nutrition, movement, sleep, medical history and other factors can all be relevant.', ['metabolism', 'glucose', 'sleep', 'assessment'], undefined, [contextCaveat]),
  summary: lesson('metabolism-summary-v1', 'Your body works as a team.', 'Digestion, glucose regulation, hormonal signalling and gut–brain communication contribute to how the body manages energy and appetite.', ['metabolism', 'digestion', 'glucose', 'appetite'], 'The links shown are a starting point. Many organs and processes work together, with individual differences.', [illustrationCaveat, contextCaveat]),
  knowledge: lesson('metabolism-knowledge-card-v1', 'Your gut and brain communicate.', 'Neural and hormonal signals contribute to appetite regulation. GLP-1 is one hormone involved in the broader system.', ['appetite', 'digestion', 'glp1'], undefined, [contextCaveat]),
  definition: lesson('metabolism-definition-v1', 'What is metabolism?', 'Metabolism includes the body’s processes for using and transforming energy. It is much more than digestion.', ['metabolism'], 'Breathing, circulation, maintaining temperature and the work of the brain all involve energy. This illustration shows examples, not a metabolic rate.'),
  afterEating: lesson('metabolism-after-eating-v1', 'What happens after eating?', 'Digestion turns food into absorbable components. The small intestine absorbs many nutrients.', ['digestion'], 'Absorbed nutrients travel through circulation. Processing and storage also involve other organs, including the liver.'),
  glucoseChapter: lesson('metabolism-glucose-chapter-v1', 'Blood glucose and insulin', 'Blood glucose means the glucose in your blood. Insulin helps regulate it as part of a wider system.', ['glucose', 'glp1'], 'The liver and other hormones also contribute. These learning steps do not model a glucose curve or provide a measurement.'),
  fullness: lesson('metabolism-fullness-v1', 'Hunger and fullness', 'Hunger and fullness involve many signals. Food, sleep and daily context can also influence appetite.', ['appetite', 'sleep'], 'Appetite is not a simple test of willpower. A single meal or habit cannot explain everyone’s experience.'),
  gutChapter: lesson('metabolism-gut-chapter-v1', 'Gut–brain communication', 'Your gut and brain exchange messages through nerves and hormones. This helps coordinate appetite and digestion.', ['digestion', 'appetite'], 'There are several communication routes, not one direct switch. The diagram groups these routes to keep the idea simple.'),
  individual: lesson('metabolism-context-v1', 'Why individual context matters', 'People have different histories and circumstances. Understanding health needs more than one symptom or habit.', ['assessment', 'metabolism'], 'Clinicians consider history and relevant assessments in context. This game cannot determine an individual’s health needs.', [contextCaveat]),
  energy: lesson('metabolism-energy-v1', 'Use energy', 'Muscles, the brain and other tissues use energy to do their work.', ['metabolism']),
  maintain: lesson('metabolism-maintain-v1', 'Maintain the body', 'Processes such as circulation and temperature regulation use energy too.', ['metabolism']),
  digestionRole: lesson('metabolism-digestion-role-v1', 'Process nutrients', 'Digestion is one part of the body’s wider metabolic activity.', ['metabolism', 'digestion']),
  foodContext: lesson('metabolism-food-context-v1', 'Food', 'Food composition can influence fullness, alongside other factors.', ['appetite']),
  sleepContext: lesson('metabolism-sleep-context-v1', 'Sleep', 'Sleep can affect appetite-related signalling.', ['sleep']),
  routineContext: lesson('metabolism-routine-context-v1', 'Routines', 'Daily circumstances provide context; one routine does not determine health.', ['appetite', 'assessment']),
  history: lesson('metabolism-history-v1', 'Medical history', 'A person’s history helps clinicians interpret information in context.', ['assessment']),
  assessment: lesson('metabolism-assessments-v1', 'Relevant assessments', 'Clinical assessment can include several measurements rather than one clue.', ['assessment']),
} satisfies Record<string, ScienceLesson>;

export type MetabolismLessonKey = keyof typeof metabolismLessons;
export const metabolismChapters = [
  { id: 'metabolism', lesson: 'definition', diagram: 'network', topics: ['energy', 'maintain', 'digestionRole'] },
  { id: 'after-eating', lesson: 'afterEating', diagram: 'organs', topics: ['mouth', 'stomach', 'intestine'] },
  { id: 'glucose', lesson: 'glucoseChapter', diagram: 'glucose', topics: ['sugars', 'bloodstream', 'insulin'] },
  { id: 'hunger', lesson: 'fullness', diagram: 'network', topics: ['foodContext', 'sleepContext', 'multiple'] },
  { id: 'gut-brain', lesson: 'gutChapter', diagram: 'conversation', topics: ['conversation', 'multiple'] },
  { id: 'glp1', lesson: 'glp1', diagram: 'glp1', topics: ['glpGut', 'glpPancreas', 'glpBrain'] },
  { id: 'context', lesson: 'individual', diagram: 'network', topics: ['history', 'routineContext', 'assessment'] },
] as const;
export type MetabolismChapterId = typeof metabolismChapters[number]['id'];

export const metabolismCopy = {
  openingTitle: 'What actually happens inside your body after a meal?',
  openingPrompt: 'You just ate lunch. What happens next inside your body?',
  openingChoices: ['Food is digested and nutrients are absorbed.', 'Food instantly turns into energy everywhere in the body.', 'The brain stops communicating with the digestive system.'],
  gutPrompt: 'Does one signal control all hunger?',
  gutChoices: ['Yes, just one.', 'No, several processes contribute.'],
  finalPrompt: 'Which statement best describes metabolic health?',
  finalChoices: ['It depends on one hormone alone.', 'It involves several interconnected processes in the body.', 'It can be measured by a short mobile game.'],
  steerIntro: steerProgrammeDescription,
  educationalLabel: 'Educational only · Pending clinical review',
};

export function lessonAsArticle(value: ScienceLesson): ScienceArticle {
  return { id: value.id, title: value.title, statement: value.simpleExplanation, detail: value.detailedExplanation ?? '', limitation: value.caveats.join(' '), sourceIds: value.sourceIds, reviewStatus: value.reviewStatus };
}
