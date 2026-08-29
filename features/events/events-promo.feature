@EventsPromo
Feature: Events Promo

  # Source of truth: Events Promo Flow tab ? TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit?gid=1966442673#gid=1966442673
  # Coverage: Events Promo YES for US, AU, ZA, IN, DE (and AT/IT when onboarded)
  # Checklist: .cursor/knowledge-base/scenario-checklist-events-promo.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-E00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="EventsPromo"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="EventsPromoConsolidatedPass" or --grep @EventsPromoConsolidatedPass
  #
  # Tickets:
  # - AFW-3660 ([React] Thailand Spin Up / Events ? Testpad 27496 Events section): @AFW-3660 on TH consolidated + @Afw3660ConsolidatedPass
  # - AFW-3722 ([React] Thailand Legal Disclaimer): Tickets tab lists MI+TUF; Events Promo TH SIT form
  #   has Checkbox 1 (pre-checked/required) + Checkbox 2 (unchecked/optional) + Privacy/Terms ?
  #   covered via @AFW-3722 / @Afw3722ConsolidatedPass (Flow tab TC-E017 still omits TH; live UI has Checkbox 1)
  # - AFW-3731 ([React] Hong Kong Legal Disclaimer): Testpad 27691 Events section — dual disclaimer on
  #   /zh-hk/events/promo (Coverage NO for full Events Promo regression; ticket-scoped @ZH-HK on disclaimer TCs only)
  # - AFW-3989 (Canada national Join for $1 Fall Membership): @AFW-3989 EN-CA Events Promo hero + lead source
  # - AFW-3440 (Lead source code normalize on submit): @AFW-3440 US + SG Events Promo matrix
  #
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US only (DE/AU/ZA/IN = FALSE ? do not validate RS/DL).
  # CTA on search results is CLAIM OFFER (sheet "Free Trial Pass" wording is legacy copy).

  Background: Navigate to Events Promo
    Given The user is on "Events Promo" page

  # --- Events Promo Find Your Gym ---

 @TC-E001 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Events Promo Find A Gym  heading and description are correct
    Then The heading and description are displayed correctly in the Events Promo page
    And The search box placeholder is displayed correctly in the Events Promo page

 @TC-E002 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Events Promo page

 @TC-E003 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Events Promo page

 @TC-E004 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The GYM DETAILS and CLAIM OFFER buttons are displayed in the Events page search results for that gym

 @TC-E005 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

 @TC-E006 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the Events page location search
    Then The LIST and MAP tabs switch correctly in the Events Promo page
    And The GYM DETAILS and CLAIM OFFER buttons are displayed in the Events page search results for that gym

 @TC-E007 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Use Current Location button is visible and correct in the Events Promo page

 @TC-E008 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Events Promo page

 @TC-E009 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking Free Trial Pass shows the Events Lead Form page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo lead form is displayed

 @TC-E010 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking Gym Details redirects to the Gym details page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

 @TC-E011 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "GET STARTED NOW." text heading and description are correct
    Then The "GET STARTED NOW." heading and description are displayed correctly in the Events Promo page

  # --- Events Promo Form Page ---

 @TC-E012 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "TELL US ABOUT YOU" text is visible and correct
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Promo form

 @TC-E013 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Gym Location data is correct and visible
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The gym location name and address are visible on the Events Promo form

  @TC-E014 @REGULAR @Regression   @US @AFW-3957 @AFW-3434 @desktop
  Scenario: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Events Promo
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user interacts with the lead form in the Events Promo page
    Then The Form Started Rudderstack event is triggered in Events Promo

  # --- AFW-3303 Page view lead_funnel_viewed (US Rudderstack) ---
  @AFW-3303 @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed true on Events Promo
    Given Rudderstack validation is enabled for Events Promo
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Events Promo" with lead_funnel_viewed "true"

 @TC-E015 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Verify form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the GET STARTED button in the Events Promo page form with empty fields
    Then The required field error is shown for all input fields in the Events page

 @TC-E016 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Verify form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user clicks the GET STARTED button in the Events Promo page form with empty fields
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @TC-E017 @REGULAR @AFW-3731 @US @DE @AT @IT @EN-CA @FR-CA @ZH-HK @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify checkbox disclaimer residency text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form

 @TC-E018 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @EN-CA @FR-CA @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify checkbox disclaimer marketing text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct marketing consent disclaimer text is displayed on the Events Promo form

  @TC-E019 @REGULAR @AU @IN
  Scenario: Verify Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct disclaimer text is displayed in the Events User form

  @TC-E020 @REGULAR @ZA
  Scenario: Verify checkbox local resident text
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form

  @TC-E021 @REGULAR @US @ZA @IT  @desktop
  Scenario: Verify Local Resident pop-up modal content after text link is clicked
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user opens the Local Resident pop-up modal on the Events Promo form
    Then The Local Resident pop-up modal content is displayed on the Events Promo form

 @TC-E022 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @AU @DE @AT @IT @TH @ZH-HK @PH @SG @NZ @EN-CA @FR-CA @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify Privacy Policy text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page

 @TC-E023 @REGULAR @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @US @AU @DE @IT @TH @ZH-HK @PH @SG @NZ @EN-CA @FR-CA @desktop @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Verify Terms of Use text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @TC-E024 @REGULAR @US @desktop
  Scenario: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Text Messaging Terms" link in the Events page
    Then The link is opened in a new tab in the Events page

 @TC-E025 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify valid input field values
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Promo page

  @TC-E026 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Events Promo
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Events Promo

  @TC-E027 @REGULAR   @US
  Scenario: Verify Lead Capture lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The lead capture form submission is successful in Events Promo

  @TC-E028 @REGULAR   @US
  Scenario: Verify form_loaded data layer is triggered
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user interacts with the lead form in the Events Promo page
    Then The form_loaded data layer is triggered in Events Promo

  # --- Events Promo Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

 @TC-E029 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify schedule page heading and text description
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Promo

 @TC-E030 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time without submitting on the Events Promo schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Promo schedule page

 @TC-E031 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The staff_id is returned correctly from the Events Promo availabilities API

  # --- Events Promo Success Page ---

  @TC-E032 @REGULAR   @US
  Scenario: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Events Promo

  @TC-E033 @REGULAR   @US
  Scenario: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Events Promo
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Appointment Scheduled Rudderstack event is verified in Events Promo

 @TC-E034 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that the referral API is triggered after a successful lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Promo booking

 @TC-E035 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "See you soon" success page after successful appointment schedule
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The Events booking confirmation message and appointment details is displayed

 @TC-E036 @REGULAR @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "Thank you" page after lead form submission
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Promo

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-E001?E036 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="EventsPromoConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=EventsPromo also matches these (feature-level tag inheritance).

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @desktop @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated ? Find Your Gym landing, valid search, LIST/MAP, and CLAIM OFFER form
    Then The heading and description are displayed correctly in the Events Promo page
    And The search box placeholder is displayed correctly in the Events Promo page
    And The Find Your Gym heading is displayed correctly in the Events Promo page
    And The Use Current Location button is visible and correct in the Events Promo page
    And The Let's Get You To The Right Place section is displayed correctly in the Events Promo page
    And The "GET STARTED NOW." heading and description are displayed correctly in the Events Promo page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The LIST and MAP tabs switch correctly in the Events Promo page
    And The GYM DETAILS and CLAIM OFFER buttons are displayed in the Events page search results for that gym
    And The Use Current Location button is visible and correct in the Events Promo page
    When The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo lead form is displayed

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated ? no nearby gym search
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated ? Gym Details redirects to local gym page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the GYM DETAILS button for the gym in the Events page
    Then The user should be redirected to its local gym page

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated ? form chrome and valid input without submit
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The "TELL US ABOUT YOU" text is visible and correct on the Events Promo form
    And The gym location name and address are visible on the Events Promo form
    When The user fills the form with valid data in the Events page
    Then The form fields accept valid input without validation errors in the Events Promo page

  @EventsPromoConsolidatedPass @US @desktop @Regression 
  Scenario: Consolidated ? US form disclaimers, Form Started, form_loaded, and Local Resident modal
    Given Rudderstack validation is enabled for Events Promo
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Events Promo form
    # Interact / RS / dataLayer before Local Resident modal ? modal open+close is slow on WebKit
    When The user interacts with the lead form in the Events Promo page
    Then The Form Started Rudderstack event is triggered in Events Promo
    And The form_loaded data layer is triggered in Events Promo
    When The user opens the Local Resident pop-up modal on the Events Promo form
    Then The Local Resident pop-up modal content is displayed on the Events Promo form

  @EventsPromoConsolidatedPass @DE @AT
  Scenario: Consolidated ? DE/AT form disclaimers  @Regression 
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Events Promo form

 @EventsPromoConsolidatedPass @IT @desktop
  Scenario: Consolidated ? IT form disclaimers and Local Resident modal
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Events Promo form
    When The user opens the Local Resident pop-up modal on the Events Promo form
    Then The Local Resident pop-up modal content is displayed on the Events Promo form

  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @EventsPromoConsolidatedPass @TH @ZH-HK @PH @SG @NZ @desktop @Regression @AFW-3659 @AFW-3629 @EN-MY
  # TH/PH/SG/NZ/ZH-HK: dual legal Checkbox 1 (pre-checked) + Checkbox 2 (marketing, unchecked).
  # AFW-3722 / AFW-3731 Checkbox states. ZH-HK: zipCodeField false; no Local Resident modal.
  # TH: SIT Events Promo shows Checkbox 1 (legal, pre-checked) + Checkbox 2 (marketing, unchecked) + zip.
  # AFW-3722 Checkbox states + AFW-3660 Events spin-up.
  Scenario: Consolidated ? TH Checkbox 1/2 defaults and marketing disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then Checkbox 1 residency consent is pre-checked on the Events Promo form
    And Checkbox 2 marketing consent is unchecked by default on the Events Promo form
    And The correct marketing consent disclaimer text is displayed on the Events Promo form
    And The correct local resident disclaimer text is displayed in the user form

  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @EventsPromoConsolidatedPass @TH @ZH-HK @PH @SG @NZ @desktop @Regression @AFW-3659 @AFW-3629 @EN-MY
  # AFW-3722 / AFW-3731 ? untick required Checkbox 1 blocks submit (Testpad 27503 / 27691).
  # AFW-3722 ? untick required Checkbox 1 blocks submit (Testpad 27503).
  Scenario: Consolidated ? TH Checkbox 1 untick blocks Events Promo submit
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user fills the form with valid data in the Events page
    And The local resident checkbox is unchecked on the Events Promo form
    And The user clicks the GET STARTED button in the Events Promo page form
    Then The Events Promo form blocks submit after unticking Checkbox 1

  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @EventsPromoConsolidatedPass @TH @ZH-HK @PH @SG @NZ @desktop @Regression @AFW-3659 @AFW-3629 @EN-MY
  # AFW-3722 / AFW-3731 ? Checkbox 2 optional: submit succeeds while marketing stays unchecked.
  # AFW-3722 ? Checkbox 2 optional: submit succeeds while marketing stays unchecked.
  Scenario: Consolidated ? TH Checkbox 2 optional submit without marketing consent
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then Checkbox 2 marketing consent is unchecked by default on the Events Promo form
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Promo
    And The thank-you screen is displayed when appointment booking is not allowed for Events Promo

  # AFW-3660 Testpad ? postal case-sensitivity when Local Config zip has letters; soft-skip for digit-only (TH).
  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @TH @PH @SG @NZ @ID @EN-CA @FR-CA @desktop @Regression @AFW-3659 @EN-MY
  Scenario: Consolidated ? TH Events Promo postal code case-sensitivity when applicable
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo postal code field is case-insensitive when applicable

  @EventsPromoConsolidatedPass @AU @IN @Regression 
  Scenario: Consolidated ? Lead Form Disclaimer
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct disclaimer text is displayed in the Events User form

  @EventsPromoConsolidatedPass @ZA @desktop @Regression @Smoke @batch-1
  Scenario: Consolidated ? ZA local resident disclaimer and Local Resident modal
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The correct local resident disclaimer text is displayed in the user form
    When The user opens the Local Resident pop-up modal on the Events Promo form
    Then The Local Resident pop-up modal content is displayed on the Events Promo form

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? form required fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the GET STARTED button in the Events Promo page form with empty fields
    Then The required field error is shown for all input fields in the Events page

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @desktop @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated ? form invalid fields
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user enters "123$" in the first name field in the Events page
    And The user enters "Test456" in the last name field in the Events page
    And The user enters "john.doe@example" in the email field in the Events page
    And The user enters invalid number in the phone number field in the Events page
    And The user clicks the GET STARTED button in the Events Promo page form with empty fields
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Events page
    And The email validation error is displayed in the Events page
    And The phone number validation error is displayed in the Events page

  @EventsPromoConsolidatedPass @AFW-3731 @US @ZH-HK @desktop @Regression @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? US Privacy, Terms, and SMS legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Text Messaging Terms" link in the Events page
    Then The link is opened in a new tab in the Events page

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @EventsPromoConsolidatedPass @AU @DE @IT @TH @ZH-HK @PH @SG @NZ @EN-CA @FR-CA @desktop @Regression @AFW-3659 @AFW-3629 @EN-MY
  Scenario: Consolidated ? Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @AFW-3722 @AFW-3731 @AFW-3705 @AFW-3628 @Afw3722ConsolidatedPass @EventsPromoConsolidatedPass @TH @ZH-HK @PH @SG @NZ @desktop @Regression @AFW-3659 @AFW-3629 @EN-MY
  # AFW-3722 / AFW-3731 — Privacy + Terms (Testpad Checkbox 1 legal links; SMS covered for ZH-HK via Privacy+Terms+SMS scenario).
  # AFW-3722 TH ? Privacy + Terms (Testpad Checkbox 1 legal links; SMS TC-E024 is US-only on Events Promo).
  Scenario: Consolidated ? TH Privacy and Terms legal links open in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page
    When The user clicks the "Terms & Conditions" link in the Events page
    Then The link is opened in a new tab in the Events page

  @EventsPromoConsolidatedPass @AT @desktop @Regression 
  Scenario: Consolidated ? Privacy legal link opens in a new tab
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user clicks the "Privacy Notice" link in the Events page
    Then The link is opened in a new tab in the Events page

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated ? schedule page, staff_id, and LET'S DO THIS enabled
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Promo
    And The staff_id is returned correctly from the Events Promo availabilities API
    When The user selects a date and time without submitting on the Events Promo schedule page
    Then The "LET'S DO THIS" button is enabled on the Events Promo schedule page

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated ? appointment booking, referral API, and See you soon success
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    And The user selects a date and time in the Events page schedule picker
    Then The referral API is triggered after successful Events Promo booking
    And The Events booking confirmation message and appointment details is displayed

  @EventsPromoConsolidatedPass @US @Regression @Smoke @batch-1
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated ? US appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for Events Promo
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Events Promo
    And The lead capture form submission is successful in Events Promo
    When The user selects a date and time in the Events page schedule picker
    Then The form_success and tour_appointment_scheduled data layers are triggered in Events Promo
    And The Appointment Scheduled Rudderstack event is verified in Events Promo
    And The referral API is triggered after successful Events Promo booking
    And The Events booking confirmation message and appointment details is displayed

 @AFW-3660 @AFW-3661 @AFW-3657 @AFW-3658 @EventsPromoConsolidatedPass @US @AU @ZA @IN @DE @AT @IT @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated ? thank you page when appointment booking is not allowed
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Events Promo

  # AFW-3811 ? one-pass Events Promo schedule + See You Soon visit copy. Covers TC-E029 + TC-E035.
  # Locales: AFW-3811 adopting locales that also have Events Promo Coverage YES (US, AU).
 @AFW-3811 @Afw3811ConsolidatedPass @AFW-3661 @TC-E029 @TC-E035 @US @AU @TH @PH @SG @NZ @ID @EN-CA @FR-CA @Regression @Smoke @batch-1 @AFW-3659 @EN-MY
  Scenario: Consolidated ? AFW-3811 Book a Visit Events Promo schedule and See You Soon copy
    Given The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Promo
    When The user selects a date and time in the Events page schedule picker
    Then The Events booking confirmation message and appointment details is displayed

  # AFW-3660 Events (Testpad 27496 Events section) TH spin-up ? one-pass: landing ? search ? CLAIM OFFER ? form ? submit.
  # Run: $env:FEATURE="Afw3660ConsolidatedPass"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @AFW-3660 @AFW-3657 @AFW-3658 @Afw3660ConsolidatedPass @EventsPromoConsolidatedPass @TH @PH @SG @NZ @Regression @Smoke @batch-1 @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated ? AFW-3660 TH Events Promo spin-up
    Then The heading and description are displayed correctly in the Events Promo page
    And The search box placeholder is displayed correctly in the Events Promo page
    And The Find Your Gym heading is displayed correctly in the Events Promo page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And The GYM DETAILS and CLAIM OFFER buttons are displayed in the Events page search results for that gym
    When The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo lead form is displayed
    And The "TELL US ABOUT YOU" text is visible and correct on the Events Promo form
    And The correct marketing consent disclaimer text is displayed on the Events Promo form
    When The user submits the Events page form with valid data
    Then The schedule page heading and text description are displayed for Events Promo
    And The thank-you screen is displayed when appointment booking is not allowed for Events Promo

  # AFW-3989 — Canada national Join for $1 Fall Membership (Events Promo). Tickets locale: EN-CA.
  # Run: $env:FEATURE="AFW-3989"; $env:TAG="EN-CA"; $env:LOCALE="EN-CA"; npm run test:multi-locale:feature
  @AFW-3989 @EN-CA @Regression @desktop
  Scenario: Consolidated — AFW-3989 Canada Events Promo Fall Membership national offer
    Then The heading and description are displayed correctly in the Events Promo page
    And The AFW-3989 Events Promo national offer hero copy is displayed correctly
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo lead form is displayed
    And The AFW-3989 Events Promo Webflow lead-form parameters match the national offer
    When The user submits the Events page form with valid data
    Then The AFW-3989 Events Promo prospect API reflects the national offer lead source
    And The schedule page heading and text description are displayed for Events Promo
    And The thank-you screen is displayed when appointment booking is not allowed for Events Promo

  # AFW-3440 — Events Promo lead source normalization on submit (Tickets: US, SG).
  # Matrix: https://docs.google.com/spreadsheets/d/1FoKzz7bJ4hZ4yQgJFU46hPciaShXCuoMmqckvgr2edo
  # Run: FEATURE=AFW-3440 TAG=US LOCALE=EN-US NODE_ENV=SIT npm run test:multi-locale:feature
  @AFW-3440 @EventsPromo @desktop @Regression
  Scenario Outline: AFW-3440 Events Promo normalizes lead source code on prospect submit
    Given The AFW-3440 Events Promo widget is ready for lead-source override
    When The AFW-3440 Events Promo lead source code is overridden to "<Input>"
    And The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo lead form is displayed
    When The user submits the Events page form with valid data
    Then The AFW-3440 prospect origin_source equals "<Expected>"

    @US @SG
    Examples:
      | Input                          | Expected                         |
      | Website-Event-ABC123_DC       | Website-Event-ABC123_DC         |
      | Website-Event-ABC123          | Website-Event-ABC123_DC         |
      | Website-Local-ABC123          | Website-Event-ABC123_DC         |
      | Website-Local-ABC123_DC       | Website-Event-ABC123_DC         |
      | Website-Local-SummerPromo2026 | Website-Event-SummerPromo2026_DC |
      | Website-Test-ABC123           | Website-Test-ABC123             |
      | Website-Event-ABC 123         | Website-Event-ABC123_DC         |
      | Website-Event-ABC@123         | Website-Event-ABC123_DC         |

  # --- AFW-4104: Location Searched / Location Selected CMS offer_name + offer_type (US Rudderstack) ---
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-4104
  # Run: $env:FEATURE="EventsPromo"; $env:TAG="AFW-4104"; $env:NODE_ENV="SIT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature

  @AFW-4104 @EventsPromo @US @desktop @Regression
  Scenario: Verify Location Searched includes CMS offer fields on Events Promo
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for Events Promo
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Location Searched Rudderstack event is triggered for "Events Promo" with CMS offer fields and search success "true"

  @AFW-4104 @EventsPromo @US @desktop @Regression
  Scenario: Verify Location Selected includes CMS offer fields on Events Promo
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for Events Promo
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Location Selected Rudderstack event is triggered for "Events Promo" with CMS offer fields

  # Untranslated-text scan (CLD3 ? lexicon ? optional Cursor AI). Same pipeline as Contact Us.
  # Non-English only. Soft-fails by default; set UNTRANSLATED_TEXT_FAIL=1 to hard-fail.
  # Run: $env:FEATURE="UntranslatedTextScan"; $env:TAG="TH"; $env:LOCALE="TH-TH"; npm run test:multi-locale:feature
  @UntranslatedTextScan @EventsPromoConsolidatedPass @EventsPromo @TH @DE @AT @IT @desktop @Regression
  Scenario: Consolidated ? scan Events Promo Find Gym ? form ? post-submit for untranslated copy
    When The user collects visible Events Promo copy for untranslated-text scan at stage "landing"
    And The user searches for the "Locale Based" location in the Events page location search
    When The user collects visible Events Promo copy for untranslated-text scan at stage "results"
    And The user selects the CLAIM OFFER option for the "Locale Based" gym from the Events page search results
    Then The Events Promo lead form is displayed
    When The user collects visible Events Promo copy for untranslated-text scan at stage "form"
    And The user submits the Events page form with valid data
    When The user collects visible Events Promo copy for untranslated-text scan at stage "post-submit"
    Then The collected Events Promo flow copy matches the locale language







