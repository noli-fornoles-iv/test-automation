# Webflow Pages X Next.js iframes

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=4948db78-9872-403e-b293-51cd3ace6f59
Updated: 2026-08-28T10:43:54.497Z

## 1. Page Overview - General Info
Summary about all the Next.js pages that are embedded in Webflow iframes for Anytime Fitness.

## 2. Table Summary
The base URL of an iframe looks like this: 

[https://{env}-react.anytimefitness.com](https://sit-react.anytimefitness.com/)/{nextjs-page-name}Next.js Iframe URLs in the table use PROD environment as an example, they are translatable to other environments.This is how it looks for each environment:

- **DEV:** [https://dev-react.anytimefitness.com](https://sit-react.anytimefitness.com/)
- **SIT:** [https://sit-react.anytimefitness.com](https://sit-react.anytimefitness.com)
- **UAT:** [https://uat-react.anytimefitness.com](https://uat-react.anytimefitness.com)
- **PROD:** [https://react.anytimefitness.com](https://react.anytimefitness.com)
 A Webflow Page can have many embedded iframes.

 

| Page Name | Webflow URL | Next.js Iframe(s) | Iframe(s) Query Params | Supported Locales |
| --- | --- | --- | --- | --- |
| Home | https://www.anytimefitness.com/ | https://dev-react.anytimefitness.com/en-us/find-your-location-searchbar/ | location | All locales |
| Location Finder | https://www.anytimefitness.com/find-gym | https://dev-react.anytimefitness.com/en-us/location-finder |  | All |
| Training | https://www.anytimefitness.com/traininghttps://www.anytimefitness.com/training/group-traininghttps://www.anytimefitness.com/training/personal-traininghttps://www.anytimefitness.com/training/fitness-consultation | https://dev-react.anytimefitness.com/en-us/nearest-locations/https://dev-react.anytimefitness.com/en-us/find-your-location-searchbar/ | variant location | US, IN, SG, ID, VN |
| Membership | https://www.anytimefitness.com/membership | https://dev-react.anytimefitness.com/en-us/nearest-locations/ | variant location | US, IN, SG, ID, VN, ES |
| Own A Gym | https://www.anytimefitness.com/en-ae/own-a-gym | https://dev-react.anytimefitness.com/en-us/franchise-leads/ |  | AE, SA, ZA, KW, IN |
| Try Us Free | https://www.anytimefitness.com/try-us-free | https://dev-react.anytlfitness.com/en-us/try-us-free/ | variant location_id location isFitnessPlusNew eventName | US, AE, SA, UK, IE, ZA, KW, IN, SG, ID, VN, ES |
| Apple Fitness Offer | https://www.anytimefitness.com/apple-fitness-offer | https://dev-react.anytimefitness.com/en-us/try-us-free/?isFitnessPlusNew=true | variant location_id location isFitnessPlusNew eventName | US, AU |
| Apple Fitness Plus Subscriber | https://www.anytimefitness.com/apple-fitness-plus-subscriber | https://sit-react.anytimefitness.com/try-us-free/ | variant location_id location isFitnessPlusNew eventName | US |
| Membership Inquiry | https://www.anytimefitness.com/membership-inquiry | https://sit-react.anytimefitness.com/membership-inquiry/ | location_id location | All locales |
| Book A Tour | https://www.anytimefitness.com/schedule-an-appointment-online | https://sit-react.anytimefitness.com/book-a-tour | location_id | US, AU, UK, IE |
| Invite A Friend | https://www.anytimefitness.com/invite-friend | https://sit-react.anytimefitness.com/invite-friend |  | US, AU, UK, IE, CA |
| Invite | https://www.anytimefitness.com/invite/?h=YOGAW4UH | https://sit-react.anytimefitness.com/try-us-free/ | variant location_id location isFitnessPlusNew eventName | US, AU, UK, IE, CA |
| US Events | Promo: https://www.anytimefitness.com/events/promoTrain For Your Life: https://www.anytimefitness.com/events/train-for-your-lifeFree Trial:https://www.anytimefitness.com/events/free-trialJoin Online:https://www.anytimefitness.com/events/join-online | https://sit-react.anytimefitness.com/events-2.0 | eventProps, location , location_id | US |
| AU Events | Promo:https://www.anytimefitness.com/en-au/events/promo Find Your Fitphoria:https://www.anytimefitness.com/en-au/events/find-your-fitphoriaBook A Tour:https://www.anytimefitness.com/en-au/events/book-a-tour | https://sit-react.anytimefitness.com/events-2.0 | eventProps location location_id | AU |
| HSA/FSA | https://www.anytimefitness.com/resources/hsa-and-fsa-for-gym-membership | https://react.anytimefitness.com/try-us-free/?variant=event&eventName=hsa-and-fsa-for-gym-membership | variant eventName location_id | US |
| Local Offers | List here: TESTPAD REPORT | outliantteamoutliantteam.testpad.com/project/67/folder/f263/report/?auth=6e1c748161270720a69ff41414d1b343 | https://sit-react.anytimefitness.com/local-offer/ | location_id title image locationStatusRequirement h2Override subheadingOverride bulletPointsOverride offerVariant apiWorkflowName leadSourceCode preview | US, AU, SG, ID, VN |
| Multi Club Offers (MCOs) | www.anytimefitness.com/offer/group/join-for-one-dollar-transformation-challenge-offer-bfgwww.anytimefitness.com/offer/group/join-for-one-dollar-transformation-challenge-offerwww.anytimefitness.com/offer/group/join-get-summer-freewww.anytimefitness.com/offer/group/real-af-rebootwww.anytimefitness.com/offer/group/6-week-challengewww.anytimefitness.com/offer/group/join-for-one-dollar-offer-bfgwww.anytimefitness.com/offer/group/join-for-one-dollar-offerwww.anytimefitness.com/offer/group/join-get-rest-year-freewww.anytimefitness.com/offer/group/get-30-days-free-offerwww.anytimefitness.com/offer/group/free-training-experience-offerwww.anytimefitness.com/offer/group/free-7-day-group-training-offerwww.anytimefitness.com/offer/group/free-7-day-pass-offer-bfgwww.anytimefitness.com/offer/group/free-7-day-pass-offerwww.anytimefitness.com/offer/group/one-month-free-trainingwww.anytimefitness.com/offer/group/free-training-sessionwww.anytimefitness.com/offer/group/50-dollars-off-training-package |  | location_id title image showOnlineJoinCard locationStatusRequirement h2Override subheadingOverride bulletPointsOverride offerVariant apiWorkflowName leadSourceCode preview | US |
| Corporate Membership | https://www.anytimefitness.com/en-au/corporate-membership | https://sit-react.anytimefitness.com/en-au/corporate-membership/ |  | AU, UK, IE, IN |
| Contact Us | https://www.anytimefitness.com/email-club | https://sit-react.anytimefitness.com/contact-us | location_id | All |
| Cancel Membership | https://www.anytimefitness.com/{locale}/cancel-membership | https://sit-react.anytimefitness.com/{locale}/membership-cancellation/ | location_id | DE |
TBD:`/cta-banner` (not found)`/japan-fplus-form`  (to be decided)
