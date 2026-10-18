import type { InterestCategory, QuizQuestion } from '../types/quiz';
import { quizScienceContent, type ScienceSourceId } from './scientificContent';

// Curated prototype candidates. Approval has not occurred; review remains pending.
function candidate(category: InterestCategory, id: string, prompt: string, choices: QuizQuestion['choices'], correctIndex: number, explanation: string): QuizQuestion {
  const sourceIds: ScienceSourceId[] | undefined = id === 'science-heart' ? ['heart'] : id === 'science-cell' ? ['cells'] : undefined;
  return { id, category, prompt, choices, correctIndex, explanation, kind: 'interest', reviewStatus: 'pending', ...(sourceIds ? {sourceIds} : {}) };
}

export const interestQuestions: Record<InterestCategory, QuizQuestion[]> = {
  food: [
    candidate('food', 'food-paneer', 'Which ingredient is used to make paneer?', ['Milk', 'Rice flour', 'Coconut water'], 0, 'Paneer is a fresh cheese made by curdling milk, usually with an acid such as lemon juice.'),
    candidate('food', 'food-idli', 'How are traditional idlis cooked?', ['Deep-fried', 'Steamed', 'Roasted over a flame'], 1, 'Idli batter is steamed in moulds. That is what gives these familiar breakfast favourites their soft texture.'),
    candidate('food', 'food-dhokla', 'Dhokla is especially associated with which state?', ['Punjab', 'Kerala', 'Gujarat'], 2, 'Dhokla is a well-known Gujarati dish. Many versions use a fermented batter and are steamed.'),
    candidate('food', 'food-tadka', 'What does a tadka usually involve?', ['Freezing a sauce', 'Blooming spices in hot oil or ghee', 'Sifting flour'], 1, 'A tadka briefly heats spices in oil or ghee to release flavour and aroma. The technique appears across Indian cuisines.'),
    candidate('food', 'food-poha', 'Poha is made from which grain?', ['Wheat', 'Millet', 'Rice'], 2, 'Poha is flattened rice. Different regions prepare it with their own combinations of ingredients and spices.'),
  ],
  gaming: [
    candidate('gaming', 'gaming-double', 'Find the next number: 2, 4, 8, 16, …', ['18', '24', '32'], 2, 'Each number doubles. Doubling 16 gives 32.'),
    candidate('gaming', 'gaming-pattern', 'What comes next? ○ △ ○ △ ○ …', ['○', '△', '□'], 1, 'The pattern alternates circle, triangle. A triangle follows the final circle.'),
    candidate('gaming', 'gaming-odd', 'Which number is the odd one out?', ['9', '12', '18'], 0, '9 is odd; 12 and 18 are even. Here, “odd one out” is a clue of its own.'),
    candidate('gaming', 'gaming-checkpoint', 'What does a checkpoint usually let you do?', ['Skip every level', 'Restart from a saved point', 'Change the game’s rules'], 1, 'A checkpoint saves progress at a particular point, so a retry can begin from there.'),
    candidate('gaming', 'gaming-turn', 'Facing north, you turn right twice. Where do you face?', ['East', 'West', 'South'], 2, 'The first right turn faces east. The second faces south.'),
  ],
  entertainment: [
    candidate('entertainment', 'ent-flashback', 'A story jumps to an earlier event. What is that called?', ['A sequel', 'A flashback', 'A trailer'], 1, 'A flashback shows an earlier moment, often to give the present scene new meaning.'),
    candidate('entertainment', 'ent-foreshadow', 'A tiny clue hints at a later event. That is…', ['Foreshadowing', 'An interval', 'A remake'], 0, 'Foreshadowing plants a hint before the event it points towards.'),
    candidate('entertainment', 'ent-cliffhanger', 'An episode ends just before a mystery is solved. That is a…', ['Montage', 'Cliffhanger', 'Closing credit'], 1, 'A cliffhanger leaves an important moment unresolved, giving viewers a reason to return.'),
    candidate('entertainment', 'ent-montage', 'Several short scenes show weeks passing. This is a…', ['Close-up', 'Sound check', 'Montage'], 2, 'A montage combines short shots to compress time or connect ideas.'),
    candidate('entertainment', 'ent-clue', 'A locked-room story reveals a spare key. Which lead is most useful?', ['The wallpaper colour', 'Who could access the key', 'The day’s film listings'], 1, 'Access to the key is directly connected to the locked-room question. It is a lead to investigate, not proof of guilt.'),
  ],
  lifestyle: [
    candidate('lifestyle', 'life-mug', 'Your chai cools faster with the lid off. Why?', ['More heat escapes', 'The cup gains ice', 'The tea stops being liquid'], 0, 'An open cup loses heat to the air, including through evaporation. No mystery ingredient needed.'),
    candidate('lifestyle', 'life-calendar', 'A meeting is at 14:30. What time is that?', ['12:30 pm', '2:30 pm', '4:30 pm'], 1, 'In the 24-hour clock, 14:30 is 2:30 in the afternoon.'),
    candidate('lifestyle', 'life-reminder', 'You keep forgetting your tiffin. Which plan gives a direct reminder?', ['Hide it in a cupboard', 'Wait until lunchtime', 'Place a note by your keys'], 2, 'A note where you pick up your keys makes the reminder visible at the moment you leave.'),
    candidate('lifestyle', 'life-walk', 'A walk takes 10 minutes each way. Going there and back takes…', ['10 minutes', '20 minutes', '30 minutes'], 1, 'Ten minutes out and ten back makes twenty minutes, excluding any time at the destination.'),
    candidate('lifestyle', 'life-schedule', 'A bus leaves every 15 minutes from 9:00. The next after 9:15 is…', ['9:20', '9:45', '9:30'], 2, 'Adding fifteen minutes to 9:15 gives 9:30. Real bus arrivals may vary, of course.'),
  ],
  science: [
    candidate('science', 'science-heart', 'Which organ pumps blood around your body?', ['The liver', 'The heart', 'The stomach'], 1, 'The heart is a muscular pump that moves blood through the circulation.'),
    candidate('science', 'science-evaporation', 'A puddle slowly disappears on a warm day. What happened?', ['Evaporation', 'Magnetism', 'Freezing'], 0, 'Liquid water becomes water vapour and mixes into the air. This is evaporation.'),
    candidate('science', 'science-sound', 'Can sound travel through a perfect vacuum?', ['Yes, faster than in air', 'Only at night', 'No, it needs a medium'], 2, 'Sound travels as vibrations through matter. A perfect vacuum has no medium to carry those vibrations.'),
    candidate('science', 'science-cell', 'What is the basic living unit of the human body?', ['A cell', 'A crystal', 'A grain of sand'], 0, 'Cells are the basic living units. Different cell types perform different jobs.'),
    candidate('science', 'science-moon', 'Why does the Moon appear bright?', ['It burns like a star', 'It reflects sunlight', 'It stores lightning'], 1, 'The Moon reflects light from the Sun. It does not produce its own visible light like a star.'),
  ],
};

