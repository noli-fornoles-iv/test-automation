# Submit Form - Lead Form

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=3b376c63-a9b3-4819-85b1-9afb66c8f5e0
Updated: 2026-06-29T11:37:00.175Z

### Overview:
The Submit form (also referred as Lead Form) component is the shared form experience used to collect member interest and contact details across submit flows. It adapts the fields, validation, consent text, and post-submit behavior based on the selected country and location. This lets QA validate one consistent form pattern while still checking country-specific requirements where they apply.

### Lead form iframe integration:
This script is responsible for handling communication between the main webpage and an embedded `iframe` via the `window.postMessage` API. It enables dynamic behavior such as adjusting the iframe's height, triggering data layer events, redirecting the user, and scrolling the iframe into view based on messages received from the iframe.

### 1. Targeting the Iframe

```
const iframe = document.querySelector("iframe[id='australia-fplus-form-iframe']");
```
This line selects the `iframe` element on the page by its `id`. In this case, the expected `id` is `'australia-fplus-form-iframe'`.

### 2. Setting Up the `message` Event Listener

```
window.addEventListener("message", e => {  // ...});
```
This attaches an event listener to the `window` object to listen for incoming `postMessage` events from the iframe. The event object `e` contains data sent from the iframe, which is then conditionally handled inside the listener.

### 3. Dynamic Iframe Height Adjustment

```
if (e.data.frameHeight) {  iframe.style.height = `${e.data.frameHeight}px`;}
```
- **Purpose**: Dynamically adjusts the height of the iframe to match the content inside it.
- **Trigger**: The iframe sends a message with a `frameHeight` value.
- **Effect**: Prevents scrollbars inside the iframe and ensures the embedded content fits seamlessly.

### 4. Sending Events to the Data Layer

```
if (e.data.event) {  
  const dataLayer = window.dataLayer || [];  
  dataLayer.push({    
    event: e.data.event,    
    ...e.data.context.values,  
  });
}
```
- **Purpose**: Pushes events to the `dataLayer` (typically used by Google Tag Manager).
- **Trigger**: The iframe sends a message with an `event` field and optional context data.
- **Effect**: Enables tracking of user interactions occurring inside the iframe (e.g., form submission, error states).

### 6. Scrolling the Iframe into View

```
if (e.data.scrollToCenter) {  
  iframe.scrollIntoView({    
    behavior: "instant",    
    block: "center",    
    inline: "center",  
  });
}
```
- **Purpose**: Automatically scrolls the iframe into the center of the viewport.
- **Trigger**: The iframe sends a message with a `scrollToCenter` flag.

### How Country Settings Are Applied
Country-level behavior comes from `locale-config`.

The flow is: Webflow locale URL→ Next route /[locale]/...→ LocaleProvider→ locale-config/index.ts→ base-config.ts plus locale override→ LeadForm reads locale settings at runtime

Base defaults live in: `locale-config/base-config.ts`

Country overrides live in: `locale-config/locales/{locale}/index.tslocale-config/locales/{locale}/utils.ts`

Country settings control:

- Phone dial code
- Phone validation
- Phone formatting before API submission
- Zip or postal code visibility
- Zip or postal code validation
- Field labels
- Required fields
- Consent checkbox pattern
- Local resident checkbox
- RTL layout support
- Post-submit redirect behavior
- Whether Book a Tour is enabled after submit
This means the form UI is shared, but validation and consent requirements are not always shared.

### data-testid(s) used:
- `lead-form`: Main Submit Form container. Use this to confirm the shared form rendered successfully.
- `lead-form-disclaimer`: Default terms/privacy disclaimer shown in the form footer.
- `consent-checkboxes-disclaimer`: Wrapper for the two-checkbox consent block.
- `consent-checkboxes-disclaimer-residency-text`: Residency consent copy inside the two-checkbox consent block.
- `consent-checkboxes-disclaimer-marketing-text`: Marketing opt-in copy inside the two-checkbox consent block.
- `local-resident-link`: “Why this matters” link for local resident consent. Use this to validate the modal/postMessage behavior.
- `location-name`: Selected location name displayed above the form.
- `location-address-line-1`: First address line for the selected location.
- `location-address-line-2`: Second address line for the selected location, when available.
- `terms-and-conditions-text`: Terms and conditions text used in some offer form footers.

