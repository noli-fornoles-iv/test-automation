# Book a Tour

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=38f8b4b9-a083-4228-a5a2-5b490233eba8
Updated: 2026-05-05T07:28:15.514Z

## 1. Page Overview - General Info
**Purpose:** The book a tour page is responsible for allowing users to schedule a visit to their local gym. To book a tour, users can select their preferred gym location, choose a convenient date and time, and provide their contact information through a lead form. It has 6 variants of different data and layout:

- fitnessPlus
- fitnessPlusNew
- addon
- standalone (Default)
- inviteMember
- inviteNonMember
 

- **Page Name: **Online Scheduling
- **URL: **/schedule-an-appointment-online
- **Development Reference: **[Figma or actual site link;](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=120-69324&t=6B9NukgUNx42oWLD-1)
- **SEO Configuration:**
- ***Meta Title:  ***Online Scheduling - Anytime Fitness
- ***Meta Description: ****n/a*

## 2. Webflow Structure
**Purpose:** Outline how the page is structured in Webflow, listing the sections used, components 

- **Main Sections:** 
-  
- **Custom Webflow Interactions & Animations: **N/A
- **CMS Collections (if applicable): **N/A

## 3. External JavaScript and Tools
**Purpose:** Describe here any external lib or toll that this page may need to handle a specific functionality and why to use this instead of WF native

- **Scripts Injected in Webflow:**
- **Lib/tool Name:**
- **Purpose:**

## 4. iFrame Components

### 4.1 iFrame documentation
 

