import { StrictMode } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import { predictionScenarios, scenarioIds } from '../games/PredictTheTwist/scenarios';
import { generateSignalPatterns } from '../games/SignalRush/signalPatterns';
import { officeCase } from '../games/CaseFile/caseScenarios';
import { gameScience, type ScienceArticle } from '../data/gameScienceContent';
import { entertainmentAds } from '../data/entertainmentAds';
import { clearLocalEvents, getLocalEvents, type EntertainmentGameId } from '../utils/events';

function open(path: string) { return render(<StrictMode><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></StrictMode>); }
beforeEach(clearLocalEvents);
afterEach(() => {
  Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
});
async function finish(article: ScienceArticle, game: EntertainmentGameId, path: string, rounds: number) {
  expect(screen.getByRole('heading', { name: article.title })).toBeInTheDocument();
  expect(screen.getByText(article.statement)).toBeInTheDocument();
  expect(screen.getByText(article.limitation, { selector: '.analogy-note' })).toBeInTheDocument();
  expect(screen.getByText(/Pending clinical review/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Sources & context'));
  expect(screen.getAllByRole('link').some(link => link.getAttribute('href')?.includes('.nih.gov/'))).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: /Take this discovery/ }));
  const cta = screen.getByRole('link', { name: /Explore Steer/ });
  expect(cta).toHaveAttribute('href', 'https://steerclub.com');
  fireEvent.click(cta);
  expect(screen.getByRole('link', { name: /Explore More Games/ })).toHaveAttribute('href', '/');
  fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
  const link = (await screen.findByRole('textbox', { name: 'Challenge URL' })).getAttribute('value')!;
  const url = new URL(link);
  expect(url.pathname + url.search).toBe(path);
  expect([...url.searchParams.keys()]).toHaveLength(1);
  const events = getLocalEvents().filter(event => event.game === game);
  expect(events.filter(e => e.name === 'game_opened')).toHaveLength(1);
  expect(events.filter(e => e.name === 'round_started')).toHaveLength(rounds);
  expect(events.filter(e => e.name === 'round_completed')).toHaveLength(rounds);
  expect(events.filter(e => e.name === 'science_reveal_viewed')).toHaveLength(1);
  expect(events.filter(e => e.name === 'game_completed')).toHaveLength(1);
  expect(events.some(e => e.name === 'challenge_share_clicked')).toBe(true);
  expect(events.some(e => e.name === 'steer_cta_clicked')).toBe(true);
  for (const event of events) expect(Object.keys(event).every(key => ['name', 'game', 'roundNumber'].includes(key))).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: /Play Again/ }));
}

