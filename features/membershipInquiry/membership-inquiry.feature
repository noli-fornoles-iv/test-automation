@MembershipInquiry
Feature: Membership Inquiry

  # Source of truth: Membership Inquiry Flow tab ? TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Membership Inquiry YES for US, AU, AE, SA, ZA, GB, IE, IN
  # Checklist: .cursor/knowledge-base/scenario-checklist-membership-inquiry.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-O00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="MembershipInquiry"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="MembershipInquiryConsolidatedPass" or --grep @MembershipInquiryConsolidatedPass
  #
  # Tickets:
  # - AFW-3660 ([React] Thailand Spin Up / MI ? Testpad 27496): @AFW-3660 on TH consolidated + @Afw3660ConsolidatedPass
  # - AFW-3722 ([React] Thailand Legal Disclaimer ? Testpad 27503 primary flow): @AFW-3722 / @Afw3722ConsolidatedPass
  #   Checkbox 1/2 defaults, untick-blocks-submit, optional marketing, Privacy/Terms/SMS, postal case-sensitivity
  #
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US only.
  # Schedule/Success scenarios skip when can_book_appointment does not match Notes.

  Background: Navigate to Membership Inquiry
    Given The user is on "Membership Inquiry" page

  # --- Membership Inquiry Find Your Gym ---

 @TC-O001 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Membership Inquiry Find A Gym  heading is correct
    Then The heading is displayed correctly in the Membership Inquiry
    And The search box placeholder is displayed correctly in the Membership Inquiry

 @TC-O002 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Membership Inquiry

 @TC-O003 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Membership Inquiry

 @TC-O004 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    Then The system displays Membership Inquiry gym results sorted by distance
    And Only max 10 results are shown in the Membership Inquiry gym search results
    And The gym search results for that location is displayed in Membership Inquiry
    And The SELECT GYM button is displayed in the Membership Inquiry search results for the gym

 @TC-O005 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Membership Inquiry location search
    Then The "no nearby gyms" message is displayed in the Membership Inquiry location search

 @TC-O006 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    Then The LIST and MAP tabs switch correctly in the Membership Inquiry
    And The SELECT GYM button is displayed in the Membership Inquiry search results for the gym

 @TC-O007 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    Then The Use Current Location button is visible and correct in the Membership Inquiry

 @TC-O008 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Membership Inquiry

 @TC-O009 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking Select Gym Redirects to Events Lead Form page
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The Membership Inquiry lead form is displayed

 @TC-O010 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "Membership Inquiry." text heading and description are correct
    Then The heading is displayed correctly in the Membership Inquiry

  # --- Membership Inquiry Form Page ---

 @TC-O011 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "CONNECT WITH US" text is visible and correct
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The "CONNECT WITH US" text is visible and correct on the Membership Inquiry form

 @TC-O012 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The gym location name and address are visible on the Membership Inquiry form

  @TC-O013 @REGULAR @Regression   @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Membership Inquiry
    And The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user interacts with the lead form in the Membership Inquiry page
    Then The Form Started Rudderstack event is triggered in Membership Inquiry

  # --- AFW-3952 Location Searched / Location Selected (US Rudderstack) ---
  # Same Location Search verification pattern as Try Us Free (success / invalid / Select Gym).
  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires on successful Membership Inquiry location search
    Given Rudderstack validation is enabled for Membership Inquiry
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    Then The Location Searched Rudderstack event is triggered for "Membership Inquiry" with search success "true"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires with search_success false for invalid Membership Inquiry search
    Given Rudderstack validation is enabled for Membership Inquiry
    When The user searches an invalid location in the Membership Inquiry location search
    Then The Location Searched Rudderstack event is triggered for "Membership Inquiry" with search success "false"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Selected fires when Select Gym is clicked on Membership Inquiry
    Given Rudderstack validation is enabled for Membership Inquiry
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The Location Selected Rudderstack event is triggered for "Membership Inquiry"

  # --- AFW-3303 Page view lead_funnel_viewed (US Rudderstack) ---
  @AFW-3303 @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed true on Membership Inquiry
    Given Rudderstack validation is enabled for Membership Inquiry
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Membership Inquiry" with lead_funnel_viewed "true"

  # AFW-4069 ? Location Searched on IP auto-results (no typed search).
  # Excluded from active suite while https://purposebrands.atlassian.net/browse/AFW-4069 is open
  # (event missing / wrong search_method). Re-enable @AFW-3952 @AFW-4069 @US @desktop @Regression when fixed.
  # Scenario: Verify Location Searched fires for Membership Inquiry IP auto location results
  #   Given Rudderstack validation is enabled for Membership Inquiry
  #   And The Membership Inquiry page is reopened without a deep-linked gym for IP location search
  #   When The IP-based gym search results are displayed on Membership Inquiry
  #   Then The Location Searched Rudderstack event is triggered for "Membership Inquiry" with search method "ip_address"

  # AFW-4066 ? zip/postcode search must emit search_type=postcode (Figjam), not always place.
  # Hard-assert: fails while https://purposebrands.atlassian.net/browse/AFW-4066 is open / event missing.
  # Uses Local Config Zip Codes.Default (EN-US: 55128). Prefer MI postal search (same AFW-3952 surface).
  @AFW-3952 @AFW-4066 @US @desktop @Regression
  Scenario: Verify Location Searched search_type is postcode for Membership Inquiry zip search
    Given Rudderstack validation is enabled for Membership Inquiry
    When The user searches for the location with postal code in the Membership Inquiry location search
    Then The Location Searched Rudderstack event is triggered for "Membership Inquiry" with search type "postcode"

 @TC-O014 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    And The user submits the Membership Inquiry form with empty fields
    Then The required field error is shown for all input fields in the Membership Inquiry

 @TC-O015 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user enters "123$" in the first name field in the Membership Inquiry
    And The user enters "Test456" in the last name field in the Membership Inquiry
    And The user enters "john.doe@example" in the email field in the Membership Inquiry
    And The user enters invalid number in the phone number field in the Membership Inquiry
    And The user submits the Membership Inquiry form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Membership Inquiry
    And The email validation error is displayed in the Membership Inquiry
    And The phone number validation error is displayed in the Membership Inquiry

 @TC-O016 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct local resident disclaimer text is displayed in the user form

 @TC-O017 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct marketing consent disclaimer text is displayed on the Membership Inquiry form

  @TC-O018 @AFW-3663 @REGULAR @AU @IN @AE @SA @GB @IE @EN-CA @FR-CA
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct disclaimer text is displayed in the Membership Inquiry User form

  @TC-O019 @REGULAR @ZA
  Scenario: Verify checkbox local resident text
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct local resident disclaimer text is displayed in the user form

  # ZA: Local Resident link may be present but #why-this-matters-modal does not open (expected).
  @TC-O020 @REGULAR @US @IT @desktop
  Scenario: Verify Local Resident pop-up modal content after <text link> is clicked
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user opens the Local Resident pop-up modal on the Membership Inquiry form
    Then The Local Resident pop-up modal content is displayed on the Membership Inquiry form

 @TC-O021 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @AU @IE @GB @SA @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    And The user clicks the "Privacy Notice" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

 @TC-O022 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @AU @IE @SA @GB @DE @IT @TH @PH @SG @NZ @EN-CA @FR-CA @ZH-HK @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    And The user clicks the "Terms & Conditions" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

 @TC-O023 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @TH @ZH-HK @PH @SG @NZ @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    And The user clicks the "Text Messaging Terms" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

 @TC-O024 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user fills the form with valid data in the Membership Inquiry
    Then The form fields accept valid input without validation errors in the Membership Inquiry

  @TC-O025 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Membership Inquiry
    And The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Membership Inquiry

  @TC-O026 @REGULAR   @US
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The lead capture form submission is successful in Membership Inquiry

  @TC-O027 @REGULAR   @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user interacts with the lead form in the Membership Inquiry page
    Then The form_loaded data layer is triggered in Membership Inquiry

  # --- Membership Inquiry Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

 @TC-O028 @AFW-3663 @REGULAR @AFW-3811 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The schedule page heading and text description are displayed for Membership Inquiry

 @TC-O029 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    And The user selects a date and time without submitting on the Membership Inquiry schedule page
    Then The "LET'S DO THIS" button is enabled on the Membership Inquiry schedule page

 @TC-O030 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The staff_id is returned correctly from the Membership Inquiry availabilities API

  # --- Membership Inquiry Success Page ---

  @TC-O031 @REGULAR   @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Membership Inquiry

  @TC-O032 @REGULAR   @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Membership Inquiry
    And The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The Appointment Scheduled Rudderstack event is verified in Membership Inquiry

 @TC-O033 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The referral API is triggered after successful Membership Inquiry booking

 @TC-O034 @AFW-3663 @REGULAR @AFW-3811 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The Membership Inquiry booking confirmation message and appointment details is displayed

 @TC-O035 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Membership Inquiry

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-O001?O035 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="MembershipInquiryConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=MembershipInquiry also matches these (feature-level tag inheritance).

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? Find Your Gym landing, valid search, LIST/MAP, and Select Gym form
    Then The heading is displayed correctly in the Membership Inquiry
    And The search box placeholder is displayed correctly in the Membership Inquiry
    And The Find Your Gym heading is displayed correctly in the Membership Inquiry
    And The Use Current Location button is visible and correct in the Membership Inquiry
    And The Let's Get You To The Right Place section is displayed correctly in the Membership Inquiry
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    Then The system displays Membership Inquiry gym results sorted by distance
    And Only max 10 results are shown in the Membership Inquiry gym search results
    And The gym search results for that location is displayed in Membership Inquiry
    And The LIST and MAP tabs switch correctly in the Membership Inquiry
    And The SELECT GYM button is displayed in the Membership Inquiry search results for the gym
    And The Use Current Location button is visible and correct in the Membership Inquiry
    When The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The Membership Inquiry lead form is displayed

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @AFW-3659 @EN-MY
  Scenario: Consolidated ? no nearby gym search
    When The user searches for a location with no nearby gyms in the Membership Inquiry location search
    Then The "no nearby gyms" message is displayed in the Membership Inquiry location search

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The "CONNECT WITH US" text is visible and correct on the Membership Inquiry form
    And The gym location name and address are visible on the Membership Inquiry form
    When The user fills the form with valid data in the Membership Inquiry
    Then The form fields accept valid input without validation errors in the Membership Inquiry

  @MembershipInquiryConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated ? US form disclaimers, Form Started and form_loaded
    Given Rudderstack validation is enabled for Membership Inquiry
    And The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Membership Inquiry form
    When The user interacts with the lead form in the Membership Inquiry page
    Then The Form Started Rudderstack event is triggered in Membership Inquiry
    And The form_loaded data layer is triggered in Membership Inquiry

  # Local Resident modal is slow on WebKit (iframe scroll/evaluate); keep it separate so
  # Form Started / form_loaded above stay under the suite timeout.
  @MembershipInquiryConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated ? US Local Resident modal
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user opens the Local Resident pop-up modal on the Membership Inquiry form
    Then The Local Resident pop-up modal content is displayed on the Membership Inquiry form

  @MembershipInquiryConsolidatedPass @DE @AT @Regression @Smoke @batch-2
  Scenario: Consolidated ? DE/AT form disclaimers
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Membership Inquiry form

 @MembershipInquiryConsolidatedPass @IT @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated ? IT form disclaimers and Local Resident modal
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Membership Inquiry form
    When The user opens the Local Resident pop-up modal on the Membership Inquiry form
    Then The Local Resident pop-up modal content is displayed on the Membership Inquiry form

  # AFW-3722 TH ? Checkbox 1 (pre-checked/required) + Checkbox 2 (unchecked/optional) + disclaimer text.
  # Local Resident modal is US/IT only (not TH). Legal links: see Afw3722ConsolidatedPass below.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @Smoke @batch-2 @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 1/2 defaults and form disclaimers
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then Checkbox 1 residency consent is pre-checked on the Membership Inquiry form
    And Checkbox 2 marketing consent is unchecked by default on the Membership Inquiry form
    And The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Membership Inquiry form

  # AFW-3722 ? untick required Checkbox 1 blocks submit (Testpad 27503).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 1 untick blocks Membership Inquiry submit
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user fills the form with valid data in the Membership Inquiry
    And The local resident checkbox is unchecked on the Membership Inquiry form
    And The user submits the Membership Inquiry form
    Then The Membership Inquiry form blocks submit after unticking Checkbox 1

  # AFW-3722 ? Checkbox 2 optional: submit succeeds while marketing stays unchecked.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 2 optional submit without marketing consent
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then Checkbox 2 marketing consent is unchecked by default on the Membership Inquiry form
    When The user submits the Membership Inquiry form with valid data
    Then The schedule page heading and text description are displayed for Membership Inquiry
    And The thank-you screen is displayed when appointment booking is not allowed for Membership Inquiry

  # AFW-3722 Testpad ? Checkbox 2 can be selected and deselected.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 2 select and deselect
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then Checkbox 2 marketing consent is unchecked by default on the Membership Inquiry form
    When The user checks Checkbox 2 marketing consent on the Membership Inquiry form
    Then Checkbox 2 marketing consent is checked on the Membership Inquiry form
    When The user unchecks Checkbox 2 marketing consent on the Membership Inquiry form
    Then Checkbox 2 marketing consent is unchecked on the Membership Inquiry form

  # AFW-3722 Testpad ? submit succeeds when both Checkbox 1 and Checkbox 2 are selected.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH submit with both Checkbox 1 and Checkbox 2 checked
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then Checkbox 1 residency consent is pre-checked on the Membership Inquiry form
    When The user checks Checkbox 2 marketing consent on the Membership Inquiry form
    Then Checkbox 2 marketing consent is checked on the Membership Inquiry form
    When The user submits the Membership Inquiry form with valid data
    Then The schedule page heading and text description are displayed for Membership Inquiry
    And The thank-you screen is displayed when appointment booking is not allowed for Membership Inquiry

  # AFW-3660 Testpad ? postal case-sensitivity when Local Config zip has letters; soft-skip for digit-only (TH).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @TH @PH @SG @NZ @ID @ZH-HK @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? TH Membership Inquiry postal code case-sensitivity when applicable
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The Membership Inquiry postal code field is case-insensitive when applicable

  @MembershipInquiryConsolidatedPass @AFW-3663 @AU @IN @AE @SA @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated ? Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct disclaimer text is displayed in the Membership Inquiry User form

  # ZA: assert disclaimer only ? #why-this-matters-modal is not expected to open.
  @MembershipInquiryConsolidatedPass @ZA @Regression @Smoke @batch-2
  Scenario: Consolidated ? ZA local resident disclaimer
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The correct local resident disclaimer text is displayed in the user form

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form required fields
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    And The user submits the Membership Inquiry form with empty fields
    Then The required field error is shown for all input fields in the Membership Inquiry

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form invalid fields
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user enters "123$" in the first name field in the Membership Inquiry
    And The user enters "Test456" in the last name field in the Membership Inquiry
    And The user enters "john.doe@example" in the email field in the Membership Inquiry
    And The user enters invalid number in the phone number field in the Membership Inquiry
    And The user submits the Membership Inquiry form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Membership Inquiry
    And The email validation error is displayed in the Membership Inquiry
    And The phone number validation error is displayed in the Membership Inquiry

  @MembershipInquiryConsolidatedPass @US @Regression  @batch-2 @desktop
  Scenario: Consolidated ? US Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user clicks the "Privacy Notice" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry
    When The user clicks the "Terms & Conditions" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry
    When The user clicks the "Text Messaging Terms" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @MembershipInquiryConsolidatedPass @AFW-3663 @AU @IE @GB @SA @DE @IT @TH @PH @SG @NZ @EN-CA @FR-CA @ZH-HK @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user clicks the "Privacy Notice" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry
    When The user clicks the "Terms & Conditions" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

  # AFW-3722 TH ? Privacy + Terms + Text Messaging Terms (Testpad Checkbox 1 links).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user clicks the "Privacy Notice" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry
    When The user clicks the "Terms & Conditions" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry
    When The user clicks the "Text Messaging Terms" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

  @MembershipInquiryConsolidatedPass @AT @Regression   @desktop
  Scenario: Consolidated ? Privacy legal link opens in a new tab
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user clicks the "Privacy Notice" link in the Membership Inquiry
    Then The link is opened in a new tab in the Membership Inquiry

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated ? schedule page, staff_id, and LET'S DO THIS enabled
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The schedule page heading and text description are displayed for Membership Inquiry
    And The staff_id is returned correctly from the Membership Inquiry availabilities API
    When The user selects a date and time without submitting on the Membership Inquiry schedule page
    Then The "LET'S DO THIS" button is enabled on the Membership Inquiry schedule page

 @MembershipInquiryConsolidatedPass @AFW-3663 @AFW-3661 @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated ? appointment booking, referral API, and See you soon success
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The referral API is triggered after successful Membership Inquiry booking
    And The Membership Inquiry booking confirmation message and appointment details is displayed

  @MembershipInquiryConsolidatedPass @US @Regression @Smoke @batch-2 @desktop
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated ? US appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Membership Inquiry
    And The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Membership Inquiry
    And The lead capture form submission is successful in Membership Inquiry
    When The user selects a date and time in the Membership Inquiry schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Membership Inquiry
    And The Appointment Scheduled Rudderstack event is verified in Membership Inquiry
    And The referral API is triggered after successful Membership Inquiry booking
    And The Membership Inquiry booking confirmation message and appointment details is displayed

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @MembershipInquiryConsolidatedPass @AFW-3663 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated ? thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Membership Inquiry

  # AFW-3811 ? one-pass Book a Visit addon copy (Testpad 27347 #11?16). Covers TC-O028 + TC-O034.
 @AFW-3811 @Afw3811ConsolidatedPass @AFW-3663 @AFW-3661 @TC-O028 @TC-O034 @US @AU @GB @IE @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? AFW-3811 Book a Visit addon schedule and See You Soon copy
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user submits the Membership Inquiry form with valid data
    Then The schedule page heading and text description are displayed for Membership Inquiry
    When The user selects a date and time in the Membership Inquiry schedule picker
    Then The Membership Inquiry booking confirmation message and appointment details is displayed

  # AFW-3660 Membership Inquiry (Testpad 27496) TH spin-up ? one-pass: landing ? search ? form ? submit.
  # Run: $env:FEATURE="Afw3660ConsolidatedPass"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @AFW-3660 @AFW-3657 @AFW-3658 @Afw3660ConsolidatedPass @AFW-3663 @MembershipInquiryConsolidatedPass @TH @ZH-HK @PH @SG @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? AFW-3660 TH Membership Inquiry spin-up
    Then The heading is displayed correctly in the Membership Inquiry
    And The search box placeholder is displayed correctly in the Membership Inquiry
    And The Find Your Gym heading is displayed correctly in the Membership Inquiry
    When The user searches for the "Locale Based" location in the Membership Inquiry location search
    Then The gym search results for that location is displayed in Membership Inquiry
    And The SELECT GYM button is displayed in the Membership Inquiry search results for the gym
    When The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The Membership Inquiry lead form is displayed
    And The "CONNECT WITH US" text is visible and correct on the Membership Inquiry form
    And Checkbox 1 residency consent is pre-checked on the Membership Inquiry form
    And Checkbox 2 marketing consent is unchecked by default on the Membership Inquiry form
    When The user submits the Membership Inquiry form with valid data
    Then The schedule page heading and text description are displayed for Membership Inquiry
    And The thank-you screen is displayed when appointment booking is not allowed for Membership Inquiry

  # Untranslated-text scan (CLD3 ? lexicon ? optional Cursor AI). Same pipeline as Contact Us / Events Promo.
  # Run: $env:FEATURE="UntranslatedTextScan"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @UntranslatedTextScan @MembershipInquiryConsolidatedPass @AFW-3663 @MembershipInquiry @TH @ZH-HK @SA @DE @AT @IT @desktop @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated ? scan Membership Inquiry Find Gym ? form ? post-submit for untranslated copy
    When The user collects visible Membership Inquiry copy for untranslated-text scan at stage "landing"
    And The user searches for the "Locale Based" location in the Membership Inquiry location search
    When The user collects visible Membership Inquiry copy for untranslated-text scan at stage "results"
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    Then The Membership Inquiry lead form is displayed
    When The user collects visible Membership Inquiry copy for untranslated-text scan at stage "form"
    And The user submits the Membership Inquiry form with valid data
    When The user collects visible Membership Inquiry copy for untranslated-text scan at stage "post-submit"
    Then The collected Membership Inquiry flow copy matches the locale language







