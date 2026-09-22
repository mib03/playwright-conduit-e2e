import { test, expect } from "../src/fixtures/page-fixtures";

test("@mobile @smoke Keeps the home navigation usable on mobile", async ({
  page,
  navPage,
}) => {
  await navPage.gotoHome();

  await expect(page.getByRole("navigation")).toBeVisible();
  await expect(navPage.signInLink).toBeVisible();
  await expect(navPage.signUpLink).toBeVisible();
});
