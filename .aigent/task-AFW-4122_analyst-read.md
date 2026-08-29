# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

You are the Analyst specialist in Aigent. You are not the orchestrator and you are not any other role.
Do only this specialist's job. Do not start a later workflow stage. Do not skip a human gate.
Never merge uat or main. Never develop on sit, uat, or main. Never invent test results.
Do not write files, tests, branches, or Testpad plans.
Do not call Testpad.
End with ONLY a JSON object matching the required analyst contract.
If some lists are empty, still output the JSON. Never skip the JSON object.

Analyze Jira AFW-4122: [React] UTM parameters persisting (Rudderstack events & Lead capture API calls)

Follow these analysis steps:
- Read the ticket before writing cases: Pull the ticket title, description, labels, acceptance criteria, subtasks, linked work items, comments, attachments, images, and details from links inside the ticket. If the label is qa_automation_testplan_only, produce a plan only — do not implement automation. Do not begin coding. Do not stop the plan to ask for BASE_URL, environment, or live test pages — those go in AMBIGUOUS or later Execute Run. If nothing on the ticket is TESTABLE, record AMBIGUOUS items instead of inventing assertions.

Knowledge-base check is required in this analysis. Do not rely on the Jira ticket alone, and do not invent process from memory.
Before restating in-scope vs out-of-scope, search and read:
- Project knowledge: .aigent/knowledge/INDEX.md and the tab folders synced from Data Resources
- Guru cards (if connected): product behavior, constraints, environments, test data, known issues
- Google Docs / Sheets linked in Data Resources or the ticket (if Google is connected)
- Project docs already in the repo (README, AGENTS.md, .cursor/rules, test data, env notes)
Record what you used: Knowledge sources consulted, what they confirmed, and any conflict with the ticket.
If knowledge contradicts the ticket, stop and ask — do not pick a side silently.
If a required knowledge source is missing or not connected, say so. Do not pretend you checked it.
Understand the requirement in that context (business rule, environment, locale, test data, existing automation constraints) before discovery or test-plan writing.

Knowledge-base check is required in this analysis. Do not rely on the Jira ticket alone, and do not invent process from memory.
Before restating in-scope vs out-of-scope, search and read:
- Project knowledge: .aigent/knowledge/INDEX.md and the tab folders synced from Data Resources
- Guru cards (if connected): product behavior, constraints, environments, test data, known issues
- Google Docs / Sheets linked in Data Resources or the ticket (if Google is connected)
- Project docs already in the repo (README, AGENTS.md, .cursor/rules, test data, env notes)
Record what you used: Knowledge sources consulted, what they confirmed, and any conflict with the ticket.
If knowledge contradicts the ticket, stop and ask — do not pick a side silently.
If a required knowledge source is missing or not connected, say so. Do not pretend you checked it.
Understand the requirement in that context (business rule, environment, locale, test data, existing automation constraints) before discovery or test-plan writing.

The knowledge text below was loaded by Aigent. Use it. Do not pretend you searched sources that are not present.


Ticket briefing:
Ticket AFW-4122: [React] UTM parameters persisting (Rudderstack events & Lead capture API calls)
URL: https://purposebrands.atlassian.net/browse/AFW-4122
Status: IN PROGRESS · Type: Story · Labels: abby, mapi, qa_automation_required
Parent: AFW-3458 — Website Scorecard Evolution (Rudderstack + Mixpanel)
Description:
Investigate a method to ensure UTM parameters are persisted across a user’s session.  The UTM parameters should be then included in eventing- Rudderstack events (all events)
- Lead capture API endpoint calls (data properties object)
Determine best practice for persistening UTM params- Is webflow supposed to persist
- session storage
- How to ensure the iframe has it available
- Verify how OTF currently handles this
UTM parameters to expect- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- utm_id
- agency 
← This one might not automatically get recognized by rudderstack?
Subtasks: none
Linked work items: none
Attachments:
- AFW-4122-otf-utm-flow.png (image/png, 184509 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
Conversation / comments:
- Allan Paul Rimando (2026-08-26): Task Overview:Keep the marketing attribution parameters (
utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id, agency
) for the whole visitor session on the Webflow site, and attach them to every RudderStack track/page event and to lead_properties on every lead capture call.Today the parameters only exist on the landing page URL. The RudderStack SDK rebuilds context.campaign from the current URL on every event and ignores agency (no utm_ prefix). The iframes only receive the parent's query string at creation time and in the 
GET_LEAD_PROPERTIES
 reply. After the first navigation to a clean URL both are empty, so almost every lead loses its attribution.Every RudderStack call goes through 
window.safeRSAnalytics -> window.rsAnalyticsQueue -> processAnalyticsQueue
 in head.js, so head.js is the single place to capture, store and attach the parameters.Open Questions:- Is 
per-tab sessionStorage 
the right definition of 
"session"
? It survives reloads and same-tab navigation but not closing the tab or tabs opened with rel=noopener.
- Last-touch replaces the whole set: a later URL with only utm_source=bing drops the stored utm_medium, utm_campaign, etc. Confirm this is intended rather than a per-key merge.
- Should 
agency
 also be sent under 
context.campaign 
for non-Mixpanel destinations? Today it only exists as a key inside the event's properties object (
properties.agency
), the same object that holds 
location_id
 and the other event properties.
