@EventsLocationSearch20 @AFW-2968
Feature: Events Location Search 2.0

  # Approved Testpad script 28435 — AFW-2968
  # Reference parity: AFW-2683 Location Search 2.0 (Testpad script 24273)
  # Run: $env:FEATURE="EventsLocationSearch20"; $env:TAG="US"; npm run test:multi-locale:feature

  # --- Events Free Trial Pass (en-us) — Location Search 2.0 UI ---

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 search field and result CTAs on desktop
    Given The user is on "Events Free Trial Pass" page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Events Location Search 2.0 search field title is displayed correctly
    And The Events Location Search 2.0 search field placeholder is displayed correctly
    And The Events Location Search 2.0 Join Now and Gym Details buttons are displayed in search results

  @AFW-2968 @US @REGULAR
  Scenario: Verify Events Location Search 2.0 search field and result CTAs on mobile
    Given The user is on "Events Free Trial Pass" page
    When The user searches for the "Locale Based" location in the Events page location search
    Then The Events Location Search 2.0 search field title is displayed correctly
    And The Events Location Search 2.0 search field placeholder is displayed correctly
    And The Events Location Search 2.0 Join Now and Gym Details buttons are displayed in search results

  # --- Events — Lead Form In-Page (LEAD_FORM) ---

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 in-page lead form copy on Free Trial Pass
    Given The user is on "Events Free Trial Pass" page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects Join Now for the "Locale Based" gym from the Events Location Search 2.0 results
    Then The Events Location Search 2.0 in-page lead form is displayed
    And The Events Location Search 2.0 lead form copy is displayed correctly

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 required fields validation on Free Trial Pass
    Given The user is on "Events Free Trial Pass" page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects Join Now for the "Locale Based" gym from the Events Location Search 2.0 results
    And The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 successful submit on Free Trial Pass
    Given The user is on "Events Free Trial Pass" page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects Join Now for the "Locale Based" gym from the Events Location Search 2.0 results
    And The user submits the Events page form with valid data
    Then The Events Location Search 2.0 lead form submission is successful

  @AFW-2968 @AU @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 in-page lead form copy on Find Your Fitphoria
    Given The user is on "Events Find Your Fitphoria" page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects Join Now for the "Locale Based" gym from the Events Location Search 2.0 results
    Then The Events Location Search 2.0 in-page lead form is displayed
    And The Events Location Search 2.0 lead form copy is displayed correctly

  @AFW-2968 @AU @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 required fields validation on Find Your Fitphoria
    Given The user is on "Events Find Your Fitphoria" page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects Join Now for the "Locale Based" gym from the Events Location Search 2.0 results
    And The user submits the Events page form with empty fields
    Then The required field error is shown for all input fields in the Events page

  @AFW-2968 @AU @desktop @REGULAR
  Scenario: Verify Events Location Search 2.0 successful submit on Find Your Fitphoria
    Given The user is on "Events Find Your Fitphoria" page
    When The user searches for the "Locale Based" location in the Events page location search
    And The user selects Join Now for the "Locale Based" gym from the Events Location Search 2.0 results
    And The user submits the Events page form with valid data
    Then The Events Location Search 2.0 lead form submission is successful

  # --- Locales — Location Search 2.0 placeholder ---

  @AFW-2968 @US @REGULAR
  Scenario: Verify Events Location Search 2.0 placeholder on en-us Free Trial Pass
    Given The user is on "Events Free Trial Pass" page
    Then The Events Location Search 2.0 search field placeholder is displayed correctly

  @AFW-2968 @AU @REGULAR
  Scenario: Verify Events Location Search 2.0 placeholder on en-au Find Your Fitphoria
    Given The user is on "Events Find Your Fitphoria" page
    Then The Events Location Search 2.0 search field placeholder is displayed correctly

  # --- Location Search — validation error messages (Events) ---

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify invalid location error message on Events Location Search 2.0
    Given The user is on "Events Free Trial Pass" page
    When The user searches an invalid location in the Events page location search
    Then The invalid location error message is displayed in the Events page location search

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify no nearby locations error message on Events Location Search 2.0
    Given The user is on "Events Free Trial Pass" page
    When The user searches for a location with no nearby gyms in the Events page location search
    Then The no nearby locations error is displayed in the Events page location search

  @AFW-2968 @US @desktop @REGULAR
  Scenario: Verify server-side error message on Events Location Search 2.0
    Given The user is on "Events Free Trial Pass" page
    When The user attempts to search for the location in the Events page and the server fails to respond
    Then The server-side error is shown in the Events page location search