const bridgePrompts: Record<InterestCategory, { prompt: string; choices: QuizQuestion['choices']; correctIndex: number }> = {
  food: { prompt: 'Which can influence how full someone feels?', choices: ['Only the size of the plate', 'Food composition and gut–brain signals', 'Only the colour of a meal'], correctIndex: 1 },
  gaming: { prompt: 'Which signals help your body regulate appetite?', choices: ['Game scores', 'Phone notifications', 'Nerves and hormones'], correctIndex: 2 },
  entertainment: { prompt: 'Is hunger controlled by one simple cause?', choices: ['No, several influences work together', 'Yes, only willpower', 'Yes, only the time on a clock'], correctIndex: 0 },
  lifestyle: { prompt: 'What can influence hunger during the day?', choices: ['Only your work calendar', 'Sleep, meals and biological signals', 'Only whether you take the bus'], correctIndex: 1 },
  science: { prompt: 'What does gut–brain communication help regulate?', choices: ['Hair colour', 'The length of your bones', 'Appetite, among other functions'], correctIndex: 2 },
};

export function getBridgeQuestion(interest: InterestCategory): QuizQuestion {
  return {
    id: `bridge-${interest}`, category: interest, kind: 'bridge',
    ...bridgePrompts[interest], explanation: quizScienceContent.bridgeExplanations[interest],
    sourceIds: interest === 'lifestyle' ? ['digestion', 'sleep'] : interest === 'science' ? ['digestion', 'appetite', 'glp1'] : ['digestion', 'appetite'],
    reviewStatus: quizScienceContent.reviewStatus,
  };
}

export const discoveryQuestion: QuizQuestion = {
  id: 'health-glp1', category: 'health', kind: 'discovery', prompt: 'What is GLP-1?',
  choices: ['A vitamin found in food', 'A naturally occurring hormone involved in appetite and glucose regulation', 'A type of exercise'],
  correctIndex: 1, explanation: quizScienceContent.glp1Explanation,
  sourceIds: ['glp1', 'appetite'], reviewStatus: quizScienceContent.reviewStatus,
};
