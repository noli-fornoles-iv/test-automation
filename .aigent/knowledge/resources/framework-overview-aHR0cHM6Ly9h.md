# Framework Overview

Tab: Resources
Source: https://app.getguru.com/folders/TBKzdz7c/AF-Automation-?activeCard=4a40f1fd-2843-499b-9ab7-a5a7ff02d620
Updated: 2026-04-08T16:21:39.224Z

The recorded session for this can be reviewed below:

[https://drive.google.com/file/d/1fMqYewyjkvnIlx64dnlScPMDj7nx8-e8/view](https://drive.google.com/file/d/1fMqYewyjkvnIlx64dnlScPMDj7nx8-e8/view)

## **Introduction**
This automation framework is built to provide a scalable, maintainable, and readable way to test the application across multiple environments and locales. It supports behavior-driven development (BDD) for improved collaboration between QA, product, and engineering teams, and enables both local and CI-based execution with detailed reporting.

The framework is designed with the following goals:

- High readability of tests using BDD-style scenarios
- Reusability through a strong Page Object Model (POM) design
- Easy onboarding of new environments and locales
- Seamless integration with Jenkins and Allure reporting
- Clear separation between test logic, page logic, helpers, and utilities

##  Tools And Technologies

| Category | Tool |
| --- | --- |
| Test Runner | Playwright |
| BDD Layer | playwright-bdd |
| Language | TypeScript |
| Assertions | Playwright Test |
| Reporting | Allure, Html |
| CI/CD | Jenkins, Browserstack |
| Version Control | Git |
| Package Manager | npm |
| Report Upload | AWS S3 |

## Project Structure

```
.
├── browserstack.yml                 # BrowserStack config for remote runs
├── Jenkinsfile                      # CI pipeline (install, run tests, upload reports)
├── package.json                     # npm scripts, dependencies, test commands
├── playwright.config.ts             # Playwright config (local runs, reporters, projects)
├── playwright.browserstack.config.ts# Playwright config for BrowserStack runs
├── tsconfig.json                    # TypeScript config
├── README.md                        # Repo overview & quickstart
├── features/                        # Gherkin .feature files (BDD specs)
│   └── **/*.feature                 # Feature groups (e.g., contactUs/, bookATour/)
├── step-definitions/                # Step implementations for features
│   └── **/*.steps.ts                # Uses createBdd(test, { tags })
├── fixtures/                        # Playwright fixtures & test bootstrap
│   ├── base.fixture.ts              # Base test fixture, pages, scenario context
├── pages/                           # Page Objects & modules (BasePage + pages)
│   ├── common/                      # shared pages: BasePage, UserFormPage, etc.
│   └── modules/                     # feature-specific components/pages
├── utils/                           # Helpers, constants, network utils, locale
│   ├── locale-utils/                # translation manager and loaders, test-data and translation keys
│   ├── network-utils.ts             # network intercept/assert helpers
│   └── helpers.ts                   # random data, formatters, helpers
│   └── constants/                   # page urls, leadsource code, workflow names etc constants defined
├── types/                           # Contains interfaces for API and other UI data objects
├── .env.*/                          # .env.prod, .env.sit, .env.uat - environment specific files
├── resources/                       # Localized resources (translations + test-data)
│   └── en-us/
│       ├── translations.json
│       └── test-data.json
├── scripts/                         # utility scripts (prepare-allure-history, etc.)
├── config/                          # env/global setup (global-setup.ts, environment.ts)
├── reports/                         # aggregated reports (archived, custom reports)
├── allure-results/                  # Allure test results (generated at runtime)
├── allure-report/                   # Generated Allure HTML report (output)
├── test-results/                    # Playwright native test results / artifacts
└── other config files               # eslint, commitlint, .github workflows, etc.
```

## POM Design Pattern
The framework adheres to the **Page Object Model (POM)** pattern, abstracting UI interactions into reusable and maintainable components.

### BasePage
`BasePage` contains:

- Shared Playwright utilities (navigation, waits, element helpers)
- `BasePage` provides common helpers:  `get`, `click`, `type`, `clearAndType`, `getText`, `waitForVisible`, `getIframeById`, `takeElementScreenshotIfWebkit`.
All page classes inherit from `BasePage`.

### Shared Pages
Common pages or components (e.g., location search, user forms, book a tour) live under `pages/common/` and are reused across modules. These common pages contain locators and methods specific to that page.

### Modules
Feature-specific pages live under `pages/modules/` and:

- Extend shared/common pages
- Contain only feature-specific logic

This separation ensures UI changes do not require rewriting tests.

## Fixtures And Scenario Context
Built-in fixtures (e.g., `page`, `browser`) are imported directly in tests.

- Fixtures are defined in fixtures (e.g., `base.fixture.ts`).
- Use Playwright's built-in fixtures and custom fixtures via `test.extend`
- Fixtures (e.g., `page`, `browser`) are imported directly in tests.
- Page fixtures instantiate page objects and provide them to steps

### Scenario Context
A shared **scenario context** object is used to:

- Store dynamic values during a scenario (pageName, prospectId, gymAddress)
- Share data between steps without tight coupling
This avoids a global state and keeps scenarios isolated.

## Locale Manager
The locale manager handles:

- Loading translations
- Selecting locale-specific test data
- Injecting localized values into tests
Each locale has its own folder under `resources/`, for example:

- `translations.json` — UI text and labels
- `test-data.json` — locale-specific input data
Tests use translation keys rather than hardcoded strings, allowing the same scenario to run in different languages and regions without changes.

## Constants
Constants provide a centralized location for:

- Page URLs
- Workflow names
- Lead source codes
- GTM event names
- API endpoints
This ensures:

- No magic strings in tests
- Easier updates
- Better consistency across the framework

## Helpers and Network Utils

### Helpers
Contain generic reusable utilities:

- Random data generators
- Date and format helpers
- Normalization helpers
- String and data transformation

### Network Utils
Handle:

- Network interception and assertions
- Extract request and response bodies and response status codes
- Event tracking verification (e.g., GTM, analytics)
Used for robust server-side assertions in addition to UI.

## Writing Tests and Step Definitions

### Adding a Scenario For A New Page
- Create a `.feature` file under `features/`
- Write scenarios using Gherkin (`Given / When / Then`)
- Create a new page under `pages/modules/`
- Extend common or shared page classes from `pages/common/` 
- Define the page URL and all element mappings inside `utils/constants/`
- Define the page object fixture in `fixturs/base.fixture.ts` so it can be used in tests.
- Write reusable step definitions under `step-definitions/`
- Implement steps using page methods, not selectors
Steps should be reusable, business-focused, and independent.

## Tagging & Test Categorization
Tags allow selective execution and reporting:

- `@Smoke` : Covers critical paths, including E2E flows and page navigations from LLP.
- `@Regression` : Covers the full suite, including error scenarios across various components (e.g., location search, user forms), disclaimer text verification, hyperlink validation, as well as E2E flows and page navigations from LLP.
- `@Sprint` : Includes test cases automated during a particular sprint. If a sprint test case involves modifying an existing E2E test, no `@Sprint` tag is added, as it is already covered under `@Smoke` and `@Regression`.
- `@TC-1234` : Test case ID reference for BrowserStack Test Management.
- `@AFW-456` : Jira ticket reference indicating which ticket this automation relates to.
- `@US/@AU/@AE` : Locale-specific tags to indicate which scenarios are applicable for a particular region.
Tags are applied in both local test runs and CI/CD pipelines for controlled execution and reporting. The regression suite is executed on UAT, while the smoke suite is executed on PROD due to limited testing time.

## Reporting & CI
- Jenkins executes tests based on parameters (env, locale, tags)
- Supports Allure and HTML report generation
- Reports are archived on an Amazon S3 bucket and versioned for historical tracking.

## Conventions & Best Practices
- Use `TIMEOUTS` constants for waits.
- Use role-based selectors: `getByRole` when possible.
- Keep assertions in step definitions; keep page actions in page objects
- Use fixture-scoped data for cross-step sharing
- Retry and trace are enabled in playwright.config.ts for flakiness debugging
- Avoid using selectors directly in step definitions — always use page methods.
- Avoid using hardcoded data in tests
- Use robust and stable locators in tests. If a reliable locator is not available, request a `data-testid` from the development team.
- Lint and format with `npm run lint` and `npm run format`.
- Naming Conventions:
- Use **PascalCase** for page objects and classes (e.g., `LocationSearchPage.ts`).
- Use **kebab-case** for all other file names (e.g., `try-us-free.steps.ts`).
- Avoid When–Then chaining in a single Gherkin. Do NOT write:
- When A; Then B; When C; Then D
- 

## Troubleshooting Tips
- **GTM Events Failing:**
- First, check network logs to confirm if the event/tag is being fired.
- Debug manually in Google Tag Manager to verify that the relevant variable is included in the specific tag.
- If the variable or tag is missing, request changes from the PM, as they usually handle GTM container configurations.
- Check `NetworkUtils` logs to track GTM requests and confirm the environment variants
- **Missing Locale Key Errors:**
- Ensure correct usage of `t()` vs `d()`.
- Verify that the key exists in `translations.json` (for translations) vs `test-data.json` (for test data).
- **WebKit-Specific Issues:**
- Use `takeElementScreenshotIfWebkit` and `scrollIntoViewIfWebkit` to handle rendering and visibility issues in WebKit browsers.
- Interaction with elements inside iframes can be particularly tricky in WebKit due to focus and scrolling differences. These helper methods ensure the element is visible and interactable before performing actions or taking screenshots.
- Adjust timeouts to accommodate rendering delays in WebKit.
- **Flaky Tests:**
- Examine Playwright traces.
- Increase timeouts or add retries to stabilize execution.
