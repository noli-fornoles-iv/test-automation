# Membership Inquiry | iFrame

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=0b3b1ee3-8059-4133-902d-ca9075100d64
Updated: 2026-07-21T09:42:11.763Z

# Overview
- **iFrame **
- **Name: **Membership Inquiry
- **URL**: [https://{env}-react.anytimefitness.com/{locale}/membership-inquiry](https://sit-react.anytimefitness.com/en-us/membership-inquiry)
- **Page **
- **Name**: Membership Inquiry
- **URL**: [https://{env}.anytimefitness.com/{locale}/membership-inquiry](https://www.anytimefitness.com/membership-inquiry)
- **Purpose**: This purpose of this iFrame is to let users search a location and submit membership inquiries for that location.

# Functionality
The iFrame can have at most 3 steps:

- **Step 1:** User visits page, no manual search has been made and search bar is empty.
- **Step 2**: User searches for a location by typing the keyword in the search bar.
- **Step 3**: User selects a location from the locations list or the map and moves to the lead form.
The iFrame contains 3 main components:

- **Banner**
- In steps 1 and 2, banner will only have a heading. The word `INQUIRY` can be spelled as `ENQUIRY` (e.g en-au)  for certain locales.

- In step 3, it will also show the selected location name and a description.

- **Location Selector**
- This uses the standard `LocationSelector` component, for further information please refer to the Location Search 2.0 [document](https://app.getguru.com/card/i69EKoET/Location-Search-20).
- Membership Inquiry supports the URL search param location, e.g. [https://sit.anytimefitness.com/membership-inquiry?location=Woodbury%2C+MN](https://sit.anytimefitness.com/membership-inquiry?location=Woodbury%2C+MN)
- **Lead Form**
- This uses the standard `LeadForm` component underneath.
- User can directly reach to the form by using location_id URL search param, e.g. [https://sit.anytimefitness.com/membership-inquiry?location_id=9993999](https://sit.anytimefitness.com/membership-inquiry?location_id=9993999)

# Session Storage

## Search & Location Param
- Whenever a keyword is searched through the search bar or user visits the page with the inclusion of `location` search param in the URL, it will store that location in session storage against the variable: `inquiry_latest_search_location`

```
sessionStorage.setItem(
  SESSION_STORAGE_LATEST_SEARCH_LOCATION_KEY,
  JSON.stringify(searchLocation),
);
```

## Location Selection & Location Id Param
- Whenever a location is selected from locations list/map or user visits the page with the inclusion of `location_id` search param in the URL, it will store that location in session storage against the variable: `inquiry_latest_location`

```
sessionStorage.setItem(
  SESSION_STORAGE_LATEST_LOCATION_KEY,
  JSON.stringify(location),
);
```

# Analytics
It will send analytics to data layer on 2 conditions:

- When the page loads with or without `location` URL search param.

```
sendFormAnalytics({
  locationId: undefined,
  locationName: undefined,
  variant: "membership-inquiry",
  eventType: "form_loaded",
});
```
- When the user selects a location from the locations list or when page directly loads with `location_id` URL search param.

```
sendFormAnalytics({
  locationId,
  locationName,
  variant: "membership-inquiry",
  eventType: "form_loaded",
});
```

# WebFlow Communication

## Height Adjustment
- On page load, it calls the height adjustment hook, which sends the relevant post message to WF:

```
const { setIframeExtraHeight } = useAutoIframeHeight({
  elementRef: containerRef,
  dependencies: [
    isLoading,
    isMobileViewport,
    currentStep,
    searchLocation,
    areLocationsLoading,
  ],
});

useEffect(() => {
  setIframeExtraHeight(100);
}, [areLocationsLoading]);
```

## Step 1
- When user is on [Step 1](https://app.getguru.com/card/iRXjj7BT/Membership-Inquiry-iFrame#1ERoBO76I7aI), it means there are no location related URL params and user has not searched any area. It will send following post messages:

```
postMessage({
  deleteUrlParam: WEBFLOW_LOCATION_ID_PARAM_KEY,
});

postMessage({
  deleteUrlParam: WEBFLOW_SEARCH_LOCATION_PARAM_KEY,
});
```

## Step 2
- When user is on [Step 2](https://app.getguru.com/card/iRXjj7BT/Membership-Inquiry-iFrame#T9WvVGu3xvOu), it means user has searched for an area and `location` URL search param is present. It will send following post messages:

```
postMessage({
  replaceUrlParam: {
    key: WEBFLOW_SEARCH_LOCATION_PARAM_KEY,
    value: searchLocation.place,
  },
});

postMessage({
  deleteUrlParam: WEBFLOW_LOCATION_ID_PARAM_KEY,
});
```

## Step 3
- When user is on [Step 3](https://app.getguru.com/card/iRXjj7BT/Membership-Inquiry-iFrame#uo5G51FOOA7q), it means use has either selected a location or visited the page directly with `location_id` URL search param. It will send following post messages:

```
postMessage({
  replaceUrlParam: {
    key: WEBFLOW_LOCATION_ID_PARAM_KEY,
    value: location.location_number,
  },
});

postMessage({
  deleteUrlParam: WEBFLOW_SEARCH_LOCATION_PARAM_KEY,
});
```

## Search Error
- When there is a search error, . It will send following post message:

```
postMessage({
  deleteUrlParam: WEBFLOW_SEARCH_LOCATION_PARAM_KEY,
});
```

## Form Submission
- After a successful form submission it will redirect to `Book A Tour` page and send the relevant post message to WF only if:
- The Locale has Book A Tour `enabled` in the configuration file. 
- The Location is registered in WebFlow Collection and has stats as `open`. 
- The lead-capture API endpoint call returns `can_book_appointment` as `true`.

```
postMessage({
  batVariant: BATVariant.ADDON,
  locationId,
  prospectId: prospectResponse.prospect.external_id ?? "",
  prospectData: prospectResponse.prospect,
  redirect: {
    to: `/schedule-an-appointment-online?${WEBFLOW_LOCATION_ID_PARAM_KEY}=${locationId}`,
  },
});
```
- Else it will navigate to the `Thank You` page and send the following post message:

```
postMessage({
  redirect: { to: "/thank-you" },
});
```

# **API Endpoints**
This iFrame uses multiple API endpoints but most of them are handled by `LocationSelector` and `LeadForm`. The ones which it directly handles are as following:

- **Country Locations API**
- This API is used for passing the locations data to the `LocationSelector` component. The iFrame makes call to this API using the `useLocations` hook.
- **Endpoint URI**: `/api/locations/?country={iso3_country_code}`
- **Endpoint Method**: GET
- **Example Payload**: N/A
- **Example Response**: 

```
{
  "items": [
      {
          "id": "3cf91101-9739-4986-97e3-45cccd474de7",
          "name": "Baton Rouge (Lovett Rd)",
          "status": "OPEN",
          "address": {
              "address1": "11231 Lovett Rd",
              "city": "Baton Rouge",
              "state": "Louisiana",
              "country": "United States",
              "state_abbr": "US-LA",
              "country_abbr": "USA",
              "postal_code": "70818"
          },
          "latitude": 30.53202,
          "longitude": -91.06088,
          "location_id": "3cf91101-9739-4986-97e3-45cccd474de7",
          "location_number": "1646",
          "time_zone": "America/Chicago",
          "created_at": "2025-04-04T15:08:20.149Z",
          "updated_at": "2025-11-21T00:11:37.094Z",
          "geo_code_short": "9vr",
          "phone_number": "(225) 456-5156",
          "email": "CentralLA@anytimefitness.com",
          "show_on_map": true,
          "filter_tags": []
      },
    ]
}
```
- **Location Details API**
- This API is used for passing data to `Banner` component and  `LeadForm` component.
- **Endpoint URI**: `/api/locations/{locationId}/`
- **Endpoint Method**: GET
- **Example Payload**: N/A
- **Example Response**: 

```
{
    "id": "30133f86-3c63-49fc-b974-2b7938b0d3dc",
    "name": "Woodbury! (Test2)",
    "status": "OPEN",
    "address": {
        "address1": "111 Weir Drive",
        "address2": "Suite 10012",
        "city": "Woodbury!",
        "state": "Minnesota",
        "country": "United States",
        "state_abbr": "US-MN",
        "country_abbr": "USA",
        "postal_code": "55125"
    },
    "latitude": 44.9467346,
    "longitude": -92.9625758,
    "location_id": "30133f86-3c63-49fc-b974-2b7938b0d3dc",
    "location_number": "9993999",
    "time_zone": "America/Chicago",
    "created_at": "2025-04-04T15:08:48.025Z",
    "updated_at": "2026-04-06T14:08:32.329Z",
    "geo_code_short": "9zv",
    "phone_number": "65143850002",
    "email": "club9993999S@gmail.com",
    "show_on_map": true
}
```

# **User Interface**

## Desktop

### Step 1

### Step 2

### Step 3

### FORM Submission API Error

## Mobile

### Step 1

### Step 2

### Step 3

### FORM Submission API Error
