import 'dotenv/config';

function getBaseUrl(name: string, fallback: string): string {
    const value = process.env[name] || fallback;

    try {
        const url = new URL(value);
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

        if (url.protocol !== 'https:' && !(isLocalhost && url.protocol === 'http:')) {
            throw new Error(`${name} must use HTTPS unless it targets localhost. Received: ${value}`);
        }

        return url.toString().replace(/\/$/, '');
    } catch {
        if (value.startsWith('http://') && !value.includes('localhost') && !value.includes('127.0.0.1')) {
            throw new Error(`${name} must use HTTPS unless it targets localhost. Received: ${value}`);
        }

        throw new Error(`${name} must be a valid absolute URL. Received: ${value}`);
    }
}

export const appBaseUrl = getBaseUrl('BASE_URL', 'https://conduit.bondaracademy.com');
export const apiBaseUrl = getBaseUrl('API_URL', 'https://conduit-api.bondaracademy.com');

export function getTestCredentials(): { email: string; password: string } {
    const { TEST_USER_EMAIL: email, TEST_USER_PASSWORD: password } = process.env;

    if (!email || !password) {
        throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set. Copy .env.example to .env.');
    }

    return { email, password };
}
