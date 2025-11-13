import { test,expect } from '@playwright/test';
import { env } from './utils/env';
//import data from './Data/data.json';
//import { signinlocators} from './Locator/signinlocators.spec';
import {login} from './utils/login';
import signOut from './utils/signout';
test.describe('myhrms',() =>{
test.beforeEach(async ({page})=>{
await page.goto (env.baseURL);
//await page.pause();
await expect (page.getByText ( 'Your complete online HR solution')).toBeVisible();
});
 test('login',async({page}) =>{
    await login(page);

page.waitForTimeout(3000);
 await expect (page.getByText ( 'Assistant Manager')).toBeVisible();
try {
   await signOut(page, 'text=Sign Out'); // replace string with your exact signout locator if you have one
} catch (err) {
   // rethrow so test fails as expected
   throw err;
} finally {
   // optional: ensure signout/cleanup always attempted
   try { await signOut(page); } catch {}
}

await page.pause();

})
});