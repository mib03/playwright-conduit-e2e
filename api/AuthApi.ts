import { APIRequestContext } from '@playwright/test';

export type Credentials = {
    email: string;
    password: string;
};

export class AuthApi {
    constructor(
        private readonly request: APIRequestContext,
        private readonly baseUrl: string,
    ) { }

    async login(credentials: Credentials): Promise<string> {
        const response = await this.request.post(`${this.baseUrl}/api/users/login`, {
            data: { user: credentials },
        });

        if (response.status() !== 200) {
            throw new Error(`Login failed with HTTP ${response.status()}: ${await response.text()}`);
        }

        const body = await response.json() as { user?: { token?: string } };
        const token = body.user?.token;

        if (!token) {
            throw new Error('Login response did not contain a JWT token.');
        }

        return token;
    }
}
