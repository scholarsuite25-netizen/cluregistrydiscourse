import { test, expect } from '@playwright/test';

test.describe('CLU Registry Discourse - Registration Flow', () => {
  test('should display correct event time on homepage', async ({ page }) => {
    await page.goto('/');
    // Check for the presence of 9:00 a.m. WAT time as specified in Prompt A
    await expect(page.locator('text=9:00').first()).toBeVisible();
    await expect(page.locator('text=WAT').first()).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');
    const registerLink = page.getByRole('link', { name: /register/i }).first();
    if (await registerLink.isVisible()) {
        await registerLink.click();
        await expect(page).toHaveURL(/.*register/);
        await expect(page.locator('form')).toBeVisible();
    }
  });

  test('people page should not contain fake data', async ({ page }) => {
    await page.goto('/people');
    // Ensure the fallback "OFFICIAL PHOTOGRAPH AWAITING APPROVAL" is present 
    // when photographs are missing (which is the case initially)
    await expect(page.locator('text=OFFICIAL PHOTOGRAPH AWAITING APPROVAL').first()).toBeVisible();
    
    // Ensure LOC section has no seeded fake members
    await expect(page.locator('text=Zero LOC records seeded')).toBeVisible();
  });
});
