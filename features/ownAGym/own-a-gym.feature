@OwnAGym
Feature: Own A Gym
  The Own A Gym feature allows users to submit an enquiry form to express
  their interest in owning an Anytime Fitness franchise.

  # Source of truth: Own A Gym Flow tab â€” TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Own A Gym YES for AU, AE, SA, ZA, GB, IE, IN, AT, DE, IT
  # Scenario locale tags: include Coverage YES locales under test (AU uses Franconnect AU form).
  # Checklist: .cursor/knowledge-base/scenario-checklist-own-a-gym.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-N00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # EN-IE / EN-AU use Franconnect iframes (not React franchise-leads). Validations are
  # alert()-based; alpha / max-length / phone-format checks from the React form are not
  # always enforced. EN-AU also requires address / suburb / state / postcode
  # Franconnect field markers (input#emailID / input#mobile), not iframe presence alone.
  # Run: $env:FEATURE="OwnAGym"; $env:TAG="AE"; $env:LOCALE="EN-AE"; npm run test:multi-locale:feature
  # IE:  $env:FEATURE="OwnAGym"; $env:TAG="IE"; $env:LOCALE="EN-IE"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="OwnAGymConsolidatedPass" or --grep @OwnAGymConsolidatedPass

  Background: Navigate to page
    Given The user is on "Own A Gym" page

  @TC-N001 @REGULAR  @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message for non-alphabetic characters in first name and last name fields in Own A Gym
    When The user enters "123$" in the first name field in the Own A Gym
    And The user enters "Test456" in the last name field in the Own A Gym
    And The user submits the Own A Gym form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Own A Gym

  @TC-N002 @REGULAR   @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message when the email format is invalid in Own A Gym
    When The user enters "john.doe@example" in the email field in the Own A Gym
    And The user submits the Own A Gym form
    Then The email validation error is displayed in the Own A Gym

  @TC-N003 @REGULAR  @PhoneNumber @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message when the phone number format is invalid in Own A Gym
    When The user enters invalid number in the phone number field in the Own A Gym
    And The user submits the Own A Gym form
    Then The phone number validation error is displayed in the Own A Gym

  @TC-N004 @REGULAR  @PhoneNumber @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verifies the phone number field is accepted when filled via autofill in Own A Gym
    When The user autofills the phone number field in the Own A Gym
    And The user submits the Own A Gym form
    Then The phone number field is accepted in the Own A Gym

  @TC-N005 @REGULAR  @PhoneNumber @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verifies the phone number field is accepted when filled via copy and paste in Own A Gym
    When The user copies and pastes a valid number into the phone number field in the Own A Gym
    And The user submits the Own A Gym form
    Then The phone number field is accepted in the Own A Gym

  @TC-N006 @REGULAR  @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message for first name and last name fields when the character limit is exceeded in Own A Gym
    When The user enters more than 30 characters in the "first name" field in the Own A Gym
    And The user enters more than 30 characters in the "last name" field in the Own A Gym
    And The user submits the Own A Gym form
    Then The maximum length validation error is displayed for the first and last name fields in the Own A Gym

  @TC-N007 @REGULAR  @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Displays error message when user submits form with empty fields in Own A Gym
    When The user submits the Own A Gym form with empty fields
    Then The required field error is shown for all input fields in the Own A Gym user form

  @TC-N008 @REGULAR  @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Successful form submission in Own a Gym
    When The user submits the form in the Own a Gym
    Then The thank you page is displayed on successful submission of the Own a Gym form

  # AFW-3956 ticket — franchise_general Lead Captured. Coverage US=NO and EN-US Local Config
  # has no OwnAGym fields; Given soft-skips rather than inventing test-data.
  @AFW-3956 @REGULAR @US @desktop
  Scenario: Verify Lead Captured and Identity Rudderstack after Own A Gym submit
    Given Rudderstack validation is enabled for Own A Gym
    When The user submits the form in the Own a Gym
    Then The Lead Captured and Identity Rudderstack events are verified in Own A Gym

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-N001â€“N008 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="OwnAGymConsolidatedPass"; $env:TAG="AE"; $env:LOCALE="EN-AE"; npm run test:multi-locale:feature
  # Note: FEATURE=OwnAGym also matches these (feature-level tag inheritance).
  # EN-IE Franconnect: alpha / max-length / phone-format may not match React form (same Notes as sheet TCs).

  @OwnAGymConsolidatedPass @AFW-3657 @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated â€” form required fields
    When The user submits the Own A Gym form with empty fields
    Then The required field error is shown for all input fields in the Own A Gym user form

  @OwnAGymConsolidatedPass @AFW-3657 @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @PhoneNumber @desktop @AFW-3659 @EN-MY
  Scenario: Consolidated â€” form invalid fields
    When The user enters "123$" in the first name field in the Own A Gym
    And The user enters "Test456" in the last name field in the Own A Gym
    And The user enters "john.doe@example" in the email field in the Own A Gym
    And The user enters invalid number in the phone number field in the Own A Gym
    And The user submits the Own A Gym form
    Then The non-alphabetic validation error is displayed for the first and last name fields in the Own A Gym
    And The email validation error is displayed in the Own A Gym
    And The phone number validation error is displayed in the Own A Gym

  @OwnAGymConsolidatedPass @AFW-3657 @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated â€” first and last name maximum length validation
    When The user enters more than 30 characters in the "first name" field in the Own A Gym
    And The user enters more than 30 characters in the "last name" field in the Own A Gym
    And The user submits the Own A Gym form
    Then The maximum length validation error is displayed for the first and last name fields in the Own A Gym

  @OwnAGymConsolidatedPass @AFW-3657 @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated â€” phone autofill and copy-paste acceptance
    When The user autofills the phone number field in the Own A Gym
    And The user submits the Own A Gym form
    Then The phone number field is accepted in the Own A Gym
    When The user copies and pastes a valid number into the phone number field in the Own A Gym
    And The user submits the Own A Gym form
    Then The phone number field is accepted in the Own A Gym

  @OwnAGymConsolidatedPass @AFW-3657 @AU @NZ @GB @IE @AE @IN @SA @ZA @DE @AT @IT @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated â€” successful form submission
    When The user submits the form in the Own a Gym
    Then The thank you page is displayed on successful submission of the Own a Gym form
