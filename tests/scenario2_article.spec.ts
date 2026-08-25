import { test, expect } from '../src/fixtures/page-fixtures';
import { faker } from '@faker-js/faker';

test.describe("Scenario 2 (FAST): Article Lifecycle with API Login Injection", () => {

    test('Creates, reads, and deletes an article with API-injected authentication', async ({ loggedInUser, navPage, editorPage, articlePage, page }) => {
        await expect(navPage.yourFeedTab).toBeVisible();
        await expect(navPage.signInLink).not.toBeVisible();

        const articleTitle = `Playwright article ${faker.string.alphanumeric(10)}`;
        const articleDescription = 'Article lifecycle test description';
        const articleBody = 'Article lifecycle test body';
        const articleTag = 'playwright';

        await navPage.newArticleLink.click();
        await editorPage.createArticle(articleTitle, articleDescription, articleBody, articleTag);

        await expect(articlePage.articleTitle).toHaveText(articleTitle);
        await expect(articlePage.articleBody).toContainText(articleBody);

        await articlePage.deleteArticle();
        await expect(navPage.yourFeedTab).toBeVisible();
        await expect(articlePage.articleHeading(articleTitle)).not.toBeVisible();
    });
});