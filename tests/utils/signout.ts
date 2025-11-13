import { Page } from '@playwright/test';

export async function signOut(page: Page, selector?: string) {
    // Click user image to open menu first
    await page.locator('#zpeople_userimage').click();
     await page.getByText('Sign Out').click();
    
    // Wait for menu to appear
    await page.waitForTimeout(500);
    
    // Try a set of common sign-out actions. If a specific selector is provided, try it first.
    const tries: (() => Promise<void>)[] = [];

    if (selector) {
        tries.push(async () => { await page.locator(selector).first().click(); });
    }

    tries.push(
        async () => { await page.getByRole('button', { name: /sign\s*out|log\s*out|logout/i }).first().click(); },
        async () => { await page.getByText(/sign\s*out|log\s*out|logout/i).first().click(); },
        async () => { await page.locator('#signout, [data-qa="signout"], a[href*="logout"]').first().click(); }
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