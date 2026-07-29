import {Page, Locator} from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.emailInput = page.getByPlaceholder('Email');
        this.passwordInput = page.getByPlaceholder('Password');
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    }

    async register(username: string, email: string, password: string) {
        await this.usernameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signUpButton.click();
    }
}