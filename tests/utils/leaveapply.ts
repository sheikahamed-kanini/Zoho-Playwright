import { Page, expect } from '@playwright/test';
import { signinlocators } from '../Locator/signinlocators.spec';
import { pickDate } from './date';

export async function applyLeave(page: Page, startDate: string, endDate: string, description: string = 'Leave request') {
    // Click Quick Actions
    await page.getByRole(signinlocators.actions.Role, { name: signinlocators.actions.name }).click();
    
    // Click Leave menu
    await page.getByRole(signinlocators.leave.Role, { name: signinlocators.leave.name }).locator('span').click();
    
    // Select Leave Type dropdown
    await page.getByText(signinlocators.select.name).click();
    
    // Select Earned Leave
    await page.getByText(signinlocators.earnedleave.name).click();

    // Wait for form to be ready
    await page.waitForTimeout(500);

    // Click on start date container to open calendar picker
    await page.locator(signinlocators.leaveForm.startDateContainer).click();
    await page.waitForTimeout(500);
    
    // Select start date from calendar
    await selectDateFromCalendar(page, startDate);
    
    // Wait for form to update
    await page.waitForTimeout(1500);

    // Click on end date container to open calendar picker
    await page.locator(signinlocators.leaveForm.endDateContainer).click();
    await page.waitForTimeout(500);
    
    // Select end date from calendar
    await selectDateFromCalendar(page, endDate);

    // Verify dates were filled
    await page.waitForTimeout(500);
    const startDateField = await page.locator(signinlocators.leaveForm.startDateInput).first();
    const endDateField = await page.locator(signinlocators.leaveForm.endDateInput).first();
    
    const formatDateToZoho = (dateStr: string): string => {
        const [day, month, year] = dateStr.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[parseInt(month) - 1];
        return `${day}-${monthName}-${year}`;
    };
    
    const expectedStartDate = formatDateToZoho(startDate);
    const expectedEndDate = formatDateToZoho(endDate);
    
    await expect(startDateField).toHaveValue(expectedStartDate, { timeout: 10000 });
    await expect(endDateField).toHaveValue(expectedEndDate, { timeout: 10000 });
}

// Helper function to select date from calendar picker
async function selectDateFromCalendar(page: Page, dateStr: string) {
    const [day, month, year] = dateStr.split('-');
    const dayNum = parseInt(day);

    // Try to find and click the day cell in calendar with gridcell role
    const dayCell = page.getByRole('gridcell', { name: String(dayNum) }).first();
    if (await dayCell.count() > 0) {
        // Try clicking the span inside gridcell first (Zoho style)
        const span = dayCell.locator('span').first();
        if (await span.count() > 0) {
            await span.click();
            await page.waitForTimeout(300);
            return;
        }
        // If no span, click the cell directly
        await dayCell.click();
        await page.waitForTimeout(300);
        return;
    }

    // Fallback: try by text match
    const cellByText = page.getByText(new RegExp(`^${dayNum}$`)).first();
    if (await cellByText.count() > 0) {
        await cellByText.click();
        await page.waitForTimeout(300);
        return;
    }

    throw new Error(`Unable to select day ${dayNum} from calendar for date ${dateStr}`);
}

