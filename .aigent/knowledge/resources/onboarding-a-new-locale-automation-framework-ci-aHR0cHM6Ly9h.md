# Onboarding a New Locale — Automation Framework & CI

Tab: Resources
Source: https://app.getguru.com/folders/TBKzdz7c/AF-Automation-?activeCard=5c220b4a-5d1a-4f6c-8192-648bfc3c6cc2
Updated: 2026-02-26T15:56:11.470Z

This document explains how to onboard a new locale so that automated tests, localized resources, runtime configuration, and Jenkins execution work correctly.

A locale is enabled by:

- Adding localized resources (translations and test data)
- Registering any locale-specific UI behavior
- Tagging applicable scenarios with the correct locale tag
- Passing the locale at runtime when executing tests
- Registering the locale in the Jenkins pipeline so it can be selected and executed

## Overview
Locales are configured dynamically at runtime. The framework uses:

- `LOCALE` (e.g. `EN-US`, `EN-AU`) to:
- Load locale-specific resource files
- Construct the correct `BASE_URL`
- Scenario tags (e.g. `@US`, `@AU`) to:
- Select which scenarios apply to a locale
Both must be configured correctly for a locale to function.

## **Locale & Tag Mapping**

| Locale Code | Scenario Tag |
| --- | --- |
| EN-US | @US |
| EN-AU | @AU |
| EN-AE | @AE |

## **Step-by-Step Guide**

### 1. Create locale resources
Create a new folder:

```
resources//
```
Add:

- `translations.json` — localized UI strings
- `test-data.json` — locale-specific data (location name, location_id,  zip codes, phone formats, etc.)
Resources are loaded dynamically via `LocaleManager` and accessed using:

- `t('key.path')` — translations
- `d('key.path')` — test data

### Current locale folder structure

```
resources/
├── en-us/
│   ├── translations.json
│   └── test-data.json
├── en-au/
│   ├── translations.json
│   └── test-data.json
└── en-ae/
    ├── translations.json
    └── test-data.json
```

### 2. Register locale-specific UI behavior (if needed)
If UI behavior differs for the locale (different fields, consent flows, optional elements), update:

```
utils/locale-utils/locale-element-map.ts
```
This keeps test logic clean and avoids locale-specific branching in steps.

### 3. Handle missing or optional keys
If a key is intentionally not present for a locale, add it to:

```
utils/locale-utils/locale-keys-skip.ts
```
⚠️ Missing keys otherwise cause runtime errors.

### 4. Add new translation keys (if required)
If new translation keys are introduced:

- Add them to:

```
utils/locale-utils/translations-keys.constants.ts
```
- Add values in every locale’s `translations.json` and if it is not applicable for a certain locale, add it to `locale-keys-skip.ts`

### 5. Add or adjust test-data keys
If you introduce new test-data keys:

- Register them in:

```
utils/locale-utils/test-data-keys.constants.ts
```
- Access them using `d(...)`

### 6. Tag applicable scenarios
Tag each scenario with the locale(s) it applies to:

```
@US @AU @AE
Scenario: Successful form submission in Contact Us
```
Tags determine which scenarios run for each locale.

### 7. Run and verify locally
Run tests by passing `LOCALE` and filtering by tag:

```
npm runtest:multi-locale:smoke --env=sit --locale=EN-AE --tag=@AE
```

### 8. Verify runtime behavior
Confirm that:

- `t(...)` resolves localized strings correctly
- `d(...)` loads locale-specific data
- `BASE_URL` is constructed correctly for the locale
- Tagged scenarios execute as expected

## Onboarding a New Locale in Jenkins
When a new locale is added to the framework, Jenkins must also be updated so the locale can be selected and executed via the pipeline.

### 1. Add the locale to the build parameters
Update the `LOCALE` parameter so users can select the new locale when triggering the job.

**File:** `Jenkinsfile`

**Section:** `parameters`

Example:

```
choice(
    name: 'LOCALE',
    choices: ['EN-US', 'EN-AU', 'EN-AE', 'AR-SA'],
    description: 'Select Locale to run tests against'
)
```
Add your new locale (e.g. `AR-SA`) to the list.

### 2. Add the locale-to-tag mapping
Update the locale-to-tag mapping so the correct scenario tags are used.

**File:** `Jenkinsfile`

**Section:** `Run Tests` stage

Example:

```
def localeTagMap = [
    'EN-US': 'US',
    'EN-AU': 'AU',
    'EN-AE': 'AE',
    'AR-SA': 'SA'
]
```
This ensures:

- `AR-SA` runs only scenarios tagged with `@SA`
- The correct subset of tests is executed per locale

## Summary
A locale is fully onboarded when:

- It has localized resource files
- It has applicable scenario tags
- It runs successfully via runtime parameters locally
- It is selectable and runnable from Jenkins
No `.env` changes are required.
