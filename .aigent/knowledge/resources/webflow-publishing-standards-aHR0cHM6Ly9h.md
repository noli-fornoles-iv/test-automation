# [Webflow] Publishing Standards

Tab: Resources
Source: https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=dc900252-9301-4e11-a232-9c0dbf49fb19
Updated: 2026-06-12T19:21:11.764Z

Made in response to Own a Gym page incident: [06/08/2026 RCA: Own a gym page](https://purposebrands.atlassian.net/wiki/x/AQA_cwE)

## Purpose
This SOP defines the improved operating procedures for Webflow publishing, with a focus on reducing accidental publish/draft errors across locales, improving release accountability, and establishing both manual and automated safeguards.

The scope of this SOP is limited to **Webflow publishing workflows**, including page status verification, cohort ownership, release checks, RCA response expectations, and future automation support.  Additional steps related to Crowdin publishing can be found in the Crowdin documentation outside of this document.

# Key Operating Outcomes

## 1. Publishing Accuracy Safeguards

### Outcome
Developers must verify that Webflow page publish/draft states match the expected source of truth before and during production publishing activities.

This is intended to prevent accidental drafting or publishing of pages across unintended locales, especially when working from secondary locales or shared page settings. The AF Local Inventory spreadsheet is the operational source of truth for determining whether a page should be published or drafted for each locale.

### Manual Check: Page Publication Status Check
**When to perform this check:**

- When working on any Webflow page that exists across multiple locales.
- Before publishing a page to production.
- During major production releases.
- When updating page settings, localization settings, or branch content.
- When a page has recently been touched by multiple developers.
**Steps:**

- Open the relevant page in Webflow.
- Navigate to the page settings area.
- Review the localization publication settings at the bottom of the page settings panel.
- Confirm which locales are currently published and which are drafted.
- Cross-reference the status against the AF Local Inventory spreadsheet.
- If a page is published or drafted unexpectedly, pause the release and flag the discrepancy to the team.
- Determine if the discrepancy is due to:
- Webflow designer publish is incorrect
- AF Locale inventory is incorrect
- Do not assume the current Webflow state is correct unless it matches the inventory and related ticket expectations.
**Reference documentation:**

- AF Local Inventory spreadsheet ([link here](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=603517496#gid=603517496))
- Relevant Jira tickets for the locale/page
- Webflow page settings and localization settings

## 2. Cohort Ownership Accountability

### Outcome
Each Webflow cohort or locale group must have a clearly assigned developer owner. This ownership is established when the first spin-up Jira ticket for that cohort is assigned.

The cohort owner is not responsible for personally completing every ticket in the cohort. Instead, they are accountable for ensuring that the cohort has a clear operational owner for publication accuracy, inventory alignment, and ticket traceability.

### Ownership Assignment
Cohort ownership begins when the first Jira ticket for a new locale or cohort spin-up is assigned.

The assigned cohort owner is responsible for:

- Understanding the expected page set for the cohort.
- Confirming that relevant pages are represented in the AF Local Inventory.
- Ensuring Jira ticket references are added to the inventory where applicable.
- Watching for unclear, missing, or conflicting publish/draft expectations.
- Acting as the primary developer point of accountability for publication accuracy within that cohort.
- Raising discrepancies early when Webflow state, Jira scope, or inventory expectations do not align.

### Current Ownership Model
The initial ownership structure discussed was:

- Siam: Austria
- Mariana: French Canada
- Jojo: Germany and Canada English, with support from Siam where Canada tickets overlap
These assignments may change as workload shifts, but each active cohort should have a clear owner before major Webflow setup or publishing work begins.

**Reference documentation:**

- Cohort assignment tracker
- AF Local Inventory spreadsheet
- Jira tickets for the cohort
- Production release checklist

## 3. Production Release Publishing Checks

### Outcome
Production releases must include an additional Webflow publishing smoke test, especially for high-risk pages or pages shared across locales.

The intent is not to duplicate QA, but to add a developer-owned release safety layer focused on Webflow publication state.

### Manual Check: Production Publish Smoke Test
**When to perform this check:**

- Before major production releases.
- Before locale launch or DNS cutover.
- When publishing high-impact shared pages.
- When releasing pages that were recently drafted, restored, localized, or touched across multiple locales.
**Steps:**

- Identify the pages included in the release.
- Open each relevant page in Webflow.
- This can be split between developers. 
- Review localization publication settings.
- Confirm each locale’s publish/draft state against the AF Local Inventory ([link here](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=603517496#gid=603517496))
- Confirm the page has an associated Jira ticket where applicable.
- Confirm no unrelated locales were affected.
- Flag discrepancies before proceeding with release.

## 4. Component and Branch Freshness

### Outcome
Developers must confirm they are working from the latest component and branch state before making Webflow updates.

This helps prevent outdated branches or components from overwriting newer global updates.

### Manual Check: Branch and Component Update Check
**When to perform this check:**

- At the start of Webflow development work.
- Before editing shared components such as navigation, footer, or reusable page sections.
- Before publishing branch changes.
- When multiple developers have recently touched related areas.
**Steps:**

- Open the active Webflow branch.
- Check whether component updates are available.
- Pull the latest component updates before making changes.
- Confirm shared components are current.
- Proceed with updates only after the branch is aligned with the latest source state.
**Reference documentation:**

- Webflow branch interface
- Webflow component update indicators
- Related Jira tickets

## 5. Automated Publication Discrepancy Checks

### Outcome
The team will pursue an automation script to act as a fail-safe against human error.

The proposed automation should compare actual Webflow or live-site publication status against the AF Local Inventory source of truth and flag discrepancies.

Ticket: [https://purposebrands.atlassian.net/browse/AFW-3423](https://purposebrands.atlassian.net/browse/AFW-3423)

### Proposed Automation Scope
The automation should evaluate:

- Which pages are expected to be published or drafted by locale.
- Whether the current Webflow or live-site state matches the inventory.
- Whether high-priority page types, such as gym templates and key static pages, are incorrectly missing or live.
- Whether differences should be reported to the team through a spreadsheet, Slack notification, or similar output.

### Proposed Inputs
- AF Local Inventory spreadsheet as the source of truth.
- Webflow API, sitemap, or another validated publication-status source.
- Optional page identifiers such as Webflow page ID, locale, slug, and page type.

### Proposed Output
- A discrepancy report showing expected status vs. actual status.
- Clear flags for pages that appear unintentionally drafted or published.
- A recommended cadence, such as daily checks, publish-triggered checks, or both.

### Documentation to Create
- Technical specification for the automation approach.
- Source-of-truth inventory requirements.
- Maintenance instructions for any spreadsheet fields required by the script.

## 6. Webflow Peer Review Process
Update: Team has chosen to not implement a peer review process at this time.  The peer review  would not solve for the publishing issues presented in Q2 2026 - which stem largely from misunderstandings or incorrect use of publishing features.  A peer review is intended for quality checks on work completed and not for publish status.

### Outcome
The team will further evaluate a buddy-system peer review process for Webflow updates.

The goal is to add a second set of eyes for high-risk Webflow changes without creating unnecessary process overhead for every small ticket.

### Needs Further Discussion
The team still needs to define:

- Which ticket types require peer review.
- Whether all production-bound Webflow tickets require review or only high-risk tickets.
- Whether review should happen by cohort buddy, full team, or assigned reviewer.
- How reviews should be documented.
- How the process can work with high ticket volume.

### Potential Review Candidates
Peer review may be most useful for:

- Locale setup tickets.
- Shared component updates.
- Global page setting changes.
- Page publish/draft changes.
- High-volume production releases.
- Tickets touching pages across multiple locales.
- Tickets involving local inventory updates.

## 8. RCA Response Procedure for Publishing Incidents

### Outcome
When a Webflow publishing incident occurs and an RCA is requested, the team must switch into an immediate collaborative response model.

The goal is to reduce asynchronous delays and produce a timely RCA draft or preliminary update.

### RCA War Room Procedure
**When to use this process:**

- When the client requests an RCA.
- When a publishing issue impacts live pages.
- When multiple locales are affected.
- When the issue requires investigation across Webflow, tickets, inventory, or release history.
**Steps:**

- The first person who sees the RCA request starts a Google Meet.
- Add relevant Webflow developers, Andrew, Arbaz, and other required stakeholders.
- Treat the meeting as a working war room.
- Pause unrelated work where needed.
- Draft the RCA collaboratively in real time.
- If final root cause details are not available within the requested timeline, send a preliminary update with known facts, estimates, and a timeline for further details.

### RCA Communication Standard
If the final RCA cannot be completed within the initial requested deadline:

- Share what is currently known.
- Clearly label any details that are still estimates.
- State what the team is still investigating.
- Provide a timeline for when more complete details will be shared.
- Avoid waiting silently until all details are confirmed.