- **iFrame Name: Book a Tour**
- **iFrame URL: **[https://{env}-react.anytimefitness.com/book-a-tour](https://dev-react.anytimefitness.com/book-a-tour?club=9993999&variant=standalone)
- **Purpose & Functionality: **
- **Purpose:** The purpose of this iframe is to load multi-step form with different variants to complete the book a tour flow. 
- **Functionality: **
**Banner:** The very first thing that user see is the banner and its layout and content is based on what currently variant is and what's the current step for example:`variant=standalone` and `screen=1`  

`variant=standalone` and `screen=2` Above is similar structure for other variants as well except the below ones: `variant=addon` and `screen=2` - It has location details and Add to calendar button embedded`variant=fitnessPlusNew` and `screen=2` - it displays 2 QR-codes for large apple devices and 1 QR-code (Download the AF App) for other large devices In mobile, it displays CTAs instead of QR-codes**(Step: 1) → Location Search:** When user visit `/schedule-an-appointment-online` page without any param (club), it'll land to the Location Search screen where user can search for a gym (with auto suggestions when user type ). This search bar is imported from the shared library with our own configurations.After selecting an option, it'll return 10 nearest gyms to user from where user can select a gym. The gym cards in the list are imported from shared library with variant styles.Once user has selected a gym in Location Search screen, it'll send the postMessage and add the query param named `club` in the webflow and iframe URL.For invalid search that doesn't have any suggestions, it'll display the errorError will be gone when user again start typing.**(Step: 2) → Gym Location:** User can either directly come to step 2 by adding `club` param in the URL or with the `club`  param embedded in the iframe from step 1 (Location Search). it'll make API request to (stage-api) GET 

[/clubs/{clubId}](https://stage-api.anytimefitness.com/clubs/9993999)

  endpoint to fetch the club details and display in step 2 (Calendar) and 3 (See you soon)

**(Step: 2) → Calendar:** The layout of this step depends on `variant` query param. If variant equals to any of these: fitnessPlus, fitnessPlusNew and addon, it'll require a prospect id from it's previous flow like `try-us-free` where user submits his info using a lead form and make API request to prospect endpoint. It makes API call to (companion-api) GET 

[/scheduling/availabilities](https://seb-wp-website-companion-stage.azurewebsites.net/api/scheduling/clubs/3783/availabilities?duration=Thirty&startDate=2025-02-06T08:41:46.086Z&endDate=2025-02-13T08:41:46.086Z&secret=7ce5318e26ff74afc2b64f3429c1f3f7)

  endpoint with start and end date params and calculate data for date cards and timeslots and display date cards having multiple timeslots (that represents availability hours) in selected gym's time-zone. 

In order to reserve time, user need to select a date and time otherwise he'll see validation errorAfter clicking 'RESERVE TIME', it'll make API call to (companion-api) POST 

[/scheduling/appointments](https://seb-wp-website-companion-stage.azurewebsites.net/api/scheduling/appointments?secret=7ce5318e26ff74afc2b64f3429c1f3f7)

  with date, time and prospect info.And for `variant=standalone` we don't have any prospect id and we need to create a fresh prospect by filling the lead form (in order to pass prospect id to appointments API). If no `variant` query param is passed to iframe, it'll be default to `standalone` variant. At the end, it'll display gym location, calendar and lead form. Lead form is imported from shared library with our own configurations like validation schema, fields, errors, styles.

And same for this, if user doesn't fill the form or doesn't select the date and time, it'll throw validation errorsAfter filling out the form click 'LET'S DO THIS', it'll first verify captcha, then make these API calls: 

- POST (companion-api) [/scheduling/prospects](https://seb-wp-website-companion-stage.azurewebsites.net/api/scheduling/prospects?secret=7ce5318e26ff74afc2b64f3429c1f3f7) to submit user info and get prospect id
- POST (companion-api) [/scheduling/appointments](https://seb-wp-website-companion-stage.azurewebsites.net/api/scheduling/appointments?secret=7ce5318e26ff74afc2b64f3429c1f3f7) to book an appointment with selected date/time and prospect info.
If there's an error while making API calls (even midway), we display this error alert and don't proceed with remaining API calls

**ReCaptcha:** Before submitting the lead form, there's a step involved called google reCaptcha verification. For this, we're using `v2 invisible` of google reCaptcha that doesn't display any checkbox widget but instead it displays challenge to user when user click on 'LET'S DO THIS' button only when google detect any suspicious activity. Otherwise it makes API call to POST [/verify-captcha](https://dev-react.anytimefitness.com/api/verify-recaptcha) to automatically verify the user based on his activity.**(Step: 3) → See You Soon:** After verifying captcha and successfully submitting the form, user will switch to step 3 that is see you soon screen where it displays gym info and 'Add to Calendar' button for all variantsBut the layout can be different for variants like for:`variant=addon` - it displays gym location inside the banner and also have a section for 'Invite a Friend'`variant=fitnessPlusNew` - it displays gym location outside the banner but instead displays QR-Codes inside the bannerFor any variant, there's a button called 'ADD TO CALENDAR' that opens up a dropdown for selecting any calendar from Google, Apple and Outlook. Google Calendar:When user selects option 'Google', a link is generated based on start time, end time, description, title, time-zone and user is redirected to google calendar with these information prepopulated.  Apple & Outlook:It generates .ics file based on information provided that can be imported in apple and outlook app. **QR-Code:** For `variant=fitnessPlusNew` it displays QR-Code in 'See You Soon' screen as displayed above, it shows 2 QR-Codes for large apple devices and 1 QR-Code (Download the AF App) for large non-apple devices. We're using external library called `qrcode.react` for generating the QR-Code. The one having AF logo is generated using `deeplink` attribute we get from prospect API response. And the one having apple logo is generated using `redemurl` we get from (companion-api) POST [/fitness-content/prospect-fplus-code](https://seb-wp-website-companion-stage.azurewebsites.net/api/fitness-content/prospect-fplus-code?secret=7ce5318e26ff74afc2b64f3429c1f3f7) passing it `fitnessCorrelationId` we received from prospect API response.For small devices, it displays CTAs instead of QR code.**Apple devices:** 'ACTIVATE FITNESS+ OFFER' is linked with `redemurl` and 'DOWNLOAD AF APP' is linked with `deeplink` **Non-Apple devices:** 'COMPATIBLE DEVICES' is linked with this [URL](https://www.anytimefitness.com/apple-fitness-plus-devices/)

 

 

- **URL Parameters Used for Communication:**
- **Parameter Name: **club
- **Purpose: **In order to fetch club information 
- **Example Usage: **[https://{env}-react.anytimefitness.com/book-a-tour?club=9993999](https://dev-react.anytimefitness.com/book-a-tour?club=9993999&variant=standalone)
- **URL Parameters Used for Communication:**
- **Parameter Name: **variant
- **Purpose: In order to conditionally load different styles/structure**
- **Example Usage: **[https://{env}-react.anytimefitness.com/book-a-tour?club=9993999&variant=standalone](https://dev-react.anytimefitness.com/book-a-tour?club=9993999&variant=standalone)
- `variant`  can be 
- fitnessplus
- standalone
- fitnessPlusNew
- addon

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.

- **postMessage Communication:**

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically |
| updateIframeHeight | {updateIframeHeight: value} | To increase or decrease iframe height on purpose |
| cleanUrlParams | {cleanUrlParams: true}cleanUrlParams(["club"]); | To clear all URL params except the allowed ones |
| clubId | {clubId: value} | To insert club param in URL |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts: **
- **Webflow script:** We're managing webflow scripts as well inside the codebase for communication b/w iframes and webflow for example setting dynamic iframe height, update url params, manage session storage and more.
- **React script:** This script is responsible for couple of dynamic behaviors: 
- Designing each component like Location Search, Calendar, Lead Form, See you soon.
- Functionality of every component whether it's API integration, error handling, loading behavior, user interaction and validations.
- Switching between different steps of form based on user actions
- Sending postMessage to update webflow page and iframe element modification
- Handling responsiveness for different screen sizes
- Implementing each component to be reusable and maintainable with clear separation of concerns.
- **User Input Handling: **Since this iframe has lot of interactions, there's lot of user input like:
- Search the gym (Autocomplete input)
- Select the gym (Button to select the gym)
- Pick a date and time (Clickable cards)
- Fill out the form (Text and checkbox fields)
- Submit the form (Button)
- Add to calendar (Drop down)
- **State Management (if applicable):**

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling. 

- **Potential Issues & Workarounds: **
- Race condition in API calls: Like we've to make all calls in one click (e.g. reCaptcha, ndaypass, prospect, appointment) is handled using various conditions like if one is passed then move to other in this sequence: reCaptcha →  prospect → ndaypass → appointment.
- Manual URL Parameter Tampering: Users might manually modify URL parameters (`club`, `variant`). If club id is invalid then user will see the fallback Location Search screen. If variant is invalid, user will see the default one that is standalone.
- **Browser Compatibility Notes: **Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:** 
- It's using both react server components as well as client components to optimize rendering and improve overall application performance by handling static content on the server while maintaining interactivity where needed.
- User might have to wait more for all API calls (Depends on BE) to complete when submitting the form.

## 8. Additional Notes (For Complex Pages)
**Notes:** 

- Search is only giving suggestions for US locations
- Date card is not displayed when there's no slot inside it
- ReCAPTCHA auto verify (No challenge displayed) if no suspicious activity is found by google
- After clicking 'LET'S DO THIS' if any one API call from sequence is failed then it'll not move forward with other calls
 **Architecture:** Each functionality (Location Search, Calendar, Lead Form, See You Soon) is encapsulated within reusable React components that handle their own API integrations, validations, and error states.  

 **API Integration: **`GET /clubs/{clubId}`: For fetching gym details based on the clubId.`GET /scheduling/availabilities`: For retrieving available timeslots for selected date range.   `POST /scheduling/appointments`: For making an appointment for the selected time and user info.   `POST /scheduling/prospects`: To submit user info and get prospect info in response to be used in appointments endpoint.Captcha Verification: To trigger a challenge only under suspicious activity before form submission.  

 **Third-Party Libraries:**

- `qrcode.react`: For dynamically generating QR codes based on URL provided.
- `date-fns`: For effectively playing with dates and time-zones
- `tailwind-merge`: For overriding tailwind classes based on conditions
 **Diagram: **

[Link here](https://mermaid.live/edit#pako:eNqVVm1v2zYQ_iuEhg4tajuW35YIQwfHntsAaerFaYBNyQdaoiIilKiRVFzPyX_fiaRkSY6DzR-S4_G54_HuuRN3TsBD4nhOxPgmiLFQ6GZ-lyL4rRSs3vvfJRHolkqqJFriB4I8dCKDmIQ5I12cdnGWcZqqhKSqy1NGU3L_AXW7n9AXLGcsX-_gPwpAQBkWOPntxXg3f9-9Q5c8wIryFK0IFkGMFhCI2bQOCmfPV_y5Qhqg3zZcBYKQ9N7YNrE6HiNepFmufKvWC7ShKkbTXPGAJxkjilgfNYPyQtdE5kxJfScrlxfa71YBr2K--V0ILvxCQlpEX4mUkMbyjBLSDvFVp38SabxeAXC9_bxNpHHt9lGhIlKhQllzvkfqE0BYEUYCRUIfZFQurEVtW8O_ZyFW5Pv1pW8kBKLJ176i962CfsU01VVE5wKnkOU1luAOCnWLBcWpOqyuvtcsJsGjhez0ojSwGa6C0aHV4a0IgLlpiBlPSekBvZ-TCEMePxhQ3VhHICuT55p5cQu_5q1Y31fdUQPpiBZEBTFkcE4Upky6vlYUOUVWZW3bQFN7KNYMMwJexd65KW-pRz-jS4JDtOAiqdX40Ex7vMWMFhnbq3eFITi5oQmpSl8S-BDeILLdhp7SfHVNZHutoXctqrbBG7d8MwBNjlsiaLSd4Qwyh13fLJEgs-nyZvZlao9tovSBS8ED6LhaRq0GTZcX0vt1LU4-uT00E6SgN-zJDLKi1YMeWuXrhCp0NcfbJZZSq4c9dM75I5ruB1-7BRZUpXDEkuXypCZfkc3JNAz3nSCPsDGq2UdNe1zYP8Pw-TungpTx-nZdXQBdzG1QLeRrTB38V6YODmpoo27S9BVq1m6n2VeSb_cqFeuIt0g4-L8kPHqBI-dq7hXVrhXbb1e_YFKbAas80CQzHyVb5wMummgM1CB3TUNNuPb8tElqhXXoqxXSnEYREQWyeUaLjA0XR2ajCC3KL9eVz1tKNqarCjZdpBFHHxGQHil-wI-Dkyy5dY-UJ5iGecM9fG3OcZoSodUfQflEoZUXgsJhQK2gqP7RI5vt9YwWhVSeXevdVyL44xrN4PEkUQSfb6gEI9A9TxRQenvONynjMK2ni2JXo76pmAjZJks13hcwhHJhx6HM1w8CZ_F-e6qvYutU_CA3N7zc9ltZRue5UtXND-DmI2oXs5hD3DvD_Ur7sjdtAnXmPnP-wIAS5v81CWHK6ElkhCIUs9Wu-xF_OoMn33LFgNjglkBJYSZfzFZ-KaMeDSRMV1Y-n8BHPZe1F8AWXqIPZh0wGN3w_UdPdghFlDFvzXDw2JFK8Efi_TQcDq3c3dBQxd4g-1GzbozoTpNF1qvTcRIiEkxDeE3vCts7B6qdkDvHAxHu-njn3KUvgMPw1lxt08DxlMhJxxE8f4gdL8JMwirXz5w5xVD9pIRkOP2L8_rS8XbOD8fruu6oN56Mz0aDSX_SH_YHk46z1frTUe_UHY-Gp6Ox67qD0UvH-Uf7GPYG_dOz4S-j_mQ8PDtzJ-OXfwEPmxp3)
