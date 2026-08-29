Feature: One Trust
  As a user, I want to verify the functionality of the OneTrust consent banner across different pages and locations.

  @OneTrust @AFW-1310
  Scenario Outline: Verify consent banner visibility across multiple locations on home page
    Given User IP is located within "<Location>"
    When the user accesses the "home" page in "<Location>" region
    Then the consent banner is "<VisibilityStatus>" for "<Location>" users

    @California @TC-22752
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on home page
    Examples:
      | Location   | VisibilityStatus |
      | California | displayed        |
    @Washington @TC-22749
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on home page
    Examples:
      | Location   | VisibilityStatus |
      | Washington | not displayed    |

    @Connecticut @TC-22756
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on home page
    Examples:
      | Location    | VisibilityStatus |
      | Connecticut | not displayed    |

  @OneTrust @AFW-1310
  @California @TC-22753
  Scenario: Verify performance and targeting cookies are enabled after user accepts cookies for California users
    Given User IP is located within "California"
    When the user accesses the "home" page in "California" region
    And The user accepts the cookies in the consent banner
    Then The "Performance Cookies" and "Targeting Cookies" groups are enabled in OneTrust active groups
    And The "Other Organizations" toggle is switched "ON" in Cookie Settings

  @OneTrust @AFW-1310
  @California @TC-22754
  Scenario: Verify performance and targeting cookies are not enabled after user rejects cookies for California users
    Given User IP is located within "California"
    When the user accesses the "home" page in "California" region
    And The user rejects the cookies in the consent banner
    Then The "Performance Cookies" and "Targeting Cookies" groups are not enabled in OneTrust active groups
    And The "Other Organizations" toggle is switched "OFF" in Cookie Settings

  @OneTrust @AFW-1310
  Scenario: Verify the user is default opt-in for Washington and Connecticut locations
    Given User IP is located within "<Location>"
    When the user accesses the "home" page in "<Location>" region
    Then The "Performance Cookies" and "Targeting Cookies" groups are enabled in OneTrust active groups
    And The "Other Organizations" toggle is switched "ON" in Cookie Settings

    @Washington @TC-22750
    # title-format: Verify default opt-in for <Location> users
    Examples:
      | Location   |
      | Washington |

    @Connecticut @TC-22757
    # title-format: Verify default opt-in for <Location> users
    Examples:
      | Location    |
      | Connecticut |

  @OneTrust @AFW-1310
  Scenario Outline: Verify consent banner visibility across multiple locations on try us free page
    Given User IP is located within "<Location>"
    When the user accesses the "try us free" page in "<Location>" region
    Then the consent banner is "<VisibilityStatus>" for "<Location>" users

    @California @TC-22755
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on try us free page
    Examples:
      | Location   | VisibilityStatus |
      | California | displayed        |
    @Washington @TC-22751
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on try use free page
    Examples:
      | Location   | VisibilityStatus |
      | Washington | not displayed    |

    @Connecticut @TC-22758
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on try us free page
    Examples:
      | Location    | VisibilityStatus |
      | Connecticut | not displayed    |

  @OneTrust @AFW-1310
  Scenario Outline: Verify consent banner visibility across multiple locations on find gym page
    Given User IP is located within "<Location>"
    When the user accesses the "find gym" page in "<Location>" region
    Then the consent banner is "<VisibilityStatus>" for "<Location>" users

    @California @TC-22824
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on find gym page
    Examples:
      | Location   | VisibilityStatus |
      | California | displayed        |
    @Washington @TC-22825
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on find gym page
    Examples:
      | Location   | VisibilityStatus |
      | Washington | not displayed    |

    @Connecticut @TC-22826
    # title-format: Verify consent banner is <VisibilityStatus> for <Location> users on find gym page
    Examples:
      | Location    | VisibilityStatus |
      | Connecticut | not displayed    |