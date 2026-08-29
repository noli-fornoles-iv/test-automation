# Aigent task

Follow AGENTS.md, .cursor/rules, and the matching Agent workflow in this project.
When the task is a Jira ticket, follow the Automating a ticket workflow in order. Do not skip analysis, discovery, or the test-plan approval gate. Never write automation before qa_automation_testplan_approved. After Automate, use qa/<TICKET>-... and PR to sit. Never auto-merge uat or main.
When generating a test plan, follow the Generating a ticket-based testplan workflow. Pause for human review. Do not silently overwrite manual Testpad edits.
When executing tests, follow the Executing tests for tickets workflow. Ask for environment and Local / Jenkins / Both. Pass safety gates. Never invent results.
When a test fails, follow the Fixing automation errors workflow. Diagnose and classify before modifying automation.

Regenerate the Testpad checklist for Jira AFW-4104: [Rudderstack][React][Location Searched and Location Selected] Corresponding offer_type and offer_name values should be added on offer related flows with location search
Ticket: https://purposebrands.atlassian.net/browse/AFW-4104

Work ONLY from this message. No tools, no repo, no Testpad API.
You are writing a Testpad script for Outliant QA (manual now, automation later).
Read the injected knowledge first. Use documented URLs, labels, fields, events, messages, and test data verbatim.
Write every TESTABLE case listed in the ticket, linked tickets, comments, knowledge, and existing QA Testpad. Do not sample a subset of surfaces.
Every checkable row must be automatable later: named page/URL, named control, exact expected copy/event/property. No 'as expected', 'relevant page', 'not blank', or restated Jira summary.
Output a Testpad checklist, not Gherkin. Do not write Feature:, Scenario:, Given, When, or Then.
Shape:
- Top-level section = product surface or flow (e.g. Local Offers, Group Offers, Member Offers, Events Promo).
- Nested group = variant (Desktop/Mobile, locale, event name, Scenario 1 / Scenario 2) when the ticket or knowledge lists them.
- setup rows = how to reach the state (URL, cookies, capture). Not pass/fail by themselves.
- checks = checkable leaves. Prefer 'Verify …' with exact quoted copy, event name, property = value, or URL.
- Nest related assertions under a parent (payload fields under the event; invalid inputs under the error-message scenario).
- Separate top-level sections with an empty row.
Coverage completeness (do not sample):
- Enumerate EVERY distinct URL/path, offer type, form, locale, device, search method, cookie state, event, and property named in the ticket, linked work, comments, knowledge, or existing Testpad slice.
- One top-level section per distinct product surface. If four offer URLs are listed (local, group, member, events/promo), write four sections — never two of four.
- For each named analytics event, include the trigger AND a nested Verify for EACH named property. Write the documented value (offer_type = group_offer, form_id = local_offer_general). If the value is CMS/dynamic, write 'matches Webflow CMS for this offer' — never 'not blank', 'populated', or 'non-empty'.
- Include sibling events on the same flows when the parent ticket or existing QA plan lists them with this ticket (e.g. Form Started and Lead Captured alongside Location Searched / Location Selected).
- Preconditions once in setup: cookies, RudderStack/dataplane capture, environment (SIT vs UAT from comments).
- Completeness over brevity. Ticket plans often need 4–12 sections and up to ~120 check rows when multiple surfaces are listed.
- Existing Testpad is a coverage inventory for THIS ticket's slice. Expand every flow in that slice. Do not copy unrelated sibling tickets (e.g. Button Clicked, UTM, cookies-disabled) into a client-change plan.
Regression packs: cover open, required fields, submit, success, and stated validation for every named flow — not a sample of one happy path.
Quality gate: only write checks whose expected result is in the ticket, knowledge, or existing QA Testpad. Linked tickets are in scope when they state an observable result.
If the title is 'Automate tests for X', plan X — the product behaviour.
Do not duplicate a regression template. Do not write automation code.
ambiguous/excluded/blocked: at most 2 short items total, and only if they block a whole TESTABLE area. Prefer writing the cases you can.
Output ONLY this JSON:
{ "feature": "short product title", "sections": [{ "title": "surface or flow", "setup": ["On https://… with …"], "checks": ["Verify …"], "children": [{ "title": "nested group", "setup": [], "checks": ["Verify …"], "children": [] }] }], "ambiguous": [], "excluded": [], "blocked": [] }
Full replacement, not a delta. Cover every listed surface, event, and property. Nested Verify rows with exact labels, URLs, events, and property = value from the briefing, knowledge, and existing QA Testpad.

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

Project knowledge (use verbatim facts; ignore unrelated tabs):
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
 This is how the button

### resources/webflow-country-onboarding-guide-aHR0cHM6Ly9h.md
# Webflow Country Onboarding Guide

