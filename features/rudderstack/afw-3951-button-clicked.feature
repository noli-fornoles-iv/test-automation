@AFW-3951 @ButtonClicked
Feature: AFW-3951 Button Clicked Rudderstack (Webflow and React)

  # Source of truth: Testpad script 28427 — approved qa_automation_testplan_approved plan.
  # JIRA: https://purposebrands.atlassian.net/browse/AFW-3951
  # Run: $env:FEATURE="AFW-3951"; $env:TAG="US"; $env:NODE_ENV="SIT"; $env:LOCALE="EN-US"; npm run test:multi-locale:feature
  # US only — Rudderstack validation requires Local Config Rudderstack TRUE.

  # --- Webflow — Navbar (AFW-4043, AFW-4168) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on home navbar logo
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Webflow home page is open with Rudderstack capture
    When The user clicks the Anytime Fitness navbar logo on AFW-3951 home
    Then The AFW-3951 navbar logo Button Clicked event is verified on home

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on training navbar blogs menu item
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 training page is open with Rudderstack capture
    When The user clicks the blogs navbar menu item on AFW-3951 training
    Then The AFW-3951 blogs navbar Button Clicked event is verified on training

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on navbar TRY US FREE CTA
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Webflow home page is open with Rudderstack capture
    When The user clicks the TRY US FREE navbar CTA on AFW-3951 home
    Then The AFW-3951 TRY US FREE navbar CTA Button Clicked event is verified

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on logo-only navbar AF logo
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 try-us-free logo-only navbar page is open with Rudderstack capture
    When The user clicks the AF logo on the logo-only AFW-3951 navbar
    Then The AFW-3951 logo-only navbar Button Clicked event is verified

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on LLP navbar links and CTA
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 LLP page is open with Rudderstack capture
    When The user clicks each visible LLP navbar link on AFW-3951
    And The user clicks the LLP navbar CTA on AFW-3951

  # --- Webflow — Core pages pill buttons (AFW-4043) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on home core page pill buttons
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Webflow home page is open with Rudderstack capture
    When The user clicks each core page pill button on AFW-3951 "home"
    Then The AFW-3951 payload consistency checks pass for "webflow" Button Clicked

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on training core page pill buttons
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 training page is open with Rudderstack capture
    When The user clicks each core page pill button on AFW-3951 "training"

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on why join core page pill buttons
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 why join page is open with Rudderstack capture
    When The user clicks each core page pill button on AFW-3951 "why join"

  # --- Webflow — LLP page clicks (AFW-4043, AFW-4174) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on LLP CTA pill buttons including repeat clicks
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 LLP page is open with Rudderstack capture
    When The user clicks each LLP CTA pill button on AFW-3951

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on LLP hero banner links
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 LLP page is open with Rudderstack capture
    When The user clicks each LLP hero banner link on AFW-3951

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on LLP hero EXPLORE MEMBERSHIPS link
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 LLP page is open with Rudderstack capture
    When The user clicks EXPLORE MEMBERSHIPS on the AFW-3951 LLP hero

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on LLP pre-footer links
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 LLP page is open with Rudderstack capture
    When The user clicks each LLP pre-footer link on AFW-3951

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on LLP AF+ TRY US FREE CTA
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 LLP page is open with Rudderstack capture
    When The user clicks TRY US FREE in the AFW-3951 LLP AF+ section

  # --- React — Find A Gym / locations (AFW-4041, AFW-4173) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on SELECT COUNTRY option only
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 locations search page is open with Rudderstack capture
    When The user opens the SELECT COUNTRY dropdown on AFW-3951 locations search
    And The user selects a country option on AFW-3951 locations search

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on Use my precise location
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 locations search page is open with Rudderstack capture
    When The user clicks Use my precise location on AFW-3951 locations search

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on map pin and Join Card CTAs
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 locations search page is open with Rudderstack capture
    When The user runs a location search until map results render on AFW-3951
    And The user clicks a map pin CTA on AFW-3951 locations search
    And The user clicks the Join Card CTA on AFW-3951 locations search

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on locations results pill CTAs
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 locations search page is open with Rudderstack capture
    When The user runs a location search until map results render on AFW-3951
    And The user clicks both pill CTAs on AFW-3951 locations results
    Then The AFW-3951 payload consistency checks pass for "react" Button Clicked

  # --- React — Submit forms and offer CTAs (AFW-4041) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on edit location button on lead form
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 try-us-free lead form with location pre-selected is open with Rudderstack capture
    When The user clicks the edit location button on the AFW-3951 lead form

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on local offer visit LLP control
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 local offer flow with LLP navigation is open with Rudderstack capture
    When The user clicks the visit LLP control on the AFW-3951 local offer flow

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on local offer Join Now Card pill
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 local offer flow with LLP navigation is open with Rudderstack capture
    When The user clicks the Join Now Card pill on the AFW-3951 local offer flow

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on group offer Join Now Card pill
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Webflow home page is open with Rudderstack capture
    When The user clicks the Join Now Card pill on the AFW-3951 group offer flow

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on member offer Join Now Card pill
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Webflow home page is open with Rudderstack capture
    When The user clicks the Join Now Card pill on the AFW-3951 member offer flow

  # --- React — Book a tour schedule picker (AFW-4041) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked fires only on first schedule date selection
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Book A Visit schedule picker is open with Rudderstack capture
    When The user selects the first date button on the AFW-3951 schedule picker
    Then The AFW-3951 first schedule date Button Clicked event is verified
    When The user selects a different date button on the AFW-3951 schedule picker
    Then The AFW-3951 second schedule date does not fire Button Clicked again

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked fires only on first schedule time selection
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 Book A Visit schedule picker is open with Rudderstack capture
    When The user selects the first date button on the AFW-3951 schedule picker
    And The user selects the first time button on the AFW-3951 schedule picker
    Then The AFW-3951 first schedule time Button Clicked event is verified
    When The user selects a different time button on the AFW-3951 schedule picker
    Then The AFW-3951 second schedule time does not fire Button Clicked again

  # --- Thank You — See You Soon (AFW-4083, Add to Calendar) ---

  @AFW-3951 @US @desktop @Regression
  Scenario: Verify Button Clicked on Add to Calendar options and Thank You page buttons
    Given Rudderstack validation is enabled for AFW-3951
    And The AFW-3951 See You Soon Thank You page is reached with Rudderstack capture
    When The user opens Add to Calendar on the AFW-3951 Thank You page
    And The user selects the "google" Add to Calendar option on AFW-3951
    When The user opens Add to Calendar on the AFW-3951 Thank You page
    And The user selects the "apple" Add to Calendar option on AFW-3951
    When The user opens Add to Calendar on the AFW-3951 Thank You page
    And The user selects the "outlook" Add to Calendar option on AFW-3951
    When The user clicks Send Trial Pass on the AFW-3951 Thank You page
    And The user clicks each other button on the AFW-3951 See You Soon Thank You page
