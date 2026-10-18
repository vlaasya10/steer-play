import { StrictMode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import App from '../App';
import { campaignProfiles, creativeIds, primaryCreatives, resolveCreative, campaignPath } from '../data/campaigns';
import { getLocalEvents, clearLocalEvents } from '../utils/events';

function open(path:string){return render(<StrictMode><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></StrictMode>);}
beforeEach(clearLocalEvents);
afterEach(()=>{vi.restoreAllMocks();Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});});
describe('campaign entries and judge tools',()=>{
  it.each(campaignProfiles)('launches the $id primary campaign directly into the existing game',async profile=>{
    const creative=resolveCreative(profile.creatives[0],profile.id);open(campaignPath(creative));
    const heading=creative.id==='quiz'?/Indian|food|Which|What|How|Who/:creative.id==='signal-rush'?/match the signal/:creative.id==='predict'?/Two people/:creative.id==='missing-clue'?/Take a good look/:creative.id==='metabolism'?/What actually happens/:/Without the confusion/;
    expect(await screen.findByRole('heading',{name:heading,level:1})).toBeInTheDocument();
    expect(screen.queryByText('Simulated Reels experience — not Instagram.')).not.toBeInTheDocument();
    expect(getLocalEvents().filter(event=>event.name==='game_launched_from_ad')).toHaveLength(1);
  });
  it('recovers an invalid campaign safely',async()=>{open('/c/not-a-creative?profile=unknown');expect(await screen.findByRole('heading',{name:/That challenge isn’t available/})).toBeInTheDocument();expect(screen.getByRole('link',{name:/Explore the game library/})).toHaveAttribute('href','/');});
  it('switches seven explicit profiles and keeps the studio creative and destination in sync',async()=>{
    open('/demo');const select=await screen.findByRole('combobox',{name:'Campaign audience'});
    for(const profile of campaignProfiles){fireEvent.change(select,{target:{value:profile.id}});const creative=resolveCreative(profile.creatives[0],profile.id);expect(screen.getByRole('link',{name:'Open consumer campaign link'})).toHaveAttribute('href',campaignPath(creative));expect(screen.getByRole('link',{name:'Enter the Reels simulator'})).toHaveAttribute('href',expect.stringContaining(`profile=${profile.id}`));}
    for(const event of getLocalEvents().filter(event=>event.game==='simulator'))expect(Object.keys(event)).toEqual(['name','game']);
    expect(screen.getByRole('region',{name:'The six steps of Steer Play'})).toBeInTheDocument();
  });
  it('creates a real public variation and offers an isolated friend entry even if copying fails',async()=>{
    open('/demo');await screen.findByRole('heading',{name:'A little curiosity travels.'});
    const section=screen.getByRole('region',{name:'A little curiosity travels.'});
    expect(within(section).queryByRole('link',{name:'Open as friend'})).not.toBeInTheDocument();
    fireEvent.change(within(section).getByRole('combobox',{name:'Challenge audience'}),{target:{value:'lifestyle'}});
    fireEvent.change(within(section).getByRole('combobox',{name:'Challenge game'}),{target:{value:'predict'}});
    fireEvent.click(within(section).getByRole('button',{name:'Create challenge link'}));
    expect(await within(section).findByRole('textbox',{name:'Public friend link'})).toHaveValue(new URL('/play/predict?scenario=weekend',location.origin).href);
    expect(within(section).getByRole('link',{name:'Open as friend'})).toHaveAttribute('target','_blank');
    expect(within(section).getByRole('link',{name:'Open as friend'})).toHaveAttribute('rel','noopener noreferrer');
    expect(await within(section).findByRole('textbox',{name:'Challenge URL'})).toHaveValue(new URL('/play/predict?scenario=weekend',location.origin).href);
    expect(getLocalEvents().filter(event=>event.name==='challenge_link_created')).toHaveLength(1);
    fireEvent.change(within(section).getByRole('combobox',{name:'Challenge game'}),{target:{value:'quiz'}});
    expect(within(section).queryByRole('link',{name:'Open as friend'})).not.toBeInTheDocument();
  });
  it('uses existing same-origin game routes in the standalone preview',async()=>{
    open('/demo/playable?profile=gaming&creative=signal-rush');
    const select=await screen.findByRole('combobox',{name:'Preview game'});
    for(const id of creativeIds){fireEvent.change(select,{target:{value:id}});expect(screen.getByTitle(`${primaryCreatives[id].title} — working playable preview`)).toHaveAttribute('src',resolveCreative(id,'gaming').gameRoute);}
    expect(screen.getByText(/does not establish eligibility/)).toBeInTheDocument();
  });
  it('labels the fictional feed and resets its content when the audience changes',async()=>{
    open('/demo/reels?profile=food');
    expect(await screen.findByText('Simulated Reels experience — not Instagram.')).toBeInTheDocument();
    const feed=screen.getByRole('region',{name:'Simulated Reels feed'});
    Object.defineProperty(feed,'clientHeight',{configurable:true,value:600});Object.defineProperty(feed,'scrollTop',{configurable:true,value:1200,writable:true});
    fireEvent.scroll(feed);
    await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('3 / 5'));
    expect(screen.getByRole('link',{name:'Take the challenge'})).toHaveAttribute('href','/c/quiz?profile=food&seed=reel-demo');
    fireEvent.change(screen.getByRole('combobox',{name:'Feed audience'}),{target:{value:'metabolic-health'}});
    expect(screen.getByRole('status')).toHaveTextContent('1 / 5');
    expect(getLocalEvents().filter(event=>event.name==='reel_simulator_opened')).toHaveLength(1);
  });
});
