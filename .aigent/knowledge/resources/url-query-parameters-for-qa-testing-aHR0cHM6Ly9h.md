# URL Query Parameters for QA Testing

Tab: Resources
Source: https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=c25afdf8-16df-40e9-8235-b9774bbb9840
Updated: 2026-07-22T12:35:35.545Z

The following URL query parameters are available to assist with testing different application behaviors across environments. These parameters are primarily intended for QA, development, and validation purposes.

## `use_prod_api=true`

### Description
Use this query parameter when testing **International (INTL) locale flows** in lower environments (e.g., SIT, UAT). It redirects API requests to the **Production API endpoints**, allowing testers to validate application behavior using production data while remaining in a non-production environment.

### Usage
Append the parameter to the end of the URL. Can be used across all forms.

**Example:**

```
https://sit.anytimefitness.com/en-au/membership-inquiry?location_id=AU-1538&use_prod_api=true
```

## `disable_captcha=true`

### Description
Disables CAPTCHA verification on user-facing forms. This is useful for automated testing and manual QA scenarios where CAPTCHA validation would otherwise interrupt the testing workflow.

### Usage
Append the parameter to the end of the URL. Can be used across all forms.

**Example:**

```
https://sit.anytimefitness.com/en-au/membership-inquiry?location_id=AU-1538&disable_captcha=true
```

## `test_location_id=<LOCATION_ID>`

### Description
Forces a predefined test gym to appear in search results for the corresponding locale. This is useful when validating location search, membership inquiries, and other location-dependent user journeys.

### Usage
Append the parameter with the appropriate test location ID. Can be used across all forms that have a search step.

**Example:**

```
?test_location_id=9993999
```
Refer to the attached sheet for the list of available[ international test location IDs](https://docs.google.com/spreadsheets/d/1XbuWQqf5vnOhIznBNX4d8nn8XCDsmsMg/edit?gid=1928747136#gid=1928747136)

## `bypass_promotions_api=true`

### Description
Bypasses Promotions API validation, allowing testers to validate offer-related user flows without requiring a valid Promotions API response.  This means the gym (location_id) included in the URL doesn't have to be signed up for an offer on the AF dashboard - reducing our reliance on Anytime Fitness team to config each test gym for every offer.

This parameter is particularly useful when testing:

- Local offers

### Usage
Append the parameter to the end of the URL. Only useful for the local offers form.

**Example:**

```
https://www.anytimefitness.com/offer/local/join-get-100-membership-credit?location_id=9993999&bypass_promotions_api=true
```

## **BY_PASS_LOCATION_ID_CHECK=TRUE**

### **DESCRIPTION**
Use this query parameter to bypass the `location_id` pattern validation for a specific locale. This allows forms to be tested with location IDs that do not match the expected locale-specific format.

This parameter was introduced to support testing of the Kuwait Forms UI, where non-standard `location_id` values may be required.

### **USAGE**
Append the parameter to the end of the URL. Use only when testing locales that require bypassing `location_id` validation.

### **Example**:

```
https://sit.anytimefitness.com/ar-kw/membership-inquiry?location_id=9993999&by_pass_location_id_check=true
```

## Notes
- Multiple query parameters can be combined in a single URL by separating them with the `&` character.
- These parameters are intended for testing purposes only and should not be used in production environments unless explicitly required.
- Ensure the parameters are appended correctly to existing URLs. If the URL already contains query parameters (`?`), append additional parameters using `&`.
