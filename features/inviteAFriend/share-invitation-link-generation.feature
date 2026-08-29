@ShareInvitationLinkGeneration @desktop
Feature: Share Invitation Link Generation

  As a lead who booked a gym tour,
  I want to generate a share invitation link from the thank you page,
  So that my friend can claim a trial pass via a member or anonymous invite

  Background: Navigate to Membership Inquiry lead flow

    Given The user is on "Membership Inquiry" page


  @TC-U001 @AFW-3811 @Smoke @batch-3 @Regression @MembershipInquiry @InviteAFriend @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Generate an Invite Link that is Connected to A Member from a Lead Flow
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user prepares a connected-member phone for Share Invitation Link Generation
    And The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The Membership Inquiry booking confirmation message and appointment details is displayed
    When The user generates the share invitation link from the thank you page
    And The user opens the generated share invitation link as a connected member
    Then The referral lookup response contains member and location details
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    And The lead-capture request includes the correct referral_code
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed
    And The bookings request includes the correct staff_id from availabilities
    And The Add to Calendar button is visible on the Invite a Friend confirmation screen
    And The Share Trial Pass button is displayed on the Invite a Friend confirmation screen

  # AFW-3811 — one-pass Share Invitation → inviteMember BAT visit copy (Testpad #24–28). Covers TC-U001.
  @AFW-3811 @Afw3811ConsolidatedPass @TC-U001 @MembershipInquiry @InviteAFriend @US @AU @GB @IE @EN-CA @FR-CA @Regression 
  Scenario: Consolidated — AFW-3811 Book a Visit share invitation connected-member See You Soon copy
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user prepares a connected-member phone for Share Invitation Link Generation
    And The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The Membership Inquiry booking confirmation message and appointment details is displayed
    When The user generates the share invitation link from the thank you page
    And The user opens the generated share invitation link as a connected member
    Then The referral lookup response contains member and location details
    When The user submits the Invite a Friend referral landing form with valid data
    Then The Invite a Friend referral landing form submission is successful
    When The user selects a date and time in the Invite a Friend referral landing schedule picker
    Then The Invite a Friend referral landing booking confirmation is displayed

  @TC-U002 @Smoke @batch-3 @Regression @MembershipInquiry @InviteAFriend @US @AU @GB @IE @EN-CA @FR-CA
  Scenario: Generate an Invite Link that is NOT Connected to A Member from a Lead Flow
    Given The user searches for the "Locale Based" location in the Membership Inquiry location search
    And The user selects the "Locale Based" gym from the Membership Inquiry gym search results
    When The user prepares a non-member phone for Share Invitation Link Generation
    And The user submits the Membership Inquiry form with valid data
    And The user selects a date and time in the Membership Inquiry schedule picker
    Then The Membership Inquiry booking confirmation message and appointment details is displayed
    When The user generates the share invitation link from the thank you page
    And The user opens the generated share invitation link as a non-member
    Then The anonymous share invitation landing shows location search
