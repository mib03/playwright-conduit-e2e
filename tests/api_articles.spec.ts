import { test, expect } from "@playwright/test";
import { apiBaseUrl } from "../src/config/test-config";

test.describe("Article API contract", () => {
  test("@api @regression Rejects article creation without authentication", async ({
    request,
  }) => {
    const response = await request.post(`${apiBaseUrl}/api/articles`, {
      data: {
        article: {
          title: "Unauthorized article",
          description: "Should not be created",
          body: "No authentication token",
          tagList: [],
        },
      },
    });

    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toMatchObject({
      message: expect.any(String),
      status: "error",
    });
  });

  test("@api @regression Returns not found for an unknown article", async ({
    request,
  }) => {
    const response = await request.get(
      `${apiBaseUrl}/api/articles/article-that-does-not-exist`,
    );

    expect(response.status()).toBe(404);
    expect(response.headers()["content-type"]).toContain("application/json");
    await expect(response.json()).resolves.toHaveProperty("errors");
  });
});
