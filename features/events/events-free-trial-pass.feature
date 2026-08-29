@EventsFreeTrialPass
Feature: Events Free Trial Pass

  # Source of truth: Events Free Trial Pass Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Events Free Trial Pass YES for US, GB, IE
  # Checklist: .cursor/knowledge-base/scenario-checklist-events-free-trial-pass.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-C00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="EventsFreeTrialPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="EventsFreeTrialPassConsolidatedPass" or --grep @EventsFreeTrialPassConsolidatedPass
  #
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US only (GB/IE = FALSE).

  Background: Navigate to Events Free Trial Pass
    Given The user is on "Events Free Trial Pass" page

  # --- Events Free Trial Pass Find Your Gym ---

  @TC-C001 @REGULAR @US @GB @IE
  Scenario: Verify Events Free Trial Pass Find A Gym heading and description are correct
    Then The heading and description are displayed correctly in the Events Free Trial Pass page
    And The search box placeholder is displayed correctly in the Events Free Trial Pass page

  @TC-C002 @REGULAR @US @GB @IE
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Events Free Trial Pass page

  @TC-C003 @REGULAR @US @GB @IE
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Events Free Trial Pass page

  @TC-C004 @REGULAR @US @GB @IE
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The GYM DETAILS and FREE TRIAL PASS buttons are displayed in the Events page search results for that gym

  @TC-C005 @REGULAR @US @GB @IE
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @TC-C006 @REGULAR @US @GB @IE
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the Events page location search
    Then The LIST and MAP tabs switch correctly in the Events Free Trial Pass page
    And The GYM DETAILS and FREE TRIAL PASS buttons are displayed in the Events page search results for that gym

  @TC-C007 @REGULAR @US @GB @IE
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Use Current Location button is visible and correct in the Events Free Trial Pass page

  @TC-C008 @REGULAR @US @GB @IE
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Events Free Trial Pass page

  @TC-C00  @REGULAR@US @GB @IE
  Scenario: Verify clicking Free Trial Pass shows the Events Lead Form page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The Events Free Trial Pass lead form is displayed

  @TC-C01  @REGULAR@US @GB @IE
  Scenario: Verify clicking Gym Details redirects to the Gym details page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @TC-C011 @REGULAR @US @GB @IE
  Scenario: Verify "TRY US FOR FREE" text heading and description are correct
    Then The "TRY US FOR FREE" heading and description are displayed correctly in the Events Free Trial Pass page

  # --- Events Free Trial Pass Form Page ---

  @TC-C012 @REGULAR @US @GB @IE
  Scenario: Verify "TELL US ABOUT YOU" text is visible and correct
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Free Trial Pass form

  @TC-C013 @REGULAR @US @GB @IE
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The gym location name and address are visible on the Events Free Trial Pass form

  @TC-C014 @REGULAR @Regression @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Events Free Trial Pass
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user interacts with the lead form in the Events Free Trial Pass page
    Then The Form Started Rudderstack event is triggered in Events Free Trial Pass

  @TC-C01  @REGULAR@US @GB @IE @desktop
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @TC-C01  @REGULAR@US @GB @IE @desktop
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user submits the Events page form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @TC-C01  @REGULAR@US
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form

  @TC-C018 @REGULAR @US
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct marketing consent disclaimer text is displayed on the Events Free Trial Pass form

  @TC-C019 @REGULAR @IE @GB
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct disclaimer text is displayed in the Events User form

  @TC-C02  @REGULAR@US @desktop
  Scenario: Verify Local Resident pop-up modal content after Local Resident text link is clicked
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user opens the Local Resident pop-up modal on the Events Free Trial Pass form
    Then The Local Resident pop-up modal content is displayed on the Events Free Trial Pass form

  @TC-C021 @REGULAR @US @IE @GB @desktop
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-C022 @REGULAR @US @IE @GB @desktop
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-C023 @REGULAR @US @desktop
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Text Messaging Terms" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-C024 @REGULAR @US @GB @IE
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Free Trial Pass page

  @TC-C025 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Events Free Trial Pass
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Events Free Trial Pass

  @TC-C026 @REGULAR @US
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The lead capture form submission is successful in Events Free Trial Pass

  @TC-C027 @REGULAR @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user interacts with the lead form in the Events Free Trial Pass page
    Then The form_loaded data layer is triggered in Events Free Trial Pass

  # --- Events Free Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

  @TC-C028 @REGULAR @US @GB @IE
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Free Trial Pass

  @TC-C029 @REGULAR @US @GB @IE
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time without submitting on the Events Free Trial Pass schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Free Trial Pass schedule page

  @TC-C03  @REGULAR @US @GB @IE
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The staff_id is returned correctly from the Events Free Trial Pass availabilities API

  # --- Events Free Success Page ---

  @TC-C031 @REGULAR @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Events Free Trial Pass

  @TC-C032 @REGULAR @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Events Free Trial Pass
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Appointment Scheduled Rudderstack event is verified in Events Free Trial Pass

  @TC-C033 @REGULAR @US @GB @IE
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Free Trial Pass booking

  @TC-C034 @REGULAR @US @GB @IE
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Events booking confirmation message and appointment details is displayed

  @TC-C035 @REGULAR @US @GB @IE
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Free Trial Pass

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-C001–C035 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="EventsFreeTrialPassConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=EventsFreeTrialPass also matches these (feature-level tag inheritance).

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression  @desktop
  Scenario: Consolidated — Find Your Gym landing, valid search, LIST/MAP, and FREE TRIAL PASS form
    Then The heading and description are displayed correctly in the Events Free Trial Pass page
    And The search box placeholder is displayed correctly in the Events Free Trial Pass page
    And The Find Your Gym heading is displayed correctly in the Events Free Trial Pass page
    And The Use Current Location button is visible and correct in the Events Free Trial Pass page
    And The Let's Get You To The Right Place section is displayed correctly in the Events Free Trial Pass page
    And The "TRY US FOR FREE" heading and description are displayed correctly in the Events Free Trial Pass page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The LIST and MAP tabs switch correctly in the Events Free Trial Pass page
    And The GYM DETAILS and FREE TRIAL PASS buttons are displayed in the Events page search results for that gym
    And The Use Current Location button is visible and correct in the Events Free Trial Pass page
    When The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The Events Free Trial Pass lead form is displayed

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression @Smoke @batch-1
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression @Smoke @batch-1
  Scenario: Consolidated — Gym Details redirects to local gym page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression  
  Scenario: Consolidated — form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Free Trial Pass form
    And The gym location name and address are visible on the Events Free Trial Pass form
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Free Trial Pass page

  @EventsFreeTrialPassConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated — US form disclaimers, Local Resident modal, Form Started and form_loaded
    Given Rudderstack validation is enabled for Events Free Trial Pass
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Events Free Trial Pass form
    When The user opens the Local Resident pop-up modal on the Events Free Trial Pass form
    Then The Local Resident pop-up modal content is displayed on the Events Free Trial Pass form
    When The user interacts with the lead form in the Events Free Trial Pass page
    Then The Form Started Rudderstack event is triggered in Events Free Trial Pass
    And The form_loaded data layer is triggered in Events Free Trial Pass

  @EventsFreeTrialPassConsolidatedPass @IE @GB @Regression
  Scenario: Consolidated — Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct disclaimer text is displayed in the Events User form

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user submits the Events page form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @EventsFreeTrialPassConsolidatedPass @US @Regression @desktop
  Scenario: Consolidated — US Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Text Messaging Terms" link in the Events page
    Then The link is opened in a new tab in the Events page

  @EventsFreeTrialPassConsolidatedPass @IE @GB @Regression @desktop
  Scenario: Consolidated — Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated — schedule page, staff_id, and LET'S DO THIS enabled
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Free Trial Pass
    And The staff_id is returned correctly from the Events Free Trial Pass availabilities API
    When The user selects a date and time without submitting on the Events Free Trial Pass schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Free Trial Pass schedule page

  @EventsFreeTrialPassConsolidatedPass @GB @IE @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — appointment booking, referral API, and See you soon success
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Free Trial Pass booking
    And The Events booking confirmation message and appointment details is displayed

  @EventsFreeTrialPassConsolidatedPass @US @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — US appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Events Free Trial Pass
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Events Free Trial Pass
    And The lead capture form submission is successful in Events Free Trial Pass
    When The user selects a date and time in the Events page schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Events Free Trial Pass
    And The Appointment Scheduled Rudderstack event is verified in Events Free Trial Pass
    And The referral API is triggered after successful Events Free Trial Pass booking
    And The Events booking confirmation message and appointment details is displayed

  # AFW-3811 — one-pass Events FTP schedule + See You Soon visit copy (Testpad #11–16). Covers TC-C028 + TC-C034.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-C028 @TC-C034 @US @GB @IE @Regression  
  Scenario: Consolidated — AFW-3811 Book a Visit Events Free Trial Pass schedule and See You Soon copy
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Free Trial Pass
    When The user selects a date and time in the Events page schedule picker
    Then The Events booking confirmation message and appointment details is displayed

  @EventsFreeTrialPassConsolidatedPass @US @GB @IE @Regression @Smoke @batch-1
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated — thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Free Trial Pass
