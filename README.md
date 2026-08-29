# Playwright Conduit E2E

End-to-end tests for the Conduit RealWorld application using Playwright,
TypeScript, Page Object Model, API authentication, and network mocking.

## Requirements and Installation

- Node.js 20.19 or newer
- npm

```bash
npm install
npx playwright install
Copy-Item .env.example .env
```

Set `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` in `.env` before running tests.
The `.env` file is ignored by Git and must never be committed.

For GitHub Actions, add these repository secrets under **Settings > Secrets and
variables > Actions**:

- `TEST_USER_EMAIL`: email of an existing non-production test account
- `TEST_USER_PASSWORD`: password of that test account
- `BASE_URL`: optional application URL override
- `API_URL`: optional API URL override

Do not put credentials directly in the workflow file. Pull requests from forks
do not receive repository secrets, so authenticated CI tests require a branch
within the repository or a separately configured non-secret test environment.

## Commands

```bash
npm test
npx playwright test tests/scenario2_article.spec.ts
npx playwright test --project=chromium
npm run test:smoke
npm run test:ci
npm run test:destructive
npm run test:firefox
npm run test:webkit
npm run test:mobile
npm run test:api
npm run test:accessibility
npm run test:report
npx playwright test --ui
npx playwright test --list
npx playwright show-report
```

Allure reports:

```bash
npm run allure:generate
npm run allure:open
```

## Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `BASE_URL` | Web application URL | Hosted Conduit URL |
| `API_URL` | API base URL | Hosted Conduit API URL |
| `TEST_USER_EMAIL` | Existing test account email | Required |
| `TEST_USER_PASSWORD` | Existing test account password | Required |

The registration scenario is tagged `@destructive` because it creates a
permanent user in the target environment. CI runs `npm run test:ci`, which
excludes destructive scenarios and uses one worker with up to two retries. Run
`npm test` only against an environment where test data creation is acceptable.

## Structure

```text
playwright-conduit-e2e/
├── pages/
│   ├── ArticlePage.ts
│   ├── BasePage.ts
│   ├── EditorPage.ts
│   ├── LoginPage.ts
│   ├── NavigationPage.ts
│   ├── RegisterPage.ts
│   └── SettingsPage.ts
├── api/
│   ├── ArticlesApi.ts
│   └── AuthApi.ts
├── src/fixtures/page-fixtures.ts
├── tests/
│   ├── scenario1_auth.spec.ts
│   ├── scenario2_article.spec.ts
│   ├── scenario3_mocking.spec.ts
│   ├── api_articles.spec.ts
│   ├── accessibility.spec.ts
│   └── mobile_smoke.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

The architecture is:

```text
Test -> Fixture -> Page Object -> Playwright Page -> Conduit application
```

All Page Objects extend `BasePage`. Shared browser helpers, including
`localStorage` access, are defined once in that base class. Locators prefer
accessible roles and meaningful placeholders.

## Authentication Fixture

`authToken` authenticates through the separated `AuthApi` client using
`POST /api/users/login`, reads the JWT,
registers a `page.addInitScript()` handler, and then opens the home page. The
script places the token in `localStorage` before the application starts, so the
application renders its authenticated state immediately. Each test receives an
isolated browser context.

## Test Scenarios

### Scenario 1: Authentication

File: `tests/scenario1_auth.spec.ts`

**Registers a new user through the UI**

1. Generates unique credentials with Faker.
2. Opens the registration page.
3. Fills and submits the registration form.
4. Verifies authenticated navigation appears afterward.

**Verifies JWT authentication and clears the session on logout**

1. Logs in through the UI.
2. Verifies `Your Feed` is visible and login links are hidden.
3. Verifies `jwtToken` exists in `localStorage`.
4. Logs out from Settings.
5. Verifies logged-out navigation and token removal.

### Scenario 2: Article Lifecycle

File: `tests/scenario2_article.spec.ts`

**Creates, reads, and deletes an article with API-injected authentication**

1. Uses the `authToken` fixture to bypass the login form.
2. Opens the New Article page.
3. Creates an article with a unique title.
4. Verifies the article title and body on the detail page.
5. Deletes the article.
6. Verifies the feed is displayed and the article is no longer visible.

`EditorPage` handles article creation and `ArticlePage` handles detail and
deletion. `ArticlesApi` creates, reads, and cleans up data for isolated
read/delete tests, so the suite demonstrates a hybrid UI/API testing strategy.

### Scenario 3: Network Resilience

File: `tests/scenario3_mocking.spec.ts`

**Tags API returns HTTP 500**

Mocks `GET /api/tags` with status `500`, verifies that status, and confirms the
navigation remains usable. The current application does not render a dedicated
tags error message.

**Articles API is delayed by three seconds**

Delays `GET /api/articles` for three seconds, continues the real request, and
verifies the delay and successful response. The current application does not
render an `.article-preview-loading` element, so the test checks observable
network behavior instead.

**Articles API returns no articles**

Mocks a successful empty article response and verifies the
`No articles are here... yet.` empty state.

## Configuration

`playwright.config.ts` runs the regression suite in Chromium, Firefox, and
WebKit. A focused mobile Chromium project runs tests tagged `@mobile`, and
accessibility checks are tagged `@accessibility`. Local runs use Playwright's
worker allocation; CI uses one worker and up to two retries. Traces are
collected on the first retry. Both HTML and Allure reports are enabled.

CI runs the TypeScript check before the browser suite and uploads the
Playwright HTML report, test artifacts, raw Allure results, and generated Allure
report as one artifact retained for seven days. Retry and worker policy are
configured in `playwright.config.ts`.

The accessibility test currently uses an expected-failure marker because the
hosted application has known violations reported by axe, including color
contrast and missing document landmarks. The scan remains active so the marker
can be removed when the application is fixed.

The project contains 13 logical test cases. The desktop suite runs across
Chromium, Firefox, and WebKit; the mobile smoke test runs on Pixel 5. CI
executes 37 non-destructive test runs, including API, accessibility, and mobile
coverage.
It targets the configured environment:

```text
https://conduit.bondaracademy.com/
```

Hosted application availability or behavior changes can affect results.