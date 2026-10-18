import { StrictMode } from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { glp1Questions, glp1Path } from '../data/glp1Questions';
import { clearLocalEvents, getLocalEvents } from '../utils/events';

function open(path = '/learn/glp1') { return render(<StrictMode><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></StrictMode>); }
beforeEach(clearLocalEvents);
afterEach(() => { vi.restoreAllMocks(); for (const key of ['share','clipboard']) Object.defineProperty(navigator,key,{ configurable: true, value: undefined }); });
describe('GLP-1 educational journeys', () => {
  it.each(glp1Questions)('completes $slug with useful wrong-answer feedback, source notes and replay', async topic => {
    open(glp1Path(topic.slug));
    expect(await screen.findByRole('heading', { name: topic.question })).toBeInTheDocument();
    const answers = within(screen.getByRole('group', { name: 'Choose an answer' })).getAllByRole('button');
    fireEvent.click(answers[1-topic.correctIndex]);
    expect(screen.getByRole('status')).toHaveTextContent(topic.shortExplanation);
    expect(answers[0]).toBeDisabled(); expect(answers[1]).toBeDisabled();
    expect(document.activeElement).toHaveClass('glp-feedback');
    fireEvent.click(screen.getByRole('button',{ name: 'Explore the explanation' }));
    expect(screen.getByRole('button',{ name: /Take this idea/ })).toBeDisabled();
    for (const node of topic.nodes) fireEvent.click(topic.visual === 'safety' ? screen.getByText(node.label,{ exact: true }) : screen.getByRole('button',{ name: new RegExp(node.label) }));
    await waitFor(() => expect(screen.getByRole('button',{ name: /Take this idea/ })).toBeEnabled());
    expect(screen.getByText(topic.keyTakeaway)).toBeInTheDocument();
    fireEvent.click(screen.getByText('A little more detail'));
    expect(screen.getByText(topic.detailedExplanation)).toBeInTheDocument();
    fireEvent.click(screen.getByText('View sources and scientific notes'));
    for (const source of topic.sourceNotes) await waitFor(() => expect(screen.getByText(source.supports)).toBeVisible());
    await waitFor(() => expect(getLocalEvents().some(event => event.name === 'source_viewed')).toBe(true));
    fireEvent.click(screen.getByRole('button',{ name: /Take this idea/ }));
    expect(screen.getByRole('heading',{ name: 'One question clearer.' })).toBeInTheDocument();
    expect(screen.getByRole('link',{ name: /Explore Steer/ })).toHaveAttribute('href','https://steerclub.com');
    const events = getLocalEvents().filter(event => event.game === 'glp1');
    for (const name of ['glp1_explained_opened','topic_selected','myth_answered','educational_reveal_viewed','topic_completed']) expect(events.filter(event => event.name === name)).toHaveLength(1);
    for (const event of events) expect(Object.keys(event)).toEqual(['name','game']);
    fireEvent.click(screen.getByRole('link',{ name: 'Share What You Learned' }));
    expect(screen.getByRole('heading',{ name: topic.shareTitle })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link',{ name: 'Back to your question' }));
    expect(screen.getByRole('heading',{ name: 'One question clearer.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{ name: 'Play Again' }));
    expect(screen.getByRole('group',{ name: 'Choose an answer' })).toBeEnabled();
    fireEvent.click(within(screen.getByRole('group',{ name: 'Choose an answer' })).getAllByRole('button')[topic.correctIndex]);
    expect(screen.getByRole('status')).toHaveTextContent(topic.answerLabel);
    fireEvent.click(screen.getByRole('button',{ name: 'Explore the explanation' }));
    expect(screen.getByRole('button',{ name: /Take this idea/ })).toBeDisabled();
  });
  it.each(glp1Questions)('opens $slug independently in the library and shares a nonpersonal explanation', async topic => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator,'share',{ configurable: true, value: share });
    open(glp1Path(topic.slug,'library'));
    expect(await screen.findByRole('heading',{ name: topic.title, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(topic.shortExplanation)).toBeInTheDocument();
    expect(screen.queryByRole('group',{ name: 'Choose an answer' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link',{ name: 'Share What You Learned' }));
    fireEvent.click(screen.getByRole('button',{ name: 'Share What You Learned' }));
    await waitFor(() => expect(share).toHaveBeenCalledWith({ title: `Steer Play · ${topic.shareTitle}`, text: topic.shareText, url: new URL(glp1Path(topic.slug,'library'),location.origin).href }));
    await waitFor(() => expect(getLocalEvents().filter(event => event.name === 'knowledge_card_shared')).toHaveLength(1));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  it('shows all six cards immediately and recovers invalid links without a health assessment', async () => {
    open('/learn/glp1?topic=unknown&view=wrong');
    expect(await screen.findByRole('heading',{ name: /Without the confusion/ })).toBeInTheDocument();
    expect(screen.getByText(/That topic or section/)).toBeInTheDocument();
    for (const topic of glp1Questions) expect(screen.getByRole('link',{ name: new RegExp(topic.title) })).toHaveAttribute('href',glp1Path(topic.slug));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('link',{ name: 'Explore All Questions' }));
    expect(screen.getByRole('heading',{ name: 'Explore All Questions' })).toBeInTheDocument();
  });
  it('copies only a canonical educational link and does not count copying as native sharing', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator,'clipboard',{ configurable: true, value: { writeText } });
    open('/learn/glp1?view=share&topic=safety&answer=0&history=ignored');
    fireEvent.click(await screen.findByRole('button',{ name: 'Share What You Learned' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(new URL('/learn/glp1?view=library&topic=safety',location.origin).href));
    expect(getLocalEvents().filter(event => event.name === 'knowledge_card_shared')).toHaveLength(0);
    expect(getLocalEvents().filter(event => event.name === 'knowledge_card_copied')).toHaveLength(1);
  });
  it('opens the health-interest demonstration and direct learning Reel', async () => {
    open('/demo');
    fireEvent.click(await screen.findByRole('button',{ name: /Health interest/ }));
    fireEvent.click(screen.getByRole('button',{ name: /^Fact$/ }));
    expect(screen.getByRole('status')).toHaveTextContent(glp1Questions[0].shortExplanation);
    expect(screen.getByRole('link',{ name: 'Preview this Reel' })).toHaveAttribute('href','/ad/glp1');
    fireEvent.click(screen.getByRole('link',{ name: 'Preview this Reel' }));
    expect(await screen.findByText('SIMULATION',{ exact: true })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link',{ name: 'Explore the science' }));
    expect(await screen.findByRole('heading',{ name: 'GLP-1: Myth or Fact?' })).toBeInTheDocument();
  });
  it('keeps a cancelled native share private and does not record success or copying', async () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator,'share',{ configurable:true, value:vi.fn().mockRejectedValue(new DOMException('Cancelled','AbortError')) });
    Object.defineProperty(navigator,'clipboard',{ configurable:true, value:{ writeText } });
    open('/learn/glp1?view=share&topic=assessment');
    fireEvent.click(await screen.findByRole('button',{ name:'Share What You Learned' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Sharing cancelled. Your explanation is still here.');
    expect(writeText).not.toHaveBeenCalled();
    expect(getLocalEvents().some(event => event.name === 'knowledge_card_shared' || event.name === 'knowledge_card_copied')).toBe(false);
  });
  it('falls back to a selectable educational URL after native sharing fails', async () => {
    Object.defineProperty(navigator,'share',{ configurable:true, value:vi.fn().mockRejectedValue(new Error('Not supported')) });
    open('/learn/glp1?view=share&topic=stopping&score=10');
    fireEvent.click(await screen.findByRole('button',{ name:'Share What You Learned' }));
    expect(await screen.findByRole('textbox',{ name:'Learning URL' })).toHaveValue(new URL(glp1Path('stopping','library'),location.origin).href);
    expect(getLocalEvents().some(event => event.name === 'knowledge_card_shared')).toBe(false);
  });
});
