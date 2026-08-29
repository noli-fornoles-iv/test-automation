# Events 2.0

Tab: Resources
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

 

- **id**: Unique identifier used to differentiate the Events on React side, it can be helpful if React needs to apply specific logic for the Event, we want to avoid doing so as much as possible though because the purpose of Events 2.0 is **abstraction**, but for React to be open to identify Events and apply logic to them individually can be powerful if needed, for example, for an unexpected hotfix that the Events 2.0 abstraction isn't ready to cover.
 

- **search_field: **Data that conforms the **Search Field** behavior, it specifies things like variant, title, and placeholder.

 

- **location_list: **Data that conforms the **Location List** behavior, it specifies things like location title styles, if approximate distance is displayed or not, and everything related with the buttons and logic they involve like the display order.

 

- **lead_form: **Data that conforms the **Lead Form** behavior, it specifies things like if its enabled or not (not all Events have it), titles, descriptions, submit button text, footer variant to display, and other internal details related to the Prospect API Request like the workflow_name and lead_source_code.

 This is how an **eventProps **JSON would look like when constructing it for an Event:

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

It controls / determines the behaviors of the buttons on the search results (i.e., **location_lis**t). We designed the system to be flexible so any button behavior used today can also be supported for future events pages. There are **six (6)** main CTA button behavior categories:

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

