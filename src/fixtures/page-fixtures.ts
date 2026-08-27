import { test as base, expect } from '@playwright/test';
import { NavigationPage } from '../../pages/NavigationPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { EditorPage } from '../../pages/EditorPage';
import { ArticlePage } from '../../pages/ArticlePage';
import { AuthApi } from '../../api/AuthApi';
import { ArticlesApi } from '../../api/ArticlesApi';
import { Article } from '../../api/ArticlesApi';
import { apiBaseUrl, appBaseUrl, getTestCredentials } from '../config/test-config';

type ConduitPages = {
    navPage: NavigationPage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    settingsPage: SettingsPage;
    editorPage: EditorPage;
    articlePage: ArticlePage;
    authToken: string;
    articlesApi: ArticlesApi;
    articleCleanup: {
        track: (article: Article) => void;
    };
};

export const test = base.extend<ConduitPages>({
    navPage: async ({ page }, use) => {
        await use(new NavigationPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    settingsPage: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
    editorPage: async ({ page }, use) => {
        await use(new EditorPage(page));
    },
    articlePage: async ({ page }, use) => {
        await use(new ArticlePage(page));
    },

    authToken: async ({ page, request }, use) => {
        const authApi = new AuthApi(request, apiBaseUrl);
        const token = await authApi.login(getTestCredentials());

        await page.addInitScript((jwt) => {
            window.localStorage.setItem('jwtToken', jwt);
        }, token);
        await page.goto(appBaseUrl);

        await use(token);
    },
    articlesApi: async ({ request, authToken }, use) => {
        await use(new ArticlesApi(request, apiBaseUrl, authToken));
    },
    articleCleanup: async ({ articlesApi }, use) => {
        const articles: Article[] = [];

        await use({
            track: (article) => articles.push(article),
        });

        for (const article of articles.reverse()) {
            await articlesApi.delete(article.slug).catch(() => undefined);
        }
    },
});

export { expect };