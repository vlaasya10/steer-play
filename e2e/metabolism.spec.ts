import { expect, test, type Page } from '@playwright/test';

async function noOverflow(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
async function shot(page: Page, name: string) { await expect(page.locator('.game-panel')).toHaveCSS('opacity', '1'); await page.screenshot({ path: `test-results/${name}.png`, fullPage: true }); }
async function quickPlay(page: Page, width: number) {
  await page.goto('/learn/metabolism');
  await expect(page.getByRole('heading', { name: 'What actually happens inside your body after a meal?' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'What happens after lunch?' }).getByRole('button')).toHaveCount(3);
  await noOverflow(page);
  if (width === 390) await shot(page, 'metabolism-opening-390');
  await page.getByRole('group', { name: 'What happens after lunch?' }).getByRole('button').nth(2).click();
  await expect(page.getByRole('status')).toContainText('Digestion breaks food down');
  await page.getByRole('button', { name: 'Follow the food' }).click();
  await expect(page.getByRole('heading', { name: 'Let’s follow what happens next.' })).toBeInViewport();
  const organs = page.getByRole('group', { name: 'Follow the food' }).getByRole('button');
  await expect(organs.nth(2)).toBeDisabled();
  for (let index = 0; index < 3; index++) {
    await organs.nth(index).focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toBeVisible();
    await noOverflow(page);
  }
  if (width === 390) await shot(page, 'metabolism-digestion-390');
  await page.getByRole('button', { name: 'Connect the glucose story' }).click();
  await expect(page.getByRole('heading', { name: 'What happens to glucose after a meal?' })).toBeInViewport();
  const glucose = page.getByRole('group', { name: 'Connect the glucose sequence' }).getByRole('button');
  await glucose.first().click();
  await expect(page.getByRole('status')).toContainText('Try “Break down” next');
  for (const name of [/Digestible carbohydrates are broken down/, /Glucose is absorbed/, /Insulin helps regulate/]) await page.getByRole('group', { name: 'Connect the glucose sequence' }).getByRole('button', { name }).click();
  await expect(glucose.nth(0)).toContainText('Digestible carbohydrates are broken down');
  await expect(glucose.nth(1)).toContainText('Glucose is absorbed');
  await expect(glucose.nth(2)).toContainText('Insulin helps regulate');
  for (const button of await glucose.all()) await expect(button).toBeDisabled();
  await noOverflow(page);
  if (width === 390) await shot(page, 'metabolism-glucose-390');
  await page.getByRole('button', { name: 'Follow a different signal' }).click();
  await page.getByRole('button', { name: 'Explore the gut–brain signal' }).click();
  await expect(page.getByRole('button', { name: 'Gut–brain signal explored' })).toBeDisabled();
  await page.getByRole('group', { name: 'Does one signal control all hunger?' }).getByRole('button').first().click();
  await expect(page.getByRole('status')).toContainText('Several processes contribute');
  await page.getByRole('button', { name: 'Meet one of the messengers' }).click();
  const targets = page.getByRole('group', { name: 'Explore GLP-1 relationships' }).getByRole('button');
  await targets.nth(1).click();
  await expect(page.getByRole('status')).toContainText('when blood glucose is elevated');
  await page.getByText('Why do people talk about GLP-1 treatments?', { exact: true }).click();
  await expect(page.getByText(/not identical to the body’s short-lived hormone signals/)).toBeVisible();
  await noOverflow(page);
  if (width === 390) await shot(page, 'metabolism-glp1-390');
  await page.getByRole('button', { name: 'See the bigger picture' }).click();
  await page.getByRole('group', { name: 'Which statement best describes metabolic health?' }).getByRole('button').first().click();
  await expect(page.getByRole('status')).toContainText('medical history');
  await page.getByRole('button', { name: 'See your discovery' }).click();
  await expect(page.getByRole('heading', { name: 'Your body works as a team.' })).toBeInViewport();
  await page.getByRole('button', { name: /Take this discovery with you/ }).click();
  await expect(page.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('href', 'https://steerclub.com');
  await noOverflow(page);
  if (width === 390) await shot(page, 'metabolism-completion-390');
}

for (const width of [360, 390, 430]) {
  test(`metabolism quick play, deeper return, sharing and replay at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await quickPlay(page, width);
    await page.getByRole('link', { name: 'Explore Deeper', exact: true }).click();
    await expect(page.locator('.chapter-list li')).toHaveCount(7);
    await noOverflow(page);
    await page.getByRole('link', { name: 'Back to your discovery' }).click();
    await expect(page.getByRole('link', { name: /Explore Steer/ })).toBeVisible();
    await page.getByRole('link', { name: 'Share What You Learned' }).click();
    await expect(page.getByRole('heading', { name: 'Your gut and brain communicate.' })).toBeVisible();
    await page.getByRole('button', { name: 'Share What You Learned' }).click();
    const shared = await page.getByRole('textbox', { name: 'Learning URL' }).inputValue();
    expect(new URL(shared).pathname + new URL(shared).search).toBe('/learn/metabolism?view=share');
    await noOverflow(page);
    if (width === 390) await shot(page, 'metabolism-knowledge-card-390');
    await page.getByRole('link', { name: 'Back to your discovery' }).click();
    await page.getByRole('button', { name: 'Play Again' }).click();
    await expect(page.getByRole('heading', { name: 'What actually happens inside your body after a meal?' })).toBeInViewport();
    await expect(page.getByRole('group', { name: 'What happens after lunch?' }).getByRole('button').first()).toBeEnabled();
    expect(errors).toEqual([]);
  });
  test(`all seven independent chapters at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 844 });
    for (const chapter of ['metabolism', 'after-eating', 'glucose', 'hunger', 'gut-brain', 'glp1', 'context']) {
      await page.goto(`/learn/metabolism?view=deeper&chapter=${chapter}`);
      await expect(page.locator('.metabolism-chapter h1')).toBeVisible();
      const choices = page.getByRole('group').getByRole('button');
      for (const choice of await choices.all()) {
        await choice.click();
        await expect(choice).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('status')).toBeVisible();
      }
      await page.getByText('A little more detail', { exact: true }).click();
      await page.getByText('Sources & scientific notes', { exact: true }).click();
      await expect(page.locator('.lesson-notes a').first()).toHaveAttribute('href', /^https:\/\//);
      await noOverflow(page);
      await page.getByRole('link', { name: 'All chapters' }).click();
      await expect(page.locator('.chapter-list li')).toHaveCount(7);
    }
  });
}

test('the signal remains clickable with regular motion and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await quickPlay(page, 0);
  await page.goto('/learn/metabolism?view=deeper&chapter=after-eating');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.organ-connector.active')).toHaveCSS('animation-name', 'none');
});

test('Discovery, judge entry, legacy refresh and invalid views work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Inside Your Metabolism' }) }).getByRole('link', { name: 'Follow the science' })).toHaveAttribute('href', '/learn/metabolism');
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Preview Quick Play' }).click();
  await expect(page.getByRole('heading', { name: /What actually happens/ })).toBeVisible();
  await page.goto('/play/inside-metabolism');
  await page.reload();
  await expect(page.getByRole('heading', { name: /What actually happens/ })).toBeVisible();
  await page.goto('/learn/metabolism?view=unknown');
  await expect(page.getByText(/That section isn’t available/)).toBeVisible();
  await page.goto('/learn/metabolism?view=deeper&chapter=unknown');
  await expect(page.getByText(/That chapter isn’t available/)).toBeVisible();
  await expect(page.locator('.chapter-list li')).toHaveCount(7);
});
