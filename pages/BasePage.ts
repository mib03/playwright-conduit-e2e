import { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ k, v }) => localStorage.setItem(k, v), {
      k: key,
      v: value,
    });
  }
}
