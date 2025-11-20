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
    
    // Fill description
    await page.getByRole(signinlocators.leaveForm.descriptionField.Role, { name: signinlocators.leaveForm.descriptionField.name }).click();
    await page.getByRole(signinlocators.leaveForm.descriptionField.Role, { name: signinlocators.leaveForm.descriptionField.name }).fill(data.description.text);

    // Submit leave application
    await page.getByRole(signinlocators.leaveForm.submitBtn.Role, { name: signinlocators.leaveForm.submitBtn.name }).click();
    
    // Cancel form
    //await page.getByRole(signinlocators.leaveForm.cancelBtn.Role, { name: signinlocators.leaveForm.cancelBtn.name }).click();
    
    // Close dialog if available
    const closeBtn = page.getByRole('button', { name: 'Close', exact: true });
    if (await closeBtn.count() > 0) {
        await closeBtn.click();
    }
    
    // Sign out and close
    try {
        await signOut(page);
        await page.waitForTimeout(500);
    } catch (e) {
        console.log('SignOut skipped');
    }
    
  
    
    
    console.log('✓ Leave application test completed successfully!');
});

    


   
