# Contact Us

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=a0b8749f-4d68-4fd3-bf6f-79b5154e99d7
Updated: 2026-05-05T07:31:14.707Z

## 1. Page Overview - General Info
**Purpose:** This page is responsible for allowing users to contact to gym owner using a dedicated contact form. Users need to select the gym and fill out the contact form with his information and the message and submit.

 

- **Page Name: **Invite
- **URL: **/contact-us
- **Development Reference: **[Figma or actual site link](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=116-65666&t=edOEJqiwhXuNOoMM-0);
- **SEO Configuration:**
- ***Meta Title:  ***
- ***Meta Description: ****n/a*

## 2. Webflow Structure
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

### 4.1 iFrame documentation
 

- **iFrame Name: Invite Friend**
- **iFrame URL: **﻿[Anytimefitnessdev-react.anytimefitness.com/contact-us](https://dev-react.anytimefitness.com/contact-us)﻿ 
- **Purpose & Functionality: **
- **Purpose:** The purpose of this iframe is to load contact form to allow users to contact gym owner. 
- **Functionality: **
If user visits the contact-us URL without `club` param then it displays location search component from where user can select the gym.

After selecting the gym, user will be redirected to contact form from where he can submit his info and send them a message. If user pass `club` param in the URL then it'll directly display this form skipping the location search step.It's using the lead form from shared library and extending it to have a textarea for message (handling validations). This makes API request to POST 

[/contact](https://stage-api.sebrands.com/website-companion/api/contact/club)

 endpoint sending all the required info.After successful submission of form, it redirects to thank you page.

 

- **URL Parameters Used for Communication:**
- **Parameter Name: **club
- **Purpose: **To get club info
- **Example Usage: club=9993999**

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.

- **postMessage Communication:**

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically |
| redirect | redirect: { location: "/thank-you" } | To redirect users to thank you page |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts: **
- **Webflow script:** Webflow script is responsible for updating the iframe height dynamically based on content and for relative redirections to thank-you page.
- **React script:** This script is responsible for couple of dynamic behaviors: 
- Designing whole component.
- Functionality of location search and contact us.
- API integration and error handling.
- Sending postMessage to update the iframe height and redirection to thank-you
- Handling responsiveness for different screen sizes
- **User Input Handling:**
- Search field (Auto complete input)
- Select location (Button to select location)
- Fill out the form (Text and checkbox fields)
- Submit the form (Button)
 

- **State Management (if applicable):**

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling. 

- **Potential Issues & Workarounds: n/a**
- **Browser Compatibility Notes: **Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:** 
- It's using both react server components as well as client components to optimize rendering and improve overall application performance by handling static content on the server while maintaining interactivity where needed.

## 8. Additional Notes (For Complex Pages)
**Notes:** n/a**API Integration: **`POST /api/contact/club`: For sending user info and message to client.
