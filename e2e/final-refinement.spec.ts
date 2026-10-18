import { test, expect, type Page } from '@playwright/test';
import { campaignPath, resolveCreative, type CreativeId, type InterestProfile } from '../src/data/campaigns';

test.use({isMobile:true,hasTouch:true,actionTimeout:15000,trace:'retain-on-failure'});
const profiles:Record<CreativeId,InterestProfile>={quiz:'food','missing-clue':'puzzles',predict:'lifestyle','signal-rush':'gaming','case-file':'puzzles',metabolism:'science',glp1:'metabolic-health'};
async function tap(page:Page,name:string|RegExp){await page.getByRole('button',{name,exact:typeof name==='string'}).tap();}
async function checkLayout(page:Page){
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const small=await page.locator('button,a,select,summary').evaluateAll(elements=>elements.filter(e=>{const r=e.getBoundingClientRect();const closed=e.closest('details:not([open])');return r.width>0&&r.height>0&&(!closed||!!e.closest('summary'))&&!e.closest('[inert]')&&!e.classList.contains('skip-link')&&getComputedStyle(e).visibility!=='hidden'&&(r.width<43||r.height<43);}).map(e=>e.textContent?.trim().slice(0,50)));
  expect(small).toEqual([]);
}
async function finish(page:Page,id:CreativeId){
  if(id==='quiz'){
    for(let i=0;i<5;i++){await page.locator('.quiz-answers button').first().tap();await expect(page.getByRole('status')).toBeVisible();await tap(page,i===4?/See what you discovered/:/Next Question/);}
  }else if(id==='missing-clue'){
    await tap(page,'I’m ready');await tap(page,/Chutney bowl/);await tap(page,/There’s more to this/);await expect(page.locator('#science-title')).toBeVisible();await tap(page,/Take this discovery/);
  }else if(id==='predict'){
    await page.locator('.prediction-cards button').first().tap();await expect(page.getByRole('status')).toBeVisible();await tap(page,'Turn the page');await page.locator('.story-endings button').first().tap();await tap(page,'Discover the science');await expect(page.locator('#science-title')).toBeVisible();await tap(page,/Take this discovery/);
  }else if(id==='signal-rush'){
    for(let i=0;i<3;i++){if(i===1)await tap(page,'I’ve got the pattern');await page.locator('.symbol-choices button').first().tap();await expect(page.getByRole('status')).toBeVisible();await tap(page,i===2?'Follow the science':'Next signal');}
    await expect(page.locator('#science-title')).toBeVisible();await tap(page,/Take this discovery/);
  }else if(id==='case-file'){
    for(const name of ['Sleep schedule','Meal routine','Work schedule'])await tap(page,new RegExp(name));await tap(page,'Make a deduction');await page.locator('.deduction-options button').first().tap();await tap(page,'Look at the bigger picture');await expect(page.locator('#science-title')).toBeVisible();await tap(page,/Take this discovery/);
  }else if(id==='metabolism'){
    await page.getByRole('group',{name:'What happens after lunch?'}).getByRole('button').first().tap();await tap(page,'Follow the food');
    for(let i=0;i<3;i++)await page.getByRole('group',{name:'Follow the food'}).getByRole('button').nth(i).tap();
    await tap(page,'Connect the glucose story');for(const name of [/Digestible carbohydrates/,/Glucose is absorbed/,/Insulin helps regulate/])await page.getByRole('group',{name:'Connect the glucose sequence'}).getByRole('button',{name}).tap();
    await tap(page,'Follow a different signal');await tap(page,'Explore the gut–brain signal');await page.getByRole('group',{name:'Does one signal control all hunger?'}).getByRole('button').last().tap();await tap(page,'Meet one of the messengers');await page.getByRole('group',{name:'Explore GLP-1 relationships'}).getByRole('button').nth(1).tap();await tap(page,'See the bigger picture');await page.getByRole('group',{name:'Which statement best describes metabolic health?'}).getByRole('button').nth(1).tap();await tap(page,'See your discovery');await expect(page.locator('#science-title')).toBeVisible();await tap(page,/Take this discovery/);
  }else{
    await page.getByRole('link',{name:/How GLP-1 works/}).tap();await tap(page,'Fact');await expect(page.getByRole('status')).toContainText('chemical messenger');await tap(page,'Explore the explanation');await page.getByRole('group',{name:'Explore the illustration'}).getByRole('button').first().tap();await tap(page,'Take this idea with you');
  }
}
for(const width of [320,360,375,390,414,430])test(`all seven ad-to-completion touch flows, replay and fresh shares at ${width}px`,async({page,browser})=>{
  test.setTimeout(180000);await page.setViewportSize({width,height:844});
  await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const id of Object.keys(profiles) as CreativeId[]){
    const creative=resolveCreative(id,profiles[id]);await page.goto(`/demo/reels?profile=${profiles[id]}&creative=${id}&reel=2`);await checkLayout(page);
    const ad=page.locator('.feed-frame[data-active=true] .campaign-creative');expect(await ad.evaluate(e=>e.scrollHeight<=e.clientHeight+1)).toBe(true);expect(await ad.locator('.campaign-art').evaluate(e=>e.clientHeight>40&&e.scrollHeight<=e.clientHeight+1)).toBe(true);
    await page.getByRole('link',{name:creative.cta,exact:true}).tap();await expect(page.getByRole('link',{name:/Return to (guided )?demo/})).toBeVisible();await checkLayout(page);await finish(page,id);
    await expect(page.locator('.completion')).toBeVisible();await expect(page.getByRole('link',{name:/Explore Steer/})).toHaveAttribute('href','https://steerclub.com');await expect(page.locator('.completion')).toContainText('Pending clinical review');await checkLayout(page);
    if(id==='metabolism'||id==='glp1')await page.getByRole('link',{name:'Share What You Learned',exact:true}).tap();
    await tap(page,id==='metabolism'||id==='glp1'?'Share What You Learned':'Challenge a Friend');
    const shared=await page.getByRole('textbox',{name:id==='metabolism'||id==='glp1'?'Learning URL':'Challenge URL'}).inputValue();const url=new URL(shared);expect([...url.searchParams.keys()].every(k=>['interest','seed','scenario','case','topic','view'].includes(k))).toBe(true);await checkLayout(page);
    const fresh=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});const friend=await fresh.newPage();await friend.goto(shared,{waitUntil:'domcontentloaded'});await expect(friend.locator('h1')).toBeVisible();await expect(friend.getByRole('link',{name:/Return to (guided )?demo/})).toHaveCount(0);await checkLayout(friend);await fresh.close();
    if(id==='metabolism')await page.getByRole('link',{name:'Back to your discovery'}).tap();else if(id==='glp1'){await page.getByRole('link',{name:'Back to your question'}).tap();}
    await tap(page,'Play Again');await expect(page.locator('.completion')).toHaveCount(0);await checkLayout(page);
    await page.getByRole('link',{name:/Return to (guided )?demo/}).tap();await expect(page.getByRole('status')).toContainText('3 / 5');
  }expect(errors).toEqual([]);
});

