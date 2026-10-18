import { expect, test } from '@playwright/test';

const interests = ['food', 'gaming', 'entertainment', 'lifestyle', 'science'];
for (const width of [360, 390, 430]) {
  for (const interest of interests) {
    test(`${interest} quiz completes and shares at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
      });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      async function noOverflow() { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
      await page.goto(`/play/quiz?interest=${interest}&seed=demo123`);
      await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
      const firstPrompt = await page.locator('#quiz-question').innerText();
      await page.reload();
      await expect(page.locator('#quiz-question')).toHaveText(firstPrompt);
      const prompts: string[] = [];
      for (let index = 0; index < 5; index++) {
        await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(index));
        prompts.push(await page.locator('#quiz-question').innerText());
        await expect(page.locator('.quiz-answers button')).toHaveCount(3);
        await noOverflow();
        if (width === 390 && interest === 'food' && index === 0) {
          await expect(page.locator('.game-panel')).toHaveCSS('opacity', '1');
          await page.screenshot({ path: 'test-results/quiz-food-390.png', fullPage: true });
        }
        await page.locator('.quiz-answers button').first().focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('.quiz-feedback')).toBeFocused();
        await expect(page.locator('.quiz-answers button:disabled')).toHaveCount(3);
        await expect(page.getByText('Correct answer', { exact: true })).toBeVisible();
        if (index >= 3) await expect(page.getByRole('status')).toContainText('Pending clinical review');
        await noOverflow();
        await page.getByRole('button', { name: index === 4 ? /See what you discovered/ : /Next Question/ }).click();
      }
      expect(new Set(prompts).size).toBe(5);
      expect(prompts[4]).toBe('What is GLP-1?');
      await expect(page.getByRole('heading', { name: 'Here’s something worth knowing.' })).toBeVisible();
      await expect(page.locator('.game-panel')).toBeFocused();
      await expect(page.locator('.skip-link')).toHaveCSS('opacity', '0');
      await expect(page.getByText(/GLP-1 is a hormone released/)).toBeVisible();
      await expect(page.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('href', 'https://steerclub.com');
      await noOverflow();
      if (width === 390 && interest === 'food') {
        await expect(page.locator('.game-panel')).toHaveCSS('opacity', '1');
        await page.screenshot({ path: 'test-results/quiz-result-390.png', fullPage: true });
      }
      await page.getByRole('button', { name: /Challenge a Friend/ }).click();
      const shared = await page.getByRole('textbox', { name: 'Challenge URL' }).inputValue();
      expect(new URL(shared).pathname + new URL(shared).search).toBe(`/play/quiz?interest=${interest}&seed=demo123`);
      await page.getByRole('button', { name: /Play Again/ }).click();
      await expect(page.locator('#quiz-question')).toHaveText(firstPrompt);
      await expect(page.locator('.quiz-answers button:disabled')).toHaveCount(0);
      await page.goto(shared);
      await expect(page.locator('#quiz-question')).toHaveText(firstPrompt);
      expect(errors).toEqual([]);
    });
  }
}

test('judge selector keeps preview, Reel and first quiz question in sync', async ({ page }) => {
  await page.goto('/demo');
  for (const label of ['Food', 'Gaming', 'Movies', 'Everyday life', 'Science']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
    const preview = await page.locator('.audience-question h3').innerText();
    const adHeadline = await page.locator('.audience-ad-copy h3').innerText();
    const destination = await page.getByRole('link', { name: /Play this quiz/ }).getAttribute('href');
    await page.getByRole('link', { name: /Preview this Reel/ }).click();
    await expect(page.locator('.reel-headline h2')).toHaveText(adHeadline);
    await expect(page.locator('.reel-quiz-preview h3')).toHaveText(preview);
    await expect(page.getByText('SIMULATION', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Play the challenge/ })).toHaveAttribute('href', destination!);
    await page.getByRole('link', { name: /Play the challenge/ }).click();
    await expect(page.locator('#quiz-question')).toHaveText(preview);
    await page.goto('/demo');
  }
});

test('invalid interest and seed recover without login or a start gate', async ({ page }) => {
  await page.goto('/play/quiz?interest=unknown');
  await expect(page.getByRole('heading', { name: /What makes you/ })).toBeVisible();
  await page.getByRole('link', { name: 'Food & Cooking' }).click();
  await expect(page.locator('#quiz-question')).toBeVisible();
  await expect(page).toHaveURL(/interest=food&seed=[a-z0-9-]+$/);
  const prompt = await page.locator('#quiz-question').innerText();
  await page.reload();
  await expect(page.locator('#quiz-question')).toHaveText(prompt);
});
