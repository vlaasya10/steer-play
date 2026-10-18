import { getInterestConfig, isInterest } from './interestConfigs';
import type { InterestCategory } from '../types/quiz';
import type { GameId } from './gameConfigs';
import { getQuizPath, isValidSeed } from '../utils/quizEngine';
import { resolveScenario } from '../games/PredictTheTwist/scenarios';

export const profileIds = ['food','gaming','entertainment','puzzles','lifestyle','science','metabolic-health'] as const;
export type InterestProfile = typeof profileIds[number];
export const creativeIds = ['quiz','missing-clue','predict','signal-rush','case-file','metabolism','glp1'] as const;
export type CreativeId = typeof creativeIds[number];
export const hookVariants = ['primary', 'curiosity', 'challenge'] as const;
export type HookVariant = typeof hookVariants[number];
export function resolveHook(value: string | null | undefined): HookVariant { return hookVariants.includes(value as HookVariant) ? value as HookVariant : 'primary'; }
// Creative hypotheses only. No comparative performance has been measured.
export const alternativeHooks = {
  quiz: [{ headline: 'Know your favourites? Try five questions.', subheading: 'Start with what you enjoy. Discover something new.' }, { headline: 'Your interests. Five little surprises.', subheading: 'Pick an answer. See what you discover.' }],
  'missing-clue': [{ headline: 'Look once. What went missing?', subheading: 'Remember the table. Find the missing detail.' }, { headline: 'One table. One disappearing detail.', subheading: 'Think you spotted it? Put your memory to play.' }],
  predict: [{ headline: 'Same meal. A different next chapter?', subheading: 'Meet two characters. Predict what comes next.' }, { headline: 'What happens next? You decide.', subheading: 'Read the scene. Make two predictions.' }],
  'signal-rush': [{ headline: 'One pattern. Which symbol fits?', subheading: 'Look closely. Three untimed rounds await.' }, { headline: 'Match it. Remember it. Spot it.', subheading: 'Three ways to play with signals. No timer.' }],
  'case-file': [{ headline: 'Open the file. What do you notice?', subheading: 'Inspect three clues before making your deduction.' }, { headline: 'Can three clues tell the whole story?', subheading: 'Read the evidence. Decide what it supports.' }],
} as const;
export interface AudienceProfile { id: InterestProfile; label: string; description: string; creatives: readonly CreativeId[]; organic: 'kitchen' | 'pattern' | 'paper' | 'desk' }
export const campaignProfiles: AudienceProfile[] = [
  { id:'food',label:'Food & Cooking',description:'Kitchen curiosity, familiar meals and small surprises.',creatives:['quiz','predict','missing-clue'],organic:'kitchen' },
  { id:'gaming',label:'Gaming & Challenges',description:'Patterns, quick challenges and playful discoveries.',creatives:['signal-rush','quiz'],organic:'pattern' },
  { id:'entertainment',label:'Entertainment & Storytelling',description:'Everyday scenes and stories with another layer.',creatives:['predict','case-file','quiz'],organic:'paper' },
  { id:'puzzles',label:'Puzzles & Mysteries',description:'Missing details, visual clues and small mysteries.',creatives:['missing-clue','case-file','signal-rush'],organic:'pattern' },
  { id:'lifestyle',label:'Everyday Lifestyle',description:'Relatable routines and everyday what-ifs.',creatives:['predict','quiz','case-file'],organic:'desk' },
  { id:'science',label:'Science & Curiosity',description:'Questions about the world and the science within.',creatives:['metabolism','quiz','glp1'],organic:'paper' },
  { id:'metabolic-health',label:'Metabolic Health & GLP-1 Education',description:'Self-selected curiosity about metabolic-health education.',creatives:['glp1','metabolism'],organic:'desk' },
];
interface CreativeDefinition { gameId: GameId; title: string; headline: string; subheading: string; cta: string; educationalTopic: string; hookVariant: string }
export const primaryCreatives = {
  quiz:{gameId:'quiz',title:'Steer Play Quiz',headline:'Five questions. What will you discover?',subheading:'A little trivia. A new perspective.',cta:'Take the challenge',educationalTopic:'A sourced introduction to appetite signals and GLP-1.',hookVariant:'interest-trivia'},
  'missing-clue':{gameId:'missing-clue',title:'Find What Everyone Missed',headline:'Something disappeared. Did you notice?',subheading:'One familiar table. One missing detail.',cta:'Spot the clue',educationalTopic:'A visual analogy opens a sourced gut–brain discovery.',hookVariant:'missing-object'},
  predict:{gameId:'predict-the-twist',title:'Predict the Twist',headline:'Two people. One meal. What happens next?',subheading:'A shared meal. Another layer to the story.',cta:'Make your prediction',educationalTopic:'Fictional clues lead to the wider context of appetite.',hookVariant:'everyday-story'},
  'signal-rush':{gameId:'signal-rush',title:'Signal Rush',headline:'Can you match the pattern?',subheading:'Three signals. Follow your curiosity.',cta:'Take the challenge',educationalTopic:'Signal matching becomes an analogy for gut–brain communication.',hookVariant:'pattern-match'},
  'case-file':{gameId:'case-file',title:'The Case File',headline:'Three clues. One mystery.',subheading:'Look closer. What do the clues really support?',cta:'Solve the case',educationalTopic:'A fictional case shows why individual context matters.',hookVariant:'three-clues'},
  metabolism:{gameId:'inside-metabolism',title:'Inside Your Metabolism',headline:'What happens inside your body after lunch?',subheading:'Follow the signals. Discover the science.',cta:'Follow the science',educationalTopic:'Interactive digestion, glucose and gut–brain learning.',hookVariant:'meal-journey'},
  glp1:{gameId:'glp1-explained',title:'GLP-1, Explained',headline:'GLP-1: What’s fact and what’s fiction?',subheading:'Pick a question. Get a clearer explanation.',cta:'Explore the facts',educationalTopic:'Sourced GLP-1 questions, with clinical assessment kept distinct from a quiz.',hookVariant:'myth-or-fact'},
} satisfies Record<CreativeId,CreativeDefinition>;
export interface AdCreative extends CreativeDefinition { id: CreativeId; interest: InterestProfile; gameRoute: string; seed: string; quizInterest: InterestCategory; variant: HookVariant }
export function isProfile(value: string | null): value is InterestProfile { return profileIds.includes(value as InterestProfile); }
export function isCreative(value: string | null): value is CreativeId { return creativeIds.includes(value as CreativeId); }
export function getProfile(value: string | null): AudienceProfile { return campaignProfiles.find(profile => profile.id === value) ?? campaignProfiles[0]; }
export function resolveCreative(id: CreativeId, profile: InterestProfile, options: {seed?: string | null; scenario?: string | null; variant?: string | null} = {}): AdCreative {
  const seed = isValidSeed(options.seed ?? null) ? options.seed! : 'reel-demo';
  const quizInterest: InterestCategory = isInterest(profile) ? profile : profile === 'puzzles' ? 'gaming' : 'science';
  const scenario = options.scenario ? resolveScenario(options.scenario) : profile === 'lifestyle' ? 'weekend' : profile === 'entertainment' ? 'family' : 'office';
  const gameRoute = id === 'quiz' ? getQuizPath(quizInterest,seed) : id === 'missing-clue' ? '/play/missing-clue' : id === 'predict' ? `/play/predict?scenario=${scenario}` : id === 'signal-rush' ? `/play/signal-rush?seed=${seed}` : id === 'case-file' ? '/play/case-file?case=office' : id === 'metabolism' ? '/learn/metabolism' : '/learn/glp1';
  const variant = id in alternativeHooks ? resolveHook(options.variant) : 'primary';
  const configuredAlternative = variant !== 'primary' && id in alternativeHooks ? alternativeHooks[id as keyof typeof alternativeHooks][variant === 'curiosity' ? 0 : 1] : undefined;
  const alternative = configuredAlternative && id === 'quiz' ? {...configuredAlternative,headline:variant === 'curiosity' ? `${getInterestConfig(quizInterest).shortLabel} fan? Try five questions.` : `${getInterestConfig(quizInterest).shortLabel}. Five little surprises.`} : configuredAlternative;
  return { ...primaryCreatives[id], id, interest:profile, seed, quizInterest, gameRoute, variant, ...(id === 'quiz' ? { headline:getInterestConfig(quizInterest).adHeadline } : {}), ...alternative, ...(alternative ? {hookVariant:variant} : {}) };
}
export function campaignPath(creative: AdCreative) {
  const query = new URLSearchParams({ profile:creative.interest });
  if (creative.variant !== 'primary') query.set('variant',creative.variant);
  if (creative.id === 'quiz' || creative.id === 'signal-rush') query.set('seed',creative.seed);
  if (creative.id === 'predict') query.set('scenario',new URL(creative.gameRoute,'https://example.invalid').searchParams.get('scenario')!);
  return `/c/${creative.id}?${query}`;
}
export function reelsPath(profile: InterestProfile, index = 0) { return `/demo/reels?${new URLSearchParams({profile,reel:String(Math.max(0,Math.min(4,Math.trunc(index)||0)))})}`; }
export function playablePath(creative: AdCreative) { return `/demo/playable?${new URLSearchParams({profile:creative.interest,creative:creative.id})}`; }
export const organicPosts = [
  { creator:'little.paper.club',headline:'One fold. A different shape.',caption:'An imagined paper studio. What would you make?',tag:'PAPER PLAY' },
  { creator:'everyday.sketchbook',headline:'A small detail changes the scene.',caption:'A fictional creator’s everyday sketch. Take a closer look.',tag:'A LITTLE CURIOSITY' },
  { creator:'weekend.doodles',headline:'Something ordinary. Another possibility.',caption:'An original illustrated moment from an imagined weekend.',tag:'SLOW SCROLL' },
] as const;
export const organicHeadlines = {
  kitchen:['Fold. Fill. Fold again.','A tiny kitchen sketch. What changed?','A weekend table, drawn by hand.'],
  pattern:['Three shapes. Find your rhythm.','A pattern with one unexpected turn.','One more arrangement to try.'],
  paper:['One fold. A different shape.','A small detail changes the story.','An ordinary sheet. Another possibility.'],
  desk:['A little room for a new routine.','A desk doodle, with a small surprise.','A slower moment from an imagined weekend.'],
} satisfies Record<AudienceProfile['organic'],string[]>;
export function buildFeed(profile: InterestProfile, featured?:CreativeId) {
  const audience = getProfile(profile);
  const first=featured && audience.creatives.includes(featured) ? featured : audience.creatives[0];
  const second=audience.creatives.find(id=>id!==first)!;
  return [{kind:'organic' as const,post:0},{kind:'organic' as const,post:1},{kind:'sponsored' as const,creative:first},{kind:'organic' as const,post:2},{kind:'sponsored' as const,creative:second}];
}