- **Book a Tour → cannot** be embedded within events pages. Users will always be redirected off the events page to complete this flow.
- **Lead Form Page Redirect (Missing Pages) → **This option cannot be used if the locale does not have the corresponding lead form page (e.g., AU does not have Try Us Free).
- **Lead Form Page Redirect → Lead Source Codes → **Redirected leads will inherit the **default** lead source code and workflow name for that specific lead form. If a unique source code is required, use **Lead Form In-Page (Option #4)**.
- Note: Only **one** unique lead source code can be set per events page; it cannot be dynamically switched.
- **Online Signup → **Gym owner’s outside the US market, must provide their online signup URL in the AF dashboard. If they haven’t done this, then this button will not show for them.  If this button doesn’t show, then the gym won’t show in the search results.
- **JOIN NOW + CLAIM OFFER → **Each online signup URL is unique and must be deeplinked when its associated to a Local Offer.  If the gym is signed up for the local offer but doesn’t have this deeplink, then it will always show local offers.
- **Important Operational Note: CTA Buttons → **Lead source codes, workflow names, and local offer configurations **must be coordinated with AF Engineering in advance.**
 **The Events 2.0 abstraction encompasses the following Anytime Fitness Events.** **United States (default):****Page Name: **Promo**URL:** 

[https://www.anytimefitness.com/events/promo](https://www.anytimefitness.com/events/promo)**Development Reference: **Figma**SEO Configuration:*****Meta Title:*** Join & Get the Rest of the Year Free | Anytime Fitness***Meta Description:*** Join Anytime Fitness online today—get access to 24/7 gyms, expert coaching, and support. Start your fitness journey now!

Promo is the core Event and the one that's updated the most because of **seasonal promotions**, so every time a different promotion will arrive it has to be updated.Displays the **Top 10 Locations** that have **active** the respective promotion, they are sorted by approximate distance, it makes use of the following **CTAs**:

- **GYM DETAILS:** Always present, redirects to the respective location page
- (e.g. [https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440](https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440))
- **JOIN NOW: **Displays if the respective promotion **has a valid** **joinLink **for the location, its a link to the **specific** **plan id **of the promotion.
- (e.g. [https://join.anytimefitness.com/4440/account?planId={plan_id}](https://join.anytimefitness.com/4440/account?planId={plan_id}))
- **CLAIM OFFER: **Displays if the respective promotion **doesn't have a valid** **joinLink **for the location, gets to the Lead Form step.
 **Page Name:** Train For Your Life**URL:** 

[https://www.anytimefitness.com/events/train-for-your-life](https://www.anytimefitness.com/events/train-for-your-life)**Development Reference:** Figma**SEO Configuration:**  ***    Meta Title:*** Train for Your Life***Meta Description:*** Where real people help you make real progress. Get personalized training, nutrition, and recovery support from expert Coaches. Anytime, anywhere.

Displays the **Top 10 Locations** sorted by approximate distance, it makes use of the following **CTAs**:

- **Location Title: **Its clickable, redirects to the respective location page.
- (e.g. [https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440](https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440))
- **GYM DETAILS:** Always present, redirects to the respective location page
- **FREE TRIAL PASS: **Always present, gets to the Lead Form step.
            **Page Name: **Free Trial**URL:** 

[https://www.anytimefitness.com/events/free-trial](https://www.anytimefitness.com/events/free-trial)**Development Reference:** Figma**SEO Configuration:*****Meta Title:*** Free Trial***Meta Description:*** Personalized support. anytime, anywhere. find a gym near you to get your free trial pass Get more for your membership than machines 24/7 secure access to

Displays the **Top 10 Locations** sorted by approximate distance, it makes use of the following **CTAs**:

- **GYM DETAILS:** Always present, redirects to the respective location page
- (e.g. [https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440](https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440))
- **FREE TRIAL PASS: **Always present, gets to the Lead Form step.
 **Page Name: **Join Online**URL:** 

[https://www.anytimefitness.com/events/join-online](https://www.anytimefitness.com/events/join-online)**Development Reference:** Figma**SEO Configuration:**  ***    Meta Title:**** *Online Sign Up - Anytime Fitness***Meta Description:*** Join Anytime Fitness online today—get access to 24/7 gyms, expert coaching, and support. Start your fitness journey now!

     Displays the **Top 10 Locations** that have **"has-online-join"** enabled from the Webflow CMS, they are sorted by approximate distance, it makes use of the following **CTA**:

- **JOIN ONLINE:** Always present, redirects to the **location** **plans page.**
- (e.g. [https://join.anytimefitness.com/4440/plans](https://join.anytimefitness.com/4440/plans))
**Australia (en-au):****Page Name: **Promo**URL: **

[https://www.anytimefitness.com/en-au/events/promo](https://www.anytimefitness.com/en-au/events/promo)**Development Reference:** Figma**SEO Configuration:*****Meta Title: ***Join & Get the Rest of the Year Free | Anytime Fitness***Meta Description: ***Join Anytime Fitness online today—get access to 24/7 gyms, expert coaching, and support. Start your fitness journey now![Screenshot TBD]Displays the **Top 10 Locations** that have **active** the respective promotion, they are sorted by approximate distance, it makes use of the following **CTAs**:

- **GYM DETAILS:** Always present, redirects to the respective location page
- (e.g. [https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440](https://www.anytimefitness.com/locations/cliffside-park-new-jersey-4440))
- **JOIN NOW: **Displays if the respective promotion **has a valid** **joinLink **for the location, its a link to the **specific** **plan id **of the promotion.
- (e.g. [﻿](https://join.anytimefitness.com/4440/account?planId={plan_id})[Anytimefitnessjoin.anytimefitness.com/4440/account?planId={plan_id}](https://join.anytimefitness.com/4440/account?planId={plan_id})﻿)
- **CLAIM OFFER: **Displays if the respective promotion **doesn't have a valid** **joinLink **for the location, gets to the Lead Form step.
 **Page Name:** Find Your Fitphoria**URL:** 

[https://www.anytimefitness.com/en-au/events/find-your-fitphoria](https://www.anytimefitness.com/en-au/events/find-your-fitphoria)**Development Reference:** Figma**SEO Configuration:*****Meta Title: ***Find Your Fitphoria***Meta Description: ***Discover Find Your Fitphoria with Anytime Fitness Australia — an exclusive event to experience our gyms, meet the community, and kickstart your fitness journey today.

Displays the **Top 10 Locations** sorted by approximate distance, it makes use of the following **CTAs**:

- **GYM DETAILS:** Always present, redirects to the respective location page
- (e.g. [https://www.anytimefitness.com/en-au/locations/doreen-victoria-au-1461](https://www.anytimefitness.com/en-au/locations/doreen-victoria-au-1461))
- **ENQUIRE NOWg **Always present, gets to the Lead Form step.
**Page Name: **Book A Tour**URL:** 

[https://www.anytimefitness.com/en-au/events/book-a-tour](https://www.anytimefitness.com/en-au/events/book-a-tour)**Development Reference:** Figma**SEO Configuration:*****Meta Title:*** Book a Tour***Meta Description:*** Book a free gym tour at Anytime Fitness Australia — explore our 24/7 facilities, meet certified coaches and see how we help you reach your fitness goals.

Displays the **Top 10 Locations** sorted by approximate distance, it makes use of the following **CTAs**:

- **GYM DETAILS:** Always present, redirects to the respective location page
- (e.g. [https://www.anytimefitness.com/en-au/locations/doreen-victoria-au-1461](https://www.anytimefitness.com/en-au/locations/doreen-victoria-au-1461))
- **BOOK A TOUR: **Always present, redirects to Book A Tour for the respective location.
- (e.g. [https://www.anytimefitness.com/en-au/schedule-an-appointment-online?location_id=AU-1461](https://www.anytimefitness.com/en-au/schedule-an-appointment-online?location_id=AU-1461))

## 2. Webflow Structure (TBD)
**Purpose:** Outline how the page is structured in Webflow, listing the sections used, components 

- **Main Sections:** 
 

- **Custom Webflow Interactions & Animations: **N/A
- **CMS Collections (if applicable): **N/A

## 3. External JavaScript and Tools
**Purpose:** Describe here any external lib or toll that this page may need to handle a specific functionality and why to use this instead of WF native

- **Scripts Injected in Webflow:**
- **Lib/tool Name:**
- **Purpose:**

## 4. iFrame Components
Purpose: Webflow component that is used to load react iframes in events pages.

Below are the available props for the iframe component:

 

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

## 4.1 iFrame documentation
- **iFrame Name: **Events 2.0
- **iFrame URL: **[https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps}](https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps})
- **Purpose & Functionality:**
- **Purpose: **The purpose of this iframe is to load a multi-step form to complete the Events 2.0 workflow.
- **Functionality:**
**(Step 1) → Find your gym: **When the user visits** **`/events/{eventName}` without any param (like **"location"** or **"location_id"**) the workflow will load into the Search Bar.Here the user will select a city by searching, 

[Mapbox](https://www.mapbox.com/) suggestions will load while typing.

**(Step 2) → Choose your gym: **When the user visits** **`/events/{eventName}?location={cityKeyword}` where the **"location"** param is specified, a GET `/api/search-locations/` API call is made with the location data and the workflow will load with a list of gyms that belong to that city.Here the user will select a gym from the list, they are sorted in ascending order by their **approximate_distance** and the **top 10 **is displayed here.**(Step 3) → Submit form: **When the user visits** **`/events/{eventName}?location_id={gymId}`  where the **"location_id"** param is specified, the workflow will load in the **Lead Form** step where the user will fill the Lead Form data to finish the workflow.

- This step makes a **GET** [/api/clubs/{gymId}](https://stage-api.anytimefitness.com/clubs/9993999) in order to retrieve the Gym Data.
- When submitting the form the following process is triggered:
- **Validation**:
- The data will be validated and error messages will be shown in case of invalid input.
 

- [Google reCAPTCHA](https://developers.google.com/recaptcha):** **
We're using 

[Invisible reCAPTCHA](https://developers.google.com/recaptcha/docs/invisible), it doesn't display any checkbox widget, instead it displays a challenge to the user when google determines that verification is needed.After processing the reCAPTCHA challenge an API call to **POST** `/api/verify-recaptcha`  is made.If google already trusts the user activity it might not display a reCAPTCHA challenge, instead just the **POST** `/api/verify-recaptcha`  is made. This is how a **reCAPTCHA Challenge** can look like:

- **Create Prospect:**
- **POST **`/api/new-bff/prospects/` OR `/api/prospects/` (depends if new-bff endpoints are being used or not) to submit user info and get prospect id.
 

- **Redirect to** [BAT Flow](https://app.clickup.com/2227378/v/dc/23z5j-153354/23z5j-156074).
- **URL Parameters Used for Communication:**
**      1. Parameter Name:** location

- **Purpose: **City keyword used to fetch its information and continue to second step (Choose your gym).
- **Example Usage:** [https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps}&location=NYC,NY](https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps}&location=NYC,NY)
 **      2. Parameter Name:** location_id / club

- **Purpose:** The gym id used fetch its information and continue to last step (Lead Form).
- **Example Usage:** [https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps}&location_id=9993999](https://{env}-react.anytimefitness.com/events-2.0?eventProps={URIEncodedProps}&location_id=9993999)

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including **postMessage** and URL parameters.

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically. |
| replaceUrlParam | {key: {value}value: {value}} | To replace a URL param value. |
| deleteUrlParam | {deleteUrlParam: {value}} | To delete a URL param. |
| Redirect to BAT flow | {redirect: {value} variant: {BAT Variant} (standalone | addon | fitnessPlus | fitnessPlusNew) clubId: {value} prospectId: {value}} | To redirect to the BAT Flow. |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts:**
- **Active-On /De-active On Script:**
- A script in webflow located at the top of the web design view.  This ensures publish and unpublish dates for the events pages.  When deactivated, the user will get redirected to the /find-gym page of their locale.  Each locale's on/off times are set separately.  The coded time is in UTC and should be set based on what the local time is.
-  
 

- **Webflow Script**:
- A custom **events-2.js** script is implemented for this integration in order to handle communication between Webflow and the React iframe.
 This script is responsible of constructing and providing the **eventProps **to the **iframe **by following these steps:

- Construct the **eventProps **JSON by grabbing the data from the **.events-iframe-wrapper** [Dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset).
- Encode the** eventProps **with [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent).
- Use the **setupIframe **utility that comes from **head.js **in order to initialize the events-2.0 iframe with the encoded **eventProps**.
 

- **React Script:**
- The react code is responsible for the complete UI implementation of this feature and communicating with Webflow by using **postMessage**, which is handled by the respective wfjs script.
 It decodes the given **eventProps** by using 

[decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent), then it processes the event data and dynamically setups it.

- **User Input Handling:**
- Finding a location.
- Selecting a Gym.
- When filling and Submitting the Lead Form.
- If no Lead Form, then clicking a CTA to be redirected to an external link.
 

- **State Management:**
- For the** eventProps **data.
- To **cache Webflow Data **from gyms.

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling.

- **Potential Issues & Workarounds:**
- Handling of the **location** param:
If the location keyword provided is not valid then an error will be displayed on top of the **Search Bar**.

- Handling of the **location_id / club** param:
If the gym of the id provided isn't found, he user is redirected to the first step (Find your gym) and the param is removed from the URL.

- **Browser Compatibility Notes:**
- Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:**
- Webflow Data for all the gyms found in a city has to be retrieved.
- User might have to wait more for all API calls (depends on BE) to complete when submitting the form.

## 8. Additional Notes (For Complex Pages)

## **Single Point of Failure (SPOF)**
Events 2.0 is completely dependent on successful **eventProps **processing, the Event will not work as expected if something goes wrong with it.

## Mocking to Test Locally
Mocks of **eventProps** for all Events can be found at **events-2.0/constants.ts**, example:

 

 These mocks can be reused for testing and also to consistently run a specific Event locally, simply import the respective mock into **events-2.0/page.tsx **and use it where the **eventProps **are setup like this:(Code can be updated and this can change, just find the place where the **eventProps** are setup)

Make sure to keep the Mocks updated with the latest Events data from Webflow, the idea is to simulate as close as possible the final result.

## Creating a New Events Page
 This process involves creating an events page from a static template and customizing its content and features using the component Properties panel in the Webflow Designer.

### Phase 1: Create and Configure the New Page
 

- Go to the Webflow Designer: Open your Webflow project and launch the Designer.
- Navigate to Static Pages: On the left sidebar, click the Pages panel (looks like a paper icon).
- Find the Template: Under the Static Pages section, locate the existing "Events Page Template" (or the appropriate template page).
- 
- Create a New Page:
- Hover over the Events template and click the "+" icon next to the template name.
- Page settings will appear and we need to update some of the settings like Meta Title and Meta Description, Open Graph (OG) Settings: Upload and set the OG Image and add a Title/Description for social media sharing.

### Phase 2: Customize Components Using Properties
 The new page now contains all the available event components. You will use the Properties panel to manage content, styling, and visibility.

- Select a Component: Click directly on any component on the canvas (e.g., the Events - Hero Two Column Stretch).
- Access Component Props: Look at the right-hand panel of the Designer. Click the tab titled "Properties" (this is where the component custom fields are located).
- Edit Content and Styles:
- Properties are organized into tabs (e.g., Section, Heading, Summary, Buttons, Image).
- Go through each section and fill out the fields to set the text, button variant, image source, etc., for that specific component.
- Control Component Visibility (Show/Hide):
- To hide an entire section (e.g., if you don't need a Disclaimer or a specific Button), select the main component wrapper.
- Navigate to the "Sections" tab within the Properties panel.
- Use the Section Visibility field (often a toggle or a dropdown) to set that component to be hidden on the page.

### Phase 3: Review and Publish
 

- Review the Page: Check the page on the canvas to ensure all content, buttons, and sections are showing or hidden exactly as needed.
- Publish to Dev: Click the Publish button at the top right, select the Development Environment (`dev` or `staging`), and click Publish.
- Test and Verify: Go to the live Dev URL to confirm the page loads correctly, all links work, and the visual layout is as expected before publishing to production.
