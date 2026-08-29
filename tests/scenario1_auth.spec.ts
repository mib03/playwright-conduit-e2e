import { test, expect } from '../src/fixtures/page-fixtures';
import { faker } from '@faker-js/faker';
import { getTestCredentials } from '../src/config/test-config';

test.describe("Scenario 1: Authentication and User Session Management", () => {

  test('@destructive Registers a new user through the UI', async ({ navPage, registerPage }) => {
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await navPage.gotoHome();
    await navPage.clickSignUp();
    await registerPage.register(username, email, password);

    await expect(navPage.settingsLink).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();
  });

  test('@smoke @auth Verifies JWT authentication and clears the session on logout', async ({ navPage, loginPage, settingsPage }) => {

    const { email, password } = getTestCredentials();

    await navPage.gotoHome();
    await navPage.clickSignIn();
    await loginPage.login(email, password);

    await expect(navPage.yourFeedTab).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();
    await expect(navPage.signUpLink).not.toBeVisible();

    const jwtToken = await loginPage.getLocalStorageItem('jwtToken');
    expect(jwtToken).not.toBeNull();
    expect(jwtToken?.length).toBeGreaterThan(10);

    await navPage.clickSettings();
    await settingsPage.logout();
    
    await expect(navPage.signInLink).toBeVisible();
    await expect(navPage.signUpLink).toBeVisible();

    const tokenAfterLogout = await loginPage.getLocalStorageItem('jwtToken');
    expect(tokenAfterLogout).toBeNull();
  });

  test('@auth Rejects invalid login credentials', async ({ navPage, loginPage }) => {
    await navPage.gotoHome();
    await navPage.clickSignIn();
    await loginPage.login('invalid-user@example.com', 'invalid-password');

    await expect(loginPage.signInButton).toBeVisible();
    await expect(navPage.yourFeedTab).not.toBeVisible();
    await expect(loginPage.getLocalStorageItem('jwtToken')).resolves.toBeNull();
  });
});
