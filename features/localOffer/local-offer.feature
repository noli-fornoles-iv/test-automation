@LocalOffer
Feature: Local Offer
  # Source of truth: Local Offer Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit?gid=1040142873#gid=1040142873
  # Checklist: .cursor/knowledge-base/scenario-checklist-local-offer.md
  #
  # OfferKeys: Available on Prod ONLY (https://docs.google.com/spreadsheets/d/1xmBxkYUNRTjz6iN-pv241uipye9j9jdQ_BZGEJtSkd0/edit?gid=0#gid=0).
  # Non-submit / single-offer scenarios: FIRST Available on Prod offer per locale.
  # Submit coverage (TC-K027 OPEN gym booking): ALL Available on Prod keys per locale.
  # Club IDs from Local Config (gid=1767796336) via d(TestDataKeys.Locations.ClubId).
  # Pixel catalog ref: https://docs.google.com/spreadsheets/d/1uUfK7vMlnPJOSMK1VKPw0V_yJrfKA2pX/edit?gid=977035100
  #
  #   US: one_day_pass (first), join_get_40_offer, fourteen_day_pass
  #   AU: two_months_free
  #   GB: first_month_free_for_you_and_a_friend (first), seven_day_trial, one_day_free_trial, one_month_free
  #   IE: four_weeks_for_eu4
  #   ZA: refer_new_member_get_a_month_free (first), get_started_for_r199
  #   IN: festive_fitness_deals (first) + 5 more Available
  #   AT: happy_without_commitment (first) + 5 more Available
  #   DE: coaching_normal (first), coaching_plus, coaching_special, coaching_advanced, early_bird, basic
  #   IT: join_now_at_the_best_price_ever (first) + 5 more Available
  #       Sheet: https://docs.google.com/spreadsheets/d/1xmBxkYUNRTjz6iN-pv241uipye9j9jdQ_BZGEJtSkd0/edit?gid=1123358209#gid=1123358209
  #   EN-CA: 21day_reboot (first) + join_1_dollar_fall_membership (AFW-3989) + other Available (gid=400169017)
  #   FR-CA: join_1_dollar_fall_membership (first) + 13 more Available (gid=378757103); exclude 7-day-group-training-pass-frca (Not available)
  #       Sheet: https://docs.google.com/spreadsheets/d/1xmBxkYUNRTjz6iN-pv241uipye9j9jdQ_BZGEJtSkd0/edit?gid=378757103#gid=378757103
  #   PH (EN-PH): AFW-3842–3847 — student_membership, senior_citizen_membership, pwd_membership,
  #       pre_sale_membership, refresh_membership, welcome_pack (TC-K028 ticket smoke)
  #   TH: Coverage YES but Local Offer "Available on Prod" sheet tab is empty — do not add @TH Examples until offers exist
  #
  # Tags: Test Case ID (@TC-Kxxx) + Feature Tag from Flow tab.
  # when OfferKeys differ per locale. Locale-agnostic: ONE feature file.
  # Examples format: locale-tagged Examples blocks. OfferKeys must be Available on Prod.

  # --- Local Offer Form Page ---

  @TC-K001 @Smoke @batch-3 @Regression
  Scenario Outline: Verify Local Offer heading Text are correct
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    Then The Local Offer heading text is displayed correctly

    @US
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT 
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify Local Offer heading Text are correct for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K002
  Scenario Outline: Verify "Take Advantage Today" text is visible and correct
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    Then The "Take Advantage Today" text is visible and correct on the Local Offer form

    @US
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify "Take Advantage Today" text is visible and correct for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K003 @Regression
  Scenario Outline: Verify Gym Location data is correct and visible
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    Then The gym location name and address are visible on the Local Offer form

    @US
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify Gym Location data is correct and visible for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K004 @Smoke @batch-3 @Regression @US @AFW-3957 @AFW-3434 @desktop
  Scenario Outline: Verify Form Started Rudderstack event is triggered
    Given Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user interacts with the lead form on the Local Offer
    Then The Form Started Rudderstack event is triggered on the Local Offer

    # title-format: Verify Form Started Rudderstack event is triggered for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  # --- AFW-3303 Page view lead_funnel_viewed (US Rudderstack) ---
  @AFW-3303 @US @desktop @Regression
  Scenario Outline: Verify page view lead_funnel_viewed true on Local Offer
    Given Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Local Offer" with lead_funnel_viewed "true"

    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K005 @Smoke @batch-3 @Regression @desktop
  Scenario Outline: Verify form required fields
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with empty fields
    Then The required field error is shown for all input fields in the Local Offer

    @US
    # title-format: Verify form required fields for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify form required fields for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify form required fields for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify form required fields for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify form required fields for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify form required fields for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify form required fields for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify form required fields for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify form required fields for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K006 @Smoke @batch-3 @Regression @desktop
  Scenario Outline: Verify form invalid fields
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user enters "123$" in the first name field on the Local Offer form
    And The user enters "Test456" in the last name field on the Local Offer form
    And The user enters "john.doe@example" in the email field on the Local Offer form
    And The user enters invalid number in the phone number field on the Local Offer form
    And The user submits the Local Offer form
    Then The non-alphabetic validation error is displayed for the first and last name fields on the Local Offer form
    And The email validation error is displayed on the Local Offer form
    And The phone number validation error is displayed on the Local Offer form
    When The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the first name field on the Local Offer form
    And The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the last name field on the Local Offer form
    And The user submits the Local Offer form
    Then The maximum length validation error is displayed for the first and last name fields on the Local Offer form

    @US
    # title-format: Verify form invalid fields for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify form invalid fields for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify form invalid fields for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify form invalid fields for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify form invalid fields for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify form invalid fields for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify form invalid fields for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify form invalid fields for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify form invalid fields for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K007
  Scenario Outline: Verifies the phone number field is accepted when filled via autofill
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user autofills the phone number field on the Local Offer form
    Then The phone number field is accepted on the Local Offer form

    @US
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verifies the phone number field is accepted when filled via autofill for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K008
  Scenario Outline: Verifies the phone number field is accepted when filled via copy and paste
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user copies and pastes a valid number into the phone number field on the Local Offer form
    Then The phone number field is accepted on the Local Offer form

    @US
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verifies the phone number field is accepted when filled via copy and paste for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K009 @Regression
  Scenario Outline: Verify checkbox disclaimer residency text
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    Then The correct local resident disclaimer text is displayed in the user form

    @US
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify checkbox disclaimer residency text for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K010 @Regression
  Scenario Outline: Verify checkbox disclaimer marketing text
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    Then The correct marketing consent disclaimer text is displayed on the Local Offer form

    @US
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify checkbox disclaimer marketing text for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K011 @Regression @US @desktop
  Scenario Outline: Verify Local Resident pop-up modal content after Local Resident text link is clicked
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user opens the Local Resident pop-up modal on the Local Offer form
    Then The Local Resident pop-up modal content is displayed on the Local Offer form

    # title-format: Verify Local Resident pop-up modal content after Local Resident text link is clicked for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K012 @Regression @desktop
  Scenario Outline: Verify Privacy Policy text link redirects to a new page
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user clicks the "Privacy Notice" link on the Local Offer form
    Then The link is opened in a new tab for Local Offer

    @US
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @DE 
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify Privacy Policy text link redirects to a new page for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K013 @Regression @desktop
  Scenario Outline: Verify Terms of Use text link redirects to a new page
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user clicks the "Terms & Conditions" link on the Local Offer form
    Then The link is opened in a new tab for Local Offer

    @US
    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @DE 
    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify Terms of Use text link redirects to a new page for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

  @TC-K014 @Regression @US @desktop
  Scenario Outline: Verify SMS & MMS Terms of Service text link redirects to a new page
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user clicks the "Text Messaging Terms" link on the Local Offer form
    Then The link is opened in a new tab for Local Offer

    # title-format: Verify SMS & MMS Terms of Service text link redirects to a new page for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K015
  Scenario Outline: Verify valid input field values
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user fills the Local Offer form with valid data
    Then The form fields accept valid input without validation errors on the Local Offer form

    @US
    # title-format: Verify valid input field values for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify valid input field values for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify valid input field values for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify valid input field values for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify valid input field values for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify valid input field values for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify valid input field values for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify valid input field values for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify valid input field values for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K016 @Smoke @batch-3 @Regression @US @AFW-3956 @AFW-3434 @AFW-3953 @AFW-3954 @desktop @testy
  Scenario Outline: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission
    Given Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified on the Local Offer

    # title-format: Verify Lead Captured, Identity Rudderstack event is triggered after successful lead form submission for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K017 @Smoke @batch-3 @Regression @US
  Scenario Outline: Verify Lead Capture lead form submission
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    Then The lead capture form submission is successful on the Local Offer

    # title-format: Verify Lead Capture lead form submission for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K018 @Smoke @batch-3 @Regression @US
  Scenario Outline: Verify form_loaded data layer is triggered
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user interacts with the lead form on the Local Offer
    Then The form_loaded data layer is triggered on the Local Offer

    # title-format: Verify form_loaded data layer is triggered for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  # --- Local Offer Schedule Page ---
  # Skip schedule / booking scenarios when can_book_appointment is false (Flow Notes).

  @TC-K019
  Scenario Outline: Verify schedule page heading and text description
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    Then The schedule page heading and text description are displayed for Local Offer

    @US
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify schedule page heading and text description for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify schedule page heading and text description for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K020 @Regression
  Scenario Outline: Verify selecting date and time availabilities enables the "LET'S DO THIS" button
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    And The user selects a date and time without submitting on the Local Offer schedule page
    Then The "LET'S DO THIS" button is enabled on the Local Offer schedule page

    @US
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify selecting date and time availabilities enables the "LET'S DO THIS" button for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K021 @Smoke @batch-3 @Regression @US
  Scenario Outline: Verify that "staff_id" is included and correct in the /bookings API (referrer comes from /availabilities API)
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    Then The staff_id is returned correctly from the Local Offer availabilities API

    # title-format: Verify that "staff_id" is included and correct in the /bookings API for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K022 @Smoke @batch-3 @Regression @US @testy
  # Skip when can_book_appointment is false (Notes on Flow tab) — do not wait on schedule date picker.
  Scenario Outline: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    And The user selects a date and time in the schedule picker for Local Offer
    Then The form_success and tour_appointment_scheduled data layers are triggered on the Local Offer

    # title-format: Verify that the "form_success" and "tour_appointment_scheduled" data layers are triggered for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  @TC-K023 @Smoke @batch-3 @Regression @US @testy
  Scenario Outline: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission
    Given Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    And The user selects a date and time in the schedule picker for Local Offer
    Then The Appointment Scheduled Rudderstack event is verified on the Local Offer

    # title-format: Verify that the "Appointment Scheduled" Rudderstack event is triggered after a successful lead form submission for offer <OfferKey>
    Examples:
      | OfferKey     |
      | one_day_pass |

  # --- Local Offer Success Page ---

  @TC-K024 @Smoke @batch-3 @Regression
  Scenario Outline: Verify that the referral API is triggered after a successful lead form submission
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    And The user selects a date and time in the schedule picker for Local Offer
    Then The referral API is triggered after successful Local Offer booking

    @US
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify that the referral API is triggered after a successful lead form submission for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K025 @Smoke @batch-3 @Regression
  Scenario Outline: Verify "See you soon" success page after successful appointment schedule
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    And The user selects a date and time in the schedule picker for Local Offer
    Then The booking confirmation message and appointment details are displayed for Local Offer

    @US
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify "See you soon" success page after successful appointment schedule for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  @TC-K026 @Smoke @batch-3 @Regression
  Scenario Outline: Verify "Thank you" page after lead form submission
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    Then The thank-you screen is displayed when appointment booking is not allowed for Local Offer

    @US
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (US)
    Examples:
      | OfferKey     |
      | one_day_pass |

    @IN
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (IN)
    Examples:
      | OfferKey              |
      | festive_fitness_deals |

    @ZA
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                          |
      | refer_new_member_get_a_month_free |

    @DE 
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal |

    @IT @TESTIT
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey>
    Examples:
      | OfferKey                        |
      | join_now_at_the_best_price_ever |

    @AU
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |

    @IE
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

    @AT
    # title-format: Verify "Thank you" page after lead form submission for offer <OfferKey> (AT)
    Examples:
      | OfferKey                |
      | happy_without_commitment |

  # Lists ALL Available offerKeys per locale (Local offer titles and links sheet)
  @TC-K027 @Smoke @batch-3 @Regression @testy
  Scenario Outline: Successfully complete a Local Offer booking for OPEN gym
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    And The user selects a date and time in the schedule picker for Local Offer
    Then The booking confirmation message and appointment details are displayed for Local Offer
    And The prospect Id and prospect data is cleared from session storage
    And Invite a friend section is "displayed" for Local Offer
    And The Add to Calendar button is visible for Local Offer

    @US
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (US)
    Examples:
      | OfferKey           |
      | one_day_pass       |
      | join_get_40_offer  |
      | fourteen_day_pass  |

    @IN
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (IN)
    Examples:
      | OfferKey                                   |
      | festive_fitness_deals                      |
      | anniversary_special_offers                 |
      | exclusive_recovery_experience              |
      | complimentary_body_composition_analysis    |
      | free_expert_fitness_consultation           |
      | refer_earn_rewards                         |

    @ZA
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (ZA)
    Examples:
      | OfferKey                            |
      | refer_new_member_get_a_month_free   |
      | get_started_for_r199                |

    @DE 
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (DE)
    Examples:
      | OfferKey         |
      | coaching_normal  |
      | coaching_plus    |
      | coaching_special |
      | coaching_advanced |
      | early_bird       |
      | basic            |

    @IT @TESTIT
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (IT)
    Examples:
      | OfferKey                                 |
      | join_now_at_the_best_price_ever          |
      | join_for_1_euro_next_month_is_free       |
      | pro_rated_free_month                     |
      | join_for_1_get_the_rest_of_the_year_free |
      | join_for_1_and_starter_pack_included     |
      | prorated_promotion                       |

    @AU
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (AU)
    Examples:
      | OfferKey       |
      | two_months_free |

    @GB
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (GB)
    Examples:
      | OfferKey                             |
      | first_month_free_for_you_and_a_friend |
      | seven_day_trial                      |
      | one_day_free_trial                   |
      | one_month_free                       |

    @IE
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (IE)
    Examples:
      | OfferKey          |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (EN-CA)
    # Available on Prod (gid=400169017) — includes join-1-dollar-fall-membership (AFW-3989)
    Examples:
      | OfferKey                              |
      | 21day_reboot                          |
      | join_1_dollar_fall_membership         |
      | 6_week_challenge                      |
      | join_for_1_transformation_challenge   |
      | join_get_the_rest_of_the_year_free    |
      | 0_enrollment_offer                    |
      | join_for_1                            |
      | join_get_the_summer_free              |
      | join_get_30_days_free                 |
      | free_training_session                 |
      | free_month_training                   |
      | 7_day_group_training                  |
      | 50_off_training_offer                 |
      | free_training_experience_enca         |
      | free_7_daypass                        |

    @FR-CA
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (FR-CA)
    # Available on Prod (gid=378757103) — exclude 7-day-group-training-pass-frca (Not available)
    Examples:
      | OfferKey                                            |
      | join_1_dollar_fall_membership                       |
      | 0_enrollment_frca                                   |
      | join_get_rest_year_free_frca                        |
      | refer_friend_get_registration_transformation_challenge |
      | 6_week_challenge_frca                               |
      | 21_day_reboot_frca                                  |
      | free_7_day_pass_frca                                |
      | free_training_experience_frca                       |
      | 50_off_training_frca                                |
      | 1_month_training_frca                               |
      | training_session_frca                               |
      | 30_days_free_frca                                   |
      | join_get_summer_free_frca                           |
      | join_for_1_frca                                     |

    @AT
    # title-format: Successfully complete a Local Offer booking for OPEN gym for offer <OfferKey> (AT)
    Examples:
      | OfferKey                        |
      | happy_without_commitment        |
      | refer_a_friend_both_1_month_free |
      | free_care_package               |
      | three_months_for_99             |
      | first_month_free                |
      | opening_offer                   |

  @TC-K028
  Scenario Outline: Verify Local Offer CMS and website smoke checklist for ticket
    Given The Webflow CMS Local Offer for ticket "<Ticket>" is loaded
    Then The Webflow CMS Local Offer fields match the Testpad expected data
    When The user opens the "<OfferKey>" Local Offer for "open" gym
    Then The Local Offer page URL structure is correct for the offer
    And The Local Offer page CMS content matches the Webflow CMS data
    # Soft APP DEFECT when CMS toggle TRUE but card missing — continue form/submit coverage
    And The Join Online card visibility matches the CMS Show Join Online toggle
    And The Local Offer React lead form eventProps match the CMS data
    And The gym location name and address are visible on the Local Offer form
    When The user submits the Local Offer form with empty fields
    Then The required field error is shown for all input fields in the Local Offer
    When The user enters "123$" in the first name field on the Local Offer form
    And The user enters "Test456" in the last name field on the Local Offer form
    And The user enters "john.doe@example" in the email field on the Local Offer form
    And The user enters invalid number in the phone number field on the Local Offer form
    And The user submits the Local Offer form
    Then The non-alphabetic validation error is displayed for the first and last name fields on the Local Offer form
    And The email validation error is displayed on the Local Offer form
    And The phone number validation error is displayed on the Local Offer form
    When The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the first name field on the Local Offer form
    And The user enters "AbcdefghijklmnopqrstuvwxyzAbcde" in the last name field on the Local Offer form
    And The user submits the Local Offer form
    Then The maximum length validation error is displayed for the first and last name fields on the Local Offer form
    When The user submits the Local Offer form with valid data
    Then The lead capture form submission is successful on the Local Offer
    And The prospect API payload reflects Local Offer CMS details

