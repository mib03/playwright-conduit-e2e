import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NavigationPage extends BasePage {
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly settingsLink: Locator;
  readonly yourFeedTab: Locator;
  readonly newArticleLink: Locator;

  constructor(page: Page) {
    super(page);
    this.signInLink = page.getByRole("link", { name: "Sign in" });
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
    this.settingsLink = page.getByRole("link", { name: "Settings" });
    this.yourFeedTab = page.getByText("Your Feed");
    this.newArticleLink = page.getByRole("link", { name: "New Article" });
  }

  async gotoHome() {
    await this.page.goto("/");
  }

  async clickSignIn() {
    await this.signInLink.click();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  async clickSettings() {
    await this.settingsLink.click();
  }
}
