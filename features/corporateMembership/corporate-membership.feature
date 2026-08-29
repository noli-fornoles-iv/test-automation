@CorporateMembership
Feature: Corporate Membership
  The Corporate Membership feature allows organisations to support their employees health
  and fitness by submitting an enquiry for discounted gym memberships at Anytime Fitness
  locations. The feature validates all user inputs, handles client-side and server-side
  errors, ensures required agreements are acknowledged, and confirms successful submissions
  by redirecting users to a thank you page.

  # Source of truth: Corporate Membership Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: CorporateMembership YES for AU, GB, IE, IN (scenario tags follow Supported Locales)
  # Checklist: .cursor/knowledge-base/scenario-checklist-corporate-membership.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-I00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="CorporateMembership"; $env:TAG="AU"; $env:LOCALE="EN-AU"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="CorporateMembershipConsolidatedPass" or --grep @CorporateMembershipConsolidatedPass
  #
  # Tickets:
  # - AFW-3660 ([React] Thailand Spin Up / Corporate — Testpad 27496): @AFW-3660 on TH consolidated + @Afw3660ConsolidatedPass
  # - AFW-3722 Testpad 27503 is MI/TUF dual Checkbox 1/2; Corporate TH uses 3 required + 1 optional marketing.
  #   Tagged @AFW-3722 / @Afw3722ConsolidatedPass for adapted legal/checkbox validation on this form.

  Background: Navigate to page
    Given The user is on "Corporate Membership" page

 @TC-I001 @REGULAR @AU @IN @TH @PH @SG @ID @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays error message for non-alphabetic characters in first name and last name fields in Corporate Membership
    When The user enters "123$" in the first name field in the Corporate Membership
    And The user enters "Test456" in the last name field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Corporate Membership

 @TC-I002 @REGULAR @AU @IN @TH @PH @SG @ID @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays Field is required error message for empty fields submission in Corporate Membership
    When The user submits the Corporate Membership form with empty fields
    Then The required field error is shown for all input fields in the Corporate Membership user form

 @TC-I003 @REGULAR @AU @IN @TH @PH @SG @ID @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays error message when the email format is invalid in Corporate Membership
    When The user enters "john.doe@example" in the email field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The email validation error is displayed in the Corporate Membership

 @TC-I004 @REGULAR @AU @IN @TH @PH @SG @ID @PhoneNumber @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays error message when the phone number format is invalid in Corporate Membership
    When The user enters invalid number in the phone number field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The phone number validation error is displayed in the Corporate Membership

 @TC-I005 @REGULAR @AU @IN @TH @PH @SG @ID @PhoneNumber @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Verifies the phone number field is accepted when filled via autofill in Corporate Membership
    When The user autofills the phone number field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The phone number field is accepted in the Corporate Membership

 @TC-I006 @REGULAR @AU @IN @TH @PH @SG @ID @PhoneNumber @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Verifies the phone number field is accepted when filled via copy and paste in Corporate Membership
    When The user copies and pastes a valid number into the phone number field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The phone number field is accepted in the Corporate Membership

 @TC-I007 @REGULAR @AU @IN @TH @PH @SG @ID @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays error message for first name and last name fields when the character limit is exceeded in Corporate Membership
    When The user enters more than 30 characters in the "first name" field in the Corporate Membership
    And The user enters more than 30 characters in the "last name" field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The maximum length validation error is displayed for the first and last name fields in the Corporate Membership

 @TC-I008 @REGULAR @AU @IN @TH @PH @SG @ID @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays error message when user submits form with empty fields in Corporate Membership
    When The user submits the Corporate Membership form with empty fields
    Then The required field error is shown for all input fields in the Corporate Membership user form

 @TC-I009 @REGULAR @AU @IN @TH @PH @SG @ID @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Displays server side error message when the form submission API is blocked in Corporate Membership
    Given The "corporate membership form" API is blocked
    When The user fills the form with valid data in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The server side error message is displayed in the Corporate Membership user form

 @TC-I010 @REGULAR @AU @IN @TH @PH @SG @ID @TEST_SUCCESS @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Successful form submission in Corporate Membership
    When The user submits the form in the Corporate Membership
    Then The thank you page is displayed on successful submission of the Corporate Membership form

 @TC-I011 @REGULAR @AFW-3722 @AFW-3705 @AFW-3628 @AU @IN @TH @PH @SG @AFW-3663 @AFW-3731 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify clicking Terms and Condition link in user form opens a new tab in Corporate Membership
    When The user clicks the "Terms & Condition" link in the Corporate Membership
    Then The link is opened in a new tab in the Corporate Membership

 @TC-I012 @REGULAR @AFW-3722 @AFW-3705 @AFW-3628 @AU @IN @TH @PH @SG @AFW-3663 @AFW-3731 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify the checkboxes text are displayed correctly in Corporate Membership
    When The user scrolls to the checkbox section in the Corporate Membership
    Then The corporate authority checkbox text is displayed correctly in the Corporate Membership
    And The corporate understanding checkbox text is displayed correctly in the Corporate Membership
    And The terms and conditions checkbox text is displayed correctly in the Corporate Membership
    And The marketing opt-in checkbox text is displayed correctly in the Corporate Membership

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-I001–I012 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="CorporateMembershipConsolidatedPass"; $env:TAG="AU"; $env:LOCALE="EN-AU"; npm run test:multi-locale:feature
  # Note: FEATURE=CorporateMembership also matches these (feature-level tag inheritance).

 @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @Regression @Smoke @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — checkbox texts and Terms link open in a new tab
    When The user scrolls to the checkbox section in the Corporate Membership
    Then The corporate authority checkbox text is displayed correctly in the Corporate Membership
    And The corporate understanding checkbox text is displayed correctly in the Corporate Membership
    And The terms and conditions checkbox text is displayed correctly in the Corporate Membership
    And The marketing opt-in checkbox text is displayed correctly in the Corporate Membership
    When The user clicks the "Terms & Condition" link in the Corporate Membership
    Then The link is opened in a new tab in the Corporate Membership

  # AFW-3722-adapted (Corporate): 3 required unchecked + marketing optional unchecked + texts.
  @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @Smoke @desktop @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — TH required checkbox defaults and marketing optional default
    When The user scrolls to the checkbox section in the Corporate Membership
    Then The required Corporate Membership checkboxes are unchecked by default
    And The marketing opt-in checkbox is unchecked by default on the Corporate Membership form
    And The corporate authority checkbox text is displayed correctly in the Corporate Membership
    And The corporate understanding checkbox text is displayed correctly in the Corporate Membership
    And The terms and conditions checkbox text is displayed correctly in the Corporate Membership
    And The marketing opt-in checkbox text is displayed correctly in the Corporate Membership

  # AFW-3722-adapted — untick a required checkbox blocks submit.
  @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @desktop @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — TH required checkbox untick blocks Corporate Membership submit
    When The user fills the form with valid data in the Corporate Membership
    And The required Terms checkbox is unchecked on the Corporate Membership form
    And The user submits the Corporate Membership form
    Then The Corporate Membership form blocks submit after unticking a required checkbox

  # AFW-3722-adapted — marketing optional: submit succeeds without marketing opt-in.
  @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @desktop @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — TH marketing opt-in optional submit without marketing consent
    When The user scrolls to the checkbox section in the Corporate Membership
    Then The marketing opt-in checkbox is unchecked by default on the Corporate Membership form
    When The user submits the form in the Corporate Membership without marketing opt-in
    Then The thank you page is displayed on successful submission of the Corporate Membership form

  # AFW-3722-adapted — marketing opt-in select and deselect.
  @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @desktop @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — TH marketing opt-in select and deselect
    When The user scrolls to the checkbox section in the Corporate Membership
    Then The marketing opt-in checkbox is unchecked by default on the Corporate Membership form
    When The user checks the marketing opt-in checkbox on the Corporate Membership form
    Then The marketing opt-in checkbox is checked on the Corporate Membership form
    When The user unchecks the marketing opt-in checkbox on the Corporate Membership form
    Then The marketing opt-in checkbox is unchecked by default on the Corporate Membership form

  # AFW-3722-adapted — submit with all required + marketing checked.
  @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @desktop @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — TH submit with required checkboxes and marketing opt-in checked
    When The user submits the form in the Corporate Membership with marketing opt-in
    Then The thank you page is displayed on successful submission of the Corporate Membership form

  # AFW-3722 TH — Terms legal link (Corporate has Terms on the terms checkbox; no Privacy/SMS on this form).
  @AFW-3660 @AFW-3661 @AFW-3658 @AFW-3722 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @desktop @AFW-3731 @AFW-3663 @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated — TH Terms legal link opens in a new tab
    When The user clicks the "Terms & Condition" link in the Corporate Membership
    Then The link is opened in a new tab in the Corporate Membership

 @AFW-3660 @AFW-3661 @AFW-3658 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @ID @Regression @Smoke @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — form required fields (empty submission)
    When The user submits the Corporate Membership form with empty fields
    Then The required field error is shown for all input fields in the Corporate Membership user form

 @AFW-3660 @AFW-3661 @AFW-3658 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @ID @Regression @Smoke @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — form invalid fields (name, email, phone)
    When The user enters "123$" in the first name field in the Corporate Membership
    And The user enters "Test456" in the last name field in the Corporate Membership
    And The user enters "john.doe@example" in the email field in the Corporate Membership
    And The user enters invalid number in the phone number field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Corporate Membership
    And The email validation error is displayed in the Corporate Membership
    And The phone number validation error is displayed in the Corporate Membership

 @AFW-3660 @AFW-3661 @AFW-3658 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @ID @Regression @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — first and last name maximum length validation
    When The user enters more than 30 characters in the "first name" field in the Corporate Membership
    And The user enters more than 30 characters in the "last name" field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The maximum length validation error is displayed for the first and last name fields in the Corporate Membership

 @AFW-3660 @AFW-3661 @AFW-3658 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @ID @PhoneNumber @Regression @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — phone autofill and copy-paste acceptance
    When The user autofills the phone number field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The phone number field is accepted in the Corporate Membership
    When The user copies and pastes a valid number into the phone number field in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The phone number field is accepted in the Corporate Membership

 @AFW-3660 @AFW-3661 @AFW-3658 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @ID @Regression @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — server side error when form API is blocked
    Given The "corporate membership form" API is blocked
    When The user fills the form with valid data in the Corporate Membership
    And The user submits the Corporate Membership form
    Then The server side error message is displayed in the Corporate Membership user form

 @AFW-3660 @AFW-3661 @AFW-3658 @CorporateMembershipConsolidatedPass @AU @IN @TH @PH @SG @ID @TEST_SUCCESS @Regression @Smoke @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — successful form submission
    When The user submits the form in the Corporate Membership
    Then The thank you page is displayed on successful submission of the Corporate Membership form

  # AFW-3660 Corporate Membership (Testpad 27496) TH spin-up — one-pass: form → validation → submit.
  # Run: $env:FEATURE="Afw3660ConsolidatedPass"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @AFW-3660 @AFW-3658 @Afw3660ConsolidatedPass @CorporateMembershipConsolidatedPass @TH @PH @SG @Regression @Smoke @desktop @AFW-3663 @ZH-HK @AFW-3659 @EN-MY
  Scenario: Consolidated — AFW-3660 TH Corporate Membership spin-up
    When The user scrolls to the checkbox section in the Corporate Membership
    Then The required Corporate Membership checkboxes are unchecked by default
    And The marketing opt-in checkbox is unchecked by default on the Corporate Membership form
    When The user submits the Corporate Membership form with empty fields
    Then The required field error is shown for all input fields in the Corporate Membership user form
    When The user submits the form in the Corporate Membership without marketing opt-in
    Then The thank you page is displayed on successful submission of the Corporate Membership form

  # Untranslated-text scan (CLD3 → lexicon → optional Cursor AI). Same pipeline as Contact Us / Events / MI / TUF.
  # Run: $env:FEATURE="UntranslatedTextScan"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @UntranslatedTextScan @CorporateMembership @TH @desktop @CorporateMembershipConsolidatedPass @Regression @ZH-HK @AFW-3663 @EN-MY @AFW-3659
  Scenario: Consolidated — scan Corporate Membership form for untranslated copy
    When The user collects visible Corporate Membership copy for untranslated-text scan at stage "form"
    And The user scrolls to the checkbox section in the Corporate Membership
    When The user collects visible Corporate Membership copy for untranslated-text scan at stage "checkboxes"
    Then The collected Corporate Membership flow copy matches the locale language








