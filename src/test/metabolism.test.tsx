import { StrictMode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { metabolismChapters, metabolismLessons as lessons } from '../data/metabolismLessons';
import { clearLocalEvents, getLocalEvents } from '../utils/events';

function open(path = '/learn/metabolism') { return render(<StrictMode><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></StrictMode>); }
beforeEach(clearLocalEvents);
afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
});

describe('Inside Your Metabolism Quick Play', () => {
  it('completes with wrong checks, corrects sequencing, explores signals, preserves the result across deeper learning and resets replay', async () => {
    open();
    expect(await screen.findByRole('heading', { name: 'What actually happens inside your body after a meal?' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Start/ })).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('group', { name: 'What happens after lunch?' })).getAllByRole('button')[2]);
    expect(screen.getByRole('status')).toHaveTextContent(lessons.opening.simpleExplanation);
    fireEvent.click(screen.getByRole('button', { name: 'Follow the food' }));
    const organs = within(screen.getByRole('group', { name: 'Follow the food' })).getAllByRole('button');
    expect(organs[1]).toBeDisabled();
    expect(organs[2]).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Connect the glucose story' })).toBeDisabled();
    for (let index = 0; index < 3; index++) {
      fireEvent.click(organs[index]);
      expect(screen.getByRole('status')).toHaveTextContent(lessons[(['mouth', 'stomach', 'intestine'] as const)[index]].simpleExplanation);
    }
    fireEvent.click(screen.getByRole('button', { name: 'Connect the glucose story' }));
    const cards = within(screen.getByRole('group', { name: 'Connect the glucose sequence' })).getAllByRole('button');
    fireEvent.click(cards[0]);
    expect(screen.getByRole('status')).toHaveTextContent('Try “Break down” next');
    expect(screen.getByRole('button', { name: 'Follow a different signal' })).toBeDisabled();
    fireEvent.click(cards[1]); fireEvent.click(cards[2]); fireEvent.click(cards[0]);
    for (const card of cards) expect(card).toBeDisabled();
    const ordered = within(screen.getByRole('group', { name: 'Connect the glucose sequence' })).getAllByRole('button');
    expect(ordered[0]).toHaveTextContent(lessons.sugars.simpleExplanation);
    expect(ordered[1]).toHaveTextContent(lessons.bloodstream.simpleExplanation);
    expect(ordered[2]).toHaveTextContent(lessons.insulin.simpleExplanation);
    fireEvent.click(screen.getByRole('button', { name: 'Follow a different signal' }));
    expect(screen.queryByRole('group', { name: 'Does one signal control all hunger?' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Explore the gut–brain signal' }));
    expect(screen.getByText(lessons.conversation.simpleExplanation)).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('group', { name: 'Does one signal control all hunger?' })).getAllByRole('button')[0]);
    expect(screen.getByRole('status')).toHaveTextContent(lessons.multiple.simpleExplanation);
    fireEvent.click(screen.getByRole('button', { name: 'Meet one of the messengers' }));
    expect(screen.getByRole('heading', { name: 'Meet GLP-1.' })).toBeInTheDocument();
    const targets = within(screen.getByRole('group', { name: 'Explore GLP-1 relationships' })).getAllByRole('button');
    fireEvent.click(targets[1]);
    expect(screen.getByRole('status')).toHaveTextContent('when blood glucose is elevated');
    fireEvent.click(screen.getByText(lessons.treatments.title));
    expect(screen.getByText(lessons.treatments.detailedExplanation!)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'See the bigger picture' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'Which statement best describes metabolic health?' })).getAllByRole('button')[0]);
    expect(screen.getByRole('status')).toHaveTextContent(lessons.check.simpleExplanation);
    fireEvent.click(screen.getByRole('button', { name: 'See your discovery' }));
    expect(screen.getByRole('heading', { name: 'Your body works as a team.' })).toBeInTheDocument();
    expect(screen.getByText(lessons.summary.simpleExplanation)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Take this discovery/ }));
    expect(screen.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('href', 'https://steerclub.com');
    fireEvent.click(screen.getByRole('link', { name: 'Explore Deeper' }));
    expect(await screen.findByRole('heading', { name: /A little more/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: 'Back to your discovery' }));
    expect(screen.getByRole('link', { name: /Explore Steer/ })).toBeInTheDocument();
    const events = getLocalEvents().filter(event => event.game === 'metabolism');
    for (const name of ['metabolism_opened', 'digestion_interaction_completed', 'glucose_sequence_completed', 'gut_brain_explored', 'glp1_explanation_viewed', 'knowledge_check_completed', 'metabolism_quickplay_completed', 'deeper_learning_opened']) expect(events.filter(event => event.name === name)).toHaveLength(1);
    for (const event of events) expect(Object.keys(event)).toEqual(['name', 'game']);
    fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
    expect(screen.getByRole('heading', { name: 'What actually happens inside your body after a meal?' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    for (const option of within(screen.getByRole('group', { name: 'What happens after lunch?' })).getAllByRole('button')) expect(option).toBeEnabled();
  });
  it('keeps the original configured path working', async () => { open('/play/inside-metabolism'); expect(await screen.findByRole('heading', { name: /What actually happens/ })).toBeInTheDocument(); });
});