- Are the for
…

Project knowledge / Data Resources:
# Project knowledge

Last synced: 2026-08-26T15:55:12.029Z

Files are grouped by Data Resources tab. Read INDEX.md, then the folder that matches the flow or ticket.

## Overview

- [Overview](overview/overview.md) — workbook tab

## Test Data Configurations

- [Test Data Configurations](test-data-configurations/test-data-configurations.md) — workbook tab

## Coverage

- [Coverage](coverage/coverage.md) — workbook tab

## Resources

- [Resources](resources/resources.md) — workbook tab
- [[Webflow / AWS / React] New locale go live checklist](resources/webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
- [[Webflow / AWS / React] New locale go live checklist](resources/webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
- [[Webflow] Cohort Release ProcessProcess](resources/webflow-cohort-release-processprocess-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=863829d3-8081-4f5f-9ba6-2900b9785b2a
- [[Webflow] Publishing Standards](resources/webflow-publishing-standards-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=dc900252-9301-4e11-a232-9c0dbf49fb19
- [[Webflow/React] PROD Release Rollback Steps](resources/webflow-react-prod-release-rollback-steps-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=3ac9de52-a945-4a02-ae9c-9090d2a941bd
- [AF Locales and their business rules](resources/af-locales-and-their-business-rules-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=e46dcd83-72be-4d29-8321-c9934009a0b4
- [AF Pixel Catalog](resources/af-pixel-catalog-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [All Locations Filter Page](resources/all-locations-filter-page-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=3705b207-a939-489b-8f07-12106712a2bd
- [Blog Components](resources/blog-components-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=8be82d95-ec8a-4181-8cd9-97f48aab3195
- [Blog Search](resources/blog-search-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=2fa02ec6-6e23-49a0-a434-3c3b3aba94f6
- [Book a Tour](resources/book-

### coverage/coverage.md
# Coverage

Tab: Coverage

|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | Coverage |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Note: Fields and data can be modified or customized based on the project's specific requirements. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | US | AU | AE | SA | ZA | GB | IE | IN | AT | DE | IT | NZ | PH | SG | TH | ID | FR-CA | EN-CA | VN | KW | EN-MY | ZH-HK | ZH-TW |
|  | Book A Tour Standalone | YES | YES | NO | NO | NO | YES | YES | NO | NO | NO | NO | NO | NO | NO | NO | NO | NO | YES | NO | NO | NO | NO | NO |
|  | Email Club/Contact Us | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES |
|  | CorporateMembership | NO | YES | NO | NO | NO | YES | YES | YES | NO | NO | NO | NO | YES | YES | YES | YES | NO | NO | YES | NO | YES | YES | YES |
|  | Event Book A Tour | NO | YES | NO | NO | NO | YES | YES | NO | NO | NO 

### overview/overview.md
# Overview

Tab: Overview

|  |  |  |
| --- | --- | --- |
|  | Automation Agent Reference Sheet |  |
|  |  |  |
|  | Sheet Tab Names | Definition |
|  | Coverage | This tab contains the locale-specific coverage for each automation flow, making it easy to identify which scenarios are supported in each locale. |
|  | Test Data Configurations | This tab provides the locale-specific configuration required by the automation, including test data, input values, environment-specific settings, and any additional requirements needed for execution. |
|  | Resources | This tab serves as a centralized repository for all project documentation, reference materials, and supporting resources. It contains the information the AI agent needs to understand the project's processes, requirements, framework, architecture, and overall context.  By leveraging these resources, the AI agent can generate more accurate and consistent automation scripts, adhere to established project standards and best practices, and make informed decisions when creating, updating, troubleshooting, or maintaining test automation. This centralized knowledge base helps ensure automation remains reliable, maintainable, and aligned 

### regression-testplans/regression-testplans.md
# Regression Testplans

Tab: Regression Testplans

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
|  | Regression Testplan Template |  |  |  |
|  |  |  |  |  |
|  | Regression ID | Flows | Link | Notes |

### resources/af-locales-and-their-business-rules-aHR0cHM6Ly9h.md
# AF Locales and their business rules

Tab: Resources
Source: https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=e46dcd83-72be-4d29-8321-c9934009a0b4
Updated: 2026-02-26T16:38:40.914Z

Review the following** recorded session and presentation** to understand about differences of different locales in AF site:

[https://drive.google.com/file/d/1nciDmC55ybepDGrAuoO4zv6NaySnjIjl/view](https://drive.google.com/file/d/1nciDmC55ybepDGrAuoO4zv6NaySnjIjl/view)

[https://www.canva.com/design/DAG-UgC559E/LgOe_vrS1Oni5AftaM5eAw/view?utm_content=DAG-UgC559E&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h4578c49c67](https://www.canva.com/design/DAG-UgC559E/LgOe_vrS1Oni5AftaM5eAw/view?utm_content=DAG
…

Output ONLY this JSON:
{
  "testable": true,
  "blocked": false,
  "blockerReason": "",
  "inScope": [
    "..."
  ],
  "outOfScope": [
    "..."
  ],
  "ambiguous": [
    "..."
  ],
  "knowledgeSources": [
    "..."
  ],
  "summary": "one paragraph"
}
Set blocked true only when no TESTABLE requirement can be planned. Missing BASE_URL or live pages is not a blocker — put those in ambiguous.
