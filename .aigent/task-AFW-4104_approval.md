# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

The human reviewed and clicked Approve Testplan for Jira AFW-4104: [Rudderstack][React][Location Searched and Location Selected] Corresponding offer_type and offer_name values should be added on offer related flows with location search
Ticket: https://purposebrands.atlassian.net/browse/AFW-4104

This is an approval check, not a new TicketPlanner run. Do not implement. Do not write files. Do not call Testpad. Do not invent extra coverage.
The CURRENT Testpad plan (including manual QA edits) is the source of truth.
Default to approved: true.

Set approved false ONLY if:
- The Testpad plan has no checkable cases (no Verify rows or nested checks), or
- A NEW TESTABLE requirement (an objective expected result) appears in the ticket or knowledge and is completely absent from the Testpad text (scenarios AND Review/AMBIGUOUS/EXCLUDED/BLOCKED lines).

Do NOT set approved false for:
- AMBIGUOUS, EXCLUDED, BLOCKED, or Review questions already on the plan
- Linked tickets whose open points are already recorded on the plan
- Missing BASE_URL, environment, session_id format, verification method, or variant string format when those are already AMBIGUOUS or BLOCKED
- Coverage you could infer but the ticket did not state as a pass/fail expected result

Open questions belong in summary, with gaps: [].

Output ONLY this JSON:
{ "approved": true, "summary": "why it is ready", "qaEdits": "manual QA changes noticed, or none", "gaps": [] }
or
{ "approved": false, "summary": "why not", "qaEdits": "…", "gaps": ["missing TESTABLE requirement"] }

CURRENT Testpad plan:
Preconditions — RudderStack capture (cookies enabled)
  Install and pin RudderStack Assistant extension: https://chromewebstore.google.com/detail/rudderstack-assistant/mldkpbdooncodocccgjjkjojkneohnif
  Set user cookie settings to ENABLED
  Open Chrome DevTools → Network tab; filter requests containing "dataplane" for RudderStack events
  Use test gym location_id=9993999 (or test_location_id=9993999 where the URL specifies that query param)

Local Offers — 1 Day Pass (location search)
  On https://sit.anytimefitness.com/offer/local/1-day-pass?location_id=9993999&disable_captcha=true with cookies enabled and dataplane capture ready
  Repeat the same checks on UAT: https://uat.anytimefitness.com/offer/local/1-day-pass?location_id=9993999&disable_captcha=true
  Verify page loads the Local Offer flow with location search component visible
  Desktop — Chrome
    Use Desktop Chrome with DevTools Network filtered to "dataplane"
    Location Searched
      On the Local Offer page, use the location search control to run a search (e.g. city, state, or zip) that returns results
      Verify RudderStack event "Location Searched" fires on dataplane after the search
      Verify event properties include form_type = local_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = local_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for this offer (1-day-pass local offer)
      Verify event properties include offer_type matches Webflow CMS for this offer (1-day-pass local offer)
    Location Selected
      From location search results on the Local Offer page, select a participating gym/location
      Verify RudderStack event "Location Selected" fires on dataplane after selection
      Verify event properties include form_type = local_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = local_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for this offer (1-day-pass local offer)
      Verify event properties include offer_type matches Webflow CMS for this offer (1-day-pass local offer)
    Form Started
      With a location selected on the Local Offer page, focus or interact with the lead form so Form Started is triggered per flow behavior
      Verify RudderStack event "Form Started" fires on dataplane
      Verify event properties include form_type = local_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = local_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for this offer (1-day-pass local offer)
      Verify event properties include offer_type matches Webflow CMS for this offer (1-day-pass local offer)
    Lead Captured
      Complete required lead form fields on the Local Offer page and submit successfully through to Thank You / confirmation
      Verify RudderStack event "Lead Captured" fires on dataplane on successful submit
      Verify event properties include form_type = local_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = local_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for this offer (1-day-pass local offer)
      Verify event properties include offer_type matches Webflow CMS for this offer (1-day-pass local offer)

