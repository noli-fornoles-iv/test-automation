@MCOOffer
Feature: MCO Offer
  # Source of truth: MCO Offer Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: YES for US only
  # Checklist: .cursor/knowledge-base/scenario-checklist-mco-offer.md
  #
  # Locale-agnostic: ONE feature file — add Supported Locales as tags (@US …).
  # Tags: Test Case ID (@TC-Lxxx @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="MCOOffer"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="MCOOfferConsolidatedPass" or --grep @MCOOfferConsolidatedPass
  # Local Config: Rudderstack/Data Layer/GTM = TRUE for US only.
  # Schedule/Success scenarios skip when can_book_appointment does not match Notes.
  # Consolidated journeys use real_af_reboot only (same as non-L034/L035 sheet TCs).
  #
  # OfferKeys (OPEN gym):
  #   Regular booking (TC-L034): real_af_reboot, free_training_experience_offer,
  #     free_7_day_group_training_offer, get_30_days_free_offer, free_training_session,
  #     join_get_rest_year_free, free_7_day_pass_offer_bfg
  #   Spring booking (TC-L035): one_day_pass, join_get_40_offer_of, join_get_40_offer_jw,
  #     fourteen_day_pass_jo, fourteen_day_pass_eh, fourteen_day_pass_jw
  #   All other scenarios: real_af_reboot only

  # --- Find Your Gym ---

  @TC-L001 @REGULAR  @US
  Scenario Outline: Verify Events MCO Offer heading and description are correct
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    Then The Events MCO Offer heading and description are displayed correctly

    # title-format: Verify Events MCO Offer heading and description are correct for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L002 @REGULAR  @US
  Scenario Outline: Verify Find a location near you is correct
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    Then The Find a location near you text is displayed correctly in the MCO Offer page

    # title-format: Verify Find a location near you is correct for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L003 @REGULAR @US
  Scenario Outline: Verify Use Current Location is visible and correct
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    Then The Use Current Location button is visible and correct in the MCO Offer page

    # title-format: Verify Use Current Location is visible and correct for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L004 @REGULAR  @US
  Scenario Outline: Verify location search functionality with a valid search scenario
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The system displays gym results sorted by distance for MCO Offer
    And Only max 10 results are shown in the MCO Offer gym search results
    And The gym search results for that location is displayed for MCO Offer
    And The SELECT GYM button is displayed in the MCO Offer search results for that gym

    # title-format: Verify location search functionality with a valid search scenario for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L005 @REGULAR  @US
  Scenario Outline: Verify location search functionality with a no nearby gym search scenario
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches for a location with no nearby gyms in the MCO Offer location search
    Then The no locations error is displayed in the MCO Offer location search

    # title-format: Verify location search functionality with a no nearby gym search scenario for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L006 @REGULAR @US
  Scenario Outline: Verify clicking LIST and MAP correctly switches tabs
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The LIST and MAP tabs switch correctly in the MCO Offer page
    And The SELECT GYM button is displayed in the MCO Offer search results for that gym

    # title-format: Verify clicking LIST and MAP correctly switches tabs for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L007 @REGULAR @US
  Scenario Outline: Verify Use Current Location is visible and correct after location search
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The Use Current Location button is visible and correct in the MCO Offer page

    # title-format: Verify Use Current Location is visible and correct after location search for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L008 @REGULAR @US
  Scenario Outline: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    Then The Let's Get You To The Right Place section is displayed correctly in the MCO Offer page

    # title-format: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L009 @REGULAR  @US
  Scenario Outline: Verify clicking Select Gym shows the Events Lead Form page
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    Then The MCO Offer lead form is displayed

    # title-format: Verify clicking Select Gym shows the Events Lead Form page for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  # --- Form Page ---

  @TC-L010 @REGULAR @US
  Scenario Outline: Verify "Take Advantage Today" text is visible and correct
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    Then The "Take Advantage Today" text is visible and correct on the MCO Offer form

    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L011 @REGULAR  @US
  Scenario Outline: Verify Gym Location data is correct and visible
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    Then The gym location name and address are visible on the MCO Offer form

    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L012 @REGULAR @Regression  @US @AFW-3957 @AFW-3434 @desktop
  Scenario Outline: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for MCO Offer
    And The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user interacts with the lead form on the MCO Offer
    Then The Form Started Rudderstack event is triggered on the MCO Offer

    # title-format: Verify Form Started Rudderstack event is triggered for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L013 @REGULAR  @US @desktop
  Scenario Outline: Verify form required fields
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with empty fields
    Then The required field error is shown for all input fields in the MCO Offer

    # title-format: Verify form required fields for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L014 @REGULAR  @US @desktop
  Scenario Outline: Verify form invalid fields
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user enters "123$" in the first name field on the MCO Offer form
    And The user enters "Test456" in the last name field on the MCO Offer form
    And The user enters "john.doe@example" in the email field on the MCO Offer form
    And The user enters invalid number in the phone number field on the MCO Offer form
    And The user submits the MCO Offer form
    Then The non-alphabetic validation error is displayed for the first and last name fields on the MCO Offer form
    And The email validation error is displayed on the MCO Offer form
    And The phone number validation error is displayed on the MCO Offer form
    When The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the first name field on the MCO Offer form
    And The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the last name field on the MCO Offer form
    And The user submits the MCO Offer form
    Then The maximum length validation error is displayed for the first and last name fields on the MCO Offer form

    # title-format: Verify form invalid fields for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L015 @REGULAR  @US
  Scenario Outline: Verify checkbox disclaimer residency text
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    Then The correct local resident disclaimer text is displayed in the user form

    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L016 @REGULAR  @US
  Scenario Outline: Verify checkbox disclaimer marketing text
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    Then The correct marketing consent disclaimer text is displayed on the MCO Offer form

    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L017 @REGULAR  @US @desktop
  Scenario Outline: Verify Local Resident pop-up modal content after Local Resident text link is clicked
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user opens the Local Resident pop-up modal on the MCO Offer form
    Then The Local Resident pop-up modal content is displayed on the MCO Offer form

    # title-format: Verify Local Resident pop-up modal content after Local Resident text link is clicked for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L018 @REGULAR  @US @desktop
  Scenario Outline: Verify Privacy Policy text link redirects to a new page
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user clicks the "Privacy Notice" link on the MCO Offer form
    Then The link is opened in a new tab for MCO Offer

    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L019 @REGULAR  @US @desktop
  Scenario Outline: Verify Terms of Use text link redirects to a new page
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user clicks the "Terms & Conditions" link on the MCO Offer form
    Then The link is opened in a new tab for MCO Offer

    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L020 @REGULAR  @US @desktop
  Scenario Outline: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user clicks the "Text Messaging Terms" link on the MCO Offer form
    Then The link is opened in a new tab for MCO Offer

    # title-format: Verify SMS & MMS Terms of Service text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L021 @REGULAR  @US
  Scenario Outline: Verify valid input field values
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user fills the MCO Offer form with valid data
    Then The form fields accept valid input without validation errors on the MCO Offer form

    # title-format: Verify valid input field values for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L022 @REGULAR @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop
  Scenario Outline: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for MCO Offer
    And The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified on the MCO Offer

    # title-format: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L023 @REGULAR  @US
  Scenario Outline: Verify Lead Capture lead form submission
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The lead capture form submission is successful on the MCO Offer

    # title-format: Verify Lead Capture lead form submission for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L024 @REGULAR  @US
  Scenario Outline: Verify form_loaded data layer is triggered
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user interacts with the lead form on the MCO Offer
    Then The form_loaded data layer is triggered on the MCO Offer

    # title-format: Verify form_loaded data layer is triggered for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  # --- Schedule Page ---
  # Skip when can_book_appointment is false (Notes on Flow tab)

  @TC-L025 @REGULAR @US
  Scenario Outline: Verify schedule page heading and text description
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The schedule page heading and text description are displayed for MCO Offer

    # title-format: Verify schedule page heading and text description for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L026 @REGULAR  @US
  Scenario Outline: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time without submitting on the MCO Offer schedule page
    Then The "LET'S DO THIS" button is enabled on the MCO Offer schedule page

    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L027 @REGULAR  @US
  Scenario Outline: Time slot message is displayed when no date is selected
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The time slot message is displayed for MCO Offer

    # title-format: Time slot message is displayed when no date is selected for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L028 @REGULAR @US
  Scenario Outline: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The staff_id is returned correctly from the MCO Offer availabilities API

    # title-format: Verify that "staff_id" is included and correct in the /bookings API for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  # --- Success Page ---
  # Skip when can_book_appointment does not match Notes

  @TC-L029 @REGULAR  @US
  Scenario Outline: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time in the schedule picker for MCO Offer
    Then The form_success and tour_appointment_scheduled data layers are triggered on the MCO Offer

    # title-format: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L030 @REGULAR  @US
  Scenario Outline: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for MCO Offer
    And The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time in the schedule picker for MCO Offer
    Then The Appointment Scheduled Rudderstack event is verified on the MCO Offer

    # title-format: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L031 @REGULAR  @US
  Scenario Outline: Verify that the referral API is triggered after a successful lead form submission
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time in the schedule picker for MCO Offer
    Then The referral API is triggered after successful MCO Offer booking

    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L032 @REGULAR  @US
  Scenario Outline: Verify "See you soon" success page after successful appointment schedule
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time in the schedule picker for MCO Offer
    Then The booking confirmation message and appointment details are displayed for MCO Offer

    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L033 @REGULAR  @US
  Scenario Outline: Verify "Thank you" page after lead form submission
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for MCO Offer

    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey>
    Examples:
      | OfferKey       |
      | real_af_reboot |

  @TC-L034 @REGULAR  @US @desktop
  Scenario Outline: Successfully complete a MCO Offer booking for OPEN gym
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The search location should be displayed
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time in the schedule picker for MCO Offer
    Then The booking confirmation message and appointment details are displayed for MCO Offer
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "displayed" for MCO Offer
    And The Add to Calendar button is visible for MCO Offer
    And Clicking Google option opens the calendar in new tab for MCO Offer

    # title-format: Successfully complete a MCO Offer booking for OPEN gym for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | real_af_reboot                  |
      | free_training_experience_offer  |
      | free_7_day_group_training_offer |
      | get_30_days_free_offer          |
      | free_training_session           |
      | join_get_rest_year_free         |
      | free_7_day_pass_offer_bfg       |

  @TC-L035 @REGULAR  @US @desktop
  Scenario Outline: Successfully complete a spring MCO Offer booking for OPEN gym
    Given The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The search location should be displayed
    Then The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    And The user selects a date and time in the schedule picker for MCO Offer
    Then The booking confirmation message and appointment details are displayed for MCO Offer
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "displayed" for MCO Offer
    And The Add to Calendar button is visible for MCO Offer
    And Clicking Google option opens the calendar in new tab for MCO Offer

    # title-format: Successfully complete a spring MCO Offer booking for OPEN gym for offer <OfferKey>
    Examples:
      | OfferKey             |
      | one_day_pass         |
      | join_get_40_offer_of |
      | join_get_40_offer_jw |
      | fourteen_day_pass_jo |
      | fourteen_day_pass_eh |
      | fourteen_day_pass_jw |

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-L001–L035 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="MCOOfferConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=MCOOffer also matches these (feature-level tag inheritance).
  # Multi-offer booking matrices (TC-L034 / TC-L035) stay on sheet scenarios only.

  @MCOOfferConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated — Find Your Gym landing, valid search, LIST/MAP, and Select Gym form
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    Then The Events MCO Offer heading and description are displayed correctly
    And The Find a location near you text is displayed correctly in the MCO Offer page
    And The Use Current Location button is visible and correct in the MCO Offer page
    And The Let's Get You To The Right Place section is displayed correctly in the MCO Offer page
    When The user searches an valid location in the MCO Offer location search
    Then The system displays gym results sorted by distance for MCO Offer
    And Only max 10 results are shown in the MCO Offer gym search results
    And The gym search results for that location is displayed for MCO Offer
    And The LIST and MAP tabs switch correctly in the MCO Offer page
    And The SELECT GYM button is displayed in the MCO Offer search results for that gym
    And The Use Current Location button is visible and correct in the MCO Offer page
    When The user clicks on the Select Gym button
    Then The MCO Offer lead form is displayed

  @MCOOfferConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated — no nearby gym search
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches for a location with no nearby gyms in the MCO Offer location search
    Then The no locations error is displayed in the MCO Offer location search

  @MCOOfferConsolidatedPass @US @Regression  
  Scenario: Consolidated — form chrome and valid input without submit
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    Then The "Take Advantage Today" text is visible and correct on the MCO Offer form
    And The gym location name and address are visible on the MCO Offer form
    When The user fills the MCO Offer form with valid data
    Then The form fields accept valid input without validation errors on the MCO Offer form

  @MCOOfferConsolidatedPass @US @Regression  @desktop
  Scenario: Consolidated — US form disclaimers, Form Started, form_loaded, and Local Resident modal
    Given Rudderstack validation is enabled for MCO Offer
    And The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the MCO Offer form
    # Interact / RS / dataLayer before Local Resident modal — modal open+close is slow on WebKit
    When The user interacts with the lead form on the MCO Offer
    Then The Form Started Rudderstack event is triggered on the MCO Offer
    And The form_loaded data layer is triggered on the MCO Offer
    When The user opens the Local Resident pop-up modal on the MCO Offer form
    Then The Local Resident pop-up modal content is displayed on the MCO Offer form

  @MCOOfferConsolidatedPass @US @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated — form required fields
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    When The user submits the MCO Offer form with empty fields
    Then The required field error is shown for all input fields in the MCO Offer

  @MCOOfferConsolidatedPass @US @Regression @Smoke @batch-2 @desktop
  Scenario: Consolidated — form invalid fields
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    When The user enters "123$" in the first name field on the MCO Offer form
    And The user enters "Test456" in the last name field on the MCO Offer form
    And The user enters "john.doe@example" in the email field on the MCO Offer form
    And The user enters invalid number in the phone number field on the MCO Offer form
    And The user submits the MCO Offer form
    Then The non-alphabetic validation error is displayed for the first and last name fields on the MCO Offer form
    And The email validation error is displayed on the MCO Offer form
    And The phone number validation error is displayed on the MCO Offer form
    When The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the first name field on the MCO Offer form
    And The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the last name field on the MCO Offer form
    And The user submits the MCO Offer form
    Then The maximum length validation error is displayed for the first and last name fields on the MCO Offer form

  @MCOOfferConsolidatedPass @US @desktop @Regression @desktop
  Scenario: Consolidated — Privacy, Terms, and SMS legal links open in a new tab
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    When The user clicks the "Privacy Notice" link on the MCO Offer form
    Then The link is opened in a new tab for MCO Offer
    When The user clicks the "Terms & Conditions" link on the MCO Offer form
    Then The link is opened in a new tab for MCO Offer
    When The user clicks the "Text Messaging Terms" link on the MCO Offer form
    Then The link is opened in a new tab for MCO Offer

  @MCOOfferConsolidatedPass @US @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet schedule TCs).
  Scenario: Consolidated — schedule page, staff_id, time slot message, and LET'S DO THIS enabled
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The schedule page heading and text description are displayed for MCO Offer
    And The staff_id is returned correctly from the MCO Offer availabilities API
    And The time slot message is displayed for MCO Offer
    When The user selects a date and time without submitting on the MCO Offer schedule page
    Then The "LET'S DO THIS" button is enabled on the MCO Offer schedule page

  @MCOOfferConsolidatedPass @US @desktop @Regression @Smoke @batch-2
  # Skip / soft-pass when can_book_appointment is false (same Notes as sheet success TCs).
  Scenario: Consolidated — appointment booking with Rudderstack, dataLayer, referral, and success
    Given Rudderstack validation is enabled for MCO Offer
    And The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The search location should be displayed
    And The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified on the MCO Offer
    And The lead capture form submission is successful on the MCO Offer
    When The user selects a date and time in the schedule picker for MCO Offer
    Then The form_success and tour_appointment_scheduled data layers are triggered on the MCO Offer
    And The Appointment Scheduled Rudderstack event is verified on the MCO Offer
    And The referral API is triggered after successful MCO Offer booking
    And The booking confirmation message and appointment details are displayed for MCO Offer
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "displayed" for MCO Offer
    And The Add to Calendar button is visible for MCO Offer
    And Clicking Google option opens the calendar in new tab for MCO Offer

  @MCOOfferConsolidatedPass @US @Regression @Smoke @batch-2
  # Soft-pass when can_book_appointment is true (thank-you path only when booking is not allowed).
  Scenario: Consolidated — thank you page when appointment booking is not allowed
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for MCO Offer

  # AFW-3811 — one-pass Book a Visit addon copy (Testpad #11–16). Covers TC-L025 + TC-L032.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-L025 @REGULAR @TC-L032 @REGULAR @US @Regression 
  Scenario: Consolidated — AFW-3811 Book a Visit MCO Offer schedule and See You Soon copy
    Given The user opens the "real_af_reboot" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    When The user submits the MCO Offer form with valid data
    Then The schedule page heading and text description are displayed for MCO Offer
    When The user selects a date and time in the schedule picker for MCO Offer
    Then The booking confirmation message and appointment details are displayed for MCO Offer

  # --- AFW-4104: Location Searched / Location Selected CMS offer_name + offer_type (US Rudderstack) ---
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-4104
  # Run: $env:FEATURE="MCOOffer"; $env:TAG="AFW-4104"; $env:NODE_ENV="SIT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature

  @AFW-4104 @US @desktop @Regression
  Scenario Outline: Verify Location Searched includes CMS offer fields on MCO Offer
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for MCO Offer
    And The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    Then The Location Searched Rudderstack event is triggered for "MCO Offer" with CMS offer fields and search success "true"

    Examples:
      | OfferKey                  |
      | join_for_one_dollar_offer |

  @AFW-4104 @US @desktop @Regression
  Scenario Outline: Verify Location Selected includes CMS offer fields on MCO Offer
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for MCO Offer
    And The user opens the "<OfferKey>" MCO Offer for "open" gym
    When The user searches an valid location in the MCO Offer location search
    And The user clicks on the Select Gym button
    Then The Location Selected Rudderstack event is triggered for "MCO Offer" with CMS offer fields

    Examples:
      | OfferKey                  |
      | join_for_one_dollar_offer |

  # AFW-3440 — MCO (group) Offer lead source normalization on submit (Tickets: US; Coverage MCO = US only).
  # Matrix: https://docs.google.com/spreadsheets/d/1FoKzz7bJ4hZ4yQgJFU46hPciaShXCuoMmqckvgr2edo
  # Run: FEATURE=AFW-3440 TAG=US LOCALE=EN-US NODE_ENV=SIT npm run test:multi-locale:feature
  @AFW-3440 @MCOOffer @US @desktop @Regression
  Scenario Outline: AFW-3440 MCO Offer normalizes lead source code on prospect submit
    Given The AFW-3440 MCO Offer lead source code override "<Input>" is armed
    And The user opens the "join_get_rest_year_free" MCO Offer for "open" gym
    When The AFW-3440 MCO Offer lead source code is overridden to "<Input>"
    And The user submits the MCO Offer form with valid data
    Then The AFW-3440 prospect origin_source equals "<Expected>"

    Examples:
      | Input                    | Expected             |
      | Website-Local-ABC123     | Website-Local-ABC123 |
      | Website-Event-ABC123_DC | Website-Local-ABC123 |
      | Website-Event-ABC123     | Website-Local-ABC123 |
      | Website-Local-ABC123_DC | Website-Local-ABC123 |
      | Website-Test-ABC123      | Website-Test-ABC123  |
      | Website-Local-ABC 123   | Website-Local-ABC123 |
      | Website-Local-ABC#123    | Website-Local-ABC123 |
