# Referrer

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=aae683ee-b1f1-492c-a12d-62b7132458af
Updated: 2026-05-05T07:29:41.637Z

## 1. Page Overview - General Info
**Purpose:** This page is responsible for allowing users to refer their friends. To do that, users can type their phone number in the input to get the invite URL. After getting the invite URL, user can click on CTA to share with friends via multiple methods.

 

- **Page Name: **Invite Friend
- **URL: **/invite-friend
- **Development Reference: **[Figma or actual site link](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=132-91071&t=pbBS25KX5Sx0uVfK-1);
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
- **iFrame URL: **[https://{env}-react.anytimefitness.com/invite-friend](https://sit-react.anytimefitness.com/invite-friend)
- **Purpose & Functionality: **
- **Purpose:** The purpose of this iframe is to load referrer form to allow users to get the invite link. 

- **Functionality: **User can type the phone number in the input field as shown in screenshot
When user types the full phone number, notice the loader in the input field, it's verifying if user is member or not using POST [/api/prospect/referrels](https://seb-wp-website-companion-stage.azurewebsites.net/api/prospects/referrals?secret=7ce5318e26ff74afc2b64f3429c1f3f7) EP and get the invite link.**For members, invite link looks like this (notice **`**user**`**  param)**:"[https://stage.anytimefitness.com/invite/QFWZRFNY/?user=m](https://stage.anytimefitness.com/invite/QFWZRFNY/?user=m)"**If non-member**:"[https://sit.anytimefitness.com/invite/D5ZLXN0X/?user=n](https://sit.anytimefitness.com/invite/D5ZLXN0X/?user=n)"After the request is completed, notice the check icon in the input field and the CTA button will be enabled to share the invite URLOn clicking the 'SHARE TRIEL PASS' it'll open a share popup with link that can be shared via different methods

 

- **URL Parameters Used for Communication:**
- **Parameter Name: **n/a
- **Purpose: **n/a
- **Example Usage: n/a**

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.

- **postMessage Communication:**

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically |
| referralUrl | {action: 'share',referralUrl: url} | To open the share popup having referral url in there |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts: **
- **Webflow script:** We're managing the share functionality using webflow script as it gives permission error while opening share popup in the iframe.
- **React script:** This script is responsible for couple of dynamic behaviors: 
- Designing whole component.
- Functionality of phone number field like formatting the input, displaying loading indicator and check mark on completion of requests.
- API integration and error handling.
- Sending postMessage to update the iframe height
- Handling responsiveness for different screen sizes
- **User Input Handling:**
- Phone number input (Floating input)
- CTA (Button to share trial pass)
- **State Management (if applicable):**

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling. 

- **Potential Issues & Workarounds: **
- Opening the share modal has permission errors in the iframe. So had to move this logic to webflow script sending referral URL in postmessage.
- Since the invite URL has hash value as subpath like: "[https://sit.anytimefitness.com/invite/D5ZLXN0X/?user=n](https://sit.anytimefitness.com/invite/D5ZLXN0X/?user=n)" so webflow can't support this redirections unless all hash values are know (that's not possible). So had to regenerate the invite URL by using hash value as query param instead of subpath like: [https://sit.anytimefitness.com/invite/?h=D5ZLXN0X&user=n](https://sit.anytimefitness.com/invite/?hash=D5ZLXN0X&user=n)
- **Browser Compatibility Notes: **Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:** 
- It's using both react server components as well as client components to optimize rendering and improve overall application performance by handling static content on the server while maintaining interactivity where needed.
- User might have to wait more for all API calls (Depends on BE) to complete when entered phone number.

## 8. Additional Notes (For Complex Pages)
**Notes:** n/a**API Integration: **`POST /api/prospects/referrals`: For getting the invite link.
