# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

Derive a reviewable test plan for Jira AFW-3951: [Rudderstack] Setup "Button Clicked" rudderstack event on webflow & react
Ticket: https://purposebrands.atlassian.net/browse/AFW-3951

Work ONLY from this message. Do not use tools. Do not read the repository. Do not call Testpad.
This plan is for manual testers first and must be specific enough to automate later. Do not write automation code. Do not copy a regression template.
Understand the Project knowledge / Data Resources block before writing cases. Ground every scenario in those product facts plus the briefing. Vague Given/When/Then is invalid output.
Use every section of the briefing: description, subtasks, linked work items, comments, attachments, images, and pages fetched from links in the ticket.
If linked tickets describe event properties or exclusions, those are requirements. Do not invent values they do not state.

You are writing a reviewable test plan for BOTH manual testers and later automation.
Follow qa-bot TicketPlanner. Do not invent coverage. Do not write automation. Do not duplicate a regression template.

Knowledge-first (required for every plan — ticket or regression):
The Project knowledge / Data Resources block in this message is the product source of truth. Read it and understand the specific coverage before writing any scenario.
Map the request onto documented product facts: entry URL/path or flow name, role, fields, labels, CTAs, validation, success/error states, events, test data, locales, exclusions.
Every Given / When / Then must use those product-specific names. Never write 'the relevant page', 'the form', 'the expected result', or a restated Jira summary.
Copy labels, URLs/paths, event names, thank-you copy, error messages, and property names verbatim from knowledge or the ticket. Never paraphrase, re-case, or invent them.
If knowledge and the ticket conflict, record AMBIGUOUS — do not pick a side. If a fact is missing from both, do not invent it.

Automation-ready writing (manual testers run these now; Playwright must be able to follow the same steps later without guessing):
- Given: named starting state — documented URL/path or flow entry, account/role, and fixture data from knowledge. Not 'the user is on the page'.
- When: one concrete action — click the labeled control, fill the named field with stated data, submit, open, select. Not 'perform the action', 'complete the flow', or 'exercise the behaviour'.
- Then: one observable assertion copied verbatim — exact copy, URL/path, named element visibility, validation/error message, or named analytics event. Not 'as expected', 'works', 'looks correct', 'successfully', or 'the correct result'.
- If a later automation engineer would have to guess which control, URL, data, or assertion, that item is AMBIGUOUS — not a scenario.
- One scenario = one behaviour. Split unrelated checks. Steps stay atomic. No compound steps. No judgment-only steps. No @tags.
- Each scenario is independent: include the setup it needs.
- Cover every TESTABLE atomic requirement. When knowledge or the ticket states them, also cover validation, negative, and rename/remove (old state gone). Do not invent extra product behaviour.

Requirement quality gate (do this AFTER you understand knowledge, BEFORE writing any scenario):
Break the ticket, acceptance criteria, subtasks, linked work items, comments, fetched links, AND matching knowledge into atomic requirements. Classify each:
- TESTABLE — an objective, observable expected result is stated in the ticket or confirmed in knowledge. Write a scenario and set requirement to that atomic item.
- AMBIGUOUS — a change is requested but the expected result is not defined in ticket or knowledge. Do not invent an assertion. Record a specific clarification question with the plausible interpretations.
- NOT STATED / EXCLUDED — an implementation detail you could infer, or an item listed as out of scope (except for X). Record it with the reason. Never assert it as a pass/fail case.
- BLOCKED — meaning depends on an unresolved ambiguity. Record what it depends on.
Context beats keywords. Words like update/fix/correct/properly are signals, not automatic blocks, if the surrounding text already gives an expected result.
Classify independently: one ambiguous item must not stop scenarios for the clear ones. A partial plan is useful.
Never infer implementation. Ticket metadata (reporter, priority, email fields) is not an assertion.
Quoted or backticked names (`Experiment Viewed`) are exact expected values — use them verbatim.
If the title is an automation task ('Automate tests for X'), plan X — the product behaviour — not the act of automating.
Linked work items (relates to / tests / blocks) are in-scope requirements when they state an observable result.

Scope:
- Plan ONLY what this ticket's change implies. This is a client-change plan, not a full regression suite.
- Cover every TESTABLE atom. Typical depth is 3–8 scenarios (max 10). A one-line copy change still needs the exact copy plus the old text gone when it is a rename.
- Split 'and' when it joins two behaviours (event trigger AND property persistence). Keep quoted phrases as one item.
- Do not duplicate existing automation found in discovery unless this change invalidates it.
- Do not assume checkout, payment, account creation, or production mutation.

How to write each scenario (manual testers will execute these rows in Testpad):
- Verify the user-visible or analytics end state, never the diff or implementation (no ACF/DB/CSS/class/id assertions).
- Enumerate listed items; never merge or drop them. Split comma lists. Treat quoted phrases as one item.
- No generic scenarios. Never restate the Jira summary as Feature, Scenario title, and Then.
- Links/CTAs assert both visible label and destination URL/path when the ticket or knowledge gives one.
- Absence checks are page-scoped ('X is not visible on the page'), not region-scoped, unless the ticket requires coexistence.
- Interactive content (accordion, tab, dropdown, hover) needs an explicit When step before the assertion.
- Assert content, not markup structure, unless the ticket requires a specific structure.
- Media/SEO/responsive scenarios only when the ticket or knowledge states them (exact title, meta, single H1, alt/caption, viewports).

Output contract: your FINAL message must be ONLY this JSON (no Testpad API, no files, no Gherkin dump outside JSON):
{ "feature": "short product title — not the automation task wording", "scenarios": [{ "title": "one behaviour", "steps": ["Given …", "When …", "Then …"], "requirement": "atomic TESTABLE requirement" }], "ambiguous": [{ "requirement": "…", "ambiguity": "…", "clarification": "specific question" }], "excluded": [{ "requirement": "…", "reason": "…" }], "blocked": [{ "requirement": "…", "dependsOn": "…" }] }
scenarios covers TESTABLE requirements only. Other arrays may be empty. At least one scenario OR one ambiguous/blocked item is required.
Aigent writes this JSON into Testpad as Feature / Scenario / Given-When-Then. Do not POST a new script.

Invalid (never output this shape): Feature, Scenario title, and Then all repeat the Jira summary, and When is 'perform the action described in this requirement'.
Valid: short product feature title; one scenario per TESTABLE behaviour; Given / When / Then with product-specific names from knowledge; quoted names verbatim; except-for items in excluded.

Ticket briefing:
Ticket AFW-3951: [Rudderstack] Setup "Button Clicked" rudderstack event on webflow & react
URL: https://purposebrands.atlassian.net/browse/AFW-3951
Status: QA In Progress · Type: Task · Labels: Donald, andrew, mapi, qa_automation_required
Parent: AFW-3458 — Website Scorecard Evolution (Rudderstack + Mixpanel)
Description:
As a marketing analyst, I want to see link clicks across the website in mixpanel.  To acheive this, we will introduce a rudderstack link click event to select areas of the website.  EventName: Button ClickedParameters:- location_id (if available)
- placement
- text
- element_id
Where to put the event- Webflow → 
Navbar menu item clicks
- Webflow → 
LLP page clicks (anywhere in the page)
- Webflow → 
Core pages (home, training, why join) - pill buttons only
- React → 
React Gym Map CTA button clicks (Join Card, Map Pins)
- React →
 Pill buttons on the locations results step- both CTA’s presented
- all forms
- React → 
Submit Forms- If user clicks the edit location button
- Local offers- User clicks button to visit LLP page
- User clicks Join Now Card Button (CTA Pill button)
- React →
 Other buttons on locations search- Use precise location button
- React → 
Book a tour (visit)- If user selects date button
- if user selects time button
- note:
 ensure it only fires on the first date selected and first time selected.  Ensure the the placement name for these buttons is clear and understandable.
- New August 24 → Add to Calendar CTA -  
fires button clicked only after user selects one of the options (Google, Apple, Outlook, etc.).  Regardless of the option selected, we would want the button click event to have the same element id and placement.  The text can be dynamic (google, apple, outlook, etc.) [image: image-20260825-011102.png]
Acceptance Criteria- the tagging of link click elements is scalable and maintainable ongoing.  It should avoid archtecture that rely on developers remembering to add id’s for rudderstack.- E.g., Webflow developer adds new link to LLP page, the rudderstack id’s should be easily or automatically applied.
- Fires consistently across all scenario’s list above
- Documentation is created in Guru
Subtasks:
- AFW-4041: [React] Setup Button Clicked Rudderstack event
Status: QA In Progress · Type: Sub-task
Description:
As a marketing analyst, I want to see link clicks across the website in mixpanel.  To acheive this, we will introduce a rudderstack link click event to select areas of the website.  EventName: Button ClickedParameters:- location_id (if available)
- placement
- text
- element_id
Where to put the event- React → 
React Gym Map CTA button clicks (Join Card, Map Pins)
- React →
 Pill buttons on the locations results step- both CTA’s presented
