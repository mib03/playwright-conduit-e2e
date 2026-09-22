import { test, expect } from "../src/fixtures/page-fixtures";
import { getTestCredentials } from "../src/config/test-config";

function generateValidRegistrationUser() {
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const username = `user${uniqueSuffix}`.slice(0, 20);
  const email = `user${uniqueSuffix}@example.com`;
  const password = "StrongPass123!";

  return { username, email, password };
}

test.describe("Scenario 1: Authentication and User Session Management", () => {
  test("@destructive Registers a new user through the UI", async ({
    navPage,
    registerPage,
  }) => {
    const { username, email, password } = generateValidRegistrationUser();

    await navPage.gotoHome();
    await navPage.clickSignUp();
    await registerPage.register(username, email, password);

    await expect(navPage.settingsLink).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();
  });

  test("@smoke @auth Verifies JWT authentication and clears the session on logout", async ({
    navPage,
    loginPage,
    settingsPage,
  }) => {
    const { email, password } = getTestCredentials();

    await navPage.gotoHome();
    await navPage.clickSignIn();
    await loginPage.login(email, password);

    await expect(navPage.yourFeedTab).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();
    await expect(navPage.signUpLink).not.toBeVisible();

    const jwtToken = await loginPage.getLocalStorageItem("jwtToken");
    expect(jwtToken).not.toBeNull();
    expect(jwtToken?.length).toBeGreaterThan(10);

    await navPage.clickSettings();
    await settingsPage.logout();

    await expect(navPage.signInLink).toBeVisible();
    await expect(navPage.signUpLink).toBeVisible();

    const tokenAfterLogout = await loginPage.getLocalStorageItem("jwtToken");
    expect(tokenAfterLogout).toBeNull();
  });

  test("@auth Rejects invalid login credentials", async ({
    navPage,
    loginPage,
  }) => {
    await navPage.gotoHome();
    await navPage.clickSignIn();
    await loginPage.login("invalid-user@example.com", "invalid-password");

    await expect(loginPage.signInButton).toBeVisible();
    await expect(loginPage.errorMessages).toContainText(
      /invalid|credentials|email|password/i,
    );
    await expect(navPage.yourFeedTab).not.toBeVisible();
    await expect(loginPage.getLocalStorageItem("jwtToken")).resolves.toBeNull();
  });
});