Group Offers — Join for $1 / MCO (location search)
  On https://sit.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true with cookies enabled and dataplane capture ready
  Repeat the same checks on UAT: https://uat.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true
  Verify page title/hero includes "Join for $1" offer copy on the Group Offer page
  Verify location search or participating gyms list supports search/select for offer-related location (MCO flow per ticket evidence image-20260812-154022.png vs image-20260812-160545.png)
  Desktop — Chrome
    Use Desktop Chrome with DevTools Network filtered to "dataplane"
    Location Searched (MCO regression — was blank on UAT post AFW-3434)
      On the Group Offer (join-for-one-dollar-offer) page, use location search to run a search that returns results (or interact with location search component as on page)
      Verify RudderStack event "Location Searched" fires on dataplane after the search
      Verify event properties include form_type = group_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = group_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name is not empty and matches Webflow CMS for join-for-one-dollar group offer (expected state per ticket image-20260812-160545.png; fail state per image-20260812-154022.png blank offer_name)
      Verify event properties include offer_type is not empty and matches Webflow CMS for join-for-one-dollar group offer
    Location Selected
      From location search results on the Group Offer page, select a participating gym/location
      Verify RudderStack event "Location Selected" fires on dataplane after selection
      Verify event properties include form_type = group_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = group_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-for-one-dollar group offer
      Verify event properties include offer_type matches Webflow CMS for join-for-one-dollar group offer
    Form Started
      With location context set on the Group Offer page, interact with the lead form to trigger Form Started
      Verify RudderStack event "Form Started" fires on dataplane
      Verify event properties include form_type = group_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = group_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-for-one-dollar group offer
      Verify event properties include offer_type matches Webflow CMS for join-for-one-dollar group offer
    Lead Captured
      Complete required lead form fields on the Group Offer page and submit successfully through to Thank You / confirmation
      Verify RudderStack event "Lead Captured" fires on dataplane on successful submit
      Verify event properties include form_type = group_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = group_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-for-one-dollar group offer
      Verify event properties include offer_type matches Webflow CMS for join-for-one-dollar group offer

Member Offers — Join Transformation Challenge (location search)
  On https://sit.anytimefitness.com/offer/members/join-transformation-challenge?location_id=9993999 with cookies enabled and dataplane capture ready
  On UAT use the equivalent URL: https://uat.anytimefitness.com/offer/members/join-transformation-challenge?location_id=9993999
  Verify page loads the Member Offer flow with location search component visible
  Desktop — Chrome
    Use Desktop Chrome with DevTools Network filtered to "dataplane"
    Location Searched
      On the Member Offer page, use the location search control to run a search that returns results
      Verify RudderStack event "Location Searched" fires on dataplane after the search
      Verify event properties include form_type = member_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = member_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-transformation-challenge member offer
      Verify event properties include offer_type matches Webflow CMS for join-transformation-challenge member offer
    Location Selected
      From location search results on the Member Offer page, select a participating gym/location
      Verify RudderStack event "Location Selected" fires on dataplane after selection
      Verify event properties include form_type = member_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = member_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-transformation-challenge member offer
      Verify event properties include offer_type matches Webflow CMS for join-transformation-challenge member offer
    Form Started
      With a location selected on the Member Offer page, interact with the lead form to trigger Form Started
      Verify RudderStack event "Form Started" fires on dataplane
      Verify event properties include form_type = member_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = member_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-transformation-challenge member offer
      Verify event properties include offer_type matches Webflow CMS for join-transformation-challenge member offer
    Lead Captured
      Complete required lead form fields on the Member Offer page and submit successfully through to Thank You / confirmation
      Verify RudderStack event "Lead Captured" fires on dataplane on successful submit
      Verify event properties include form_type = member_offer
      Verify event properties include form_offer = general
      Verify event properties include form_id = member_offer_general
      Verify event properties include offer_scope = local
      Verify event properties include offer_name matches Webflow CMS for join-transformation-challenge member offer
      Verify event properties include offer_type matches Webflow CMS for join-transformation-challenge member offer

