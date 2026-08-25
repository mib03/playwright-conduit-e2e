import {Page, Locator} from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
    readonly articleTitle: Locator;
    readonly articleBody: Locator;
    readonly deleteArticleButton: Locator;
    readonly articleHeading: (title: string) => Locator;

    constructor(page: Page) {
        super(page);
        this.articleTitle = page.getByRole('heading', { level: 1 });
        this.articleBody = page.locator('.article-content');
        this.deleteArticleButton = page.locator('.article-actions').getByRole('button', { name: /delete article/i }).first();
        this.articleHeading = (title) => page.getByRole('heading', { name: title });
    }

    async deleteArticle() {
        await this.deleteArticleButton.click();
    }
}