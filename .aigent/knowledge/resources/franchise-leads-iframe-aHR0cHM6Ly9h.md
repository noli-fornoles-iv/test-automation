# Franchise Leads | iFrame

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=3a806dda-8649-4f84-9521-54d74c8962a9
Updated: 2026-08-13T12:27:45.659Z

# Overview
- **iFrame **
- **Name: **Franchise Leads
- **URL**: [https://{env}-react.anytimefitness.com/{locale}/franchise-leads/](https://sit-react.anytimefitness.com/en-ae/franchise-leads/)
- **Page **
- **Name**: Own a Gym
- **URL**: [https://{env}.anytimefitness.com/{locale}/own-a-gym](https://sit.anytimefitness.com/en-ae/own-a-gym)
- **Purpose**: This iFrame is used for capturing franchise leads, it takes details from the user through a form. It is only used in locales which use `Microsoft Dynamics` as their `Franchise Management Software (FMS`).

# Functionality
The iFrame contains a form and country contact section:

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
- It has a bit complex validation, will be discussed [separately.](https://app.getguru.com/card/c8Ee6j7i/Franchise-Leads-Own-a-Gym#DgGHcjryjoRc)
- **How much are you looking to invest?**
- This is a required selection field.
- This will have different options for each locale.
- **How did you hear about us?**
- This is a required selection field.
- **Desired Market**
- This is a required selection field.
- This will have different options for each locale.
- This field will be hidden for some locales.
- **Questions / Comments**
- This is an optional text-area field.
- **Contact Section**
- This section will be at the bottom of iFrame, just before the submit button. This will contain a contact number specific to that locale, if a locale doesn't have a number, we will use the generic one [+1-800-704-5004.](tel:+1-800-704-5004)
- This field will be hidden for some locales.

# Exclusions by Locale

| Field/Section | Locales |
| --- | --- |
| Desired Market | KW |
| Contact | IT |

# Analytics
It will send analytics to data layer on successful form submission only:

```
const data: FormAnalyticsData = {
  event: "franchise_lead_captured",
  context: {
    values: {
      form_type: "franchise",
      form_offer: "franchise_crm",
      emailsha256: hashAndNormalizeEmail(payload.email),
      investment_range: payload.amount_range,
      desired_market: payload.interested_in_areas,
      discovery_method: payload.how_did_you_hear_about_us,
      channel: "web",
    },
  },
};

postMessage(data);
```

# WebFlow Communication

## Page Load
On page load, it calls the height adjustment hook, which sends the relevant post message to WF:

```
useAutoIframeHeight({ 
  elementRef: containerRef, 
  useOffsetHeight: true 
});
```

## Form Submission
- When the form is successfully submitted, it will send following post message:

```
postMessage({
  redirect: { to: "/thank-you", newWindow: false },
});
```
- On submission failure, it will not send any post message.

# Phone Number Validation
This is the most flexible phone number validation in the whole AF Site, since we are not using any phone number library for it. So, we can say it accepts global (national + international) phone numbers.

- **Rules**
- Minimum Characters => 7 (In this case there should be 1 plus sign and 6 digits)
- Maximum Characters =>  Max 15 digits + other acceptable characters (plus sign, space, hyphen and brackets)
- Minimum Digits => 6
- Maximum Digits => 15
- Plus sign is optional and can only be at the start.
- User can add brackets only when they are in complete pairs, inside brackets only numbers are allowed.
- User can add a hyphen/space in between 2 numbers or between a number and a bracket.
- **QA**
- QA team has their own [sheet](https://docs.google.com/spreadsheets/d/1oAwlZzcxypQHWgYukxgAJV-ks0MgMlCWoySbE_LRtL0/edit?gid=641306876#gid=641306876) for validating phone number.
- **Examples**
- **Valid**
- `+123456`
- `1234567 `
- `+123456789012345`
- `+61436399721`
- `61436399721`
- `0436399721`
- `+1212551234`
- `212551234`
- `+1 (212) 555-1234`
- `+1-(212)-555-1234`
- `(212) 555-1234`
- `212 555 1234`
- `+1-800-704-5004`
- **Invalid**
- `+12345` (too short)
- `12345` (too short)
- `1234567890123456` (too long)
- `++1234567` (invalid format)
- `+12345abc` (invalid characters)
- `+1 ((212)) 555-1234 `(invalid format)
- `+1 (212 555-1234 `(invalid format)
- `+1 212 555)-1234 `(invalid format)
- `+1 ( 212 ) 555-1234 `(invalid format)
- `+1 (-212-) 555-1234 `(invalid format)
- `+1 (212) 555 -1234 `(invalid format)

# **API Endpoints**
This iFrame uses only one endpoint for submission, make sure it always sends correct locale specific data.

- **Endpoint URI**: `/api/investors/inquiries/`
- **Endpoint Method**: `POST`
- **Example Payload**:

```
{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@gmail.com",
    "phone": "+611300169468",
    "amount_range": "$50,000 - $99,999",
    "how_did_you_hear_about_us": "LinkedIn",
    "interested_in_areas": "Abu Dhabi",
    "comments": "Test comment",
    "country_2_letter_iso_code": "ae",
    "culture_code": "en-AE"
}
```
- **Response Status Code**: ` 200 OK`
- **Response**: `null`

# **User Interface**

## **Left to Right**

### **Desktop**
- **Normal**

- **Error**

### **Mobile**
- **Normal**

- **Error**

## **Right to Left**

### **Desktop**
- **Normal**

- **Error**

### **Mobile**
- **Normal**

- **Error**
