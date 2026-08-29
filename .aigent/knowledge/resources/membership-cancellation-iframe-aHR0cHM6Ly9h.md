# Membership Cancellation | iFrame

Tab: Resources
Source: https://app.getguru.com/card/Tgq6nyac/Membership-Cancellation-iFrame
Updated: 2026-07-21T12:47:13.322Z

# Overview
- **iFrame **
- **Name: **Membership Cancellation
- **URL**: [https://{env}-react.anytimefitness.com/{locale}/membership-cancellation/](https://sit-react.anytimefitness.com/de-de/membership-cancellation/)
- **Page **
- **Name**: Cancel Membership
- **URL**: [https://{env}.anytimefitness.com/{locale}/cancel-membership](https://sit.anytimefitness.com/de-de/cancel-membership)
- **Purpose**: This purpose of this iFrame is to let users search a location and submit membership cancellation request for that location. Not all locales use this.

# Functionality
The iFrame contains Location Search and Form:

- **Location Search**
- This uses the standard `LocationSelector` component, for further information please refer to the Location Search 2.0 [document](https://app.getguru.com/card/i69EKoET/Location-Search-20).
- It does not supports the `location` URL search param.
- **Form**
- It supports both `location_id` and `club` (legacy) URL search params for location id, can be used interchangeably.
- On successful submission user will be navigated to thank you [page](https://sit.anytimefitness.com/thank-you) and will also receive an [email](https://app.getguru.com/card/Tgq6nyac/Membership-Cancellation-iFrame#iF7zW3bH7fo9) with relevant details. You may not receive email on stage API, make sure to use the URL search param `use_prod_api=true` on lower environments.
- **First Name**
- This is a required text field.
- This uses the same validation as the lead form, it should only accept alphabets.
- **Last Name**
- This is a required text field.
- This uses the same validation as the lead form, it should only accept alphabets.
- **Email**
- This is a required text field.
- This uses the same validation as the lead form, it should only accept standard email format.
- **Mobile Phone**
- This is a required text field.
- This uses the same validation as the lead form, refer to the phone number [document](https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=f268081d-15cc-43d2-8c84-7476a73c4ef9#jDfF9Y7Ax4Qc) for further details.
- **Contract Number**
- This is a an optional text field and can be configured per locale.
- It has a limit of maximum 100 characters.
- **Desired Cancellation Date | Radio Buttons**
- This is a configurable field.
- It has 2 options:
- `Earliest possible date`
- If this is selected, the DatePicker will not be visible.
- `Specific date`
- If this is selected, the DatePicker will be visible and required.
- By default option 1 will be selected.
- **Requested Cancellation Date | DatePicker**
- This is a required field, the user can either type manually or select from the picker.
- This will display dates in localised format.
- No past dates are allowed and in terms of future dates, upcoming 2 years is the limit.
- **Cancellation Reason**
- This is a an optional text field.
- It has a limit of maximum 5000 characters.
- **Legal Disclaimer**
- This is a configurable field.
- If this is present on the form, it will be a required field.

# Analytics
Not configured.

# WebFlow Communication

## Page Load
- On page load, it calls the height adjustment hook, which sends the relevant post message to WF:

```
useAutoIframeHeight({ elementRef: containerRef });
```
- If user visits the page using a valid `location_id`, it will send the `location_id` to WF through a post message:

```
postMessage({ locationId: afNumber })
```
- If user visits the page using an invalid `location_id`, it will send a post message to WF, so It can remove that id from the URL:

```
 postMessage({ deleteUrlParam: WEBFLOW_LOCATION_ID_PARAM_KEY });
```

## Form Submission
- When the form is successfully submitted, it will send following post message:

```
postMessage({
  redirect: {
    to: `thank-you?${WEBFLOW_LOCATION_ID_PARAM_KEY}=${location_number}`,
  },
  locationId: location_number,
});
```
- On submission failure, it will not send any post message.

# **API Endpoints**
This iFrame uses multiple API endpoints, some of them are handled by `LocationSelector`. The ones which it directly handles are as following:

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
- This API is used for displaying location's data on the form and also passing the location's data on form submission.
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
- **Communications API **
- This API is used for the submission of the form.
- **Endpoint URI**: `/api/communications/`
- **Endpoint Method**: `POST`
- **Example Payload**:

```
{
  "workflow": "cancel-membership", // Always same
  "subject": "Membership Cancellation Form",  // Always same
  "first_name": "Test",
  "last_name": "User",
  "email": "test@gmail.com",
  "phone_number": "+4915123456789",
  "message": "Test cancellation reason.", // Cancellation reason
  "marketing_opt_in": false,  // Always same
  "locale": "de-DE",
  "data": {
      "location_number": "DE-0004",
      "location_email": "memberclub0004@anytimefitness.de", // Comes from Location Details API

      "location_phone": "123456789", // Comes from Location Details API

      "is_termination_date_exact": true, // Will be true if date was selected/typed, else fals.

      "termination_date": "26.07.2026", // If user selects specific date radio button, then the localised date will be passed

      "termination_date": "Nächstmöglicher Zeitpunkt" // If user selects earliest possible date radio button, the same localised label will be passed

      "contract_number": "111133344"
  }
}
```
- **Response Status Code**: ` 200 OK`
- **Response**: `null`

# **User Interface**

## **English**

### **Desktop**
- **Normal**

- **Error**

- **Email **(Translated from German)

### **Mobile**
- **Normal**

- **Error**

## **Non-English (German)**

### **Desktop**
- **Normal**

- **Error**

- **Email **

### **Mobile**
- **Normal**

- **Error**
