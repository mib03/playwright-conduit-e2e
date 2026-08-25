import { test as base, expect } from '@playwright/test';
import { NavigationPage } from '../../pages/NavigationPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { EditorPage } from '../../pages/EditorPage';
import { ArticlePage } from '../../pages/ArticlePage';

type ConduitPages = {
    navPage: NavigationPage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    settingsPage: SettingsPage;
    editorPage: EditorPage;
    articlePage: ArticlePage;
    loggedInUser: void;
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

    loggedInUser: async ({ page, request }, use) => {
        const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data: {
                user: { email: 'qa_xl_test@mail.com', password: 'Password123!' }
            }
        });

        expect(response.status()).toBe(200);
        const { user } = await response.json();

        await page.addInitScript((jwt) => {
            window.localStorage.setItem('jwtToken', jwt);
        }, user.token);
        await page.goto('https://conduit.bondaracademy.com/');

        await use();
    }
});

export { expect };