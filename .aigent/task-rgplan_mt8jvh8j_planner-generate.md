# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

Derive a reviewable test plan for regression flows “Email Club”: Email Club

Work ONLY from this message. Do not use tools. Do not read the repository. Do not call Testpad.
This plan is for manual testers first. Do not write automation. Do not copy every script in the Regression Test Template. Generate cases for the named flows only.
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
- Plan ONLY what this ticket's change implies. This is a named regression pack, not a copy of the entire template.
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
Regression / flows: Email Club
Route to Testpad: QA / Regression Test Template/Main Flows
GENERATE_REGRESSION_TESTPLAN
Generate a regression Testpad plan named: Email Club
Route to Testpad folder: QA / Regression Test Template/Main Flows
Return TicketPlanner JSON for the named flows only. Aigent writes the Testpad script. Do not POST a new script yourself. Do not copy every script in the Regression Test Template.

This run covers ONLY the current slice of "Generating a regression testplan". You must follow the Allowed steps below in order. Do not skip, reorder, or start a later stage that is not in this list.

Allowed steps, in order:
1. Read the named flows before writing cases
   Work only from the flows or regression name you entered, plus Data Resources and project knowledge. Do not implement.
Read
- Restate in-scope vs out-of-scope for this pack.
- Search project knowledge: .aigent/knowledge, Data Resources, Guru, linked Google docs, and repo docs.
- Record sources consulted, what they confirmed, and any conflict with the named flows.
- Put missing BASE_URL or live pages in AMBIGUOUS — they do not stop the plan.
Do not
- Invent coverage or start implementation.
- Skip a knowledge source, or guess when knowledge contradicts the named flows.
2. Discover existing regression coverage
   Inspect what already exists for the named flows. Do not copy the whole Regression Test Template.
Report
- Existing coverage
- Reusable components (page objects, fixtures, utilities)
- Existing test data
- Missing coverage
- Files expected to change
- Potential risks
Look in existing regression tests, Testpad scripts under the template, similar flows, CI/CD, and Jenkins jobs.
3. Generate the regression Testpad plan
   Return TicketPlanner JSON for the named flows only. Aigent writes the Testpad script.
Cover
- Given / When / Then for every TESTABLE behaviour
- Typically 4–12 scenarios, sized to the named flows — not the entire product
- Name the script after the flows
- Write into the folder you chose (default: Regression Test Template)
Do not
- Copy every script in the Regression Test Template
- Invent unrelated product areas
- POST a Testpad script yourself, or start implementation
4. Pause for human review — preserve edits  [HUMAN GATE — STOP HERE]
   After generation, stop so you can review and edit the plan in Testpad.
Then
- Add, remove, or edit cases as needed
- Those edits are preserved
- This workflow does not implement automation

Progress protocol:
- Complete every Allowed step. Skipping a listed step is a failure.
- When you begin a step, write a line exactly: STEP n: <title>
- When you finish a step, write a line exactly: STEP n DONE: <title>
- Write STEP n: every time you start that step, including retries of the same step.
- Do not start step n+1 until step n is DONE.
- Do not create a Testpad plan, feature branch, PR, or tests unless that work is in the Allowed steps.
- This run must end at: Pause for human review — preserve edits
- When you reach that gate, write: GATE: Pause for human review — preserve edits
- Then summarize what the human must do, and STOP.
- Do not implement automation, create a feature branch, open a PR, execute tests, or merge unless that step is in the allowed list above.
Review and edit the regression plan in Testpad. This workflow does not implement automation.

Project knowledge / Data Resources:
# Project knowledge

Last synced: 2026-08-25T08:58:38.866Z

The agent should read these files before inventing product behavior.

