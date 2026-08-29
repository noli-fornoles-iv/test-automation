@TryUsFree
Feature: Try Us Free

  # Source of truth: Try Us Free Flow tab ? TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: YES for US, AE, SA, GB, IE, IN (ZA = NO)
  # Checklist: .cursor/knowledge-base/scenario-checklist-try-us-free.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-R00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="TryUsFree"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="TryUsFreeConsolidatedPass" or --grep @TryUsFreeConsolidatedPass
  #
  # Tickets:
  # - AFW-3660 ([React] Thailand Spin Up / TUF ? Testpad 27496): @AFW-3660 on TH consolidated + @Afw3660ConsolidatedPass
  # - AFW-3722 ([React] Thailand Legal Disclaimer ? Testpad 27503 primary flow): @AFW-3722 / @Afw3722ConsolidatedPass
  #   Checkbox 1/2 defaults, untick-blocks-submit, optional marketing, select/deselect, both-checked submit,
  #   Privacy/Terms/SMS, postal case-sensitivity
  # - AFW-3815 ([React] Prevent DR/PR phones on US/Canada): @AFW-3815 / @Afw3815ConsolidatedPass
  #   Blocked area codes DR 809/829/849 + PR 787/939 on @US @EN-CA @FR-CA Try Us Free only
  # - AFW-3952 ([Rudderstack] Location Searched / Location Selected): @AFW-3952 / @Afw3952ConsolidatedPass
  #   US only (Local Config Rudderstack = TRUE)
  #
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US only.
  # Schedule/Success scenarios skip when can_book_appointment does not match Notes.

  Background: Navigate to page
    Given The user is on "Try us Free" page

  # --- Find Your Gym ---

 @TC-R001 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Try Us Free Find A Gym heading is correct
    Then The heading and description are displayed correctly in the Try Us Free page
    And The search box placeholder is displayed correctly in the Try Us Free page

 @TC-R002 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Try Us Free page

 @TC-R003 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Try Us Free page

 @TC-R004 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the location search
    Then The system displays gym results sorted by distance
    And Only max 10 results are shown in the gym search results
    And The gym search results for that location is displayed
    And The SELECT GYM button is displayed in the search results for that gym

 @TC-R005 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms
    Then The no nearby locations error is displayed in the location search

 @TC-R006 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the location search
    Then The LIST and MAP tabs switch correctly in the Try Us Free page
    And The SELECT GYM button is displayed in the search results for that gym

 @TC-R007 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the location search
    Then The Use Current Location button is visible and correct in the Try Us Free page

 @TC-R008 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Try Us Free page

 @TC-R009 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking Select Gym Redirects to Events Lead Form page
    When The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Try Us Free lead form is displayed

 @TC-R010 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "TRY US FOR FREE" text heading and description are correct
    Then The "TRY US FOR FREE" heading and description are displayed correctly in the Try Us Free page

  # --- Form Page ---

 @TC-R011 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "GET STARTED TODAY" text is visible and correct
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The "GET STARTED TODAY" text is visible and correct on the Try Us Free form

 @TC-R012 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The gym location name and address are visible on the Try Us Free form

  @TC-R013 @REGULAR @Regression  @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Try Us Free
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user interacts with the lead form in the Try Us Free page
    Then The Form Started Rudderstack event is triggered in Try Us Free

 @TC-R014 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The local resident checkbox is unchecked
    And The user submits the form with empty fields
    Then The required field errors are shown for Try Us Free form fields

 @TC-R015 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
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

 @TC-R016 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form

 @TC-R017 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct marketing consent disclaimer text is displayed on the Try Us Free form

  @TC-R018 @AFW-3663 @REGULAR @IN @AE @SA @GB @IE @EN-CA @FR-CA
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Lead Form Disclaimer is displayed correctly on the Try Us Free form

  @TC-R019 @AFW-3663 @REGULAR @US @IT @NZ @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Verify Local Resident pop-up modal content after text link is clicked
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user opens the Local Resident pop-up modal on the Try Us Free form
    Then The Local Resident pop-up modal content is displayed on the Try Us Free form

 @TC-R020 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @SA @DE @AT @IT @TH @PH @SG @NZ @EN-CA @FR-CA @ZH-HK @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab

 @TC-R021 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @SA @DE @IT @TH @PH @SG @NZ @EN-CA @FR-CA @ZH-HK @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab

 @TC-R022 @AFW-3663 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @TH @ZH-HK @PH @SG @NZ @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

 @TC-R023 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user fills the form with valid data
    Then The form fields accept valid input without validation errors in the Try Us Free page

  @TC-R024 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Try Us Free
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Try Us Free

  @TC-R025 @REGULAR  @US
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The lead capture form submission is successful in Try Us Free

  @TC-R026 @REGULAR  @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user interacts with the lead form in the Try Us Free page
    Then The form_loaded data layer is triggered in Try Us Free

  # --- Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

 @TC-R027 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The schedule page heading and text description are displayed for Try Us Free

 @TC-R028 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    And The user selects a date and time without submitting on the Try Us Free schedule page
    Then The schedule confirm button is enabled on the Try Us Free schedule page

 @TC-R029 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message when the user leaves the date selection empty in schedule picker
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    And The user fills the form with valid data
    And The user submits the form
    When The user leaves the date selection empty in the schedule picker
    Then The error message is displayed for the date selection field in the scheduler picker

 @TC-R030 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message when the user leaves the time selection empty in schedule picker
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    And The user fills the form with valid data
    And The user submits the form
    When The user selects the date in the schedule picker
    And The user leaves the time selection empty in the schedule picker
    Then The error message is displayed for the time selection field in the schedule picker

 @TC-R031 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Time slot message is displayed when no date is selected
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    And The user fills the form with valid data
    When The user submits the form
    Then The time slot message is displayed in the schedule picker

 @TC-R032 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The staff_id is returned correctly from the Try Us Free availabilities API

  # --- Success Page ---

  @TC-R033 @REGULAR  @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    And The user selects a date and time on the Try Us Free schedule page
    Then The form_success and tour_appointment_scheduled data layers are triggered in Try Us Free

  @TC-R034 @REGULAR  @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Try Us Free
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    And The user selects a date and time on the Try Us Free schedule page
    Then The Appointment Scheduled Rudderstack event is verified in Try Us Free

 @TC-R035 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    And The user selects a date and time on the Try Us Free schedule page
    Then The referral API is triggered after successful Try Us Free booking

 @TC-R036 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    And The user selects a date and time on the Try Us Free schedule page
    Then The booking confirmation message and appointment details is displayed

 @GB @IE. @TC-R037 @AFW-3663 @REGULAR @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
 # AFW-3607: EN-GB / EN-IE Try Us Free retired (301 → BAT) — thank-you-when-not-bookable N/A; exclude @GB @IE.
 # AFW-3607: EN-GB / EN-IE Try Us Free retired (301 → BAT) — thank-you-when-not-bookable N/A; exclude @GB @IE. @AFW-3659 @EN-MY
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Try Us Free
    And The social media icons are displayed on the Thank You page for Try Us Free

  @TC-R038 @REGULAR @US   @desktop
  Scenario: Pre-filled form data is retained and stored in React session storage when user submits Try Us Free form
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user submits the Try us Free form again without updating any fields
    Then The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

  @TC-R039 @REGULAR @US   @desktop
  Scenario Outline: Pre-filled form data is retained and stored in React session storage when user updates any form fields in Try Us Free
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user updates the "<Field>" field and submits the Try us Free form again
    Then The prospect data for the "<Field>" field is "<UpdatedStatus>" accordingly in Try us Free
    And The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

    # title-format: Pre-filled form data is retained and stored in React session storage when user updates <Field> field in Try Us Free
    Examples:
      | Field        | UpdatedStatus |
      | First Name   | Updated       |
      | Last Name    | Updated       |
      | Email        | Updated       |
      | Phone Number | Updated       |

  # Zip/postcode may be omitted on the revisited lead form for IE.
  @TC-R039 @REGULAR @US  @desktop
  Scenario Outline: Pre-filled form data is retained and stored in React session storage when user updates zip code in Try Us Free
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user updates the "<Field>" field and submits the Try us Free form again
    Then The prospect data for the "<Field>" field is "<UpdatedStatus>" accordingly in Try us Free
    And The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

    # title-format: Pre-filled form data is retained and stored in React session storage when user updates <Field> field in Try Us Free
    Examples:
      | Field    | UpdatedStatus |
      | Zip Code | Updated       |

  @TC-R040 @REGULAR @AE @SA @IN @desktop
  Scenario: Pre-fill is not implemented on Try us Free when BAT is enabled on a locale
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The user navigates back to Try us Free user form
    Then The form fields are not pre-filled with the prospect details upon revisiting the Try us Free form

  @TC-R041 @REGULAR @US  
  Scenario: User form retains data on reload after navigating back from schedule picker in Try us Free
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user refreshes the page
    Then The form fields retain the previously entered data after page reload in the Try us Free

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-R001?R041 above. These stack compatible checks to reduce navigations.
  # No @TC-* / /  ? smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="TryUsFreeConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=TryUsFree also matches these (feature-level tag inheritance).
  # Field-update matrices (TC-R039 Examples) stay on sheet scenarios only.

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? Find Your Gym landing, valid search, LIST/MAP, and Select Gym form
    Then The heading and description are displayed correctly in the Try Us Free page
    And The search box placeholder is displayed correctly in the Try Us Free page
    And The Find Your Gym heading is displayed correctly in the Try Us Free page
    And The Use Current Location button is visible and correct in the Try Us Free page
    And The Let's Get You To The Right Place section is displayed correctly in the Try Us Free page
    And The "TRY US FOR FREE" heading and description are displayed correctly in the Try Us Free page
    When The user searches for the "Locale Based" location in the location search
    Then The system displays gym results sorted by distance
    And Only max 10 results are shown in the gym search results
    And The gym search results for that location is displayed
    And The LIST and MAP tabs switch correctly in the Try Us Free page
    And The SELECT GYM button is displayed in the search results for that gym
    And The Use Current Location button is visible and correct in the Try Us Free page
    When The user selects the "Locale Based" gym from the gym search results
    Then The Try Us Free lead form is displayed

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @AFW-3659 @EN-MY
  Scenario: Consolidated ? no nearby gym search
    When The user searches for a location with no nearby gyms
    Then The no nearby locations error is displayed in the location search

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The "GET STARTED TODAY" text is visible and correct on the Try Us Free form
    And The gym location name and address are visible on the Try Us Free form
    When The user fills the form with valid data
    Then The form fields accept valid input without validation errors in the Try Us Free page

  @TryUsFreeConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated ? US form disclaimers, Form Started, and form_loaded
    Given Rudderstack validation is enabled for Try Us Free
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Try Us Free form
    When The user interacts with the lead form in the Try Us Free page
    Then The Form Started Rudderstack event is triggered in Try Us Free
    And The form_loaded data layer is triggered in Try Us Free

  # Local Resident modal is its own scenario ? stacking after RS/form_loaded exceeds WebKit suite budget.
  @TryUsFreeConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated ? US Local Resident modal
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user opens the Local Resident pop-up modal on the Try Us Free form
    Then The Local Resident pop-up modal content is displayed on the Try Us Free form

  @TryUsFreeConsolidatedPass @DE @AT @Regression 
  Scenario: Consolidated ? DE/AT form disclaimers
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Try Us Free form

 @TryUsFreeConsolidatedPass @IT @Regression @desktop
  Scenario: Consolidated ? IT form disclaimers and Local Resident modal
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Try Us Free form
    When The user opens the Local Resident pop-up modal on the Try Us Free form
    Then The Local Resident pop-up modal content is displayed on the Try Us Free form

  # AFW-3722 TH ? Checkbox 1 (pre-checked/required) + Checkbox 2 (unchecked/optional) + disclaimer text.
  # Local Resident modal is US/IT only (not TH). Legal links: see Afw3722ConsolidatedPass below.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 1/2 defaults and form disclaimers
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then Checkbox 1 residency consent is pre-checked on the Try Us Free form
    And Checkbox 2 marketing consent is unchecked by default on the Try Us Free form
    And The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Try Us Free form

  # AFW-3722 ? untick required Checkbox 1 blocks submit (Testpad 27503).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 1 untick blocks Try Us Free submit
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user fills the form with valid data
    And The local resident checkbox is unchecked
    And The user submits the form
    Then The Try Us Free form blocks submit after unticking Checkbox 1

  # AFW-3722 ? Checkbox 2 optional: submit succeeds while marketing stays unchecked.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 2 optional submit without marketing consent
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then Checkbox 2 marketing consent is unchecked by default on the Try Us Free form
    When The user submits the Try Us Free form with valid data
    Then The schedule page heading and text description are displayed for Try Us Free
    And The thank-you screen is displayed when appointment booking is not allowed for Try Us Free
    And The social media icons are displayed on the Thank You page for Try Us Free

  # AFW-3722 Testpad ? Checkbox 2 can be selected and deselected.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Checkbox 2 select and deselect
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then Checkbox 2 marketing consent is unchecked by default on the Try Us Free form
    When The user checks Checkbox 2 marketing consent on the Try Us Free form
    Then Checkbox 2 marketing consent is checked on the Try Us Free form
    When The user unchecks Checkbox 2 marketing consent on the Try Us Free form
    Then Checkbox 2 marketing consent is unchecked on the Try Us Free form

  # AFW-3722 Testpad ? submit succeeds when both Checkbox 1 and Checkbox 2 are selected.
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH submit with both Checkbox 1 and Checkbox 2 checked
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then Checkbox 1 residency consent is pre-checked on the Try Us Free form
    When The user checks Checkbox 2 marketing consent on the Try Us Free form
    Then Checkbox 2 marketing consent is checked on the Try Us Free form
    When The user submits the Try Us Free form with valid data
    Then The schedule page heading and text description are displayed for Try Us Free
    And The thank-you screen is displayed when appointment booking is not allowed for Try Us Free
    And The social media icons are displayed on the Thank You page for Try Us Free

  # AFW-3660 Testpad ? postal case-sensitivity when Local Config zip has letters; soft-skip for digit-only (TH).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? TH Try Us Free postal code case-sensitivity when applicable
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Try Us Free postal code field is case-insensitive when applicable

  @TryUsFreeConsolidatedPass @IN @AE @SA   @Regression @Smoke @batch-2
  Scenario: Consolidated ? Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Lead Form Disclaimer is displayed correctly on the Try Us Free form

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form required fields
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The local resident checkbox is unchecked
    And The user submits the form with empty fields
    Then The required field errors are shown for Try Us Free form fields

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form invalid fields
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

  @TryUsFreeConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated ? US Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @TryUsFreeConsolidatedPass @AFW-3663 @SA @DE @IT @TH @PH @SG @NZ @EN-CA @FR-CA @ZH-HK @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab

  # AFW-3722 TH ? Privacy + Terms + Text Messaging Terms (Testpad Checkbox 1 links).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @NZ @Regression @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? TH Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab
    When The user clicks the "Terms & Conditions" link
    Then The link is opened in a new tab
    When The user clicks the "Text Messaging Terms" link
    Then The link is opened in a new tab

  @TryUsFreeConsolidatedPass @AT @Regression   @desktop
  Scenario: Consolidated ? Privacy legal link opens in a new tab
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user clicks the "Privacy Notice" link
    Then The link is opened in a new tab

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated ? schedule page, staff_id, empty date/time errors, time slot message, and confirm enabled
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The schedule page heading and text description are displayed for Try Us Free
    And The staff_id is returned correctly from the Try Us Free availabilities API
    And The time slot message is displayed in the schedule picker
    When The user leaves the date selection empty in the schedule picker
    Then The error message is displayed for the date selection field in the scheduler picker
    When The user selects the date in the schedule picker
    And The user leaves the time selection empty in the schedule picker
    Then The error message is displayed for the time selection field in the schedule picker
    When The user selects a date and time without submitting on the Try Us Free schedule page
    Then The schedule confirm button is enabled on the Try Us Free schedule page

  @TryUsFreeConsolidatedPass @US   @Regression @desktop
  Scenario: Consolidated ? pre-filled form retained in React session storage
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user submits the Try us Free form again without updating any fields
    Then The prospect ID and prospect data is not present in webflow session storage
    And The prospect data is present in React session storage

  # Reload retention is its own scenario ? stacking two revisit+submit cycles exceeds the 10m suite budget.
  @TryUsFreeConsolidatedPass @US   @Regression @desktop
  Scenario: Consolidated ? form retains data after reload
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The form fields are pre-filled with the same prospect details upon revisiting the Try us Free form
    And The user refreshes the page
    Then The form fields retain the previously entered data after page reload in the Try us Free

  @TryUsFreeConsolidatedPass @AE @SA @IN @Regression @desktop
  Scenario: Consolidated ? pre-fill is not implemented when BAT is enabled
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters details and submits the Try us Free form
    And The user navigates back to Try us Free user form
    Then The form fields are not pre-filled with the prospect details upon revisiting the Try us Free form

 @TryUsFreeConsolidatedPass @AFW-3663 @AFW-3661 @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated ? appointment booking, referral API, and See you soon success
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    And The user selects a date and time on the Try Us Free schedule page
    Then The referral API is triggered after successful Try Us Free booking
    And The booking confirmation message and appointment details is displayed

  @TryUsFreeConsolidatedPass @US @Regression @Smoke @batch-2 @desktop
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated ? US appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Try Us Free
    And The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Try Us Free
    And The lead capture form submission is successful in Try Us Free
    When The user selects a date and time on the Try Us Free schedule page
    Then The form_success and tour_appointment_scheduled data layers are triggered in Try Us Free
    And The Appointment Scheduled Rudderstack event is verified in Try Us Free
    And The referral API is triggered after successful Try Us Free booking
    And The booking confirmation message and appointment details is displayed

  # AFW-3811 ? one-pass TUF schedule + See You Soon visit copy (Testpad #18?22). Covers TC-R027 + TC-R036.
 @AFW-3811 @Afw3811ConsolidatedPass @AFW-3663 @AFW-3661 @TC-R027 @REGULAR @TC-R036 @US @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? AFW-3811 Book a Visit Try Us Free schedule and See You Soon copy
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The schedule page heading and text description are displayed for Try Us Free
    When The user selects a date and time on the Try Us Free schedule page
    Then The booking confirmation message and appointment details is displayed

 @GB @IE. @AFW-3993 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @TryUsFreeConsolidatedPass @AFW-3663 @US @IN @AE @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
 # AFW-3607: EN-GB / EN-IE Try Us Free retired — skip thank-you-when-not-bookable for @GB @IE.
 # AFW-3607: EN-GB / EN-IE Try Us Free retired — skip thank-you-when-not-bookable for @GB @IE. @AFW-3659 @EN-MY
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated ? thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user submits the Try Us Free form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Try Us Free
    And The social media icons are displayed on the Thank You page for Try Us Free

  # AFW-3660 Try Us Free (Testpad 27496) TH spin-up ? one-pass: landing ? search ? form ? submit.
  # Run: $env:FEATURE="Afw3660ConsolidatedPass"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @AFW-3660 @AFW-3657 @AFW-3658 @Afw3660ConsolidatedPass @AFW-3663 @TryUsFreeConsolidatedPass @TH @ZH-HK @PH @SG @Regression @Smoke @batch-2 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? AFW-3660 TH Try Us Free spin-up
    Then The heading and description are displayed correctly in the Try Us Free page
    And The search box placeholder is displayed correctly in the Try Us Free page
    And The Find Your Gym heading is displayed correctly in the Try Us Free page
    When The user searches for the "Locale Based" location in the location search
    Then The gym search results for that location is displayed
    And The SELECT GYM button is displayed in the search results for that gym
    When The user selects the "Locale Based" gym from the gym search results
    Then The Try Us Free lead form is displayed
    And The "GET STARTED TODAY" text is visible and correct on the Try Us Free form
    And Checkbox 1 residency consent is pre-checked on the Try Us Free form
    And Checkbox 2 marketing consent is unchecked by default on the Try Us Free form
    When The user submits the Try Us Free form with valid data
    Then The schedule page heading and text description are displayed for Try Us Free
    And The thank-you screen is displayed when appointment booking is not allowed for Try Us Free
    And The social media icons are displayed on the Thank You page for Try Us Free

  # --- AFW-3952: Location Searched / Location Selected Rudderstack (US only ? Local Config Rudderstack TRUE) ---
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-3952
  # Run: $env:FEATURE="AFW-3952"; $env:TAG="US"; $env:NODE_ENV="SIT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires on successful Try Us Free location search
    Given Rudderstack validation is enabled for Try Us Free
    When The user searches for the "Locale Based" location in the location search
    Then The Location Searched Rudderstack event is triggered for "Try Us Free" with search success "true"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Searched fires with search_success false for invalid Try Us Free search
    Given Rudderstack validation is enabled for Try Us Free
    When The user searches an invalid location in the location search
    Then The Location Searched Rudderstack event is triggered for "Try Us Free" with search success "false"

  @AFW-3952 @US @desktop @Regression
  Scenario: Verify Location Selected fires when Select Gym is clicked on Try Us Free
    Given Rudderstack validation is enabled for Try Us Free
    When The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    Then The Location Selected Rudderstack event is triggered for "Try Us Free"

  @AFW-3952 @Afw3952ConsolidatedPass @US @desktop @Regression
  Scenario: Consolidated ? AFW-3952 Try Us Free Location Searched and Location Selected
    Given Rudderstack validation is enabled for Try Us Free
    When The user searches an invalid location in the location search
    Then The Location Searched Rudderstack event is triggered for "Try Us Free" with search success "false"
    When The user searches for the "Locale Based" location in the location search
    Then The Location Searched Rudderstack event is triggered for "Try Us Free" with search success "true"
    When The user selects the "Locale Based" gym from the gym search results
    Then The Location Selected Rudderstack event is triggered for "Try Us Free"

  # --- AFW-3303 Page view lead_funnel_viewed (US Rudderstack) ---
  @AFW-3303 @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed true on Try Us Free
    Given Rudderstack validation is enabled for Try Us Free
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Try Us Free" with lead_funnel_viewed "true"

  # --- AFW-3815: Block Dominican Republic + Puerto Rico NANP phones on US/Canada ---
  # SoT: Abby Jira comment ? only listed coverage. FEATURE="AFW-3815" or "Afw3815ConsolidatedPass"
  # Blocked numbers are ticket Examples (not Local Config). Valid accept uses Local Config Valid.Default.

  @AFW-3815 @PhoneNumber @US @EN-CA @FR-CA @desktop @Regression
  Scenario Outline: Rejects Dominican Republic and Puerto Rico phone numbers on Try Us Free
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters blocked NANP phone "<phone>" via "type" on the Try Us Free form
    And The user submits the form
    Then The phone number validation error is displayed in the user form

    # title-format: Rejects <region> area code <areaCode> phone on Try Us Free
    Examples:
      | region              | areaCode | phone      |
      | Dominican Republic  | 809      | 8095551212 |
      | Dominican Republic  | 829      | 8295551212 |
      | Dominican Republic  | 849      | 8495551212 |
      | Puerto Rico         | 787      | 7875551212 |
      | Puerto Rico         | 939      | 9395551212 |

  @AFW-3815 @PhoneNumber @US @EN-CA @FR-CA @desktop @Regression
  Scenario Outline: Rejects Dominican Republic phone via input method variations on Try Us Free
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters blocked NANP phone "<phone>" via "<inputMode>" on the Try Us Free form
    And The user submits the form
    Then The phone number validation error is displayed in the user form

    # title-format: Rejects DR phone <phone> via <inputMode> on Try Us Free
    Examples:
      | inputMode | phone         |
      | type      | 8095551212    |
      | paste     | 8095551212    |
      | type      | +18095551212  |
      | paste     | +18095551212  |

  @AFW-3815 @PhoneNumber @US @EN-CA @FR-CA @desktop @Regression
  Scenario: Accepts valid Local Config phone number on Try Us Free for US and Canada
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user autofills the phone number field
    And The user submits the form
    Then The phone number field is accepted in the user form

  @AFW-3815 @Afw3815ConsolidatedPass @PhoneNumber @US @EN-CA @FR-CA @desktop @Regression
  Scenario: Consolidated ? AFW-3815 DR/PR reject and valid US/Canada phone accept
    Given The user searches for the "Locale Based" location in the location search
    And The user selects the "Locale Based" gym from the gym search results
    When The user enters blocked NANP phone "8095551212" via "type" on the Try Us Free form
    And The user submits the form
    Then The phone number validation error is displayed in the user form
    When The user enters blocked NANP phone "7875551212" via "paste" on the Try Us Free form
    And The user submits the form
    Then The phone number validation error is displayed in the user form
    When The user autofills the phone number field
    And The user submits the form
    Then The phone number field is accepted in the user form

  # Untranslated-text scan (CLD3 ? lexicon ? optional Cursor AI). Same pipeline as Contact Us / Events Promo / MI.
  # Run: $env:FEATURE="UntranslatedTextScan"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @UntranslatedTextScan @TryUsFree @TH @AFW-3663 @ZH-HK @SA @DE @AT @IT @desktop @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated ? scan Try Us Free Find Gym ? form ? post-submit for untranslated copy
    When The user collects visible Try Us Free copy for untranslated-text scan at stage "landing"
    And The user searches for the "Locale Based" location in the location search
    When The user collects visible Try Us Free copy for untranslated-text scan at stage "results"
    And The user selects the "Locale Based" gym from the gym search results
    Then The Try Us Free lead form is displayed
    When The user collects visible Try Us Free copy for untranslated-text scan at stage "form"
    And The user submits the Try Us Free form with valid data
    When The user collects visible Try Us Free copy for untranslated-text scan at stage "post-submit"
    Then The collected Try Us Free flow copy matches the locale language