@AFW-3198 @EN-CA
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (CA)
    Examples:
      | Ticket   | OfferKey              |
      | AFW-3198 | free_training_session |

@AFW-3213 @EN-CA
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (CA)
    Examples:
      | Ticket   | OfferKey     |
      | AFW-3213 | 21day_reboot |

@AFW-3215 @EN-CA
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (CA)
    Examples:
      | Ticket   | OfferKey          |
      | AFW-3215 | 6_week_challenge |

@AFW-3989 @EN-CA
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (CA)
    # AFW-3989 — Join for $1 Fall Membership national offer (EN-CA)
    Examples:
      | Ticket   | OfferKey                      |
      | AFW-3989 | join_1_dollar_fall_membership |

@AFW-3842 @PH
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (PH)
    # AFW-3842 — Philippines Student Membership
    Examples:
      | Ticket   | OfferKey            |
      | AFW-3842 | student_membership  |

@AFW-3843 @PH
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (PH)
    # AFW-3843 — Philippines Senior Citizen Membership
    Examples:
      | Ticket   | OfferKey                   |
      | AFW-3843 | senior_citizen_membership  |

@AFW-3844 @PH
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (PH)
    # AFW-3844 — Philippines PWD Membership
    Examples:
      | Ticket   | OfferKey        |
      | AFW-3844 | pwd_membership  |

