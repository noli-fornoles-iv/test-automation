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

Analyze regression flows: Email Club

Follow these analysis steps:
- Read the named flows before writing cases: Work only from the flows or regression name you entered, plus the knowledge Aigent already loaded. Do not implement.
Read
- Restate in-scope vs out-of-scope for this pack from the named flows.
- Use the project knowledge text in this run. Quote expected results when they are present.
- Put missing BASE_URL or live pages aside for Execute Run later — they do not stop the plan.
Do not
- Write GATE or refuse the pack because Guru, Google Sheets, or the repository were not opened in this run.
- Invent coverage or start implementation.



The knowledge text below was loaded by Aigent. Use it. Do not pretend you searched sources that are not present.
Do not write a GATE: line. Unread Guru cards, Google Sheets, or repo files are not blockers. Named flows stay TESTABLE.

Pack briefing:
Regression / flows: Email Club
Route to Testpad: QA / Regression Test Template / Main Flows
GENERATE_REGRESSION_TESTPLAN
Generate a regression Testpad plan named: Email Club
Route to Testpad folder: QA / Regression Test Template / Main Flows
Return TicketPlanner JSON for the named flows only. Aigent writes the Testpad script. Do not POST a new script yourself. Do not copy every script in the Regression Test Template.

This run covers ONLY the current slice of "Generating a regression testplan". You must follow the Allowed steps below in order. Do not skip, reorder, or start a later stage that is not in this list.

Allowed steps, in order:
1. Read the named flows before writing cases
   Work only from the flows or regression name you entered, plus the knowledge Aigent already loaded. Do not implement.
Read
- Restate in-scope vs out-of-scope for this pack from the named flows.
- Use the project knowledge text in this run. Quote expected results when they are present.
- Put missing BASE_URL or live pages aside for Execute Run later — they do not stop the plan.
Do not
- Write GATE or refuse the pack because Guru, Google Sheets, or the repository were not opened in this run.
- Invent coverage or start implementation.
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
- Add AMBIGUOUS / EXCLUDED / BLOCKED review rows — omit unknown edges instead
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

Last synced: 2026-08-25T13:22:21.553Z

The agent should read these files before inventing product behavior.

