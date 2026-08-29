# Repo Local Setup & Running Tests

Tab: Resources
Source: https://app.getguru.com/folders/TBKzdz7c/AF-Automation-?activeCard=d348f489-cc15-49bd-a51d-9adcd915a6a8
Updated: 2026-02-26T15:55:12.422Z

## **Prerequisites**
Ensure the following are installed on your machine:

- Node.js
- VS Code IDE
- Git

## **Repository Setup**
**1️⃣ Clone the repository**

```
git clone 
cd 
```
**2️⃣ Install dependencies**

```
npm install
```
**3️⃣ Install Playwright browsers**

```
npx playwright install
```
**4️⃣ Environment Configuration**
The framework uses environment-specific `.env` files to manage URLs and credentials

The following files **must be created manually in the root**:

```
.env.sit
.env.uat
.env.prod
```
These files are **not committed to the repository. **Each user must create them locally following the structure and keys provided in `.env.example`.

## **Running Tests**
The framework supports:

- Multiple environments (`-env`)
- Multiple locales (`-locale`)
- Feature tagging (`-tag`)
- Multiple execution targets (local / BrowserStack)
All commands now rely on environment variables to dynamically inject values.

## **Core Execution Pattern**
Set environment variables before running the script:

```
//For Smoke, Regressions, Sprint Cases
$env:TAG="US"
$env:NODE_ENV="UAT"
$env:LOCALE="EN-US"
npm run 

//For Feature Specific
$env:TAG="US"
$env:NODE_ENV="UAT"
$env:LOCALE="EN-US"
npm run 
```
**Example:**

```
//Smoke Suite
$env:TAG="US"; $env:NODE_ENV="UAT"; $env:LOCALE="EN-US"; npm run test:multi-locale:smoke

//Regression Suite
$env:TAG="US"; $env:NODE_ENV="UAT"; $env:LOCALE="EN-US"; npm run test:multi-locale:regression

//Feature Specific
$env:TAG="AU"; $env:NODE_ENV="PROD"; $env:LOCALE="EN-AU"; $env:FEATURE="CorporateMembership"; npm run test:multi-locale:feature
```

## **Available Test Commands**

| Purpose | Command | Execution Command |
| --- | --- | --- |
| Smoke Suite | test:multi-locale:smoke | $env:TAG="US"; $env:NODE_ENV="UAT"; $env:LOCALE="EN-US"; npm run test:multi-locale:smoke |
| Regression Suite | test:multi-locale:regression | $env:TAG="US"; $env:NODE_ENV="UAT"; $env:LOCALE="EN-US"; npm run test:multi-locale:regression |
| Sprint Specific Cases | test:multi-locale:sprint20 / test:multi-locale:sprint22 | $env:TAG="US"; $env:NODE_ENV="UAT"; $env:LOCALE="EN-US"; npm run test:multi-locale:sprint20 |
| Feature Specific Execution | test:multi-locale:feature | $env:TAG="AU"; $env:NODE_ENV="PROD"; $env:LOCALE="EN-AU"; $env:FEATURE="CorporateMembership"; npm run test:multi-locale:feature |
| Browserstack Feature Specific Execution | test:multi-locale:feature:bs | npm run test:multi-locale:feature:bs --env=UAT --locale=EN-US --tag=US |
| Generate Allure Report | allure:generate | npm run allure:generate |
| Open Allure Report | allure:open | npm run allure:open |
| Linting & Formatting | lint , lint:fix , format | npm run lintnpm run lint:fixnpm run format |
| HTML Report Generation |  | npx playwright show-report |

## **Supported Parameters**

| Parameter | Purpose |
| --- | --- |
| NODE_ENV | Environment (SIT, UAT, PROD) |
| LOCALE | Language/region (EN-US, EN-AE, EN-AU etc.) |
| TAG | Scenario Locale Tag (US, AU, AE) |
| FEATURE | Feature name Tag (CorporateMembership / MembershipInquiry) |

## Test Data Flow
- Locale determines which resources folder is loaded.
- Environment determines the Base URL and endpoints.
- Tags determine which scenarios are selected.
