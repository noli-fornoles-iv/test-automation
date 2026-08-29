# Corporate Membership | iFrame

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=9efe86ce-49c9-40b1-9bb0-25a231a274d7
Updated: 2026-08-13T14:12:09.074Z

# Overview
- **iFrame **
- **Name: **Corporate Membership
- **URL**: [https://{env}-react.anytimefitness.com/{locale}/corporate-membership](https://sit-react.anytimefitness.com/en-au/corporate-membership)
- **Page **
- **Name**: Own a Gym
- **URL**: [https://{env}.anytimefitness.com/{locale}/corporate-membership](https://sit.anytimefitness.com/en-au/corporate-membership)
- **Purpose**: This iFrame is used for capturing corporate memberships, it takes details from the user through a form and also has some check boxes. Only specific locales support corporate membership e.g. `en-au`, `en-gb`, etc.

# Functionality
The iFrame contains a form and checkboxes:

- **Form Fields**
- **First Name**
- This is a required text field.
- It terms of validation, it should only accept alphabets.
- **Last Name**
- This is a required text field.
- It terms of validation, it should only accept alphabets.
- **Email**
- This is a required text field.
- It terms of validation, it should only accept standard email format.
- **Phone Number**
- This is a required text field.
- It terms of validation, it should only accept the locale format (`0436399721`) and international format (`+61 1300 169 468`) for the specific locale (`en-au`).
- **Company**
- This is a required text field.
- It terms of validation, it should accept all characters.
- **Title**
- This is a required text field.
- It terms of validation, it should accept all characters.
- **Department**
- This is a required text field.
- It terms of validation, it should accept all characters.
- **Company Address**
- This is a required text field.
- It terms of validation, it should accept all characters.
- **Which Membership best matches the size of your company?**
- This is an optional selection field.
- This may have different values based on locale specific needs.
- This can be removed if the locale doesn't require it, `en-in` can be an example here.
- **Interested in offering members exclusive deals via Purple Perks?**
- This is an optional selection field.
- This can be removed if the locale doesn't require it, `en-in` can be an example here.
- **Checkboxes**
- **Authorisation to Act on Behalf of Organisation**
- This is a required checkbox.
- This can be removed if the locale doesn't require it.

- **Acknowledgment of Membership Payment Policy**
- This is a required checkbox.
- This can be removed if the locale doesn't require it.

- **Acceptance of Corporate Membership Terms and Conditions**
- This is a required checkbox.
- This can be removed if the locale doesn't require it

- **Consent to Receive Marketing Communications**
- This is an optional checkbox.
- This can be removed if the locale doesn't require it.

# Exclusions by Locale

| Field/Section | Locales |
| --- | --- |
| Which Membership best matches the size of your company? | ID, IN, MY, PH, SG, TH, VN, HK, TW, CA (FR & EN) |
| Interested in offering members exclusive deals via Purple Perks? | ID, IN, MY, PH, TH, VN, HK, TW, CA (FR & EN) |

# Analytics
It will send analytics to data layer on successful form submission only:

```
postMessage({
  event: "corporate_membership_lead",
  context: {
    values: {
      form_name: "corporate_membership",
      form_category: "lead",
      lead_type: "Global",
    },
  },
});
```

# WebFlow Communication

## Page Load
On page load, it calls the height adjustment hook, which sends the relevant post message to WF:

```
useAutoIframeHeight({
  elementRef: containerRef,
  useOffsetHeight: true,
});
```

## Form Submission
- When the form is successfully submitted, it will send following post message:

```
postMessage({
  redirect: {
    to: "/corporate-membership/thank-you",
    newWindow: false,
  },
});
```
- On submission failure, it will not send any post message.

# **API Endpoints**
This iFrame uses only one endpoint for submission, make sure it always sends correct locale specific data. If a certain field is not needed for a locale then it should also be excluded from the payload.

- **Endpoint URI**: `/api/communications/`
- **Endpoint Method**: `POST`
- **Example Payload**:

```
{
  "workflow": "corporate-membership-inquiry",
  "first_name": "Test",
  "last_name": "User",
  "email": "test@gmail.com",
  "phone_number": "+611300169468",
  "subject": "Corporate Membership Inquiry",
  "message": "We are interested in a corporate partnership for our employees.",
  "locale": "en-AU",
  "marketing_opt_in": true,
  "data": {
      "company": "Test",
      "title": "Test",
      "department": "Test",
      "company_address": "Test",
      "join_members_benefit_program": true
  }
}
```
- **Response Status Code**: ` 200 OK`
- **Response**: `null`

# **User Interface**

## Desktop

### Normal

### Error

## Mobile

### Normal

### Error
