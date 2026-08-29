@MemberOffer
Feature: Member Offer
  # Source of truth: Member Offer Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Member Offer YES for US only
  # Checklist: .cursor/knowledge-base/scenario-checklist-member-offer.md
  #
  # OfferKey: join_transformation_challenge
  # Route: /offer/members/join-transformation-challenge
  # Pixel catalog: form_success / member_offer / member-transformation-challenge
  #
  # Locale-agnostic: ONE feature file — Supported Locales as scenario tags (@US).
  # Run: $env:FEATURE="MemberOffer"; $env:TAG="US"; $env:LOCALE="EN-US"; $env:NODE_ENV="UAT"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="MemberOfferConsolidatedPass" or --grep @MemberOfferConsolidatedPass

  @TC-M001 @REGULAR   @US 
  Scenario Outline: Displays error message when user submits form with empty fields
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user submits the Member Offer form with empty fields
    Then The required field error is shown for all input fields in the Member Offer

    # title-format: Displays error message when user submits form with empty fields for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M002 @REGULAR  @US 
  Scenario Outline: Verify Member Offer heading and description are correct
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    Then The Member Offer heading and description are displayed correctly

    # title-format: Verify Member Offer heading and description are correct for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M003 @REGULAR @US 
  Scenario Outline: Verify "COMPLETE THE FORM BELOW TO PARTICIPATE" is visible and correct
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    Then The "COMPLETE THE FORM BELOW TO PARTICIPATE" text is visible and correct on the Member Offer form

    # title-format: Verify "COMPLETE THE FORM BELOW TO PARTICIPATE" is visible and correct for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M004 @REGULAR  @US 
  Scenario Outline: Verify Gym Location data is correct and visible
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    Then The gym location name and address are visible on the Member Offer form

    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M005 @REGULAR   @US 
  Scenario Outline: Verify that the corporate_membership_lead GA4 event is triggered in the GTM Debugger
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data for GTM validation
    Then The Member Offer form_success GA4 event is triggered

    # title-format: Verify that the corporate_membership_lead GA4 event is triggered in the GTM Debugger for offer <OfferKey>
    # Pixel catalog (Resources): Member Offers fire form_success (not corporate_membership_lead)
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M006 @REGULAR   @US 
  Scenario Outline: Verify that /contact API reflects the correct details from user's submission
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data
    Then The thank-you screen is displayed

    # title-format: Verify that /contact API reflects the correct details from user's submission for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  # AFW-3434 — CMS offer_type on Form Started (US Rudderstack only)
  @AFW-3957 @AFW-3434 @REGULAR @Regression @US @desktop
  Scenario Outline: Verify Form Started Rudderstack event is triggered on Member Offer
    Given Rudderstack validation is enabled for Member Offer
    And The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user interacts with the lead form on the Member Offer
    Then The Form Started Rudderstack event is triggered on the Member Offer

    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  # AFW-3956 / AFW-3434 — Lead Captured form_* / offer_* incl. CMS offer_type (US Rudderstack only)
  @AFW-3956 @AFW-3434 @REGULAR @Regression @US @desktop
  Scenario Outline: Verify Lead Captured and Identity Rudderstack after Member Offer submit
    Given Rudderstack validation is enabled for Member Offer
    And The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified on the Member Offer

    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  # AFW-3303 / AFW-4088: Member Offer ?location_id=… must include location_name with location_id on page view
  @AFW-3303 @AFW-4088 @US @desktop @Regression
  Scenario Outline: Verify page view location_name accompanies location_id on Member Offer
    Given Rudderstack validation is enabled for Member Offer
    And The user opens the "<OfferKey>" Member Offer for "open" gym
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Member Offer" with lead_funnel_viewed "true"

    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M007 @REGULAR   @US  @desktop
  Scenario Outline: Verify that FIND A GYM button redirects user to their corresponding locale's /find-gym page
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data
    And The user clicks the FIND A GYM button on the Member Offer thank-you screen
    Then The user is redirected to the locale find-gym page from Member Offer

    # title-format: Verify that FIND A GYM button redirects user to their corresponding locale's /find-gym page for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M008 @REGULAR  @US 
  Scenario Outline: Displays error message for non-alphabetic characters in first name and last name fields
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user enters "123$" in the first name field on the Member Offer form
    And The user enters "Test456" in the last name field on the Member Offer form
    And The user submits the Member Offer form
    Then The non-alphabetic validation error is displayed for the first and last name fields on the Member Offer form

    # title-format: Displays error message for non-alphabetic characters in first name and last name fields for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M009 @REGULAR  @US 
  Scenario Outline: Displays error message when the email format is invalid
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user enters "john.doe@example" in the email field on the Member Offer form
    And The user submits the Member Offer form
    Then The email validation error is displayed on the Member Offer form

    # title-format: Displays error message when the email format is invalid for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M010 @REGULAR  @US  @PhoneNumber
  Scenario Outline: Displays error message when the phone number format is invalid
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user enters invalid number in the phone number field on the Member Offer form
    And The user submits the Member Offer form
    Then The phone number validation error is displayed on the Member Offer form

    # title-format: Displays error message when the phone number format is invalid for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M011 @REGULAR  @US  @PhoneNumber
  Scenario Outline: Verifies the phone number field is accepted when filled via autofill
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user autofills the phone number field on the Member Offer form
    And The user submits the Member Offer form
    Then The phone number field is accepted on the Member Offer form

    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M012 @REGULAR  @US  @PhoneNumber
  Scenario Outline: Verifies the phone number field is accepted when filled via copy and paste
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user copies and pastes a valid number into the phone number field on the Member Offer form
    And The user submits the Member Offer form
    Then The phone number field is accepted on the Member Offer form

    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M013 @REGULAR  @US 
  Scenario Outline: Displays error message for first name and last name fields when the character limit is exceeded
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user enters more than 30 characters in the "first name" field on the Member Offer form
    And The user enters more than 30 characters in the "last name" field on the Member Offer form
    And The user submits the Member Offer form
    Then The maximum length validation error is displayed for the first and last name fields on the Member Offer form

    # title-format: Displays error message for first name and last name fields when the character limit is exceeded for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M014 @REGULAR  @US 
  Scenario Outline: Verify checkbox disclaimer residency text
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    Then The correct local resident disclaimer text is displayed in the user form

    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M015 @REGULAR  @US 
  Scenario Outline: Verify checkbox disclaimer marketing text
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    Then The correct marketing consent disclaimer text is displayed on the Member Offer form

    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M016 @REGULAR  @US 
  Scenario Outline: Verify Local Resident pop-up modal content after Local Resident text link is clicked
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user opens the Local Resident pop-up modal on the Member Offer form
    Then The Local Resident pop-up modal content is displayed on the Member Offer form

    # title-format: Verify Local Resident pop-up modal content after Local Resident text link is clicked for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M017 @REGULAR   @US  @desktop
  Scenario Outline: Verify Privacy Policy text link redirects to a new page
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user clicks the "Privacy Notice" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer

    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M018 @REGULAR   @US  @desktop
  Scenario Outline: Verify Terms of Use text link redirects to a new page
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user clicks the "Terms & Conditions" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer

    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M019 @REGULAR   @US  @desktop
  Scenario Outline: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user clicks the "Text Messaging Terms" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer

    # title-format: Verify SMS & MMS Terms of Service text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M020 @REGULAR   @US  @desktop
  Scenario Outline: Verify clicking links in user form opens a new tab
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user clicks the "<Link>" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer

    # title-format: Verify clicking the <Link> link in user form opens a new tab for member offer <OfferKey>
    Examples:
      | Link                 | OfferKey                      |
      | Terms & Conditions   | join_transformation_challenge |
      | Privacy Notice       | join_transformation_challenge |
      | Text Messaging Terms | join_transformation_challenge |

  @TC-M021 @REGULAR   @US  @desktop
  Scenario Outline: Successfully complete a Member Offer submission for OPEN gym
    Given The user opens the "<OfferKey>" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data
    Then The thank-you screen is displayed

    # title-format: Successfully complete <OfferKey> Member Offer submission for OPEN gym
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  @TC-M022 @REGULAR   @US 
  Scenario Outline: Successfully complete a Member Offer submission for PRESALE gym
    Given The user opens the "<OfferKey>" Member Offer for "presale" gym
    When The user submits the Member Offer form with valid data
    Then The thank-you screen is displayed

    # title-format: Successfully complete <OfferKey> Member Offer submission for PRESALE gym
    Examples:
      | OfferKey                      |
      | join_transformation_challenge |

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-M001–M022 above. These stack compatible checks to reduce navigations.
  # No @TC-* /  /  — smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="MemberOfferConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=MemberOffer also matches these (feature-level tag inheritance).

  @MemberOfferConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated — form chrome and gym location
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    Then The Member Offer heading and description are displayed correctly
    And The "COMPLETE THE FORM BELOW TO PARTICIPATE" text is visible and correct on the Member Offer form
    And The gym location name and address are visible on the Member Offer form

  @MemberOfferConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated — US form disclaimers and Local Resident modal
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    Then The correct local resident disclaimer text is displayed in the user form
    And The correct marketing consent disclaimer text is displayed on the Member Offer form
    When The user opens the Local Resident pop-up modal on the Member Offer form
    Then The Local Resident pop-up modal content is displayed on the Member Offer form

  @MemberOfferConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated — form required fields
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user submits the Member Offer form with empty fields
    Then The required field error is shown for all input fields in the Member Offer

  @MemberOfferConsolidatedPass @US @PhoneNumber @Regression @Smoke @batch-2
  Scenario: Consolidated — form invalid fields
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user enters "123$" in the first name field on the Member Offer form
    And The user enters "Test456" in the last name field on the Member Offer form
    And The user enters "john.doe@example" in the email field on the Member Offer form
    And The user enters invalid number in the phone number field on the Member Offer form
    And The user submits the Member Offer form
    Then The non-alphabetic validation error is displayed for the first and last name fields on the Member Offer form
    And The email validation error is displayed on the Member Offer form
    And The phone number validation error is displayed on the Member Offer form

  @MemberOfferConsolidatedPass @US  @Regression @Smoke @batch-2
  Scenario: Consolidated — first and last name maximum length validation
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user enters more than 30 characters in the "first name" field on the Member Offer form
    And The user enters more than 30 characters in the "last name" field on the Member Offer form
    And The user submits the Member Offer form
    Then The maximum length validation error is displayed for the first and last name fields on the Member Offer form

  @MemberOfferConsolidatedPass @US @PhoneNumber @Regression 
  Scenario: Consolidated — phone autofill and copy-paste acceptance
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user autofills the phone number field on the Member Offer form
    And The user submits the Member Offer form
    Then The phone number field is accepted on the Member Offer form
    When The user copies and pastes a valid number into the phone number field on the Member Offer form
    And The user submits the Member Offer form
    Then The phone number field is accepted on the Member Offer form

  @MemberOfferConsolidatedPass @US @desktop @Regression 
  Scenario: Consolidated — Privacy, Terms, and SMS legal links open in a new tab
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user clicks the "Privacy Notice" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer
    When The user clicks the "Terms & Conditions" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer
    When The user clicks the "Text Messaging Terms" link on the Member Offer form
    Then The link is opened in a new tab for Member Offer

  @MemberOfferConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated — form_success GA4 event after valid GTM submission
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data for GTM validation
    Then The Member Offer form_success GA4 event is triggered

  @MemberOfferConsolidatedPass @US @desktop @Regression @Smoke @batch-2
  Scenario: Consolidated — OPEN gym thank-you and FIND A GYM redirect
    Given The user opens the "join_transformation_challenge" Member Offer for "open" gym
    When The user submits the Member Offer form with valid data
    Then The thank-you screen is displayed
    When The user clicks the FIND A GYM button on the Member Offer thank-you screen
    Then The user is redirected to the locale find-gym page from Member Offer

  @MemberOfferConsolidatedPass @US @Regression @Smoke @batch-2
  Scenario: Consolidated — PRESALE gym thank-you after successful submission
    Given The user opens the "join_transformation_challenge" Member Offer for "presale" gym
    When The user submits the Member Offer form with valid data
    Then The thank-you screen is displayed