Events — Promo (location search)
  On https://sit.anytimefitness.com/events/promo with cookies enabled and dataplane capture ready
  Repeat the same checks on UAT: https://uat.anytimefitness.com/events/promo
  Verify Events Promo page shows location search with title "FIND YOUR GYM" and placeholder "Search by city & state or zip code" (promo-event configuration)
  Verify "GET STARTED NOW." sections include copy "Find your nearest Anytime Fitness location to get started in the gym or online."
  Desktop — Chrome
    Use Desktop Chrome with DevTools Network filtered to "dataplane"
    Location Searched
      On https://sit.anytimefitness.com/events/promo (or UAT equivalent), enter a city/state or zip in the "FIND YOUR GYM" search field and execute search
      Verify RudderStack event "Location Searched" fires on dataplane after the search (expected state per ticket image-20260812-160707.png)
      Verify event properties include form_type = event
      Verify event properties include form_offer = general
      Verify event properties include form_id = event_general
      Verify event properties include offer_scope = national
      Verify event properties include offer_name matches Webflow CMS for Events Promo offer (per ticket image-20260812-161122.png)
      Verify event properties include offer_type matches Webflow CMS for Events Promo offer
    Location Selected
      From Events Promo search results list, select a location row (or primary selection action on a result)
      Verify RudderStack event "Location Selected" fires on dataplane after selection
      Verify event properties include form_type = event
      Verify event properties include form_offer = general
      Verify event properties include form_id = event_general
      Verify event properties include offer_scope = national
      Verify event properties include offer_name matches Webflow CMS for Events Promo offer
      Verify event properties include offer_type matches Webflow CMS for Events Promo offer
    In-page lead form — Form Started
      After selecting a location on Events Promo, proceed to in-page lead form "TELL US ABOUT YOU" with "SELECTED LOCATION" and required fields description "All fields are required"
      Verify RudderStack event "Form Started" fires on dataplane when the lead form is started
      Verify event properties include form_type = event
      Verify event properties include form_offer = general
      Verify event properties include form_id = event_general
      Verify event properties include offer_scope = national
      Verify event properties include offer_name matches Webflow CMS for Events Promo offer
      Verify event properties include offer_type matches Webflow CMS for Events Promo offer
    In-page lead form — Lead Captured
      Complete all required fields on Events Promo lead form and click Submit CTA "Submit" successfully
      Verify RudderStack event "Lead Captured" fires on dataplane on successful submit
      Verify event properties include form_type = event
      Verify event properties include form_offer = general
      Verify event properties include form_id = event_general
      Verify event properties include offer_scope = national
      Verify event properties include offer_name matches Webflow CMS for Events Promo offer
      Verify event properties include offer_type matches Webflow CMS for Events Promo offer
    Events Promo — CLAIM OFFER path (location with online join)
      Run location search on Events Promo until a result shows primary CTA "CLAIM OFFER" for an eligible gym (local offers titles include "join for $1" or "join & get the rest of the year free" per promo-event config)
      Verify after location search on this path RudderStack "Location Searched" includes offer_name matches Webflow CMS for Events Promo offer
      Verify after location search on this path RudderStack "Location Searched" includes offer_type matches Webflow CMS for Events Promo offer
      Verify after selecting that location RudderStack "Location Selected" includes offer_name matches Webflow CMS for Events Promo offer
      Verify after selecting that location RudderStack "Location Selected" includes offer_type matches Webflow CMS for Events Promo offer
    Events Promo — LOCATION DETAILS path
      Run location search on Events Promo and use outlined button "LOCATION DETAILS" on a result (navigates to /locations/{location_slug})
      Verify RudderStack "Location Searched" on the search step includes form_id = event_general and offer_scope = national with offer_name and offer_type matching Webflow CMS for Events Promo
      Verify RudderStack "Location Selected" fires if selection occurs before navigation and includes offer_name and offer_type matching Webflow CMS for Events Promo

Cross-flow — offer_scope on Location Searched and Location Selected
  With dataplane capture enabled, compare payloads across the four offer surfaces after identical search/select actions where applicable
  Verify Local Offer Location Searched and Location Selected both set offer_scope = local
  Verify Group Offer Location Searched and Location Selected both set offer_scope = local
  Verify Member Offer Location Searched and Location Selected both set offer_scope = local
  Verify Events Promo Location Searched and Location Selected both set offer_scope = national

Ticket briefing:
Ticket AFW-4104: [Rudderstack][React][Location Searched and Location Selected] Corresponding offer_type and offer_name values should be added on offer related flows with location search
URL: https://purposebrands.atlassian.net/browse/AFW-4104
Status: Ready for UAT · Type: Bug · Labels: abby, mapi, qa_automation_completed, qa_automation_testplan_needs_review
Parent: AFW-2316 — AF US Maintenance & Bugs Tracker 2026
Description:
URL:- https://uat.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true (https://uat.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true)
- https://uat.anytimefitness.com/events/promo (https://uat.anytimefitness.com/events/promo)
Platform:
  Device Type:
 All Device Used:
 Chrome Devtools in Desktop Browser:
 Chrome Viewport/s:
 All Description: 