describe('Predict the Twist', () => {
  it.each(scenarioIds)('plays the %s story through both unsupported predictions, science and replay', async id => {
    open(`/play/predict?scenario=${id}`);
    await screen.findByRole('heading', { name: 'Two people. One meal. What happens next?' });
    expect(screen.getByText(predictionScenarios[id].scene)).toBeInTheDocument();
    const firstChoices = within(screen.getByRole('group', { name: 'Make your prediction' })).getAllByRole('button');
    fireEvent.click(firstChoices[0]);
    for (const choice of firstChoices) expect(choice).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(gameScience.prediction.statement);
    expect(document.activeElement).toHaveClass('round-outcome');
    fireEvent.click(screen.getByRole('button', { name: /Turn the page/ }));
    expect(screen.getByText(predictionScenarios[id].followup)).toBeInTheDocument();
    const endings = within(screen.getByRole('group', { name: 'Choose a story ending' })).getAllByRole('button');
    expect(endings).toHaveLength(2);
    fireEvent.click(endings[0]);
    expect(screen.getByRole('status')).toHaveTextContent(gameScience.routine.statement);
    fireEvent.click(screen.getByRole('button', { name: /Discover the science/ }));
    await finish(gameScience.predict, 'predict', `/play/predict?scenario=${id}`, 2);
    expect(screen.getByRole('group', { name: 'Make your prediction' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('supports choosing another scenario and the original configured route alias', async () => {
    open('/play/predict-the-twist?scenario=bad');
    await screen.findByRole('heading', { name: /Two people/ });
    expect(screen.getByText(/That story isn’t available/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Story setting' }), { target: { value: 'college' } });
    expect(await screen.findByText(predictionScenarios.college.scene)).toBeInTheDocument();
    expect(screen.getByText('Nila, 22')).toBeInTheDocument();
  });
});

describe('Signal Rush', () => {
  it('plays all three rounds, offers memory review and resets the same seeded pattern', async () => {
    open('/play/signal-rush?seed=demo123');
    await screen.findByRole('heading', { name: /Can you match the signal/ });
    const rounds = generateSignalPatterns('demo123');
    for (let index = 0; index < 3; index++) {
      if (index === 1) {
        expect(screen.getByRole('img', { name: `Pattern: ${rounds[1].sequence!.join(', ')}` })).toBeInTheDocument();
        expect(screen.queryByRole('group', { name: 'Choose the matching symbol' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /I’ve got the pattern/ }));
        expect(screen.getByRole('img', { name: /Pattern hidden/ })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Show the pattern again/ }));
        fireEvent.click(screen.getByRole('button', { name: /I’ve got the pattern/ }));
      }
      const group = screen.getByRole('group', { name: 'Choose the matching symbol' });
      const buttons = within(group).getAllByRole('button');
      expect(buttons).toHaveLength(3);
      fireEvent.click(buttons[(rounds[index].options.indexOf(rounds[index].target) + 1) % 3]);
      expect(screen.getByRole('status')).toHaveTextContent('Here’s the match.');
      expect(screen.getByRole('status')).toHaveTextContent(rounds[index].target);
      for (const button of buttons) expect(button).toBeDisabled();
      fireEvent.click(screen.getByRole('button', { name: index === 2 ? /Follow the science/ : /Next signal/ }));
    }
    await finish(gameScience.signal, 'signal-rush', '/play/signal-rush?seed=demo123', 3);
    expect(screen.getByRole('heading', { name: /Can you match/ })).toBeInTheDocument();
    expect(screen.getByText(rounds[0].target, { selector: '.target-symbol>span:last-child' })).toBeInTheDocument();
  });
  it('creates a playable seed for missing and invalid input', async () => {
    open('/play/signal-rush?seed=invalid%20seed');
    await screen.findByRole('heading', { name: /Can you match/ });
    expect(screen.getByRole('group', { name: 'Choose the matching symbol' })).toBeInTheDocument();
  });
});

describe('The Case File', () => {
  it('opens and closes clues, requires three inspections, supports deduction and replays fresh', async () => {
    open('/play/case-file?case=office');
    await screen.findByRole('heading', { name: /Three clues/ });
    expect(screen.getByRole('button', { name: /Make a deduction/ })).toBeDisabled();
    for (const clue of officeCase.clues) {
      const button = screen.getByRole('button', { name: new RegExp(clue.title) });
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await waitFor(() => expect(screen.getByText(clue.detail)).toBeVisible());
    }
    fireEvent.click(screen.getByRole('button', { name: /Sleep schedule/ }));
    expect(screen.getByRole('button', { name: /Sleep schedule/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: /Make a deduction/ })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: /Make a deduction/ }));
    fireEvent.click(screen.getByRole('button', { name: /One clue proves/ }));
    expect(screen.getByRole('status')).toHaveTextContent(gameScience.deduction.statement);
    fireEvent.click(screen.getByRole('button', { name: /Look at the bigger picture/ }));
    await finish(gameScience.case, 'case-file', '/play/case-file?case=office', 2);
    expect(screen.getByRole('button', { name: /Make a deduction/ })).toBeDisabled();
    for (const clue of officeCase.clues) expect(screen.getByRole('button', { name: new RegExp(clue.title) })).toHaveAttribute('aria-expanded', 'false');
  });
  it('handles an unavailable case transparently', async () => {
    open('/play/case-file?case=unknown');
    expect(await screen.findByText(/That case isn’t available/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Three clues/ })).toBeInTheDocument();
  });
});

describe('new simulated Reel entries', () => {
  it.each(entertainmentAds)('links the $title Reel directly to its game', async ad => {
    open(ad.adRoute);
    expect(await screen.findByRole('heading', { name: ad.headline })).toBeInTheDocument();
    expect(screen.getByText('SIMULATION')).toBeInTheDocument();
    expect(screen.getByText(/Sponsored/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: new RegExp(ad.cta) })).toHaveAttribute('href', ad.playRoute);
  });
});
