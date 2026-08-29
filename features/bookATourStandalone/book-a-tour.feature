@BookATourStandalone
Feature: Book A Tour Standalone

  # Source of truth: Book A Tour Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit?gid=1610635132#gid=1610635132
  # Coverage: Book A Tour Standalone YES for US, AU, GB, IE
  # Checklist: .cursor/knowledge-base/scenario-checklist-book-a-tour.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-A00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="BookATourStandalone"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="BatConsolidatedPass" or --grep @BatConsolidatedPass

  Background: Navigate to Book A Tour Standalone
    Given The user is on "Book A Tour Standalone" page

  # --- BAT Find A Gym ---

  @TC-A001 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that the "Book A Tour - Find A Gym" heading and description are correct
    Then The heading and description are displayed correctly in the BAT Standalone
    And The search box placeholder is displayed correctly in the BAT Standalone

  @TC-A002 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that "Find A Gym" is correct
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The system displays Book a Tour Standalone gym results sorted by distance
    And Only max 10 results are shown in the Book a Tour Standalone gym search results
    And The gym search results for that location is displayed in Book A Tour Standalone

  @TC-A003 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The gym search results for that location is displayed in Book A Tour Standalone

  @TC-A004 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify location search functionality with a "no nearby gym" search scenario
    When The user searches for a location with no nearby gyms in the Book A Tour Standalone location search
    Then The no nearby locations error is displayed in the Book A Tour Standalone location search

  @TC-A005 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that clicking "LIST" and "MAP" correctly switches the tab
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The SELECT GYM button is displayed in the Book A Tour Standalone search results for the gym

  @TC-A006 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that "Use Current Location" is visible and correct
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The gym search results for that location is displayed in Book A Tour Standalone

  @TC-A007 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that the "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    # RIGHT PLACE empty-state copy is on the Find A Gym landing (before search results replace it)
    Then The heading and description are displayed correctly in the BAT Standalone

  @TC-A008 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that clicking "Select Gym" redirects to the Form page
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The user should be redirected to the Book a tour Standalone page for that gym

  # --- BAT Form Page ---

  @TC-A009 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The staff_id is returned correctly in the Book A Tour Standalone availabilities API

  @TC-A010 @REGULAR @Regression @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify that the "Form Started" Rudderstack event is triggered
    Given Rudderstack validation is enabled for Book A Tour Standalone
    And The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user interacts with the lead form in the Book A Tour Standalone
    Then The Form Started Rudderstack event is triggered in Book A Tour Standalone

  # --- AFW-3952 Location Searched / Location Selected (US Rudderstack) ---
  # Same Location Search verification pattern as Try Us Free (success / invalid / Select Gym).
  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires on successful Book A Tour Standalone location search
    Given Rudderstack validation is enabled for Book A Tour Standalone
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The Location Searched Rudderstack event is triggered for "Book A Tour Standalone" with search success "true"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires with search_success false for invalid Book A Tour Standalone search
    Given Rudderstack validation is enabled for Book A Tour Standalone
    When The user searches an invalid location in the Book A Tour Standalone location search
    Then The Location Searched Rudderstack event is triggered for "Book A Tour Standalone" with search success "false"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Selected fires when Select Gym is clicked on Book A Tour Standalone
    Given Rudderstack validation is enabled for Book A Tour Standalone
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The Location Selected Rudderstack event is triggered for "Book A Tour Standalone"

  # --- AFW-3303 Page view lead_funnel_viewed (US Rudderstack) ---
  @AFW-3303 @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed true on Book A Tour Standalone
    Given Rudderstack validation is enabled for Book A Tour Standalone
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Book A Tour Standalone" with lead_funnel_viewed "true"

  @TC-A011 @REGULAR @AFW-3811 @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that the "Book A Tour" heading and description are correct
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The heading and description are displayed correctly on the BAT Standalone form page

  @TC-A012 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify selecting date and time availabilities
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user selects a date from the schedule picker in the Book A Tour Standalone
    And The user selects a time from the schedule picker in the Book A Tour Standalone
    Then The selected date and time are reflected in the Book A Tour Standalone schedule picker

  @TC-A013 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA @desktop
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    And The user submits the form with empty fields in the Book A Tour Standalone
    Then The required field error is shown for all input fields in the Book A Tour Standalone

  @TC-A014 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA @desktop
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user enters "123$" in the first name field in the Book A Tour Standalone
    And The user enters "Test456" in the last name field in the Book A Tour Standalone
    And The user enters "john.doe@example" in the email field in the Book A Tour Standalone
    And The user enters invalid number in the phone number field in the Book A Tour Standalone
    And The user submits the form in the Book A Tour Standalone
    Then The non-alphabetic validation error is displayed for the first name and last name fields in the Book A Tour Standalone
    And The email validation error is displayed in the Book A Tour Standalone
    And The phone number validation error is displayed in the Book A Tour Standalone

  @TC-A015 @REGULAR @US
  Scenario: Verify the checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The correct local resident disclaimer text is displayed in the user form

  @TC-A016 @REGULAR @IE @AU @GB @EN-CA @FR-CA
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The Lead Form Disclaimer is displayed correctly in the Book A Tour Standalone User form

  @TC-A017 @REGULAR @US
  Scenario: Verify the checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The correct disclaimer text is displayed in the Book A Tour Standalone User form

  @TC-A018 @REGULAR @US
  Scenario: Verify the "Local Resident" pop-up modal content after the "Local Resident" text link is clicked
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user opens the Local Resident modal in the Book A Tour Standalone
    Then The Local Resident modal content is displayed correctly in the Book A Tour Standalone

  @TC-A019 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify that the "Privacy Policy" text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    And The user clicks the "Privacy Notice" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone

  @TC-A020 @REGULAR  @US @AU @EN-CA @FR-CA
  Scenario: Verify that the "Terms of Use" text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    And The user clicks the "Terms & Conditions" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone

  @TC-A021 @REGULAR  @US @desktop
  Scenario: Verify that the "SMS & MMS Terms of Service" text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    And The user clicks the "Text Messaging Terms" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone

  @TC-A022 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user fills the form with valid data in the Book A Tour Standalone
    Then The form fields accept valid input without validation errors in the Book A Tour Standalone

  @TC-A023 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify that the "Lead Captured, Identity and Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Book A Tour Standalone
    And The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The Lead Captured, Identity and Appointment Scheduled Rudderstack events are verified in Book A Tour Standalone

  @TC-A024 @REGULAR @US
  Scenario: Verify lead capture form submission
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The lead capture form submission is successful in Book A Tour Standalone

  # --- BAT Success Page ---

  @TC-A025 @REGULAR @AFW-3811 @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify the "Book A Tour" success page
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The booking confirmation message and appointment details is displayed
    And The Add to Calendar button is visible in the Book a Tour Standalone confirmation screen

  @TC-A026 @REGULAR @US
  Scenario: Verify that the "form_loaded" data layer is triggered
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user interacts with the lead form in the Book A Tour Standalone
    Then The form_loaded data layer should be triggered in Book A Tour Standalone

  @TC-A027 @REGULAR @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The form_success and tour_appointment_scheduled data layer should be triggered in Book A Tour Standalone

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-A001–A027 above. These stack compatible checks to reduce navigations.
  # No @TC-* /  @REGULAR@Smoke @batch-1 / @Regression — smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="BatConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=BookATourStandalone also matches these (feature-level tag inheritance).

  @BatConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression 
  Scenario: Consolidated — Find A Gym landing, valid search, and Select Gym redirect
    Then The heading and description are displayed correctly in the BAT Standalone
    And The search box placeholder is displayed correctly in the BAT Standalone
    When The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The system displays Book a Tour Standalone gym results sorted by distance
    And Only max 10 results are shown in the Book a Tour Standalone gym search results
    And The gym search results for that location is displayed in Book A Tour Standalone
    And The SELECT GYM button is displayed in the Book A Tour Standalone search results for the gym
    When The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The user should be redirected to the Book a tour Standalone page for that gym

  @BatConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-1
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms in the Book A Tour Standalone location search
    Then The no nearby locations error is displayed in the Book A Tour Standalone location search

  @BatConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-1
  Scenario: Consolidated — form page staff_id, headings, and schedule selection
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The staff_id is returned correctly in the Book A Tour Standalone availabilities API
    And The heading and description are displayed correctly on the BAT Standalone form page
    When The user selects a date from the schedule picker in the Book A Tour Standalone
    And The user selects a time from the schedule picker in the Book A Tour Standalone
    Then The selected date and time are reflected in the Book A Tour Standalone schedule picker

  @BatConsolidatedPass @US @Regression @Smoke @batch-1
  Scenario: Consolidated — US form disclaimers, Form Started and form_loaded
    Given Rudderstack validation is enabled for Book A Tour Standalone
    And The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct disclaimer text is displayed in the Book A Tour Standalone User form
    When The user interacts with the lead form in the Book A Tour Standalone
    Then The Form Started Rudderstack event is triggered in Book A Tour Standalone
    And The form_loaded data layer should be triggered in Book A Tour Standalone

  # Local Resident modal is slow on WebKit (iframe scroll/evaluate); keep it separate so
  # Form Started / form_loaded above stay under the 10m suite timeout.
  @BatConsolidatedPass @US @Regression @desktop
  Scenario: Consolidated — US Local Resident modal
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user opens the Local Resident modal in the Book A Tour Standalone
    Then The Local Resident modal content is displayed correctly in the Book A Tour Standalone

  @BatConsolidatedPass @IE @EN-CA @FR-CA @AU @GB @Regression 
  Scenario: Consolidated — Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Then The Lead Form Disclaimer is displayed correctly in the Book A Tour Standalone User form

  @BatConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    And The user submits the form with empty fields in the Book A Tour Standalone
    Then The required field error is shown for all input fields in the Book A Tour Standalone

  @BatConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form invalid fields
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user enters "123$" in the first name field in the Book A Tour Standalone
    And The user enters "Test456" in the last name field in the Book A Tour Standalone
    And The user enters "john.doe@example" in the email field in the Book A Tour Standalone
    And The user enters invalid number in the phone number field in the Book A Tour Standalone
    And The user submits the form in the Book A Tour Standalone
    Then The non-alphabetic validation error is displayed for the first name and last name fields in the Book A Tour Standalone
    And The email validation error is displayed in the Book A Tour Standalone
    And The phone number validation error is displayed in the Book A Tour Standalone

  @BatConsolidatedPass @US @Regression @desktop
  Scenario: Consolidated — US Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user clicks the "Privacy Notice" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone
    When The user clicks the "Terms & Conditions" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone
    When The user clicks the "Text Messaging Terms" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone

  @BatConsolidatedPass @AU @EN-CA @FR-CA @Regression @desktop
  Scenario: Consolidated — AU Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user clicks the "Privacy Notice" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone
    When The user clicks the "Terms & Conditions" link in the Book A Tour Standalone
    Then The link is opened in a new tab in the Book A Tour Standalone

 @BatConsolidatedPass @AU @GB @IE @EN-CA @FR-CA @Regression 
  Scenario: Consolidated — valid form fill (fields accept input)
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user fills the form with valid data in the Book A Tour Standalone
    Then The form fields accept valid input without validation errors in the Book A Tour Standalone

  # Split from fill+assert: stacking fill + schedule/submit on WebKit regularly exhausts 10m.
  @BatConsolidatedPass @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-1
  Scenario: Consolidated — submit and success page
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The booking confirmation message and appointment details is displayed
    And The Add to Calendar button is visible in the Book a Tour Standalone confirmation screen

  @BatConsolidatedPass @US @Regression @Smoke @batch-1
  Scenario: Consolidated — valid submit, success page, Rudderstack and dataLayer
    Given Rudderstack validation is enabled for Book A Tour Standalone
    And The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    # Submit step fills the form — skip a separate fill pass (WebKit double-fill exhausts 10m timeout).
    # Valid-field coverage remains on TC-A022 / the AU-GB-IE consolidated fill journey.
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The lead capture form submission is successful in Book A Tour Standalone
    And The Lead Captured, Identity and Appointment Scheduled Rudderstack events are verified in Book A Tour Standalone
    And The form_success and tour_appointment_scheduled data layer should be triggered in Book A Tour Standalone
    And The booking confirmation message and appointment details is displayed
    And The Add to Calendar button is visible in the Book a Tour Standalone confirmation screen

  # AFW-3811 — one-pass Book a Visit copy (Testpad 27347 standalone #2–7, #39–42)
  # Covers TC-A011 (lead form) + TC-A025 (See You Soon). Run: FEATURE="Afw3811ConsolidatedPass"
  @AFW-3811 @Afw3811ConsolidatedPass @TC-A011 @TC-A025 @US @AU @GB @IE @EN-CA @FR-CA @Regression  
  Scenario: Consolidated — AFW-3811 Book a Visit lead form, pick-a-time, and See You Soon copy
    And The user selects the "Locale Based" gym from the Book A Tour Standalone gym search results
    Given The user searches for the "Locale Based" location in the Book A Tour Standalone location search
    Then The heading and description are displayed correctly on the BAT Standalone form page
    When The user selects a date, time and submits the form with valid data in the Book A Tour Standalone
    Then The booking confirmation message and appointment details is displayed
    And The Add to Calendar button is visible in the Book a Tour Standalone confirmation screen
