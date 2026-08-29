# Invitee

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=264b5511-4427-419e-b40b-4ff7f3322ef3
Updated: 2026-05-05T07:30:39.683Z

## 1. Page Overview - General Info
**Purpose:** This page is responsible for allowing users to claim their guest pass. Users visit the invite link their friend shared, select the gym, fill out form and redirect to booking flow to book and appointment.

 

- **Page Name: **Invite
- **URL: **/invite?h=DWEXUS&user=n
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
- **iFrame URL: **[https://{env}-react.anytimefitness.com/try-us-free?variant=invite&referralCode=CDJALKS&isMember=true](https://sit-react.anytimefitness.com/try-us-free?referralCode=QFWZRFNY&variant=invite&isMember=true)
- **Purpose & Functionality: **
- **Purpose:** The purpose of this iframe is to load invitee form to allow users to allow users to claim trial pass. 
- **Functionality: **This component is using try-us-free iframe configured for invitee flow.
**Non-members:** If URL has `user` param value equal to `n` it indicates the non member and will redirect to fallback screen first to select a gym (SS). Further the user membership is confirmed using this api GET 

[/api/prospects/referrals](https://seb-wp-website-companion-stage.azurewebsites.net/api/prospects/referrals) which returns `isAnoynymous` property as true for non-members and false for members.

User can switch between List and Map view. The map will display the pins of searched location.After selecting the location, user will see the below screen having benefits, location info and lead formAfter submitting the form, it'll make request to prospects and ndaypass EPs and user will be redirected to booking flow passing `variant` equals to `invite` .**Members:** If URL has `user` param value equal to `m` it indicates the member and will redirect directly to screen having location info and the form with additional member name on the top left. We got the location id from GET [/api/prospects/referrals](https://seb-wp-website-companion-stage.azurewebsites.net/api/prospects/referrals) EP and fetched the location info using club EP we already have.Rest of the flow is same as for non-members: user submits the lead form and it redirects to booking flow.

 

- **URL Parameters Used for Communication:**
- **Parameter Name: **hash
- **Purpose: **To get member and location info
- **Example Usage: **hash=JDLKFIW
- **URL Parameters Used for Communication:**
- **Parameter Name: **user
- **Purpose: **To determine if user is member or not
- **Example Usage: **user=n  or  user=m

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.

- **postMessage Communication:**

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically |
| redirect | redirect: { location: `/schedule-an-appointment-online?club=${clubId}` } | To redirect users to book a tour |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts: **
- **Webflow script:** In this script, we're getting the params like `h` , `user`  from url and pass it to iframe. Additionally it passes the param `variant`  equals `invite` to iframe since it's using try-us-free iframe.
- **React script:** This script is responsible for couple of dynamic behaviors: 
- Designing whole component.
- Functionality of location search and map
- API integration and error handling.
- Sending postMessage to update the iframe height and redirection to BAT
- Handling responsiveness for different screen sizes
- Displaying pins for searched location in the map
- Displaying member specific texts like member name on the top
- **User Input Handling:**
- Search field (Auto complete input)
- Select location (Button to select location)
- Fill out the form (Text and checkbox fields)
- Submit the form (Button)
- Tabs (To switch between List and Map view)
 

- **State Management (if applicable):**

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling. 

- **Potential Issues & Workarounds: **
- Flicker behavior when doing search for first time. Resolved by removing searched location from iframe URL.
- **Browser Compatibility Notes: **Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:** 
- It's using both react server components as well as client components to optimize rendering and improve overall application performance by handling static content on the server while maintaining interactivity where needed.
- User might have to wait more for all API calls (Depends on BE) to complete when search for location or when submit lead form.

## 8. Additional Notes (For Complex Pages)
**Notes:** n/a**API Integration: **`GET /api/prospects/referrals`: For getting referral and location info.
