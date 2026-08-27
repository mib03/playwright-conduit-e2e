import { APIRequestContext } from '@playwright/test';

export type ArticleInput = {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
};

export type Article = {
    slug: string;
    title: string;
    description: string;
    body: string;
};

export class ArticlesApi {
    constructor(
        private readonly request: APIRequestContext,
        private readonly baseUrl: string,
        private readonly token: string,
    ) { }

    async create(article: ArticleInput): Promise<Article> {
        const response = await this.request.post(`${this.baseUrl}/api/articles`, {
            headers: { Authorization: `Token ${this.token}` },
            data: { article },
        });

        if (response.status() !== 201) {
            throw new Error(`Article creation failed with HTTP ${response.status()}: ${await response.text()}`);
        }
        const body = await response.json() as { article: Article };
        return body.article;
    }

    async get(slug: string): Promise<Article> {
        const response = await this.request.get(`${this.baseUrl}/api/articles/${slug}`, {
            headers: { Authorization: `Token ${this.token}` },
        });

        if (response.status() !== 200) {
            throw new Error(`Article retrieval failed with HTTP ${response.status()}: ${await response.text()}`);
        }
        const body = await response.json() as { article: Article };
        return body.article;
    }

    async delete(slug: string): Promise<void> {
        const response = await this.request.delete(`${this.baseUrl}/api/articles/${slug}`, {
            headers: { Authorization: `Token ${this.token}` },
        });

        if (response.status() !== 204) {
            throw new Error(`Article deletion failed with HTTP ${response.status()}: ${await response.text()}`);
        }
    }
}