@AFW-3845 @PH
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (PH)
    # AFW-3845 — Philippines Pre-Sale Membership
    Examples:
      | Ticket   | OfferKey             |
      | AFW-3845 | pre_sale_membership  |

@AFW-3846 @PH
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (PH)
    # AFW-3846 — Philippines Refresh Membership
    Examples:
      | Ticket   | OfferKey            |
      | AFW-3846 | refresh_membership  |

@AFW-3847 @PH
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (PH)
    # AFW-3847 — Philippines Welcome Pack
    Examples:
      | Ticket   | OfferKey     |
      | AFW-3847 | welcome_pack |

    @AFW-3210 @FR-CA
    # title-format: Verify Local Offer CMS and website smoke checklist for ticket <Ticket> offer <OfferKey> (FR-CA)
    Examples:
      | Ticket   | OfferKey                        |
      | AFW-3210 | free_training_experience_frca |

  # AFW-3811 — one-pass Book a Visit addon copy (Testpad #11–16). Covers TC-K019 + TC-K025.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-K019 @TC-K025 @Regression 
  Scenario Outline: Consolidated — AFW-3811 Book a Visit Local Offer schedule and See You Soon copy
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user submits the Local Offer form with valid data
    Then The schedule page heading and text description are displayed for Local Offer
    When The user selects a date and time in the schedule picker for Local Offer
    Then The booking confirmation message and appointment details are displayed for Local Offer

    @US
    Examples:
      | OfferKey     |
      | one_day_pass |

    @AU
    Examples:
      | OfferKey        |
      | two_months_free |

    @GB
    Examples:
      | OfferKey        |
      | seven_day_trial |

    @IE
    Examples:
      | OfferKey           |
      | four_weeks_for_eu4 |

