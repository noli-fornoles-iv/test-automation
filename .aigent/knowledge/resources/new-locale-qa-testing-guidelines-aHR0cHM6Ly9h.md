# New Locale – QA Testing Guidelines

Tab: Resources
Source: https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=dde34852-fd07-4280-a78b-8b5c0075990a
Updated: 2026-08-03T12:56:05.506Z

This document outlines the standard QA process for onboarding a new locale, including TestPad setup, validation activities, bug reporting, and automation requirements.

# 1. Initial TestPad Setup for a New Locale

## Create the TestPad Folder Structure
Within the **SIT** folder in TestPad:

- Create a folder named after the **Cohort**.
- Inside the Cohort folder, create another folder named after the **Locale**.

### Example

```
SIT└── Cohort Name    └── Locale Name
```

## Locale Onboarding Tickets
When a new locale is onboarded, the following QA tickets are typically created:

- Webflow Spin-Up
- React Spin-Up
- Other Locale Onboarding Tickets

# 2. Webflow Spin-Up QA Process

## Test Plan Setup
- Duplicate the **Webflow Spin-Up Test Plan**:
- [https://outliantteam.testpad.com/script/27027](https://outliantteam.testpad.com/script/27027)
- Save the duplicated TestPad under the locale folder created during setup.

## Validation
Review the **Locale Inventory Sheet** to identify which pages should be:

- Enabled
- Drafted
- To get the source of truth to check the enabled pages per locale, refer to AF locale inventory sheet
[https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=649182224#gid=649182224](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=649182224#gid=649182224)

## Major QA Checks
Perform the following validations:

- Verify all enabled and drafted pages are configured correctly.
- Confirm every page loads successfully without errors.
- Verify header and footer links are correct and localized.
- Validate navigation and internal links.
- Verify page accessibility.
- Validate across supported browsers.
- Validate across supported screen sizes and viewports.

## Bug Reporting
Report issues including, but not limited to:

- Incorrect page status (Enabled/Drafted)
- Pages failing to load
- Broken or incorrect header/footer links
- Localization issues
- Content inconsistencies
- Navigation defects
- UI or functional defects

## QA Automation Requirements
No automation updates are required during Webflow Spin-Up.

# 3. React Spin-Up QA Process

## Test Plan Setup
- Duplicate the **React Spin-Up Test Plan**:
- [https://outliantteam.testpad.com/script/25380](https://outliantteam.testpad.com/script/25380)
- Save the duplicated TestPad under the locale folder.
- Update the test pad plan as per your locales

## Validation
Review the **Locale Inventory Sheet** to identify which React flows should be:

- Enabled
- Drafted
- To get the source of truth to check the flows enabled per locale, refer to AF locale inventory sheet
[https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=649182224#gid=649182224](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=649182224#gid=649182224)

## Major QA Checks
Perform the following validations:

- Verify every applicable React flow functions correctly end-to-end (E2E).
- Use AF Test Gyms for validation.
- Verify all GTM events fire correctly.
- Validate React forms against the React Components documentation.
- Verify:
- Form validations
- Error handling
- User interactions
- Locale-specific translations
- Content
- Responsive layouts
- Cross-browser compatibility

## Bug Reporting
Report issues including:

- React flow failures
- End-to-end failures
- GTM event issues
- Form validation issues
- Submission failures
- UI defects
- Localization issues
- Unexpected behavior

## QA Automation X QA manual

## QA Automation Requirements

### React Flow Coverage
Add all enabled and drafted React flows to:

**AF Automation → Coverage**

[**AF Automation - Google Sheets**](https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit?gid=520425843#gid=520425843)** **

### Locale Test Data
Add locale-specific test data to:

**AF Automation → Local Config**

[**AF Automation - Google Sheets**](https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit?gid=1767796336#gid=1767796336)

After the automation for react spin up is run for the locale,

- relevant Automation QA will send a Playwright report. 
- Manual QA will 
- Update the test plan report
- Add the report against the ticket
- Ensure test coverage
- Report any bugs/failed scenarios in Jira and get them resolved.

# 4. React Update QA Process

## Test Plan Setup
No TestPad is required.

## Validation
Identify every React flow impacted by the implementation.

## Major QA Checks
- Validate all affected React flows.
- Perform regression testing on at least **1–2 additional locales**.
- Verify applicable regression scenarios.
- Ensure unaffected React flows continue working as expected.

## Bug Reporting
- Report implementation-related bugs in the current Jira ticket.
- Report unrelated React issues against the **React Spin-Up** ticket.
- Report regressions caused by the implementation in the current React Update ticket.

## QA Automation Requirements
TBD

# 5. Webflow Update QA Process

## Test Plan Setup
No TestPad is required.

## Validation:
- The requested implementation.
- The complete Webflow page.

## Major QA Checks
- Verify the requested implementation.
- Validate the entire page across supported browsers.
- Validate responsive layouts.
- Verify all CTA redirects.
- Validate page content.
- Verify translations.
- Perform regression testing of the page.

## Bug Reporting
- Bugs related to the implementation.
- Additional issues found while testing the page.

## QA Automation Requirements
No automation changes are required unless specified by the ticket.

# Navbar and footer tickets:
- Duplicate the nav bar/footer test plans in test pad:
- [template link for nav bar](https://outliantteam.testpad.com/script/27029)
- [template link for footer](https://outliantteam.testpad.com/script/27026)
- Save the duplicated TestPad under the locale folder.

## Validation:
- The footer/nav bar links per locale
- To get the source of truth to check the links enabled per locale, refer to AF locale inventory sheet
[https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=649182224#gid=649182224](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=649182224#gid=649182224)

## Major QA Checks
- Verify the links are working fine across website pages
- Verify the links UI on different viewports and browser
- Verify all navigation bar and footer links.
- Verify navigation functionality and user interactions.

## Bug Reporting
- Bugs related to the nav bar and footer links.

## QA Automation Requirements
No automation changes are required unless specified by the ticket.

# 6. Webflow Pages Without Existing Jira Tickets

## Test Plan Setup
No TestPad is required.

## Initial Jira Setup
For every Webflow page that does not have its own Jira ticket:

- Create a sub-task with the page title under the **Webflow Spin-Up** ticket.
- Use AI to generate a brief validation checklist.
- Add the Jira ticket to the **Pages** tab in the Locale Inventory Sheet.
[https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=603517496#gid=603517496](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=603517496#gid=603517496)

## Validation
Review the entire page.

## Major QA Checks
- Validate across supported browsers.
- Validate responsive layouts.
- Verify CTA redirects.
- Verify page content.
- Verify translations.

## Bug Reporting
Report all issues found during validation.

## QA Automation Requirements
No automation changes are required.

# 7. Local Offer QA Process

## Test Plan Setup
- Duplicate the **Local Offer Test Plan**:
- [https://outliantteam.testpad.com/script/27028](https://outliantteam.testpad.com/script/27028)
- Save the duplicated TestPad under the locale folder.

## Validation
Update the duplicated test plan with the correct local offer information.

## Major QA Checks (if local offer is not tested through automation)
- Validate the Local Offer implementation.
- Verify all associated React flows.
- Validate content and translations.
- Verify form submissions.
- Validate GTM events (if applicable).
- Verify responsive layouts and browser compatibility.

## Bug Reporting
Report all issues related to the Local Offer implementation in the corresponding Jira ticket.

## QA Automation Requirements
- Create the Local Offer TestPad.
- Attach the completed TestPad to the Jira ticket.
- Update:
**AF Automation → Tickets**

h[ttps://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit?gid=1149441561#gid=1149441561](https://app.getguru.com/card/i8ERXKbT/New-Locale-Testing-guidelines#jkS11YhznE4J)

**Note for the manual QAs:**

Whenever you make any change in the AF automation sheet, ask the relevant automation engineer to sync the data in code

# **Localization Content Automation:**
For localization content automation, Update the following sheet and add the locale Static pages:

- Create a new tab with the locale identifier of your locale
- Follow the format as per previous sheets
- Add all the static URLs in that sheet
**URL -> <Locale identifier>**

[https://docs.google.com/spreadsheets/d/1fP8AJ_t3gybSDdYfrFXmoHWYYHVaiZJtW3c_xma0dqE/edit?gid=1324770473#gid=1324770473](https://docs.google.com/spreadsheets/d/1fP8AJ_t3gybSDdYfrFXmoHWYYHVaiZJtW3c_xma0dqE/edit?gid=1324770473#gid=1324770473)

# 9. Pre-Launch QA Checklist

## Test Plan Setup
- Duplicate the** pre-launch test plan**
- [https://outliantteam.testpad.com/script/25379#//](https://outliantteam.testpad.com/script/25379#//)
- Save the duplicated TestPad under the locale folder.

## Validation
Validate the production-ready implementation before launch.

## Major QA Checks
- Verify all planned tickets are deployed.
- Complete regression testing for impacted functionality.
- Validate critical user journeys.
- Verify GTM events.
- Verify production configuration.
- Validate redirects.
- Confirm translations.
- Perform smoke testing.
- Check for locale inventory sheet as a source of truth for validating the different website flows and content:
- [https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=603517496#gid=603517496](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=603517496#gid=603517496)

## Bug Reporting
Report any release blockers immediately.

Log all remaining issues according to severity.

## QA Automation Requirements
Ensure all required automation updates are completed before launch.

# 9. Post-Launch QA Checklist

## Test Plan Setup
No TestPad required.

## Validation
Validate the production environment after deployment.

## Major QA Checks
- Perform production smoke testing.
- Validate critical user journeys.
- Verify forms submit successfully.
- Verify GTM events.
- Verify production redirects.
- Confirm translations.
- Check browser console for errors.
- Monitor for launch regressions.

## Bug Reporting
Report production issues immediately according to severity and follow the Hypercare process.

## QA Automation Requirements
Update automation data if production behavior differs from SIT or if new production configurations need to be documented.

# L**ocale Onboarding – Manual QA to Automation Handoff**
[https://docs.google.com/document/d/13ePzXsF31WkCrL5QzbUsl6kadrmIpo00cY0chdAT3PY/edit?tab=t.0#heading=h.9m52luz25s2n](https://docs.google.com/document/d/13ePzXsF31WkCrL5QzbUsl6kadrmIpo00cY0chdAT3PY/edit?tab=t.0#heading=h.9m52luz25s2n)
