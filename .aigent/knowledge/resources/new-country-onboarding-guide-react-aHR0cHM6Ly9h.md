# New Country Onboarding Guide [React]

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=4d8b40d2-4ae3-4dd4-a500-8406269f0bd0
Updated: 2026-07-31T12:12:49.213Z

## Overview
This guide provides step-by-step instructions for fully onboarding a new country locale in the Anytime Fitness web application, ensuring feature parity with existing locales like `en-au` and `en-us`.

## Prerequisites
- [Locale Inventory](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=1799873444#gid=1799873444) should have the relevant details for that specific locale.
- Ideally we have a Test Gym present for the locale in the the relevant [document](https://docs.google.com/spreadsheets/d/1XbuWQqf5vnOhIznBNX4d8nn8XCDsmsMg/edit?gid=1928747136#gid=1928747136), If not reach out to the team.
- Ideally all the major API endpoints have been tested for the locale and logged into the [document](https://docs.google.com/spreadsheets/d/1mEV5w33m1zE09d6WwGVWE-YkjjGg3Du01tDaM_VF-ZM/edit?gid=0#gid=0).
- Ideally WebFlow Team has already setup the pages, since its better to test the complete flow instead of just iFrame.
- Locale is setup in crowdin - React dev will setup that in `AF Webapp Iframes`  project
- Country code (ISO 3166-1 alpha-2, e.g., "AE" for UAE)
- Locale identifier (e.g., "en-ae" for English-UAE)
- Phone dial code (e.g., "+971" for UAE)
- Map center coordinates (latitude/longitude)
- Before starting implementation you should create a Tech Spec and get it reviewed by the team, [example](https://purposebrands.atlassian.net/browse/AFW-2859?focusedCommentId=481585).

## 📋 Implementation

### 1. Locale Value/Type Definition
**File:** `locale-config/constants.ts`Add new locale to the `VALID_LOCALES` list:

```
export const ARABIC_LOCALES = ["ar-sa"] as const; 

// This is the main source of locale values/types 
export const VALID_LOCALES = [  "en-us",  "en-ie", ...ARABIC_LOCALES,] as const;
```

### 2. Locale Fonts
**File:** `locale-config/fonts/index.ts`Assign specific Locale Fonts in the `LOCALE_OVERRIDES `record if necessary:

```
// Override Example => { "ar-sa": ARABIC_FONT_DEFINITIONS }
// The base font family is FMoon, please only add overrides here.

const LOCALE_OVERRIDES: Record = {
  ...Object.fromEntries(
    ARABIC_LOCALES.map(locale => [locale, ARABIC_FONT_DEFINITIONS]),
  ),
};
```
In case new Font Family is being introduced for the locale, please refer to 

[Font Onboarding Document](https://app.getguru.com/card/Tk5E5X8c/LocaleBased-Font-Onboarding-Guide-Next-JS-Anytime-Fitness).

### 3. Setup
You will see a folder structure (SS attached below) inside `locale-config`, where each locale will have its own folder named like `en-ae`. Each locale folder will have 2 files `index.ts` (handles configuration) and `utils.ts` (handles all the locale related utils).

### A. Gym Finder
The relevant file for adding gym finder data would be `locale-config/locales/[new-locale]/index.ts` .

```
const LOCATION_FINDER_DATA: LocationFinderLocaleData = {
  countryName: "[COUNTRY_NAME]", 
  countryCodeAlpha3: "[3_LETTER_CODE]", 
  countryCodeAlpha2: "[2_LETTER_CODE]", 
  associatedCountryCodes: [],

 // Add a value to this to exclude locations from a specific state or province. For example, for `en-ca`, use `CA-QC` to filter out Quebec locations.
  excludedStateAbbrs?: [],

  localLocationLink: "", 
  defaultLocation: { 
    name: [LOCATION_NAME], 
    latitude: [LATITUDE], 
    longitude: [LONGITUDE], 
  }, 
  cardCTA: { 
    ctaText: "general.cta.getAFreeTrial", 
    ctaLink: "/try-us-free?location_id={location_id}", 
  }, mapConfig: { 
    defaultCenterCoordinates: { 
      latitude: [LATITUDE], 
      longitude: [LONGITUDE], }, 
      defaultZoom: [ZOOM_LEVEL], 
      userCoordinatesZoom: [ZOOM_LEVEL], 
      mobileZoom: [ZOOM_LEVEL], 
      searchZoom: [ZOOM_LEVEL], 
  },
};
```
You can refer to the type `LocationFinderLocaleData` to see the possible properties which could be used.

### B. Locale Configuration
The relevant file for adding locale configuration would be `locale-config/locales/[new-locale]/index.ts` . We will be using a dummy config as an example here:

```
const CONFIGURATION: LocaleConfigSetup = {
  country: { name: "United Kingdom", code: "GB" },
  cmsLocaleId: "698b2b79751e9500e1b03baf",
  joinOnlinePortalSource: "socialLinks",
  franchiseLeadsPhoneNumber: "+447700900123", // Unique
  leadForm: {
    phone: {
      dialCode: "44",
      maxLength: 11,
      displayMaxLength: 15,
    },
    zipCodePlaceholder: "SW1A 1AA",
    getFormFields, // Base
    getSchema, // Base
    getCorporateMembershipFormFields, // Unique
    getCorporateMembershipSchema, // Unique
    getFranchiseLeadsFormFields, // Unique
    getFranchiseLeadsSchema, // Unique
    formatPhoneNum, // Base
  },
  UIPhoneNumConfig: {
    template: "$1 $2",
    formatByLength: {
      11: /(\d{5})(\d{6})/,
      10: /(\d{5})(\d{5})/,
    },
  },
  formatUTCDate: date => format(date, "dd/MM/yyyy HH:mm"),
  locationFinder: LOCATION_FINDER_DATA,
  locationSelector: {

    // This is used for overriding the default zoom of Location Selector with the one from Location Finder Map Config, this will be true by default in base-config
    shouldOverrideDefaultZoom: true,

  // This is used for setting the search radius/zoom, this will be 50 by default in base-config
    searchRadius: 50,

// This will be used for home page specific configuration and following will be default values in base-config
    home: {
      hideJoinNow: false,
      trackSearchEvent: false,
    },
  },
};
```
You can see utility functions like `getFormFields`, `getCorporateMembershipFormFields`, etc. The base ones will be present in all locales but unique ones won't. You can easily back track the implementation of these functions in your code editor to get a better idea of the structure, also you can refer to the type `LocaleConfigSetup` to see the possible properties which could be used.

### C. Usage of Configuration.
First you have to export the locale setup from its index file `locale-config/locales/[new-locale]/index.ts` .

```
export default { LOCATION_FINDER_DATA, CONFIGURATION };
```
 Then re-export it from the main index file `locale-config/locales/index.ts` .

```
import EN_US from "./en-us";
import EN_AU from "./en-au";
// Import new locale configuration here

export default {
  EN_US,
  EN_AU,

 // Export new locale configuration here 
};
```
 Then use it in main locale config index file `locale-config/index.ts` .

```
export const localeConfigRecord = applyLocaleDefaults({
  "en-us": LOCALE.EN_US.CONFIGURATION,
  "en-au": LOCALE.EN_AU.CONFIGURATION,

   // Add new locale configuration here
});
```
 Then use it in location finder file `locale-config/location-finder.ts` .

```
export const LOCATION_FINDER_LOCALE_DATA: Partial
> = {
  "en-us": LOCALE.EN_US.LOCATION_FINDER_DATA,
  "en-au": LOCALE.EN_AU.LOCATION_FINDER_DATA,

   // Add new locale configuration here
};
```

### 4. WFJS
- Make the following changes in `head.js` as per need based on the locale's `locations/location_id` format:
- Add the locale in the `locationIdPrefixToLocalesMap` if the locale has a mixed pattern for `location_id`:

```
const locationIdPrefixToLocalesMap = {
  AU: ["en-au"],
  UK: ["en-gb", "en-ie"], // This means 'en-gb' and 'en-ie' will be using same location id prefix e.g. UK-1234
  
  // Add new locale here
};
```
- Add the locale in the `localesWithNumericLocationId` if the locale has a numeric pattern for `location_id`:

```
 const localesWithNumericLocationId = [
  "en-us", 
  // Add new locale here
];
```
- Add the locale in the `localesWithNoLocations` if the locale currently doesn't have any locations, its to help QAs test forms till we get locations. It bypasses `location_id` pattern check for that locale and will only work if we use the search param `by_pass_location_id_check=true` in the URL.

```
  const localesWithNoLocations = [ // Add new locale here ];
```

- If the language of the locale is new, make sure to add style id in `mapBoxStyleIds` which resides in the file `location/index.js`. This will require Mapbox Studio access, please reach out to Team Lead.

```
const mapBoxStyleIds = {
  ar: "{id}",
  de: "{id}"

  // Add new language here   
};
```

- Make sure to add the new locale in `LOCATIONS_WIDGET_LOCALES` which resides in the `head.js`. Most of locales won't need it refer to the [requirements](https://app.getguru.com/card/inrErgET/New-Country-Onboarding-Guide-React#fNHGjnj26s59).

### 5. Unique Pages
Make sure all unique pages for a specific locale are working based on [AF Locale Inventory](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=1799873444#gid=1799873444) and also sending correct payload (culture code, locale, iso code, etc) to API endpoints where needed. Some of the pages which may confuse you are as following:

- Own a Gym Page
- If the locale uses `Franconnect` as its `Franchise Management Software (FMS)`, this page will use an external iFrame from the relevant FMS.
- If the locale uses `Microsoft Dynamics` as its `Franchise Management Software (FMS)`, this page will use the `franchise-leads` iFrame from React. In this case make sure we already have correct `franchise leads schema` for the locale, some of the fields which may change would be `Desired Markets` , `Contact Number` and `Investment Options`.
- Corporate Membership Page
- This page will be using the `corporate-membership` iFrame from React, make sure we already have correct `corporate schema` for the locale, some of the fields which may change would be `Company Size` and `Purple Perks`.
- Cancel Membership Page.
- If the relevant column in [AF Locale Inventory](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=1799873444#gid=1799873444) mentions react for the new locale then it will be using the react iframe `membership-cancellation`. Fields like `date type`, `contract number` and `legal disclaimer` are configurable, which means some locales may hide them.

### 6. Environment variables
- Make sure the new locale has been added to the variable `NEXT_PUBLIC_ALLOWED_COUNTRIES` and it has been updated in Azure Library (Reach out to DevOps Engineer). In Azure we have it as `NEXT_ALLOWED_COUNTRIES`. We use it in the iFrame `/find-your-location-searchbar`.
- Make sure the new locale has been added to the variable `NEXT_PUBLIC_RECAPTCHA_BYPASS_IDS` and it has been updated in Azure Library (Reach out to DevOps Engineer). In Azure we have it as `NEXT_RECAPTCHA_BYPASS_IDS`. Its for helping QAs test the forms and will only work if we use the search param `disable_captcha=true` in the URL.
- Make sure the new locale has been added to the variable `NEXT_PUBLIC_MCO_BYPASS_IDS` and it has been updated in Azure Library (Reach out to DevOps Engineer). For further configuration please refer to the relevant [section](https://app.getguru.com/card/inrErgET/New-Country-Onboarding-Guide-React#FKHyYdQiKa87).

### 7. Custom Terms & Conditions (if needed)
Update `general.consent.textRich` value in crowdin for new locale. Update `TermsAndConditions`  component on react side in case of introducing any new type of link.

### 8. ZIP CODE
Ensure that the correct format is used for each specific locale. For locales where ZIP code contains alphabetic characters, validation should be case-insensitive to avoid issues such as [AFW-3518](https://purposebrands.atlassian.net/browse/AFW-3518).

### 9. Invite friend
If the locale requires invite a friend flow, then we would need a translated card for that:

- Store a translated Invite a Friend card in `public/assets/`.
- Follow the following naming convention: 
- TUF LOCALE => `/assets/refer-friend-card-${localeId}.webp`
- NON-TUF LOCALE=> `/assets/refer-friend-card-non-tuf-${localeId}.webp`
- Example: For Canada (fr-ca) `/assets/refer-friend-card-fr-ca.webp` 

- Make sure to use the `.webp` extension, and for the translation, you can simply ask an LLM to translate the text in the image.

### 10. Documentation
Make sure to update the following documents based on the requirements of the new locale:

- [Webflow Pages X Next.js iframes](https://app.getguru.com/card/TyEeEK6c/Webflow-Pages-X-Nextjs-iframes) 
- [React Components Sheet](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=461153220#gid=461153220)

### 11. PHONE NUMBER
There's separate documentation regarding phone numbers, and it can be found here: [Phone Number Integration](https://app.getguru.com/card/cLo6Lqgi/Phone-Number-Integration)

### 12. When a locale is Launched Officially (This is just for context)
DevOps Engineer will be adding Site Map for the specific locale when it will be officially launched.

## 🧪 Testing Checklist
Go through all the main pages at least once.

### Form Functionality
- Phone number validation works correctly
- Phone number formatting displays properly
- Postal code field shows/hides based on configuration
- Terms & Conditions links point to correct URLs
- Form submission works without errors

### Gym Finder
- Map centers on correct country coordinates
- Location search works for country addresses
- Filters display correctly (if configured)
- CTA buttons link to appropriate pages

### Error Handling
- Invalid phone numbers show correct error message
- Form validation messages display in correct language
- API errors are handled gracefully

## 📝 Configuration Examples

### Countries with Postal Codes

```
isZipCodeRequired: true,
  zipCode: {  
  label: "Postal Code",  
  errorMsg: {    
    required: "Postal Code is required",    
    invalid: "Postal Code is invalid",  
  },
},
```

### Countries without Postal Codes

```
isZipCodeRequired: false,
// No zipCode field configuration needed
```

### Phone Number Patterns

```
// US/Canada: +1 (XXX) XXX-XXXX
dialCode: "1", maxLength: 11
// UK: +44 XXXX XXX XXX
dialCode: "44", 
maxLength: 11
// Australia: +61 XXX XXX XXX
dialCode: "61", 
maxLength: 11
// UAE: +971 XX XXX XXXX
dialCode: "971", 
maxLength: 12
```

## Google Translate
`LOCATIONS_WIDGET_LOCALES` in the `head.js` — add the new locale there only if it should not get the `.home-gymfinder` “remove `hidden` when `translated-ltr`” behavior More details here: ﻿

[Getguruapp.getguru.com/card/i49ExxoT/Google-Translate-Feature](https://app.getguru.com/card/i49ExxoT/Google-Translate-Feature)﻿

## 🚨 Common Gotchas
- Ensure `libphonenumber-js` supports the country code
- Some countries don't use standardized postal codes
- Enable/disable features thoughtfully for each market
- Country-specific legal pages must exist
- Use country center coordinates, not capital city

## Support `test_location_id` param
In order to make test gym always available when making any search in location selector, follow these steps:

- **Mock** - Add `mockTestLocationXX` in `mocks/test-location-mocks.ts` (real test club payload).
- **Map locale** - Add `case "xx-yy": return mockTestLocationXX` in `getMockTestLocationForLocale`.
- **Allowlist** - Add `location_number` to `NEXT_PUBLIC_MCO_BYPASS_IDS` in `.env` / pipeline; restart dev server.

## 📚 Reference Files
- Example Implementation: `en-ae` locale
- Base Locale Configuration: `locale-config/base-config.ts`
- Individual Locale Configuration: `locale-config/locales/index.ts`
- Main Configuration: `locale-config/index.ts`
- Location Finder Data: `locale-config/location-finder.ts`
- Utility Functions: `locale-config/utils/index.ts`
- Type Definitions: `locale-config/types.ts`
- Constants: `locale-config/constants.ts`
- Fonts: `locale-config/fonts/index.ts`
- Translations: `locale-config/translations.json`
- Form Components: `components/lead-form.tsx`
*This guide ensures consistent, complete country onboarding with all necessary features and validations.*
