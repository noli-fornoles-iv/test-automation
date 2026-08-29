# GA4 / dataLayer events - QAs focused

Tab: Resources
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

### Special case: Member promo
Member-offer pages may send `form_success` with different field names:

| Expect | Instead of |
| --- | --- |
| location_id / location_name | club_id / club_name |
| form_category: member | usual lead |
| leads: "0" | "1" |
| lead_source_code may be the text "undefined" | a real code |

### `tour_appointment_scheduled`
**Meaning:** “Tour/appointment was booked.”

**When**

- Book a Tour flow → user successfully books a slot
**Useful fields**

- Gym id / name
- `order_id` for that booking

### `franchise_lead_captured`
**Meaning:** “Own a gym / franchise inquiry submitted.”

**When**

- Own-a-gym form submits successfully
- **Not** the same name as `form_success`
**Notable**

- This is one of the rare dataLayer events that `includes form_type` (`franchise`)
- Then user is usually sent to thank-you

### `corporate_membership_lead`
**Meaning:** “Corporate membership inquiry submitted.”

**When**

- Corporate membership form succeeds
- Event name is `corporate_membership_lead`, not `form_success`

### `offer_meta_loaded`
**Meaning:** “This offer page figured out which offer/variant actually loaded.”

**When**

- Local offer or MCO (group) offer pages after the offer resolves
**Why QA cares**

- Wrong/missing offer title, wrong status, or missing online join → use this event to see what the page thinks loaded
**Example fields**

- Offer title, location, name, status, whether online signup is on

### `Searched`
**Meaning:** “User searched (find a gym style).”

**When (US main site only)**

- Homepage find-gym search behavior
- Compact locations widget search behavior
**What you’ll see**

- Often little else—mainly the event name itself
**Locales**

- Do **not** expect this on most international locales

### `CTA Clicked - …`
Exact names you may see:

- `CTA Clicked - TUF`
- `CTA Clicked - Join`
- `CTA Clicked - Membership Inquiry`
- `CTA Clicked - Gym Details`
**When (US only)**

- Clicks on gym/location CTAs (cards or local gym page buttons)
**Notes**

- Not expected on non-US locales
- Rapid double-click may only count once briefly

### Japan Fitness+ form (special)
Only on the Japan Fitness+ embed form:

| Event | Rough meaning |
| --- | --- |
| user_navigated_to_form | User reached the form |
| user_completed_form | User finished the form |
Treat these as Japan-specific; do not use them as the global standard for other forms.

## Quick “what should fire?” by flow

| What you’re testing | Look for |
| --- | --- |
| Any standard lead form page | form_loaded (once this session); form_success after good submit |
| Multi-step: search → pick gym → form | form_loaded may already have fired without club fields; club on form_success is what proves gym on the lead |
| Events page that only “Join online” off-site | May never get form_success |
| Deep link with location_id | Best way to assert club fields on form_loaded |
| Tour booking | tour_appointment_scheduled after book succeeds |
| Local / group offer landing | offer_meta_loaded; then form events if the form is used |
| Member promo submit | form_success but with location_* fields (see above) |
| Corporate form | corporate_membership_lead |
| Franchise / own a gym | franchise_lead_captured |
| US homepage / widget search | Searched |
| US gym CTA buttons | CTA Clicked - … |
Contact Us / cancel membership: check in the browser what event name appears after a good submit—don’t assume `form_success` without looking once for that page.

## Common “is this a bug?” answers

| Observation | Verdict |
| --- | --- |
| club_id missing on form_loaded after search-then-form | Expected if location wasn’t known at first load |
| club_id present when testing with ?location_id=… | Expected |
| No second form_loaded when reopening the form | Expected (same session) |
| form_type missing on form_success for Events / TUF / MI | Expected (not part of this event) |
| duration is the text undefined | Expected when there’s no day-pass length |
| emailsha256 gone with ads cookies refused | Expected |
| No form_success after only using join portal / external join | Expected (no on-page lead submit) |
| Member promo has location_id not club_id | Expected for that offer type |
| No Searched / no CTA Clicked on AU/CA/EU | Expected (US-gated) |
