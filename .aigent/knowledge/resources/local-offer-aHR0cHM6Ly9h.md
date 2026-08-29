# Local Offer

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=c3cd5a90-8460-4ad8-bc1c-91f01d85e3da
Updated: 2026-05-09T10:49:33.415Z

## 1. Page Overview - General Info
**Purpose:** Provide a brief introduction to the page, explaining its role within the project and any key functionalities it offers.

 

- **Page Name: **Local Offer;
- **URL: **/offer/local/<offer_name>;
- **Development Reference: **[Figma](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=84-50224&t=LbiczyK9Pl8SMMMO-0) and [Miro](https://miro.com/app/board/uXjVK30bz-o=/?moveToWidget=3458764621372980564&cot=14);
- **SEO Configuration:**
- ***Meta Title: ***Local Offer - {{offerName}} - Anytime Fitness
- ***Meta Description: ****n/a*

## 2. Webflow Structure
**Purpose:** Outline how the page is structured in Webflow, listing the sections used, components 

- **Main Sections:** (Header, Content, Footer, etc.)
 

- **Custom Webflow Interactions & Animations:  **N/A
- **CMS Collections (if applicable): **Collection page for the Local Offer's collection 
- 
 

## 3. External JavaScript and Tools
**Purpose:** Describe here any external lib or toll that this page may need to handle a specific functionality and why to use this instead of WF native

- **Scripts Injected in Webflow:**
- **Lib/tool Name:**
- **Purpose:**

## 4. iFrame Components
**Purpose:** Describe each iFrame embedded in the page, its content, functionality, params needed, etc.

### 4.1 iFrame documentation
 

- **iFrame Name: **local-offer
- **iFrame URL: **﻿[Anytimefitnessdev-react.anytimefitness.com/local-offer](https://dev-react.anytimefitness.com/local-offer)﻿ 
- **Purpose & Functionality: **The purpose of this iframe to load a specific form for each local offer available
- 
 

### 4.2 iFrame documentation

### 4.2.1 Search Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| location_id | string | ✅ Yes | The unique identifier of the gym/club. |
| title | string | ❌ No | Promotion title to match with active promotions. |
| image | string | ✅ Yes | URL-encoded image path for rendering the promotion. |
| gymStatusRequirement | string | ❌ No | Expected gym status (open, pre-sale, etc.) used for redirect logic. |
| preview | string | ❌ No | If "true", enables preview mode and bypasses API promotion validation. |

### 4.2.2 API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| /api/clubs/:location_id | GET | Fetches detailed information about a specific gym location. |
| /api/local-offer?afNumber=:location_id | GET | Fetches current promotions for a given club. |
| /api/webflow/locations/:slug | GET | Fetches the Webflow item to retrieve the status ID for a gym. |
| /api/webflow/:collectionId/:statusId | GET | Fetches the status name (open, etc.) of the gym from Webflow CMS. |

### 4.2.3 Rendering Logic

| Condition | Outcome |
| --- | --- |
| !location or !image | Renders null (nothing). |
| isFormLoading === true | Shows loading screen with loader and “Checking for Local Offer” message. |
| hasLocalOffer === false | Shows fallback UI: “Offer not available at this time.” |
| hasLocalOffer === true && image && location | Renders full promotion form and offer details. |

### 4.2.4 Rendering Logic

| Feature | Behavior |
| --- | --- |
| Form Analytics | Triggered once the form is loaded, reports location metadata. |
| Form Submission Redirect | - If gym is open: redirects to online scheduling.- If pre-sale: redirects to thank-you page.- If status unknown: fetches Webflow gym status and redirects accordingly.- Some local offers are restricted to pre-sale gyms or open gyms only. This is controlled by Anytfitness in the Franchise Management System (FMS) dashboard. Webflow also ensures the local offer collection gives each offer a status of Open, Pre Sale, or Open + Pre-sale. This helps better redirect users, ensure consistent UX, and prevent unqualified gyms from receiving leads from offers they are not eligible for. |
| Auto Iframe Resize | Adjusts iframe height dynamically based on content. |
| Fallback Redirection | On error or missing offer, redirects to /find-gym or default location page. |
 

 

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.Communication is done through sharedData between Webflow and the iframe, following the code below:

```
const { imgURL, offerTitle, gymStatusRequirement } = window.parent.sharedData;
```
This way, Webflow can send CMS items to the iframe.The `location_id` is inserted as a URL parameter when the iframe is loaded.
