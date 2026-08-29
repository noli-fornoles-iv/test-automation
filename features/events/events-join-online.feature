@EventsJoinOnline
Feature: Events Join Online

  # Source of truth: Events Join Online Flow tab â€” TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Coverage: Events Join Online YES for US only
  # Checklist: .cursor/knowledge-base/scenario-checklist-events-join-online.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-D00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="EventsJoinOnline"; $env:TAG="US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="EventsJoinOnlineConsolidatedPass" or --grep @EventsJoinOnlineConsolidatedPass
  # AFW-3811 note: Events Join Online has no React BAT lead/schedule/See You Soon surface (Join Online â†’ plans).
  # Book a Visit copy is covered via Event Book A Tour / FTP / MI addon paths instead.

  Background: Navigate to Events Join Online
    Given The user is on "Events Join Online" page

  # --- Events Free Join Now Find Your Gym ---

  @TC-D001 @REGULAR @US @NZ
  Scenario: Verify Events Join Now Find A Gym heading and description are correct
    Then The heading and description are displayed correctly in the Events Join Online page
    And The search box placeholder is displayed correctly in the Events Join Online page

  @TC-D002 @REGULAR @US @NZ
  Scenario: Verify Find Your Gym is correct
    Then The Find Your Gym heading is displayed correctly in the Events Join Online page

  @TC-D003 @REGULAR @US @NZ
  Scenario: Verify Use Current Location is visible and correct
    Then The Use Current Location button is visible and correct in the Events Join Online page

  @TC-D004 @REGULAR @US @NZ
  Scenario: Verify location search functionality with a valid search scenario
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The JOIN ONLINE button is displayed in the Events Join Online page search results for that gym

  @TC-D005 @REGULAR @US @NZ
  Scenario: Verify location search functionality with a no nearby gym search scenario
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @TC-D006 @REGULAR @US @NZ
  Scenario: Verify clicking LIST and MAP correctly switches tabs
    When The user searches for the "Locale Based" location in the Events page location search
    Then The LIST and MAP tabs switch correctly in the Events Join Online page
    And The JOIN ONLINE button is displayed in the Events Join Online page search results for that gym

  @TC-D007 @REGULAR @US @NZ
  Scenario: Verify Use Current Location is visible and correct after location search
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Use Current Location button is visible and correct in the Events Join Online page

  @TC-D008 @REGULAR @US @NZ
  Scenario: Verify "LET'S GET YOU TO THE RIGHT PLACE." section is correct
    Then The Let's Get You To The Right Place section is displayed correctly in the Events Join Online page

  @TC-D009 @REGULAR @US @NZ
  Scenario: Verify Clicking JOIN ONLINE button in Events Join Online search results opens Join Anytime Fitness page in a new tab
    When The user searches for the "Locale Based" location in the Events page location search
    And The user clicks the JOIN ONLINE button for the gym in the Events page
    Then The Join Anytime Fitness page is opened from the Events Join Online flow

  @TC-D010 @REGULAR @US
  Scenario: Verify locations with Online Signup disabled do not show in Events Join Online search results
    When The user searches for the OSU Disabled location with postal code in the Events page location search
    Then The gym search results for the postal code with Online Signup disabled are not displayed in the Events page

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-D001â€“D010 above. These stack compatible checks to reduce navigations.
  # No @TC-* / / â€” smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="EventsJoinOnlineConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=EventsJoinOnline also matches these (feature-level tag inheritance).

  @EventsJoinOnlineConsolidatedPass @AFW-3657 @US @NZ @Regression @Smoke @batch-1   
  Scenario: Consolidated â€” Find Your Gym landing, valid search, LIST/MAP, and JOIN ONLINE new tab
    Then The heading and description are displayed correctly in the Events Join Online page
    And The search box placeholder is displayed correctly in the Events Join Online page
    And The Find Your Gym heading is displayed correctly in the Events Join Online page
    And The Use Current Location button is visible and correct in the Events Join Online page
    And The Let's Get You To The Right Place section is displayed correctly in the Events Join Online page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The system displays Events page gym results sorted by distance
    And Only max 10 results are shown in the Events page gym search results
    And The gym search results for that location is displayed in the Events page
    And The LIST and MAP tabs switch correctly in the Events Join Online page
    And The JOIN ONLINE button is displayed in the Events Join Online page search results for that gym
    And The Use Current Location button is visible and correct in the Events Join Online page
    When The user clicks the JOIN ONLINE button for the gym in the Events page
    Then The Join Anytime Fitness page is opened from the Events Join Online flow

  @EventsJoinOnlineConsolidatedPass @AFW-3657 @US @NZ @Regression @Smoke @batch-1 
  Scenario: Consolidated â€” no nearby gym search
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @EventsJoinOnlineConsolidatedPass @AFW-3657 @US @Regression @Smoke @batch-1 
  Scenario: Consolidated â€” Online Signup disabled locations are excluded from search results
    When The user searches for the OSU Disabled location with postal code in the Events page location search
    Then The gym search results for the postal code with Online Signup disabled are not displayed in the Events page
