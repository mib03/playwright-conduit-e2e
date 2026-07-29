import {Page, Locator} from '@playwright/test';

export class NavigationPage {
    readonly page: Page;
    readonly signInLink: Locator;
    readonly signUpLink: Locator;
    readonly settingsLink: Locator;
    readonly yourFeedTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInLink = page.getByRole('link', { name: 'Sign in' });
        this.signUpLink = page.getByRole('link', { name: 'Sign up' });
        this.settingsLink = page.getByRole('link', { name: 'Settings' });
        this.yourFeedTab = page.getByText('Your Feed');
    }

    async gotoHome() {
        await this.page.goto('https://conduit.bondaracademy.com/');
    }

    async clickSignIn() {
        await this.signInLink.click();
    }

    async clickSignUp() {
        await this.signUpLink.click();
    }

    async clickSettings() {
        await this.settingsLink.click();
    }
}