import { test, expect } from '@playwright/test';
import { NavigationPage } from '../pages/NavigationPage';

test.describe("Scenario 3: Network Interception & API Mocking", () => {

    test('1. Mock Empty Feed: Force API return empty data', async ({ page }) => {
        const navPage = new NavigationPage(page);

        await page.route('**/api/articles*', async (route) => {

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    articles: [],
                    articlesCount: 0
                })
            });
        });

        await navPage.gotoHome();

        await expect(page.getByText('No articles are here... yet.')).toBeVisible();
    });

    test('2. Mock Server Error (500): Backend Crash Simulation', async ({ page }) => {
        const navPage = new NavigationPage(page);

        await page.route('**/api/articles*', async (route) => {

            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                    errors: {
                        body: ['Internal Server Error']
                    }
                })
            });
        });

        await navPage.gotoHome();

        await expect(navPage.signInLink).toBeVisible();
        await expect(page.getByText('Global Feed')).toBeVisible();
    });
});