- all forms
- React → 
Submit Forms- If user clicks the edit location button
- Local offers- User clicks button to visit LLP page
- User clicks Join Now Card Button (CTA Pill button)
- React →
 Other buttons on locations search- Use precise location button
- React → 
Book a tour (visit)- If user selects date button
- if user selects time button
- note:
 ensure it only fires on the first date selected and first time selected.  Ensure the the placement name for these buttons is clear and understandable.
Acceptance Criteria- the tagging of link click elements is scalable and maintainable ongoing.  It should avoid archtecture that rely on developers remembering to add id’s for rudderstack.- E.g., Webflow developer adds new link to LLP page, the rudderstack id’s should be easily or automatically applied.
- Fires consistently across all scenario’s list above
- Documentation is created in Guru
- AFW-4043: [Webflow] Setup Button clicked Rudderstack event
Status: QA In Progress · Type: Sub-task
Description:
As a marketing analyst, I want to see link clicks across the website in mixpanel.  To acheive this, we will introduce a rudderstack link click event to select areas of the website.EventName: Button ClickedParameters:- location_id (if available)
- placement
- text
- element_id
Where to put the event- Webflow → 
Navbar menu item clicks (all pages, all navbar variants)
- Webflow → 
LLP page clicks- CTA pill buttons
- all links in hero banner
- all links in pre-footer
- Webflow → 
Core pages (home, training, why join) - pill buttons only
Acceptance Criteria- the tagging of link click elements is scalable and maintainable ongoing.  It should avoid archtecture that rely on developers remembering to add id’s for rudderstack.- E.g., Webflow developer adds new link to LLP page, the rudderstack id’s should be easily or automatically applied.
- Fires consistently across all scenario’s list above
- Documentation is created in Guru
- AFW-4083: [BUG][See You Soon - Thank You Page] Button Clicked event is not appearing for buttons on this page
Status: READY FOR QA · Type: Sub-task
Description:
URL: 
https://sit.anytimefitness.com/schedule-an-appointment-online?location_id=9991402 (https://sit.anytimefitness.com/schedule-an-appointment-online?location_id=9991402)Platform:
  Device Type:
 All Device Used:
 Chrome Devtools in Desktop Browser:
 Chrome Viewport/s:
 All Description: 
Buttons under See You Soon - Thank You page don’t have the Button Clicked event triggered upon clicking it. Evidence: https://bloomrecord.com/msojtyt247105363
Links in this ticket: https://sit.anytimefitness.com/schedule-an-appointment-online?location_id=9991402, https://bloomrecord.com/msojtyt247105363
- AFW-4168: [BUG][Button Clicked] Navbar Related Bugs
Status: READY FOR QA · Type: Sub-task
Description:
URL: - https://sit.anytimefitness.com/ (https://sit.anytimefitness.com/)
- https://sit.anytimefitness.com/try-us-free?location_id=9993999 (https://sit.anytimefitness.com/try-us-free?location_id=9993999)
- https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999 (https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999)
Platform:
  Device Type:
 All Device Used:
 Chrome Devtools in Desktop Browser:
 Chrome Viewport/s:
 All Description:
 The following bugs are present on the different Navbars on AF site:  Some navbar links (observed in training & blogs) are not behaving as expected for their corresponding Button Clicked event:sometimes delayed (showing up update page view of the link’s page is triggered)sometimes triggered twice (1 with unknown status, 1 with 200 status)sometimes not being triggered at allNavbar - AF logo Only: Flows with navbar that only contains the AF logo, doesn’t trigger Button Clicked eventNavbar LLP: Most of navbar links and CTA on LLP Navbar are not triggering the button clicked eventsEvidence: Navbar:https://bloomrecord.com/mtaa0sdpbpnv4mr2 Navbar LLP:https://drive.google.com/file/d/1kJUE1_v1xRh65ba1K25ZTCDWbnKHzaBv/view?usp=sharing
Links in this ticket: https://sit.anytimefitness.com/, https://sit.anytimefitness.com/try-us-free?location_id=9993999, https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999, https://bloomrecord.com/mtaa0sdpbpnv4mr2, https://drive.google.com/file/d/1kJUE1_v1xRh65ba1K25ZTCDWbnKHzaBv/view?usp=sharing
- AFW-4170: [BUG] Some Button Clicked events' status are showing up as "unknown" instead of 200
Status: To Do · Type: Sub-task
Description:
URL: 
[Applies to all pages/links/CTAs]- https://www.anytimefitness.com/locations (https://www.anytimefitness.com/locations)
- 
Platform:
  Device Type:
 All Device Used:
 Chrome Devtools in Desktop Browser:
 Chrome Viewport/s:
 All Description:
 Upon clicking links/CTAs, their corresponding statuses are inconsistent. Sometimes it would be 200, but sometimes it would return as unknown. This is applicable for both React and Webflow components. Evidence: [image: image-20260827-110411.png]https://bloomrecord.com/mtbf3a1i6etshqm7
Links in this ticket: https://www.anytimefitness.com/locations, https://bloomrecord.com/mtbf3a1i6etshqm7
- AFW-4173: [BUG][Find A Gym] SELECT COUNTRY dropdown options should also trigger button clicked event
Status: READY FOR QA · Type: Sub-task
Description:
URL: 
https://sit.anytimefitness.com/locations (https://sit.anytimefitness.com/locations)
 Platform:
  Device Type:
 All Device Used:
 Chrome Devtools in Desktop Browser:
 Chrome Viewport/s:
 All Description:
 As per confirmation from PM, SELECT COUNTRY dropdown options should also trigger the Button Clicked event. Please note that only upon clicking a country/locale should the event be triggered. Evidence: 
