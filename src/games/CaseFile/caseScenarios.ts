export const officeCase = {
  id: 'office', title: 'The week that felt different.',
  intro: 'Arjun, 32, notices his hunger arriving at different times this week. His notebook records three changes. What can these clues really tell us?',
  clues: [
    { id: 'sleep', title: 'Sleep schedule', detail: 'His bedtime shifted from around 11 pm to 1 am on three evenings.', icon: 'clock' as const },
    { id: 'meal', title: 'Meal routine', detail: 'His usual lunch break moved an hour later on two workdays.', icon: 'plate' as const },
    { id: 'work', title: 'Work schedule', detail: 'An extra evening meeting appeared on his calendar this week.', icon: 'calendar' as const },
  ],
  deduction: 'What’s the most reasonable conclusion?',
  options: ['One clue proves the cause.', 'We need to consider the complete picture.', 'The same explanation applies to everyone.'],
  correctIndex: 1,
};
