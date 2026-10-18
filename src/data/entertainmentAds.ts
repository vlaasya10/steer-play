export const entertainmentAds = [
  { id: 'predict', title: 'Predict the Twist', headline: 'Two people. One meal. Can you predict what happens next?', cta: 'Make your prediction', adRoute: '/ad/predict', playRoute: '/play/predict?scenario=office', audience: 'Everyday stories and unexpected endings.', duration: '~40 sec', art: 'prediction' as const },
  { id: 'signal-rush', title: 'Signal Rush', headline: 'Can you spot the right pattern?', cta: 'Take the challenge', adRoute: '/ad/signal-rush', playRoute: '/play/signal-rush?seed=steer', audience: 'Patterns, puzzles and a little playful focus.', duration: '~30 sec', art: 'signal' as const },
  { id: 'case-file', title: 'The Case File', headline: 'Three clues. One mystery.', cta: 'Solve the case', adRoute: '/ad/case-file', playRoute: '/play/case-file?case=office', audience: 'A small mystery for an inquisitive mind.', duration: '~50 sec', art: 'case' as const },
] as const;
export type EntertainmentAd = typeof entertainmentAds[number];
