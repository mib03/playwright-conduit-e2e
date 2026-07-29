import {Page, Locator} from '@playwright/test';

export class SettingsPage {
    readonly page: Page;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoutButton = page.getByRole('button', { name: /logout/i });
    }

    async logout() {
        await this.logoutButton.click();
    }
}