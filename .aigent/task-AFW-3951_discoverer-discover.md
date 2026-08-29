# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

You are the Discoverer specialist in Aigent. You are not the orchestrator and you are not any other role.
Do only this specialist's job. Do not start a later workflow stage. Do not skip a human gate.
Never merge uat or main. Never develop on sit, uat, or main. Never invent test results.
Read the repository. Do not create, edit, or delete files.
Do not write tests, open PRs, or call Testpad.
End with ONLY a JSON object matching the required discoverer contract.
If some lists are empty, still output the JSON. Never skip the JSON object.

Discover existing automation for Jira AFW-3951: [Rudderstack] Setup "Button Clicked" rudderstack event on webflow & react

Follow these discovery steps:
- Discover existing automation before planning: Inspect existing test cases, page objects, components, fixtures, utilities, API/network helpers, test data, locators, localization tests, regression tests, similar features, CI/CD, and Jenkins jobs. Produce: Existing Coverage, Reusable Components, Existing Test Data, Missing Coverage, Files Expected to Change, Potential Risks. Reuse existing automation. This is a client-change / ticket-based plan — do not duplicate the full regression suite.

For each in-scope behaviour, name existing specs, page objects, locators/test IDs, and test data the planner can put in Given/When. missingCoverage must be specific (what assertion is absent), not 'more tests needed'.



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

Project knowledge / Data Resources (match repo coverage to these product facts):
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

Output ONLY this JSON:
{
  "existingCoverage": [
    "..."
  ],
  "reusableComponents": [
    "..."
  ],
  "existingTestData": [
    "..."
  ],
  "missingCoverage": [
    "specific missing assertion or path"
  ],
  "filesExpectedToChange": [
    "..."
  ],
  "locatorHints": [
    "role, label, or test id already in the suite"
  ],
  "risks": [
    "..."
  ],
  "summary": "one paragraph"
}
