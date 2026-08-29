import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../src/fixtures/page-fixtures';

test('@accessibility @smoke Login page has no automatically detectable accessibility violations', async ({ page, navPage }) => {
    test.fail(true, 'Hosted Conduit currently has known accessibility violations; remove this marker after the app is remediated.');

    await navPage.gotoHome();
    await navPage.clickSignIn();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});
