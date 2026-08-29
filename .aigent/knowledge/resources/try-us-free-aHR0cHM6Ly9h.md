# Try Us Free

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=5f79d735-3d54-40e4-b141-956e1c82fdfc
Updated: 2026-05-05T07:29:09.798Z

## w1. Page Overview - General Info
**Purpose: **The Try Us Free page is responsible for allowing users to register as Prospects for a local gym. Users can select their preferred gym location, provide their Lead Form data, and from there they are redirected to the 

[BAT Flow](https://app.clickup.com/2227378/v/dc/23z5j-153354/23z5j-156074).

 

- **Page Name: **Try Us Free
- **URL:  **/try-us-free
- **Development Reference: **[Figma](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=54-22672)
- **SEO Configuration:**
- ***Meta Title: ***Try Us For Free | Anytime Fitness
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
 

- **iFrame Name: **Try Us Free
- **iFrame URL: **[https://{env}-react.anytimefitness.com/try-us-free](https://dev-webflow.anytimefitness.com/try-us-free)
- **Purpose & Functionality:**
- **Purpose: **The purpose of this iframe is to load a multi-step form to complete the Try Us Free flow.
- **Functionality:**
**(Step 1) → Find a gym: **When the user visits** **`/try-us-free` without any param (like **"location"** or **"club"**) the flow will load in the "Find a gym" step. Here the user will select a location by searching, mapbox suggestions will load while typing.

**(Step 2) → Choose your gym: **When the user visits** **`/try-us-free?location={location-keyword}`, where the **"location"** param is specified, the flow will load in the "Choose your gym" step with a pre-loaded list of gyms that belong to that location. Here the user will select a gym from the list.A local project file contains an array with all the gyms that can be listed, a **Haversine Distance** **Algorithm** is used in order to calculate how far they are from the selected location, then they are sorted in ascending order and the top 10 is displayed here.**(Step 3) → Submit form: **When the user visits** **`/try-us-free?club={club-id}`, where the **"club"** param is specified, the flow will load in the "Submit form" step. Here the user will fill the Lead Form data to finish the flow.

- This step makes a **(stage-api)** **GET** [/clubs/{clubId}](https://stage-api.anytimefitness.com/clubs/9993999) API call in order to retrieve the Club Data.
- When submitting the form by clicking the **"CLAIM OFFER"** button:
- **Validation** will run:
- The data will be validated and error messages will be shown in case of invalid input.
- **ReCaptcha **will run:** **
Before submitting the Lead Form there's a step involved called Google reCaptcha** **verification. For this, we're using `v2 invisible` that doesn't display any checkbox widget, instead it displays challenge to the user when clicking on the **"CLAIM OFFER"** button, only when google detects any suspicious activity.If no suspicious activity is detected it'll makes an API call to POST 

[/verify-captcha](https://dev-react.anytimefitness.com/api/verify-recaptcha), this automatically verifies the user based on his activity.

- The** Prospect **will be created by making the following API Calls:
- **POST (companion-api)** [/scheduling/prospects](https://seb-wp-website-companion-stage.azurewebsites.net/api/scheduling/prospects?secret=7ce5318e26ff74afc2b64f3429c1f3f7) to submit user info and get prospect id.
- **POST (stage-api)** [/clubs/{clubId}/ndaypass](https://stage-api.anytimefitness.com/clubs/9993999/ndaypass) to submit user and location info.
- The information collected will then be used to redirect the user to the [BAT Flow](https://app.clickup.com/2227378/v/dc/23z5j-153354/23z5j-156074).
       Before submitting the form this is how a **ReCaptcha Challenge** can look like: 

- **URL Parameters Used for Communication:**
**      1. Parameter Name:** location

- **Purpose:** Location keyword in order to fetch its information and start in second step (Choose your gym).
- **Example Usage:** [https://{env}-react.anytimefitness.com/try-us-free?location=NYC,NY](https://dev-webflow.anytimefitness.com/try-us-free?location=NYC,NY)
 **      2. Parameter Name:** club

- **Purpose:** Club id in order to fetch its information and start in latest step (Submit form).
- **Example Usage:** [https://{env}-react.anytimefitness.com/try-us-free?club=9993999](https://dev-webflow.anytimefitness.com/try-us-free?club=9993999)

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.

- **postMessage Communication:**

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically. |
| replaceUrlParam | {key: {value}value: {value}} | To replace a URL param value. |
| deleteUrlParam | {deleteUrlParam: {value}} | To delete a URL param. |
| Redirect to BAT flow | {redirect: {value} variant: {BAT Variant} (standalone | addon | fitnessPlus | fitnessPlusNew) clubId: {value} prospectId: {value}} | To redirect to the BAT Flow. |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts:**
- **Webflow Script**:
- A custom wfjs script is implemented for this integration in order to handle communication between Webflow and the Iframe.
- **React Script:**
- The react code is responsible for the complete implementation of this feature and communicating with Webflow by using **postMessage**, which is handled by the respective wfjs script.
- **User Input Handling:**
- Finding a location.
- Selecting a Gym.
- When filling and Submitting the Lead Form.
- **State Management (if applicable):**

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling.

- **Potential Issues & Workarounds:**
- Handling of the **"location"** param:
If the location keyword provided is not valid then an error will be displayed on top of the **Search Bar**.

- Handling of the **"club"** param:
If the club of the id provided isn't found, the user is redirected to the first step (Find a gym) and the param is removed from the URL.

- **Browser Compatibility Notes: **
- Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:**
- User might have to wait more for all API calls (depends on BE) to complete when submitting the form.

## 8. Additional Notes (For Complex Pages)
**Notes:**

- Search is only giving suggestions for US locations
- ReCAPTCHA auto verify (no challenge displayed) if no suspicious activity is found by google.
- After clicking **"CLAIM OFFER"** if the **POST (companion-api)** [/scheduling/prospects](https://seb-wp-website-companion-stage.azurewebsites.net/api/scheduling/prospects?secret=7ce5318e26ff74afc2b64f3429c1f3f7) API call fails then it'll not move forward with **POST (stage-api)** [/clubs/{clubId}/ndaypass](https://stage-api.anytimefitness.com/clubs/9993999/ndaypass).
 **Third-Party Libraries:**

- `tailwind-merge`: For overriding tailwind classes based on conditions
