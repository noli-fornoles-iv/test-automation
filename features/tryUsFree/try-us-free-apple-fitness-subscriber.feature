@TryUsFreeAppleFitnessPlusSubscriber
Feature: Try Us Free Apple Fitness Plus Subscriber

  # Source of truth: Try Us Free Apple Fitness Plus Subscriber Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: YES for US, EN-CA (AF Automation Coverage tab)
  # Checklist: .cursor/knowledge-base/scenario-checklist-try-us-free-apple-fitness-plus-subscriber.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-Q00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Devices: @iphone + @android (Desktop excluded by project grep).
  # Run: $env:FEATURE="TryUsFreeAppleFitnessPlusSubscriber"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass" or --grep @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US.

  Background: Navigate to page
    Given The user is on "Try us Free Apple Fitness Plus Subscriber" page

  # --- Find Your Gym ---

   @TC-Q001 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify Try Us Free Apple Fitness Plus Subscriber Find A Gym heading is correct
    Then The heading and description are displayed correctly in the Apple Fitness Plus Subscriber page
    And The search box placeholder is displayed correctly in the Apple Fitness Plus Subscriber page

   @TC-Q002 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Apple Fitness Plus Subscriber page

   @TC-Q003 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Apple Fitness Plus Subscriber page

   @TC-Q004 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the location search
    Then The system displays gym results sorted by distance
    And Only max 10 results are shown in the gym search results
    And The gym search results for that location is displayed
    And The JOIN IN GYM button is displayed in the Apple Fitness Plus Subscriber search results

   @TC-Q005 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms
    Then The no nearby locations error is displayed in the location search

   @TC-Q006 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the location search
    Then The LIST and MAP tabs switch correctly in the Apple Fitness Plus Subscriber page
    And The JOIN IN GYM button is displayed in the Apple Fitness Plus Subscriber search results

   @TC-Q007 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the location search
    Then The Use Current Location button is visible and correct in the Apple Fitness Plus Subscriber page

   @TC-Q008 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Apple Fitness Plus Subscriber page

   @TC-Q009 @REGULAR  @US @EN-CA @FR-CA
  Scenario: Verify clicking Select Gym Redirects to Events Lead Form page
    When The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Apple Fitness Plus Subscriber lead form is displayed

   @TC-Q010 @REGULAR  @US @EN-CA @FR-CA
  Scenario: Verify "TRY US FOR FREE" text heading and description are correct
    Then The "TRY US FOR FREE" heading and description are displayed correctly in the Apple Fitness Plus Subscriber page

  # --- Form Page ---

   @TC-Q011 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify "GET STARTED TODAY" text is visible and correct
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The "GET STARTED TODAY" text is visible and correct on the Apple Fitness Plus Subscriber form

   @TC-Q012 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The gym location name and address are visible on the Apple Fitness Plus Subscriber form

   @TC-Q013 @REGULAR @Regression   @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Apple Fitness Plus Subscriber
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user interacts with the lead form in the Apple Fitness Plus Subscriber page
    Then The Form Started Rudderstack event is triggered in Apple Fitness Plus Subscriber

   @TC-Q014 @REGULAR   @US @EN-CA @FR-CA @desktop
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The local resident checkbox is unchecked
    And The user submits the form with empty fields
    Then The required field errors are shown for Apple Fitness Plus Subscriber form fields

   @TC-Q015 @REGULAR   @US @EN-CA @FR-CA @desktop
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters "123$" in the first name field
    And The user enters "Test456" in the last name field
    And The user enters "john.doe@example" in the email field
    And The user enters invalid number in the phone number field
    And The user submits the form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the user form
    And The email validation error is displayed in the user form
    And The phone number validation error is displayed in the user form

   @TC-Q016 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form

   @TC-Q017 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct marketing consent disclaimer text is displayed on the Apple Fitness Plus Subscriber form

   @TC-Q018 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Lead Form Disclaimer is displayed correctly on the Apple Fitness Plus Subscriber form

   @TC-Q019 @REGULAR @US @EN-CA @FR-CA @desktop
  Scenario: Verify Local Resident pop-up modal content after text link is clicked
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user opens the Local Resident pop-up modal on the Apple Fitness Plus Subscriber form
    Then The Local Resident pop-up modal content is displayed on the Apple Fitness Plus Subscriber form

   @TC-Q020 @REGULAR @US @EN-CA @FR-CA @desktop
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab

   @TC-Q021 @REGULAR @US @EN-CA @FR-CA @desktop
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab

   @TC-Q022 @REGULAR @US @EN-CA @FR-CA @desktop
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

   @TC-Q023 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user fills the form with valid data
    Then The form fields accept valid input without validation errors in the Apple Fitness Plus Subscriber page

  @TC-Q024 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Apple Fitness Plus Subscriber
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Apple Fitness Plus Subscriber

   @TC-Q025 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The lead capture form submission is successful in Apple Fitness Plus Subscriber

   @TC-Q026 @REGULAR   @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user interacts with the lead form in the Apple Fitness Plus Subscriber page
    Then The form_loaded data layer is triggered in Apple Fitness Plus Subscriber

  # --- Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

  @TC-Q027 @REGULAR @US @EN-CA @FR-CA
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The schedule page heading and text description are displayed for Apple Fitness Plus Subscriber

  @TC-Q028 @REGULAR @US @EN-CA @FR-CA
  Scenario: Time slot message is displayed when no date is selected in apple fitness subscriber
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The time slot message is displayed in the schedule picker

  @TC-Q029 @REGULAR  @US @EN-CA @FR-CA
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects a date and time without submitting on the Apple Fitness Plus Subscriber schedule page
    Then The schedule confirm button is enabled on the Apple Fitness Plus Subscriber schedule page

  @TC-Q030 @REGULAR @US @EN-CA @FR-CA
  Scenario: Displays error message when the user leaves the time selection empty in schedule picker in apple fitness subscriber
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects the date in the schedule picker
    And The user leaves the time selection empty in the schedule picker
    Then The error message is displayed for the time selection field in the schedule picker

   @TC-Q031 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The staff_id is returned correctly from the Apple Fitness Plus Subscriber availabilities API

  # --- Success Page ---

   @TC-Q032 @REGULAR   @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The form_success and tour_appointment_scheduled data layers are triggered in Apple Fitness Plus Subscriber

   @TC-Q033 @REGULAR   @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Apple Fitness Plus Subscriber
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The Appointment Scheduled Rudderstack event is verified in Apple Fitness Plus Subscriber

   @TC-Q034 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The referral API is triggered after successful Apple Fitness Plus Subscriber booking

  @TC-Q035 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The booking confirmation message and appointment details is displayed

   @TC-Q036 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Apple Fitness Plus Subscriber

   @TC-Q037 @REGULAR  @US @EN-CA @FR-CA @desktop
  Scenario: Pre-filled form data is retained and stored in React session storage when user submits Try us Free Apple Fitness Subscriber form
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user submits the Try us Free form again without updating any fields
    Then The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

   @TC-Q038 @REGULAR  @US @EN-CA @FR-CA @desktop
  Scenario Outline: Pre-filled form data is retained and stored in React session storage when user updates any form fields in Try us Free Apple Fitness Subscriber
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user updates the "<Field>" field and submits the Try us Free form again
    Then The prospect data for the "<Field>" field is "<UpdatedStatus>" accordingly in Try us Free
    And The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

    # title-format: Pre-filled form data is retained and stored in React session storage when user updates <Field> field in Try us Free Apple Fitness Subscriber
    Examples:
      | Field        | UpdatedStatus |
      | First Name   | Updated       |
      | Last Name    | Updated       |
      | Email        | Updated       |
      | Phone Number | Updated       |
      | Zip Code     | Updated       |

   @TC-Q039 @REGULAR   @US @EN-CA @FR-CA
  Scenario: Successfully complete a gym tour booking from location search to confirmation in apple fitness plus subscriber
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    And The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The booking confirmation message and appointment details is displayed
    And Invite a friend section is "not displayed"
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-Q001–Q039 above. These stack compatible checks to reduce navigations.
  # No @TC-* /  @REGULAR /  — smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=TryUsFreeAppleFitnessPlusSubscriber also matches these (feature-level tag inheritance).
  # Field-update matrix (TC-Q038 Examples) stays on sheet scenarios only.

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression  @desktop
  Scenario: Consolidated — Find Your Gym landing, valid search, LIST/MAP, and JOIN IN GYM form
    Then The heading and description are displayed correctly in the Apple Fitness Plus Subscriber page
    And The search box placeholder is displayed correctly in the Apple Fitness Plus Subscriber page
    And The Find Your Gym heading is displayed correctly in the Apple Fitness Plus Subscriber page
    And The Use Current Location button is visible and correct in the Apple Fitness Plus Subscriber page
    And The Let's Get You To The Right Place section is displayed correctly in the Apple Fitness Plus Subscriber page
    And The "TRY US FOR FREE" heading and description are displayed correctly in the Apple Fitness Plus Subscriber page
    When The user searches for the "Locale Based" location in the location search
    Then The system displays gym results sorted by distance
    And Only max 10 results are shown in the gym search results
    And The gym search results for that location is displayed
    And The LIST and MAP tabs switch correctly in the Apple Fitness Plus Subscriber page
    And The JOIN IN GYM button is displayed in the Apple Fitness Plus Subscriber search results
    And The Use Current Location button is visible and correct in the Apple Fitness Plus Subscriber page
    When The user selects the "Locale Based" gym from the gym search results
    Then The Apple Fitness Plus Subscriber lead form is displayed

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression @Smoke @batch-2
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms
    Then The no nearby locations error is displayed in the location search

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression 
  Scenario: Consolidated — form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The "GET STARTED TODAY" text is visible and correct on the Apple Fitness Plus Subscriber form
    And The gym location name and address are visible on the Apple Fitness Plus Subscriber form
    When The user fills the form with valid data
    Then The form fields accept valid input without validation errors in the Apple Fitness Plus Subscriber page

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated — US form disclaimers, Form Started, form_loaded, and Local Resident modal
    Given Rudderstack validation is enabled for Apple Fitness Plus Subscriber
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Apple Fitness Plus Subscriber form
    And The Lead Form Disclaimer is displayed correctly on the Apple Fitness Plus Subscriber form
    # Interact / RS / dataLayer before Local Resident modal — modal open+close is slow on WebKit
    When The user interacts with the lead form in the Apple Fitness Plus Subscriber page
    Then The Form Started Rudderstack event is triggered in Apple Fitness Plus Subscriber
    And The form_loaded data layer is triggered in Apple Fitness Plus Subscriber
    When The user opens the Local Resident pop-up modal on the Apple Fitness Plus Subscriber form
    Then The Local Resident pop-up modal content is displayed on the Apple Fitness Plus Subscriber form

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The local resident checkbox is unchecked
    And The user submits the form with empty fields
    Then The required field errors are shown for Apple Fitness Plus Subscriber form fields

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated — form invalid fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters "123$" in the first name field
    And The user enters "Test456" in the last name field
    And The user enters "john.doe@example" in the email field
    And The user enters invalid number in the phone number field
    And The user submits the form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the user form
    And The email validation error is displayed in the user form
    And The phone number validation error is displayed in the user form

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA  @Regression  @desktop
  Scenario: Consolidated — Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression 
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated — schedule page, staff_id, time slot message, empty time error, and confirm enabled
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The schedule page heading and text description are displayed for Apple Fitness Plus Subscriber
    And The staff_id is returned correctly from the Apple Fitness Plus Subscriber availabilities API
    And The time slot message is displayed in the schedule picker
    When The user selects the date in the schedule picker
    And The user leaves the time selection empty in the schedule picker
    Then The error message is displayed for the time selection field in the schedule picker
    When The user selects a date and time without submitting on the Apple Fitness Plus Subscriber schedule page
    Then The schedule confirm button is enabled on the Apple Fitness Plus Subscriber schedule page

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated — pre-filled form retained in React session storage on resubmit
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user submits the Try us Free form again without updating any fields
    Then The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Apple Fitness Plus Subscriber
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Apple Fitness Plus Subscriber
    And The lead capture form submission is successful in Apple Fitness Plus Subscriber
    When The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The form_success and tour_appointment_scheduled data layers are triggered in Apple Fitness Plus Subscriber
    And The Appointment Scheduled Rudderstack event is verified in Apple Fitness Plus Subscriber
    And The referral API is triggered after successful Apple Fitness Plus Subscriber booking
    And The booking confirmation message and appointment details is displayed
    And Invite a friend section is "not displayed"
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  # AFW-3811 — one-pass Apple Fitness+ subscriber schedule + See You Soon visit copy (Testpad #18–22). Covers TC-Q027 + TC-Q035.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-Q027 @REGULAR @TC-Q035 @REGULAR @US @EN-CA @FR-CA @Regression  @desktop
  Scenario: Consolidated — AFW-3811 Book a Visit Apple Fitness subscriber schedule and See You Soon copy
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The schedule page heading and text description are displayed for Apple Fitness Plus Subscriber
    When The user selects a date and time on the Apple Fitness Plus Subscriber schedule page
    Then The booking confirmation message and appointment details is displayed

  @TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass @US @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated — thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Plus Subscriber form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Apple Fitness Plus Subscriber
