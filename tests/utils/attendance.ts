import { Page } from '@playwright/test';
import data from '../Data/data.json';

interface DayNumberFn {
    (dayoffset: number): string;
}

function getDayNumber(dayoffset: number): string {
        const d = new Date();
        d.setDate(d.getDate() + dayoffset);
        return String(d.getDate()); // matches gridcell label like '6'
}


export async function openRegularize(page: Page, cellRoleName = 'day Present, 0.5 day Absent') 
  //await page.getByRole('row', { name: 'Thu 06 Remote In Check-in' }).locator('span').click();
{
    // If you have a calendar cell selector that contains the day number instead,
    // consider building it using getDayNumber(data.attendance.regularize.dayOffset)
      const dayOffset = data?.regularize?.dayOffset ?? 0;
    const day = getDayNumber(dayOffset);
      try {
        const dayCell = page.getByRole('gridcell', { name: day, exact: true }).first();
        await dayCell.waitFor({ state: 'visible', timeout: 7000 });
        await dayCell.click();
    } catch (e) {
        // fallback: try any cell that contains the day number
        try {
            const dayCellLike = page.getByRole('cell', { name: new RegExp(`\\b${day}\\b`) }).first();
            await dayCellLike.waitFor({ state: 'visible', timeout: 5000 });
            await dayCellLike.click();
        } catch (e2) {
            // last fallback: click the original (text-based) cell used only for your account
            await page.getByRole('cell', { name: cellRoleName }).click();
        }
    }
    await page.getByText('Regularize', { exact: true }).click();
}

export async function setCheckIn(page: Page) {
    const day = getDayNumber(data.regularize.dayOffset);
    const { hour, minute, period } = data.regularize.checkIn;

    await page.locator('#check-in-0-container').getByRole('button').click();
    await page.getByRole('gridcell', { name: day, exact: true }).click();

    await page.locator('#check-in-0-container-picker-timeinput-hour-container').getByRole('img').click().catch(()=>{});
    await page.getByLabel(hour, { exact: true }).getByText(hour).click().catch(()=>{});

    await page.locator('#check-in-0-container-picker-timeinput-minute-container ').click().catch(()=>{});
    await page.getByLabel(minute, { exact: true }).getByText(minute).click().catch(()=>{});

    await page.locator('#check-in-0-container-picker-timeinput-period-container').getByText(period).click().catch(()=>{});
}

export async function setCheckOut(page: Page) {
    const day = getDayNumber(data.regularize.dayOffset);
    const { hour, minute, period } = data.regularize.checkOut;

    await page.locator('#check-out-0-container').getByRole('textbox', { name: '[object Object]' }).click().catch(()=>{});
    await page.getByRole('gridcell', { name: day, exact: true }).click();

    await page.locator('#check-out-0-container-picker-timeinput-hour-container').click().catch(()=>{});
    await page.getByRole('option', { name: hour }).click().catch(()=>{});

    await page.locator('#check-out-0-container-picker-timeinput-minute-container').getByRole('img').click().catch(()=>{});
    await page.getByLabel(minute, { exact: true }).getByText(minute).click().catch(()=>{});

    await page.locator('#check-out-0-container-picker-timeinput-period-container').getByRole('img').click().catch(()=>{});
    await page.getByLabel(period, { exact: true }).getByText(period).click().catch(()=>{});
}

// export async function fillRegularizeForm(page: Page) {
//     const reason = data.regularize.reason;
//     await page.locator('#reg_cards').click().catch(()=>{});
//     await page.getByText('Period Day Date The To date').click().catch(()=>{});
//     await page.getByLabel('You are in add request page.').click().catch(()=>{});
//     await page.locator('#reg_req_reason_0-container').getByRole('img').click().catch(()=>{});
//     await page.getByText(reason).click().catch(()=>{});
// }