- [Github (AF Resources)](github-af-resources-aHR0cHM6Ly9n.md) — https://github.com/noli-fornoles-iv/af-website-resources
- [Local Status & Flows](local-status-flows-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [Test Gyms](test-gyms-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1XbuWQqf5vnOhIznBNX4d8nn8XCDsmsMg/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [Phone Number Teast Data](phone-number-teast-data-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1oAwlZzcxypQHWgYukxgAJV-ks0MgMlCWoySbE_LRtL0/edit?usp=sharing
- [AF Pixel Catalog](af-pixel-catalog-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [Onboarding a New Locale — Automation Framework & CI](onboarding-a-new-locale-automation-framework-ci-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=5c220b4a-5d1a-4f6c-8192-648bfc3c6cc2
- [Webflow Country Onboarding Guide](webflow-country-onboarding-guide-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=9bfcf6d9-5248-4ef7-8b0f-3829697c3663
- [[Webflow / AWS / React] New locale go live checklist](webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
- [How to Check the React Props Passed from Webflow](how-to-check-the-react-props-passed-from-webflow-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=ad391b9f-f41d-4ad7-9a6b-9ed206c66603
- [New Locale – QA Testing Guidelines](new-locale-qa-testing-guidelines-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=dde34852-fd07-4280-a78b-8b5c0075990a
- [URL Query Parameters for QA Testing](url-query-parameters-for-qa-testing-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=c25afdf8-16df-40e9-8235-b9774bbb9840
- [Test Strategy for Gym Locator Page](test-strategy-for-gym-locator-page-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=645ea985-8771-440f-a358-82d7f7a83924
- [Test Strategy for Blog Page](test-strategy-for-blog-page-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=527c0401-f5bb-4e19-b66a-eb8d6ddea4b5
- [AF Locales and their business rules](af-locales-and-their-business-rules-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=e46dcd83-72be-4d29-8321-c9934009a0b4
- [PostMan collection and API inventory](postman-collection-and-api-inventory-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=52678bbf-d51d-478b-ad9b-1c05354ecd66
- [Rudderstack Training and documentation](rudderstack-training-and-documentation-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=59500985-9057-4641-a2f8-caa916c1274c
- [Local Offer Page Setup](local-offer-page-setup-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=419d83f8-4919-482a-a235-a29241310e9e
- [Find Gym Country Dropdown Localization & API Sync Exceptions](find-gym-country-dropdown-localization-api-sync-exceptions-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=f4f417e1-42a0-408d-b839-34aef1b01e48
- [Webflow ↔ Crowdin Sync](webflow-crowdin-sync-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=c4685a09-9a89-45a9-862b-eb1ad09dcc1d
- [Webflow Country Onboarding Guide](webflow-country-onboarding-guide-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=9bfcf6d9-5248-4ef7-8b0f-3829697c3663
- [Webflow RTL support](webflow-rtl-support-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=d6f62d94-7488-4532-9f13-62d2a1482c28
- [Local Gym Page](local-gym-page-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=227db0be-574b-467d-a36d-2f39f48eb3a2
- [All Locations Filter Page](all-locations-filter-page-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=3705b207-a939-489b-8f07-12106712a2bd
- [Webflow Components](webflow-components-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=091ea71e-6da2-4c23-8ea5-2833f0033c5f
- [Home](home-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=2dda01a1-f5c0-4526-a7d6-921ab86d10c2
- [Navigation and Footer](navigation-and-footer-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=cd7b8575-ca9c-4322-9e15-194eceed41a0
- [Blog Search](blog-search-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=2fa02ec6-6e23-49a0-a434-3c3b3aba94f6
- [Modal](modal-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=75873cde-c506-4fbf-b246-6347ed14ed00
- [Events](events-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=f3dfc07a-2ed6-4e25-8d5f-410523f645f8
- [Buttons and Badges ](buttons-and-badges-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=cc2b617e-fe4b-4851-b04b-44136d234a0f
- [Blog Components](blog-components-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=8be82d95-ec8a-4181-8cd9-97f48aab3195
- [Technical Guide: Updating Submit Cancellation Link](technical-guide-updating-submit-cancellation-link-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=6c336b0c-c86d-4264-957d-4d436c34fe6e
- [Search Bar Only Experience](search-bar-only-experience-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=349332e1-daa0-4b59-9432-97bb1f755cef
- [Membership & Training Pages](membership-training-page
…

Output ONLY the JSON object. No STEP lines. No GATE line. No markdown except a ```json fence if needed.

Analyst contract (do not contradict):
{
  "testable": true,
  "blocked": false,
  "inScope": [
    "Regression test planning for the Email Club main flow only (not the full Regression Test Template or other Main Flows)",
    "User-visible email capture/signup: form display, validation, submit, and success/error UX as defined in Local Status & Flows for Email Club",
    "Flow-documented consent/checkboxes and duplicate-subscriber behavior when specified in knowledge or the flow sheet",
    "Entry points for Email Club only where the Main Flows documentation names them (e.g. page, modal, footer—TBD until sheet is read)",
    "Analytics verification for Email Club only if AF Pixel Catalog or flow docs tie specific events to this flow"
  ],
  "outOfScope": [
    "Copying or replaying every script in QA / Regression Test Template",
    "Automation implementation, feature branches, PRs, test execution, and Testpad API POST in this Analyst run",
    "End-to-end email delivery/inbox confirmation unless explicitly required by the Email Club flow definition",
    "Unrelated product areas (blog, gym locator, membership purchase, events) except shared UI reused by Email Club with flow-specific steps",
    "Webflow/CMS authoring, locale onboarding checklists, and full multi-locale regression beyond what Email Club flow specifies"
  ],
  "ambiguous": [
    "BASE_URL and target environment (SIT/UAT/prod-like) for executing Email Club cases",
    "Exact URLs and entry points for Email Club from Local Status & Flows (sheet row not loaded in this briefing)",
    "Locale/country matrix and business rules for Email Club (AF Locales card not loaded for this flow)",
    "Backend/API vs static Webflow form, double opt-in, and whether duplicate email returns error or soft success",
    "Dedicated test emails and whether inbox verification is in scope",
    "Specific Rudderstack/AF Pixel event names for Email Club (AF Pixel Catalog row not confirmed)",
    "Existing automated regression coverage and reusable page objects in the repo (filesystem not inspected this session)"
  ],
  "knowledgeSources": [
    ".aigent/knowledge/INDEX.md (ticket load): Data Resources and Guru index; no Email Club–specific Guru card in visible list",
    "Local Status & Flows (Google Sheet link in INDEX): designated source for named Main Flows including Email Club—detailed steps not present in loaded text",
    "Test Gyms, Phone Number Test Data, AF Pixel Catalog, AF Locales and their business rules (INDEX links): env/test data/locale/analytics context—Email Club specifics not loaded",
    "Guru cards referenced in INDEX (Modal, Navigation and Footer, URL Query Parameters for QA Testing): possible shared entry/QA patterns—not confirmed for Email Club",
    "Ticket briefing: regression pack name Email Club, Testpad route QA / Regression Test Template/Main Flows, GENERATE_REGRESSION_TESTPLAN",
    "Repo docs and regression/Testpad/CI assets: not consulted—workspace read tools unavailable in this run"
  ],
  "summary": "Email Club is in scope as a single Main Flow regression pack for Testpad script Email Club under QA / Regression Test Template/Main Flows, covering form visibility, validation, submit outcomes, optional consent/duplicate behavior, and conditional analytics per flow and pixel docs. Out of scope are other main flows, template-wide duplication, and automation in this stage. Knowledge INDEX and sheet links were used; the Email Club row from Local Status & Flows and repo/Testpad existing coverage were not loaded or inspected, so URLs, env, locale rules, and API/email semantics sit in ambiguous. A draft of 4–8 Given/When/Then scenarios was prepared for human review at the gate; the human must reconcile with Local Status & Flows, resolve ambiguous env/URL/locale data, edit the plan in Testpad, and only then proceed to later workflow stages."
}
Discoverer contract (do not contradict):
{
  "existingCoverage": [
    "features/contactUs/contact-us.feature — TC-B001 through TC-B021 covering Location Search 2.0 landing, valid/invalid search, LIST/MAP tabs, Select Gym → form, required/invalid/valid fields, submit, thank-you, and POST /communications payload; tagged @ContactUs @Regression across 20+ locales",
    "Consolidated one-pass journeys (@ContactUsConsolidatedPass, @Afw3660ConsolidatedPass) stacking compatible checks including TH spin-up (AFW-3660)",
    "Untranslated-text scan scenario (@UntranslatedTextScan) across landing → form → thank-you for non-English locales",
    "US-only Rudderstack regression: Form Started (TC-B011/AFW-3957), Location Searched/Selected (AFW-3952), page view lead_funnel_viewed false (AFW-3303), location_name with location_id deep-link (AFW-4088), Lead Captured/identify (TC-B016/AFW-3956 — documents known SIT/UAT app defects)",
    "US-only GTM/dataLayer scenarios TC-B019 form_loaded and TC-B020 form_success (documented Email Club app defects on SIT/UAT)",
    "features/findAGym/find-a-gym.feature — AFW-3607 EN-GB/EN-IE Find Gym primary CTA CONTACT US navigates to /email-club?location_id=",
    "Google Sheets Contact Us flow tab (spreadsheet 1jk3Jat…) — source of truth for TC-B001–B021 mapped to automation tags",
    "Jenkins Regression suite (scripts/run-playwright-grep.mjs --fixed=Regression) and FEATURE_SPECIFIC option ContactUsConsolidatedPass in Jenkinsfile",
    "npm script test:multi-locale:regression runs all @Regression-tagged scenarios including Contact Us"
  ],
  "reusableComponents": [
    "pages/modules/ContactUsPage.ts — composes LocationSearchPage, UserFormPage, LocalGymPage, ConfirmationScreenPage for contact-us-iframe",
    "pages/common/LocationSearchPage.ts — locale-aware /email-club host URL builder (never bare US /email-club), search/select/assert helpers",
    "pages/common/UserFormPage.ts — shared lead-form interactions including message field",
    "pages/modules/FindAGymPage.ts — clickContactUsGymCtaAndWaitForEmailClub() and assertEmailClubWithLocationId()",
    "step-definitions/contactUs/contact-us.steps.ts — full flow steps, /communications API interception, RS/GTM validation, deep-link and test_location_id handling",
    "utils/constants/index.ts — PATHS.CONTACT_US = '/email-club'",
    "utils/tracking/form-started-rs-tracking.ts, lead-funnel-page-rs-tracking.ts, location-search-rs-tracking.ts — Email Club–specific RS payload rules (form_name Email Club, no offer_*, lead_funnel_viewed false)",
    "utils/rudderstack.ts — AFW-3956/4088 Email Club assertions",
    "utils/localization/extract-visible-text.ts — Contact Us / Email Club iframe copy extraction",
    "resources/{locale}/translations.json contactUs blocks and resources/{locale}/test-data.json clubId for locale-based gym selection"
  ],
  "existingTestData": [
    "Test Gyms Data Resource — US baseline open club 9993999",
    "Phone Number Test Data Google Sheet — locale phone validation samples",
    "Local Status & Flows sheet — Email-Club Form Enabled per locale (e.g. enabled US/AU/GB; disabled KR)",
    "Locale config clubId in resources/{locale}/test-data.json for deep-link and search",
    "QA URL params: test_location_id, disable_captcha, use_prod_api (handled in contact-us.steps.ts)",
    "Generated form data in steps including message field; invalid search keywords for no-nearby-gym scenarios"
  ],
  "missingCoverage": [
    "Events 2.0 redirect to /email-club?location_id= (documented in Events 2.0 Guru card; no dedicated automation scenario)",
    "Navigation/footer entry path to Email Club (not exercised — automation navigates directly to Contact Us page)",
    "Full form journey via location_id deep-link only (page-view RS covered by AFW-4088; search step skipped)",
    "Contact Us form edit/redirection icon back to location search or LLP (Submit Form Guru doc lists Contact us → LLP redirection icon)",
    "Location Search 2.0 edge states on Email Club: outside-country, unable-to-detect, IP-based load, Use Current Location geolocation, MAP pin selection",
    "Locales where Email-Club Form Enabled = No (e.g. South Korea) — negative/disabled behaviour not automated",
    "Non-US Rudderstack and GTM coverage (RS scenarios are US-only due to Local Config; DE/INTL RS = FALSE skips)",
    "AF Pixel Catalog form_success / contact club pixel validation (only partial RS overlap; known form_loaded/form_success gaps on SIT/UAT)",
    "reCAPTCHA-enabled submit path if captcha not bypassed via disable_captcha",
    "Safari phone autofill edge case documented in Phone Number Integration Guru card (AFW-3008)"
  ],
  "filesExpectedToChange": [
    "None for this regression Testpad plan run — Aigent writes the Testpad script only; no repo edits until post-approval automation",
    "If later automation closes gaps: features/contactUs/contact-us.feature, step-definitions/contactUs/contact-us.steps.ts, pages/common/LocationSearchPage.ts or pages/modules/ContactUsPage.ts, and optionally features/findAGym/find-a-gym.feature or events feature files for cross-flow entry points"
  ],
  "risks": [
    "Naming drift: product/marketing uses Email Club (/email-club) while automation and Guru Contact Us card reference Contact Us (/contact-us React iframe); planner must use observable user-facing labels",
    "Guru Contact Us card documents club URL param; live Webflow/React mapping uses location_id per webflow-pages-x-next-js-iframes — wrong param breaks deep-link scenarios",
    "Email Club submits to POST /communications, not /api/lead-capture/ — different backend from standard lead forms; phone validation shared but API differs",
    "Known SIT/UAT application defects: form_loaded, form_success, Lead Captured, and identify events missing after successful submit — regression plan must distinguish expected vs defect or manual-only",
    "Locale availability gate: Email-Club Form Enabled varies by country; running full locale matrix where disabled will fail for product reasons not automation bugs",
    "Must use locale-prefixed BASE_URL for /email-club; bare origin+/email-club drops locale prefix and hits US site",
    "Rudderstack validation is locale-gated (Local Config); scenarios asserting RS outside US may skip or soft-fail by design",
    "Zip/postcode not required on /email-club path (isEmailLocationPageLegacy) — locale form field expectations differ from other lead flows"
  ],
  "summary": "Email Club is already heavily covered in this suite under the Contact Us automation slice: a full TC-B001–B021 Cucumber feature with multi-locale regression tags, consolidated passes, API payload checks, and US tracking scenarios, plus Find Gym GB/IE CTA routing (AFW-3607). Reusable POMs, step definitions, locale fixtures, and RS tracking utilities are mature and should be extended rather than duplicated. Gaps suitable for a focused regression Testpad pack (not the whole template) are cross-entry paths (Events redirect, nav/footer), Location Search edge states, deep-link-only journeys beyond page view, form edit/redirection icon, disabled locales, and non-US analytics. Primary risks are Email Club vs Contact Us naming, location_id vs legacy club param docs, /communications vs lead-capture API, locale-gated availability, and documented SIT/UAT tracking defects that can cause false failures if treated as pass criteria without human review."
}
