import { test, expect } from '@playwright/test';
import { login } from './utils/login';
import { signinlocators } from './Locator/signinlocators.spec';
import data from './Data/data.json';
import { signOut } from './utils/signout';
import { applyLeave} from './utils/leaveapply';

test('apply leave (requires login)', async ({ page }) => {
    await login(page);
    
    // Apply leave with dates from data.json
    await applyLeave(page, data.dates.start, data.dates.end);
    await page.getByRole(signinlocators.leaveForm.descriptionField.Role, { name: signinlocators.leaveForm.descriptionField.name }).click();
    await page.getByRole(signinlocators.leaveForm.descriptionField.Role, { name: signinlocators.leaveForm.descriptionField.name }).fill(data.description.text);
    
    // Submit
   // await page.getByRole(signinlocators.leaveForm.submitBtn.Role, { name: signinlocators.leaveForm.submitBtn.name }).click();
    
    await page.getByRole(signinlocators.leaveForm.cancelBtn.Role, { name: signinlocators.leaveForm.cancelBtn.name }).click();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await signOut(page);
  });

    


   