Location Searched and Location Selected RS events on offer related flows with location search components, should have offer_type and offer_name values added from their corresponding offer from Webflow. As per checking on UAT right now after AFW-3434 was pushed to UAT, only MCO offer’s Location Searched has it blank.  Actual:[image: image-20260812-154022.png]Expected:MCO: [image: image-20260812-160545.png]Events Promo:[image: image-20260812-160707.png][image: image-20260812-161122.png]
Subtasks: none
Linked work items: none
Attachments:
- image-20260812-154022.png (image/png, 736618 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260812-160545.png (image/png, 67760 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260812-160707.png (image/png, 180842 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260812-161122.png (image/png, 180072 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
- image-20260813-094242.png (image/png, 538501 bytes) — image attached on the ticket; use filename/alt as evidence, do not invent pixels.
Conversation / comments:
- Arbaz Sheraz (2026-08-13): Evidence:[image: image-20260813-094242.png]
- Marie Garcia (2026-08-24): Test plan Guest Link: 
https://outliantteam.testpad.com/script/27017/report?auth=64f42b397dcb8e8bdf5726e26a2b7232
 Test plan: 
https://outliantteam.testpad.com/script/27017#88/1/ (https://outliantteam.testpad.com/script/27017#88/1/) https://outliantteam.testpad.com/script/27017/report?auth=64f42b397dcb8e8bdf5726e26a2b7232 https://outliantteam.testpad.com/script/27017#88/1/
- Marie Garcia (2026-08-26): Overall Testing Results: QA PASSEDTested on:   Environment: 
SIT Environment   URLs:- Group Offer: 
https://sit.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true (https://sit.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true)
- Events - Promo: 
https://sit.anytimefitness.com/events/promo (https://sit.anytimefitness.com/events/promo)
Platform:
 Desktop at Chrome browser onlyTest Report: 
https://outliantteam.testpad.com/script/27017/report?auth=64f42b397dcb8e8bdf5726e26a2b7232
 Evidence:Group Offer:https://drive.google.com/file/d/18OOjpWOZcTh38HRebrVkeAo27jsRr399/view?usp=sharing
 Events Promo:https://drive.google.com/file/d/1eiGjrkaPufVtO_MPysISQaV71XECq3fw/view?usp=sharing https://sit.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true https://sit.anytimefitness.com/events/promo https://outliantteam.testpad.com/script/27017/report?auth=64f42b397dcb8e8bdf5726e26a2b7232 https://drive.google.com/file/d/18OOjpWOZcTh38HRebrVkeAo27jsRr399/view?usp=sharing https://drive.google.com/file/d/1eiGjrkaPufVtO_MPysISQaV71XECq3fw/view?usp=sharing
Details from links inside this ticket:
- https://outliantteam.testpad.com/script/27017/report?auth=64f42b397dcb8e8bdf5726e26a2b7232
TESTPAD REPORT | outliantteam TEST REPORT New here? This is lightweight test management by Testpad Try Testpad Free Pass 34 Fail 7 Blocked 10 Query 3 54 / 84 tests run 64% ANYTIME FITNESS SIT / Sprint Folders / Sprint 34 AFW-[3434,4104,3951, 4122] Rudderstack Tasks for Sprint 34 number tester date OS device type device name browser 1 Mapi 24 Jun 2026 Windows 10 Desktop Chrome 1 Note: Install Rudderstack Debugger extension and pin it on your browser for easy access - https://chromewebstore.google.com/detail/rudderstack-assistant/mldkpbdooncodocccgjjkjojkneohnif 2 Cookies are ENABLED 3 Preconditions: 4 User has their cookie settings ENABLED 5 Open Chrome Devtools and go to Network Tab. Search for &quot;dataplane&quot; to check for Rudderstack events and &quot;/api&quot; for site&#x27;s API responses 6 Tickets: 7 AFW-3434 [Offers Related Flows]: 8 General Test Steps: 9 Go to an Offer related flow page - <env>.anytimefitness.com/<locale>/<flow-slug>?location_id=<test-gym> 10 Go through with the flow until the Thank You page 11 Verify that the following params are added and reflects correct values depending on the offer and webflow CMS: 12 offer_name offer_type offer_scope 13 Verify that these offer related params are added under properties of the following RS Events: 14 AFW-4104: 15 Location Searched &#x2020; 16 Location Selected &#x2020; 17 Form Started 18 Lead Captured 19 Verify that these implementations are working properly on the following offer related flows: 20 Local Offers - <env>.anytimefitness.com/offer/local/1-day-pass?location_id=9993999&disable_captcha=true form_type = local_offer form_offer = general offer_name = [Dynamic Variable pulled from webflow] offer_scope = local offer_type = [Dynamic Variable pulled from webflow] form_id = local_offer_general &#x2020; 21 Group Offers - <env>.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true form_type = group_offer form_offer = general offer_name = [Dynamic Variable pulled from webflow] offer_scope = local offer_type = [Dynamic Variable pulled from webflow] form_id = group_offer_general &#x2020; 22 Member Offers - <env>.anytimefitness.com/offer/members/join-transformation-challenge?location_id=9993999 form_type = member_offer form_offer = general offer_name = [Dynamic Variable pulled from webflow] offer_scope = local offer_type = [Dynamic Variable pulled from webflow] form_id = member_offer_general https://purposebrands.atlassian.net/browse/AFW-4166 &#x2020; 23 Events - Promo - <env>.anytimefitness.com/events/promo form_type = event form_offer = general offer_name = [Dynamic Variable pulled from webflow] offer_scope = national offer_type = [Dynamic Variable pulled from webflow] form_id = event_general &#x2020; 24 AFW-3951 [Button Clicked Event]: 25 Verify that Button Clicked events params are added whenever event is triggered: 26 location_id (if available) placement text element_id Refer to this sheet for the list of CTAs that should trigger Button Clicked event - https://docs.google.com/spreadsheets/d/1uJGcWu-hnLYCnh_3VXtxOr9U9iTvPKlRNYCP_9xqpmY/edit?gid=1432397584#gid=1432397584 27 [AFW-4043] Navbar 28 Verify that when AF logo triggers Button Clicked RS event with the appropriate property values every time it is clicked by user https://purposebrands.atlassian.net/browse/AFW-4168 29 Verify that all navbar link items trigger Button Clicked RS event with the appropriate property values every time it is clicked by user https://purposebrands.atlassian.net/browse/AFW-4168 30 Verify that navbar CTA triggers Button Clicked RS event with the appropriate property values every time it is clicked by user https://purposebrands.atlassian.net/browse/AFW-4168 31 [AFW-4041] Locations (Find A Gym) - <env>.anytimefitness.com/locations 32 React Gym Map CTA button clicks (Join Card, Map Pins) &#x2021; 33 Results List Links and CTA &#x2020; 34 Select Country Dropdown Options https://purposebrands.atlassian.net/browse/AFW-4173 35 [AFW-4041] Flows 36 Verify that the following CTAs on these flow related components are triggering Button Clicked event: 37 Location Search 38 Pill buttons on the locations results 39 React Gym Map CTA button clicks (Join Card, Map Pins) ? &#x2020; 40 &quot;Use my precise location&quot; CTA 41 Forms 42 If user clicks the edit location button 43 User clicks button to visit LLP page (e.g. Local offers, Group Offers, Invite A Friend, Email Club) 44 User clicks Join Now Card Button (CTA Pill button) on Local, Group, and Member Offers 45 Schedule picker (Standalone, Addon variants) 46 If user selects date button (should only trigger only on first date selected) 47 If user selects time button (should only trigger only on first time selected) 48 [AFW-4083] Thank You Page - Only available on SIT 49 When user clicks any of the options from Add to Calendar dropdown CTA (Google, Apple, Outlook) 50 When user clicks Send Trial Pass CTA 51 Verify that these are implemented on the following flows: 52 Book A Visit Standalone - <env>.anytimefitness.com/schedule-an-appointment-online &#x2020; 53 Membership Inquiry - <env>.anytimefitness.com/membership-inquiry 54 Try Us Free - <env>.anytimefitness.com/try-us-free 55 Apple Fitness Flows: 56 Apple Fitness Offer - <env>.anytimefitness.com/apple-fitness-offer 57 Apple Fitness Plus Subscriber - <env>.anytimefitness.com/apple-fitness-plus-subscriber 58 Invite A Friend Flows 59 Member - <sit/uat>.anytimefitness.com/invite?h=HFGYEWUL; https://www.anytimefitness.com/invite?h=RJCOMFC8 (No location search) 60 Non-Member - https://sit.anytimefitness.com/invite?h=ARQ5PR0U; https://www.anytimefitness.com/invite?h=BOO956AP 61 Events Pages 62 Events - Free Trial - <env>.anytimefitness.com/events/free-trial 63 Events - Train For Your Life - <env>.anytimefitness.com/train-for-your-life 64 Events - Promo - <env>.anytimefitness.com/events/promo 65 Events - Join Online - <env>.anytimefitness.com/events/join-online (redirection only) 66 Local Offers - <env>.anytimefitness.com/offer/local/1-day-pass?location_id=9993999&disable_captcha=true 67 Group Offers - <env>.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true 68 Member Offers - <env>.anytimefitness.com/offer/members/join-transformation-challenge?location_id=9993999 69 Email Club - <env>.anytimefitness.com/email-club 70 [AFW-4043 & AFW-4041] Static Pages 71 Local Landing Pages Open - <env>.anytimefitness.com/locations/woodbury-minnesota-9993999 / <env>.anytimefitness.com/locations/toledo-ohio-5293 Pre-sale - <env>.anytimefitness.com/locations/saint-paul-minnesota-9993994 / <env>.anytimefitness.com/locations/charleston-south-carolina-5697 Temporarily Closed - Coming Soon - Closing Soon - 72 LLP page clicks ? 73 CTA pill buttons ? 74 All links in hero banner 75 All links in pre-footer &#x2020; 76 Core Pages (Homepage, Training, Subtraining, Why Join) 77 React 78 Location search - All CTAs and Links on both search bar, and List & Map tabs &#x2020; 79 with IP Location Results - LLP redirection container 80 Webflow - All CTA pill buttons only throughout the page 81 AFW-4122 [UTM Params should persist] 82 Go to any flow/page with UTM param included iin the URL 83 Verify that all applicable UTM properties are present: utm_source utm_medium utm_campaign utm_content utm_term utm_id agency &#8592; This one might not automatically get recognized by rudderstack? &#x2020; 84 Verify that UTM params are persistent on all Rudderstack events 85 Page view 86 Button Clicked 87 Location Searched 88 Location Selected 89 Form Started 90 Lead Captured 91 Appointment Slot Selected 92 Appointment Scheduled 93 Verify that UTM params are persistent on Lead capture API endpoint calls (data properties object) 94 95 Cookies are DISABLED 96 Preconditions: 97 User has their cookie settings DISABLED 98 Open Chrome Devtools and go to Network Tab. Search for &quot;dataplane&quot; to check for Rudderstack events and &quot;/api&quot; for site&#x27;s API responses
…
- https://outliantteam.testpad.com/script/27017#88/1/
(Could not open https://outliantteam.testpad.com/script/27017#88/1/: HTTP 302)
- https://uat.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true
Join for $1 Offer - Anytime Fitness Limited Time Join for $1 24/7 access to 5,800+ locations Personalized coaching support State of the art equipment Clubs shown are owned by Bandon Fitness. Showing participating gyms. Looking for other locations? VIEW ALL GYMS Terms & Conditions Clubs listed on this page are owned and operated by franchisees of Anytime Fitness who are currently running this offer and does not include all Anytime Fitness locations in the area. ‍ Offer is for a $1 enrollment fee and requires purchase of a minimum 12-month membership term. Membership will be billed at the applicable monthly rate depending on the membership selected. Offer terms and effective dates may vary by location and offer is valid at participating Anytime Fitness locations only. Offer available to new customers only. No cash value, not valid with any other offer, no refunds or credits. Each Anytime Fitness location is independently owned and operated. Void where prohibited. ‍ By providing your contact information, you consent to be contacted by Anytime Fitness Franchisor, LLC, its affiliates, master franchisees and/or its franchisees and their authorized designees, through email, telephone, text message, or by other means, some of which may be from an automated service, as well as any other communication described in our Privacy Policy, which can be found at: https://www.anytimefitness.com/privacy/ . For mobile messaging, message and data rates apply and consent is not required to become a member. Data collected will be sent outside your jurisdiction and to the United States and will be governed by our Privacy Policy, as it may be updated or amended. Full terms and conditions can be found at: www.anytimefitness.com or your local Anytime Fitness club.​ ‍ ‍ Please review if you are a California resident: For information regarding the categories of personal information collected about you, and the purposes for which your information will be used, please visit Anytime Fitness Franchisor, LLC’s Privacy Notice for California Residents at: https://www.anytimefitness.com/privacy/#california-residents .​ Download Our App COMPANY Employee Wellness Media Careers Privacy Policy Consumer Health Privacy Notice (Washington) DMCA Policy Terms & Conditions Promotions Terms & Conditions Text Messaging Terms Continued Operations, Accessibility and Maintenance Preferred Vendors Sitemap GYMS Find a Gym Own a Gym Franchise Login MEMBERS The Anytime Fitness App Coach Care Connect FAQs Contact Us SHOP My Account Returns & Exchanges Shop FAQ Vendor Login Anytime Fitness is member of Purpose Brands™ A family of purpose-driven wellness brands: Orangetheory Fitness The Bar Method Waxing the City © Anytime Fitness 2026 . All rights reserved. Cookie Settings Cookie Settings Select your language Americas Asia Pacific Europe Middle East Africa You are currently offline. Please check your internet connection and try again. Local Residence: Why This Matters. Free trial passes are only available for new customers who live or work nearby. Most Anytime Fitness locations have a drop-in charge for non-residents who want to use the gym for a short period of time. If you cannot provide proof of local residency, you may be charged a fee to use this club. I UNDERSTAND
- https://uat.anytimefitness.com/events/promo
Join for $1 | Anytime Fitness Skip navigation Menu Icon Find a Gym Training Blog Why Join Shop Own a Gym TRY US FREE TRY US FREE Find a Gym Training Blog Why Join Shop Own a Gym TRY US FREE Download Our App Limited Time Offer Join for $1 Get 24/7 access, personalized plans, and expert support - all included with your membership JOIN TODAY Offer requires purchase of a minimum 12-month membership. Offer terms and effective dates will vary by location and offer is valid at participating Anytime Fitness locations only. Other fees may apply. See participating location for full details. Each Anytime Fitness location is independently owned and operated. Void where prohibited. GET STARTED NOW. Open 24 hours Global access to 6,000+ gyms Personalized fitness plans Free access to Apple Fitness+ (See details) Find your nearest Anytime Fitness location to get started in the gym or online. GET STARTED NOW. Find your nearest Anytime Fitness location to get started in the gym or online. More for your Membership than Just machines. Personalized Plans Hit your goals with a personalized plan that includes daily training, nutrition, and recovery guidance, accessible 24/7 in the Anytime Fitness App. Supportive Coaches Expert coaches provide ongoing support and leverage the latest technology to help you track progress toward your health and fitness goals. Convenient & Accessible With secure, smartphone-enabled 24/7 access to 6,000+ gym locations worldwide, you can get your workout in when it works for you. We can’t wait to Help you get started. BECOME A MEMBER TODAY Offer Terms & Conditions Offer requires purchase of a minimum 12-month membership. Offer terms and effective dates will vary by location and offer is valid at participating Anytime Fitness locations only. Other fees may apply. See participating location for full details. Each Anytime Fitness location is independently owned and operated. Void where prohibited. Local Residence: Why This Matters. Free trial passes are only available for new customers who live or work nearby. Most Anytime Fitness locations have a drop-in charge for non-residents who want to use the gym for a short period of time. If you cannot provide proof of local residency, you may be charged a fee to use this club. I UNDERSTAND Download Our App COMPANY Employee Wellness Media Careers Privacy Policy Consumer Health Privacy Notice (Washington) DMCA Policy Terms & Conditions Promotions Terms & Conditions Text Messaging Terms Continued Operations, Accessibility and Maintenance Preferred Vendors Sitemap GYMS Find a Gym Own a Gym Franchise Login MEMBERS The Anytime Fitness App Coach Care Connect FAQs Contact Us SHOP My Account Returns & Exchanges Shop FAQ Vendor Login Anytime Fitness is member of Purpose Brands™ A family of purpose-driven wellness brands: Orangetheory Fitness The Bar Method Waxing the City © Anytime Fitness 2026 . All rights reserved. Cookie Settings Cookie Settings Select your language Americas Asia Pacific Europe Middle East Africa Apple Fitness+ Terms & Conditions Fitness+ Trial Offer: Offer open to new Anytime Fitness® customers, local residents to participating locations in the United States & Canada, only. Photo ID required. Offer valid for 1 or 7 days’ (as applicable) access to participating Anytime Fitness location plus up to 3 months access to Apple Fitness+℠ beginning on eligible device activation. Prior Fitness+ subscribers will qualify for 2 months. Fitness+ requires a subscription & Apple ID with payment card on file. After trial ends, payment card on file will be charged $9.99/month & subscription automatically renews until cancelled. Apple may change the subscription price at its discretion, other terms & Apple Privacy Policy apply; see the applicable terms . Offer requires use of the Anytime Fitness mobile. Offer limited to 1 subscription per Family Sharing group, Apple IDs already associated with a trial or subscription for Fitness+ are not eligible. Valid only for Fitness+ in the United Stat
…
- https://sit.anytimefitness.com/offer/group/join-for-one-dollar-offer?test_location_id=9993999&disable_captcha=true
Join for $1 Offer - Anytime Fitness Limited Time Join for $1 24/7 access to 5,800+ locations Personalized coaching support State of the art equipment Clubs shown are owned by Bandon Fitness. Showing participating gyms. Looking for other locations? VIEW ALL GYMS Terms & Conditions Clubs listed on this page are owned and operated by franchisees of Anytime Fitness who are currently running this offer and does not include all Anytime Fitness locations in the area. ‍ Offer is for a $1 enrollment fee and requires purchase of a minimum 12-month membership term. Membership will be billed at the applicable monthly rate depending on the membership selected. Offer terms and effective dates may vary by location and offer is valid at participating Anytime Fitness locations only. Offer available to new customers only. No cash value, not valid with any other offer, no refunds or credits. Each Anytime Fitness location is independently owned and operated. Void where prohibited. ‍ By providing your contact information, you consent to be contacted by Anytime Fitness Franchisor, LLC, its affiliates, master franchisees and/or its franchisees and their authorized designees, through email, telephone, text message, or by other means, some of which may be from an automated service, as well as any other communication described in our Privacy Policy, which can be found at: https://www.anytimefitness.com/privacy/ . For mobile messaging, message and data rates apply and consent is not required to become a member. Data collected will be sent outside your jurisdiction and to the United States and will be governed by our Privacy Policy, as it may be updated or amended. Full terms and conditions can be found at: www.anytimefitness.com or your local Anytime Fitness club.​ ‍ ‍ Please review if you are a California resident: For information regarding the categories of personal information collected about you, and the purposes for which your information will be used, please visit Anytime Fitness Franchisor, LLC’s Privacy Notice for California Residents at: https://www.anytimefitness.com/privacy/#california-residents .​ Download Our App COMPANY Employee Wellness Media Careers Privacy Policy Consumer Health Privacy Notice (Washington) DMCA Policy Terms & Conditions Promotions Terms & Conditions Text Messaging Terms Continued Op
…

Project knowledge / Data Resources:
# Project knowledge

- [Resources](resources/resources.md) — workbook tab
- [[Webflow / AWS / React] New locale go live checklist](resources/webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/TpaGM9zc/testing?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
- [[Webflow / AWS / React] New locale go live checklist](resources/webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
- [[Webflow] Cohort Release ProcessProcess](resources/webflow-cohort-release-processprocess-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=863829d3-8081-4f5f-9ba6-2900b9785b2a
- [[Webflow] Publishing Standards](resources/webflow-publishing-standards-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=dc900252-9301-4e11-a232-9c0dbf49fb19
- [[Webflow/React] PROD Release Rollback Steps](resources/webflow-react-prod-release-rollback-steps-aHR0cHM6Ly9h.md) — https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=3ac9de52-a945-4a02-ae9c-9090d2a941bd
- [AF Locales and their business rules](reso

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
        url: "/locations/{locatio
…
