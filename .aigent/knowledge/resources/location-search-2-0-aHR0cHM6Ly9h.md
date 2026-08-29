# Location Search 2.0

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=45d52045-9341-4478-9537-fa95fe644206
Updated: 2026-05-21T13:37:32.626Z

## **Purpose**
Purpose Brands wanted a unified search component across all brands based on that a new (`Location Selector`) component was added in the Shared Library. AF Location Search 2.0 flows make use of the `Location Selector` from the shared library with some additional configurations.

This document will not contain deep technical details. since we want everyone to be able to understand it.

## **Design**
- Initial Figma designs can be seen [here](https://www.figma.com/design/AHtNOzOMj8bt7LgZvRxBNl/Web-Pattern-Library-Development-Backlog?node-id=636-28501&t=W1eGmDUvJVNnvGGN-0).
- Interactive stories can be seen [here](https://storybook.purposebrands.com/?path=/docs/finder-location-selector--docs).

## QA Specific
- QAs focus should be on [Functionality](https://app.getguru.com/card/i69EKoET/Location-Search-20#yEBIZNsBLY1q), [States](https://app.getguru.com/card/i69EKoET/Location-Search-20#pRuD7TJRDF5c), [Location Card](https://app.getguru.com/card/i69EKoET/Location-Search-20#f1jq356XDPj1) and [Map](https://app.getguru.com/card/i69EKoET/Location-Search-20#LnM5roRSmYQi) sections.
- Other helpful sections would be [iFrames](https://app.getguru.com/card/i69EKoET/Location-Search-20#3v4x2rZnc5Oj) , [WF Pages](https://app.getguru.com/card/i69EKoET/Location-Search-20#J7rvskz3fFzz) and [User Interfaces.](https://app.getguru.com/card/i69EKoET/Location-Search-20#h1luQDyyWp7D)
- For any change in Location Search 2.0 we would ideally want to test [Functionality](https://app.getguru.com/card/i69EKoET/Location-Search-20#yEBIZNsBLY1q) and [States](https://app.getguru.com/card/i69EKoET/Location-Search-20#pRuD7TJRDF5c), so we don't get surprise bugs a day before production. Sometimes, it may also include [Location Card](https://app.getguru.com/card/i69EKoET/Location-Search-20#f1jq356XDPj1) and [Map](https://app.getguru.com/card/i69EKoET/Location-Search-20#LnM5roRSmYQi) sections.

## **Functionality**
It will always have a search bar and 2 tabs (locations list and map). Map is the source of truth for the locations, they get loaded through map, which means if user moves around the map, the locations list will also change. List of functionalities are as following:

- Standard search functionality through the search bar.
- Initial keyword-based search when the parent component contains the `location` search parameter.
- Automatic user IP detection and population of the locations list. This will not populate the search bar.
- Geolocation detection when the user clicks the `Use Current Location` button, along with population of the locations list. This will also populate the search bar.
- A fully interactive and localised map where users can move around, zoom in/out, and click on pins to perform further actions.
- Display of a minimum number of locations in the list, currently set to `3`, within the radius of 300 miles.
- Display of a maximum number of locations in the list, currently set to `10,` user will be able to scroll.
- It should always prioritise Manual search over IP/Geo search.
- It will display ordered (ascending) list of locations for any new search but if the user moves around in map then order is not guaranteed. Also if a user clicks on a pin from the map, that location will be displayed at the top of the locations list.
- The search bar suggestions will always be based on proximity coordinates.
- If user is inside country, the proximity coordinates will come from IP Stack API, VPN can be used for this.
- If user is outside country, we will be using [map centre coordinates](https://otbeat.atlassian.net/browse/AFW-3253?focusedCommentId=496327) for that locale as proximity. So, proximity will always be same for user’s outside that specific locale.
- You can find rest of them in the [States](https://app.getguru.com/card/i69EKoET/Location-Search-20#pRuD7TJRDF5c) section.

## States
- **Loading Locations**
- It will display a loader whenever a search is in-progress.

- **IP Based Location**
- When the component detects user's IP location, this will be the state on initial load.
- This will only work if the user is in the same country as the locale of the website, can be tested using a VPN.
- This will not fill the search bar.
- `Approximate Location` under the search bar signals that it is IP location.

- **Geolocation Search**
- When user clicks on `Use Current Location` button, it will trigger geolocation follow. Unlike IP Detection, a user can trigger it anytime.
- Geolocation mean's user actually physical location which comes through browser, so for this to work you will have to add the locale specific location in `Browser Sensors`.
- This will fill the search bar with the relevant keyword, you will also see the keyword below it. This indicates that geolocation search was triggered.

- **Manually Searched Locations **
- `Manual Search` would mean that user either typed a keyword manually or came to the page using a URL which has `location` param in it. Not all pages support `location` param.
- There can be different variant states for manual search:
- When user is outside the locale, IP location will be ignored.

- When user is inside the locale. IP location will be displayed under search bar.

- When user triggered geo location and then did a manual search afterwards. Geo location will still be displayed under the search bar.

- **No locations found**
- When no locations are found for the searched keyword, it will show `NO GYMS NEARBY` state.
- When the `VIEW ALL LOCATIONS` button is clicked it will send WebFlow a post message for navigating the user to `/locations` page.

- **Invalid Search**
- When user searches with an invalid keyword, it will show `NO GYMS NEARBY` state.
- When the `VIEW ALL LOCATIONS` button is clicked it will send WebFlow a post message for navigating the user to `/locations` page.

- **Location Detected Outside of Locale**
- When user is outside the locale, then it will show `Outside Country` state on initial load.
- When the `VIEW ALL COUNTRIES` button is clicked it will send WebFlow a post message to display the locale modal.

- **Unable to Detect Location**
- When the component is unable to detect user's IP location, it will `UNABLE TO DETECT LOCATION` state.
- To test this, you will have to block the IP Stack API call [https://api.ipstack.com.](https://api.ipstack.com/)

## Location Card
It can have different variants, some of them are as following:

- **Base Variant**
- It can have distance in either Miles or Kilometres depending on the locale.

- **Events Variants**
- Some variants will have 2 CTAs and some will not display any distance.
- For further information you can refer to this slack [comment](https://teamignitevisibility.slack.com/archives/G09K02KH25V/p1778062521881219?thread_ts=1777543360.084189&cid=G09K02KH25V). Some examples are as following.

- **Membership and Training Variants**
- They will not display distance and will have 2 CTAs.

## Map
- On initial page load, it will show a zoomed out view.

- After a location search, the system sets an initial zoom level equivalent to a 50-mile radius around the selected coordinates. The map may override this zoom dynamically based on viewport fitting logic (fitBoundsLocations), which can result in a more zoomed-in or zoomed-out final view. We do not use `Boundary Box`.

- The map pin pop up has different variants (lets avoid bugs like [AFW-3086](https://otbeat.atlassian.net/browse/AFW-3086))
- **Base Variant**

- **Events, Membership and Training Variants** 
- The CTA on map pop up should match the primary CTA from the locations list.
- You can see an example below

## WebFlow Communication
- It will send a post message when `VIEW ALL COUNTRIES` button is pressed. 

```
  const handleViewAllCountries = () => {
    postMessage({
      openLocaleModal: true,
    });
  };
```
- It will send a post message when `VIEW ALL LOCATIONS `button is pressed. 

```
  const handleViewAllLocations = () => {
    postMessage({ redirect: { to: "/locations" } });
  };
```
- It will send a post message when `Use Current Location` button is pressed. 

```
  const handleRequestUserCoordinates = () => {
    setHasManuallySearched(false);
    requestUserCoordinates({
      clearCached: true,
      unableToAccessLocationError:
        mergedTranslations.unableToAccessLocationText,
    });
  };
```

## iFrames using Location Search 2.0
- `/membership-inquiry`
- `/try-us-free` (all variants)
- `/mco-offer`
- `/book-a-tour`
- `/contact-us`
- `/events-2.0` (all variants)
- `/nearest-locations`

## Pages using Location Search 2.0
- Membership Inquiry - `/membership-inquiry`
- All Try us Free variants
- `/try-us-free`
- `/apple-fitness-plus-subscriber`
- `/apple-fitness-offer`
- Invitee Flow - `/invite?h={referral_code}`
- MCO - `/offer/group/`
- Book a Tour - `/schedule-an-appointment-online`
- Email Club - `/email-club`
- All Events variants
- `/events/promo`
- `/events/train-for-your-life`
- `/events/free-trial`
- `/events/join-online`
- `/events/find-your-fitphoria`
- `/events/book-a-tour`
- Training - `/training`
- `M`embership - `/membership`

## How locations data is fetched?
- All locations will be fetched just one time, when the page loads initially. This makes search fast.
- The parent component is responsible for `fetching/manipulation` the locations data through React Country Locations Endpoint `/api/locations/?country={iso3_country_code}`, `Location Selector` will get it through the locations prop.
- React Country Locations Endpoint makes call to 2 endpoints underneath:
- Anytime Fitness Country Locations Endpoint  `/consumer-website/v1/locations?country={iso3_country_code}` , this will be called for all flows
- WF Collections Locations Endpoint, this will be called only for Events, for further information refer to events [document](https://app.getguru.com/card/cyEeEd7i/Events-20).

## Implementation
- You can take invitee flow as an [example](https://github.com/anytimefitness/af-webapp-iframes/pull/917) for integrating Location Search 2.0 into a new flow. Please reach out to the team in case of confusions.

## User Interfaces

### English
- Already covered please refer to [States](https://app.getguru.com/card/i69EKoET/Location-Search-20#pRuD7TJRDF5c), [Location Card](https://app.getguru.com/card/i69EKoET/Location-Search-20#f1jq356XDPj1) and [Map](https://app.getguru.com/card/i69EKoET/Location-Search-20#LnM5roRSmYQi) sections.

### Arabic
- **Outside Country**

- **Manual Search when Outside Country**

- **Geolocation**

- **Geolocation with Manual Search**

- **IP Location**

- **IP Location with Manual Search**

- **Invalid Search**

- **No Locations Found**

- **Unable to detect Location**

- **Map**
