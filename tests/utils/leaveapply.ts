import { Page, expect } from '@playwright/test';
import { signinlocators } from '../Locator/signinlocators.spec';


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
    await page.waitForTimeout(800);

    // Click on start date container to open calendar picker
    await page.locator(signinlocators.leaveForm.startDateContainer).click();
    await page.waitForTimeout(800); // Give calendar time to render
    
    // Select start date from calendar
    await selectDateFromCalendar(page, startDate);
    
    // Wait for form to update after first date selection
    await page.waitForTimeout(1000);

    // Click on end date container to open calendar picker
    await page.locator(signinlocators.leaveForm.endDateContainer).click();
    await page.waitForTimeout(800); // Give calendar time to render
    
    // If end date is in a different month, navigate to next month
    const [startDay, startMonth] = startDate.split('-');
    const [endDay, endMonth] = endDate.split('-');
    
    if (parseInt(endMonth) > parseInt(startMonth)) {
        // Navigate to next month(s)
        const monthDiff = parseInt(endMonth) - parseInt(startMonth);
        for (let i = 0; i < monthDiff; i++) {
            await page.getByRole('button', { name: 'Next Month' }).click();
            await page.waitForTimeout(400);
        }
    }
    
    // Select end date from calendar
    await selectDateFromCalendar(page, endDate);

    // Verify dates were filled
    await page.waitForTimeout(800);
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

    try {
        // Wait a bit for calendar to render
        await page.waitForTimeout(200);

        // Look for the day in the currently displayed calendar
        const dayCell = page.getByRole('gridcell', { name: String(dayNum) }).first();
        
        if (await dayCell.count() > 0) {
            const span = dayCell.locator('span').first();
            if (await span.count() > 0) {
                await span.click();
                await page.waitForTimeout(400);
                return;
            }
            // Click the cell directly if no span
            await dayCell.click();
            await page.waitForTimeout(400);
            return;
        }

        // Fallback: try finding by text within calendar
        const dayText = page.getByText(new RegExp(`^${dayNum}$`), { exact: true }).first();
        
        if (await dayText.count() > 0) {
            await dayText.click();
            await page.waitForTimeout(400);
            return;
        }

        throw new Error(`Day ${dayNum} not found in current calendar view for date ${dateStr}`);
        
    } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        throw new Error(`Failed to select date ${dateStr}: ${errorMsg}`);
    }
}

