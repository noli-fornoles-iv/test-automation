@ContactUs
Feature: Contact Us

  # Source of truth: Contact Us Flow tab � TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Contact Us YES for US, AU, AE, SA, ZA, GB, IE, IN (scenario tags follow Supported Locales)
  # Checklist: .cursor/knowledge-base/scenario-checklist-contact-us.md
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-B00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="ContactUs"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="ContactUsConsolidatedPass" or --grep @ContactUsConsolidatedPass

  Background: Navigate to Contact Us
    Given The user is on "Contact Us" page

  # --- Contact Us Find A Gym ---

 @TC-B001 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the Contact Us Find A Gym heading and description are correct
    Then The heading and description are displayed correctly in the Contact Us
    And The search box placeholder is displayed correctly in the Contact Us

 @TC-B002 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the Find Your Gym heading is correct
    Then The Find Your Gym heading is displayed correctly in the Contact Us

 @TC-B003 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search placeholder is correct
    Then The search box placeholder is displayed correctly in the Contact Us

 @TC-B004 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the Use Current Location button is visible and correct
    Then The Use Current Location button is visible and correct in the Contact Us

 @TC-B005 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify the location search functionality for a valid search scenario
    When The user searches for the "Locale Based" location in the Contact Us location search
    Then The system displays Contact Us gym results sorted by distance
    And Only max 10 results are shown in the Contact Us gym search results
    And The gym search results for that location are displayed in Contact Us

 @TC-B006 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify the location search functionality for a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Contact Us location search
    Then The no nearby locations error is displayed in the Contact Us location search

 @TC-B007 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that clicking LIST and MAP correctly switches the tab
    When The user searches for the "Locale Based" location in the Contact Us location search
    Then The LIST and MAP tabs switch correctly in the Contact Us
    And The SELECT GYM button is displayed in the Contact Us search results for the gym

 @TC-B008 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the Use Current Location button is visible and correct after location search
    When The user searches for the "Locale Based" location in the Contact Us location search
    Then The Use Current Location button is visible and correct in the Contact Us

 @TC-B009 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Contact Us

 @TC-B010 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that clicking Select Gym redirects to the Contact Us form page
    When The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The user should be redirected to the Contact Us form for that gym

  # --- Contact Us Form Page ---

 @TC-B011 @REGULAR @Regression @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify that the Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Contact Us
    And The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user interacts with the lead form in the Contact Us
    Then The Form Started Rudderstack event is triggered in Contact Us

  # --- AFW-3952 Location Searched / Location Selected (US Rudderstack) ---
  # Same Location Search verification pattern as Try Us Free (success / invalid / Select Gym).
  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires on successful Contact Us location search
    Given Rudderstack validation is enabled for Contact Us
    When The user searches for the "Locale Based" location in the Contact Us location search
    Then The Location Searched Rudderstack event is triggered for "Contact Us" with search success "true"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires with search_success false for invalid Contact Us search
    Given Rudderstack validation is enabled for Contact Us
    When The user searches an invalid location in the Contact Us location search
    Then The Location Searched Rudderstack event is triggered for "Contact Us" with search success "false"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Selected fires when Select Gym is clicked on Contact Us
    Given Rudderstack validation is enabled for Contact Us
    When The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The Location Selected Rudderstack event is triggered for "Contact Us"

  # --- AFW-3303 Page view lead_funnel_viewed false (Email Club / Contact) ---
  @AFW-3303 @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed false on Contact Us
    Given Rudderstack validation is enabled for Contact Us
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Contact Us" with lead_funnel_viewed "false"

  # AFW-4088: Email Club ?location_id=� must include location_name with location_id on page view
  @AFW-3303 @AFW-4088 @US @desktop @Regression
  Scenario: Verify page view location_name accompanies location_id on Contact Us deep-link
    Given Rudderstack validation is enabled for Contact Us
    And The user opens Contact Us with location_id deep-link
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Contact Us" with lead_funnel_viewed "false"

 @TC-B012 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the Book A Tour heading and description are correct
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The heading and description are displayed correctly on the Contact Us form page

 @TC-B013 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    And The user submits the Contact Us form with empty fields
    Then The required field error is shown for all input fields in the Contact Us user form

 @TC-B014 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user enters "123$" in the first name field in the Contact Us
    And The user enters "Test456" in the last name field in the Contact Us
    And The user enters "john.doe@example" in the email field in the Contact Us
    And The user enters invalid number in the phone number field in the Contact Us
    And The user submits the Contact Us form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Contact Us
    And The email validation error is displayed in the Contact Us
    And The phone number validation error is displayed in the Contact Us

 @TC-B015 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data without submitting
    Then The form fields accept valid input without validation errors in the Contact Us

  @TC-B016 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @desktop
  # APP DEFECT (SIT/UAT Email Club): after successful /communications submit only Form Started
  # Rudderstack fires � Lead Captured + identify are not observed. Keep asserting until product fixes (AFW-3956 expects Lead Captured).
  Scenario: Verify that Lead Captured and Identity Rudderstack events are triggered after successful lead form submission
    Given Rudderstack validation is enabled for Contact Us
    And The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Contact Us

 @TC-B017 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify lead capture form submission
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data
    Then The lead capture form submission is successful in Contact Us

  # --- Contact Us Success Page ---

 @TC-B018 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify the Contact Us Thank You page
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data
    Then The thank you page is displayed after successful form submission in Contact Us

  @TC-B019 @REGULAR   @US
  # APP DEFECT (SIT/UAT Email Club): form_loaded is not pushed to parent or iframe dataLayer
  # after lead form interaction (iframe dataLayer stays empty). Keep asserting until product fixes.
  Scenario: Verify that the form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user interacts with the lead form in the Contact Us
    Then The form_loaded data layer should be triggered in Contact Us

  @TC-B020 @REGULAR   @US
  # APP DEFECT (SIT/UAT Email Club): form_success is not pushed to dataLayer after successful submit
  # (thank-you page loads; only GTM lifecycle events appear). Keep asserting until product fixes.
  Scenario: Verify that the form_success data layer is triggered
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data
    Then The form_success data layer should be triggered in Contact Us

 @TC-B021 @AFW-3663 @REGULAR @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the /communications API payload reflects user input
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data
    Then The /communications API payload reflects user input in Contact Us

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-B001�B021 above. These stack compatible checks to reduce navigations.
  # No @TC-* /  @REGULAR /  � smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="ContactUsConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=ContactUs also matches these (feature-level tag inheritance).
  #
  # Tickets:
  # - AFW-3660 ([React] Thailand Spin Up / Email Club): tagged on TH consolidated + @Afw3660ConsolidatedPass
  #   Testpad: https://outliantteam.testpad.com/script/27496/report?auth=f507430d7b8f73c84f8b2b45d99bee90
  # - AFW-3722 ([React] Thailand Legal Submission Form Disclaimer): NOT applicable to Contact Us /
  #   Email Club � SIT contact-us React form has message + submit only (no Checkbox 1/2). Covered on
  #   Membership Inquiry + Try Us Free (@AFW-3722 / @Afw3722ConsolidatedPass). @AFW-3659 @EN-MY
  #   Testpad: https://outliantteam.testpad.com/script/27503/report?auth=59cc2fccdc86f3363dd923a107c79f66

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @ContactUsConsolidatedPass @AFW-3663 @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated � Find A Gym landing, valid search, LIST/MAP, and Select Gym redirect
    Then The heading and description are displayed correctly in the Contact Us
    And The search box placeholder is displayed correctly in the Contact Us
    And The Find Your Gym heading is displayed correctly in the Contact Us
    And The Use Current Location button is visible and correct in the Contact Us
    And The Let's Get You To The Right Place section is displayed correctly in the Contact Us
    When The user searches for the "Locale Based" location in the Contact Us location search
    Then The system displays Contact Us gym results sorted by distance
    And Only max 10 results are shown in the Contact Us gym search results
    And The gym search results for that location are displayed in Contact Us
    And The LIST and MAP tabs switch correctly in the Contact Us
    And The SELECT GYM button is displayed in the Contact Us search results for the gym
    And The Use Current Location button is visible and correct in the Contact Us
    When The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The user should be redirected to the Contact Us form for that gym

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @ContactUsConsolidatedPass @AFW-3663 @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated � no nearby gym search
    When The user searches for a location with no nearby gyms in the Contact Us location search
    Then The no nearby locations error is displayed in the Contact Us location search

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @ContactUsConsolidatedPass @AFW-3663 @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated � form page heading and description
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The heading and description are displayed correctly on the Contact Us form page

  @ContactUsConsolidatedPass @US @Regression 
  # TC-B011 Form Started works on SIT. TC-B019 form_loaded remains an Email Club APP DEFECT �
  # keep asserting only on the sheet scenario, not in this compatible consolidated pass.
  Scenario: Consolidated � US Form Started
    Given Rudderstack validation is enabled for Contact Us
    And The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user interacts with the lead form in the Contact Us
    Then The Form Started Rudderstack event is triggered in Contact Us

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @ContactUsConsolidatedPass @AFW-3663 @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated � form required fields
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    And The user submits the Contact Us form with empty fields
    Then The required field error is shown for all input fields in the Contact Us user form

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @ContactUsConsolidatedPass @AFW-3663 @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated � form invalid fields
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user enters "123$" in the first name field in the Contact Us
    And The user enters "Test456" in the last name field in the Contact Us
    And The user enters "john.doe@example" in the email field in the Contact Us
    And The user enters invalid number in the phone number field in the Contact Us
    And The user submits the Contact Us form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Contact Us
    And The email validation error is displayed in the Contact Us
    And The phone number validation error is displayed in the Contact Us

  # TC-B011 Form Started is US-only (Local Config Rudderstack TRUE) � see Consolidated � US Form Started.
  # TC-B016 Lead Captured/identify and TC-B020 form_success remain Email Club APP DEFECTS on SIT/UAT �
  # keep asserting only on sheet scenarios. Consolidated pass covers submit + thank-you + /communications.
 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @ContactUsConsolidatedPass @AFW-3663 @US @AU @ZA @AE @GB @IE @SA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated � valid fill, submit, thank you, and /communications payload
    Given The user searches for the "Locale Based" location in the Contact Us location search
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    When The user fills the Contact Us form with valid data without submitting
    Then The form fields accept valid input without validation errors in the Contact Us
    When The user fills the Contact Us form with valid data
    Then The lead capture form submission is successful in Contact Us
    And The thank you page is displayed after successful form submission in Contact Us
    And The /communications API payload reflects user input in Contact Us

  # AFW-3660 Email Club (Contact Us) TH spin-up � one-pass: landing ? search ? form ? submit ? thank-you.
  # Run: $env:FEATURE="Afw3660ConsolidatedPass"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @AFW-3660 @AFW-3657 @AFW-3658 @Afw3660ConsolidatedPass @AFW-3663 @ContactUsConsolidatedPass @TH @ZH-HK @PH @SG @Regression @Smoke @batch-1 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated � AFW-3660 TH Contact Us Email Club spin-up
    Then The heading and description are displayed correctly in the Contact Us
    And The search box placeholder is displayed correctly in the Contact Us
    And The Find Your Gym heading is displayed correctly in the Contact Us
    When The user searches for the "Locale Based" location in the Contact Us location search
    Then The gym search results for that location are displayed in Contact Us
    And The SELECT GYM button is displayed in the Contact Us search results for the gym
    When The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The user should be redirected to the Contact Us form for that gym
    And The heading and description are displayed correctly on the Contact Us form page
    When The user fills the Contact Us form with valid data
    Then The lead capture form submission is successful in Contact Us
    And The thank you page is displayed after successful form submission in Contact Us
    And The /communications API payload reflects user input in Contact Us

  # Untranslated-text scan (CLD3 ? lexicon ? optional Cursor AI).
  # Non-English only. Soft-fails by default; set UNTRANSLATED_TEXT_FAIL=1 to hard-fail.
  # Optional: CURSOR_API_KEY for AI layer on ambiguous Latin-script strings.
  # Run: $env:FEATURE="UntranslatedTextScan"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @UntranslatedTextScan @ContactUs @TH @AFW-3663 @ZH-HK @SA @DE @AT @IT @desktop @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated � scan Contact Us Find Gym ? success for untranslated copy
    When The user collects visible Contact Us copy for untranslated-text scan at stage "landing"
    And The user searches for the "Locale Based" location in the Contact Us location search
    When The user collects visible Contact Us copy for untranslated-text scan at stage "results"
    And The user selects the "Locale Based" gym from the Contact Us gym search results
    Then The user should be redirected to the Contact Us form for that gym
    When The user collects visible Contact Us copy for untranslated-text scan at stage "form"
    And The user fills the Contact Us form with valid data
    Then The thank you page is displayed after successful form submission in Contact Us
    When The user collects visible Contact Us copy for untranslated-text scan at stage "thank-you"
    Then The collected Contact Us flow copy matches the locale language






