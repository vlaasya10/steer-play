import { expect, test } from '@playwright/test';

for (const width of [360, 390, 430]) {
  test(`complete mobile journey at ${width}px without overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    async function noOverflow() { expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); }
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /A little curiosity/ })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(7);
    await noOverflow();
    await page.screenshot({ path: `test-results/discovery-${width}.png`, fullPage: true });
    await page.goto('/demo');
    await noOverflow();
    await page.getByRole('link', { name: /Experience the journey/ }).click();
    await expect(page.getByText('SIMULATION', { exact: true })).toBeVisible();
    await noOverflow();
    await page.getByRole('link', { name: /Play the challenge/ }).click();
    await expect(page.getByRole('heading', { name: 'Take a good look.' })).toBeVisible();
    await page.reload();
    await page.getByRole('button', { name: /I’m ready/ }).click();
    await page.getByRole('button', { name: /Chai cup/ }).click();
    await expect(page.getByRole('status')).toContainText('The chutney bowl disappeared');
    await noOverflow();
    await page.getByRole('button', { name: /There’s more to this/ }).click();
    await expect(page.getByRole('heading', { name: /Some of the most important signals/ })).toBeVisible();
    await noOverflow();
    await expect(page.locator('.game-panel')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: `test-results/science-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: /Take this discovery/ }).click();
    await expect(page.getByRole('link', { name: /Explore Steer/ })).toHaveAttribute('href', 'https://steerclub.com');
    await noOverflow();
    await page.getByRole('button', { name: /Play Again/ }).click();
    await expect(page.getByRole('heading', { name: 'Take a good look.' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('desktop, keyboard access and correct-answer path', async ({ page }) => {
  // OS share sheets are outside browser automation. Exercise the visible-link
  // fallback here; native sharing and clipboard paths have integration tests.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.screenshot({ path: 'test-results/discovery-desktop.png', fullPage: true });
  await page.goto('/play/missing-clue');
  await page.getByRole('button', { name: /I’m ready/ }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: /Chutney bowl/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('You noticed');
  await page.getByRole('button', { name: /There’s more/ }).click();
  await expect(page.locator('.game-panel')).toBeFocused();
  await page.getByRole('button', { name: /Take this discovery/ }).click();
  await page.getByRole('button', { name: /Challenge a Friend/ }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Challenge URL' })).toHaveValue('http://127.0.0.1:5173/play/missing-clue');
  await page.getByRole('link', { name: /Explore More Games/ }).click();
  await expect(page.getByRole('heading', { name: /A little curiosity/ })).toBeVisible();
});
