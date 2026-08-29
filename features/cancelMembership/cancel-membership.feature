@CancelMembership
Feature: Cancel Membership

  # Source of truth: Cancel Membership Flow tab — TC coverage = YES
  # Coverage: Cancel Membership YES for DE only (@DE scenarios)
  # Checklist: .cursor/knowledge-base/scenario-checklist-cancel-membership.md
  # Run: $env:FEATURE="CancelMembership"; $env:TAG="DE"; $env:LOCALE="DE-DE"; $env:NODE_ENV="SIT"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="CancelMembershipConsolidatedPass" or --grep @CancelMembershipConsolidatedPass

  Background:
    Given The user is on "Cancel Membership" page

  # --- Cancel Membership Find A Gym ---

  @TC-W001  @DE
  Scenario: Verify Location Search by IP Location
    Given Cancel Membership IP geolocation is mocked for the current locale
    When The user opens Cancel Membership location search without a preselected gym
    And The user searches for the "Locale Based" location in the Cancel Membership location search
    Then The gym search results for that location are displayed in Cancel Membership

  @TC-W002  @DE
  Scenario: Verify Location Search by Geolocation
    Given Cancel Membership IP geolocation is mocked for the current locale
    And Geolocation permission is granted for Cancel Membership
    When The user opens Cancel Membership location search without a preselected gym
    And The user clicks Use Current Location in Cancel Membership location search
    Then Cancel Membership location search shows results after geolocation

  @TC-W003  @DE
  Scenario: Verify Location Search by Search Bar
    When The user opens Cancel Membership location search without a preselected gym
    And The user searches for the "Locale Based" location in the Cancel Membership location search
    Then The gym search results for that location are displayed in Cancel Membership

  @TC-W004  @DE
  Scenario: Verify Location Search by Map Pins
    When The user opens Cancel Membership location search without a preselected gym
    And The user searches for the "Locale Based" location in the Cancel Membership location search
    And The user selects a gym from the Cancel Membership map pin
    Then The user should be redirected to the Cancel Membership form for that gym

  @TC-W005  @DE
  Scenario: Verify Empty Search Errors
    When The user opens Cancel Membership location search without a preselected gym
    And The user submits an empty Cancel Membership location search
    Then The empty location search error is displayed in Cancel Membership

  @TC-W006  @DE
  Scenario: Verify Invalid Search Error
    When The user opens Cancel Membership location search without a preselected gym
    And The user searches an invalid location in the Cancel Membership location search
    Then The invalid location error message is displayed in the Cancel Membership location search

  @TC-W007  @DE
  Scenario: Verify No AF Locations Nearby Error
    When The user opens Cancel Membership location search without a preselected gym
    And The user searches for a location with no nearby gyms in the Cancel Membership location search
    Then The no nearby locations error is displayed in the Cancel Membership location search

  @TC-W008  @DE
  Scenario: Verify Unable To Detect Location Error
    Given Cancel Membership geolocation is blocked
    When The user opens Cancel Membership location search without a preselected gym
    And The user clicks Use Current Location in Cancel Membership location search
    Then The unable to detect location error is displayed in Cancel Membership

  @TC-W009  @DE
  Scenario: Verify User IP location is outside the locale
    Given Cancel Membership browser geolocation is set outside the locale
    When The user opens Cancel Membership location search without a preselected gym
    Then Cancel Membership shows outside locale IP location message

  @TC-W010  @DE
  Scenario: Verify User denies geolocation access
    Given Cancel Membership IP geolocation is mocked for the current locale
    And Geolocation permission is denied for Cancel Membership
    When The user opens Cancel Membership location search without a preselected gym
    And The user clicks Use Current Location in Cancel Membership location search
    Then Cancel Membership retains approximate location after geolocation deny

  # --- Cancel Membership Form ---

  @TC-W011  @DE
  Scenario: Verify Cancellation Date Type (Radio Buttons)
    Given The user is on the Cancel Membership form for the default gym
    Then The cancellation date type radio buttons are displayed in Cancel Membership

  @TC-W012  @DE
  Scenario: Verify Contract Number
    Given The user is on the Cancel Membership form for the default gym
    Then The contract number field is displayed in Cancel Membership

  @TC-W013  @DE
  Scenario: Verify Cancellation Date
    Given The user is on the Cancel Membership form for the default gym
    Then The cancellation date field is displayed when specific date is selected in Cancel Membership

  @TC-W014  @DE
  Scenario: Verify Cancellation Reason
    Given The user is on the Cancel Membership form for the default gym
    Then The cancellation reason field is displayed in Cancel Membership

  @TC-W015  @DE
  Scenario: Verify Legal Disclaimer
    Given The user is on the Cancel Membership form for the default gym
    Then The legal disclaimer checkbox is displayed in Cancel Membership

  @TC-W016  @DE
  Scenario: Verify Invalid Inputs in User Form
    Given The user is on the Cancel Membership form for the default gym
    When The user enters invalid data in the Cancel Membership form
    And The user submits the Cancel Membership form
    Then The Cancel Membership form validation errors are displayed

  @TC-W017  @DE
  Scenario Outline: Verify Phone number validations, should accept both local/mobile numbers wth/without + symbol
    Given The user is on the Cancel Membership form for the default gym
    When The user enters "<phone>" in the phone number field in Cancel Membership
    And The user fills the remaining Cancel Membership required fields without submitting
    Then The phone number field is accepted in Cancel Membership

    Examples:
      | phone           |
      | 49 30 1234567   |
      | +49 30 1234567  |
      | 49 170 1234567  |
      | +49 170 1234567 |

  @TC-W018  @DE
  Scenario: Verify character limit for contract number field should be 100 characters
    Given The user is on the Cancel Membership form for the default gym
    When The user enters a contract number with 101 characters in Cancel Membership
    And The user submits the Cancel Membership form
    Then The contract number max length validation error is displayed in Cancel Membership

  @TC-W019  @DE
  Scenario: Verify character limit for Cancellation Reason field should be 5000 characters
    Given The user is on the Cancel Membership form for the default gym
    When The user enters a cancellation reason with 5001 characters in Cancel Membership
    And The user submits the Cancel Membership form
    Then The cancellation reason max length validation error is displayed in Cancel Membership

  @TC-W020  @DE
  Scenario: Verify email is triggered when form is submitted
    Given The user is on the Cancel Membership email test gym form
    When The user fills and submits the Cancel Membership form with "earliest" cancellation date
    Then The thank you page is displayed after successful Cancel Membership submission
    And The /communications API payload reflects Cancel Membership "earliest" cancellation data
    Given The user is on the Cancel Membership email test gym form
    When The user fills and submits the Cancel Membership form with "specific" cancellation date
    Then The thank you page is displayed after successful Cancel Membership submission
    And The /communications API payload reflects Cancel Membership "specific" cancellation data

  @TC-W021  @DE
  Scenario: Verify date format should be German in email dd:mm:yyyy
    Given The user is on the Cancel Membership email test gym form
    When The user fills and submits the Cancel Membership form with "specific" cancellation date
    Then The Cancel Membership communications payload termination_date uses German dd.mm.yyyy format

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-W001–W021 above. These stack compatible checks to reduce navigations.
  # No @TC-* — smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="CancelMembershipConsolidatedPass"; $env:TAG="DE"; $env:LOCALE="DE-DE"; $env:NODE_ENV="SIT"; npm run test:multi-locale:feature
  # Note: FEATURE=CancelMembership also matches these (feature-level tag inheritance).

  @CancelMembershipConsolidatedPass @Regression @Smoke @DE
  Scenario: Consolidated — search bar, map pin, and form redirect
    # TC-W001 / TC-W003 / TC-W004 compatible path
    Given Cancel Membership IP geolocation is mocked for the current locale
    When The user opens Cancel Membership location search without a preselected gym
    And The user searches for the "Locale Based" location in the Cancel Membership location search
    Then The gym search results for that location are displayed in Cancel Membership
    When The user selects a gym from the Cancel Membership map pin
    Then The user should be redirected to the Cancel Membership form for that gym

  @CancelMembershipConsolidatedPass @Regression @DE
  Scenario: Consolidated — empty, invalid, and no nearby location search errors
    # TC-W005 / TC-W006 / TC-W007
    When The user opens Cancel Membership location search without a preselected gym
    And The user submits an empty Cancel Membership location search
    Then The empty location search error is displayed in Cancel Membership
    When The user searches an invalid location in the Cancel Membership location search
    Then The invalid location error message is displayed in the Cancel Membership location search
    When The user searches for a location with no nearby gyms in the Cancel Membership location search
    Then The no nearby locations error is displayed in the Cancel Membership location search

  @CancelMembershipConsolidatedPass @Regression @DE
  Scenario: Consolidated — geolocation grant, deny, unable to detect, and outside locale
    # TC-W002 / TC-W008 / TC-W009 / TC-W010 — each needs its own geo setup + reopen
    Given Cancel Membership IP geolocation is mocked for the current locale
    And Geolocation permission is granted for Cancel Membership
    When The user opens Cancel Membership location search without a preselected gym
    And The user clicks Use Current Location in Cancel Membership location search
    Then Cancel Membership location search shows results after geolocation
    Given Cancel Membership geolocation is blocked
    When The user opens Cancel Membership location search without a preselected gym
    And The user clicks Use Current Location in Cancel Membership location search
    Then The unable to detect location error is displayed in Cancel Membership
    Given Cancel Membership browser geolocation is set outside the locale
    When The user opens Cancel Membership location search without a preselected gym
    Then Cancel Membership shows outside locale IP location message
    Given Cancel Membership IP geolocation is mocked for the current locale
    And Geolocation permission is denied for Cancel Membership
    When The user opens Cancel Membership location search without a preselected gym
    And The user clicks Use Current Location in Cancel Membership location search
    Then Cancel Membership retains approximate location after geolocation deny

  @CancelMembershipConsolidatedPass @Regression @Smoke @DE
  Scenario: Consolidated — form fields (date type, contract, date, reason, disclaimer)
    # TC-W011 / TC-W012 / TC-W013 / TC-W014 / TC-W015
    Given The user is on the Cancel Membership form for the default gym
    Then The cancellation date type radio buttons are displayed in Cancel Membership
    And The contract number field is displayed in Cancel Membership
    And The cancellation date field is displayed when specific date is selected in Cancel Membership
    And The cancellation reason field is displayed in Cancel Membership
    And The legal disclaimer checkbox is displayed in Cancel Membership

  @CancelMembershipConsolidatedPass @Regression @Smoke @DE
  Scenario: Consolidated — form invalid inputs and max-length validations
    # TC-W016 / TC-W018 / TC-W019
    Given The user is on the Cancel Membership form for the default gym
    When The user enters invalid data in the Cancel Membership form
    And The user submits the Cancel Membership form
    Then The Cancel Membership form validation errors are displayed
    Given The user is on the Cancel Membership form for the default gym
    When The user enters a contract number with 101 characters in Cancel Membership
    And The user submits the Cancel Membership form
    Then The contract number max length validation error is displayed in Cancel Membership
    Given The user is on the Cancel Membership form for the default gym
    When The user enters a cancellation reason with 5001 characters in Cancel Membership
    And The user submits the Cancel Membership form
    Then The cancellation reason max length validation error is displayed in Cancel Membership

  @CancelMembershipConsolidatedPass @Regression @Smoke @DE
  Scenario: Consolidated — phone local/mobile formats with and without +
    # TC-W017
    Given The user is on the Cancel Membership form for the default gym
    When The user enters "49 30 1234567" in the phone number field in Cancel Membership
    And The user fills the remaining Cancel Membership required fields without submitting
    Then The phone number field is accepted in Cancel Membership
    When The user enters "+49 30 1234567" in the phone number field in Cancel Membership
    Then The phone number field is accepted in Cancel Membership
    When The user enters "49 170 1234567" in the phone number field in Cancel Membership
    Then The phone number field is accepted in Cancel Membership
    When The user enters "+49 170 1234567" in the phone number field in Cancel Membership
    Then The phone number field is accepted in Cancel Membership

  @CancelMembershipConsolidatedPass @Regression @Smoke @DE
  Scenario: Consolidated — email submit earliest/specific and German termination_date format
    # TC-W020 / TC-W021
    Given The user is on the Cancel Membership email test gym form
    When The user fills and submits the Cancel Membership form with "earliest" cancellation date
    Then The thank you page is displayed after successful Cancel Membership submission
    And The /communications API payload reflects Cancel Membership "earliest" cancellation data
    Given The user is on the Cancel Membership email test gym form
    When The user fills and submits the Cancel Membership form with "specific" cancellation date
    Then The thank you page is displayed after successful Cancel Membership submission
    And The /communications API payload reflects Cancel Membership "specific" cancellation data
    And The Cancel Membership communications payload termination_date uses German dd.mm.yyyy format
