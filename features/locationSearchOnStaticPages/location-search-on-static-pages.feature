@LocationSearchOnStaticPages @desktop @android
Feature: Location Search on static pages

  # Source of truth: Location Search on static pages Flow tab — TC coverage = YES
  # https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg/edit
  # Checklist: .cursor/knowledge-base/scenario-checklist-location-search-on-static-pages.md
  # Devices: @desktop + @android (iPhone excluded by project grep)
  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-V0xx @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="LocationSearchOnStaticPages"; $env:TAG="US"; $env:NODE_ENV="UAT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="LocationSearchOnStaticPagesConsolidatedPass" or --grep @LocationSearchOnStaticPagesConsolidatedPass @Regression @Smoke @batch-2
  # AFW-3876: iframe/widget select-location redirects target /locations (not /find-gym).

  Background:
    Given The static location search IP geolocation is mocked for the current locale

 @TC-V001 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify three nearest AF locations display based on user's IP
    Given The user is on "Home" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations

 @TC-V002 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify location access prompt appears after clicking "Use my precise location"
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user clicks Use my precise location on the static location search
    Then The browser location access prompt is triggered for static location search

 @TC-V003 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify error message modal displays when location access is denied
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is denied for the static location search
    When The user clicks Use my precise location on the static location search
    Then The static location search shows a location access error modal

 @TC-V004 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Approximate Location city is retained after denying location access
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is denied for the static location search
    When The user clicks Use my precise location on the static location search
    Then The static location search retains approximate location and IP-based results after deny

 @TC-V005 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF locations based on IP are retained after denying location access
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is denied for the static location search
    When The user clicks Use my precise location on the static location search
    Then The static location search retains approximate location and IP-based results after deny

 @TC-V006 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Approximate Location text is removed and City & State update after allowing location access
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is granted for the static location search
    When The user clicks Use my precise location on the static location search
    Then The static location search updates results from precise geolocation

 @TC-V007 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF locations update based on user's precise geolocation after allowing access
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is granted for the static location search
    When The user clicks Use my precise location on the static location search
    Then The static location search updates results from precise geolocation

 @TC-V008 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify "Use my precise location" button remains after allowing access
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is granted for the static location search
    When The user clicks Use my precise location on the static location search
    Then The Use my precise location button remains visible on the static location search

 @TC-V009 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters (e.g. "tamp")
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V010 @AFW-3663 @REGULAR @AFW-3876 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting a location redirects to /locations
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search

 @TC-V011 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the Gym Locator search bar
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym search bar is autofilled from the static location search selection

 @TC-V012 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify map zooms in and displays the searched location
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym map displays the searched location from static location search

 @TC-V013 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 50)
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym results show nearest gyms with a maximum of 50 from static location search

 @TC-V014 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify three nearest AF locations display when user is within US on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations

 @TC-V015 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking a nearest location redirects to its Local Gym Page on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @TC-V016 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Locations Near You is hidden when user is outside US on Training Page
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Training" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @TC-V017 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V018 @AFW-3663 @REGULAR @AFW-3876 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting a location redirects to /locations on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search

 @TC-V019 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the Gym Locator search bar on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym search bar is autofilled from the static location search selection

 @TC-V020 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify map zooms in and displays the searched location on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym map displays the searched location from static location search

 @TC-V021 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 50) on Training Page
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym results show nearest gyms with a maximum of 50 from static location search

 @TC-V022 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify three nearest AF locations display when user is within US on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations

 @TC-V023 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking a nearest location redirects to its Local Gym Page on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @TC-V024 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Locations Near You is hidden when user is outside US on Fitness Consultation
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Fitness Consultation" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @TC-V025 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V026 @AFW-3663 @REGULAR @AFW-3876 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting a location redirects to /locations on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search

 @TC-V027 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the Gym Locator search bar on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym search bar is autofilled from the static location search selection

 @TC-V028 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify map zooms in and displays the searched location on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym map displays the searched location from static location search

 @TC-V029 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 50) on Fitness Consultation
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym results show nearest gyms with a maximum of 50 from static location search

 @TC-V030 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify three nearest AF locations display when user is within US on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations

 @TC-V031 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking a nearest location redirects to its Local Gym Page on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @TC-V032 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Locations Near You is hidden when user is outside US on Group Training
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Group Training" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @TC-V033 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V034 @AFW-3663 @REGULAR @AFW-3876 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting a location redirects to /locations on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search

 @TC-V035 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the Gym Locator search bar on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym search bar is autofilled from the static location search selection

 @TC-V036 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify map zooms in and displays the searched location on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym map displays the searched location from static location search

 @TC-V037 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 50) on Group Training
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym results show nearest gyms with a maximum of 50 from static location search

 @TC-V038 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify three nearest AF locations display when user is within US on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations

 @TC-V039 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking a nearest location redirects to its Local Gym Page on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @TC-V040 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Locations Near You is hidden when user is outside US on Personal Training
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Personal Training" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @TC-V041 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V042 @AFW-3663 @REGULAR @AFW-3876 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting a location redirects to /locations on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search

 @TC-V043 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the Gym Locator search bar on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym search bar is autofilled from the static location search selection

 @TC-V044 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify map zooms in and displays the searched location on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym map displays the searched location from static location search

 @TC-V045 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 50) on Personal Training
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym results show nearest gyms with a maximum of 50 from static location search

 @TC-V046 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters on Why Join / Membership
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V047 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the in-page location search bar on Why Join / Membership
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    Then The Why Join location search bar is autofilled with the selected location

 @TC-V048 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 10) on Why Join / Membership
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    Then The Why Join location results show nearest gyms with a maximum of 10

 @TC-V049 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Gym Details button redirects to the corresponding Local Gym Page on Why Join / Membership
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    And The user clicks Gym Details on the Why Join static location search
    Then The page redirects to the Local Gym Page from static location search

 @TC-V050 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Free Trial Pass button redirects to Try Us Free page on Why Join / Membership
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    And The user clicks Free Trial Pass on the Why Join static location search
    Then The page redirects to Try Us Free from static location search

 @TC-V051 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify three nearest AF locations display when user is within US on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations

 @TC-V052 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking a nearest location redirects to its Local Gym Page on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @TC-V053 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Locations Near You is hidden when user is outside US on Events Free Trial
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Events Free Trial" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @TC-V054 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify search suggestions appear after entering 3 characters on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @TC-V055 @AFW-3663 @REGULAR @AFW-3876 @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selecting a location redirects to /locations on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search

 @TC-V056 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify selected location autofills the Gym Locator search bar on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym search bar is autofilled from the static location search selection

 @TC-V057 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify map zooms in and displays the searched location on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym map displays the searched location from static location search

 @TC-V058 @AFW-3663 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify AF location results show nearest gyms (maximum 50) on Events Free Trial
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-V001–V058 above. These stack compatible checks to reduce navigations.
  # No @TC-* /  /  — smoke & regression suites stay on sheet scenarios only.
  # Run alone: $env:FEATURE="LocationSearchOnStaticPagesConsolidatedPass"; $env:TAG="US"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature
  # Note: FEATURE=LocationSearchOnStaticPages also matches these (feature-level tag inheritance).

  # --- Home ---

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Home IP nearest locations and precise location prompt
    Given The user is on "Home" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations
    When The user clicks Use my precise location on the static location search
    Then The browser location access prompt is triggered for static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Home allow precise location (results update and button remains)
    Given The user is on "Home" page
    And The static location search widget is ready
    And Geolocation permission is granted for the static location search
    When The user clicks Use my precise location on the static location search
    Then The static location search updates results from precise geolocation
    And The Use my precise location button remains visible on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Home search suggestions
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3876 @AFW-3659 @EN-MY
  Scenario: Consolidated — Home select location /locations journey
    Given The user is on "Home" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search
    And The Find A Gym search bar is autofilled from the static location search selection
    And The Find A Gym map displays the searched location from static location search
    And The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- Training ---

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Training nearest locations and Local Gym redirect
    Given The user is on "Training" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Training Locations Near You hidden outside US
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Training" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Training search suggestions
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3876 @AFW-3659 @EN-MY
  Scenario: Consolidated — Training select location /locations journey
    Given The user is on "Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search
    And The Find A Gym search bar is autofilled from the static location search selection
    And The Find A Gym map displays the searched location from static location search
    And The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- Fitness Consultation ---

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Fitness Consultation nearest locations and Local Gym redirect
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Fitness Consultation Locations Near You hidden outside US
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Fitness Consultation" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Fitness Consultation search suggestions
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3876 @AFW-3659 @EN-MY
  Scenario: Consolidated — Fitness Consultation select location /locations journey
    Given The user is on "Fitness Consultation" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search
    And The Find A Gym search bar is autofilled from the static location search selection
    And The Find A Gym map displays the searched location from static location search
    And The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- Group Training ---

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Group Training nearest locations and Local Gym redirect
    Given The user is on "Group Training" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Group Training Locations Near You hidden outside US
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Group Training" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Group Training search suggestions
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3876 @AFW-3659 @EN-MY
  Scenario: Consolidated — Group Training select location /locations journey
    Given The user is on "Group Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search
    And The Find A Gym search bar is autofilled from the static location search selection
    And The Find A Gym map displays the searched location from static location search
    And The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- Personal Training ---

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Personal Training nearest locations and Local Gym redirect
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Personal Training Locations Near You hidden outside US
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Personal Training" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Consolidated — Personal Training search suggestions
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

 @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @AFW-3661 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @ZH-HK @EN-CA @FR-CA @AFW-3876 @AFW-3659 @EN-MY
  Scenario: Consolidated — Personal Training select location /locations journey
    Given The user is on "Personal Training" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search
    And The Find A Gym search bar is autofilled from the static location search selection
    And The Find A Gym map displays the searched location from static location search
    And The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- Why Join / Membership ---

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3659 @EN-MY
  Scenario: Consolidated — Why Join search suggestions
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3659 @EN-MY
  Scenario: Consolidated — Why Join search results (autofill and max 10)
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    Then The Why Join location search bar is autofilled with the selected location
    And The Why Join location results show nearest gyms with a maximum of 10

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3659 @EN-MY
  Scenario: Consolidated — Why Join Gym Details redirects to Local Gym Page
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    And The user clicks Gym Details on the Why Join static location search
    Then The page redirects to the Local Gym Page from static location search

  @GB @IE. @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @EN-CA @FR-CA @ZH-HK @AFW-3659 @EN-MY
  # AFW-3607: EN-GB / EN-IE Free Trial Pass → Try Us Free retired — exclude @GB @IE.
  # AFW-3607: EN-GB / EN-IE Free Trial Pass → Try Us Free retired — exclude @GB @IE. @AFW-3659 @EN-MY
  Scenario: Consolidated — Why Join Free Trial Pass redirects to Try Us Free
    Given The user is on "Why Join" page
    And The static location search widget is ready
    When The user searches a valid location on the Why Join static location search
    And The user clicks Free Trial Pass on the Why Join static location search
    Then The page redirects to Try Us Free from static location search

  # --- Events Free Trial ---

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3659 @EN-MY
  Scenario: Consolidated — Events Free Trial nearest locations and Local Gym redirect
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    Then The static location search shows three nearest AF locations
    When The user clicks a nearest location on the static location search
    Then The page redirects to the Local Gym Page from static location search

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3659 @EN-MY
  Scenario: Consolidated — Events Free Trial Locations Near You hidden outside US
    Given The browser geolocation is set outside the US for static location search
    And The user is on "Events Free Trial" page
    And The static location search widget is ready
    Then Locations Near You is hidden on the static location search

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3659 @EN-MY
  Scenario: Consolidated — Events Free Trial search suggestions
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user types a 3-character location prefix on the static location search
    Then Search suggestions are displayed on the static location search

  @LocationSearchOnStaticPagesConsolidatedPass @AFW-3663 @Regression @Smoke @batch-2 @US @AU @ZA @IN @AE @SA @IE @EN-CA @FR-CA @ZH-HK @GB @AFW-3876 @AFW-3659 @EN-MY
  Scenario: Consolidated — Events Free Trial select location /locations journey
    Given The user is on "Events Free Trial" page
    And The static location search widget is ready
    When The user selects a location suggestion on the static location search
    Then The page redirects to /locations from static location search
    And The Find A Gym search bar is autofilled from the static location search selection
    And The Find A Gym map displays the searched location from static location search
    And The Find A Gym results show nearest gyms with a maximum of 50 from static location search

  # --- AFW-3559 Home Locations 2.0 CTAs (ticket automation checklist only) ---
  # Playbook: .cursor/skills/af-automation-agent/tickets/AFW-3559.md
  # Run: FEATURE=AFW-3559 or FEATURE=Afw3559ConsolidatedPass

  @AFW-3559 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @AFW-3663 @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Home Locations widget is interactive within the performance budget
    Given The user is on "Home" page
    And The static location search widget is ready
    Then The Home Locations widget is interactive within the performance budget

  @AFW-3559 @REGULAR @US @AE @SA @IT @TH @PH @SG @NZ @ID @AFW-3663 @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Home Locations Try Us Free and Join Now CTAs for default locales
    Given The user is on "Home" page
    And The Home Locations 2.0 gym cards with CTAs are ready
    Then The Home Locations primary CTA matches the locale expectation
    And The Home Locations Join Now visibility matches the locale expectation
    When The user clicks the Home Locations primary CTA
    Then The Home Locations primary CTA opens the expected destination

  @AFW-3559 @REGULAR @US @AE @SA @IT @TH @PH @SG @NZ @ID @AFW-3663 @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify Home Locations Join Now opens the CMS Join Now plans link
    Given The user is on "Home" page
    And The Home Locations 2.0 gym cards with CTAs are ready
    When The user clicks the Home Locations Join Now CTA
    Then The Home Locations Join Now CTA opens the CMS Join Now plans link

  @AFW-3559 @REGULAR @AU @GB @IE @ZA
  Scenario: Verify Home Locations Membership Enquiry replaces Try Us Free for AU GB IE
    Given The user is on "Home" page
    And The Home Locations 2.0 gym cards with CTAs are ready
    Then The Home Locations primary CTA matches the locale expectation
    And The Home Locations Join Now visibility matches the locale expectation
    When The user clicks the Home Locations primary CTA
    Then The Home Locations primary CTA opens the expected destination

  @AFW-3559 @REGULAR @IN
  Scenario: Verify Home Locations Join Now is hidden for India
    Given The user is on "Home" page
    And The Home Locations 2.0 gym cards with CTAs are ready
    Then The Home Locations primary CTA matches the locale expectation
    And The Home Locations Join Now visibility matches the locale expectation

  @AFW-3559 @REGULAR @DE @AT
  Scenario: Verify Home Locations primary CTA is PROBETRAINING not Kostenlos for DE AT
    Given The user is on "Home" page
    And The Home Locations 2.0 gym cards with CTAs are ready
    Then The Home Locations primary CTA matches the locale expectation
    And The Home Locations Join Now visibility matches the locale expectation

  @AFW-3559 @REGULAR @US @AU @ZA @IN @AE @SA @IE @GB @DE @AT @IT @TH @PH @SG @NZ @ID @AFW-3663 @ZH-HK @EN-CA @FR-CA @AFW-3659 @EN-MY
  Scenario: Verify clicking the Home Locations gym name opens the Local Gym Page
    Given The user is on "Home" page
    And The Home Locations 2.0 gym cards with CTAs are ready
    When The user clicks the Home Locations gym name
    Then The page redirects to the Local Gym Page from static location search

  @Afw3559ConsolidatedPass @AFW-3559 @Regression @Smoke @batch-2 @US @AU @GB @IE @IN @DE @AT
  Scenario: Consolidated — Home Locations 2.0 CTAs, Join Now rules, and gym name
    Given The user is on "Home" page
    And The static location search widget is ready
    Then The Home Locations widget is interactive within the performance budget
    Given The Home Locations 2.0 gym cards with CTAs are ready
    Then The Home Locations primary CTA matches the locale expectation
    And The Home Locations Join Now visibility matches the locale expectation
    When The user clicks the Home Locations gym name
    Then The page redirects to the Local Gym Page from static location search

  # --- AFW-3952: Home / Locations map Location Searched + Location Selected ---
  # Home / static search bars (not lead flows): form_* = map_general; exclude offer_*.
  # Ticket map_free_trial applies only to Gym Map "Free Trial" CTA (Find A Gym /locations) — not Home TRY US FREE.
  # Same Location Search verification pattern as lead flows (success / invalid / CTA Selected).
  # Desktop-only: Feature is @android too; Samsung project grepInvert=@AFW-3952 excludes these.
  @AFW-3952 @LocationSearchOnStaticPages @US @desktop @Regression
  Scenario: Verify Location Searched fires on successful Home Locations keyword search
    Given The user is on "Home" page
    And Rudderstack validation is enabled for AFW-3952
    And The static location search widget is ready
    When The user searches a valid location on the Home static location search
    Then The Location Searched Rudderstack event is triggered for "Home Location Search" with search success "true"

  @AFW-3952 @LocationSearchOnStaticPages @US @desktop @Regression
  Scenario: Verify Location Searched fires with search_success false for invalid Home Locations search
    Given The user is on "Home" page
    And Rudderstack validation is enabled for AFW-3952
    And The static location search widget is ready
    When The user searches an invalid location on the Home static location search
    Then The Location Searched Rudderstack event is triggered for "Home Location Search" with search success "false"

  @AFW-3952 @Afw3952ConsolidatedPass @LocationSearchOnStaticPages @US @desktop @Regression
  Scenario: Verify Location Selected fires for Home Locations primary CTA
    Given The user is on "Home" page
    And Rudderstack validation is enabled for AFW-3952
    And The Home Locations 2.0 gym cards with CTAs are ready
    When The user clicks the Home Locations primary CTA
    Then The Location Selected Rudderstack event is triggered for "Home Location Search"


