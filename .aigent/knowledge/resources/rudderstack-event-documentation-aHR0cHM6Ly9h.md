# RudderStack Event Documentation 

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=0c4c2157-0120-4c69-bb8e-db90cf8093d1
Updated: 2026-08-07T11:32:34.115Z

# ARCHITECTURE OVERVIEW
The AF webapp uses a two-layer analytics setup:

- **Parent Webflow page (wfjs)**
- Loads RudderStack SDK via `rs-loader.js`
- Handles consent (OneTrust), locale gating, Page View, and identify
- Listens for `postMessage` events from React iframes with action: "rs_tracking"
- Forwards those to `window.safeRSAnalytics.track()`
- **React app**
- Sends track events to the parent via `postMessage`
- Does not call RudderStack SDK directly
`postMessage` contract (iframe → parent):

`{ action: "rs_tracking", event: "", person_id: "<optional, Lead Captured only>", values: { ...event properties } }`

Parent handler: `IaC/webapp-frontend/lib/resources/wfjs/project-settings/head.js`

# CONSENT, LOCALE, AND QUEUEING
**Locale gating**

- RudderStack tracking is enabled only for en-us (`RS_ALLOWED_LOCALES`)
- `canTrackRSAnalytics()` checks locale + `shouldStartRSLogging` flag
**Consent (OneTrust)**

- Performance cookie group `C0002` must be accepted
- Without consent: `shouldStartRSLogging = false`, queue cleared, `rudderanalytics.reset()`
- With consent: `shouldStartRSLogging = true`, `rsIdentifyUser()` runs, Page View fires
**Event queue**

- Before SDK is ready, calls go to `window.rsAnalyticsQueue` via `safeRSAnalytics` proxy
- On RSA_Ready, queue is processed (identify calls prioritized first)

# IDENTIFY
Event type: identify (not a track event)

**When it fires**

- On page load (`footer.js`)
- After OneTrust + RudderStack are ready and performance consent is granted
- `rsIdentifyUser()` runs once per session (deduped via sessionStorage `"rs-identified"`)
- `userId = sessionStorage` rs_person_id OR localStorage userStitch
- Calls `safeRSAnalytics.identify(userId)` with no traits
- On Lead Captured (`head.js`)
- When iframe sends rs_tracking with event "Lead Captured" and person_id
- Persists person_id to sessionStorage (key: rs_person_id)
- Calls `safeRSAnalytics.identify(personId, traits)`
- Traits set:
- lead_id (if present in values)
- lead_captured_id (if present in values)
- email: null (explicitly to prevent PII data to show in dashboard)
- first_name: null
- last_name: null
- phone: null (PII fields explicitly nulled to clear stale persisted traits)
- Sets sessionStorage "rs-identified" = true
Session ID persistence (iframe, after successful lead submit)

- rs_person_id
- rs_lead_id
- rs_lead_capture_id
- Helpers: `persistRsLeadSessionIds()`, `getRsLeadSessionIds()` in `constants/rudderstack.ts`

# PAGE VIEW
**Event name:** page (RudderStack native page call, not a custom track event)

**When it fires**

- Once per page load, from footer.js
- Only when: performance consent granted AND locale is en-us AND RudderStack SDK ready
**Properties**

- location_id (optional) — resolved by getLocationIdForPageView() from, in order:
- URL param club or location_id
- window.clubId
- sessionStorage CLUB_ID
- document body data-club-id or data-location-id
- First DOM element with data-club-id or data-location-id
Special case: invite page with referral code (?h=...)

- Page View waits (polls every 100ms, up to 6s) for CLUB_ID to be set by the referral API
- Ensures location_id is included once the referral location is known
Standard RudderStack page context properties also sent automatically: path, referrer, referring_domain, search, title, tab_url, url, initial_referrer, initial_referring_domain

Implementation: IaC/webapp-frontend/lib/resources/wfjs/project-settings/footer.js

# FORM STARTED
**Event name:** Form Started Ticket: AFW-3371

**Purpose**

- Fires when a user first interacts with any form field
- Used for funnel analysis (e.g. Mixpanel)
- Fires once per form per session — repeated interactions on the same form do not re-fire
**When it fires**

- First focusin, input, or change on any form field inside the lead form
- Tracking is disabled until both path (from parent `postMessage`) and location are available
- Dedup: `useFormStartedTracking` from shared library
- Dedup key: lead-form:{pathname} (session-scoped)
- Event payload form_id is always "lead-form"
**Where implemented**

- components/lead-form/lead-form.tsx — wires `useFormStartedTracking` hook
- hooks/useFormAnalytics.ts — `sendFormStartedEvent()` builds and sends postMessage
**Properties**

