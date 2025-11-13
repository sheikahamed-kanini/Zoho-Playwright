import { test, expect } from '@playwright/test';
import { login } from './utils/login';
import { signinlocators } from './Locator/signinlocators.spec';
import data from './Data/data.json';
import { weekend, getPreviousWorkingDay} from './utils/weekend';
import { openRegularize, setCheckIn, setCheckOut } from './utils/attendance';



// Add holidays definition (example: import from data.json or define manually)
test ('attendance regularize (requires login)', async ({ page }) => {
    await login(page);
  // await expect (page.getByText ( 'Assistant Manager')).toBeVisible();
const holidays: string[] = data.holidays || [];
    const dayOffset: number = data.regularize.dayOffset || -1;

    // Get the correct previous working day
    const selectedDate = getPreviousWorkingDay(dayOffset, holidays);
    
    // Skip test if it's not a working day
    if (weekend(selectedDate, holidays)) {
        test.skip(true, 'Skipping regularization - Not a working day');
        return;
    }
    await page.getByRole(signinlocators.attendance.Role,{ name:signinlocators.attendance.name }).locator(signinlocators.attendance.child).click();
      await page.getByLabel('Previous').click();

    // open regularize dialog (if your cell selector depends on day, adjust openRegularize to use getDayNumber)
    await openRegularize(page);

    // set times from data.json (day is computed using dayOffset)
    await setCheckIn(page);
    await setCheckOut(page);
    await page.locator('#reg_req_reason_0-container').getByRole('img').click();
  await page.getByText('Work from home').click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Hi Siva , Once again i reconnect from my home , please regularize it.');
  await page.getByRole('button', { name: 'Submit' }).click();
});


// 0 = today, -1 = yesterday, +1 = tomorrow