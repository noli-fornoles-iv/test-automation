export const TestDataKeys = {
  Locations: {
    Search: {
      NoNearbyLocation: 'locations.search.noNearbyLocation',
      Invalid: 'locations.search.invalid',
      Default: 'locations.search.default',
      California: 'locations.search.california',
      Washington: 'locations.search.washington',
      NoNearby: 'locations.search.noNearby',
      NoGymsNearbyHeading: 'locations.search.noGymsNearbyHeading',
    },
    Gyms: {
      California: 'locations.gyms.california',
      Washington: 'locations.gyms.washington',
      Default: 'locations.gyms.default',
      Default1: 'locations.gyms.default1',
    },
    ClubId: 'locations.clubId',
    PreSaleClubId: 'locations.preSaleClubId',
    SecondaryClubId: 'locations.secondaryClubId',
    LocalGym: 'locations.localGym',
  },
  ZipCode: {
    Valid: {
      Default: 'zipCodes.valid.default',
      Secondary: 'zipCodes.valid.secondary',
      OnlineSignupDisabled: 'zipCodes.valid.osuDisabled',
    },
    Invalid: {
      Alpha: 'zipCodes.invalid.alpha',
      Short: 'zipCodes.invalid.short',
      Long: 'zipCodes.invalid.long',
    },
  },
  PhoneNumber: {
    Valid: {
      Default: 'phoneNumber.valid.default',
      Secondary: 'phoneNumber.valid.secondary',
      /** Phone connected to an AF member (Share Invitation / Invite a Friend). */
      Member: 'phoneNumber.valid.member',
      /** Valid phone not connected to a member (anonymous referral). */
      NonMember: 'phoneNumber.valid.nonMember',
    },
    Invalid: 'phoneNumber.invalid',
    CountryCode: 'phoneNumber.countryCode',
  },
  OwnAGym: {
    InvestmentRange: 'ownAGym.investmentRange',
    HeardAboutUs: 'ownAGym.heardAboutUs',
    DesiredMarket: 'ownAGym.desiredMarket',
    Address: 'ownAGym.address',
    City: 'ownAGym.city',
    State: 'ownAGym.state',
    Country: 'ownAGym.country',
    Zip: 'ownAGym.zip',
  },
} as const;

export default TestDataKeys;