- [Github (AF Resources)](github-af-resources-aHR0cHM6Ly9n.md) — https://github.com/noli-fornoles-iv/af-website-resources
- [Local Status & Flows](local-status-flows-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [Test Gyms](test-gyms-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1XbuWQqf5vnOhIznBNX4d8nn8XCDsmsMg/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [Phone Number Teast Data](phone-number-teast-data-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1oAwlZzcxypQHWgYukxgAJV-ks0MgMlCWoySbE_LRtL0/edit?usp=sharing
- [AF Pixel Catalog](af-pixel-catalog-aHR0cHM6Ly9k.md) — https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true
- [Onboarding a New Locale — Automation Framework & CI](onboarding-a-new-locale-automation-framework-ci-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=5c220b4a-5d1a-4f6c-8192-648bfc3c6cc2
- [Webflow Country Onboarding Guide](webflow-country-onboarding-guide-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=9bfcf6d9-5248-4ef7-8b0f-3829697c3663
- [[Webflow / AWS / React] New locale go live checklist](webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
- [How to Check the React Props Passed from Webflow](how-to-check-the-react-props-passed-from-webflow-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=ad3

### af-pixel-catalog-aHR0cHM6Ly9k.md
# AF Pixel Catalog

Source: https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?usp=sharing&ouid=111837187019928065825&rtpof=true&sd=true

AF Pixel Catalog.xlsx - Google Sheets- - - - Ang JavaScript ay hindi pinagana sa iyong browser, kaya't ang file na ito ay hindi mabuksan. I-enable at i-reload.
Hindi na sinusuportahan ang bersyong ito ng browser. Mag-upgrade sa sinusuportahang browser.[](https://docs.google.com/spreadsheets/?usp=sheets_web)AF Pixel CatalogTab           Ibahagi[Mag-sign in](https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&osid=1&continue=https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?usp%3Dsharing%26ouid%3D111837187019928065825%26rtpof%3Dtrue%26sd%3Dtrue&followup=https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?usp%3Dsharing%26ouid%3D111837187019928065825%26rtpof%3Dtrue%26sd%3Dtrue&ltmpl=sheets&ec=GAZAmwI)FileI-editTingnanIpasokFormatDataMga toolTulongPagiging AccessibleI-debug  Mga hindi na-save na pagbabago sa Drive        Pagiging Accessible  View only     Naglo-load...  
|  | A | B |  | C | D | E | F | G | H | I | J | K | L | N | O | P | Q | R | S | T | U | V | W | X | Y | Z | AA | AB | AC | AD | AE | AF | AG | AH | AI | AJ | AK | AL | AM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Locale | Lead Form Type |  | Lead Flow | Webflow Status | AF Dashboard Status | Start Date | End Date | Join Now Card | URL Example - replace {location_id} as needed | Event | Offer Title (i.e., form_name or API Offer Title) | form_category | location_id | location_name | lead_type | lead_category | lead_source_code (originSource) | userOrigin (API only) | leads | duration | form_type | form_offer | offer_name | offer_scope | offer_type | Work Flow Name | sendConfirmationEmails | Jira Ticket |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | All | National Offers |  | Try Us Free. | Active | Active | - | - | n/a | https://www.anytimefitness.com/try-us-free/?club=2289 | "form_success", | "free trial", | "lead", | Insert Location_id param | Insert Gym Name | "global", | "undefined", | "Web-7day-7". or "Web-1day-1" | Web | "1", | "7 day", "1 day" | intro | free_day_pass | free_{ndDay}day_trial | national | free_trial | contact-nday | TRUE |  |  |  |  |  |  |  |  |  |  |  |
| 3 | All | National Offers |  | Membership Inquiry | Active | Active | - | - | n/a | https://www.anytimefitness.com/membership-inquiry/?club=9993999 | "form_success", | "membership inquiry", | "lead", | Insert Location_id param | Insert Gym Name | "global", | "undefined", | Web-PreMembership | Web | "1", | "undefined", | inquiry | free_day_pass | none | national | none | membership-inquiry | TRUE |  |  |  |  |  |  |  |  |  |  |  |
| 4 | All | National Offers |  | Book A Tour | Active | Active | - | - | n/a | https://www.anytimefitness.com/schedule-an-appointment-online/?club=9993999 | "form_success", | "schedule appointment", | "lead", | Insert Location_id param | Insert Gym Name | "global", | "undefined", | Web-VisitScheduled | Web | "1", | "undefined", | appointment | tour | none | national | none | If standalone, no email / workflow name on prospect creation. Use workflow name ( form-schedule-event-club-os ) for booking an appointment | TRUE |  |  |  |  |  |  |  |  |  |  |  |
| 5 | All | National Offers |  | Apple Fitness Plus Free Trial Offer | Active | Active | - | - | n/a | https://www.anytimefitness.com/apple-fitness-plus-free-trial-offer/?club=2009 | "form_success", | "fitness plus free trial", | "lead", | Insert Location_id param | Insert Gym Name | "global", | "undefined", | Web-7day-FitnessPlus | Web | "1", | "7 day", "1 day" | intro |

### events-2-0-aHR0cHM6Ly9h.md
# Events 2.0

Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=548cd752-fa87-4001-8249-acd0c6cdde93
Updated: 2026-05-09T10:46:51.631Z

## 1. Page Overview - General Info
**Purpose: **Anytime Fitness Events are marketing promotions for lead capture, Events 2.0 is a Webflow + React implementation that abstracts / reuses code and logic to setup them with the main purpose of speeding up their creation / update process. **The main benefits being aimed for are:**

- Quick implementation of new Events through Webflow.
- Quick updates to UI / behavior of existing Events through Webflow.
- Reuse the React logic for Events through a component abstraction + Webflow Data instead of creating a dedicated component for each Event.
- Events can still be individually targeted (through their id) and modified through the React abstraction.
 **Workflow of an Event:**

- Search and select the city.
- Select preferred gym location from that city.
- Fill Lead Form data if necessary, after submission users are redirected to the [BAT Flow](https://app.clickup.com/2227378/v/dc/23z5j-153354/23z5j-156074).
- There are Events that won't have a Lead Form step, but instead redirect the user to an external link to continue the process there.
 **Structure of WebflowEventData / eventProps:**

```
/**
 * Main configuration object for Webflow Events.
 * Used by React to identify the event and configure the UI components.
 */
type WebflowEventData = {
  // Event ID used by React to identify the current event logic
  id: TUFEventID;
  trusted_domains: string[];

  // --- Search Field Configuration ---
  search_field: {
    variant: "default" | "xl"; // Affects the physical size of the search bar
    title?: string;
    placeholder: string;
  };

  // --- Location List Configuration ---
  location_list: {
    location_title_class?: string;    // Custom Tailwind classes for titles
    location_title_clickable?: boolean; // Redirects to Location Page if true
    display_distance?: boolean;         // Shows km/miles distance below title

    // Navigation buttons for each location (Min: 1, Max: 2)
    buttons: Array;
  };

  // --- Lead Form Configuration ---
  lead_form: {
    enabled: boolean;
    title?: string;
    selected_location_title?: string; // e.g., "SELECTED GYM LOCATION"
    description?: string;
    mobile_extra_description?: string;
    cta_text?: string;                // Submission button text
    bat_variant?: "addon";            // Book A Tour variant
    footer_variant?: "default";
    lead_source_code?: string;        // Included in API Payload
    workflow_name?: string;           // Included in API Payload
  };
}

/**
 * Supported Button Actions
 * Determines how React handles the redirect or form trigger.
 */
enum CTAAction {
  LEAD_FORM = "lead-form",
  GYM_PAGE = "gym-page",
  DYNAMIC_PAGE = "dynamic-page",
  BOOK_A_TOUR = "book-a-tour",
  LOCAL_OFFER_JOIN_LINK = "local-offer-join-link",
  LOCAL_OFFER_PLANS_PAGE = "local-offer-plans-page",
  LOCAL_OFFER_CUSTOM_PLAN_PAGE = "local-offer-custom-plan-page",
}

/**
 * Unique Identifiers for Events
 * Categorized by Locale (US / AU).
 */
enum TUFEventID {
  // --- US Events ---
  "promo-event" = "promo-event",
  "free-trial-event" = "free-trial-event",
  "join-online-event" = "join-online-event",
  "train-for-your-life-event" = "train-for-your-life-event",
  "hsa-and-fsa-for-gym-membership" = "hsa-and-fsa-for-gym-membership",

  // --- AU Events ---
  "au-promo-event" = "au-promo-event",
  "au-find-your-fitphoria-event" = "au-find-your-fitphoria-event",
  "au-book-a-tour-event" = "au-book-a-tour-event",
}
```
 This is the representation of the data that Webflow shares with React through the **eventProps** parameter, let's have a quick look about what's the purpose of each part of it:

 

- **id**: Unique identifier used to differentiate the Events on React side, it can be helpful if React needs to apply specific logic for the Event, we want to avoid doing so as much as 

### ga4-datalayer-events-qas-focused-aHR0cHM6Ly9h.md
# GA4 / dataLayer events - QAs focused

Source: https://app.getguru.com/card/iGoq8yxT/GA4-dataLayer-events-QAs-focused
Updated: 2026-08-06T10:20:43.525Z

**How to check:** 

- Open DevTools → Console, or GTM Preview if you use it.
- Look at `dataLayer` / GTM tags for the **event name**.
- Clear site data / use an **incognito** window when re-testing “loads” (some events only fire once per browser session).

## Golden rules

| Rule | What you should see |
| --- | --- |
| Event names below are what appear as event in dataLayer | Match the exact text (e.g. form_loaded, not “Form Loaded”). |
| One form_loaded per form flow per browser session | Closing and reopening the form usually won’t fire it again until a new session. |
| form_success can fire every successful submit | No “once per session” rule. |
| Location in the UI ≠ location on the event | If the location was chosen after form_loaded already ran, that event can have empty club fields. Deep-link with location_id if you need those fields on load. |
| Most form events work on all locales | US-only extras are called out below. |

## Events you care about

### `form_loaded`
**Meaning:** “This lead form experience was loaded for analytics.”

**Typical user steps where you’ll see it**

- Lead flows: Try Us Free, Membership Inquiry, Events with a form, Local/MCO offer form, Book a Tour form, Invite, etc.
- Often as soon as the iframe loads / early in the multi-step flow—not always the moment the last step finally shows the input fields.
**Once per session**

| Test | Expected |
| --- | --- |
| Open page first time this session | form_loaded should appear |
| Close form, come back, or pick another gym without a new session | Usually no second form_loaded |
| New incognito / clear site data | Can fire again |
`Club / location fields (club_id, club_name)`

| How you arrive | What to expect on form_loaded |
| --- | --- |
| Link includes a gym, e.g. ...?location_id=1825 and form is ready with that gym | Club fields should usually be present |
| Open page without gym → search → pick gym → form | Club fields on form_loaded are often empty / missing. That’s expected if the event already fired before a gym was chosen. UI can still show the gym. |
| Same flow, confirm club data after a real submit | Check form_success (below), not a second form_loaded |
**Useful fields**

| Field | Meaning |
| --- | --- |
| form_name | Label for this form / campaign |
| form_category | Often lead |
| club_id / club_name | Gym, only if known when the event fired |
| ChannelMix-style ids | May appear; client id can be blank if GA cookie/handshake is slow |
**Not expected**

- `form_type` / `form_offer` on this event (those belong to RudderStack “Form Started,” not this dataLayer event)
**When you won’t see it**

- Event page with **no lead form** (only “join online” / external links)
- Second open in the **same** session for the same flow

### `form_success`
**Meaning:** “Lead form submitted successfully” (standard lead capture path).

**When**

- User fills form → passes validation/captcha → **successful** submit
- **Not** on validation errors or failed submit
**Every successful submit**

- Submit twice (or fix and resubmit) → can get multiple `form_success`
**Useful fields (standard leads)**

| Field | Meaning |
| --- | --- |
| form_name | Form / campaign name |
| club_id / club_name | Gym used for the lead |
| lead_source_code | Lead source code for that flow |
| leads | Usually "1" |
| lead_type | Flow type (e.g. local vs global style) |
| emailsha256 | Hashed email; may disappear if advertising consent is off |
| duration | e.g. "7 day" or the text "undefined" (normal when no day-pass length) |
| lead_capture_id | Id after a successful create |
**Not expected**

- `form_type` on this event (except franchise—see below)
**When you won’t see it**

- CTA only sends user to **join.anytimefitness.com** / other site **without** submitting the on-page lead form
- Fail submit / captcha / network error

### Spec

### gtm-pixel-tracking-testing-guide-aHR0cHM6Ly9h.md
# GTM + Pixel Tracking Testing Guide

Source: https://app.getguru.com/folders/iGjErE5T/Tools-and-Softwares?activeCard=35da4339-e336-461f-8b15-e849d13bc72f
Updated: 2026-02-26T15:43:47.093Z

## 🎯 Purpose
This guide is for **QA testers new to GTM and pixel tracking**. It walks you through exactly how to test GTM events and verify pixel tracking using Tag Assistant — with real examples from Anytime Fitness.

Pixels are tiny invisible images or scripts that **fire when certain events happen** (like form submissions). They send info to platforms like Facebook Ads, TikTok, or Google Analytics.

GTM controls **when these pixels fire** by listening to **dataLayer events** and triggers configured inside GTM.

## 🧱 GTM Concepts
Think of **Google Tag Manager (GTM)** as your website’s **"control center for tracking."** It lets you track what users do — like clicking buttons or submitting forms — without constantly changing the site’s code.

Here are the 4 core building blocks:

### 🏷 1. **Tags = Messengers**
Tags are code snippets that **send data** to external platforms like:

- Google Analytics
- Facebook Pixel
- TikTok Ads, etc.
🧠 Think of them as:

*“Hey Google, someone just submitted a form!”*

### 🎯 2. **Triggers = When to Fire**
Triggers detect **when** a tag should fire, like watching for a form to be submitted, a button clicked, or an API call completed.

🧠 Think of them as:

*“Only fire the tag if a form is submitted.”*

### 📦 3. **Variables = Data Carriers**
Variables are extracted from the data layer and used by tags to send precise data. Example:

- `club_id`
- `form_name`
- `lead_type`
🧠 Think of them as:

*“Which form? For what club?”*

### 📥 4. **Data Layer = The Inbox**
The **data layer** is a JavaScript object where the site stores all important info. GTM reads this data when deciding what tags to fire.

🧠 Think of it as:

*“The mailbox where the site drops messages like: ‘form_success just happened!’”*

You can type `window.dataLayer` in the browser console to inspec
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
The named flows are TESTABLE. Set testable true and blocked false. inScope is the critical user-visible paths of those flows. Use knowledge when it states expected results. Missing BASE_URL, environment, or unread sheets are not blockers and must not appear in ambiguous.
