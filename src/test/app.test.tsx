import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, afterEach } from 'vitest';
import App from '../App';
import ShareChallenge, { getChallengeUrl } from '../components/ShareChallenge';

function open(path: string) { return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }
async function guess(answer = 'Chutney bowl') {
  open('/play/missing-clue');
  fireEvent.click(await screen.findByRole('button', { name: /I’m ready/ }));
  fireEvent.click(screen.getByRole('button', { name: new RegExp(answer) }));
}
afterEach(() => { vi.restoreAllMocks(); Object.defineProperty(navigator, 'share', { configurable: true, value: undefined }); Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });

describe('Phase 1 routes and availability', () => {
  it('renders all seven completed games with playable links', () => {
    open('/');
    expect(screen.getByRole('heading', { name: /A little curiosity/ })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
    for (const article of screen.getAllByRole('article')) expect(within(article).getByRole('link')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  it('explains the simulated targeting in judge mode', async () => {
    open('/demo');
    expect(await screen.findByRole('heading', { name: /Attention is earned/ })).toBeInTheDocument();
    expect(screen.getByText(/We do not access Instagram/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Experience the journey/ })).toHaveAttribute('href', '/ad/puzzle');
  });
  it('links the simulated Reel directly to the game', async () => {
    open('/ad/puzzle');
    expect(await screen.findByRole('heading', { name: /Can you spot/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Play the challenge/ })).toHaveAttribute('href', '/play/missing-clue');
    expect(screen.getByText('SIMULATION')).toBeInTheDocument();
  });
  it('keeps the original GLP-1 route working', async () => { open('/play/glp1-explained'); expect(await screen.findByRole('heading', { name: /Without the confusion/ })).toBeInTheDocument(); });
  it('provides a recovery link on unknown routes', () => { open('/not-a-page'); expect(screen.getByRole('heading', { name: 'This page wandered off.' })).toBeInTheDocument(); expect(within(screen.getByRole('main')).getByRole('link', { name: /Back to discovery/ })).toHaveAttribute('href', '/'); });
});

describe('Missing Clue journey', () => {
  it('completes the correct path, reveals science and replays from the original table', async () => {
    await guess();
    expect(screen.getByRole('status')).toHaveTextContent('You noticed the little things.');
    fireEvent.click(screen.getByRole('button', { name: /There’s more to this/ }));
    expect(screen.getByRole('heading', { name: /Some of the most important signals/ })).toBeInTheDocument();
    expect(screen.getByText(/does not measure or diagnose/)).toBeInTheDocument();
    expect(screen.getByText(/Pending clinical review/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read the science/ })).toHaveAttribute('href', expect.stringContaining('niddk.nih.gov'));
    expect(document.activeElement).toHaveClass('game-panel');
    fireEvent.click(screen.getByRole('button', { name: /Take this discovery/ }));
    expect(screen.getByRole('heading', { name: /Curiosity looks/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('href', 'https://steerclub.com');
    expect(screen.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('button', { name: /Challenge a Friend/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore More Games/ })).toHaveAttribute('href', '/');
    fireEvent.click(screen.getByRole('button', { name: /Play Again/ }));
    expect(screen.getByRole('heading', { name: 'Take a good look.' })).toBeInTheDocument();
    expect(screen.getByText(/On the table:/)).toHaveTextContent('chutney bowl');
    expect(screen.queryByRole('button', { name: /Chutney bowl/ })).not.toBeInTheDocument();
  });
  it('provides useful incorrect feedback and still allows the reveal', async () => {
    await guess('Chai cup');
    expect(screen.getByRole('status')).toHaveTextContent('Easy to miss');
    expect(screen.getByRole('status')).toHaveTextContent('The chutney bowl disappeared');
    fireEvent.click(screen.getByRole('button', { name: /There’s more/ }));
    expect(screen.getByRole('heading', { name: /Some of the most important signals/ })).toBeInTheDocument();
  });
  it('allows another look without losing the game', async () => {
    open('/play/missing-clue');
    fireEvent.click(await screen.findByRole('button', { name: /I’m ready/ }));
    fireEvent.click(screen.getByRole('button', { name: /Need another look/ }));
    expect(screen.getByRole('heading', { name: 'Take a good look.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /I’m ready/ }));
    expect(screen.getAllByRole('button').filter(b => /^(A|B|C|D)/.test(b.textContent || ''))).toHaveLength(4);
  });
});

describe('optional sharing', () => {
  it('creates a same-origin challenge URL and copies it as a fallback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ShareChallenge />);
    fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Ready to paste');
    expect(writeText).toHaveBeenCalledWith(getChallengeUrl());
    expect(new URL(getChallengeUrl()).pathname).toBe('/play/missing-clue');
  });
  it('shows a selectable URL if clipboard access is unavailable', async () => {
    render(<ShareChallenge />); fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
    expect(await screen.findByRole('textbox', { name: /Challenge URL/ })).toHaveValue(getChallengeUrl());
  });
  it('supports native sharing', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    render(<ShareChallenge />); fireEvent.click(screen.getByRole('button', { name: /Challenge a Friend/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Thanks for sharing');
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: getChallengeUrl() }));
  });
});
