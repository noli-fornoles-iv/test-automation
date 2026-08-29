export {};
declare module 'playwright-bdd' {
  // eslint-disable-next-line
  interface World {}
}

declare global {
  interface Window {
    OptanonActiveGroups?: string;
    OneTrust?: {
      GetDomainData?: () => {
        Groups?: {
          CustomGroupId: string;
          OptanonGroupId: string;
          GroupName: string;
        }[];
      };
    };
  }

  interface CookieGroup {
    CustomGroupId: string;
    OptanonGroupId: string;
    GroupName: string;
  }

  interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    zipCode?: string;
    message?: string;
  }

  interface CorporateMembershipFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    title?: string;
    department?: string;
    companyAddress?: string;
  }

  interface OwnAGymFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    investmentRange: string;
    heardAboutUs: string;
    desiredMarket: string;
    message: string;
    /** Franconnect AU (and similar) address fields — optional for React / IE forms. */
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  }
}
