import TranslationKeys from '@utils/locale-utils/translations-keys.constants';

interface LocaleElementConfig {
  consentCheckbox: boolean;
  membershipInquiryButtonKey: string;
  localResidentCheckbox: boolean;
  zipCodeField: boolean;
  sendConfirmationEmails: boolean;
}

export const localeElements: Record<string, LocaleElementConfig> = {
  'en-au': {
    consentCheckbox: true,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.MembershipInquirySubmit,
    localResidentCheckbox: false,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'en-us': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'en-ae': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: false,
    sendConfirmationEmails: false,
  },
  'en-gb': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'en-in': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    // React Components sheet: India Postal Code = "Yes, PIN Code"
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'ar-sa': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: false,
    sendConfirmationEmails: true,
  },
  'en-za': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'en-ie': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    // React Components sheet: Ireland Postal Code = No (no eircode on MI lead form)
    zipCodeField: false,
    sendConfirmationEmails: true,
  },
  'en-ca': {
    consentCheckbox: false,
    // AFW-3993: EN-CA MI CTA is GET STARTED (matches legal “By clicking Get Started”)
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.GetStarted,
    localResidentCheckbox: false,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'fr-ca': {
    consentCheckbox: false,
    // AFW-3993 Canada (FR): MI CTA is COMMENCER (Get Started) — align with EN-CA
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.GetStarted,
    localResidentCheckbox: false,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'de-de': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  'de-at': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // IT: displayConsentCheckboxesDisclaimer (termsAccepted + optional marketingOptIn); zip required (5 digits)
  'it-it': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // TH: Local Offer / TUF residency + marketing; zip from Local Config; Corporate Membership YES
  'th-th': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // PH: AFW-3705 dual disclaimer (CB1 pre-checked required + CB2 optional); zip from Local Config; Corporate YES
  'en-ph': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // SG: AFW-3628 PDPA dual disclaimer (CB1 pre-checked required + CB2 optional); postal from Local Config; Corporate YES
  'en-sg': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // NZ: AFW-3657 — US-style legal without California disclaimer; postcode from Local Config
  'en-nz': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // ID: AFW-3661 — postal from Local Config; legal disclaimer AFW-3718 (separate)
  'en-id': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
  // ZH-HK: AFW-3663 — no postal codes. AFW-3731 dual disclaimer (terms + marketing) —
  // no US-style Local Resident checkbox / why-this-matters modal on SIT.
  'zh-hk': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: false,
    zipCodeField: false,
    sendConfirmationEmails: true,
  },
  // MY: AFW-3659 — postal from Local Config; AFW-3629 dual disclaimer (CB1 pre-checked + CB2 optional)
  'en-my': {
    consentCheckbox: false,
    membershipInquiryButtonKey: TranslationKeys.Buttons.UserForm.Submit,
    localResidentCheckbox: true,
    zipCodeField: true,
    sendConfirmationEmails: true,
  },
};