@EN-CA
    # title-format: for offer <OfferKey> (EN-CA)
    Examples:
      | OfferKey     |
      | 21day_reboot |

    @FR-CA
    # title-format: for offer <OfferKey> (FR-CA)
    Examples:
      | OfferKey                      |
      | join_1_dollar_fall_membership |

  # AFW-3440 — Local Offer lead source normalization on submit (Tickets: US, SG).
  # Matrix: https://docs.google.com/spreadsheets/d/1FoKzz7bJ4hZ4yQgJFU46hPciaShXCuoMmqckvgr2edo
  # Run: FEATURE=AFW-3440 TAG=US LOCALE=EN-US NODE_ENV=SIT npm run test:multi-locale:feature
  @AFW-3440 @LocalOffer @desktop @Regression
  Scenario Outline: AFW-3440 Local Offer normalizes lead source code on prospect submit
    Given The user opens the "<OfferKey>" Local Offer for "open" gym
    When The AFW-3440 Local Offer lead source code is overridden to "<Input>"
    And The user submits the Local Offer form with valid data
    Then The AFW-3440 prospect origin_source equals "<Expected>"

    @US
    Examples:
      | OfferKey          | Input                    | Expected             |
      | join_get_40_offer | Website-Local-ABC123     | Website-Local-ABC123 |
      | join_get_40_offer | Website-Event-ABC123_DC | Website-Local-ABC123 |
      | join_get_40_offer | Website-Event-ABC123     | Website-Local-ABC123 |
      | join_get_40_offer | Website-Local-ABC123_DC | Website-Local-ABC123 |
      | join_get_40_offer | Website-Test-ABC123      | Website-Test-ABC123  |
      | join_get_40_offer | Website-Local-ABC 123   | Website-Local-ABC123 |
      | join_get_40_offer | Website-Local-ABC#123    | Website-Local-ABC123 |

    @SG
    Examples:
      | OfferKey     | Input                    | Expected             |
      | welcome_pack | Website-Local-ABC123     | Website-Local-ABC123 |
      | welcome_pack | Website-Event-ABC123_DC | Website-Local-ABC123 |
      | welcome_pack | Website-Event-ABC123     | Website-Local-ABC123 |
      | welcome_pack | Website-Local-ABC123_DC | Website-Local-ABC123 |
      | welcome_pack | Website-Test-ABC123      | Website-Test-ABC123  |

  # --- AFW-4104: Location Searched / Location Selected CMS offer_name + offer_type (US Rudderstack) ---
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-4104
  # Run: $env:FEATURE="LocalOffer"; $env:TAG="AFW-4104"; $env:NODE_ENV="SIT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature

  @AFW-4104 @US @desktop @Regression
  Scenario Outline: Verify Location Searched includes CMS offer fields on Local Offer
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user opens location search on the Local Offer
    And The user searches a valid location in the Local Offer location search
    Then The Location Searched Rudderstack event is triggered for "Local Offer" with CMS offer fields and search success "true"

    Examples:
      | OfferKey     |
      | one_day_pass |

  @AFW-4104 @US @desktop @Regression
  Scenario Outline: Verify Location Selected includes CMS offer fields on Local Offer
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user opens location search on the Local Offer
    And The user searches a valid location in the Local Offer location search
    And The user selects a gym from the Local Offer location search results
    Then The Location Selected Rudderstack event is triggered for "Local Offer" with CMS offer fields

    Examples:
      | OfferKey     |
      | one_day_pass |

  @AFW-4104 @US @desktop @Regression
  Scenario Outline: Verify Form Started and Lead Captured include CMS offer fields after Local Offer location search
    Given Rudderstack validation is enabled for AFW-4104
    And Rudderstack validation is enabled for Local Offer
    And The user opens the "<OfferKey>" Local Offer for "open" gym
    When The user opens location search on the Local Offer
    And The user searches a valid location in the Local Offer location search
    And The user selects a gym from the Local Offer location search results
    When The user interacts with the lead form on the Local Offer
    Then The Form Started Rudderstack event is triggered on the Local Offer
    When The user submits the Local Offer form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified on the Local Offer

    Examples:
      | OfferKey     |
      | one_day_pass |
