import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { NavigationPage } from '../pages/NavigationPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { SettingsPage } from '../pages/SettingsPage';

test.describe("Scenario 1: Authentication and User Session Management", () => {

  test('1. Registration successful', async ({ page }) => {

    const navPage = new NavigationPage(page);
    const registerPage = new RegisterPage(page);
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await navPage.gotoHome();
    await navPage.clickSignUp();
    await registerPage.register(username, email, password);
  });

  test('2. Login Verification Auth State (JWT) and logout', async ({ page }) => {

    const navPage = new NavigationPage(page);
    const loginPage = new LoginPage(page);
    const settingsPage = new SettingsPage(page);
    
    const emailTest = 'qa_xl_test@mail.com';
    const passwordTest = 'Password123!';

    await navPage.gotoHome();
    await navPage.clickSignIn();
    await loginPage.login(emailTest, passwordTest);

    await expect(navPage.yourFeedTab).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();
    await expect(navPage.signUpLink).not.toBeVisible();

    const jwtToken = await page.evaluate(() => localStorage.getItem('jwtToken'));
    expect(jwtToken).not.toBeNull();
    expect(jwtToken?.length).toBeGreaterThan(10);

    await navPage.clickSettings();
    await settingsPage.logout();
    
    await expect(navPage.signInLink).toBeVisible();
    await expect(navPage.signUpLink).toBeVisible();

    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('jwtToken'));
    expect(tokenAfterLogout).toBeNull();
  });
});
