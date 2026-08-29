# Phone Number Integration

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=f268081d-15cc-43d2-8c84-7476a73c4ef9
Updated: 2026-07-14T06:26:52.864Z

## Overview
- The team decided to replace the phone number component in the shared library with intl-tel-input. It has impacted our use case as Anytime Fitness flows have special customization on the phone number component.

## Links
- [intl-tel-input](https://intl-tel-input.com/)
- [Shared Library Storybook](https://storybook.purposebrands.com/?path=/docs/base-phone-number--docs)
- [Shared Library Component File](https://github.com/anytimefitness/pb-webflow-shared-library/tree/main/src/shared/components/PhoneNumber)

## Usages
- Lead Forms
- Try Us Free
- Membership Inquiry
- Contact Us
- Invite Friend (Member & Non-Member)
- Events 2.0
- MCO
- Local & Group Offers
- Apple Fitness Plus/Subscriber
- Invite Friend

## 
Lead Form

## 

- Corporate Membership and Email Club use the same phone number validation as the lead capture forms, but they submit to a different backend API. Only Own a Gym uses different validation rules.
- When onboarding a new locale, there is not much difference from before, just create a configuration in the locale e.g. **`locale-config/locales/en-au/utils.ts`**`. `The `**formatPhoneNum**` is called by the validator and again on submit. To define a locale phone number validation add the **phoneNum** property on** baseSchema.extend **then pass the customization on **createCountryPhoneValidation** object parameter. We also noticed a strange behavior in our underlying **libphonenumber-js** where it allows shorter number lengths, to prevent this just add the **nationalNumberLength** prop.

```
export const formatPhoneNum = (phoneNum: string) => {
  try {
    const formattedPhoneNum = (
      phoneNum.startsWith("0") ? `61${phoneNum.slice(1)}` : `${phoneNum}`
    ).replace(/[+\s]+/g, "");
    return parsePhoneNumberWithError(`+${formattedPhoneNum}`, "AU")?.number;
    // eslint-disable-next-line
  } catch (error) {
    return phoneNum;
  }
};

export const getSchema = ({
  path,
  isZipCodeRequired,
  ...data
}: GetSchemaParams): GetSchemasResponse => {
  const isEmailLocationPage = path === "/email-club";
  const isEmailLocationPageLegacy = path?.includes("/email-club");

  const baseSchema = getBaseLeadFormSchema({
    locale: data.locale,
    isZipCodeRequired: isZipCodeRequired ?? !isEmailLocationPageLegacy,
    isLocalResidentRequired: false,
    t: data.t,
  });

  const formFields = getFormFields({
    path,
    isZipCodeRequired,
    t: data.t,
  });

  return baseSchema.extend({
    phoneNum: createCountryPhoneValidation({
      countryCode: "AU",
      formatPhoneNum,
      // nationalNumberLength: 9,
      errorMessage:
        formFields.phoneNum.errorMsg?.invalid ||
        data.t?.("general.form.validation.invalid.phone"),
      requiredMessage: data.t?.("general.form.validation.requiredError"),
    }),
    // Other props
  });
};
```
- There are no more changes needed in **components/lead-form/lead-form.tsx** component, we will list what we added for the new phone number component. We now pass the **locale.id**; it is now dynamic, unlike before when we passed a hardcoded value, e.g. **"AU"**.  We set **displayPlaceholder** to **false** as Anytime Fitness doesn't require a placeholder, and set **autoMasks** to **true** to allow user input to be formatted upon input in the** LeadFormComponent phoneNumberProps prop**. We also added styles to the **parent div** of the **LeadFormComponent** to fix the alignment of the phone input component flag.

```
const translations = {
  mandatoryFieldsText: formSubHeading || t("general.form.subheading"),
  currentLocale: locale.id,
  errorMessageText: t("general.components.leadForm.errors.requiredFields"),
};

  // Other codes
  

- To follow the existing behavior of the invite-friend flow from the legacy phone number, we only support the international format and explicitly add a mask. We introduced **PHONE_INTL_FORMAT_OVERHEAD** and **PHONE_NUMBER_MASKS** in **locale-config/constants.ts**, and added the appropriate mask for the new locale in **PHONE_NUMBER_MASKS**.

```
export const PHONE_INTL_FORMAT_OVERHEAD = 2;

export const PHONE_NUMBER_MASKS = {
  US: "(...) ...-....",
  CA: "(...) ...-....",
  AU: ".... ... ...",
  GB: ".... ......",
  IE: ".. ... ....",
  AE: ".. ... ....",
  ZA: ".. ... ....",
  SA: ".. ... ....",
  KW: ".... ....",
  IN: "..... .....",
} as const;
```
- Add the new locale mask in the **phoneMasks useMemo**. The **customLabelStyles** is also updated in the **PhoneNumberNoSSR** component to properly align the input label.
- Since the referral API call is triggered on the last input, make sure you add the correct **locale.leadForm.phone.displayMaxLength**; everything else will now work smoothly. 

```
const phoneMasks = useMemo(
  () => ({
    us: PHONE_NUMBER_MASKS.US,
    ca: PHONE_NUMBER_MASKS.CA,
    au: PHONE_NUMBER_MASKS.AU,
    ie: PHONE_NUMBER_MASKS.IE,
    gb: PHONE_NUMBER_MASKS.GB,
  }),
  [locale.id],
);

const phoneMaxLimit = useMemo(() => {
  const displayMax = locale.leadForm.phone.displayMaxLength;

  if (displayMax) return displayMax;

  const country = getCountryCode();
  const mask = phoneMasks[country as keyof typeof phoneMasks] ?? "";
  const dial = locale.leadForm.phone.dialCode ?? "";

  return PHONE_INTL_FORMAT_OVERHEAD + dial.length + mask.length;
}, [
  phoneMasks,
  locale.leadForm.phone.dialCode,
  locale.leadForm.phone.displayMaxLength,
]);

```

## 
Testing
- **Lead Form**
- All flows except corporate membership and Own a Gym:  Verify if the phone number field accepts international, local, and national formats, and autofill must also work well. More importantly, the phone number in the request payload after submitting must be in E.164 format.
- Corporate Membership and Own a Gym have their own testing documentation, please refer to other documentation. These two flows are not fully affected by the upgrade because they only use the basic configuration.
- **Invite Friend**
- Verify if it accepts the correct number based on the current locale.
- When autofilling an incorrect number, then entering a number again, the proper locale prefix must be in place, not the previous one.
- It must not allow extra digits and must send the correct phone number in the request payload in E.164 format.

## Integration Testing
Integration tests for phone numbers are already set up on the lead form. Please follow the guide to add tests for new locales that are subject to onboarding.

1.  Update the `mockPhoneData` in the file `af-webapp-iframes/components/lead-form/lead-form.test.tsx`.

```
  export const mockPhoneData: PhoneData[] = [
    ...others,
    {
        id: "en-ph",
        inputs: {
            raw: "9171234567", // raw phone number
            intl: "+639171234567", // phone number in international format
            national: "09171234567", // phone number in national format
        },
        expectedMaskedValues: {
            raw: "9171234567", // raw phone number
            intl: "+63 917 123 4567", // phone number in international format (masked)
            national: "0917 123 4567", // phone number in national format (masked)
        },
        e164: "+639171234567", // phone number in E.164 format
        zip: "1000", // sample postal/zip code used together with the phone number test.
    },
  ];
```

## 

## Flow that don't call the lead capture API
- Email Club
- Corporate Membership
- Own a gym

## Known Issue
- QA noticed issues on Safari, both mobile and desktop, with autofill in contacts and autofill in general. Latest investigation shows it is a limitation of the browser itself.
- Related ticket: [AFW-3008](https://otbeat.atlassian.net/browse/AFW-3008)

## QA Test Numbers
- [Test Numbers](https://docs.google.com/spreadsheets/d/1oAwlZzcxypQHWgYukxgAJV-ks0MgMlCWoySbE_LRtL0/edit?gid=0#gid=0)

## Others
- Other locales are confusing, like when the local format is the same as the country code, e.g. tel:919145374528, so make sure to verify that the test numbers in local format are valid.