{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "PAGE URL",
        "url": "PAGE URL",
        "name": "META-TITLE",
        "isPartOf": {
          "@id": "HOME URL#website"
        },
        "primaryImageOfPage": {
          "@id": "PAGE URL#primaryimage"
        },
        "image": {
          "@id": "PAGE URL#primaryimage"
        },
        "thumbnailUrl": "https://cdn.prod.website-files.com/66aa8fe9dc4db68f448a978f/6759b3215d7d3cb5fabf3e89_logo-purple-black-desktop.svg",
        "datePublished": "DATE PUBLISHED",
        "dateModified": "DATE MODIFIED",
        "description": "META-DESCRIPTION",
        "breadcrumb": {
          "@id": "PAGE URL#breadcrumb"
        },
        "inLanguage": "INLANGUAGE",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "PAGE URL"
            ]
          }
        ]
      },
      {
        "@type": "ImageObject",
        "inLanguage": "INLANGUAGE",
        "@id": "PAGE URL#primaryimage",
        "url": "OPENGRAPH URL PATH",
        "contentUrl": "OPENGRAPH URL PATH",
        "width": 1200,
        "height": 630
      },
      {
        "@type": "BreadcrumbList",
        "@id": "PAGE URL#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "BREADCRUMBLIST 1",
            "item": "HOME URL"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "BREADCRUMBLIST 2"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "HOME URL#website",
        "url": "HOME URL",
        "name": "GENERAL DESCRIPTION",
        "description": "GENERAL DESCRIPTION",
        "publisher": {
          "@id": "HOME URL#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "HOME URL?s={search_term_string}"
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          }
        ],
        "inLanguage": "INLANGUAGE"
      },
      {
        "@type": "Organization",
        "@id": "HOME URL#organization",
        "name": "GENERAL DESCRIPTION",
        "url": "HOME URL",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "INLANGUAGE",
          "@id": "HOME URL#logo",
          "url": "https://cdn.prod.website-files.com/66aa8fe9dc4db68f448a978f/6759b3215d7d3cb5fabf3e89_logo-purple-black-desktop.svg",
          "contentUrl": "https://cdn.prod.website-files.com/66aa8fe9dc4db68f448a978f/6759b3215d7d3cb5fabf3e89_logo-purple-black-desktop.svg",
          "width": 161,
          "height": 43,
          "caption": "GENERAL DESCRIPTION"
        },
        "image": {
          "@id": "HOME URL#logo"
        },
        "sameAs": [
          "FACEBOOK",
          "TWITTER",
          "INSTAGRAM",
          "LINKEDIN",
          "PINTEREST",
          "YOUTUBE"
        ]
      }
    ]
  }

- Page url: Every url for every page, you can do this with search/replace once you know the Locale
- Home url of the new Locale
- Meta title and Meta description: Confirm with PM you will use the same for the new Locale
- Note: the schema d

### resources/local-gym-page-aHR0cHM6Ly9h.md
# Local Gym Page

activeOffers.sort((a, b) => new Date(a.deactiveOn) - new Date(b.deactiveOn));
  const offer = activeOffers[0];
  messageEl.textContent = offer.title;
  let href = "";
  if (offer.joinLink) {
    const url = new URL(offer.joinLink);
    const isSameDomain = url.hostname === "www.anytimefitness.com" || url.hostname === "anytimefitness.com";
    href = isSameDomain ? url.pathname + url.search : offer.joinLink;
  } else if (offer.linkUrl) {
    const url = new URL(offer.linkUrl);
    href = url.pathname + url.search;
  }

- Learn More -> When the local offers JSON within Webflow CMS locations collection - has a joinLink = "
…


Related files (paths only):
.aigent/knowledge/resources/af-locales-and-their-business-rules-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/all-locations-filter-page-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/blog-search-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/buttons-and-badges-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/how-to-check-the-react-props-passed-from-webflow-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/local-offer-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/local-offer-page-setup-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/local-status-flows-aHR0cHM6Ly9k.md
.aigent/knowledge/resources/location-search-2-0-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/mco-offer-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/navigation-and-footer-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/new-country-onboarding-guide-react-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/postman-collection-and-api-inventory-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/rudderstack-event-documentation-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/rudderstack-training-and-documentation-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/search-bar-only-experience-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/webflow-aws-react-new-locale-go-live-checklist-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/webflow-publishing-standards-aHR0cHM6Ly9h.md
.aigent/knowledge/resources/webflow-react-prod-release-rollback-steps-aHR0cHM6Ly9h.md
features/localOffer/local-offer.feature
features/locationSearchOnStaticPages/location-search-on-static-pages.feature
features/mcoOffer/mcoOffer.feature
features/memberOffer/member-offer.feature
features/tryUsFree/try-us-free-apple-fitness-offer.feature

Output ONLY the JSON object.
