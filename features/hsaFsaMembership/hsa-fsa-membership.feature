@HsaFsaMembership
Feature: HSA-FSA
  As a prospective customer,
  I want to search for nearby gyms
  So that I can learn more about the gym, explore available facilities, and decide on membership

  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-J00x)@REGULAR + Feature Tag + Supported Locales (@US).
  # Run: $env:FEATURE="HsaFsaMembership"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="HsaFsaMembershipConsolidatedPass" or --grep @HsaFsaMembershipConsolidatedPass

  Background: Navigate to page
    Given The user is on "HSA-FSA" page

  #Location Search
  @TC-J001 @REGULAR  @US
  Scenario: Display error message when the user searches an invalid location in the location search in HSA-FSA
    When The user searches an invalid location in the HSA-FSA location search
    Then The invalid location error message is displayed in the HSA-FSA location search

  @TC-J002 @REGULAR  @US
  Scenario: Display message when no nearby gyms are found in the searched location in HSA-FSA
    When The user searches for a location with no nearby gyms in the HSA-FSA location search
    Then The no nearby locations error is displayed in the HSA-FSA location search

  @TC-J003 @REGULAR  @US
  Scenario: Gym search results are displayed sorted by distance and limited to 10 results in HSA-FSA
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    Then The system displays HSA-FSA gym results sorted by distance
    And Only max 10 results are shown in the HSA-FSA gym search results

  @TC-J004 @REGULAR  @US
  Scenario: Display search results when the user searches a valid location by city and state in HSA-FSA
    When The user searches for the "Locale Based" location in the HSA-FSA location search
    Then The gym search results for that location is displayed in HSA-FSA

  @TC-J005 @REGULAR  @US
  Scenario: Display search results when the user searches a valid location by postal code in HSA-FSA
    When The user searches for the location with postal code in the HSA-FSA location search
    Then The gym search results for that postal code is displayed in HSA-FSA

  @TC-J006 @REGULAR  @US
  Scenario: Gym details button is displayed in search results in HSA-FSA
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    Then The GYM DETAILS button is displayed in the HSA-FSA search results for the gym

  @TC-J007 @REGULAR  @US
  Scenario: Clicking Gym details button should redirect to Local Landing Page
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    When The GYM DETAILS button in the search results is clicked
    Then The page should redirect to the Local Landing Page

  @TC-J008 @REGULAR  @US
  Scenario: Join Now button is displayed in search results in HSA-FSA
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    Then The JOIN NOW button is displayed in the HSA-FSA search results for the gym

  @TC-J009 @REGULAR  @US
  Scenario: Clicking Join Now button should redirect to Plans Page
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    When The JOIN NOW button in the search results is clicked
    Then The page should redirect to the Plans Page

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-J001–J009 above. These stack compatible checks to reduce navigations.
  # Run alone: $env:FEATURE="HsaFsaMembershipConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=HsaFsaMembership also matches these (feature-level tag inheritance).

  @HsaFsaMembershipConsolidatedPass @US @Regression @Smoke @batch-3
  Scenario: Consolidated — valid city/state search, sorted results, and GYM DETAILS / JOIN NOW buttons
    When The user searches for the "Locale Based" location in the HSA-FSA location search
    Then The system displays HSA-FSA gym results sorted by distance
    And Only max 10 results are shown in the HSA-FSA gym search results
    And The gym search results for that location is displayed in HSA-FSA
    And The GYM DETAILS button is displayed in the HSA-FSA search results for the gym
    And The JOIN NOW button is displayed in the HSA-FSA search results for the gym

  @HsaFsaMembershipConsolidatedPass @US @Regression @Smoke @batch-3
  Scenario: Consolidated — invalid location search
    When The user searches an invalid location in the HSA-FSA location search
    Then The invalid location error message is displayed in the HSA-FSA location search

  @HsaFsaMembershipConsolidatedPass @US @Regression @Smoke @batch-3
  Scenario: Consolidated — no nearby gym search
    When The user searches for a location with no nearby gyms in the HSA-FSA location search
    Then The no nearby locations error is displayed in the HSA-FSA location search

  @HsaFsaMembershipConsolidatedPass @US @Regression @Smoke @batch-3
  Scenario: Consolidated — valid postal code search
    When The user searches for the location with postal code in the HSA-FSA location search
    Then The gym search results for that postal code is displayed in HSA-FSA

  @HsaFsaMembershipConsolidatedPass @US @Regression @Smoke @batch-3
  Scenario: Consolidated — Gym Details redirects to Local Landing Page
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    When The GYM DETAILS button in the search results is clicked
    Then The page should redirect to the Local Landing Page

  @HsaFsaMembershipConsolidatedPass @US @Regression @Smoke @batch-3
  Scenario: Consolidated — Join Now redirects to Plans Page
    Given The user searches for the "Locale Based" location in the HSA-FSA location search
    When The JOIN NOW button in the search results is clicked
    Then The page should redirect to the Plans Page
