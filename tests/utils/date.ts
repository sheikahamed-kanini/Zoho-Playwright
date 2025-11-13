import { Page } from '@playwright/test';

export async function pickDate(page: Page, containerSelector: string, dateStr: string) {
    // Parse dd-MM-yyyy format from data.json
    const [day, month, year] = dateStr.split('-');
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Try direct input fill first (fastest)
    try {
        const input = page.locator(`${containerSelector} input`).first();
        if (await input.count() > 0) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const zohoDate = `${day}-${monthNames[monthNum - 1]}-${year}`;
            
            await input.focus();
            await input.fill('');
            await page.waitForTimeout(100);
            await input.type(zohoDate, { delay: 50 });
            await page.waitForTimeout(200);
            await input.press('Tab');
            await page.waitForTimeout(300);
            return;
        }
    } catch (e) {
        console.log('Input fill failed, trying calendar picker...');
    }

    // Fallback: use calendar picker
    try {
        await page.locator(containerSelector).click();
        await page.waitForTimeout(500);

        // Try to find and click the day cell in calendar
        const dayCell = page.getByRole('gridcell', { name: String(dayNum) }).first();
        if (await dayCell.count() > 0) {
            const span = dayCell.locator('span').first();
            if (await span.count() > 0) {
                await span.click();
            } else {
                await dayCell.click();
            }
            await page.waitForTimeout(300);
            return;
        }

        // Try by text match
        const cellByText = page.getByText(new RegExp(`^${dayNum}$`)).first();
        if (await cellByText.count() > 0) {
            await cellByText.click();
            await page.waitForTimeout(300);
            return;
        }
    } catch (e) {
        console.log('Calendar picker failed');
    }

    throw new Error(`Unable to set date ${dateStr} for selector ${containerSelector}`);
}