test('guided demo, selectable alternatives, URL recovery and restored browser navigation',async({page})=>{
  test.setTimeout(90000);await page.setViewportSize({width:375,height:844});await page.goto('/demo');await page.getByRole('link',{name:'Start Guided Demo'}).tap();await expect(page.locator('#guided-heading')).toBeFocused();await tap(page,'Next step');await page.getByRole('combobox',{name:'Guided audience'}).selectOption('gaming');await expect(page.locator('.guided-creative')).toContainText('Can you match the pattern?');await tap(page,'Next step');await page.getByRole('link',{name:'Play the real challenge'}).tap();await expect(page).toHaveURL(/signal-rush/);await page.getByRole('link',{name:/Return to (guided )?demo/}).tap();await expect(page.locator('#guided-heading')).toHaveText('Pass on the curiosity.');await expect(page).toHaveURL(/audience=gaming/);
  await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});});
  await page.goto('/demo?guided=1&step=2&audience=gaming');await page.getByRole('link',{name:'Open its simulated Reel'}).tap();
  await tap(page,'Previous Reel');await tap(page,'Next Reel');
  await page.getByRole('combobox',{name:'Feed audience'}).selectOption('puzzles');
  await page.getByRole('combobox',{name:'Featured creative'}).selectOption('case-file');
  await page.getByRole('link',{name:'Solve the case',exact:true}).tap();await page.getByRole('link',{name:/Return to guided demo/}).tap();
  await expect(page.locator('#guided-heading')).toHaveText('Pass on the curiosity.');
  await expect(page).toHaveURL(/audience=puzzles&creative=case-file/);
  await page.locator('.guided-demo').getByRole('button',{name:'Challenge a Friend'}).tap();
  await expect(page.getByRole('textbox',{name:'Challenge URL'})).toHaveValue('http://127.0.0.1:5173/play/case-file?case=office');
  for(const id of ['quiz','missing-clue','predict','signal-rush','case-file'] as const){
    await page.goto('/demo');await page.getByRole('combobox',{name:'Campaign audience'}).selectOption(profiles[id]);await page.getByRole('combobox',{name:'Campaign creative'}).selectOption(id);
    for(const variant of ['curiosity','challenge'] as const){await page.getByRole('combobox',{name:'Opening hook'}).selectOption(variant);const creative=resolveCreative(id,profiles[id],{variant});await expect(page.locator('.studio-creative h2')).toHaveText(creative.headline);await expect(page.getByRole('link',{name:'Open consumer campaign link'})).toHaveAttribute('href',campaignPath(creative));await page.getByRole('link',{name:'Enter the Reels simulator'}).tap();await page.getByRole('button',{name:'Next Reel'}).tap();await page.getByRole('button',{name:'Next Reel'}).tap();await expect(page.locator('.feed-frame[data-active=true] h2')).toHaveText(creative.headline);await page.goBack();await expect(page.getByRole('combobox',{name:'Opening hook'})).toBeVisible();await page.getByRole('combobox',{name:'Campaign audience'}).selectOption(profiles[id]);await page.getByRole('combobox',{name:'Campaign creative'}).selectOption(id);}
  }
  await page.goto('/demo/reels?profile=unknown&variant=invalid&reel=garbage');await expect(page.getByRole('status')).toContainText('1 / 5');await checkLayout(page);
});

test('short-phone first frames retain readable artwork and reachable CTAs',async({page})=>{
  test.setTimeout(90000);
  for(const [width,height] of [[320,568],[375,667]]){
    await page.setViewportSize({width,height});
    for(const id of Object.keys(profiles) as CreativeId[]){
      await page.goto(`/demo/reels?profile=${profiles[id]}&creative=${id}&reel=2`);
      await expect(page.getByRole('status')).toContainText('3 / 5');
      const ad=page.locator('.feed-frame[data-active=true] .campaign-creative');
      expect(await ad.evaluate(e=>e.scrollHeight<=e.clientHeight+1)).toBe(true);
      expect(await ad.locator('.campaign-art').evaluate(e=>e.clientHeight>40&&e.scrollHeight<=e.clientHeight+1)).toBe(true);
      const creative=resolveCreative(id,profiles[id]);await expect(page.getByRole('link',{name:creative.cta,exact:true})).toBeVisible();await checkLayout(page);
      if(width===320&&id==='quiz')await ad.screenshot({path:'test-results/quiz-short-phone.png'});
    }
  }
});
