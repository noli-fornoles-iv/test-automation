# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

Derive a reviewable test plan for Jira AFW-4122: [React] UTM parameters persisting (Rudderstack events & Lead capture API calls)
Ticket: https://purposebrands.atlassian.net/browse/AFW-4122

Work ONLY from this message. Do not use tools. Do not read the repository. Do not call Testpad.
This plan is for manual testers first. Do not write automation. Do not copy a regression template.
Use every section of the briefing: description, subtasks, linked work items, comments, attachments, images, and pages fetched from links in the ticket.
If linked tickets describe event properties or exclusions, those are requirements. Do not invent values they do not state.

You are writing a reviewable test plan for BOTH manual testers and later automation.
Follow qa-bot TicketPlanner. Do not invent coverage. Do not write automation. Do not duplicate a regression template.

Requirement quality gate (do this BEFORE writing any scenario):
Break the ticket, acceptance criteria, subtasks, linked work items, comments, and fetched links into atomic requirements. Classify each:
- TESTABLE — an objective, observable expected result is stated. Write a scenario and set requirement to that atomic item.
- AMBIGUOUS — a change is requested but the expected result is not defined. Do not invent an assertion. Record a specific clarification question with the plausible interpretations.
- NOT STATED / EXCLUDED — an implementation detail you could infer, or an item the ticket lists as out of scope (except for X). Record it with the reason. Never assert it as a pass/fail case.
- BLOCKED — meaning depends on an unresolved ambiguity. Record what it depends on.
Context beats keywords. Words like update/fix/correct/properly are signals, not automatic blocks, if the surrounding text already gives an expected result.
Classify independently: one ambiguous item must not stop scenarios for the clear ones. A partial plan is useful.
Never infer implementation. Ticket metadata (reporter, priority, email fields) is not an assertion.
Quoted or backticked names (`Experiment Viewed`) are exact expected values — use them verbatim.
If the title is an automation task ('Automate tests for X'), plan X — the product behaviour — not the act of automating.
Linked work items (relates to / tests / blocks) are in-scope requirements when they state an observable result.

Scope:
- Plan ONLY what this ticket's change implies. This is a client-change plan, not a full regression suite.
- Right-size: typically 2–6 scenarios (max 8). A one-line copy change needs a few cases, not a suite.
- Split 'and' when it joins two behaviours (event trigger AND property persistence). Keep quoted phrases as one item.
- Do not duplicate existing automation found in discovery unless this change invalidates it.
- Do not assume checkout, payment, account creation, or production mutation.

How to write each scenario (manual testers will execute these rows in Testpad):
- One scenario = one behaviour. Split unrelated checks.
- Every scenario MUST include Given (state), When (action), and Then (observable assertion). And/But as needed.
- Verify the user-visible or analytics end state, never the diff or implementation (no ACF/DB/CSS/class/id assertions).
- Include the negative when something is renamed, removed, or replaced: one scenario that the old state is gone.
- Enumerate listed items; never merge or drop them. Split comma lists. Treat quoted phrases as one item.
- Assert exact text from the ticket, verbatim. Never paraphrase, re-case, or truncate expected copy.
- No generic scenarios. Never restate the Jira summary as Feature, Scenario title, and Then. Never use 'perform the action described in this requirement', 'exercise the behaviour', 'page looks good', or 'verify each X'.
- Links/CTAs assert both visible label and destination URL/path when the ticket gives one.
- Absence checks are page-scoped ('X is not visible on the page'), not region-scoped, unless the ticket requires coexistence.
- Interactive content (accordion, tab, dropdown, hover) needs an explicit When step before the assertion.
- Assert content, not markup structure, unless the ticket requires a specific structure.
- Steps stay atomic. No compound steps. No judgment-only steps. No @tags.
- Each scenario is independent: include the setup it needs.
- Media/SEO/responsive scenarios only when the ticket states them (exact title, meta, single H1, alt/caption, viewports).

Output contract: your FINAL message must be ONLY this JSON (no Testpad API, no files, no Gherkin dump outside JSON):
{ "feature": "short product title — not the automation task wording", "scenarios": [{ "title": "one behaviour", "steps": ["Given …", "When …", "Then …"], "requirement": "atomic TESTABLE requirement" }], "ambiguous": [{ "requirement": "…", "ambiguity": "…", "clarification": "specific question" }], "excluded": [{ "requirement": "…", "reason": "…" }], "blocked": [{ "requirement": "…", "dependsOn": "…" }] }
scenarios covers TESTABLE requirements only. Other arrays may be empty. At least one scenario OR one ambiguous/blocked item is required.
Aigent writes this JSON into Testpad as Feature / Scenario / Given-When-Then. Do not POST a new script.

