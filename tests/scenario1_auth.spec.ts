import { test, expect } from '../src/fixtures/page-fixtures';
import { faker } from '@faker-js/faker';

test.describe("Scenario 1: Authentication and User Session Management", () => {

  test('Registers a new user through the UI', async ({ navPage, registerPage }) => {
    const username = faker.internet.username();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await navPage.gotoHome();
    await navPage.clickSignUp();
    await registerPage.register(username, email, password);

    await expect(navPage.settingsLink).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();
  });

  test('Verifies JWT authentication and clears the session on logout', async ({ navPage, loginPage, settingsPage }) => {

    const emailTest = 'qa_xl_test@mail.com';
    const passwordTest = 'Password123!';

    await navPage.gotoHome();
    await navPage.clickSignIn();
    await loginPage.login(emailTest, passwordTest);

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
});
