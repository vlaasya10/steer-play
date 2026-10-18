import { expect, test, type Page } from '@playwright/test';

const games = [
  { id: 'predict', ad: '/ad/predict', path: '/play/predict?scenario=office', cta: 'Make your prediction', heading: 'Two people. One meal. What happens next?' },
  { id: 'signal-rush', ad: '/ad/signal-rush', path: '/play/signal-rush?seed=steer', cta: 'Take the challenge', heading: 'Can you match the signal?' },
  { id: 'case-file', ad: '/ad/case-file', path: '/play/case-file?case=office', cta: 'Solve the case', heading: 'Three clues. One mystery. Can you solve it?' },
];
async function noOverflow(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
async function shot(page: Page, name: string) { await expect(page.locator('.game-panel')).toHaveCSS('opacity', '1'); await page.screenshot({ path: `test-results/${name}.png`, fullPage: true }); }

for (const width of [360, 390, 430]) {
  for (const game of games) {
    test(`${game.id} complete Reel-to-game journey at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
      });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(game.ad);
      await expect(page.getByText('SIMULATION', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: game.cta })).toHaveAttribute('href', game.path);
      await noOverflow(page);
      const bounds = await page.locator('.reel').boundingBox();
      expect(bounds!.height / bounds!.width).toBeCloseTo(16 / 9, 1);
      expect(await page.locator('.entertainment-ad-visual').evaluate(node => node.scrollHeight <= node.clientHeight + 1)).toBe(true);
      expect(await page.locator('.reel').evaluate(node => node.scrollHeight <= node.clientHeight + 1)).toBe(true);
      if (width === 390) await page.screenshot({ path: `test-results/${game.id}-reel.png`, fullPage: true });
      await page.getByRole('link', { name: game.cta }).click();
      await expect(page.getByRole('heading', { name: game.heading })).toBeVisible();
      await page.reload();
      await expect(page.getByRole('heading', { name: game.heading })).toBeVisible();
      await noOverflow(page);
      if (width === 390) await shot(page, `${game.id}-390`);
      if (game.id === 'predict') {
        await page.locator('.prediction-cards button').nth(width === 390 ? 1 : 0).click();
        await expect(page.getByRole('status')).toContainText('There’s more to the story than one meal.');
        await noOverflow(page);
        await page.getByRole('button', { name: 'Turn the page' }).click();
        await expect(page.getByRole('heading', { name: 'A new clue changes the story.' })).toBeInViewport();
        await page.locator('.story-endings button').nth(width === 390 ? 1 : 0).click();
        await expect(page.getByRole('status')).toContainText('Pending clinical review');
        await noOverflow(page);
        await page.getByRole('button', { name: 'Discover the science' }).click();
      } else if (game.id === 'signal-rush') {
        for (let round = 0; round < 3; round++) {
          if (round === 1) {
            await expect(page.getByRole('img', { name: /^Pattern:/ })).toBeVisible();
            await page.getByRole('button', { name: 'I’ve got the pattern' }).click();
            await expect(page.locator('.symbol-choices button').first()).toBeFocused();
            await page.getByRole('button', { name: 'Show the pattern again' }).click();
            await page.getByRole('button', { name: 'I’ve got the pattern' }).click();
          }
          await page.locator('.symbol-choices button').first().focus();
          await page.keyboard.press('Enter');
          await expect(page.locator('.round-outcome')).toBeFocused();
          await expect(page.getByText('Correct match', { exact: true })).toBeVisible();
          for (const button of await page.locator('.symbol-choices button').all()) await expect(button).toBeDisabled();
          await noOverflow(page);
          await page.getByRole('button', { name: round === 2 ? 'Follow the science' : 'Next signal' }).click();
        }
      } else {
        await expect(page.getByRole('button', { name: 'Make a deduction' })).toBeDisabled();
        for (const label of ['Sleep schedule', 'Meal routine', 'Work schedule']) {
          await page.getByRole('button', { name: new RegExp(label) }).click();
          await expect(page.getByRole('button', { name: new RegExp(label) })).toHaveAttribute('aria-expanded', 'true');
        }
        await noOverflow(page);
        if (width === 390) await shot(page, 'case-clues-open-390');
        await page.getByRole('button', { name: 'Make a deduction' }).click();
        await expect(page.getByRole('heading', { name: 'What does the evidence support?' })).toBeInViewport();
        await page.locator('.deduction-options button').nth(width === 390 ? 1 : 0).click();
        await expect(page.getByRole('status')).toContainText('Not every mystery has one simple explanation.');
        await page.getByRole('button', { name: 'Look at the bigger picture' }).click();
      }
      await expect(page.locator('#science-title')).toBeInViewport();
      await expect(page.getByText(/Pending clinical review/)).toBeVisible();
      await expect(page.locator('.analogy-note')).toBeVisible();
      await page.getByText('Sources & context', { exact: true }).click();
      await expect(page.locator('.science-footnote a').first()).toHaveAttribute('href', /https:\/\/www\.(niddk|nhlbi)\.nih\.gov/);
      await noOverflow(page);
      await page.getByRole('button', { name: /Take this discovery with you/ }).click();
      await expect(page.locator('.completion h1')).toBeInViewport();
      await expect(page.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('href', 'https://steerclub.com');
      await noOverflow(page);
      if (width === 390) await shot(page, `${game.id}-completion-390`);
      await page.getByRole('button', { name: 'Challenge a Friend' }).click();
      const shared = await page.getByRole('textbox', { name: 'Challenge URL' }).inputValue();
      expect(new URL(shared).pathname + new URL(shared).search).toBe(game.path);
      await page.getByRole('button', { name: 'Play Again' }).click();
      await expect(page.getByRole('heading', { name: game.heading })).toBeInViewport();
      await expect(page.locator('.round-outcome')).toHaveCount(0);
      await page.goto(shared);
      await expect(page.getByRole('heading', { name: game.heading })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}

test('four story configurations and safe parameter fallbacks', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/play/predict?scenario=unknown');
  await expect(page.getByText(/That story isn’t available/)).toBeVisible();
  for (const [scenario, person] of [['family', 'Asha, 36'], ['college', 'Nila, 22'], ['weekend', 'Tara, 28'], ['office', 'Meera, 29']]) {
    await page.getByRole('combobox', { name: 'Story setting' }).selectOption(scenario);
    await expect(page.getByText(person, { exact: true })).toBeVisible();
    await noOverflow(page);
  }
  await page.goto('/play/signal-rush?seed=invalid%20seed');
  await expect(page).toHaveURL(/seed=[a-z0-9-]+$/);
  await expect(page.getByRole('heading', { name: /Can you match the signal/ })).toBeVisible();
  await page.goto('/play/case-file?case=unknown');
  await expect(page.getByText(/That case isn’t available/)).toBeVisible();
});
