import { describe, expect, it } from 'vitest';
import { campaignProfiles, creativeIds, primaryCreatives, resolveCreative, isProfile, isCreative, campaignPath, buildFeed, getProfile } from '../data/campaigns';
import { createQuizSession } from '../utils/quizEngine';
import { gameConfigs } from '../data/gameConfigs';

describe('campaign configuration and public routes',()=>{
  it('covers all seven profiles and seven enabled games with distinct primary hooks',()=>{
    expect(campaignProfiles).toHaveLength(7);expect(creativeIds).toHaveLength(7);
    expect(new Set(Object.values(primaryCreatives).map(creative=>creative.headline)).size).toBe(7);
    for(const profile of campaignProfiles){
      expect(isProfile(profile.id)).toBe(true);expect(profile.creatives.length).toBeGreaterThanOrEqual(2);
      const feed=buildFeed(profile.id);expect(feed.map(item=>item.kind)).toEqual(['organic','organic','sponsored','organic','sponsored']);
      for(const id of profile.creatives){expect(isCreative(id)).toBe(true);const creative=resolveCreative(id,profile.id);expect(gameConfigs.find(game=>game.id===creative.gameId)?.available).toBe(true);expect(creative.gameRoute).toMatch(/^\/(play|learn)\//);expect(creative.educationalTopic).toBeTruthy();}
    }
    expect(getProfile('unknown').id).toBe('food');expect(isProfile('health-history')).toBe(false);expect(isCreative('unknown')).toBe(false);
  });
  it('reuses the quiz engine with matching interests and reproducible public seeds',()=>{
    for(const profile of ['food','gaming','entertainment','lifestyle','science'] as const){const creative=resolveCreative('quiz',profile,{seed:'same123'});const url=new URL(creative.gameRoute,'https://example.test');expect(url.searchParams.get('interest')).toBe(profile);expect(url.searchParams.get('seed')).toBe('same123');expect(createQuizSession(profile,creative.seed).questions).toEqual(createQuizSession(profile,'same123').questions);expect([...url.searchParams.keys()]).toEqual(['interest','seed']);}
    expect(resolveCreative('quiz','puzzles').quizInterest).toBe('gaming');expect(resolveCreative('quiz','metabolic-health').quizInterest).toBe('science');
  });
  it('preserves valid public variations and replaces invalid parameters',()=>{
    expect(resolveCreative('predict','lifestyle').gameRoute).toBe('/play/predict?scenario=weekend');
    expect(resolveCreative('predict','food',{scenario:'college'}).gameRoute).toContain('scenario=college');
    expect(resolveCreative('predict','food',{scenario:'unknown'}).gameRoute).toContain('scenario=office');
    expect(resolveCreative('signal-rush','gaming',{seed:'bad seed'}).gameRoute).toContain('seed=reel-demo');
    const creative=resolveCreative('quiz','food',{seed:'valid123'});expect(campaignPath(creative)).toBe('/c/quiz?profile=food&seed=valid123');
    expect(buildFeed('puzzles','case-file')[2]).toEqual({kind:'sponsored',creative:'case-file'});
    expect(buildFeed('food','glp1')[2]).toEqual({kind:'sponsored',creative:'quiz'});
  });
});
