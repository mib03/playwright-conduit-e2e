import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ArticlePage extends BasePage {
  readonly articleTitle: Locator;
  readonly articleBody: Locator;
  readonly articleTags: Locator;
  readonly deleteArticleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.articleTitle = page.getByRole("heading", { level: 1 });
    this.articleBody = page.locator(".article-content");
    this.articleTags = page.locator(".tag-list");
    this.deleteArticleButton = page
      .locator(".article-actions")
      .getByRole("button", { name: /delete article/i })
      .first();
  }

  articleHeading(title: string): Locator {
    return this.page.getByRole("heading", { name: title, exact: true });
  }

  articleTitleHeading(title: string): Locator {
    return this.articleHeading(title);
  }

  async deleteArticle() {
    await this.deleteArticleButton.click();
  }
}
