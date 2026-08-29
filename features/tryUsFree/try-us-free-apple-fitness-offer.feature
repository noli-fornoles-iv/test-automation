@TryUsFreeAppleFitnessFreeTrialOffer
Feature: Try Us Free Apple Fitness Free Trial Offer

  # Source of truth: Try Us Free Apple Fitness Free Trial Offer Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: YES for US, AU, EN-CA
  # Checklist: .cursor/knowledge-base/scenario-checklist-try-us-free-apple-fitness-free-trial-offer.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-P00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="TryUsFreeAppleFitnessFreeTrialOffer"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass" or --grep @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US only (AU/EN-CA = FALSE).
  # Disclaimer/legal: AU and EN-CA use lead-form-disclaimer (not US residency checkboxes) — keep Examples/tags separate.

  Background: Navigate to page
    Given The user is on "Try us Free Apple Fitness Free Trial" page

  # --- Find Your Gym ---

  @TC-P001 @REGULAR   @US @AU @EN-CA @FR-CA
  Scenario: Verify Try Us Free Apple Fitness Free Trial Offer Find A Gym heading is correct
    Then The heading and description are displayed correctly in the Apple Fitness Free Trial Offer page
    And The search box placeholder is displayed correctly in the Apple Fitness Free Trial Offer page

  @TC-P002 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Apple Fitness Free Trial Offer page

  @TC-P003 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Apple Fitness Free Trial Offer page

  @TC-P004 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the location search
    Then The system displays gym results sorted by distance
    And Only max 10 results are shown in the gym search results
    And The gym search results for that location is displayed
    And The SELECT GYM button is displayed in the search results for that gym

  @TC-P005 @REGULAR   @US @AU @EN-CA @FR-CA
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms
    Then The no nearby locations error is displayed in the location search

  @TC-P006 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the location search
    Then The LIST and MAP tabs switch correctly in the Apple Fitness Free Trial Offer page
    And The SELECT GYM button is displayed in the search results for that gym

  @TC-P007 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the location search
    Then The Use Current Location button is visible and correct in the Apple Fitness Free Trial Offer page

  @TC-P008 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Apple Fitness Free Trial Offer page

  @TC-P009 @REGULAR  @US @AU @EN-CA @FR-CA
  Scenario: Verify clicking Select Gym Redirects to Events Lead Form page
    When The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Apple Fitness Free Trial Offer lead form is displayed

  @TC-P010 @REGULAR  @US @AU @EN-CA @FR-CA
  Scenario: Verify "TRY US FOR FREE" text heading and description are correct
    Then The "TRY US FOR FREE" heading and description are displayed correctly in the Apple Fitness Free Trial Offer page

  # --- Form Page ---

  @TC-P011 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify "GET STARTED TODAY" text is visible and correct
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The "GET STARTED TODAY" text is visible and correct on the Apple Fitness Free Trial Offer form

  @TC-P012 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The gym location name and address are visible on the Apple Fitness Free Trial Offer form

  @TC-P013 @REGULAR @Regression   @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Apple Fitness Free Trial Offer
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user interacts with the lead form in the Apple Fitness Free Trial Offer page
    Then The Form Started Rudderstack event is triggered in Apple Fitness Free Trial Offer

  @TC-P014 @REGULAR   @US @AU @EN-CA @FR-CA @desktop
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The local resident checkbox is unchecked
    And The user submits the form with empty fields
    Then The required field errors are shown for Apple Fitness Free Trial Offer form fields

  @TC-P015 @REGULAR   @US @AU @EN-CA @FR-CA @desktop
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

  @TC-P016 @REGULAR @US
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form

  @TC-P017 @REGULAR @US
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct marketing consent disclaimer text is displayed on the Apple Fitness Free Trial Offer form

  @TC-P018 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Lead Form Disclaimer is displayed correctly on the Apple Fitness Free Trial Offer form

  @TC-P019 @REGULAR @US @desktop
  Scenario: Verify Local Resident pop-up modal content after text link is clicked
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user opens the Local Resident pop-up modal on the Apple Fitness Free Trial Offer form
    Then The Local Resident pop-up modal content is displayed on the Apple Fitness Free Trial Offer form

  @TC-P020 @REGULAR @US @AU @EN-CA @FR-CA @desktop
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab

  @TC-P021 @REGULAR @US @AU @EN-CA @FR-CA @desktop
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab

  @TC-P022 @REGULAR @US @desktop
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

  @TC-P023 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user fills the form with valid data
    Then The form fields accept valid input without validation errors in the Apple Fitness Free Trial Offer page

  @TC-P024 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Apple Fitness Free Trial Offer
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Apple Fitness Free Trial Offer

  @TC-P025 @REGULAR   @US
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The lead capture form submission is successful in Apple Fitness Free Trial Offer

  @TC-P026 @REGULAR   @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user interacts with the lead form in the Apple Fitness Free Trial Offer page
    Then The form_loaded data layer is triggered in Apple Fitness Free Trial Offer

  # --- Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

  @TC-P027 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The schedule page heading and text description are displayed for Apple Fitness Free Trial Offer

  @TC-P028 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Time slot message is displayed when no date is selected in apple fitness free trial
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The time slot message is displayed in the schedule picker

  @TC-P029 @REGULAR  @US @AU @EN-CA @FR-CA
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects a date and time without submitting on the Apple Fitness Free Trial Offer schedule page
    Then The schedule confirm button is enabled on the Apple Fitness Free Trial Offer schedule page

  @TC-P030 @REGULAR @US @AU @EN-CA @FR-CA
  Scenario: Displays error message when the user leaves the time selection empty in schedule picker in apple fitness free trial
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects the date in the schedule picker
    And The user leaves the time selection empty in the schedule picker
    Then The error message is displayed for the time selection field in the schedule picker

  @TC-P031 @REGULAR   @US @AU @EN-CA @FR-CA
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The staff_id is returned correctly from the Apple Fitness Free Trial Offer availabilities API

  # --- Success Page ---

  @TC-P032 @REGULAR   @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The form_success and tour_appointment_scheduled data layers are triggered in Apple Fitness Free Trial Offer

  @TC-P033 @REGULAR   @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Apple Fitness Free Trial Offer
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The Appointment Scheduled Rudderstack event is verified in Apple Fitness Free Trial Offer

  @TC-P034 @REGULAR   @US @AU @EN-CA @FR-CA
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The referral API is triggered after successful Apple Fitness Free Trial Offer booking

  @TC-P035 @REGULAR   @US @AU @EN-CA @FR-CA
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The booking confirmation message and appointment details is displayed

  @TC-P036 @REGULAR   @US @AU @EN-CA @FR-CA
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Apple Fitness Free Trial Offer

  @TC-P037 @REGULAR   @iphone @US @AU @EN-CA @FR-CA
  Scenario: Successfully complete a gym tour booking from location search to confirmation in apple fitness free trial on iphone
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits and fills the form with valid data
    And The user selects a time and date in the schedule picker
    Then The booking confirmation message and appointment details is displayed
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "not displayed"
    And The button "ACTIVATE FITNESS+ OFFER" is displayed
    And The button "Download AF App" is displayed
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  @TC-P038 @REGULAR @android @US @AU @EN-CA @FR-CA
  Scenario: Successfully complete a gym tour booking from location search to confirmation in apple fitness free trial on android
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits and fills the form with valid data
    And The user selects a time and date in the schedule picker
    Then The booking confirmation message and appointment details is displayed
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "not displayed"
    And The button "Download AF App" is displayed
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  @TC-P039 @REGULAR @desktop @US @AU @EN-CA @FR-CA
  Scenario: Successfully complete a gym tour booking from location search to confirmation in apple fitness free trial on desktop
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits and fills the form with valid data
    And The user selects a time and date in the schedule picker
    Then The booking confirmation message and appointment details is displayed
    And Invite a friend section is "not displayed"
    And The QR Code "Download the AF App" is displayed
    And The QR Code "Activate Your Fitness+ Offer" is displayed
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-P001–P039 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=TryUsFreeAppleFitnessFreeTrialOffer also matches these (feature-level tag inheritance).

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression  @desktop
  Scenario: Consolidated — Find Your Gym landing, valid search, LIST/MAP, and Select Gym form
    Then The heading and description are displayed correctly in the Apple Fitness Free Trial Offer page
    And The search box placeholder is displayed correctly in the Apple Fitness Free Trial Offer page
    And The Find Your Gym heading is displayed correctly in the Apple Fitness Free Trial Offer page
    And The Use Current Location button is visible and correct in the Apple Fitness Free Trial Offer page
    And The Let's Get You To The Right Place section is displayed correctly in the Apple Fitness Free Trial Offer page
    And The "TRY US FOR FREE" heading and description are displayed correctly in the Apple Fitness Free Trial Offer page
    When The user searches for the "Locale Based" location in the location search
    Then The system displays gym results sorted by distance
    And Only max 10 results are shown in the gym search results
    And The gym search results for that location is displayed
    And The LIST and MAP tabs switch correctly in the Apple Fitness Free Trial Offer page
    And The SELECT GYM button is displayed in the search results for that gym
    And The Use Current Location button is visible and correct in the Apple Fitness Free Trial Offer page
    When The user selects the "Locale Based" gym from the gym search results
    Then The Apple Fitness Free Trial Offer lead form is displayed

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms
    Then The no nearby locations error is displayed in the location search

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression
  Scenario: Consolidated — form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The "GET STARTED TODAY" text is visible and correct on the Apple Fitness Free Trial Offer form
    And The gym location name and address are visible on the Apple Fitness Free Trial Offer form
    When The user fills the form with valid data
    Then The form fields accept valid input without validation errors in the Apple Fitness Free Trial Offer page

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated — US form disclaimers, Form Started, form_loaded, and Local Resident modal
    Given Rudderstack validation is enabled for Apple Fitness Free Trial Offer
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Apple Fitness Free Trial Offer form
    And The Lead Form Disclaimer is displayed correctly on the Apple Fitness Free Trial Offer form
    # Interact / RS / dataLayer before Local Resident modal — modal open+close is slow on WebKit
    When The user interacts with the lead form in the Apple Fitness Free Trial Offer page
    Then The Form Started Rudderstack event is triggered in Apple Fitness Free Trial Offer
    And The form_loaded data layer is triggered in Apple Fitness Free Trial Offer
    When The user opens the Local Resident pop-up modal on the Apple Fitness Free Trial Offer form
    Then The Local Resident pop-up modal content is displayed on the Apple Fitness Free Trial Offer form

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @AU @Regression 
  Scenario: Consolidated — AU Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Lead Form Disclaimer is displayed correctly on the Apple Fitness Free Trial Offer form

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @EN-CA @FR-CA @Regression 
  Scenario: Consolidated — EN-CA Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Lead Form Disclaimer is displayed correctly on the Apple Fitness Free Trial Offer form

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated — form required fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The local resident checkbox is unchecked
    And The user submits the form with empty fields
    Then The required field errors are shown for Apple Fitness Free Trial Offer form fields

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop
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

  # TC-P022 SMS is US-only — do not tag EN-CA/FR-CA here (sheet Supported Locales).
  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @Regression @desktop
  Scenario: Consolidated — US Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

  # TC-P020/P021 — Privacy + Terms for AU / EN-CA / FR-CA (no SMS).
  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @AU @EN-CA @FR-CA @Regression @desktop
  Scenario: Consolidated — Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated — schedule page, staff_id, time slot message, empty time error, and confirm enabled
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The schedule page heading and text description are displayed for Apple Fitness Free Trial Offer
    And The staff_id is returned correctly from the Apple Fitness Free Trial Offer availabilities API
    And The time slot message is displayed in the schedule picker
    When The user selects the date in the schedule picker
    And The user leaves the time selection empty in the schedule picker
    Then The error message is displayed for the time selection field in the schedule picker
    When The user selects a date and time without submitting on the Apple Fitness Free Trial Offer schedule page
    Then The schedule confirm button is enabled on the Apple Fitness Free Trial Offer schedule page

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — appointment booking, referral API, and See you soon success
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    And The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The referral API is triggered after successful Apple Fitness Free Trial Offer booking
    And The booking confirmation message and appointment details is displayed

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — US appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Apple Fitness Free Trial Offer
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Apple Fitness Free Trial Offer
    And The lead capture form submission is successful in Apple Fitness Free Trial Offer
    When The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The form_success and tour_appointment_scheduled data layers are triggered in Apple Fitness Free Trial Offer
    And The Appointment Scheduled Rudderstack event is verified in Apple Fitness Free Trial Offer
    And The referral API is triggered after successful Apple Fitness Free Trial Offer booking
    And The booking confirmation message and appointment details is displayed

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated — thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Apple Fitness Free Trial Offer

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @iphone @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — iphone booking confirmation with Fitness+ and AF App CTAs
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits and fills the form with valid data
    And The user selects a time and date in the schedule picker
    Then The booking confirmation message and appointment details is displayed
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "not displayed"
    And The button "ACTIVATE FITNESS+ OFFER" is displayed
    And The button "Download AF App" is displayed
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @android @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — android booking confirmation with AF App CTA
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits and fills the form with valid data
    And The user selects a time and date in the schedule picker
    Then The booking confirmation message and appointment details is displayed
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "not displayed"
    And The button "Download AF App" is displayed
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  @TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass @desktop @US @AU @EN-CA @FR-CA @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — desktop booking confirmation with QR codes
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits and fills the form with valid data
    And The user selects a time and date in the schedule picker
    Then The booking confirmation message and appointment details is displayed
    And Invite a friend section is "not displayed"
    And The QR Code "Download the AF App" is displayed
    And The QR Code "Activate Your Fitness+ Offer" is displayed
    And The Add to Calendar button is visible
    And Clicking Google option opens the calendar in new tab

  # AFW-3811 — one-pass Apple Fitness+ offer schedule + See You Soon visit copy (Testpad #18–22). Covers TC-P027 + TC-P035.
  @AFW-3811 @Afw3811ConsolidatedPass  @US @AU @EN-CA @FR-CA @Regression  @desktop
  Scenario: Consolidated — AFW-3811 Book a Visit Apple Fitness offer schedule and See You Soon copy
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Apple Fitness Free Trial Offer form with valid data
    Then The schedule page heading and text description are displayed for Apple Fitness Free Trial Offer
    When The user selects a date and time on the Apple Fitness Free Trial Offer schedule page
    Then The booking confirmation message and appointment details is displayed