### List of Workflows that make use of an "Edit Icon" in location details:

| Workflow | Edit Icon | Redirection Action |
| --- | --- | --- |
| Standalone BAT | No | — |
| Membership Inquiry | No | — |
| TUF | Edit Location Icon | Location Search (Step 2) |
| Apple fitness offer | Edit Location Icon | Location Search (Step 2) |
| Apple fitness subscriber | Edit Location Icon | Location Search (Step 2) |
| Event pages | Edit Location Icon | Location Search (Step 2) |
| Invite a friend (non member) | Redirection Icon | LLP |
| Invite a friend (member) | Redirection Icon | LLP |
| Local Offers | Redirection Icon | LLP |
| MCO offers | Redirection Icon | LLP |
| Member offers | Redirection Icon | LLP |
| Contact us | Redirection Icon | LLP |

### Form Submission
The Lead Form submits prospect details through the shared lead capture flow. For the main submit forms, the form collects user details, validates them using the country-specific form rules, verifies reCAPTCHA when required, resolves the correct lead source/workflow, and then sends the payload to the lead capture API.

The default submission path is: Lead Form→ validate country-specific fields→ verify reCAPTCHA when enabled→ resolve lead source data→ POST /api/lead-capture/→ store returned prospect / lead identifiers→ run post-submit redirect or next-step behavior

On a successful response, the form receives prospect data such as the person ID, lead ID, lead capture ID, external system ID, and booking eligibility. That response determines what happens next. For example, eligible prospects may continue into Book a Tour, while non-eligible or closed-location flows redirect to the thank-you page.

### What QA Can Test Once
These behaviors are shared through the core Submit Form implementation and generally do not need to be retested across every locale.

Recommended baseline: `US` using a standard open club (e.g. 9993999).

Test once for:

- Required first name, last name, and email behavior
- Submit button loading and disabled states
- Generic API error display
- Successful lead capture request
- reCAPTCHA trigger when enabled
- Redirect after submit
- Basic Try Us Free step 3 rendering
- Shared “Why this matters” modal behavior
- Re-submit behavior when an existing prospect is reused
If these pass in one baseline locale, QA can usually assume the same shared mechanics work elsewhere unless that locale changes fields, validation, consent, or redirects.

### What QA Must Test Per Locale
These behaviors are country-specific and should not be assumed from a baseline locale.

Test per locale or per locale group for:

- Phone number validation and formatting
- Postal code, zip code, or postcode behavior
- Consent checkbox requirements
- Terms and conditions checkbox behavior
- Local resident checkbox behavior
- Washington state-specific consent behavior
- RTL layout
- Unicode name input
- Post-submit redirect to Book a Tour vs thank-you page
- Country-specific translated copy
- Locale-specific required fields
Suggested minimum locale coverage:

- `en-us`: baseline, US consent, Washington state edge case
- `en-ca`: Canadian postal behavior
- `fr-ca`: French Canadian copy on Canadian infrastructure
- `en-au`: AU consent and membership inquiry path
- `en-gb`: UK phone and postal validation
- `de-de`: consent checkboxes and no Book a Tour redirect
- `it-it`: local resident checkbox
- `ar-sa`: RTL and Unicode behavior

### QA Rule of Thumb
If the change is in the shared `LeadForm`, loading state, error state, or generic submit handling, test once in a baseline locale and spot-check one additional locale.

If the change touches locale config, country validation, consent, phone formatting, postal code rules, translated copy, or redirect eligibility, test every affected locale group.

If the page receives data from Webflow CMS, test that page specifically, even if the underlying Submit Form component is shared.
