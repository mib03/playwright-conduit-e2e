import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
    readonly logoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.logoutButton = page.getByRole('button', { name: /logout/i });
    }

    async logout() {
        await this.logoutButton.click();
    }
}