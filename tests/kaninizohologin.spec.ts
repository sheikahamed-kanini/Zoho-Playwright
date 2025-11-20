import { test,expect } from '@playwright/test';
import { env } from './utils/env';
//import data from './Data/data.json';
//import { signinlocators} from './Locator/signinlocators.spec';
import {login} from './utils/login';
import {signOut}from './utils/signout';

// Slow down execution - adjust these values
const SLOW_SPEED = 1000; // milliseconds between actions

test.describe('myhrms',() =>{
test.beforeEach(async ({page})=>{
await page.goto (env.baseURL);
await page.waitForTimeout(SLOW_SPEED);
//await page.pause();
await expect (page.getByText ( 'Your complete online HR solution')).toBeVisible();
await page.waitForTimeout(SLOW_SPEED);
});
 test('login',async({page}) =>{
    await page.waitForTimeout(SLOW_SPEED);
    await login(page);
    await page.waitForTimeout(SLOW_SPEED * 3);
    
    // Just verify we're on the dashboard page (URL changed after login)
    await expect(page).toHaveURL(/myhrms|kanini/i, { timeout: 15000 });
    console.log('✓ Login successful - dashboard page loaded');
    
    await page.waitForTimeout(SLOW_SPEED);
    
    await signOut(page);
    await page.waitForTimeout(SLOW_SPEED);

    console.log('✓ Kanini login & logout test completed successfully!');
})
});