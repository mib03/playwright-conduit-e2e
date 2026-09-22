import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../src/fixtures/page-fixtures";

test("@accessibility @smoke Login page has no automatically detectable accessibility violations", async ({
  page,
  navPage,
}) => {
  const accessibilityGateEnabled = process.env.ACCESSIBILITY_GATE === "true";
  test.fail(
    !accessibilityGateEnabled,
    "Accessibility gate is report-only. Set ACCESSIBILITY_GATE=true after known violations are remediated.",
  );

  await navPage.gotoHome();
  await navPage.clickSignIn();

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
