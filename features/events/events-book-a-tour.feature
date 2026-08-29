@EventsBookATour
Feature: Event Book A Tour
  This feature covers the full user journey for booking a gym tour through
  the Events Book A Tour page. It includes validating the location
  search, user form inputs, API error handling, and the complete
  booking flow and confirmation details

  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-*) + Feature Tag + Supported Locales (@AU @GB  @IE).
  # Run: $env:FEATURE="EventsBookATour"; $env:TAG="AU"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="EventsBookATourConsolidatedPass" or --grep @EventsBookATourConsolidatedPass

  Background: Navigate to page
    Given The user is on "Events Book A Tour" page

  #Location Search
   @Sprint23 @AFW-2269 @TC-28420 @AU @GB  @IE  
  Scenario: Display message when no nearby gyms are found in the Events Book A Tour page searched location
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

   @AFW-2269 @TC-28422 @AU @GB  @IE  
  Scenario: Book a Tour and Gym Details button is displayed in search results in Events Book A Tour page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The GYM DETAILS and BOOK A TOUR buttons are displayed in the Events Book A Tour page search results for that gym

    @AFW-2269 @TC-28423 @AU @GB  @IE  @desktop
  Scenario: Clicking GYM DETAILS button in search results redirect to its local gym page in Events Book A Tour page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @AFW-2269 @Sprint23 @AU @GB  @IE 
  Scenario: Gym search results are displayed sorted by distance and limited to 10 results in Events Book A Tour page
    When The user searches for the "Locale Based" location in the Events page location search
    Then Only max 10 results are shown in the Events page gym search results

  #User Form
   @AFW-2269 @TC-28424 @AU @GB  @IE 
  Scenario: Displays error message when user submits form with empty fields in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

   @Sprint23 @AFW-2269 @TC-28425 @AU @GB  @IE 
  Scenario: Displays error message for non-alphabetic characters in first name and last name fields in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user submits the Events page form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page

   @Sprint23 @AFW-2269 @TC-28426 @AU @GB  @IE 
  Scenario: Displays error message when the email format is invalid in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user enters "john.doe@example" in the email field in the Events page
    And The user submits the Events page form
    Then The email validation error is displayed in the Events page

   @PhoneNumber @Sprint23 @AFW-2269 @TC-28427 @AU @GB  @IE 
  Scenario: Displays error message when the phone number format is invalid in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user enters invalid number in the phone number field in the Events page
    And The user submits the Events page form
    Then The phone number validation error is displayed in the Events page

  @PhoneNumber @Sprint23 @AFW-2269 @AU @GB  @IE 
  Scenario: Verifies the phone number field is accepted when filled via autofill in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user autofills the phone number field in the Events page
    And The user submits the Events page form
    Then The phone number field is accepted in the Events page

   @PhoneNumber @Sprint23 @AFW-2269 @AU @GB  @IE 
  Scenario: Verifies the phone number field is accepted when filled via copy and paste in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user copies and pastes a valid number into the phone number field in the Events page
    And The user submits the Events page form
    Then The phone number field is accepted in the Events page

   @Sprint23 @AFW-2269 @TC-28428 @AU @GB  @IE 
  Scenario: Displays error message for first name and last name fields when the character limit is exceeded in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user enters more than 30 characters in the "first name" field in the Events page
    And The user enters more than 30 characters in the "last name" field in the Events page
    And The user submits the Events page form
    Then The maximum length validation error is displayed for the first and last name fields in the Events page

   @Sprint23 @AFW-2269 @TC-28431 @TC-28432 @AU @GB  @IE 
  Scenario Outline: Verify clicking links in user form opens a new tab in Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    And The user clicks the "<Link>" link in the Events page
    Then The link is opened in a new tab in the Events page

    # title-format: Verify clicking the <Link> link in user form opens a new tab in Events Book A Tour page
    Examples:
      | Link               |
      | Terms & Conditions |
      | Privacy Notice     |

  @AFW-2269 @TC-28433 @AU @GB  @IE 
  Scenario: Verify disclaimer and bottom text on user form Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    Then The correct disclaimer text is displayed in the Events Book A Tour User form

  @AFW-2269 @AFW-3811 @TC-28434 @AU @GB  @IE  @TEST_SUCCESS
  Scenario: Successfully complete a gym tour booking from location search to confirmation in the Events Book A Tour page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user selects a date, time and submits the Events Book A Tour form with valid data
    Then The Events booking confirmation message and appointment details is displayed
    And The prospect Id and prospect data is cleared from session storage
    And The Add to Calendar button is visible in the Events page confirmation screen
    And Clicking Google option in the Events page confirmation screen opens the calendar in new tab

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="EventsBookATourConsolidatedPass"; $env:TAG="AU"; npm run test:multi-locale:feature
  # Note: FEATURE=EventsBookATour also matches these (feature-level tag inheritance).

  @EventsBookATourConsolidatedPass @AU @GB  @IE @Regression @batch-1
  Scenario: Consolidated — valid search, max 10 results, and BOOK A TOUR / GYM DETAILS buttons
    When The user searches for the "Locale Based" location in the Events page location search
    Then Only max 10 results are shown in the Events page gym search results
    And The GYM DETAILS and BOOK A TOUR buttons are displayed in the Events Book A Tour page search results for that gym

  @EventsBookATourConsolidatedPass @AU @GB  @IE @Regression @Smoke @batch-1
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @EventsBookATourConsolidatedPass @AU @GB  @IE @desktop @Regression @Smoke @batch-1
  Scenario: Consolidated — Gym Details redirects to local gym page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

  @EventsBookATourConsolidatedPass @AU @GB  @IE @Regression 
  Scenario: Consolidated — form disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    Then The correct disclaimer text is displayed in the Events Book A Tour User form

  @EventsBookATourConsolidatedPass @AU @GB  @IE @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @EventsBookATourConsolidatedPass @AU @GB  @IE @PhoneNumber @Regression @Smoke @batch-1 @desktop
  Scenario: Consolidated — form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user submits the Events page form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @EventsBookATourConsolidatedPass @AU @GB  @IE @Regression
  Scenario: Consolidated — first and last name maximum length validation
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user enters more than 30 characters in the "first name" field in the Events page
    And The user enters more than 30 characters in the "last name" field in the Events page
    And The user submits the Events page form
    Then The maximum length validation error is displayed for the first and last name fields in the Events page

  @EventsBookATourConsolidatedPass @AU @GB  @IE @PhoneNumber @Regression 
  Scenario: Consolidated — phone autofill and copy-paste acceptance
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user autofills the phone number field in the Events page
    And The user submits the Events page form
    Then The phone number field is accepted in the Events page
    When The user copies and pastes a valid number into the phone number field in the Events page
    And The user submits the Events page form
    Then The phone number field is accepted in the Events page

  @EventsBookATourConsolidatedPass @AU @GB  @IE @Regression @desktop
  Scenario: Consolidated — Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @EventsBookATourConsolidatedPass @AU @GB  @IE @TEST_SUCCESS @Regression @Smoke @batch-1
  Scenario: Consolidated — successful booking to confirmation
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    When The user selects a date, time and submits the Events Book A Tour form with valid data
    Then The Events booking confirmation message and appointment details is displayed
    And The prospect Id and prospect data is cleared from session storage
    And The Add to Calendar button is visible in the Events page confirmation screen
    And Clicking Google option in the Events page confirmation screen opens the calendar in new tab

  # AFW-3811 — one-pass Events 2.0 CTA + See You Soon visit copy (Testpad #35–37). Covers TC-28422 + TC-28434.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-28422 @TC-28434 @AU @GB @IE @Regression @batch-1
  Scenario: Consolidated — AFW-3811 Book a Visit Events CTA and See You Soon copy
    When The user searches for the "Locale Based" location in the Events page location search
    Then The GYM DETAILS and BOOK A TOUR buttons are displayed in the Events Book A Tour page search results for that gym
    When The user selects the BOOK A TOUR option for the "Locale Based" gym from the Events Book A Tour page search results
    And The user selects a date, time and submits the Events Book A Tour form with valid data
    Then The Events booking confirmation message and appointment details is displayed
