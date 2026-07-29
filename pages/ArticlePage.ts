import {Page, Locator} from '@playwright/test';

export class ArticlePage {
    readonly page: Page;
    readonly articleTitle: Locator;
    readonly articleBody: Locator;
    readonly deleteArticleButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.articleTitle = page.getByRole('heading', { level: 1 });
        this.articleBody = page.locator('.article-content');
        this.deleteArticleButton = page.locator('.article-actions').getByRole('button', { name: /delete article/i }).first();
    }

    async deleteArticle() {
        await this.deleteArticleButton.click();
    }
}