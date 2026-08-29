# Gym Finder

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=a69b24c1-348f-45ba-bed3-3d99ea912a03
Updated: 2026-05-05T07:27:08.870Z

## 1. Page Overview - General Info
**Purpose:** This page is responsible for allowing users to find the gym using autocomplete search field and a fully functional map. Users can enter a city, state, or zip code to find nearby locations which are marked with pins on the interactive map. User can also get nearest-gyms based on his coordinates and precise browser based location. 

 

- **Page Name: **Invite
- **URL: **/find-gym
- **Development Reference: **[Figma or actual site link](https://www.anytimefitness.com/find-gym/);
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
- **iFrame URL: **﻿[Anytimefitnessdev-react.anytimefitness.com/gym-finder](https://dev-react.anytimefitness.com/gym-finder)﻿ 
- **Purpose & Functionality: **
- **Purpose:** The purpose of this iframe is to load gym finder to allow users to their nearest gym. 
- 
- For mobile, it displays results and map in tabbed view
- 
- **Functionality: **
**Search Field:** Let's start with search field where user can search for a gym (with auto suggestions when user type ). This search bar is imported from the shared library with our own configurations (variant=basic).

This field is auto-populated for US locations with location nearest to user's current IP (using IP stack) or Browser's location.**Note: **Because Cayman islands is grouped with US locations, the mapbox search includes Cayman Islands when on the US locale.More behaviors can be seen here: ﻿[Google SheetGoogle Drive File](https://docs.google.com/spreadsheets/d/1KdRls9WFH-1t7phCRWmReMv2JGyTcdG2DcAFlA8ylwM/edit?pli=1&gid=0#gid=0)﻿ (see the expected behaviors tab)**Auto-suggestions:** MapBox 'proximity' feature allows us to send user coordinates to mapbox to prioritize auto-suggestions based on user location (nearest). Rest of the logic is handled by mapbox suggestions API what results it should display.**Map & Results:** It's using mapbox-gl library and customized logic for controlling different behaviors in the map like adding pins, hover effect (mapbox layers are used), full-screen control, manage satellite styles and more. For populating map with pins, it's using new API from client that returns all gyms based on country provided. After selecting an option, the map will fly to searched location based on centroid coordinates of searched location (using mapbox api from shared lib) and display results based on pins visible in the map (max 50). The cards in result section are coming from shared library with our own customizations.If user drag/zoom the map then result list is updated with current visible pins. And on clicking on CTA: 'GET A FREE TRIAL' it'll redirect user to `/try-us-free?club=${clubid}` When clicked on a pin in the map, it'll open a popup having location info and CTA to redirect to local gym page. For popup, it's using HTML string template and managing it's own postmessage. Pins are of two colors: Purple for OPEN gyms. Black for COMING_SOON and PRE_SALE gyms.It also has other controls like full screen (for full-screen view) satellite view and zoom buttonsMore behaviors can be seen here: ﻿[Google SheetGoogle Drive File](https://docs.google.com/spreadsheets/d/1KdRls9WFH-1t7phCRWmReMv2JGyTcdG2DcAFlA8ylwM/edit?pli=1&gid=0#gid=0)﻿ (see the expected behaviors tab)**Geolocation:** It's calculated first by user's IP using IP stack and saved to sessionStorage and if user refresh the page, the location is fetched from sessionStorage instead of making request to IP stack. For more accurate location, we've a button inside the map saying 'Use my precise location' which asks user permissions for location and if allow then calculates the coordinates. So when user visits the page, for non US citizens, it'll display the whole US map in any case. And for US ones, the map will fly to user's coordinates (auto-populating search field).More geo location behaviors can be seen here: ﻿[Google SheetGoogle Drive File](https://docs.google.com/spreadsheets/d/1KdRls9WFH-1t7phCRWmReMv2JGyTcdG2DcAFlA8ylwM/edit?pli=1&gid=0#gid=0)﻿ (see the expected behaviors tab) and also from this test pad: ﻿[TestpadTESTPAD REPORT | outliantteam](https://outliantteam.testpad.com/script/18051/report?auth=b07da0e6b95319bea1bdd2ca45de2392)﻿ 

 

- **URL Parameters Used for Communication: n/a**

## 5. Communication Between Webflow Page & iFrames
**Purpose:** Detail how the Webflow page interacts with its iFrames, including postMessage and URL parameters.

- **postMessage Communication:**

| Action Name | Data | Purpose |
| --- | --- | --- |
| frameHeight | {frameHeight: rect.height} | To set iframe height dynamically |
| redirect | redirect: { location: "/gyms/${clubid}" }redirect: { location: "/try-us-free/?club=${clubid}" } | To redirect users to local gym page.To redirect users to try-us-free page with club id |

## 6. Dynamic Behavior & Custom Interactions
**Purpose:** Explain any custom behaviors beyond standard Webflow features.

- **Event Listeners & Custom Scripts: **
- **Webflow script:** Webflow script is responsible for updating the iframe height dynamically based on content and for relative redirections to try-us-free and local gym page. Also it's responsible for calculation browser based geolocation. It asks for user's permission, if allowed, it sends post messsage to iframe with coordinates info.
- **React script:** This script is responsible for couple of dynamic behaviors: 
- Designing whole component.
- Functionality of location search and contact us.
- API integration and error handling.
- Sending postMessage to update the iframe height and redirection to thank-you
- Handling responsiveness for different screen sizes.
- Loading pins on map (pins optimization)
- Displaying cards in result list based on current visible pins
- Calculating user's location
- Managing pins color and hover effects
- Flying map to searched location and user's current location
- **User Input Handling:**
- Search field (Auto complete input)
- Select option (Dropdown to select location)
- Map controls (Full-screen, zoom, satellite)
- Use precise location (Button to get user's accurate location)
- 'GET A FREE TRIAL' (CTA to redirect user to try-us-free?club=clubid)
- 'VISIT WEBSITE' (Link to redirect user to local gym page)
- 'GET DIRECTIONS' (Link to redirect user to google map with gym coordinates)
 

- **State Management (if applicable):**

## 7. Edge Cases & Known Issues
**Purpose:** Document any limitations, known bugs, or scenarios requiring special handling. 

- **Potential Issues & Workarounds: n/a**
- **Browser Compatibility Notes: **Media queries and dynamic resizing functions work consistently across different browsers and devices.
- **Performance Considerations:** 
- It's using both react server components as well as client components to optimize rendering and improve overall application performance by handling static content on the server while maintaining interactivity where needed.
- Used mapbox-gl directly without any wrapper and layers to manage pins optimization for large number of gyms.

## 8. Additional Notes (For Complex Pages)
**Notes:** n/a**API Integration: **

GET [/api/gyms](https://cdpb3uxhoh.execute-api.us-east-1.amazonaws.com/v1?country=usa)

: For getting all gyms for populating map pins.
