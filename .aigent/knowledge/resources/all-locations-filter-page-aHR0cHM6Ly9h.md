# All Locations Filter Page

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=3705b207-a939-489b-8f07-12106712a2bd
Updated: 2026-05-06T20:55:20.581Z

## Overview
The **All Locations** page uses a combination of:

- **Client-side scripts - **[**page JS**](https://scripts.anytimefitness.com/all-locations/index.js)
- [**Finsweet**](https://finsweet.com/attributes)** functionalities**
-  to enable filtering and displaying of locations dynamically.
**Key points:**

- State and country filters start as native `<select>` inputs.
- Styling and behavior are enhanced via custom JavaScript, converting them into **custom-styled selects**.
- For **secondary locales**, US locations will not be available; e.g., in `en-au`, the items for Locations collection will only have Australia locations.

## Display All States
**Purpose:** Show all states/provinces in the filter.**Implementation:**

- **Collection Used:** States and Provinces collection.
- **Webflow Setup:**
- Added **9 Collection List** elements on the page to load all states.
- Each collection item includes **dynamic attributes** for state and country.
- **Script Behavior:**
- A client-side script populates the state filter based on these collection items.

 

## Display All Countries
**Purpose:** Show all countries in the filter.**Implementation:**

- **Collection Used:** Countries collection.
- **Webflow Setup:**
- Added **1 Collection List** element for countries.
- Used [finsweet dynamic select](https://finsweet.com/attributes/list-select)  to bind country names to the country filter.
- **Attributes:**
- `fs-list-element="select-value"` used for binding values.

## Display All US Locations
**Purpose:** Show all gyms in the US.**Implementation:**

- **Collection Used:** 
- Locations collection
- Must check the Use primary locale to ensure we get all the US locations.
- **Webflow Setup:**
- Added **1 Collection List** for all US locations.
- Applied [Finsweet list load](https://finsweet.com/attributes/list-load) to bypass Webflow’s **100 items per page** limit.
- **Attributes:**
- `fs-list-element="list"`
- `fs-list-load="all"`

## Display All International Locations
**Purpose:** Show all gyms outside the US.**Implementation:**

- **Collection Used:** International Locations collection.
- **Webflow Setup:**
- Added **1 Collection List** for all international locations.
- Applied **Finsweet List Load** to bypass Webflow’s item limit.
- **Attributes:**
- `fs-list-element="list"`
- `fs-list-load="all"`

 

## Combine and Filter US and International Locations
- Used [Finsweet list combine](https://finsweet.com/attributes/list-combine) to combine US and International locations so they can be filtered and displayed as one collection.
- Used [Finsweet filter](https://finsweet.com/attributes/list-filter) to filter locations by state and country
- Attributes added per collection