Invalid (never output this shape): Feature, Scenario title, and Then all repeat the Jira summary, and When is 'perform the action described in this requirement'.
Valid: short product feature title; one scenario per TESTABLE behaviour; Given / When / Then; quoted names verbatim; except-for items in excluded.

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

Output ONLY the JSON object. No STEP lines. No GATE line. No markdown except a ```json fence if needed.

Analyst contract (do not contradict):
{
  "testable": true,
  "blocked": false,
  "inScope": [
    "Marketing attribution query parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id, agency) remain available for the visitor session after the landing URL is no longer in the address bar (same-tab navigation and reload scenarios called out in engineering notes).",
    "All RudderStack analytics events routed through window.safeRSAnalytics → window.rsAnalyticsQueue → processAnalyticsQueue in head.js include persisted UTM/campaign attribution (not only values rebuilt from the current page URL).",
    "Lead capture API requests include persisted attribution in the data/lead properties object (lead_properties / GET_LEAD_PROPERTIES reply path for embedded iframes), including after parent navigates away from the initial UTM landing URL.",
    "Regression checks that iframe embeds receive parent-stored attribution when the parent query string is empty post-navigation (OTF flow per attachment AFW-4122-otf-utm-flow.png and comment).",
    "Verification that agency is present on events/API payloads per implemented design (properties.agency and/or context.campaign if product confirms).",
    "Label qa_automation_required: plan automation coverage for observable network/SDK payloads (RudderStack track/page and lead capture calls), not implementation in Analyst stage."
  ],
  "outOfScope": [
    "Implementing persistence in head.js, Webflow, or React (development work on the story).",
    "Parent epic AFW-3458 full scorecard/Mixpanel migration scope except UTM persistence behavior tied to this story.",
    "Choosing architecture (Webflow vs sessionStorage vs iframe propagation)—ticket asks investigation; QA validates agreed solution only.",
    "Locale-by-locale business rules from AF Locales Guru unless a specific flow/locale is named on the ticket (ticket is site-wide attribution, not a single Coverage row).",
    "Testpad plan creation, branch creation, and execution with invented pass/fail results.",
    "Merging or developing on sit, uat, or main branches."
  ],
  "ambiguous": [
    "No formal acceptance criteria on the ticket; test assertions must follow product sign-off on open engineering questions (last-touch replaces entire UTM set vs per-key merge; session = per-tab sessionStorage vs other definition).",
    "agency in context.campaign for non-Mixpanel RudderStack destinations vs properties.agency only—comment says today only properties.agency; expected end state unclear.",
    "BASE_URL, Webflow staging vs production, and which pages/forms/iframes to use for Execute Run (not a blocker for planning).",
    "Exact list of RudderStack event types and lead capture endpoints/forms in scope for 'all events' and 'every lead capture call'—AF Pixel Catalog sheet not loaded in this analysis.",
    "Whether partial later URLs (e.g. only utm_source=bing) should drop other stored params—marked open in comment; wrong assumption would invalidate tests.",
    "Cross-tab and rel=noopener new-tab behavior: sessionStorage may not share attribution—confirm expected marketing definition of session.",
    "Ticket title [React] vs primary hook head.js on Webflow—confirm environments where automation runs (Webflow-only, React app, or both).",
    "Guru cards (Webflow publishing, pixel catalog behavior) and linked Google Sheet content were not fully consulted; conflicts with ticket cannot be ruled out."
  ],
  "knowledgeSources": [
    "Jira AFW-4122: title, description, status IN PROGRESS, labels abby/mapi/qa_automation_required, parent AFW-3458, attachment AFW-4122-otf-utm-flow.png",
    "Jira comment Allan Paul Rimando (2026-08-26): current failure mode, head.js pipeline, sessionStorage direction, iframe GET_LEAD_PROPERTIES, open questions on session definition, last-touch, agency/context.campaign",
    ".aigent/knowledge/INDEX.md (structure: Overview, Test Data Configurations, Coverage, Resources)",
    ".aigent/knowledge/overview/overview.md — automation workbook tab definitions",
    ".aigent/knowledge/coverage/coverage.md — locale flow matrix (no dedicated UTM row; attribution is cross-cutting)",
    ".aigent/knowledge/resources index — Guru Webflow/process cards, AF Pixel Catalog Google Sheet link (content not loaded)",
    ".aigent/knowledge/resources/af-locales-and-their-business-rules (Guru excerpt) — locale differences; not UTM-specific"
  ],
  "summary": "AFW-4122 requires session-level persistence of standard UTM fields plus agency on the Webflow-driven site so RudderStack events (via head.js queue) and lead capture API payloads retain attribution after the user leaves the landing URL, including iframe/OTF lead flows that today lose params on first clean-URL navigation. Testing is feasible by intercepting RudderStack and lead API traffic across landing → navigate/reload → convert paths, but the ticket lacks written acceptance criteria and leaves product decisions open on last-touch overwrite, session boundaries, and agency placement in context.campaign; AF Pixel Catalog and full Guru pixel guidance were not available here and should be aligned before locking assertions. Analyst output is scope and ambiguity only—no Testpad, code, or fabricated results."
}
Discoverer contract (do not contradict):
{
  "existingCoverage": [
    "RudderStack network capture and event validation in utils/rudderstack.ts (dataplane POST interception via page.route + request listeners, retrieveRudderstackNetworkLogs, captureRudderStackEvent) for page, identify, Lead Captured, Form Started, Location Searched/Selected, Appointment Slot Selected, and Appointment Scheduled across lead-funnel flows",
    "Dedicated RudderStack step-definition modules: step-definitions/rudderstack/afw-3303-page-lead-funnel.steps.ts (page view / lead_funnel_viewed) and step-definitions/rudderstack/afw-3952-location-events.steps.ts (location search events), plus per-flow RS steps in tryUsFree, membershipInquiry, localOffer, mcoOffer, events, contactUs, bookATourStandalone, memberOffer step files tagged @AFW-3303, @AFW-3952, @AFW-3956, @AFW-3957, @AFW-3953, @AFW-3954",
    "Gherkin RS scenarios in features/tryUsFree, membershipInquiry, localOffer, mcoOffer, events, contactUs, findAGym, inviteAFriend, bookATourStandalone (US @desktop @Regression) validating event properties, consent, userId, form_*, location_*, and dataLayer form_success — but not UTM/campaign persistence",
    "Lead capture API interception via utils/network-utils.ts (waitForStatusCodeHeadersAndBody, getRequestBody) on POST /api/lead-capture used in tryUsFree, membershipInquiry, localOffer, mcoOffer, events flows; scenarioContext.prospectRequestData stored in fixtures/base.fixture.ts",
    "AFW-3440 lead-source normalization coverage in utils/afw-3440-lead-source.ts and step-definitions/leadSourceNormalization/afw-3440-lead-source.steps.ts asserting prospectData.origin_source on lead capture (iframe leadSourceCode override pattern — closest prior art for lead payload mutation, not UTM)",
    "ProspectRequest type in types/api.types.ts defines prospectData.lead_properties with location_id, channelmix_conv_id, referral_code only (invite-a-friend.steps.ts asserts referral_code) — no UTM field assertions today",
    "Navigation/reload patterns usable for session persistence: navigateToUrl in utils/helpers.ts (test_location_id, disable_captcha, use_prod_api), AFW-3303 page reload step, common.steps.ts multi-page navigation across Webflow host + React iframes",
    "Knowledge base (.aigent/knowledge/resources/rudderstack-event-documentation-aHR0cHM6Ly9h.md) documents RS architecture (head.js safeRSAnalytics queue, iframe postMessage rs_tracking, en-us locale gating, sessionStorage for rs_person_id) and notes campaign_name on Form Started is offer title — NOT utm_campaign; url-query-parameters doc lists QA params but not UTM params"
  ],
  "reusableComponents": [
    "utils/rudderstack.ts — extend RudderStackContext/RudderStackPayload types and validateEventProperties to assert context.campaign and/or properties.agency on captured payloads",
    "utils/network-utils.ts + NetworkUtils.waitForStatusCodeHeadersAndBody / getRequestBody — reuse for POST /api/lead-capture prospectData.lead_properties UTM assertions after submit",
    "utils/helpers.ts navigateToUrl / appendDisableCaptchaParam — append UTM query bundle on landing URL alongside existing QA params (disable_captcha, test_location_id)",
    "utils/tracking/* expectation-map pattern (e.g. lead-funnel-page-rs-tracking.ts, location-search-rs-tracking.ts) — add utm-persistence-rs-tracking.ts with expected param set and event list",
    "step-definitions/rudderstack/afw-3303-page-lead-funnel.steps.ts — reuse Rudderstack validation enabled + page reload + captureRudderStackEvent flow for post-navigation page events",
    "Existing lead-funnel POMs (TryUsFreePage, MembershipInquiryPage, LocalOfferPage, UserFormPage, LocationSearchPage) and common Given The user is on {page} — no new POM needed unless a dedicated internal-link navigation helper is required",
    "fixtures/base.fixture.ts scenarioContext (rudderstackCapturedRequests, prospectRequestData) — store landing UTM set and reconcile across events",
    "CI: Playwright-BDD + @AFW-<ticket> grep via scripts/run-playwright-grep.mjs and Jenkins multibranch pipeline (EN-US Rudderstack=TRUE in Local Config); tag new scenarios @AFW-4122 @US @desktop @Regression"
  ],
  "existingTestData": [
    "URL QA query parameters documented in .aigent/knowledge/resources/url-query-parameters-for-qa-testing-aHR0cHM6Ly9h.md: disable_captcha, test_location_id, use_prod_api, bypass_promotions_api, by_pass_location_id_check — no UTM fixtures",
    "US test gym clubId 9993999 and locale test data from Local Config / TestDataKeys (used by existing RS and lead-capture flows)",
    "AFW-3440 lead-source SIT matrix values (Google Sheet referenced in utils/afw-3440-lead-source.ts) — pattern for parameterized expected strings, not UTM values",
    "No repository fixtures for utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id, or agency; ticket comment implies these must be composed at runtime for landing URLs"
  ],
  "missingCoverage": [
    "No automation asserts UTM parameter persistence across a Webflow session after navigating from a UTM landing URL to a clean (no-query) internal URL",
    "No assertions on context.campaign (or equivalent) in RudderStack page/track/identify payloads for utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id across all events",
    "No assertions that agency is present on RS events (ticket open question: properties.agency vs context.campaign for non-Mixpanel destinations)",
    "No lead capture API assertions that prospectData.lead_properties includes persisted UTM fields after internal navigation and form submit",
    "No coverage for GET_LEAD_PROPERTIES iframe postMessage handoff (ticket: iframes only receive parent query string at creation time and in GET_LEAD_PROPERTIES reply)",
    "No negative/edge scenarios: last-touch full-set replacement vs per-key merge, partial UTM on second URL, new tab rel=noopener, tab close/reopen, or sessionStorage survival across reload vs same-tab navigation",
    "No cross-event consistency check (landing page view → internal page view → Form Started → Lead Captured → identify) all carrying the same stored attribution set",
    "RudderStack automation is EN-US only per Guru RS_ALLOWED_LOCALES — non-US locales are out of scope for RS UTM unless product changes gating"
  ],
  "filesExpectedToChange": [
    "types/api.types.ts — extend ProspectRequest.prospectData.lead_properties with UTM/agency fields once product contract is confirmed",
    "utils/rudderstack.ts — add campaign/UTM/agency extraction and assertion helpers on captured payloads",
    "utils/tracking/utm-persistence-rs-tracking.ts (new) — expected UTM param map and which RS events to validate",
    "utils/helpers.ts or small utm URL builder utility — compose landing URLs with UTM + existing QA params without hardcoding BASE_URL",
    "step-definitions/rudderstack/afw-4122-utm-persistence.steps.ts (new) — Given landing with UTM, When navigate to clean URL / submit lead, Then assert RS + lead capture",
    "features/<representative-flow>/<flow>.feature — 2–6 ticket-scoped @AFW-4122 scenarios (likely try-us-free.feature and/or membership-inquiry.feature as primary lead funnels)",
    "Possibly extend step-definitions/common/common.steps.ts or an existing flow steps file if shared navigation-to-clean-URL step is reused across scenarios"
  ],
  "risks": [
    "Ticket open questions block definitive expected results: per-tab sessionStorage as session definition, last-touch replacing entire UTM set vs per-key merge, and whether agency belongs in context.campaign — plan must mark these AMBIGUOUS until product confirms",
    "Product change is in Webflow head.js (safeRSAnalytics / processAnalyticsQueue), not this repo — automation can only observe network payloads and API bodies after deploy to SIT/UAT",
    "Iframe attribution depends on parent query at iframe creation and GET_LEAD_PROPERTIES timing — tests must navigate to clean URL before iframe mount AND assert post-submit lead_properties; order sensitivity may cause flakiness",
    "RudderStack locale gating (en-us only) limits execution to EN-US / @US; Jenkins locale matrix runs many non-US locales where RS events will not fire",
    "Existing normalizeSearch logic in utils/rudderstack.ts strips location/test params when comparing page.search — UTM assertions must use dedicated campaign context checks, not page.search equality",
    "Guru distinguishes campaign_name (offer title) from utm_campaign — assertions must not conflate Form Started campaign_name with marketing UTM params",
    "No UTM values in Data Resources or URL QA doc — test data must be invented as parameterized literals or env-driven constants after test-plan approval, not scraped from production"
  ],
  "summary": "This suite has mature RudderStack and lead-capture automation (utils/rudderstack.ts, network-utils, AFW-3303/3952/3956/3957 RS scenarios across US lead funnels, and AFW-3440 origin_source API checks) but nothing validates UTM/agency persistence across session navigation. AFW-4122 should extend the existing RS capture bag and /api/lead-capture prospect assertions rather than add a parallel framework: land with a UTM query bundle, navigate to a clean internal URL, then verify context.campaign (and agency placement) on RS events plus lead_properties on lead submit. Key gaps are iframe GET_LEAD_PROPERTIES timing, all-events coverage, and ticket ambiguities on session scope and last-touch merge; EN-US-only RS gating and head.js being out-of-repo are the main execution risks."
}
