import { test, expect } from "../src/fixtures/page-fixtures";
import { createArticleData } from "../src/data/article-factory";

test.describe("Scenario 2: Article Lifecycle with API Login Injection", () => {
  test("@smoke @article Creates an article through the authenticated UI", async ({
    navPage,
    editorPage,
    articlePage,
    articleCleanup,
    page,
  }) => {
    await expect(navPage.yourFeedTab).toBeVisible();
    await expect(navPage.signInLink).not.toBeVisible();

    const article = createArticleData();

    await navPage.newArticleLink.click();
    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname.replace(/\/$/, "") === "/api/articles",
    );
    const createArticlePromise = editorPage.createArticle(
      article.title,
      article.description,
      article.body,
      article.tagList![0],
    );
    const createResponse = await createResponsePromise;
    await createArticlePromise;
    expect(createResponse.status()).toBe(201);

    const createdArticle = (
      (await createResponse.json()) as { article: { slug: string } }
    ).article;
    articleCleanup.track({ ...article, slug: createdArticle.slug });

    await page.waitForURL(new RegExp(`/article/${createdArticle.slug}$`));
    const articlePath = new URL(page.url()).pathname;
    const createdSlug = articlePath.split("/").filter(Boolean).at(-1);
    expect(createdSlug).toBe(createdArticle.slug);
    await expect(articlePage.articleTitleHeading(article.title)).toBeVisible();
    await expect(articlePage.articleBody).toContainText(article.body);
    await expect(articlePage.articleTags).toContainText(article.tagList![0]);
  });

  test("@smoke @article Displays an API-created article on its detail page", async ({
    articleCleanup,
    articlePage,
    articlesApi,
    page,
  }) => {
    const article = await articlesApi.create(createArticleData("api"));
    articleCleanup.track(article);

    await page.goto(`/article/${article.slug}`);
    const apiArticle = await articlesApi.get(article.slug);
    expect(apiArticle.title).toBe(article.title);
    expect(apiArticle.body).toBe(article.body);
    await expect(articlePage.articleTitleHeading(article.title)).toBeVisible();
    await expect(articlePage.articleBody).toContainText(article.body);
  });

  test("@regression @article Deletes an API-created article through the UI", async ({
    navPage,
    articleCleanup,
    articlePage,
    page,
    articlesApi,
  }) => {
    const article = await articlesApi.create(createArticleData("delete"));
    articleCleanup.track(article);

    await page.goto(`/article/${article.slug}`);
    const [deleteResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === "DELETE" &&
          response.url().endsWith(`/api/articles/${article.slug}`),
      ),
      articlePage.deleteArticle(),
    ]);
    expect(deleteResponse.status()).toBe(204);
    await navPage.yourFeedTab.waitFor();
    await expect(articlePage.articleHeading(article.title)).not.toBeVisible();
  });
});
