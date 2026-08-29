@EventsFindYourFitphoria
Feature: Events Find Your Fitphoria

  # Source of truth: Events Find Your Fitphoria Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Events Find Your Fitphoria YES for AU only
  # Checklist: .cursor/knowledge-base/scenario-checklist-events-find-your-fitphoria.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-F00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="EventsFindYourFitphoria"; $env:TAG="AU"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="EventsFindYourFitphoriaConsolidatedPass" or --grep @EventsFindYourFitphoriaConsolidatedPass
  #
  # Local Config AU: Rudderstack/Data Layer/GTM = FALSE — no RS/dataLayer scenarios in this flow.
  # CTA button on search results is ENQUIRE NOW (sheet "Free Trial Pass" wording is legacy copy).

  Background: Navigate to Events Find Your Fitphoria
    Given The user is on "Events Find Your Fitphoria" page

  # --- Events Find Your Fitphoria Find Your Gym ---

  @TC-F001 @REGULAR   @AU
  Scenario: Verify Events Find Your Fitphoria Find Your Fitphoria  heading and description are correct
    Then The heading and description are displayed correctly in the Events Find Your Fitphoria page
    And The search box placeholder is displayed correctly in the Events Find Your Fitphoria page

  @TC-F002 @REGULAR @AU
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Events Find Your Fitphoria page

  @TC-F003 @REGULAR @AU
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Events Find Your Fitphoria page

  @TC-F004 @REGULAR @AU
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The GYM DETAILS and ENQUIRE NOW buttons are displayed in the Events page search results for that gym

  @TC-F005 @REGULAR   @AU
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @TC-F006 @REGULAR @AU
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the Events page location search
    Then The LIST and MAP tabs switch correctly in the Events Find Your Fitphoria page
    And The GYM DETAILS and ENQUIRE NOW buttons are displayed in the Events page search results for that gym

  @TC-F007 @REGULAR @AU
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Use Current Location button is visible and correct in the Events Find Your Fitphoria page

  @TC-F008 @REGULAR @AU
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Events Find Your Fitphoria page

  @TC-F009 @REGULAR @AU
  Scenario: Verify clicking Free Trial Pass shows the Events Lead Form page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    Then The Events Find Your Fitphoria lead form is displayed

  @TC-F010 @REGULAR   @AU
  Scenario: Verify clicking Gym Details redirects to the Gym details page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @TC-F011 @REGULAR @AU
  Scenario: Verify "READY TO TAKE THE NEXT STEP?" text heading and description are correct
    Then The "READY TO TAKE THE NEXT STEP?" heading and description are displayed correctly in the Events Find Your Fitphoria page

  # --- Events Find Your Fitphoria Form Page ---

  @TC-F012 @REGULAR @AU
  Scenario: Verify "TELL US ABOUT YOU" text is visible and correct
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Find Your Fitphoria form

  @TC-F013 @REGULAR @AU
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    Then The gym location name and address are visible on the Events Find Your Fitphoria form

  @TC-F014 @REGULAR   @AU @desktop
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @TC-F015 @REGULAR   @AU @desktop
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user submits the Events page form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @TC-F016 @REGULAR @AU
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    Then The correct disclaimer text is displayed in the Events User form

  @TC-F017 @REGULAR @AU @desktop
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-F018 @REGULAR @AU @desktop
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-F019 @REGULAR @AU
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Find Your Fitphoria page

  # --- Events Find Your Fitphoria Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

  @TC-F020 @REGULAR @AU
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Find Your Fitphoria

  @TC-F021 @REGULAR  @AU
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time without submitting on the Events Find Your Fitphoria schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Find Your Fitphoria schedule page

  @TC-F022 @REGULAR   @AU
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The staff_id is returned correctly from the Events Find Your Fitphoria availabilities API

  # --- Events Find Your Fitphoria Success Page ---

  @TC-F023 @REGULAR   @AU
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Find Your Fitphoria booking

  @TC-F024 @REGULAR   @AU
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Events booking confirmation message and appointment details is displayed

  @TC-F025 @REGULAR   @AU
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Find Your Fitphoria

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-F001–F025 above. These stack compatible checks to reduce navigations.
  # No @TC-* /  /  — smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="EventsFindYourFitphoriaConsolidatedPass"; $env:TAG="AU"; npm run test:multi-locale:feature
  # Note: FEATURE=EventsFindYourFitphoria also matches these (feature-level tag inheritance).

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @batch-1 @desktop
  Scenario: Consolidated — Find Your Gym landing, valid search, LIST/MAP, and ENQUIRE NOW form
    Then The heading and description are displayed correctly in the Events Find Your Fitphoria page
    And The search box placeholder is displayed correctly in the Events Find Your Fitphoria page
    And The Find Your Gym heading is displayed correctly in the Events Find Your Fitphoria page
    And The Use Current Location button is visible and correct in the Events Find Your Fitphoria page
    And The Let's Get You To The Right Place section is displayed correctly in the Events Find Your Fitphoria page
    And The "READY TO TAKE THE NEXT STEP?" heading and description are displayed correctly in the Events Find Your Fitphoria page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The LIST and MAP tabs switch correctly in the Events Find Your Fitphoria page
    And The GYM DETAILS and ENQUIRE NOW buttons are displayed in the Events page search results for that gym
    And The Use Current Location button is visible and correct in the Events Find Your Fitphoria page
    When The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    Then The Events Find Your Fitphoria lead form is displayed

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1
  Scenario: Consolidated — Gym Details redirects to local gym page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression  @batch-1
  Scenario: Consolidated — form chrome, disclaimer, and valid input without submit
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Find Your Fitphoria form
    And The gym location name and address are visible on the Events Find Your Fitphoria form
    And The correct disclaimer text is displayed in the Events User form
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Find Your Fitphoria page

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user submits the Events page form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @desktop
  Scenario: Consolidated — Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated — schedule page, staff_id, and LET'S DO THIS enabled
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Find Your Fitphoria
    And The staff_id is returned correctly from the Events Find Your Fitphoria availabilities API
    When The user selects a date and time without submitting on the Events Find Your Fitphoria schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Find Your Fitphoria schedule page

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — appointment booking, referral API, and See you soon success
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Find Your Fitphoria booking
    And The Events booking confirmation message and appointment details is displayed

  @EventsFindYourFitphoriaConsolidatedPass @AU @Regression @Smoke @batch-1
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated — thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the ENQUIRE NOW option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Find Your Fitphoria
