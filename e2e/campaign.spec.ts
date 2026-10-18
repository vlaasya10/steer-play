import { test, expect, type Page, type FrameLocator } from '@playwright/test';
import { campaignProfiles, creativeIds, resolveCreative, primaryCreatives, type CreativeId, type InterestProfile } from '../src/data/campaigns';
import { createQuizSession } from '../src/utils/quizEngine';
const profileFor:Record<CreativeId,InterestProfile>={quiz:'food','missing-clue':'puzzles',predict:'lifestyle','signal-rush':'gaming','case-file':'puzzles',metabolism:'science',glp1:'metabolic-health'};
async function noOverflow(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
async function firstMove(root:Page|FrameLocator,id:CreativeId){
  if(id==='quiz'){await expect(root.getByRole('heading',{name:createQuizSession('food','reel-demo').questions[0].prompt})).toBeVisible();await root.locator('.quiz-answers button').first().click();await expect(root.getByRole('status')).toBeVisible();}
  else if(id==='missing-clue'){await root.getByRole('button',{name:'I’m ready'}).click();await expect(root.getByRole('heading',{name:'What’s missing?'})).toBeVisible();}
  else if(id==='predict'){await root.getByRole('group',{name:'Make your prediction'}).getByRole('button').first().click();await expect(root.getByRole('status')).toBeVisible();}
  else if(id==='signal-rush'){await root.getByRole('group',{name:'Choose the matching symbol'}).getByRole('button').first().click();await expect(root.getByRole('status')).toBeVisible();}
  else if(id==='case-file'){await root.locator('.clue-card button').first().click();await expect(root.getByText(/1 of 3 clues inspected/)).toBeVisible();}
  else if(id==='metabolism'){await root.getByRole('group',{name:'What happens after lunch?'}).getByRole('button').first().click();await expect(root.getByRole('status')).toContainText('Digestion');}
  else{await root.getByRole('link',{name:/How GLP-1 works/}).click();await root.getByRole('button',{name:'Fact',exact:true}).click();await expect(root.getByRole('status')).toContainText('chemical messenger');}
}
for(const width of [360,390,430]){
  test(`fictional feed, all profiles, skipping and native scrolling at ${width}px`,async({page})=>{
    test.setTimeout(90000);await page.setViewportSize({width,height:844});await page.goto('/demo/reels?profile=food');
    await expect(page.getByText('Simulated Reels experience — not Instagram.')).toBeVisible();
    const rail=page.getByRole('region',{name:'Simulated Reels feed'});
    await rail.hover();await page.mouse.wheel(0,await rail.evaluate(el=>el.clientHeight));
    await expect(page.getByRole('status')).toContainText('2 / 5');
    await page.getByRole('button',{name:'Next Reel'}).click();await expect(page.getByRole('status')).toContainText('3 / 5');
    await page.getByRole('button',{name:'Next Reel'}).click();await expect(page.getByRole('status')).toContainText('4 / 5');
    await expect(page).toHaveURL(/demo\/reels/); // The ad was skipped without a game launch.
    await page.getByRole('button',{name:'Previous Reel'}).click();await expect(page.getByRole('status')).toContainText('3 / 5');
    await rail.focus();await page.keyboard.press('Home');await expect(page.getByRole('status')).toContainText('1 / 5');
    for(const profile of campaignProfiles){
      await page.getByRole('combobox',{name:'Feed audience'}).selectOption(profile.id);
      await expect(page.getByRole('status')).toContainText('1 / 5');
      await page.getByRole('button',{name:'Next Reel'}).click();await page.getByRole('button',{name:'Next Reel'}).click();
      const creative=resolveCreative(profile.creatives[0],profile.id);
      await expect(page.locator('.feed-frame[data-active=true] h2')).toHaveText(creative.headline);
      await expect(page.getByRole('link',{name:creative.cta,exact:true})).toBeVisible();await noOverflow(page);
      const box=await rail.boundingBox();expect(Math.abs(box!.width/box!.height-9/16)).toBeLessThan(.015);
    }
    if(width===390)await page.screenshot({path:'test-results/campaign-feed-health-390.png',fullPage:true});
  });
  test(`seven real creative-to-game launches at ${width}px`,async({page})=>{
    test.setTimeout(90000);await page.setViewportSize({width,height:844});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    for(const id of creativeIds){
      const profile=profileFor[id];const creative=resolveCreative(id,profile);
      await page.goto(`/demo/reels?profile=${profile}&creative=${id}&reel=2`);
      await expect(page.getByRole('status')).toContainText('3 / 5');
      const ad=page.locator('.feed-frame[data-active=true] .campaign-creative');
      await expect(ad.getByRole('heading',{name:creative.headline})).toBeVisible();
      expect(await ad.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
      const art=ad.locator('.campaign-art');expect(await art.evaluate(el=>el.scrollHeight<=el.clientHeight+1)).toBe(true);
      await noOverflow(page);
      if(width===390)await ad.screenshot({path:`test-results/campaign-${id}-390.png`});
      await page.getByRole('link',{name:creative.cta,exact:true}).click();
      await expect(page).toHaveURL(new URL(creative.gameRoute,'http://127.0.0.1:5173').href);
      await expect(page.locator('h1')).toBeVisible();await noOverflow(page);
      if(id==='quiz'){const prompt=await page.locator('h1').innerText();await page.goBack();await expect(page.getByRole('status')).toContainText('3 / 5');await page.getByRole('link',{name:creative.cta,exact:true}).click();await expect(page.locator('h1')).toHaveText(prompt);}
      await firstMove(page,id);
    }expect(errors).toEqual([]);
  });
}
test('standalone iframe contains all seven working games and the original completion',async({page})=>{
  test.setTimeout(90000);await page.setViewportSize({width:390,height:844});
  await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});});
  await page.goto('/demo/playable?profile=food&creative=quiz');
  await expect(page.getByText(/does not establish eligibility/)).toBeVisible();
  for(const id of creativeIds){await page.getByRole('combobox',{name:'Preview game'}).selectOption(id);const frame=page.frameLocator('iframe');await expect(page.getByTitle(`${primaryCreatives[id].title} — working playable preview`)).toHaveAttribute('src',resolveCreative(id,'food').gameRoute);await firstMove(frame,id);await noOverflow(page);}
  await page.getByRole('combobox',{name:'Preview game'}).selectOption('missing-clue');const frame=page.frameLocator('iframe');
  await frame.getByRole('button',{name:'I’m ready'}).click();await frame.getByRole('button',{name:/Chutney bowl/}).click();await frame.getByRole('button',{name:/There’s more to this/}).click();await frame.getByRole('button',{name:/Take this discovery/}).click();
  await expect(frame.getByRole('link',{name:/Explore Steer/})).toHaveAttribute('href','https://steerclub.com');
  await frame.getByRole('button',{name:'Challenge a Friend'}).click();await expect(frame.getByRole('textbox',{name:'Challenge URL'})).toHaveValue('http://127.0.0.1:5173/play/missing-clue');
  await expect(frame.locator('.game-panel')).toHaveCSS('opacity','1');await page.screenshot({path:'test-results/campaign-playable-390.png',fullPage:true});
});
test('judge comparison and real friend popup preserve the same variation',async({page})=>{
  await page.setViewportSize({width:1280,height:900});await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});});await page.goto('/demo');
  await expect(page.locator('.comparison-pane')).toHaveCount(2);for(const pane of await page.locator('.comparison-pane').all())await expect(pane).toBeVisible();
  await page.locator('.studio-feature').screenshot({path:'test-results/campaign-studio-desktop.png'});
  await page.setViewportSize({width:360,height:844});await page.getByRole('button',{name:'Audience B',exact:true}).click();await expect(page.locator('.comparison-pane').nth(0)).toBeHidden();await expect(page.locator('.comparison-pane').nth(1)).toBeVisible();await noOverflow(page);
  await page.getByRole('combobox',{name:'Challenge audience'}).selectOption('gaming');await page.getByRole('combobox',{name:'Challenge game'}).selectOption('signal-rush');await page.getByRole('button',{name:'Create challenge link'}).click();
  await expect(page.getByRole('textbox',{name:'Public friend link'})).toHaveValue('http://127.0.0.1:5173/play/signal-rush?seed=reel-demo');
  const popupPromise=page.waitForEvent('popup');await page.getByRole('link',{name:'Open as friend'}).click();const friend=await popupPromise;await expect(friend).toHaveURL(/play\/signal-rush\?seed=reel-demo$/);expect(await friend.evaluate(()=>window.opener===null)).toBe(true);await firstMove(friend,'signal-rush');await expect(page).toHaveURL(/\/demo$/);await friend.close();
  await page.getByRole('link',{name:'Create a friend challenge',exact:true}).click();await expect(page).toHaveURL(/#sharing-loop$/);await expect(page.getByRole('heading',{name:'A little curiosity travels.'})).toBeInViewport();
});
test('touch swipe and reduced motion keep the feed navigable',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://127.0.0.1:5173/demo/reels?profile=science');const rail=page.getByRole('region',{name:'Simulated Reels feed'});const box=(await rail.boundingBox())!;const cdp=await context.newCDPSession(page);
  const x=box.x+box.width/2,start=box.y+box.height*.8;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:start}]});for(let step=1;step<=7;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:start-step*box.height*.08}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.getByRole('status')).not.toContainText('1 / 5');
  await page.goto('http://127.0.0.1:5173/demo/reels?profile=science&reel=2');await expect(page.locator('.feed-frame[data-active=true] .campaign-signal')).toHaveCSS('animation-name','none');
  await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('.feed-frame[data-active=true] .campaign-signal')).toHaveCSS('animation-play-state','running');
  await page.getByRole('button',{name:'Previous Reel'}).click();await expect(page.getByRole('status')).toContainText('2 / 5');await expect(page.locator('.campaign-signal')).toHaveCSS('animation-play-state','paused');await context.close();
});
