import { Page } from '@playwright/test';

export async function signOut(page: Page, selector?: string) {
    // Click user image to open menu first
    // Click Close button if available, otherwise skip
    // const closeBtn = page.getByRole('button', { name: 'Close', exact: true });
    // if (await closeBtn.count() > 0) {
    //     await closeBtn.click();
    // }
    await page.locator('#zpeople_userimage').click();
    
    // Wait for menu to appear before trying to click Sign Out
    await page.waitForTimeout(800);
    
    // Try a set of common sign-out actions. If a specific selector is provided, try it first.
    const tries: (() => Promise<void>)[] = [];

    if (selector) {
        tries.push(async () => { await page.locator(selector).first().click(); });
    }

    tries.push(
        async () => { await page.getByText(/sign\s*out/i).first().click({ timeout: 3000 }); },
        async () => { await page.getByRole('button', { name: /sign\s*out|log\s*out|logout/i }).first().click({ timeout: 3000 }); },
        async () => { await page.locator('[class*="signout"], [class*="logout"], .zui-menu-text:has-text("Sign Out")').first().click({ timeout: 3000 }); },
        async () => { await page.locator('a:has-text("Sign Out"), button:has-text("Sign Out")').first().click({ timeout: 3000 }); }
    );

    for (const attempt of tries) {
        try {
            await attempt();
            // give UI a moment to process signout
            await page.waitForTimeout(400);
            return;
        } catch {
            // ignore and try next
        }
    }

    // If all sign-out attempts fail, try closing the page as a last resort
    try { await page.close(); } catch { /* ignore */ }
}

export default signOut;