| Property | Source / Notes |
| --- | --- |
| form_type | Derived from URL path via getFormAttributeFromPath(path, "formType") |
| form_offer | Derived from URL path via getFormAttributeFromPath(path, "formOffer") |
| offer_type | One of:"none" | "free_trial" | | "discounted_trial" | "discounted_intro" | "enrollment_waived" | "percent_discount" |
| campaign_name | Offer title from resolveOfferName() — NOT utm_campaign |
| location_id | Selected club location_number |
| location_name | Display name from getLocationDisplayName() |
| form_id | "lead-form" |
| form_name | URL param (title / offerTitle) or form config name or path-derived default |
| person_id | sessionStorage rs_person_id (empty until after a lead submit in same session) |
| lead_id | sessionStorage rs_lead_id (empty until after a lead submit in same session) |
| lead_capture_id | sessionStorage rs_lead_capture_id (empty until after a lead submit in same session) |
`postMessage` example: `{ action: "rs_tracking", event: "Form Started", values: { form_type: "intro", form_offer: "free_class", offer_type: "free_trial", campaign_name: "Try Us Free", location_id: "1234", location_name: "Anytime Fitness Example", form_id: "lead-form", form_name: "Try Us Free", person_id: "", lead_id: "", lead_capture_id: "" } }`

# LEAD CAPTURED
**Event name:** Lead Captured

**When it fires**

- After successful lead-capture API response in components/lead-form/lead-form.tsx
- On all flows using the shared LeadForm component (try-us-free, offers, events, membership inquiry, book-a-tour lead step, etc.)
**Side effects before event**

- `persistRsLeadSessionIds({ person_id, lead_id, lead_capture_id })` to sessionStorage
- `sendFormAnalytics` with eventType "form_success" (ChannelMix data layer — separate from RS)
- `postMessage` rs_tracking Lead Captured
- Parent `head.js` triggers identify (see Identify section)
**Properties**

| Property | Source / Notes |
| --- | --- |
| lead_id | prospect.lead_id from API |
| lead_captured_id | prospect.lead_capture_id from API (note: "_captured" in RS event payload) |
| location_id | location.location_number |
| location_name | getLocationDisplayName() |
**Top-level **`**postMessage**`** field:**

- person_id: prospect.person_id
**Meta CAPI (server-side)**

- RudderStack transformation maps "Lead Captured" → "Lead" for Meta
- Requires lead_capture_id (accepts lead_captured_id alias)
- event_id = lead_capture_id (dedup with browser pixel)
- _fbc cookie attached as context.fbc when present (Lead Captured + Appointment Scheduled)
`postMessage` example: `{ action: "rs_tracking", event: "Lead Captured", person_id: "abc-123", values: { lead_id: "lead-456", lead_captured_id: "lc-789", location_id: "1234", location_name: "Anytime Fitness Example" } }`

# APPOINTMENT SCHEDULED
**Event name:** Appointment Scheduled

**When it fires**

- After successful tour/class appointment booking in app/[locale]/book-a-tour/class-schedule.tsx
- Also sends a separate ChannelMix postMessage: event "tour_appointment_scheduled"
**Properties**

| Property | Source / Notes |
| --- | --- |
| location_id | location.location_number |
| location_name | getLocationDisplayName() |
| order_id | Booking order ID from appointment API |
**Meta CAPI (server-side)**

- Transformation maps "Appointment Scheduled" → "Schedule" for Meta
- event_id = order_id
- _fbc cookie attached as context.fbc when present
`postMessage` example: `{ action: "rs_tracking", event: "Appointment Scheduled", values: { location_id: "1234", location_name: "Anytime Fitness Example", order_id: "order-xyz" } }`

# RUDDERSTACK SDK CONFIGURATION
Loader: IaC/webapp-frontend/lib/resources/wfjs/project-settings/rs-loader.js

- Snippet version: 3.2.0
- SDK: [https://sdk.rs.anytimefitness.com/v3/modern/rsa.min.js](https://sdk.rs.anytimefitness.com/v3/modern/rsa.min.js)
- Non-prod write key: 39qbEh46LTosndeC3rq4HLpMwzz
- Data plane: [https://orangetheojsjp.dataplane.rudderstack.com](https://orangetheojsjp.dataplane.rudderstack.com/)
- Consent: OneTrust integration, preConsent enabled (session storage, immediate delivery)
- Prod write key: configured separately (see rs-loader.js)

# QA VERIFICATION (DEVTOOLS)
- Filter Network tab for **rudderstack** or **dataplane** requests
- Form Started: interact with any lead form field once — expect one "Form Started" per form per session
- Lead Captured: submit a lead form — expect "Lead Captured" + identify with lead_id / lead_captured_id traits
- Appointment Scheduled: complete book-a-tour booking — expect event with order_id
- Page View: reload page with consent — expect rudderanalytics.page() with optional location_id

# 
QA TRAINING AND DOCUMENTATION:
Training session:

[https://drive.google.com/file/d/12IZfluyW92TNO_JobNngoLJiIafqo7_9/view?usp=sharing](https://drive.google.com/file/d/12IZfluyW92TNO_JobNngoLJiIafqo7_9/view?usp=sharing)

Documentation:

[https://docs.google.com/presentation/d/12jfYZtphLgYzwx4y9yWSIV4U3usHiJCBVc8bLafZY9w/edit?usp=sharing](https://docs.google.com/presentation/d/12jfYZtphLgYzwx4y9yWSIV4U3usHiJCBVc8bLafZY9w/edit?usp=sharing)
