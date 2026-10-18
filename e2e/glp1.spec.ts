import { test, expect, type Page } from '@playwright/test';
import { glp1Questions, glp1Path } from '../src/data/glp1Questions';

async function noOverflow(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
async function shot(page: Page, name: string) { await expect(page.locator('.game-panel')).toHaveCSS('opacity','1'); await page.screenshot({ path: `test-results/glp1-${name}.png`, fullPage: true }); }

for (const width of [360,390,430]) {
  test(`all six GLP-1 Quick Plays, correction and replay at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = []; page.on('pageerror',error => errors.push(error.message));
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/learn/glp1');
    await expect(page.locator('.glp-topic-card')).toHaveCount(6);
    for (const link of await page.locator('.glp-topic-card').all()) await expect(link).toBeInViewport();
    if (width === 390) await shot(page,'selection-390');
    for (const [index,topic] of glp1Questions.entries()) {
      await page.goto(glp1Path(topic.slug));
      const answers = page.getByRole('group',{ name: 'Choose an answer' }).getByRole('button');
      await answers.nth(index % 2 === 0 ? 1-topic.correctIndex : topic.correctIndex).focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('status')).toContainText(topic.shortExplanation);
      await expect(answers.first()).toBeDisabled();
      await noOverflow(page);
      await page.getByRole('button',{ name: 'Explore the explanation' }).click();
      await expect(page.getByRole('button',{ name: 'Take this idea with you' })).toBeDisabled();
      for (const node of topic.nodes) {
        if (topic.visual === 'safety') await page.getByText(node.label,{ exact: true }).click();
        else { await page.getByRole('group',{ name: 'Explore the illustration' }).getByRole('button',{ name: new RegExp(node.label) }).focus(); await page.keyboard.press('Enter'); }
        await expect(page.getByText(node.explanation,{ exact: true })).toBeVisible();
        await noOverflow(page);
      }
      await page.getByText('A little more detail',{ exact: true }).click();
      await expect(page.getByText(topic.detailedExplanation)).toBeVisible();
      await page.getByText('View sources and scientific notes',{ exact: true }).click();
      for (const note of topic.sourceNotes) await expect(page.locator('.glp-sources p').filter({ hasText: note.supports })).toBeVisible();
      await noOverflow(page);
      if (width === 390) await shot(page,`${topic.slug}-390`);
      await page.getByRole('button',{ name: 'Take this idea with you' }).click();
      await expect(page.getByRole('heading',{ name: 'One question clearer.' })).toBeInViewport();
      await expect(page.getByRole('link',{ name: /Explore Steer/ })).toHaveAttribute('href','https://steerclub.com');
      await expect(page.getByRole('link',{ name: 'Explore Another Question' })).toHaveAttribute('href','/learn/glp1?view=library');
      await expect(page.getByRole('link',{ name: 'Explore More Games' })).toHaveAttribute('href','/');
      await noOverflow(page);
      if (width === 390 && index === 0) await shot(page,'completion-390');
      await page.getByRole('button',{ name: 'Play Again' }).click();
      await expect(page.getByRole('group',{ name: 'Choose an answer' }).getByRole('button').first()).toBeEnabled();
      await expect(page.getByRole('heading',{ name: topic.question })).toBeInViewport();
    }
    expect(errors).toEqual([]);
  });
  test(`six independent library topics and shareable cards at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(() => { Object.defineProperty(navigator,'share',{ configurable:true, value: undefined }); Object.defineProperty(navigator,'clipboard',{ configurable:true, value: undefined }); });
    for (const topic of glp1Questions) {
      await page.goto(glp1Path(topic.slug,'library'));
      await expect(page.getByRole('heading',{ name: topic.title, exact: true, level: 1 })).toBeVisible();
      await expect(page.getByText(topic.shortExplanation,{ exact: true })).toBeVisible();
      await page.getByRole('link',{ name: 'Share What You Learned' }).click();
      await expect(page.getByRole('heading',{ name: topic.shareTitle })).toBeVisible();
      await page.getByRole('button',{ name: 'Share What You Learned' }).click();
      const url = new URL(await page.getByRole('textbox',{ name: 'Learning URL' }).inputValue());
      expect(url.pathname+url.search).toBe(glp1Path(topic.slug,'library'));
      await noOverflow(page);
      if (width === 390 && topic.slug === 'safety') await shot(page,'knowledge-card-390');
      await page.getByRole('link',{ name: 'Read the explanation' }).click();
      await page.getByRole('link',{ name: 'All questions', exact: true }).click();
      await expect(page.locator('.glp-topic-card')).toHaveCount(6);
    }
  });
}

test('health audience, source-backed judge preview, Reel, legacy and recovery routes', async ({ page }) => {
  await page.setViewportSize({ width:360, height:844 });
  await page.goto('/demo');
  await page.getByRole('button',{ name: /Health interest/ }).click();
  await page.getByRole('group',{ name: 'Demo myth or fact' }).getByRole('button',{ name:'Myth',exact:true }).click();
  await expect(page.getByRole('status')).toContainText(glp1Questions[0].shortExplanation);
  await page.getByText('View sources and scientific notes',{ exact:true }).click();
  await expect(page.locator('.glp-sources p').filter({ hasText: glp1Questions[0].sourceNotes[0].supports })).toBeVisible();
  await page.getByRole('link',{ name: 'Preview this Reel' }).click();
  await expect(page.getByText('SIMULATION',{ exact:true })).toBeVisible();
  for (const width of [360,390,430]) {
    await page.setViewportSize({ width,height:844 });
    const box = await page.locator('.reel').boundingBox();
    expect(box).not.toBeNull(); expect(Math.abs(box!.width/box!.height-9/16)).toBeLessThan(.01);
    expect(await page.locator('.reel').evaluate(el => el.scrollHeight <= el.clientHeight+1)).toBe(true);
    await noOverflow(page);
    if (width === 390) await page.screenshot({ path:'test-results/glp1-health-reel-390.png',fullPage:true });
  }
  await page.getByRole('link',{ name:'Explore the science' }).click();
  await expect(page.locator('.glp-topic-card')).toHaveCount(6);
  await page.goto('/play/glp1-explained?topic=works'); await page.reload();
  await expect(page.getByRole('heading',{ name:glp1Questions[0].question })).toBeVisible();
  await page.goto('/learn/glp1?view=share&topic=invalid');
  await expect(page.getByText(/That topic or section/)).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(7);
  await expect(page.getByText('Coming soon')).toHaveCount(0);
  await expect(page.getByRole('article').filter({ has:page.getByRole('heading',{ name:'GLP-1, Explained' }) }).getByRole('link')).toHaveAttribute('href','/learn/glp1');
});

test('normal motion and reduced motion both keep the biology interactive', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await page.goto('/learn/glp1?topic=works');
  await page.getByRole('button',{ name:'Fact', exact:true }).click();
  await page.getByRole('button',{ name:'Explore the explanation' }).click();
  await page.getByRole('button',{ name:'Pancreas',exact:true }).click();
  await expect(page.getByRole('status')).toContainText('when blood glucose is elevated');
  await page.emulateMedia({ reducedMotion:'reduce' });
  await expect(page.locator('.glp-signal')).toHaveCSS('animation-name','none');
  await page.getByRole('button',{ name:'Take this idea with you' }).click();
  await expect(page.getByRole('heading',{ name:'One question clearer.' })).toBeVisible();
});

