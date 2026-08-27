import { test, expect } from '../src/fixtures/page-fixtures';
import { faker } from '@faker-js/faker';

test.describe('Scenario 2: Article Lifecycle with API Login Injection', () => {

    test('Creates an article through the authenticated UI', async ({ navPage, editorPage, articlePage, articleCleanup, page }) => {
        await expect(navPage.yourFeedTab).toBeVisible();
        await expect(navPage.signInLink).not.toBeVisible();

        const article = {
            title: `Playwright article ${faker.string.alphanumeric(10)}`,
            description: 'Article creation test description',
            body: 'Article creation test body',
            tagList: ['playwright'],
        };

        await navPage.newArticleLink.click();
        await editorPage.createArticle(article.title, article.description, article.body, article.tagList[0]);

        const articlePath = new URL(page.url()).pathname;
        const createdSlug = articlePath.split('/').filter(Boolean).at(-1);
        expect(createdSlug).toBeTruthy();
        articleCleanup.track({ ...article, slug: createdSlug! });
        await expect(articlePage.articleTitleHeading(article.title)).toBeVisible();
        await expect(articlePage.articleBody).toContainText(article.body);
    });

    test('@smoke Displays an API-created article on its detail page', async ({ articleCleanup, articlePage, articlesApi, page }) => {
        const article = await articlesApi.create({
            title: `API article ${faker.string.alphanumeric(10)}`,
            description: 'Article read test description',
            body: 'Article read test body',
            tagList: ['api'],
        });
        articleCleanup.track(article);

        await page.goto(`/article/${article.slug}`);
        const apiArticle = await articlesApi.get(article.slug);
        expect(apiArticle.title).toBe(article.title);
        expect(apiArticle.body).toBe(article.body);
        await expect(articlePage.articleTitleHeading(article.title)).toBeVisible();
        await expect(articlePage.articleBody).toContainText(article.body);
    });

    test('Deletes an API-created article through the UI', async ({ navPage, articleCleanup, articlePage, page, articlesApi }) => {
        const article = await articlesApi.create({
            title: `Delete article ${faker.string.alphanumeric(10)}`,
            description: 'Article deletion test description',
            body: 'Article deletion test body',
            tagList: ['delete'],
        });
        articleCleanup.track(article);

        await page.goto(`/article/${article.slug}`);
        const deleteResponse = page.waitForResponse((response) =>
            response.request().method() === 'DELETE' && response.url().endsWith(`/api/articles/${article.slug}`),
        );
        await articlePage.deleteArticle();
        expect((await deleteResponse).status()).toBe(204);
        await navPage.yourFeedTab.waitFor();
        await expect(articlePage.articleHeading(article.title)).not.toBeVisible();
    });
});