# Playwright End-to-End & API Mocking Framework (Conduit RealWorld App)

![Playwright Tests](https://github.com/mib03/playwright-conduit-e2e/actions/workflows/playwright.yml/badge.svg)
![Playwright Version](https://img.shields.io/badge/playwright-v1.40+-green)
![TypeScript](https://img.shields.io/badge/typescript-v5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

Automated End-to-End (E2E) test suite for the Conduit RealWorld Application, built with **Playwright**, **TypeScript**, and **GitHub Actions**. 

This framework demonstrates production-grade test automation architecture, prioritizing modularity, high execution efficiency, and robust UI resilience testing.

---

## Key Framework Features

* **Page Object Model (POM) Architecture**
  Clean abstraction layer separating UI locators/actions (`/pages`) from execution logic and assertions (`/tests`).
* **Fast Authentication State Injection (API Bypass)**
  Accelerates test execution by ~80% by bypassing slow UI login forms and directly injecting JWT tokens into browser `localStorage` via API requests (`page.addInitScript`).
* **Network Interception & API Mocking (`page.route`)**
  Simulates frontend resilience against backend failure modes—such as **500 Internal Server Error**, empty states, and validation errors—without modifying database state.
* **Automated CI/CD Pipeline**
  Fully integrated GitHub Actions workflow running headless Chromium tests on every `push` or `pull_request` to the `main` branch.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Playwright** | Core E2E Testing Framework |
| **TypeScript** | Strongly Typed Automation Scripting |
| **Faker JS (`@faker-js/faker`)** | Dynamic Data Generation |
| **GitHub Actions** | CI/CD Automated Execution |

---

## Project Structure

```text
playwright-conduit-e2e/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI/CD GitHub Actions Pipeline
├── pages/                         # Page Object Model Layer
│   ├── ArticlePage.ts             # Article detail view & deletion
│   ├── EditorPage.ts              # Article creation form
│   ├── LoginPage.ts               # Login form interactions
│   ├── NavigationPage.ts          # Global header & navigation links
│   ├── RegisterPage.ts            # Registration form interactions
│   └── SettingsPage.ts            # Settings page & logout actions
├── tests/                         # Test Execution & Assertion Layer
│   ├── scenario1_auth.spec.ts     # Registration, UI Login, JWT Validation & Logout
│   ├── scenario2_article.spec.ts  # CRUD Operations (API Bypass Login)
│   └── scenario3_mocking.spec.ts  # Network Interception (500 Error & Empty States)
├── package.json                   # Dependencies & Scripts
├── playwright.config.ts           # Playwright Test Runner Config
└── README.md                      # Project Documentation
```

---

## Local Setup & Execution

### 1. Clone Repository
```bash
git clone [https://github.com/mib03/playwright-conduit-e2e.git](https://github.com/mib03/playwright-conduit-e2e.git)
cd playwright-conduit-e2e
```

### 2. Install Dependencies & Browsers
```bash
npm install
npx playwright install --with-deps
```

### 3. Run Tests

* **Run all tests in Headless Mode:**
  ```bash
  npx playwright test
  ```

* **Run tests in Interactive UI Mode:**
  ```bash
  npx playwright test --ui
  ```

* **Run a specific test file:**
  ```bash
  npx playwright test tests/scenario2_article.spec.ts --ui
  ```

### 4. View Test Reports
```bash
npx playwright show-report
```

---

## Test Scenarios Overview

1. **Scenario 1: Authentication & User Session Management (`scenario1_auth.spec.ts`)**
   * Validates registration flow using dynamic Faker data.
   * Verifies login functionality and inspects browser `localStorage` for JWT token presence.
   * Tests logout mechanism and verifies session token invalidation.

2. **Scenario 2: Article Lifecycle with State Injection (`scenario2_article.spec.ts`)**
   * Bypasses UI login by making a direct `POST` request to the auth API endpoint.
   * Injects the returned JWT into local storage prior to navigation.
   * Executes complete CRUD lifecycle (Create, Read, Delete article).

3. **Scenario 3: Network Interception & Fault Tolerance (`scenario3_mocking.spec.ts`)**
   * Mocks `/api/articles` endpoints using `page.route()`.
   * Verifies empty feed UI messaging when backend returns 0 records.
   * Verifies frontend fault tolerance and fallback behavior during `500 Internal Server Error` scenarios.

---

## 👤 Author

* **GitHub:** [@mib03](https://github.com/mib03)
