import { faker } from '@faker-js/faker';
import { ArticleInput } from '../../api/ArticlesApi';

export function createArticleData(tag = 'playwright'): ArticleInput {
    return {
        title: `Playwright article ${faker.string.alphanumeric(10)}`,
        description: 'Article creation test description',
        body: 'Article creation test body',
        tagList: [tag],
    };
}