describe('independent deeper learning', () => {
  it.each(metabolismChapters)('opens the $id chapter independently with interactive explanations, sources and navigation', async chapter => {
    open(`/learn/metabolism?view=deeper&chapter=${chapter.id}`);
    expect(await screen.findByRole('heading', { name: lessons[chapter.lesson].title, level: 1 })).toBeInTheDocument();
    const group = screen.getAllByRole('group')[0];
    const topics = within(group).getAllByRole('button');
    for (let index = 0; index < topics.length; index++) {
      fireEvent.click(topics[index]);
      expect(topics[index]).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('status')).toHaveTextContent(lessons[chapter.topics[index]].simpleExplanation);
    }
    fireEvent.click(screen.getByText('A little more detail'));
    expect(screen.getByText(lessons[chapter.lesson].detailedExplanation!)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sources & scientific notes'));
    expect(screen.getAllByRole('link').some(link => /\.nih\.gov|medlineplus.gov/.test(link.getAttribute('href') ?? ''))).toBe(true);
    expect(screen.getAllByText(/Pending clinical review/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'All chapters' })).toHaveAttribute('href', '/learn/metabolism?view=deeper');
    expect(screen.getByRole('link', { name: 'Return to the game library' })).toHaveAttribute('href', '/');
    expect(getLocalEvents().some(event => event.name === 'metabolism_quickplay_completed')).toBe(false);
  });
  it('handles invalid chapter parameters with a working chapter list', async () => {
    open('/learn/metabolism?view=deeper&chapter=unknown');
    expect(await screen.findByText(/That chapter isn’t available/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(7);
  });
});

describe('nonpersonal knowledge sharing', () => {
  it('shows a valid educational card URL when clipboard and native sharing are unavailable', async () => {
    open('/learn/metabolism?view=share');
    expect(await screen.findByRole('heading', { name: 'Your gut and brain communicate.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Share What You Learned' }));
    const field = await screen.findByRole('textbox', { name: 'Learning URL' });
    const url = new URL(field.getAttribute('value')!);
    expect(url.pathname + url.search).toBe('/learn/metabolism?view=share');
    expect([...url.searchParams.keys()]).toEqual(['view']);
    expect(getLocalEvents().some(event => event.name === 'knowledge_card_shared')).toBe(false);
  });
  it('shares only public knowledge and records accepted native sharing accurately', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    open('/learn/metabolism?view=share');
    fireEvent.click(await screen.findByRole('button', { name: 'Share What You Learned' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Thanks for sharing');
    expect(share).toHaveBeenCalledWith({ title: lessons.knowledge.title, text: lessons.knowledge.simpleExplanation, url: `${location.origin}/learn/metabolism?view=share` });
    expect(getLocalEvents().filter(event => event.name === 'knowledge_card_shared')).toHaveLength(1);
  });
  it('records copying as copying, not a completed native share', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    open('/learn/metabolism?view=share');
    fireEvent.click(await screen.findByRole('button', { name: 'Share What You Learned' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Ready to paste');
    expect(getLocalEvents().filter(event => event.name === 'knowledge_card_copied')).toHaveLength(1);
    expect(getLocalEvents().some(event => event.name === 'knowledge_card_shared')).toBe(false);
  });
});
