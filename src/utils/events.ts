export type EntertainmentGameId = 'predict' | 'signal-rush' | 'case-file';
export type LocalEventName = 'quiz_opened' | 'quiz_started' | 'question_answered' | 'quiz_completed' | 'science_reveal_viewed' | 'challenge_share_clicked' | 'steer_cta_clicked' | 'game_opened' | 'round_started' | 'round_completed' | 'game_completed' | 'metabolism_opened' | 'digestion_interaction_completed' | 'glucose_sequence_completed' | 'gut_brain_explored' | 'glp1_explanation_viewed' | 'knowledge_check_completed' | 'metabolism_quickplay_completed' | 'deeper_learning_opened' | 'knowledge_card_shared' | 'knowledge_card_copied' | 'glp1_explained_opened' | 'topic_selected' | 'myth_answered' | 'educational_reveal_viewed' | 'deeper_explanation_opened' | 'source_viewed' | 'topic_completed' | 'explore_steer_clicked' | 'reel_simulator_opened' | 'audience_profile_selected' | 'simulated_reel_viewed' | 'sponsored_creative_viewed' | 'ad_cta_clicked' | 'game_launched_from_ad' | 'challenge_link_created' | 'friend_challenge_opened';
export type LocalEvent = Readonly<{ name: LocalEventName; game: 'quiz' | 'missing-clue' | EntertainmentGameId | 'metabolism' | 'glp1' | 'simulator'; questionNumber?: number; roundNumber?: number }>;
const events: LocalEvent[] = [];

// Intentionally memory-only and bounded. Never record interest, seed, answers,
// correctness, URLs, timestamps, identifiers or personal/health information.
export function trackEvent(event: LocalEvent) {
  const safe: LocalEvent = {
    name: event.name, game: event.game,
    ...(Number.isInteger(event.questionNumber) && event.questionNumber! >= 1 && event.questionNumber! <= 5 ? { questionNumber: event.questionNumber } : {}),
    ...(Number.isInteger(event.roundNumber) && event.roundNumber! >= 1 && event.roundNumber! <= 3 ? { roundNumber: event.roundNumber } : {}),
  };
  events.push(Object.freeze(safe));
  if (events.length > 100) events.shift();
}
export function getLocalEvents(): readonly LocalEvent[] { return [...events]; }
export function clearLocalEvents() { events.length = 0; }
