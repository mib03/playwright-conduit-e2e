import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { NavigationPage } from '../pages/NavigationPage';
import { LoginPage } from '../pages/LoginPage';
import { EditorPage } from '../pages/EditorPage';
import { ArticlePage } from '../pages/ArticlePage';

test.describe("Scenario 2 (FAST): Article Lifecycle with API Login Injection", () => {

    test.beforeEach(async ({ page, request }) => {

        const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data: {
                user: {
                    email: 'qa_xl_test@mail.com',
                    password: 'Password123!'
                }
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const jwtToken = responseBody.user.token;

        await page.addInitScript(token => {
            window.localStorage.setItem('jwtToken', token);
        }, jwtToken);

        await page.goto('https://conduit.bondaracademy.com/');
    });

    test('1. Create & Delete Article (Bypass UI Login)', async ({ page }) => {

        const navPage = new NavigationPage(page);
        const editorPage = new EditorPage(page);
        const articlePage = new ArticlePage(page);

        const articleTitle = `Test Title ${faker.string.alphanumeric(5)}`;
        const articleDescription = faker.lorem.sentence();
        const articleBody = faker.lorem.paragraphs(1);
        const articleTag = 'speed';

        await expect(navPage.yourFeedTab).toBeVisible();

        await page.getByRole('link', { name: 'New Article' }).click();

        await editorPage.createArticle(articleTitle, articleDescription, articleBody, articleTag);

        await expect(articlePage.articleTitle).toHaveText(articleTitle);
        await articlePage.deleteArticle();
        await expect(page.getByText(articleTitle)).not.toBeVisible();
    });
});