(see @1:30) https://bloomrecord.com/mtblzwuybfag9vww
Links in this ticket: https://sit.anytimefitness.com/locations, https://bloomrecord.com/mtblzwuybfag9vww
- AFW-4174: [BUG] Button Clicked Event Bugs on LLP
Status: To Do · Type: Sub-task
Description:
URL: 
https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999 (https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999)Platform:
  Device Type:
 All Device Used:
 Chrome Devtools in Desktop Browser:
 Chrome Viewport/s:
 All Description: Please confirm if the following links/CTAs should also trigger the Button Clicked event: (As my understanding that all page clicks should be included for LLP)Local Offer Banner CTAs (Join Now and Learn More)Hero Section: Address text linkMembership Plans Section:“SELECT” CTAs on membership plans iframe“Freeze” link“Cancel” linkOffice Hours Section: “membership options” text link“book a visit”Visit Section: “TAKE A VIRTUAL TOUR” buttonAF+ Section: “See details” link - going to AF+ Members page (https://sit.anytimefitness.com/apple-fitness-plus-af-members-offer)The following links are missing on the Button Clicked Inventory Sheet:Pre-footer Section:Address text link“Virtual Tour” link“Club Schedule” linkThe following links/CTAs have incorrect Button Clicked event property values or inconsistent behaviors:Hero Section:"EXPLORE MEMBERSHIPS" link - element_id value should be “llp-explore-membership”, instead of "llp-join-now".AF+ Section: TRY US FREE CTA - element_id value should be “llp-apple-fitness-offer”, instead of "llp-free-trial".All Links and CTAs only trigger Button Clicked event once, not everytime it’s clicked. Evidence: Hero Section: [image: image-20260827-164358.png]AF+ Section:https://bloomrecord.com/mtbq74wk8gaj3nhp[image: image-20260827-161859.png]Overall Testing:[image: 2026-08-28 16-27-38.mkv][image: 2026-08-28 20-17-37.mkv]
Links in this ticket: https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999, https://sit.anytimefitness.com/apple-fitness-plus-af-members-offer, https://bloomrecord.com/mtbq74wk8gaj3nhp
Linked work items:
- contains AFW-3813: [Webflow][Spike] Consistently & Accurately attach Link click elements for rudderstack 
Status: DONE · Type: Task
Description:
How to consistently and accurately attache rudderstack click element Id’s to CTA buttons and key page clicks.See linked tickets to view definitions
- contains AFW-3325: [Rudderstack][Spike] Confirm link click event process for webflow page elements
Status: DONE · Type: Task
Description:
Confirm link click process for firing from webflow- How are rudderstack events fired from webflow clicks?  Page element?
- Can we introduce common element naming convention to futureproof the setup (e.g., CTA buttons get a new redesign and element name.  We don’t want that to break anything)
List of link clicks that will be in scope:- Navbar menu item clicks (can't really know for sure right now, estimate 
150K)
- LLP page clicks - pill buttons only - 
934K
- React Gym Finder - "Select Gym" or "Free Trial" button. 
246K
- Core pages (home, training, why join) - pill buttons only- 130K, 60K, 123K
- Exclude react flows since they are tracked in their respective events. So extra clicks is redundant.
- USA accounts for 40% of gyms, so a global estimate would be ~3.3 million for Anytime Fitness brand.
How are rudderstack events fired from webflow clicks?  Page element?
Attachments:
- image-20260817-224455.png (image/png, 236035 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260817-224927.png (image/png, 222176 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260817-225653.png (image/png, 312044 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260825-011102.png (image/png, 22831 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
Conversation / comments:
- Andrew Vanos (2026-07-24): Please use the tech specs for react and webflow to plan out the execution of this work.    Suggest creating sub tasks as needed
- Andrew Vanos (2026-07-29): Putting on hold quickly here - going to confirm how to align with OTF’s existing button clicked event.  They use- location_id (if available)
- placement
- text
- element_id
Example Payload of 
Button Clicked
 event{
  "properties": {
    "location_id": "eb9e8741-50a7-4b13-91c0-7c4814bd89af",
    "studio_id": "eb9e8741-50a7-4b13-91c0-7c4814bd89af",
    "placement": "locations_modal_card",
    "is_sms_enabled": false,
    "text": "Try A Class",
    "element_id": "try_class_btn"
  },
  "event": "Button Clicked",
  "type": "track",
  "channel": "web",
  "context": {
    "traits": {
      "em": "d1258f2cdf6d07fe43bf897b9d396665e10ab063b3c0a047165d0f2bcdf421c3"
    },
    "sessionId": 1785375103787,
    "consentManagement": {
      "deniedConsentIds": [
        "C0005"
      ],
      "allowedConsentIds": [
        "C0001",
        "C0002",
        "C0003",
        "C0004"
      ],
      "provider": "oneTrust",
      "resolutionStrategy": "and"
    },
    "app": {
      "name": "RudderLabs JavaScript SDK",
      "namespace": "com.rudderlabs.javascript",
      "version": "3.31.6",
      "installType": "cdn"
    },
    "library": {
      "name": "RudderLabs JavaScript SDK",
      "version": "3.31.6",
      "snippetVersion": "3.0.32",
      "variant": "modern"
    },
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
    "os": {
      "name": "",
      "version": ""
    },
    "locale": "en-CA",
…
- Andrew Vanos (2026-08-17): Checking in UAT- For location_id and user_id - if its not available, lets use
null
 
instead of ""- We should standardize this
- React can remove 
properties.channel
 = Web since its already included in the payload elsewhere
- Webflow didn’t trigger consistently on the navbar- training page >> click blogs on the navbar >> button click didn’t fire.[image: image-20260817-225653.png]
Summary of payload comparison:FieldReactWebflowAssessmentevent"Button Clicked""Button Clicked"✅ Sametype"track""track"✅ Sametop-level 
channel"web""web"✅ Sameproperties.element_id✅✅✅ Same structureproperties.placement✅✅✅ Same structureproperties.text✅✅✅ Same structureproperties.channel"web"❌ Missing⚠️ Inconsistentproperties.location_id❌ Missing""⚠️ Inconsistentcontext.traitsPopulated{}✅ Expected user-state differencecontext.sessionId✅✅✅context.sessionStart❌ Missingtrue✅ SDK/session-state differenceuserIdUUID""⚠️ Different representationanonymousIdUUIDUUID✅messageIdUUIDUUID✅timestamps✅✅✅Payload Review Details- Webflow: 
Clicked ‘Try Us Free’ on the navbar and button clicked event fired
[image: image-20260817-224927.png]{
  "properties": {
    "element_id": "navbar-try-us-free",
    "placement": "navbar",
    "text": "TRY US FREE",
    "location_id": ""
  },
  "event": "Button Clicked",
  "type": "track",
  "channel": "web",
  "context": {
    "traits": {},
    "sessionId": 1787006888831,
    "sessionStart": true,
    "consentManagement": {
      "deniedConsentIds": [
        "C0005"
      ],
      "a
…
- Andrew Vanos (2026-08-17): Payloads are generally good - marking ready for PROD dependant on:- React can remove 
properties.channel
 = Web since its already included in the payload elsewhere
Then fast follow after release to ensure- All trigger scenarios are tested by
- use of null values is consistent
- Marie Garcia (2026-08-24): Test plan Guest Link: 
https://outliantteam.testpad.com/script/27017/report?auth=64f42b397dcb8e8bdf5726e26a2b7232
 Test plan: 
https://outliantteam.testpad.com/script/27017#88/1/ (https://outliantteam.testpad.com/script/27017#88/1/)

Project knowledge / Data Resources:
# Project knowledge

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
- [Blog Search](resources/blog-search-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/c57G5aoi/We

### resources/events-2-0-aHR0cHM6Ly9h.md
# Events 2.0

- **Gym Page → **Redirects to the Gym’s Local Landing Page (LLP).
-   GYM_PAGE = "gym-page"
- **Dynamic Page → **Redirects to a specified URL as long as its from a **Trusted Anytime Fitness Domain**.
- DYNAMIC_PAGE = "dynamic-page"
- **Lead Form Page Redirect →  **Redirects to any existing Lead Form Page with the Gym pre-selected (e.g., [Book a Tour](https://www.anytimefitness.com/schedule-an-appointment-online?location_id=9993999), [Membership Inquiry](https://www.anytimefitness.com/en-au/membership-inquiry?location_id=AU-1145), [Try Us Free](https://www.anytimefitness.com/try-us-free?location_id=9993999), [Email Club](https://www.anytimefitness.com/email-club?location_id=9993999), or directly to a local offer page).
-   BOOK_A_TOUR = "book-a-tour"OR  LOCAL_OFFER_PLANS_PAGE = "local-offer-plans-page"
- **Lead Form In-Page → **Opens the lead form directly within the events page (no redirect). Examples: [Events Free Trial](https://www.anytimefitness.com/events/free-trial?location_id=2816), [Events Find Your Fitphoria](https://www.anytimefitness.com/en-au/events/find-your-fitphoria?location_id=AU-1573). 
-  LEAD_FORM = "lead-form"
- **Online Signup → **Shows **JOIN NOW** button for the gym if they have a valid online join URL to redirect. If the gym doesn’t have an online signup page, then they will be **hidden** from search results. Examples: [Event Join Online Page](https://www.anytimefitness.com/events/join-online?location=Seattle%2C+WA)
-   LOCAL_OFFER_JOIN_LINK = "local-offer-join-link"
- **Local Offer + Online Signup → **Allows each event page to designate **one** local offer per locale.  If a gym in that locale has the offer, it will dynamically show **JOIN NOW** or **CLAIM OFFER **cta button.
-  LOCAL_OFFER_CUSTOM_PLAN_PAGE = "local-offer-custom-plan-page"
- **Join Now** appears only when the gym has an online-signup deeplink for that offer.
- If no online signup link exists, **Claim Offer** appears and behaves like *In-Page Lead Form* (option #4), using a unique lead source code and workflow name.
- If a gym **does not** have the designated local offer, it will be **hidden** from search results.
 **CTAAction Limitations:**

| Property | Default Value | Component / Section |
| --- | --- | --- |
| data-id | (Empty) | General |
| Trusted Domains | (Empty) | General |
| Search Field Variant | default | Search Field |
| Search Field Title | Find your gym | Search Field |
| Search Field Placeholder | Search by city & state or zip code | Search Field |
| Location Title Color | #2d2926 | Location List |
| Location Title Clickable | false | Location List |
| Display Distance | true | Location List |
| Button 1 Variant | fill | Button 1 |
| Button 1 Text | Join Now | Button 1 |
| Button 1 Custom Style | (Empty) | Button 1 |
| Button 1 Desktop Order | 1 | Button 1 |
| Button 1 Mobile Order | 1 | Button 1 |
| Button 1 Location Condition | (Empty) | Button 1 |
| Button Local Offer Title 1 | (Empty) | Button 1 |
| Button 1 URL | (Empty) | Button 1 |
| Button 2 Variant | outlined | Button 2 |
| Button 2 Text | Gym Details | Button 2 |
| Button 2 Custom Styles | btn secondary | Button 2 |
| Button 2 Desktop Order | 2 | Button 2 |
| Button 2 Mobile Order | 2 | Button 2 |
| Button 2 Location Condition | (Empty) | Button 2 |
| Button Local Offer Title 2 | (Empty) | Button 2 |
| Button 2 URL | (Empty) | Button 2 |
| Lead Form Enabled | true | Lead Form |
| Lead Form Title | Tell Us About You | Lead Form |
| Lead Form Location Title | Selected gym | Lead Form |
| Lead Form Description | All fields are required | Lead Form |
| Lead Form CTA Text | Submit | Lead Form |
| Lead Form BAT Variant | addon | Lead Form |
| Lead Form Footer Variant | default | Lead Form |
| Lead Form Source Code | (Empty) | Lead Form |
| Lead workflow name | (Empty) | Lead Form |
| Lead form mobile description | (Empty) | Lead Form |

```
{
  id: "promo-event",
  trusted_domains: ["anytimefitness.com"],
  search_field: {
    title: "FIND YOUR GYM",
    placeholder: "Search by city & state or zip code",
  },
  location_list: {
    location_title_class: "!text-primary",
    location_title_clickable: false,
    display_distance: false,
    buttons: [
      {
        variant: "outlined",
        text: "LOCATION DETAILS",
        classes: undefined,
        desktop_order: 1,
        mobile_order: 1,
        location_condition_fields: [],
        local_offers_titles: [],
        url: "/locations/{location_slug}",
      },
      {
        variant: "fill",
        text: "CLAIM OFFER",
        classes: undefined,
        desktop_order: 2,
        mobile_order: 2,
        location_condition_fields: ["has-online-join"],
        local_offers_titles: [
          "join for $1",
          "join & get the rest of the year free",
        ],
      },
    ],
  },
  lead_form: {
    enabled: true,
    title: "TELL US ABOUT YOU",
    selected_location_title: "SELECTED LOCATION",
    description: "All fields are required",
    cta_text: "Submit",
    bat_variant: "addon",
    footer_variant: "default",
    lead_source_code: LeadSourceCode.EVENT_PROMO_FALL_2025,
    workflow_name: "local-offer-join-for-one-dollar",
  },
}
```
 This is how the buttons **action** **/** **CTAAction** is determined:

- **Book a Tour → cannot** be embedded within events pages. Users will always be redirected off the events page to complete this flow.
- **Lead Form Page Redirect (Missing Pages) → **This option cannot be used if the locale does not have the corresponding lead form page (e.g., AU does not have Try Us Free).
- **Lead Form Page Redirect → Lead Source Codes → **Redirected leads will inherit the **default** lead source code and workflow name for that specific lead form. If a unique source code is required, use **Lead Form In-Page (Option #4)**.
- Note: Only **one** unique lead source code can be set per events page; it cannot be dynamically switched.
- **Online Signup → **Gym owner’s outside the US market, must provide their online signup URL in the AF dashboard. If they haven’t done this, then this button will not show for them.  If this button doesn’t show, then the gym won’t show in the search results.
- **JOIN NOW + CLAIM OFFER → **Each online signup URL is unique and must be deeplinked when its associated to a Local Offer.  If the gym is signed up for the local offer but doesn’t have this deeplink, then it will always show local offers.
- **Important Operational Note: CTA Buttons → **Lead source codes, workflow names, and local offer configurations **must be coordinated with AF Engineering in advance.**
 **The Events 2.0 abstraction encompasses the following Anytime Fitness Events.** **United States (default):****Page Name: **Promo**URL:**

**(Step 2) → Choose your gym: **When the user visits** **`/events/{eventName}?location={cityKeyword}` where the **"location"** param is specified, a GET `/api/search-locations/` API call is made with the location data and the workflow will load with a list of gyms that belong to that city.Here the user will select a gym from the list, they are sorted in ascending order by their **approximate_distance** and the **top 10 **is displayed here.**(Step 3) → Submit form: **When the user visits** **`/events/{eventName}?location_id={gymId}`  where the **"location_id"** param is specified, the workflow will load in the **Lead Form** step where the user will fill the Lead Form data to finish the workflow.

## 4.1 iFrame documentation
- **iFrame Name: **Events 2.0
- **iFrame URL: **[https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps}](https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps})
- **Purpose & Functionality:**
- **Purpose: **The purpose of this iframe is to load a multi-step form to complete the Events 2.0 workflow.
- **Functionality:**
**(Step 1) → Find your gym: **When the user visits** **`/events/{eventName}` without any param (like **"location"** or **"location_id"**) the workflow will load into the Search Bar.Here 

### resources/webflow-components-aHR0cHM6Ly9h.md
# Webflow Components

## Buttons and Badges
- Badge Label
- Badge Store
- Button AF
- Button AF Long
- Button Multiline
- Button Social
- Button Text

- **Local Gym Page (local landing page) - **The Navigation Bar's CTA button changes on the LLP gym pages dependant on the gym status.  
- See: [https://otbeat.atlassian.net/browse/AFW-2492](https://otbeat.atlassian.net/browse/AFW-2492) 
- See: [https://otbeat.atlassian.net/browse/AFW-3041](https://otbeat.atlassian.net/browse/AFW-3041)
- **Ireland (IE) and United Kingdom (GB) | Member Benefits Link** - This is an external link on purpose.  Do not link to /member-benefits page.

## Events
- Events - Location Search
- Events - Accordion
- Events - Apple Fitness+
- Events - Callout
- Events - CTA Block
- Events - Disclaimer
- Events - Feature Checklist
- Events - Hero Two Columns Strecht
- Events - iframe
- Events - Membership Benefits
- Events - Nearby Locations
- Events - Open Video Modal
- Events - Page CSS
- Events - Promo iframe
- Events - Success Stories
- Events - Terms Modal
- Events - Watch Video Button
- Events - YouTube Modal

**Functionality & Behaviour**This Component was created for Accessibility reasons as request from the Client.Whenever a User is navigating at the Anytime Fitness App, he can do it with the keyboard, in this case when a User escapes main menu a “Skip Navigation” buttons appears, the User can click on that button and will jump into ContentNote that it is not needed on pages with Component "PurposeBrands NavBar" as that Component has already the button

[Webflowbranch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons](https://branch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons)

- Variant (currently there are two: Block heading and Base)
- Section: id, visibility and grey background
- Heading: tag, text part 1, text part 2, and visibility for text purple, text aqua and text orange
- Summary: text and visibility
- Links 1 to 4: Text and link properties
- Button variant: This affects the three firsts buttons

- Section: id, visibility, grey background
- Summary: Text and visibility
- Heading: Tag, text part 1 and 2, visibility for text purple, orange and aqua
- Card headings:  Heading tag, visibility for Purple, Black and violet heading, h1 subheading tag, Subheading black, violet and purple visibility
- Button: Variant, Icon Visibility, Open Link, Open Modal, Modal Button Variant
- Collection: Filters and Sort

- Variant (Base or Inline Text Heading)
- Section: id and visibility
- Heading: Tag, Text Part 1, 2 and 3, visibility for text part3 text aqua, orange and red
- Summary: Text and Visibility
- Cards Heading Tag
- Card (1 to 3): Image, image alt tex, heading text, summary text, all button properties, card visibility

- Link
- Text
- Variant
- Id (this is only used for connecting the button to the Calendly Component)
- Visibility
 All these properties default values can be edited for each Locale. You can also override the CTA properties per page if needed. RTL ConfigurationRecently we introduced Locales for Arab countries, so for example for ar-sa, check that everything goes right to left: items, expanding, etc.This means that  all Navbars for RTL Locales should have the variant RTL

- h1 white text
- h1 aqua text
- Main Paragraph
- Main Image
- Terms & Conditions text
- Disclaimer text
- Disclaimer link: Usually instead of a page/url it links to a section id (there should be other section in the page with the id)
- Call to Action Button

- Apple Logo
- Main text
- Main paragraph
- Right Image
- Call to Action Button Properties (Compoment Button AF)
- Disclaimer Text, Link, Visibility, Variant, etc.

- Visibility 
- Text to be display
- Page where it links whether it is a page or an external page
- Aria Label for the button. We only use Aria Labels when opening in a new tab, we don't want to be redundat
 For the CTA you can set up:

## Buttons & Badges
Buttons and Badges

- Section: id and visibility
- Left Column: logo, heading tag and text, summary text, button text and link properties, disclaimer text, terms link text, logo alt text
- Right Column: Image and Alt text

These pages have all the same structrue, they are created from a Webflow Template Page called Events Template. This is the page structure for all the Events pages:

Feedback Button is not used anymore. We use it with code instead. So at Site Settings > Custom Code > Footer Code we have the code to add that Feedback button that you see the whole site

- Variant (Base or Inline banner text)
- Section: id and visibility
- Heading: tag, eyebrow, Heading text part 1,2 and 3, visibility for text aqua, orange, red and eyebrow
- Summary: Rich Text and Visibility
- Button: Link properties, label, id, variant and visibility
- Disclaimer: Visibility and Rich Text
- Image: img and alt text

No properties here. Modal is triggered from Component Events - Apple Fitness+ with button "See details" using Webflow Native Interactions

This is a Modal. It is triggered by a button with Webflow Native Interactions.Be aware, do not edit this interactions as it may affect other pages.

- Company items and links
- Gyms items and links
- Members items and links
- Shop items and links
- Social items and links
 All the default values properties can be set up for each Locale.You can play with visibility if a Locale does not have some of them, for example for Shop items, just place them as hidden.The Footer Component is connected both to:

[Webflowbranch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#badges-labels](https://branch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#badges-labels)

Here a list of all the available Components in the project, you can see the number of instances and the pages where they are implemented (right button > Show instances)

The Component is used in pages where a Booking process is being executed, so we don’t want to disturb the User with any other thing. That is the reason why there are no NavBar links or CTAs in the ComponentOnly the Brand logo could be changed just in case there is a rebranding

Has main information about the Event, the main heading of the page, a main picture and a Call to Action button.

Note that text properties by now are not translated in Crowdin so you should be aware.Every button has different properties where you can set:

The Component is used in pages where a Booking process is being executed, so we don’t want to disturb the User with any other thing. That is the reason why there are no NavBar links or CTAs in the Component

Wherever Component Location Search is used. Inside Component Location Search, you will find Events iframe which controls the iframe inside

### Events - Watch Video Button 
**Page Usage & Scope**

### Skip Navigation
**Page Usage & Scope**On all pages with Localization NavBar. The Component should be present on every page where there is a Navigation Bar. There are some cases where the Navigation Bar just has a logo, not needed for this casesDynamic pages should have also this Component present.

You can search gyms in an area: City, Address, State and the Component will give you results.For any result you can go to the "Free Trial page" or to the "Local Gym page"

Component is connected to CMS Blogs CCC. If fields are not filled it will show empty.Share buttons are ready to share the Blog Post to the Social Media platform related.

### Button Text
**Page Usage & Scope**

- Section: id, visibility and grey background
- Heading: tag, eyebrow text, heading text part 1, heading text part 2. Visibility for: text purple, text orange, text aqua, eyebrow
- Summary text (this is a rich text you can edit directly on properties)

Shows a Title and different button options to help User find what he wants

This Component has a lot of properties and even a Button AF Component inside.
…

Output ONLY the JSON object. No STEP lines. No GATE line. No markdown except a ```json fence if needed.

Analyst contract (do not contradict):
{
  "testable": true,
  "blocked": false,
  "inScope": [
    "On Webflow, clicking a PurposeBrands / localization navbar menu item fires Rudderstack track event with event name \"Button Clicked\" and properties element_id, placement, text, and location_id when available (e.g. observed payload pattern: element_id \"navbar-try-us-free\", placement \"navbar\", text \"TRY US FREE\").",
    "On Webflow core pages (home, training, why join), clicking pill-style CTA buttons only fires \"Button Clicked\" with the documented element_id and placement for that CTA.",
    "On Webflow LLP (Local Gym Page / local landing page), clicking in-scope CTAs and links per AFW-4043 fires \"Button Clicked\": CTA pill buttons, hero banner links, and pre-footer links.",
    "On React Find A Gym / locations flow at /locations, clicking Gym Map CTAs (Join Card, Map Pins) fires \"Button Clicked\" with location_id when the gym context is available.",
    "On React locations results step, clicking each presented pill CTA (both CTAs when two are shown) fires \"Button Clicked\".",
    "On React locations search, clicking \"Use precise location\" (or equivalent documented control) fires \"Button Clicked\".",
    "On React, clicking Submit on in-scope lead forms fires \"Button Clicked\" for form submit actions listed on the ticket (including edit location, local offers — visit LLP, Join Now Card CTA pill).",
    "On React Book a tour (visit) flow, the first date selection and the first time selection each fire \"Button Clicked\" exactly once per selection type; subsequent date/time re-selections do not fire duplicate first-selection events; placement names are human-readable per ticket note.",
    "On React (post 2026-08-24 scope), Add to Calendar: \"Button Clicked\" fires only after the user selects one calendar option (Google, Apple, Outlook, etc.), with the same element_id and placement regardless of option; text may reflect the chosen provider.",
    "On React Find A Gym, selecting a country/locale from SELECT COUNTRY dropdown fires \"Button Clicked\" only on country/locale click (AFW-4173 / PM confirmation).",
    "On schedule-an-appointment-online See You Soon thank-you page (e.g. ?location_id=9991402), buttons on that page fire \"Button Clicked\" when clicked (AFW-4083 fix verification).",
    "LLP hero \"EXPLORE MEMBERSHIPS\" fires \"Button Clicked\" with element_id \"llp-explore-membership\" (not \"llp-join-now\") per AFW-4174.",
    "LLP AF+ \"TRY US FREE\" (or equivalent) fires \"Button Clicked\" with element_id \"llp-apple-fitness-offer\" (not \"llp-free-trial\") per AFW-4174.",
    "When location_id (or user_id) is unavailable, payload uses null rather than empty string per UAT standardization comment (Andrew 2026-08-17).",
    "React payloads do not include redundant properties.channel = \"Web\" at properties level when top-level channel is already \"web\" (release gate from ticket comments)."
  ],
  "outOfScope": [
    "Validating Mixpanel dashboards or downstream analytics pipelines beyond Rudderstack \"Button Clicked\" track payload presence and property values.",
    "Proving long-term scalability/maintainability of tagging architecture (acceptance criterion is design/process; not a single UI assertion unless verified via documented inventory/automation pattern in Guru).",
    "Events 2.0 iframe internal CTA configuration and lead-source/workflow coordination (documented as engineering coordination in Events 2.0 knowledge; ticket explicitly scopes React forms and location CTAs separately).",
    "Spike AFW-3325 estimate-only volumes (150K navbar, 934K LLP pills) as functional tests.",
    "Automating Testpad script 27017 or treating Testpad as source of truth for this analysis.",
    "Ireland (IE) and United Kingdom (GB) member benefits external-link navbar behavior unless explicitly listed on Button Clicked inventory (Webflow components note: do not link to /member-benefits)."
  ],
  "ambiguous": [
    "LLP click scope conflict: parent AFW-3951 says \"LLP page clicks (anywhere in the page)\"; subtask AFW-4043 limits to CTA pills, hero banner links, and pre-footer; AFW-4174 asks PM to confirm many additional LLP sections (local offer banner, membership SELECT iframe, freeze/cancel, office hours, virtual tour, etc.). Test plan must follow confirmed inventory, not Jira summary alone.",
    "Spike AFW-3325 listed \"LLP page clicks - pill buttons only\" while later Webflow subtask adds hero and pre-footer — aligns with subtask, not parent \"anywhere\" wording.",
    "AFW-4174 states \"All Links and CTAs only trigger Button Clicked event once, not everytime it's clicked\" as incorrect behavior — expected behavior (fire every click vs once per session/page load) is not defined in injected knowledge.",
    "AFW-4168 navbar defects (delayed event until next page view, double fire with unknown + 200, missing on logo-only navbar and LLP navbar) — fix criteria and expected element_id/placement per link not in injected knowledge.",
    "AFW-4170 \"unknown\" vs 200 delivery status — ticket does not state acceptance criterion that status must always be 200; may be SDK/network observability only.",
    "Full authoritative list of element_id and placement values per control (Button Clicked Inventory Sheet referenced in AFW-4174) is not in injected AF Pixel Catalog or Guru text; only examples: navbar-try-us-free, llp-explore-membership, llp-apple-fitness-offer.",
    "OTF example payload includes studio_id and is_sms_enabled; AF ticket lists only location_id, placement, text, element_id — confirm whether AF must mirror OTF fields.",
    "Environment and BASE_URL for execution (sit.anytimefitness.com vs www.anytimefitness.com vs {env}-react.anytimefitness.com) — subtasks cite SIT and PROD URLs; default test env not in injected knowledge.",
    "Guru documentation existence and content for Button Clicked (acceptance criterion) — not verifiable from injected sources in this message.",
    "Webflow vs React parity for context.traits, sessionStart, userId representation noted in payload comparison — only partially specified as fix items (null vs \"\", remove properties.channel on React)."
  ],
  "knowledgeSources": [
    "Ticket briefing AFW-3951 and subtasks AFW-4041, AFW-4043, AFW-4083, AFW-4168, AFW-4170, AFW-4173, AFW-4174",
    "Linked work AFW-3325, AFW-3813 (scope estimates and Webflow click approach)",
    "Parent AFW-3458 context (Website Scorecard Evolution)",
    "Jira comments (Andrew Vanos): OTF \"Button Clicked\" payload example, Webflow/React payload comparison, null vs \"\" standardization",
    "Injected resources/events-2-0-aHR0cHM6Ly9h.md (Events 2.0, Book a Tour redirect URLs, React iframe pattern — contextual only)",
    "Injected resources/webflow-components-aHR0cHM6Ly9h.md (LLP navbar CTA behavior, PurposeBrands NavBar vs logo-only/booking nav, Location Search, Button AF / pill patterns)",
    "Project knowledge index entry AF Pixel Catalog (file content not injected in this message)"
  ],
  "expectedResults": [
    "event: \"Button Clicked\"",
    "type: \"track\"",
    "channel: \"web\" (top-level)",
    "properties.placement",
    "properties.text",
    "properties.element_id",
    "properties.location_id (when available; otherwise null per UAT note)",
    "Example Webflow navbar: element_id \"navbar-try-us-free\", placement \"navbar\", text \"TRY US FREE\"",
    "LLP correction: element_id \"llp-explore-membership\" for EXPLORE MEMBERSHIPS (AFW-4174)",
    "LLP correction: element_id \"llp-apple-fitness-offer\" for AF+ TRY US FREE CTA (AFW-4174)",
    "Book a tour: first date click and first time click each produce one \"Button Clicked\"; placement labels clear per ticket note",
    "Add to Calendar: event after choosing Google, Apple, Outlook, etc.; shared element_id and placement; dynamic text per provider",
    "SELECT COUNTRY: \"Button Clicked\" on country/locale option click only (AFW-4173)",
    "Lead form redirect examples from Events 2.0 knowledge (context): Book a Tour path schedule-appointment-online with location_id query pattern"
  ],
  "coverageUnderstood": [
    "Rudderstack \"Button Clicked\" instrumentation — Webflow (navbar, LLP, core marketing pages)",
    "Rudderstack \"Button Clicked\" instrumentation — React (locations / Find A Gym, gym map, results pills, forms, book-a-tour visit scheduling, add-to-calendar)",
    "Webflow Local Gym Page (LLP) — navbar variant and page CTAs (webflow-components)",
    "Webflow core templates: home, training, why join — pill buttons only",
    "React locations search and Events-adjacent lead flows (Events 2.0 iframe URL pattern on {env}-react.anytimefitness.com)",
    "Schedule an appointment online / See You Soon thank-you page (subtask AFW-4083)",
    "Booking-flow navbar variant (logo only, no menu CTAs — webflow-components) vs full navbar (AFW-4168)"
  ],
  "testData": [
    "SIT: https://sit.anytimefitness.com/schedule-an-appointment-online?location_id=9991402 (See You Soon thank-you — AFW-4083)",
    "SIT: https://sit.anytimefitness.com/try-us-free?location_id=9993999 (navbar — AFW-4168)",
    "SIT: https://sit.anytimefitness.com/locations/woodbury-minnesota-9993999 (LLP — AFW-4168, AFW-4174)",
    "SIT: https://sit.anytimefitness.com/locations (SELECT COUNTRY — AFW-4173)",
    "PROD example: https://www.anytimefitness.com/locations (status inconsistency evidence — AFW-4170)",
    "SIT AF+ offer page reference: https://sit.anytimefitness.com/apple-fitness-plus-af-members-offer (AFW-4174)",
    "Events 2.0 documented lead URLs with location_id param pattern (e.g. try-us-free, book a tour) from injected Events 2.0 doc"
  ],
  "knowledgeGaps": [
    "Complete Button Clicked inventory sheet mapping (control → element_id, placement, text rules) — referenced in ticket/subtasks but not in injected Pixel Catalog body",
    "Guru documentation pages for Rudderstack Button Clicked setup and maintenance",
    "Canonical placement naming convention for book-a-tour date/time and add-to-calendar controls",
    "Definitive LLP in-scope link list after PM confirmation (AFW-4174 open questions)",
    "Expected Rudderstack network/SDK response status (200 vs unknown) as pass/fail",
    "Whether every click must fire the event vs de-duplication rules site-wide",
    "qa_automation_required implementation constraints (selectors, intercept pattern) — not in injected knowledge",
    "React env host pattern confirmation for gym map and forms testing beyond Events 2.0 iframe URL template"
  ],
  "summary": "AFW-3951 adds consistent Rudderstack track event \"Button Clicked\" (properties: location_id when available, placement, text, element_id) across Webflow navbar menu items, LLP and core-page pill CTAs, and React locations/gym-map pills, form submits, book-a-tour first date/time selections, add-to-calendar after provider choice, and SELECT COUNTRY on Find A Gym. Injected product knowledge covers Webflow LLP/navbar/booking-nav patterns and Events 2.0 lead URLs but not the full element_id inventory or Guru spec; several subtasks document SIT URLs, payload fixes (null vs empty string, LLP element_id corrections), and open scope conflicts on LLP \"all clicks\" versus pills/hero/pre-footer only, plus navbar reliability bugs. Testing is observable via DevTools/network Rudderstack payloads and documented examples such as navbar-try-us-free; Mixpanel and architectural maintainability are out of band unless inventory docs are provided."
}
Discoverer contract (do not contradict):
{
  "existingCoverage": [
    "No feature file, step definition, or @AFW-3951 tag asserts Rudderstack event \"Button Clicked\" (grep across features/pages/utils returns zero matches; Jenkins FEATURE_TAG lists @AFW-3303/@AFW-3952/@AFW-3953/@AFW-3954/@AFW-3956/@AFW-3957 but not @AFW-3951).",
    "Shared Rudderstack network capture and validation in utils/rudderstack.ts: rudderstackRequests(), retrieveRudderstackNetworkLogs(), captureRudderStackEvent(), verifyNoEventTracked(), verifyEventNotTriggered(), OneTrust/consent checks — used by Form Started (AFW-3957), Lead Captured (AFW-3956), page view (AFW-3303), Location Searched/Selected (AFW-3952), Appointment Slot/Scheduled (AFW-3953/3954); none filter or validate event \"Button Clicked\".",
    "step-definitions/rudderstack/afw-3952-location-events.steps.ts + @AFW-3952 scenarios in features/findAGym/find-a-gym.feature, features/bookATourStandalone/book-a-tour.feature, features/contactUs/contact-us.feature, features/membershipInquiry/membership-inquiry.feature, features/locationSearchOnStaticPages/location-search-on-static-pages.feature — cover Location Searched/Selected only, not link/CTA Button Clicked.",
    "step-definitions/rudderstack/afw-3303-page-lead-funnel.steps.ts — page Rudderstack event with lead_funnel_viewed; no Button Clicked.",
    "UI navigation to in-scope surfaces (no RS Button Clicked assert): features/findAGym/find-a-gym.feature TC-S002/S007/S008 (map pin → Visit Website → LLP); features/locationSearchOnStaticPages/location-search-on-static-pages.feature TC-V001+ on Home/Training/Why Join widgets (#locations-widget-iframe, #why-join-iframe); step-definitions/common/common.steps.ts Given The user is on \"local gym\" page (PATHS.LOCAL_GYM); step-definitions/tryUsFree/try-us-free.steps.ts When The user clicks the Try Us Free button in the navbar.",
    "React Location Search 2.0 UI clicks reused across lead flows: pages/common/LocationSearchPage.ts selectGymBtn, gymDetailsBtn, joinNowBtn, clickButtonInSearchResult(); exercised in book-a-tour, try-us-free, membership-inquiry, contact-us, local-offer, mco-offer, events features — UI only.",
    "React Gym Finder (/find-gym) UI: pages/modules/FindAGymPage.ts (#find-gym-iframe, visitWebsiteLink, mapPopup, GET A FREE TRIAL/TRY US FREE result CTAs, clickVisitWebsiteAndWaitForLocalGym, clickMapPinLocationNameAndWaitForLocalGym); features/findAGym/find-a-gym.feature — UI redirect only.",
    "Book a Tour date/time/Add to Calendar UI (no Button Clicked assert): pages/common/BookATourPage.ts datePicker ([aria-labelledby=\"date-selection-label\"] button), timePicker ([aria-labelledby=\"time-selection-label\"] button), addToCalendarBtn/getByRole('button', { name: 'ADD TO CALENDAR' }), addToCalendarGoogleBtn/AppleBtn/OutlookBtn; step-definitions/bookATourStandalone/book-a-tour-standalone.steps.ts Add to Calendar visibility + Google new-tab — UI only.",
    "Form submit UI across flows: pages/common/UserFormPage.ts submitBtn (button[type=\"submit\"], getByTestId('lead-form')); used in all lead-form features — triggers Form Started/Lead Captured RS tests elsewhere, not Button Clicked.",
    "Webflow LLP partial POM: pages/common/LocalGymPage.ts tryUsFreeNavbarBtn (banner link TRY US FREE), scheduleAnAppointmentBtn, membershipInquiryBtn, contactUsBtn, heroSection (.gym-hero-content) — no hero/pre-footer link inventory or data-rs-* asserts.",
    "OneTrust/consent setup for RS: pages/modules/OneTrustPage.ts + Background cookie steps in lead-flow features; features/oneTrust/one-trust.feature — prerequisite for en-us RS (RS_ALLOWED_LOCALES per rudderstack-event-documentation).",
    "step-definitions/staticPage/staticPage.steps.ts @StaticPage — rudderstack page view only on static pages; no Button Clicked.",
    "Manual Testpad plan exists for ticket (Marie Garcia comment: outliantteam.testpad.com/script/27017) — no mirrored automation yet."
  ],
  "reusableComponents": [
    "utils/rudderstack.ts — extend RudderStackProperties with placement, text, element_id; add ButtonClickedTrackingAssertions + capture path mirroring captureRudderStackEvent poll/dedupe (messageId) patterns.",
    "fixtures/base.fixture.ts ScenarioContext.rudderstackCapturedRequests + rudderstackTestEnable flag pattern from AFW-3952/3303 steps.",
    "pages/common/BasePage.ts — getTryUsFreeHeaderLink(), dismissBlockingOverlays(), scrollBelowStickyHeader() for navbar clicks that navigate.",
    "pages/common/LocalGymPage.ts — LLP entry and navbar CTA clicks (extend for hero/pre-footer/section links).",
    "pages/common/LocationSearchPage.ts — selectGymBtn, gymDetailsBtn, joinNowBtn, clickButtonInSearchResult(gymName, label); iframe IDs book-a-tour-iframe, membership-inquiry-iframe, etc.",
    "pages/modules/FindAGymPage.ts — #find-gym-iframe, map pin popup, visitWebsiteLink, free-trial result CTAs, seedInLocaleGeolocation(), mock ipstack.",
    "pages/modules/LocationSearchOnStaticPagesPage.ts — STATIC_LS_IFRAME_IDS (home: locations-widget-iframe, whyJoin: why-join-iframe), WHY_JOIN_RESULT_CTA_RE, Use my precise location flows, PATHS.HOME/TRAINING/WHY_JOIN.",
    "pages/common/BookATourPage.ts — schedule date/time pickers and Add to Calendar menu buttons (first-click-only / option-selected rules).",
    "pages/common/UserFormPage.ts — submitBtn and fillAndSubmitForm for form Submit Form scenarios.",
    "pages/modules/OneTrustPage.ts — acceptAllCookies() before RS capture on en-us.",
    "utils/tracking/*-rs-tracking.ts pattern (e.g. location-search-rs-tracking.ts, form-started-rs-tracking.ts) — model per-surface expected placement/element_id map for planner Given/Then.",
    "step-definitions/common/common.steps.ts — Given The user is on \"{page}\" page for Home, Training, Find Gym, Local Gym, Try Us Free, Book A Tour paths via PATHS constants.",
    "utils/constants/index.ts PATHS (HOME '/', TRAINING '/training', WHY_JOIN '/membership', FIND_GYM '/find-gym', LOCATIONS '/locations', LOCAL_GYM_PAGE '/locations/woodbury-minnesota-9993999', BOOK_TOUR_STANDALONE '/schedule-an-appointment-online').",
    "Jenkinsfile FEATURE_SPECIFIC tag slot — add @AFW-3951 alongside existing @AFW-3952 etc."
  ],
  "existingTestData": [
    "TestDataKeys.Locations.ClubId / LocalGym / Gyms.Default via locale-manager Local Config (EN-US club 9993999, slug woodbury-minnesota-9993999).",
    "resources/locationTestStudio.ts — locale→clubId map (EN-US 9993999).",
    "PATHS.LOCAL_GYM_PAGE = /locations/woodbury-minnesota-9993999 — primary LLP URL in ticket subtasks AFW-4168/4174.",
    "PATHS.BOOK_TOUR_STANDALONE + ?location_id=9991402 — AFW-4083 See You Soon thank-you evidence URL.",
    "PATHS.LOCATIONS = /locations — AFW-4173 SELECT COUNTRY dropdown surface.",
    "LocationSearchOnStaticPagesPage LOCALE_GEO_COORDS + LOCALE_COUNTRY_CODE — IP/geolocation mocks for Home/Training location widgets.",
    "FindAGymPage/LocationSearchPage ipstack mock helpers — in-country search results for map/list CTAs.",
    "Ticket-documented example payload element_id navbar-try-us-free, placement navbar, text TRY US FREE (Andrew comment 2026-08-17) — not yet codified in suite fixtures.",
    "Ticket-documented LLP element_id corrections: llp-explore-membership, llp-apple-fitness-offer (AFW-4174) — absent from automation constants."
  ],
  "missingCoverage": [
    "No assertion that Rudderstack track event \"Button Clicked\" fires with properties location_id, placement, text, element_id after any CTA click (core ticket requirement).",
    "Webflow navbar: no spec asserts Button Clicked for PurposeBrands NavBar menu items (training→blogs delay/double-fire bugs AFW-4168); only try-us-free.steps.ts clicks TRY US FREE without RS assert.",
    "Webflow navbar variants: no coverage for NavBar Just Brand (logo-only booking flows) or LLP navbar (AFW-4168 — most links not firing).",
    "Webflow LLP: no automation for hero banner links, pre-footer links (Address, Virtual Tour, Club Schedule per AFW-4174), pill CTAs, Local Offer banner (Join Now/Learn More), membership plans SELECT/Freeze/Cancel, office hours links, TAKE A VIRTUAL TOUR, AF+ See details — LocalGymPage covers only 4 CTAs.",
    "Webflow core pages: no Button Clicked assert for home/training/why join pill buttons — location-search-on-static-pages.feature validates widget search UI/AFW-3952 Location Searched only.",
    "React Gym Map (/find-gym): no Button Clicked assert for Join Card, map pin popup CTAs, or GET A FREE TRIAL list CTAs despite FindAGymPage UI methods.",
    "React Location Search 2.0 results step: no Button Clicked assert for Select Gym, Gym Details, Join Now pill pair on results cards (LocationSearchPage.clickButtonInSearchResult is UI-only).",
    "React forms: no Button Clicked assert on Submit Form click (distinct from existing Form Started @AFW-3957 and Lead Captured @AFW-3956).",
    "React edit location button: no POM locator or step found in UserFormPage/LocationSearchPage — planner cannot reuse an existing edit-location interaction.",
    "Local Offer flows: no Button Clicked assert for visit LLP page button or Join Now Card CTA pill (LocalOfferPage.joinOnlineCard is UI-only).",
    "React Use precise location / Use Current Location: static widget and gym-finder geolocation clicks exist (location-search-on-static-pages.feature TC-V002–V009, FindAGymPage.clickPreciseLocation) but no Button Clicked assert.",
    "Book a Tour: no Button Clicked assert that first date selection fires once with clear placement; no assert that second date click does not re-fire.",
    "Book a Tour: no Button Clicked assert that first time selection fires once; no assert that second time click does not re-fire.",
    "Add to Calendar: book-a-tour-standalone.steps.ts validates menu visibility and Google tab open — missing assert that Button Clicked fires only after Google/Apple/Outlook option selected with shared element_id/placement and dynamic text.",
    "See You Soon thank-you page (AFW-4083): no Button Clicked assert for confirmation-screen buttons (send trial pass, invite, etc.) after schedule completion.",
    "All Locations /locations (AFW-4173): no feature file or step for SELECT COUNTRY dropdown option click → Button Clicked.",
    "No assert for location_id null vs empty string standardization (Andrew UAT note); existing RS validators do not cover Button Clicked payload.",
    "No assert for duplicate Button Clicked suppression (AFW-4174: links fire only once per session) or duplicate/d delayed navbar fires (AFW-4168).",
    "No assert for incorrect element_id values documented in AFW-4174 (llp-explore-membership vs llp-join-now; llp-apple-fitness-offer vs llp-free-trial).",
    "No inventory-driven mapping file in repo for Button Clicked element_id/placement per CTA (Guru/sheet referenced in ticket; only incidental data-rs-placement read in find-a-gym.steps.ts to skip navbar links)."
  ],
  "filesExpectedToChange": [
    "utils/rudderstack.ts",
    "utils/tracking/button-clicked-rs-tracking.ts (new — flow/surface → expected placement, element_id, text)",
    "step-definitions/rudderstack/afw-3951-button-clicked.steps.ts (new)",
    "pages/common/LocalGymPage.ts",
    "pages/common/LocationSearchPage.ts",
    "pages/modules/FindAGymPage.ts",
    "pages/modules/LocationSearchOnStaticPagesPage.ts",
    "pages/common/BookATourPage.ts",
    "pages/common/UserFormPage.ts",
    "pages/common/BasePage.ts",
    "features/findAGym/find-a-gym.feature",
    "features/locationSearchOnStaticPages/location-search-on-static-pages.feature",
    "features/bookATourStandalone/book-a-tour.feature",
    "features/tryUsFree/try-us-free.feature",
    "features/localOffer/local-offer.feature",
    "step-definitions/findAGym/find-a-gym.steps.ts",
    "step-definitions/bookATourStandalone/book-a-tour-standalone.steps.ts",
    "step-definitions/tryUsFree/try-us-free.steps.ts",
    "step-definitions/common/common.steps.ts",
    "Jenkinsfile",
    "fixtures/base.fixture.ts (if Button Clicked session dedupe state needed)"
  ],
  "risks": [
    "Rudderstack locale gating: RS tracking enabled only for en-us (rudderstack-event-documentation) — automation must stay @US/@desktop like other RS tickets; non-US locales are out of scope for RS asserts.",
    "React iframe clicks forward via postMessage rs_tracking to Webflow parent — capture must bind rudderstackRequests(page) on host page before iframe interaction; remount after Select Gym/schedule handoff can race beacons (known pattern in AFW-3952/3956).",
    "Navbar/LLP clicks trigger full navigation — Button Clicked may appear after page view or be delayed/absent (AFW-4168); tests must distinguish APPLICATION_BUG from capture timing.",
    "Documented open defects (AFW-4083, AFW-4168, AFW-4170, AFW-4173, AFW-4174) mean new automation should hard-fail on missing/wrong events unless explicitly scoped as regression-after-fix.",
    "LLP CMS-driven links and element_id inventory are large/variable — ticket requires scalable tagging (AFW-3813) but repo lacks Button Clicked inventory constants; planner must source element_id/placement from Testpad 27017/Guru, not invent.",
    "First-click-only date/time and once-per-session link rules require session-scoped counting in tests — retrieveRudderstackNetworkLogs currently picks latest match, not fire-count semantics.",
    "location_id null vs \"\" inconsistency between React and Webflow payloads (Andrew 2026-08-17) — assertions need explicit null/empty handling.",
    "No dedicated /locations (All Locations Filter) page object — SELECT COUNTRY (AFW-4173) needs new discovery/locators beyond existing suite.",
    "Edit location control not present in current POMs — may require new locator work in lead-form iframe before automating.",
    "Jenkins has no @AFW-3951 FEATURE_TAG yet — CI will not run ticket automation until Jenkinsfile updated."
  ],
  "locatorHints": [
    "Webflow navbar TRY US FREE: LocalGymPage.tryUsFreeNavbarBtn — getByRole('banner').getByRole('link', { name: 'TRY US FREE' }); BasePage.getTryUsFreeHeaderLink() — header a[href*=\"try-us-free\"]",
    "Webflow navbar mobile: find-a-gym.steps.ts — button.base_mobile-menu-toggle, a.base_nav-link, a.base_sidebar-nav-link; data-rs-placement=\"navbar\" (product attribute, read once in find-a-gym.steps.ts)",
    "LLP hero: LocalGymPage.heroSection (.gym-hero-content)",
    "LLP CTAs: LocalGymPage.scheduleAnAppointmentBtn (link SCHEDULE AN APPOINTMENT), membershipInquiryBtn, contactUsBtn",
    "Home location widget iframe: #locations-widget-iframe (StaticPage.locationWidget, LocationSearchOnStaticPagesPage STATIC_LS_IFRAME_IDS.home)",
    "Why Join widget iframe: #why-join-iframe",
    "Training location widget: LocationSearchOnStaticPagesPage pageKey training/fitness-consultation/group-training/personal-training",
    "Static widget precise location: getByRole('button', { name: /Use my precise location|Use Current Location|Utiliser l'emplacement actuel/i })",
    "Find A Gym iframe: #find-gym-iframe; search input #location-search-input; map popup .mapboxgl-popup; visitWebsiteLink a[href*=\"/locations/\"]",
    "Find A Gym free trial CTA: getByRole('button'|'link', { name: /GET A FREE TRIAL|TRY US FREE|FREE TRIAL/i })",
    "Location Search 2.0 Select Gym: LocationSearchPage.selectGymBtn — getByRole('button', { name: SelectGym translation / SELECT GYM })",
    "Location Search 2.0 Gym Details: LocationSearchPage.gymDetailsBtn — #list-panel button[aria-label=\"Gym Details\"] pattern",
    "Location Search 2.0 Join Now: LocationSearchPage.joinNowBtn",
    "Lead form Submit: UserFormPage.submitBtn — button[type=\"submit\"], getByTestId('lead-form')",
    "Book a Tour date/time: BookATourPage.datePicker/timePicker — [aria-labelledby=\"date-selection-label\"] button / time-selection-label",
    "Book a Tour schedule CTA: BookATourPage.letsDoThisBtn, reserveTimeBtn",
    "Add to Calendar: BookATourPage.addToCalendarBtn; options getByRole('button', { name: 'Google'|'Apple'|'Outlook' })",
    "See You Soon confirmation: BookATourPage.seeYouSoonLabel, sendTrialPassBtn (TranslationKeys.Buttons.SeeYouSoonPage.SendTrialPass)",
    "All Locations country filter: native/custom select on PATHS.LOCATIONS (Guru: Finsweet-enhanced country filter — no suite locator yet)",
    "Deep-link entry URLs: PATHS.LOCAL_GYM_PAGE, ?location_id= from TestDataKeys.Locations.ClubId, disable_captcha=true pattern in common.steps navigateToUrl"
  ],
  "summary": "AFW-3951 has no Button Clicked automation today; the suite already has strong Rudderstack plumbing (utils/rudderstack.ts, AFW-3952/3303/3956/3957 step modules) and rich UI coverage for nearly every click surface named in the ticket (Find A Gym map, Location Search 2.0 result CTAs, Home/Training/Why Join widgets, LLP navbar, Book a Tour date/time/Add to Calendar, form submits). Reuse that network capture and page-object navigation rather than duplicating regression flows, but add a new button-clicked tracking helper, @AFW-3951 steps, and ticket-scoped scenarios that assert event \"Button Clicked\" with placement, text, element_id, and location_id—including first-click-only, once-per-session, and Add-to-Calendar-after-option rules. Gaps are the RS assertion layer itself, LLP/pre-footer/navbar variant inventory, /locations country dropdown, edit-location, and See You Soon thank-you buttons; open bug subtasks and en-us-only RS gating are the main execution risks."
}
Accuracy for this test plan:
- Understand Analyst coverageUnderstood and expectedResults before writing any scenario. Use injected knowledge as the product source of truth.
- Every scenario must be a TESTABLE behaviour from Analyst inScope (or Discoverer missingCoverage when knowledge or the ticket states the expected result).
- Copy expected results verbatim (labels, URLs/paths, event names, thank-you copy, error messages, test data).
- Write automation-ready Given / When / Then: named entry, concrete action, observable assertion. Vague steps are invalid.
- Do not contradict Analyst. Do not duplicate Discoverer existingCoverage unless this change invalidates it.
- If knowledge is thin for a TESTABLE ticket item, still write that item with the concrete names you have and put missing facts in ambiguous.
