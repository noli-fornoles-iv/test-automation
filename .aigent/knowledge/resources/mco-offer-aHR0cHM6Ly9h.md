# MCO Offer

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=cfe979a5-4e6a-4d7a-9aaf-38e221bb7bb9
Updated: 2026-05-09T10:39:55.410Z

## 1. Page Overview - General Info
**Purpose:** Provide a multi-club offer (MCO) landing page that allows users to select from multiple gym locations and view targeted promotional offers for their chosen location.

 

- **Page Name: **MCO Offer;
- **URL: **/offer/group/<offer_name>;
- **Development Reference: **[Figma](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=84-50224&t=LbiczyK9Pl8SMMMO-0) and [Miro](https://miro.com/app/board/uXjVK30bz-o=/?moveToWidget=3458764621372980564&cot=14);
- **SEO Configuration:**
- ***Meta Title: ***MCO Offer - {{offerName}} - Anytime Fitness
- ***Meta Description: ****n/a*

## 2. Webflow Structure
**Purpose:** Outline how the page is structured in Webflow, listing the sections used, components 

- **Main Sections:** (Header, Content, Footer, etc.)
 

- **Custom Webflow Interactions & Animations:  **N/A
- **CMS Collections (if applicable): **Collection page for the Local Offer's collection 
- 
- The field `location_id` contains location ids that is used to filter search results (Only display clubs matching these ids in search results when searched for a specific location)
 

## 3. External JavaScript and Tools
**Purpose:** Describe here any external lib or toll that this page may need to handle a specific functionality and why to use this instead of WF native

- **Scripts Injected in Webflow:**
- **Lib/tool Name:**
- **Purpose:**

## 4. iFrame Components
**Purpose:** Describe each iFrame embedded in the page, its content, functionality, params needed, etc.

### 4.1 iFrame documentation
 

- **iFrame Name: **mco-offer-iframe
- **iFrame URL: **﻿[Anytimefitnessmco-offer](https://dev-react.anytimefitness.com/mco-offer?location_id=2909%3B2136%3B3249%3B3362%3B3384%3B3385%3B3386%3B3387%3B3388%3B4155%3B4156%3B4870%3B1138%3B119%3B3356%3B532%3B194%3B795%3B57%3B2914%3B995%3B2355%3B1846%3B1699%3B994%3B302%3B305%3B3119%3B4079%3B419%3B2793%3B2794%3B1383%3B240%3B544%3B282%3B2818%3B4465&title=Join+Get+Summer+Free&image=https%3A%2F%2Fcdn.prod.website-files.com%2F66c501d753ae2a8c705375b6%2F683403b89795b7aed791e51b_683400e785ec9f39da77b7d1_campaign-page-30-days-free.avif&locale=en-us)﻿ 
- **Purpose & Functionality: **The purpose of this iframe is to load a multi-step form that allows users to first select a gym location from multiple options, then view and complete a specific offer form for their selected location.
- First step: Search
- 
- Second Step: Select
- 
- Third step: Submit
- 
 

### 4.2 iFrame documentation

### 4.2.1 Search Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| location_id | string | ✅ Yes | Contains location ids to filter from search results |
| title | string | ❌ No | Promotion title to match with active promotions. |
| image | string | ✅ Yes | URL-encoded image path for rendering the promotion. |

### 4.2.2 API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| /api/search-locations/ | GET | Fetches clubs based on search term. |

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.Communication is done through sharedData between Webflow and the iframe, following the code below:

```
const { imgURL, offerTitle, locationid} = window.parent.sharedData;
```
This way, Webflow can send CMS items to the iframe.The `location_id` is inserted as a URL parameter when the iframe is loaded.
