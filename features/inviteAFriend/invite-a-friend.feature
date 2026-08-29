@InviteAFriend
Feature: Invite a Friend

  As an Anytime Fitness member,
  I want to generate a referral link by sharing an invitation,
  So that my friend can claim their invitation to the gym

  # Locale-agnostic: ONE feature file for all locales.
  # Tags: Test Case ID (@TC-T00x @REGULAR) + Feature Tag + Supported Locales from Flow tab.
  # Run: $env:FEATURE="InviteAFriend"; $env:TAG="US"; npm run test:multi-locale:feature
  # Smoke: npm run test:multi-locale:smoke with TAG set ( only — no custom *Smoke subset tags)
  # Optional 1-pass journeys (added below sheet TCs): FEATURE="InviteAFriendConsolidatedPass" or --grep @InviteAFriendConsolidatedPass

  Background: Navigate to page
    Given The user is on "Invite a Friend" page

  @TC-T001 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Invite a Friend Heading is Correct and Visible
    Then The Invite a Friend page heading is displayed correctly

  @TC-T002 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Invite a Friend Label is Correct and Visible
    Then The Invite a Friend phone label is displayed correctly

  @TC-T003 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Details is Correct and Visible
    Then The Invite a Friend step instructions are displayed correctly

  @TC-T004 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Phone number input field is visible and required
    Then The Invite a Friend phone number input field is visible
    And The Invite a Friend share referral button is disabled

  @TC-T005 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Share Trial Free Button is disable until phone number input is not valid
    When The user enters invalid number in the mobile phone field in the Invite a Friend form
    Then The Invite a Friend share referral button is disabled

  @TC-T006 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Share Trial Free Button is enable when phone number input is valid
    When The user enters a valid mobile phone number in the Invite a Friend form
    Then The Invite a Friend share referral button is enabled

  @TC-T007 @REGULAR @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify Note is Visible and Correct
    Then The Invite a Friend note disclaimer is displayed correctly

  @TC-T008 @REGULAR  @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that the user is allowed to copy and share the invite link
    When The user submits the Invite a Friend form with a valid mobile phone number
    Then The referral code and redeem URL are returned in the referrals network response
    And The Invite a Friend share modal with copyable invite link is displayed

  @TC-T009 @REGULAR   @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Verify that the generated link is connected to a member and displays the correct member details on /referrals API when opened
    When The user submits the Invite a Friend form with a valid mobile phone number
    Then The referral code and redeem URL are returned in the referrals network response
    When The user navigates to the redeem referral URL from Invite a Friend
    Then The redeem referral landing page is displayed
    And The referral lookup response contains member and location details

  @TC-T010 @REGULAR @AFW-3811 @US @AU @GB @IE @EN-CA
  Scenario: Verify the Submit Invite form sent by a Connected Member
    Given The user is on the Invite a Friend referral landing page for a connected member
    Then The referral lookup response contains member and location details
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    And The lead-capture request includes the correct referral_code
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed
    And The bookings request includes the correct staff_id from availabilities
    And The Add to Calendar button is visible on the Invite a Friend confirmation screen
    And The Share Trial Pass button is displayed on the Invite a Friend confirmation screen

  @TC-T011 @REGULAR @AFW-3811 @US @AU @GB @IE @EN-CA
  Scenario: Submit invite form sent by a Non-Member
    Given The user is on the Invite a Friend referral landing page for a non-member
    When The user searches for a locale gym on the Invite a Friend referral landing page
    And The user selects a locale gym and overrides location_id on the Invite a Friend referral landing page
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    And The lead-capture request includes the correct referral_code
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed
    And The bookings request includes the correct staff_id from availabilities
    And The Add to Calendar button is visible on the Invite a Friend confirmation screen
    And The Share Trial Pass button is displayed on the Invite a Friend confirmation screen

  # AFW-3956 / AFW-3434 — Lead Captured form_* / offer_* on referral landing submit (US Rudderstack only)
  # AFW-3434: national invite uses static offer_type=free_trial (not CMS); Email Club excludes offer_*
  @AFW-3956 @AFW-3434 @REGULAR @Regression @US @desktop
  Scenario: Verify Lead Captured and Identity Rudderstack after Invite referral landing submit
    Given Rudderstack validation is enabled for Invite a Friend
    And The user is on the Invite a Friend referral landing page for a non-member
    When The user searches for a locale gym on the Invite a Friend referral landing page
    And The user selects a locale gym and overrides location_id on the Invite a Friend referral landing page
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Invite a Friend

  # AFW-3953 — Appointment Slot Selected on schedule CTA (Testpad Invite block)
  @AFW-3953 @AFW-3954 @REGULAR @US @desktop
  Scenario: Verify Appointment Slot Selected Rudderstack after Invite referral booking
    Given Rudderstack validation is enabled for Invite a Friend
    And The user is on the Invite a Friend referral landing page for a non-member
    When The user searches for a locale gym on the Invite a Friend referral landing page
    And The user selects a locale gym and overrides location_id on the Invite a Friend referral landing page
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Lead Captured and Identity Rudderstack events are verified in Invite a Friend
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Appointment Scheduled and Appointment Slot Selected Rudderstack events are verified in Invite a Friend

  # --- AFW-3303 Page view lead_funnel_viewed (US Rudderstack) ---
  # Testpad 27590 Invite A Friend Flows: form_type=invite form_offer=free_day_pass
  # Assert on non-member referral landing (lead-funnel iframe, location-search step).
  @AFW-3303 @US @desktop @Regression
  Scenario: Verify page view lead_funnel_viewed true on Invite a Friend
    Given Rudderstack validation is enabled for Invite a Friend
    And The user is on the Invite a Friend referral landing page for a non-member
    And The page is reloaded to capture the Rudderstack page view
    Then The page Rudderstack event is triggered for "Invite a Friend" with lead_funnel_viewed "true"

  # --- Optional consolidated journeys (1-pass) ---
  # Sheet TC coverage remains TC-T001–T011 above. These stack compatible checks to reduce navigations
  # Run alone: $env:FEATURE="InviteAFriendConsolidatedPass"; $env:TAG="US"; npm run test:multi-locale:feature
  # Note: FEATURE=InviteAFriend also matches these (feature-level tag inheritance).

  @InviteAFriendConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-3
  Scenario: Consolidated — landing page chrome, phone field, and disabled share button
    Then The Invite a Friend page heading is displayed correctly
    And The Invite a Friend phone label is displayed correctly
    And The Invite a Friend step instructions are displayed correctly
    And The Invite a Friend phone number input field is visible
    And The Invite a Friend share referral button is disabled
    And The Invite a Friend note disclaimer is displayed correctly

  @InviteAFriendConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-3
  Scenario: Consolidated — share button disabled for invalid phone and enabled for valid
    When The user enters invalid number in the mobile phone field in the Invite a Friend form
    Then The Invite a Friend share referral button is disabled
    When The user enters a valid mobile phone number in the Invite a Friend form
    Then The Invite a Friend share referral button is enabled

  @InviteAFriendConsolidatedPass @US @AU @GB @IE @EN-CA @FR-CA @Regression @Smoke @batch-1
  Scenario: Consolidated — share invite modal and redeem landing for connected member
    When The user submits the Invite a Friend form with a valid mobile phone number
    Then The referral code and redeem URL are returned in the referrals network response
    And The Invite a Friend share modal with copyable invite link is displayed
    When The user navigates to the redeem referral URL from Invite a Friend
    Then The redeem referral landing page is displayed
    And The referral lookup response contains member and location details

  @InviteAFriendConsolidatedPass @US @AU @GB @IE @EN-CA @Regression @Smoke @batch-1
  Scenario: Consolidated — connected member referral landing form submit and booking
    Given The user is on the Invite a Friend referral landing page for a connected member
    Then The referral lookup response contains member and location details
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    And The lead-capture request includes the correct referral_code
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed
    And The bookings request includes the correct staff_id from availabilities
    And The Add to Calendar button is visible on the Invite a Friend confirmation screen
    And The Share Trial Pass button is displayed on the Invite a Friend confirmation screen

  @InviteAFriendConsolidatedPass @US @AU @GB @IE @EN-CA @Regression @Smoke @batch-3
  Scenario: Consolidated — non-member referral landing gym select, form submit, and booking
    Given The user is on the Invite a Friend referral landing page for a non-member
    When The user searches for a locale gym on the Invite a Friend referral landing page
    And The user selects a locale gym and overrides location_id on the Invite a Friend referral landing page
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    And The lead-capture request includes the correct referral_code
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed
    And The bookings request includes the correct staff_id from availabilities
    And The Add to Calendar button is visible on the Invite a Friend confirmation screen
    And The Share Trial Pass button is displayed on the Invite a Friend confirmation screen

  # AFW-3811 / AFW-3520 — inviteMember See You Soon visit copy (Testpad #24–28). Covers TC-T010.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-T010  @US @AU @GB @IE @EN-CA @Regression @batch-3
  Scenario: Consolidated — AFW-3811 Book a Visit invite member See You Soon copy
    Given The user is on the Invite a Friend referral landing page for a connected member
    Then The referral lookup response contains member and location details
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed

  # AFW-3811 / AFW-3520 — inviteNonMember See You Soon visit copy (Testpad #24–28). Covers TC-T011.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-T011  @US @AU @GB @IE @EN-CA @Regression 
  Scenario: Consolidated — AFW-3811 Book a Visit invite non-member See You Soon copy
    Given The user is on the Invite a Friend referral landing page for a non-member
    When The user searches for a locale gym on the Invite a Friend referral landing page
    And The user selects a locale gym and overrides location_id on the Invite a Friend referral landing page
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed
