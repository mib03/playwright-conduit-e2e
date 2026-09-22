import { Request } from "@playwright/test";
import { test, expect } from "../src/fixtures/page-fixtures";

test.describe("Scenario 3: Resilience & Network Interception Testing", () => {
  test("@resilience Keeps the page usable when the tags API returns HTTP 500", async ({
    page,
    navPage,
  }) => {
    await page.route("**/api/tags", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ errors: { body: ["Internal Server Error"] } }),
      });
    });

    const tagsResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        response.url().includes("/api/tags"),
    );
    await navPage.gotoHome();

    expect((await tagsResponse).status()).toBe(500);
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("@resilience Handles a three-second delay in the articles API", async ({
    page,
    navPage,
  }) => {
    const delayMs = 3000;
    const requestStartedAt = new WeakMap<Request, number>();

    await page.route("**/api/articles*", async (route) => {
      requestStartedAt.set(route.request(), Date.now());
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.continue();
    });

    const delayedArticlesResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        response.url().includes("/api/articles"),
    );
    await navPage.gotoHome();

    const articlesResponse = await delayedArticlesResponse;
    const startedAt = requestStartedAt.get(articlesResponse.request());
    expect(startedAt).toBeDefined();
    expect(Date.now() - startedAt!).toBeGreaterThanOrEqual(delayMs);
    expect(articlesResponse.ok()).toBeTruthy();
  });

  test("@smoke @resilience Shows the empty feed when the articles API returns no articles", async ({
    page,
    navPage,
  }) => {
    await page.route("**/api/articles*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ articles: [], articlesCount: 0 }),
      });
    });

    await navPage.gotoHome();

    await expect(page.getByText("No articles are here... yet.")).toBeVisible();
  });
});
