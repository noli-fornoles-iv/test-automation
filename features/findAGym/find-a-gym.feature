@FindAGym
Feature: Find A Gym

  # Source of truth: Find A Gym Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Gym-finder map page: /find-gym (iframe #find-gym-iframe). Directory page: /locations.
  # AFW-3876: iframe postMessage redirects target /locations (not /find-gym).
  # Checklist: .cursor/knowledge-base/scenario-checklist-find-a-gym.md
  #
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-S00x @REGULAR) + Feature Tag + Supported Locales from Flow tab. @AFW-3659 @EN-MY
  # Run: $env:FEATURE="FindAGym"; $env:TAG="US"; $env:NODE_ENV="SIT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature
  # Optional 1-pass: FEATURE="FindAGymConsolidatedPass" or --grep @FindAGymConsolidatedPass / @AFW-3876 @AFW-3659 @EN-MY

 @TC-S001 @AFW-3663 @REGULAR @US @AU @AE @GB @IE @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Search nearest AF Locations
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    Then The Find A Gym page displays nearby gym search results

 @TC-S002 @AFW-3663 @REGULAR @desktop @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that user redirects to location by clicking the pin location on desktop
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a map pin on the Find A Gym map
    And The user clicks Visit Website in the Find A Gym map pin popup
    Then The page should redirect to the local gym location page from Find A Gym

 @TC-S003 @AFW-3663 @REGULAR @desktop @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify that user redirects to google by clicking get directions on desktop
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a map pin on the Find A Gym map
    And The user clicks Get Directions in the Find A Gym map pin popup
    Then The user should be redirected to Google Maps from Find A Gym

 @TC-S004 @AFW-3663 @REGULAR @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: User search invalid location
    Given The user is on "Find Gym" page
    When The user searches an invalid location in Find A Gym
    Then The invalid location error is displayed in Find A Gym

 @TC-S005 @AFW-3663 @REGULAR @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: User search No Nearby AF location
    Given The user is on "Find Gym" page
    When The user searches for a location with no nearby gyms in Find A Gym
    Then The no nearby locations message is displayed in Find A Gym

 @TC-S006 @AFW-3663 @REGULAR @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify View All Location link is not displayed
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    Then The View All Location link is not displayed on Find A Gym

 @TC-S007 @AFW-3663 @REGULAR @desktop @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify user clicks location name in maps on desktop
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a map pin on the Find A Gym map
    And The user clicks the location name in the Find A Gym map pin popup
    Then The page should redirect to the local gym location page from Find A Gym

  @TC-S008 @AFW-3663 @REGULAR @US @AU @AE @GB @IE @EN-CA @FR-CA @ZH-HK @IN @SA @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Verify user clicks gym location on the list
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a gym location on the Find A Gym results list
    Then The page should redirect to the local gym location page from Find A Gym

  # --- AFW-3952: Gym map Location Searched (form_type=map) ---
  # Same Location Search verification pattern as lead flows (success / invalid).
  # Clear deeplink + Local Config Secondary zip so typed search is not shadowed by
  # IP auto near test_location_id / Default 55128 (live often tags that path as ip_address).
  @AFW-3952 @FindAGym @US @desktop @Regression
  Scenario: Verify Location Searched fires on successful Find A Gym map search
    Given The user is on "Find Gym" page
    And Rudderstack validation is enabled for AFW-3952
    When The user searches a Local Config secondary postal code in Find A Gym for Location Searched
    Then The Location Searched Rudderstack event is triggered for "Find A Gym" with search success "true"

  @AFW-3952 @FindAGym @US @desktop @Regression
  Scenario: Verify Location Searched fires with search_success false for invalid Find A Gym search
    Given The user is on "Find Gym" page
    And Rudderstack validation is enabled for AFW-3952
    When The user searches an invalid location in Find A Gym
    Then The Location Searched Rudderstack event is triggered for "Find A Gym" with search success "false"

  # --- AFW-3303 Page view lead_funnel_viewed false (map) ---
  @AFW-3303 @FindAGym @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed false on Find A Gym
    Given The user is on "Find Gym" page
    And Rudderstack validation is enabled for AFW-3303
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Find A Gym" with lead_funnel_viewed "false"

  # AFW-4088 LLP: /locations/{localGym} page view must include location_name with location_id
  @AFW-3303 @AFW-4088 @FindAGym @US @desktop @Regression
  Scenario: Verify page view location_name accompanies location_id on Local Gym
    Given The user is on "Local Gym" page
    And Rudderstack validation is enabled for AFW-3303
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Local Gym" with lead_funnel_viewed "false"

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-S001–S008 above. These stack compatible checks to reduce navigations.
  # AFW-3876 Testpad: https://outliantteam.testpad.com/script/27397/report?auth=d41312c840c41ef7ba7cc1c570dd6978
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-3876
  # Run alone: $env:FEATURE="FindAGymConsolidatedPass"; $env:TAG="US"; $env:LOCALE="EN-US"; $env:NODE_ENV="SIT"; npm run test:multi-locale:feature

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-3 @US @AU @AE @GB @IE @IN @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Find A Gym search nearest, invalid, and no nearby
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    Then The Find A Gym page displays nearby gym search results
    And The View All Location link is not displayed on Find A Gym
    When The user searches an invalid location in Find A Gym
    Then The invalid location error is displayed in Find A Gym
    When The user searches for a location with no nearby gyms in Find A Gym
    Then The no nearby locations message is displayed in Find A Gym

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-3 @desktop @US @AU @AE @GB @IE @IN @SA @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Find A Gym map pin Visit Website and Get Directions
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a map pin on the Find A Gym map
    And The user clicks Visit Website in the Find A Gym map pin popup
    Then The page should redirect to the local gym location page from Find A Gym
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a map pin on the Find A Gym map
    And The user clicks Get Directions in the Find A Gym map pin popup
    Then The user should be redirected to Google Maps from Find A Gym

  @FindAGymConsolidatedPass @AFW-3663 @Regression @Smoke @batch-3 @desktop @US @AU @AE @GB @IE @EN-CA @FR-CA @ZH-HK @IN @SA @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — Find A Gym list and map location name redirect to Local Gym
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a gym location on the Find A Gym results list
    Then The page should redirect to the local gym location page from Find A Gym
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    And The user clicks a map pin on the Find A Gym map
    And The user clicks the location name in the Find A Gym map pin popup
    Then The page should redirect to the local gym location page from Find A Gym

  # --- AFW-3876 Testpad (script 27397) — full coverage in this feature ---
  # https://outliantteam.testpad.com/script/27397/report?auth=d41312c840c41ef7ba7cc1c570dd6978
  # https://purposebrands.atlassian.net/browse/AFW-3876
  # Map:
  #  2–3,6  Shared nav/footer /find-gym → /locations
  #  5      Inactive events /find-gym → /locations
  #  8–9    View all nearby / Display all nearby CTA → /locations
  #  10     Near Me (geolocation) select → /locations
  #  12–13  Local Offer missing / invalid location_id → /locations
  #  14     Find Your Location Searchbar select → /locations
  #  16–20  Locale prefix + no intermediate /find-gym hop (asserted on every AFW scenario)
  #  18     Umbrella: Widget + Searchbar + Local Offer all target /locations
  #  21     Automation scripts assert /locations (this feature + Location Search updates)
  # Run: FEATURE="FindAGymConsolidatedPass" or --grep @AFW-3876 @AFW-3659 @EN-MY

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3876 @Regression @Smoke @batch-3 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — Nav and footer Find a Gym links redirect to /locations
    # Testpad 2, 3, 6
    Given The user is on "Home" page
    When The user clicks the Find a Gym link in the navigation for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    And The redirect URL includes the correct locale prefix for /locations
    Given The user is on "Home" page
    When The user clicks the Find a Gym link in the footer for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    And The redirect URL includes the correct locale prefix for /locations

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3876 @Regression @Smoke @batch-3 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — Locations Widget Display/View all nearby CTA redirects to /locations
    # Testpad 8, 9
    Given The static location search IP geolocation is mocked for the current locale
    And The user is on "Home" page
    And The static location search widget is ready
    When The user clicks Display all nearby locations on the Locations Widget for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    And The redirect URL includes the correct locale prefix for /locations

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3876 @Regression @Smoke @batch-3 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — Near Me geolocation selection redirects to /locations
    # Testpad 10
    Given The static location search IP geolocation is mocked for the current locale
    And The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is granted for the static location search for /locations redirect
    When The user selects Near Me geolocation on the Locations Widget for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    And The redirect URL includes the correct locale prefix for /locations

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3876 @Regression @Smoke @batch-3 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — Find Your Location Searchbar select redirects to /locations
    # Testpad 14 (+ 16–20)
    Given The static location search IP geolocation is mocked for the current locale
    And The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    And The redirect URL includes the correct locale prefix for /locations

  # Local Offer Coverage = NO for AE/SA — do not tag those locales (offer hosts 404).
  @FindAGymConsolidatedPass @AFW-3663 @AFW-3876 @Regression @Smoke @batch-3 @US @AU @ZA @IN @IE @EN-CA @FR-CA @ZH-HK @GB @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — Local Offer missing and invalid location_id redirect to /locations
    # Testpad 12, 13 — use the same Local Offer host as local-offer.feature
    # (/{locale}/offer/local/...; origin fallback only if iframe missing). IT root
    # /offer/local/... 404s on SIT/PROD. React redirects to /locations; locale-prefix
    # on /locations is covered by Widget/Searchbar scenarios.
    When The user opens Local Offer without a location_id for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    When The user opens Local Offer with an invalid location_id for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop

  @FindAGymConsolidatedPass @AFW-3876 @Regression @Smoke @batch-3 @US @GB @IE
  Scenario: Consolidated — Inactive events Find a Gym redirects target /locations
    # Testpad 5, 6 — Events Free Trial Pass Coverage YES locales only (EN-CA = NO)
    Given The user is on "Events Free Trial Pass" page
    When The user follows an inactive or Find a Gym event redirect for /locations
    Then The page redirects directly to /locations without a /find-gym hop
    And The redirect URL includes the correct locale prefix for /locations

  @FindAGymConsolidatedPass @AFW-3663 @AFW-3876 @Regression @Smoke @batch-3 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @DE @AT @IT @AFW-3659 @EN-MY
  Scenario: Consolidated — iframe flows (Widget, Searchbar, Local Offer) all land on /locations without /find-gym hop
    # Testpad 17, 18, 19, 20 (umbrella across React iframe flows)
    Given The static location search IP geolocation is mocked for the current locale
    And The user is on "Home" page
    And The static location search widget is ready
    When The user clicks Display all nearby locations on the Locations Widget for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    Given The static location search IP geolocation is mocked for the current locale
    And The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop
    When The user opens Local Offer without a location_id for /locations redirect
    Then The page redirects directly to /locations without a /find-gym hop

  # --- AFW-3607: UK + IE Find Gym CTA = CONTACT US → /email-club?location_id= ---
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-3607
  # Playbook: .cursor/skills/af-automation-agent/tickets/AFW-3607.md

  @AFW-3607 @FindAGym @GB @IE @Regression @Smoke @batch-3 @desktop
  Scenario: Verify Find A Gym gym CTA is CONTACT US to email-club for GB IE
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    Then The Find A Gym primary gym CTA is CONTACT US
    When The user clicks the Find A Gym CONTACT US CTA
    Then The page redirects to email-club with a location_id from Find A Gym

  @FindAGymConsolidatedPass @AFW-3607 @Regression @Smoke @batch-3 @desktop @GB @IE
  Scenario: Consolidated — AFW-3607 Find A Gym CONTACT US to email-club
    Given The user is on "Find Gym" page
    When The user searches for the nearest AF location in Find A Gym
    Then The Find A Gym primary gym CTA is CONTACT US
    When The user clicks the Find A Gym CONTACT US CTA
    Then The page redirects to email-club with a location_id from Find A Gym
