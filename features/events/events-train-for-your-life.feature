@EventsTrainForYourLife
Feature: Events Train For Your Life

  # Source of truth: Events Train For Your Life Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Events Train For Your Life YES for US only
  # Checklist: .cursor/knowledge-base/scenario-checklist-events-train-for-your-life.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-H00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="EventsTrainForYourLife"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="EventsTrainForYourLifeConsolidatedPass" or --grep @EventsTrainForYourLifeConsolidatedPass
  #
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US.
  # Sheet TC-H011 says "TRY US FOR FREE"; live page CTA is "READY TO GET STARTED?" (asserted in steps).
  # Sheet staff_id row has empty Test Case ID → tagged @TC-H029 @REGULAR (gap between H028 and H030).

  Background: Navigate to Events Train For Your Life
    Given The user is on "Events Train For Your Life" page

  # --- Events Train For Your Life Find Your Gym ---

  @TC-H001 @REGULAR  @US
  Scenario: Verify Events Train For Your Life Find A Gym heading and description are correct
    Then The heading and description are displayed correctly in the Events Train For Your Life page
    And The search box placeholder is displayed correctly in the Events Train For Your Life page

  @TC-H002 @REGULAR @US
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Events Train For Your Life page

  @TC-H003 @REGULAR @US
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Events Train For Your Life page

  @TC-H004 @REGULAR @US
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The GYM DETAILS and FREE TRIAL PASS buttons are displayed in the Events page search results for that gym

  @TC-H005 @REGULAR  @US
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @TC-H006 @REGULAR @US
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the Events page location search
    Then The LIST and MAP tabs switch correctly in the Events Train For Your Life page
    And The GYM DETAILS and FREE TRIAL PASS buttons are displayed in the Events page search results for that gym

  @TC-H007 @REGULAR @US
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Use Current Location button is visible and correct in the Events Train For Your Life page

  @TC-H008 @REGULAR @US
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Events Train For Your Life page

  @TC-H009 @REGULAR @US
  Scenario: Verify clicking Free Trial Pass shows the Events Lead Form page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The Events Train For Your Life lead form is displayed

  @TC-H010 @REGULAR @US
  Scenario: Verify clicking Gym Details redirects to the Gym details page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @TC-H011 @REGULAR @US
  Scenario: Verify "TRY US FOR FREE" text heading and description are correct
    Then The "READY TO GET STARTED?" heading and description are displayed correctly in the Events Train For Your Life page

  # --- Events Train For Your Life Form Page ---

  @TC-H012 @REGULAR @US
  Scenario: Verify "TELL US ABOUT YOU" text is visible and correct
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Train For Your Life form

  @TC-H013 @REGULAR @US
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The gym location name and address are visible on the Events Train For Your Life form

  @TC-H014 @REGULAR @Regression  @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Events Train For Your Life
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user interacts with the lead form in the Events Train For Your Life page
    Then The Form Started Rudderstack event is triggered in Events Train For Your Life

  @TC-H015 @REGULAR  @US @desktop
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @TC-H016 @REGULAR  @US @desktop
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

  @TC-H017 @REGULAR @US
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form

  @TC-H018 @REGULAR @US
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct marketing consent disclaimer text is displayed on the Events Train For Your Life form

  @TC-H019 @REGULAR @US @desktop
  Scenario: Verify Local Resident pop-up modal content after Local Resident text link is clicked
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user opens the Local Resident pop-up modal on the Events Train For Your Life form
    Then The Local Resident pop-up modal content is displayed on the Events Train For Your Life form

  @TC-H020 @REGULAR @US @desktop
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-H021 @REGULAR @US @desktop
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-H022 @REGULAR @US @desktop
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Text Messaging Terms" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-H023 @REGULAR @US
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Train For Your Life page

  @TC-H024 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Events Train For Your Life
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Events Train For Your Life

  @TC-H025 @REGULAR  @US
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The lead capture form submission is successful in Events Train For Your Life

  @TC-H026 @REGULAR  @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user interacts with the lead form in the Events Train For Your Life page
    Then The form_loaded data layer is triggered in Events Train For Your Life

  # --- Events Train For Your Life Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

  @TC-H027 @REGULAR @US
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Train For Your Life

  @TC-H028 @REGULAR @US
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time without submitting on the Events Train For Your Life schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Train For Your Life schedule page

  @TC-H029 @REGULAR @US
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The staff_id is returned correctly from the Events Train For Your Life availabilities API

  # --- Events Train For Your Life Success Page ---

  @TC-H030 @REGULAR  @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Events Train For Your Life

  @TC-H031 @REGULAR  @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Events Train For Your Life
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Appointment Scheduled Rudderstack event is verified in Events Train For Your Life

  @TC-H032 @REGULAR  @US
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Train For Your Life booking

  @TC-H033 @REGULAR  @US
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Events booking confirmation message and appointment details is displayed

  @TC-H034 @REGULAR  @US
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Train For Your Life

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-H001–H034 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="EventsTrainForYourLifeConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=EventsTrainForYourLife also matches these (feature-level tag inheritance).

  @EventsTrainForYourLifeConsolidatedPass @US @Regression   @desktop
  Scenario: Consolidated — Find Your Gym landing, valid search, LIST/MAP, and FREE TRIAL PASS form
    Then The heading and description are displayed correctly in the Events Train For Your Life page
    And The search box placeholder is displayed correctly in the Events Train For Your Life page
    And The Find Your Gym heading is displayed correctly in the Events Train For Your Life page
    And The Use Current Location button is visible and correct in the Events Train For Your Life page
    And The Let's Get You To The Right Place section is displayed correctly in the Events Train For Your Life page
    And The "READY TO GET STARTED?" heading and description are displayed correctly in the Events Train For Your Life page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The LIST and MAP tabs switch correctly in the Events Train For Your Life page
    And The GYM DETAILS and FREE TRIAL PASS buttons are displayed in the Events page search results for that gym
    And The Use Current Location button is visible and correct in the Events Train For Your Life page
    When The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The Events Train For Your Life lead form is displayed

  @EventsTrainForYourLifeConsolidatedPass @US @Regression @Smoke @batch-1
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @EventsTrainForYourLifeConsolidatedPass @US @Regression @Smoke @batch-1
  Scenario: Consolidated — Gym Details redirects to local gym page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @EventsTrainForYourLifeConsolidatedPass @US @Regression 
  Scenario: Consolidated — form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Train For Your Life form
    And The gym location name and address are visible on the Events Train For Your Life form
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Train For Your Life page

  @EventsTrainForYourLifeConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated — US form disclaimers, Local Resident modal, Form Started and form_loaded
    Given Rudderstack validation is enabled for Events Train For Your Life
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Events Train For Your Life form
    # Interact / RS / dataLayer before Local Resident modal — modal open+close is slow on WebKit
    # and was pushing Form Started past the 10m suite timeout (same pattern as BAT consolidated).
    When The user interacts with the lead form in the Events Train For Your Life page
    Then The Form Started Rudderstack event is triggered in Events Train For Your Life
    And The form_loaded data layer is triggered in Events Train For Your Life
    When The user opens the Local Resident pop-up modal on the Events Train For Your Life form
    Then The Local Resident pop-up modal content is displayed on the Events Train For Your Life form

  @EventsTrainForYourLifeConsolidatedPass @US  @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @EventsTrainForYourLifeConsolidatedPass @US @Regression @Smoke @batch-1 @desktop
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

  @EventsTrainForYourLifeConsolidatedPass @US @Regression  @batch-1 @desktop
  Scenario: Consolidated — Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Text Messaging Terms" link in the Events page
    Then The link is opened in a new tab in the Events page

  @EventsTrainForYourLifeConsolidatedPass @US @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated — schedule page, staff_id, and LET'S DO THIS enabled
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Train For Your Life
    And The staff_id is returned correctly from the Events Train For Your Life availabilities API
    When The user selects a date and time without submitting on the Events Train For Your Life schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Train For Your Life schedule page

  @EventsTrainForYourLifeConsolidatedPass @US @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Events Train For Your Life
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Events Train For Your Life
    And The lead capture form submission is successful in Events Train For Your Life
    When The user selects a date and time in the Events page schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Events Train For Your Life
    And The Appointment Scheduled Rudderstack event is verified in Events Train For Your Life
    And The referral API is triggered after successful Events Train For Your Life booking
    And The Events booking confirmation message and appointment details is displayed

  @EventsTrainForYourLifeConsolidatedPass @US @Regression @Smoke @batch-1
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated — thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the FREE TRIAL PASS option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Train For Your Life
