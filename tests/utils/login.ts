import { Page } from '@playwright/test';
import { env } from './env';
import data from '../Data/data.json';
import { signinlocators } from '../Locator/signinlocators.spec';

export async function login(page: Page) {
    await page.goto(env.baseURL);
      page.waitForTimeout(5000)

    await page.getByRole('link', { name: 'Sign In' }).click();

    await page.getByRole(signinlocators.signin1.Role, { name: signinlocators.signin1.name }).fill(data.user.email);
    await page.getByRole(signinlocators.nextbtn1.Role, { name: signinlocators.nextbtn1.name }).click();

    await page.getByRole(signinlocators.signin2.Role, { name: signinlocators.signin2.name }).fill(data.user.email);
    await page.getByRole(signinlocators.nextbtn1.Role, { name: signinlocators.nextbtn1.name }).click();

    await page.getByRole(signinlocators.passwd.Role, { name: signinlocators.passwd.name }).fill(data.user.password);
    await page.getByRole(signinlocators.sign.Role, { name: signinlocators.sign.name }).click();
   
    // wait for navigation / page settle to avoid "execution context was destroyed"
    await Promise.race([
      page.waitForLoadState('networkidle'),
      page.waitForTimeout(1000) // small fallback
    ]);

    // handle post-login popups: try to click if present, otherwise ignore
    try {
      const nextBtn3 = page.getByRole(signinlocators.nextbt3.Role, { name: signinlocators.nextbt3.name }).first();
      await nextBtn3.waitFor({ state: 'visible', timeout: 2000 });
      await nextBtn3.click();
    } catch (e) {
      // not present or timed out — skip
    }

    try {
      const skipBtn = page.getByRole(signinlocators.skip.Role, { name: signinlocators.skip.name }).first();
      await skipBtn.waitFor({ state: 'visible', timeout: 2000 });
      await skipBtn.click();
    } catch (e) { }

    // safe click with catch for optional yes button
    await page.getByRole(signinlocators.yes.Role, { name: signinlocators.yes.name }).click().catch(()=>{});

    // optional "Remind me later" dismiss if present
    try {
      const remind = page.getByText('Remind me later');
      await remind.waitFor({ state: 'visible', timeout: 2000 });
      await remind.click();
    } catch (e) { }
};