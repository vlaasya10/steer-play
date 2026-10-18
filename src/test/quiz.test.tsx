import { StrictMode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Link, MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { interestConfigs, getInterestConfig } from '../data/interestConfigs';
import { createQuizSession, getQuizPath } from '../utils/quizEngine';
import { clearLocalEvents, getLocalEvents } from '../utils/events';
import ShareChallenge from '../components/ShareChallenge';

function open(path: string) { return render(<StrictMode><MemoryRouter initialEntries={[path]}><App /><Link to="/play/quiz?interest=science&seed=other">Switch variant</Link></MemoryRouter></StrictMode>); }
beforeEach(clearLocalEvents);
afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
});

describe.each(interestConfigs)('$label complete quiz', ({ id, hook }) => {
  it('starts immediately, identifies answers, teaches science and supports sharing and replay', async () => {
    const session = createQuizSession(id, 'demo123');
    open(getQuizPath(id, 'demo123'));
    expect(await screen.findByText(hook)).toBeInTheDocument();
    const first = session.questions[0].prompt;
    for (let i = 0; i < 5; i++) {
      const question = session.questions[i];
      expect(screen.getByRole('heading', { name: question.prompt })).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i));
      const group = screen.getByRole('group', { name: question.prompt });
      const choices = within(group).getAllByRole('button');
      expect(choices).toHaveLength(3);
      const selection = i % 2 ? question.correctIndex : (question.correctIndex + 1) % 3;
      fireEvent.click(choices[selection]);
      for (const button of choices) expect(button).toBeDisabled();
      expect(choices[question.correctIndex]).toHaveTextContent('Correct answer');
      expect(screen.getByRole('status')).toHaveTextContent(question.explanation);
      expect(document.activeElement).toHaveClass('quiz-feedback');
      if (i >= 3) expect(screen.getByRole('status')).toHaveTextContent('Pending clinical review');
      fireEvent.click(screen.getByRole('button', { name: i === 4 ? /See what you discovered/ : /Next Question/ }));
    }
    expect(screen.getByRole('heading', { name: 'Here’s something worth knowing.' })).toBeInTheDocument();
    expect(screen.getByText(/GLP-1 is a hormone released/)).toBeInTheDocument();
    expect(screen.getByText(/do not assess your health/)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /Explore Steer/ });
    expect(cta).toHaveAttribute('href', 'https://steerclub.com');
    expect(cta).toHaveAttribute('target', '_blank');
    fireEvent.click(cta);
    fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
    const sharedUrl = new URL((await screen.findByRole('textbox', { name: /Challenge URL/ })).getAttribute('value')!);
    expect(sharedUrl.pathname + sharedUrl.search).toBe(getQuizPath(id, 'demo123'));
    expect([...sharedUrl.searchParams.keys()]).toEqual(['interest', 'seed']);
    expect(getLocalEvents().filter(e => e.name === 'quiz_opened')).toHaveLength(1);
    expect(getLocalEvents().filter(e => e.name === 'question_answered')).toHaveLength(5);
    expect(getLocalEvents().filter(e => e.name === 'quiz_completed')).toHaveLength(1);
    expect(getLocalEvents().filter(e => e.name === 'science_reveal_viewed')).toHaveLength(1);
    expect(getLocalEvents().some(e => e.name === 'challenge_share_clicked')).toBe(true);
    expect(getLocalEvents().some(e => e.name === 'steer_cta_clicked')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Play Again/ }));
    expect(screen.getByRole('heading', { name: first })).toBeInTheDocument();
    const replayChoices = within(screen.getByRole('group', { name: first })).getAllByRole('button');
    expect(replayChoices.every(choice => !choice.hasAttribute('disabled'))).toBe(true);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Switch variant' }));
    expect(await screen.findByText(getInterestConfig('science').hook)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: createQuizSession('science', 'other').questions[0].prompt })).toBeInTheDocument();
  });
});

describe('interest entry, demo and advertisements', () => {
  it.each(['/play/quiz', '/play/quiz?interest=invalid', '/play/quiz?interest=%3Cscript%3E'])('offers a simple selector at %s', async path => {
    open(path);
    expect(await screen.findByRole('heading', { name: /What makes you/ })).toBeInTheDocument();
    for (const interest of interestConfigs) expect(screen.getByRole('link', { name: interest.label })).toHaveAttribute('href', `/play/quiz?interest=${interest.id}`);
    expect(screen.queryByRole('button', { name: /Start/ })).not.toBeInTheDocument();
  });
  it('creates a seed when missing or invalid, with no start step', async () => {
    open('/play/quiz?interest=food&seed=not%20valid');
    expect(await screen.findByText(getInterestConfig('food').hook)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.queryByRole('button', { name: /Start/ })).not.toBeInTheDocument();
  });
  it('updates all demo variants, preview questions and both destination routes', async () => {
    open('/demo');
    await screen.findByRole('heading', { name: /Five interests/ });
    const audience = within(screen.getByRole('region', { name: 'Five interests. One shared discovery.' }));
    for (const interest of interestConfigs) {
      fireEvent.click(screen.getByRole('button', { name: interest.shortLabel }));
      expect(screen.getByRole('button', { name: interest.shortLabel })).toHaveAttribute('aria-pressed', 'true');
      expect(audience.getByRole('heading', { name: interest.adHeadline })).toBeInTheDocument();
      expect(audience.getByRole('heading', { name: createQuizSession(interest.id, 'demo123').questions[0].prompt })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Play this quiz/ })).toHaveAttribute('href', getQuizPath(interest.id, 'demo123'));
      expect(screen.getByRole('link', { name: /Preview this Reel/ })).toHaveAttribute('href', `/ad/quiz?interest=${interest.id}&seed=demo123`);
    }
    expect(screen.getByText(/Qualified clinical review is pending/)).toBeInTheDocument();
  });
  it.each(interestConfigs)('renders the $label Reel with a matching first question and direct CTA', async ({ id, adHeadline }) => {
    open(`/ad/quiz?interest=${id}&seed=demo123`);
    expect(await screen.findByRole('heading', { name: adHeadline })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: createQuizSession(id, 'demo123').questions[0].prompt })).toBeInTheDocument();
    expect(screen.getByText('SIMULATION')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Play the challenge/ })).toHaveAttribute('href', getQuizPath(id, 'demo123'));
  });
});

describe('accurate share feedback', () => {
  it('reports cancellation without claiming success or copying', async () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'share', { configurable: true, value: vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError')) });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ShareChallenge path={getQuizPath('food', 'demo123')} />);
    fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Sharing cancelled');
    expect(writeText).not.toHaveBeenCalled();
  });
  it('falls back to clipboard after native sharing fails', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: vi.fn().mockRejectedValue(new Error('Unsupported')) });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ShareChallenge path={getQuizPath('gaming', 'demo123')} />);
    fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Ready to paste');
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('interest=gaming&seed=demo123'));
  });
});
