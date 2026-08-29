import { test, expect } from '@playwright/test';
import { apiBaseUrl } from '../src/config/test-config';

test.describe('Article API contract', () => {
    test('@api @regression Rejects article creation without authentication', async ({ request }) => {
        const response = await request.post(`${apiBaseUrl}/api/articles`, {
            data: {
                article: {
                    title: 'Unauthorized article',
                    description: 'Should not be created',
                    body: 'No authentication token',
                    tagList: [],
                },
            },
        });

        expect(response.status()).toBe(401);
    });

    test('@api @regression Returns not found for an unknown article', async ({ request }) => {
        const response = await request.get(`${apiBaseUrl}/api/articles/article-that-does-not-exist`);

        expect(response.status()).toBe(404);
    });
});
