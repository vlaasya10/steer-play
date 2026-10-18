export const scenarioIds = ['office', 'family', 'college', 'weekend'] as const;
export type ScenarioId = typeof scenarioIds[number];
export interface PredictionScenario {
  id: ScenarioId;
  label: string;
  setting: string;
  people: [string, string];
  scene: string;
  notes: [string, string];
  followup: string;
  choices: [string, string, string];
  endings: [string, string];
  alternatives: [string, string];
}

export const predictionScenarios: Record<ScenarioId, PredictionScenario> = {
  office: {
    id: 'office', label: 'Office lunch', setting: '12:45 PM · BENGALURU', people: ['Meera, 29', 'Kabir, 31'],
    scene: 'Two colleagues open their tiffins. Same lunch break. Very different calendars. What might the afternoon bring?',
    notes: ['Meera had an early meeting.', 'Kabir has a late work shift.'],
    followup: 'A late call changes Kabir’s evening. His usual bedtime shifts. Which ending is best supported by this new clue?',
    choices: ['They will feel hungry at exactly the same time.', 'Their experiences might differ; there is more to the story.', 'The larger lunch always prevents hunger for longer.'],
    endings: ['One late night explains everything.', 'Keep the wider picture in view.'],
    alternatives: ['A single-cause ending', 'An open-ended story'],
  },
  family: {
    id: 'family', label: 'Family dinner', setting: '8:00 PM · PUNE', people: ['Asha, 36', 'Rohan, 38'],
    scene: 'Dinner is ready. Two adults join the same table after very different days. Can one shared meal tell the whole story?',
    notes: ['Asha’s lunch was later than usual.', 'Rohan started work early.'],
    followup: 'A family call runs late and shifts Asha’s usual sleep routine. What can we reasonably conclude about tomorrow?',
    choices: ['The same dinner guarantees identical hunger later.', 'Their experiences may differ for several reasons.', 'The biggest plate always settles tomorrow’s appetite.'],
    endings: ['Tomorrow’s hunger is already certain.', 'The new clue adds context, not certainty.'],
    alternatives: ['A fixed ending', 'Leave room for context'],
  },
  college: {
    id: 'college', label: 'Busy college day', setting: '1:15 PM · ADULT STUDENTS', people: ['Nila, 22', 'Dev, 24'],
    scene: 'Two adult postgraduate students meet for lunch between classes. The afternoon timetable has a surprise for each of them.',
    notes: ['Nila has a project presentation.', 'Dev has a late library session.'],
    followup: 'Dev’s project discussion moves to the evening and changes his usual bedtime. Which ending leaves room for the evidence?',
    choices: ['A shared lunch guarantees an identical afternoon.', 'Different routines may lead to different experiences.', 'The largest meal always decides how the day feels.'],
    endings: ['One timetable change proves the cause.', 'Consider the whole day before concluding.'],
    alternatives: ['Jump to a conclusion', 'Keep investigating'],
  },
  weekend: {
    id: 'weekend', label: 'Weekend schedule', setting: '2:00 PM · HYDERABAD', people: ['Tara, 28', 'Imran, 30'],
    scene: 'Weekend lunch, finally. One friend has been up since dawn; the other had a slow morning. What happens next?',
    notes: ['Tara went out early for errands.', 'Imran’s morning began much later.'],
    followup: 'An evening get-together pushes their usual sleep schedules later. Which conclusion is best supported?',
    choices: ['The same lunch means identical hunger later.', 'Their afternoons may differ for several reasons.', 'Portion size alone tells us everything.'],
    endings: ['The changed bedtime decides everything.', 'Acknowledge the clue and the unknowns.'],
    alternatives: ['One clue, one cause', 'Room for several influences'],
  },
};
export function resolveScenario(value: string | null): ScenarioId {
  return scenarioIds.includes(value as ScenarioId) ? value as ScenarioId : 'office';
}
