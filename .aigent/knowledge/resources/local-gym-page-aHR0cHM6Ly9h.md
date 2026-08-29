# Local Gym Page

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=227db0be-574b-467d-a36d-2f39f48eb3a2
Updated: 2026-05-14T18:59:19.703Z

## 1. Page Overview - General Info
**Purpose:** This page has the goal of displaying all information related to a local gym page, including facilities information, staff members, related plans and starting price, photos, address and etc. This page will also be the middle point or entry point to many flows, like the Try us Free, Book a Tour and Find a Gym and Local Offer flows.There the user will also be able to go for flows based in existing subdomains, like online Join. 

 

- **Page Name: **Locations/Gym;
- **URL: **/locations/{city}-{state}-{afNumber/clubId}
- **Development Reference: **
- External JS file: ﻿[Anytimefitnessscripts.anytimefitness.com/location/index.js](https://scripts.anytimefitness.com/location/index.js)﻿ 
- **Figma: **
" height="359" width="734" id="2veuE5mqjidP">- **SEO Configuration:**
- ***Meta Title: ***Anytime Fitness - Gym in {{name}}, {{province}}, {{postal code}}
- ***Meta Description: ***Visit your 24/7 gym in {{name}}, {{state:state-province-short-code}} {{address-post-code}}. Enjoy a variety of equipment, personalized plans, and supportive community to reach your fitness goals. Join today!
- For gyms that has Open 24 hours OFF, there's client-side script that remove the 24/7 text in meta description

## 2. Webflow Structure
**Purpose:** Outline how the page is structured in Webflow, listing the sections used, components 

- **Main Sections:**
  

- **Custom Webflow Interactions & Animations: **This page doesn't use Webflow interactions. Animations are done strictly with CSS Transition and Transform.
- **CMS Collections (if applicable):** This page has a set of CMS collections that are all tied to the main collection called Locations
- Here is the list of collections:
- Locations (root)
- Gym Statuses
- Gym Images
- Plans
- Announcements
- Staff
- Amenities 
- Amenities categories

" height="324" width="734" id="mkPxc1sKw6Ci"> 

## 3. External JavaScript and Tools
There external tools used in this page are:

- [**GSAP**](https://gsap.com/) - For easier animation control 
- **Sections Affected: **Used in the Staff section for the modal. The Modal control is done using it
- [**Swiper.js**](https://swiperjs.com/) - For complex control over swipers in the page
- **Sections Affected: **The hero photos section, the staff section, the announcements sections in mobile view and AF Features section in mobile view.

## 4. iFrame Components
N/A

## 5. Communication Between Webflow Page & iFrames
N/A

## 6. Dynamic Behavior & Custom Interactions
This page has a couple of custom features all of them are being described next

### 6.1 24 Hours Feature
This is based on CMS attribute *24 Hours Open*. Only Show "Open 24 Hours" checkmark and "24-Hour Access" amenity if this is checked

The Amenity for 24 hours only shows if the tied as an external amenity. The "Open 24 hours" toggle in the CMS doesn't have a direct affect on it

 

### 6.2 Amenities and custom amenities
All amenities are grounded and rendered through JS. The data comes from Locations collection

- **Amenities**: Multi-referenced field that is connected to **Amenities **collection. To have access to this items in the codebase we build objects using collection list.
- `allAmenityCategories``allAmenities`
- **Custom Amenity**: Field that contains object with array of custom amenities, this is populated by clients sync. If populated we combine the entries to the `allAmenities` and display the items alphabetically.
- Rendered as accordion in locations template
 The logic for this gets the list of amenities from CMS for the specific location, group them by category into an object add later the custom amenities to the end of each category.Code Sample

```
// Gym Amenities
  (function pushCustomAmenitiesFromCMS() {
    'use strict';
    if (!Array.isArray(window.extraAmenitiesSources)) {
      window.extraAmenitiesSources = [];
    }
    const decodeHtml = (s) => {
      if (typeof s !== 'string') return '';
      return String(s || '')
        .replace(/"/g, '"')
        .replace(/&/g, '&')
        .replace(/'|'/g, "'")
        .replace(//g, '>')
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .trim();
    };
    
    // More codes on GitHub/af-webapp-iframes/IaC/webapp-frontend/lib/resources/wfjs-compiled/location/index.js
  
})();
```

### 6.3 Swipers
Swipers are done using Swiper.js, the control is done through a set of defined classes and a script object that controls all of the functionalities, like this:

```
//Gym staff
  let staffSwiper;
  function initializeStaffSwiper() {
    const paginationEl = document.querySelector('.staff-pagination');
    if (paginationEl && !paginationEl.classList.contains('w-condition-invisible')) {
      staffSwiper = new Swiper('#staff-swiper', { 
        spaceBetween: 30, 
        slidesPerView: 3, 
        keyboard: { enabled: true }, 
        pagination: { el: '.staff-pagination', clickable: true }, 
        breakpoints: { 
          300: { 
            slidesPerView: 1, 
            spaceBetween: 8 
          }, 
          479: { 
            slidesPerView: 2, 
            spaceBetween: 8 
          }, 
          768: { 
            slidesPerView: 3, 
            spaceBetween: 16 
          }, 
          992: { 
            slidesPerView: 3, 
            spaceBetween: 24 
          } 
        }, 
        a11y: { enabled: true, slideRole: 'listitem' } });
    } else {
      const teamSection = document.querySelector('#gym-our-team');
      if (teamSection) {
        teamSection.style.display = 'none';
      }
    }
  }
  initializeStaffSwiper();
```
 Other examples can be found in the [https://swiperjs.com/demos](https://swiperjs.com/demos)

Here is the Swiper for Staff. It's a basic swiper with no navigation buttons, only pagination.

AF features section also becomes a swiper in mobile view

And in the hero there is a swiper with no pagination, but with navigation control and autoplay for the photos. The script that manipulates the banner swiper is added in the designer to avoid layout shift since the external js are deferred. 

### 6.4 Mapbox static image for Gym Location
In one of the last sections, there will be a static image that shows the Gym location based in the coordinates. The coordinates are accessed through CMS in a JS script and use the 

[mapbox static image API](https://docs.mapbox.com/api/maps/static-images/) to render this map as a PNG. This is done with the following code.

```
  //Gym map
  function initializeMap() {
    const lat = cmsLatitude || '';
    const long = cmsLongitude || '';
    const fallbackImg = document.getElementById('gym-map-fallback-img');
    const mapboxDiv = document.getElementById('mapbox-img');

    if (!lat || !long) {
      fallbackImg.style.display = 'block';
      return;
    }

    const image = document.createElement('img');
    const mapBoxId = 'clsj5hhkd00l201pucv0z99ts';
    let zoomLevel = 14;
    const accessToken = '${MAPBOX_ACCESS_TOKEN}';
    const attribution = 'false';

    const desktop = window.innerWidth >= 992;
    const tablet = window.innerWidth >= 768 && window.innerWidth  {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            image.src = mapSrc;
            obs.unobserve(image);
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      },
    );

    observer.observe(image);
    mapboxDiv.appendChild(image);
  }

  initializeMap();
```
With this approach, the map will be loaded once it is visible in viewport like below:

The Mapbox attribution are added in designer to have more control over the design since the map has cover display.

## 7. Edge Cases & Known Issues
N/A

## 8. How h1, h2, h3 headings are set
H1 is set using custom script to follow the requirement. Below is the function used to set H1 text as well as the Differentiator:

```
  //Set H1 heading
  function setHeading() {
    const h1 = document.querySelector('#local-gym-h1');
    if (h1) {
      const location = h1.textContent.trim();
      const differentiatorText = cmsDifferentiator || '';
      const div = document.createElement('div');
      div.innerHTML = differentiatorText.trim();
      const differentiator = div.textContent;
      const translatedH1 = document.querySelector('.translated-h1').textContent.trim();
      h1.textContent = `${translatedH1} ${location}`;
      if (differentiator && differentiator !== '') {
        const span = document.createElement('span');
        span.className = 'gym-info-differentiator';
        span.textContent = ` ${differentiator}`;
        h1.appendChild(span);
      }
    }
  }
  setHeading();
```
Have h2 for every section for their respective titles and h3 h4 if there are child title on that section.

## 9. UTM Parameters passed to relevant page
Retaining of the URL parameters for the necessary links are added in Page JS custom code element:

```
const setupRedirectsByClass = () => {
    const currentParams = new URLSearchParams(window.location.search);
    const queryString = currentParams.toString();
    const linkContainers = document.querySelectorAll('.llp-add-location-id');

    linkContainers.forEach((container) => {
      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.href;
        const text = link.innerHTML.trim().toLowerCase();

        if (text === 'contact us' && link.closest('footer.footer')) {
          return;
        }

        if (href.includes('location_id=')) {
          return;
        }

        const separator = href.includes('?') ? '&' : '?';
        link.href += `${separator}location_id=${clubId}${queryString ? '&' + queryString : ''}`;
      });
    });
  };
```

## 10. Announcements & Local Offer JSON Logic
Added in designer as a section and manipulates the announcement content, link and link text using client-side script that is added in github code.The data used is connected to Local Offer field in Locations collection, sample value below:

 Below is the function used to manipulate announcement contents:

```
function handleGymCtaBanner(parsedOffers) {
  const banner = document.querySelector(".gym-cta-banner");
  const messageEl = banner.querySelector(".gym-banner-text2");
  const buttonEl = document.createElement("a");
  buttonEl.className = "bt-af aqua w-button";
  const currentParams = new URLSearchParams(window.location.search);
  const queryString = currentParams.toString();

  if (!banner || !messageEl || !buttonEl) return;
  if (!Array.isArray(parsedOffers) || parsedOffers.length === 0) return;

  const now = new Date();
  const activeOffers = parsedOffers.filter(offer => {
      if (!offer || offer.isHidden || !offer.title) return false;
      const activeOn = new Date(offer.activeOn);
      const deactiveOn = new Date(offer.deactiveOn);
      return activeOn = now;
  });

  if (activeOffers.length === 0) return;

  activeOffers.sort((a, b) => new Date(a.deactiveOn) - new Date(b.deactiveOn));
  const offer = activeOffers[0];
  messageEl.textContent = offer.title;
  let href = "";
  if (offer.joinLink) {
    const url = new URL(offer.joinLink);
    const isSameDomain = url.hostname === "www.anytimefitness.com" || url.hostname === "anytimefitness.com";
    href = isSameDomain ? url.pathname + url.search : offer.joinLink;
  } else if (offer.linkUrl) {
    const url = new URL(offer.linkUrl);
    href = url.pathname + url.search;
  }

  if (href && queryString) {
    const separator = href.includes("?") ? "&" : "?";
    href += `${separator}${queryString}`;
  }

  let btnText = offer.linkText || (offer.joinLink ? "JOIN NOW" : "LEARN MORE");
  const joinUrl = offer.joinLink;
  const linkUrl = offer.linkUrl;
  if (joinUrl && linkUrl && joinUrl === linkUrl) {
    btnText = "LEARN MORE";
  }
  buttonEl.textContent = btnText.toUpperCase();
  if (href) {
    buttonEl.setAttribute("href", href);
  }
  banner.appendChild(buttonEl);
  banner.style.display = "flex";
}
```
What the function is doing:

- Checking LLP Promotional Banner Should display
Description: Checks the local offers JSON within Webflow CMS locations collection for the relevant gym - then detects if it should display a banner or not. 

Logic: If a local offer meets the following conditions, then display banner:

- The offer is current (deactiveOn < current date > activeOn )
- The isHidden = false
- CTA Button - Dynamic Display
Description: Determine the display text and URL for the aqua colour CTA button.

Logic: Continue to check details of the local offer the previously met the banner display - now determine what CTA button it should display

- Learn More -> When the local offers JSON within Webflow CMS locations collection - has a joinLink = "", then display LEARN MORE and **link to the local offer URL.**
- Join Now -> When the local offers JSON within Webflow CMS locations collection - has a joinLink is not null, then show Join Now button and have the button URL adopt the joinLink URL provided in the Local Offers JSON.  This will link the online signup flow provided. (e.g., join.anytimefitness.com or clubwise.com)

Layout in page:

## 

## 11. Additional Notes (For Complex Pages)
This page has a specific behavior that needs a careful look into it for variations, as can be observed in the 

[figma](https://www.figma.com/design/16qHxqIDcj2QaoOXpxIiY0/Anytime-Fitness-Migration?node-id=95-32675&t=Zz5q1pRFBPQ1agzt-4), this page has 7 variations. Those are all based on the Location status and on the attribute of "Has Online Signup". To control all of that, we utilize webflow conditional visibility feature.

##  Conditional Visibility by Status
To completely hide elements in dom we use conditional visibility feature in multiple sections of the page, since there are just sections that should be visible in certain studio status and conditions.

## Country Switch Fields
" id="K405IqGqNryA">
### Join Now Button
- The hero banner buttons are affected by this switch field
 

- If the Join Now Button is OFF and Has Online Signup is ON then we display MEMBERSHIP INQUIRY button instead.
- If the Join Now Button is ON and Has Online Signup is ON then we display the JOIN NOW button
- Webflow conditional visibility is used for this
- Note that we have set of buttons per studio status [open, presales, coming-soon] we control via conditional visibility
 

### Try Us Free
- There are couple of places where this switch field is utilized, hero banner, membership plans and prefooter CTA.
- The visibility of the button is based on the switch field state if OFF then the Try Us Free button will not be displayed anywhere in the page. 

### Book a Tour
- This field is utilized for Book a tour button visibility in Hero banner section.
- The visibility of the button is based on the switch field state if Book a tour is ON and Try Us Free is OFF Book a tour button is displayed.

 

## Navigation Bar CTA logic
- The Navbar used in location template is not connected to the global navbar because we have conditional visibility that is connected to Locations collection field.
- Each studio status has designated button wrapper that we show/hide base on Studio status.

 

## **Fallback Displays** 
- Gym Plans section
- We have 2 fallback state
- Fallback state for Open and presale gyms
- Fallback state for Temporary closed gyms

## Meta Description and schema
- There is a client-side script added to remove 24/7 text on locations where Open 24 hours  is OFF. But this only remove it from dom not on page source, so we still have to support it, the proposed solution is to add new text field which will have "24/7" or no value, so we just need to bind it in the page settings meta description field.

Code in page settings before </body> tag for meta description:

```
(function () {
  if (!has24HoursOn) {
  const selectors = ['meta[name="description"]', 'meta[property="og:description"]', 'meta[property="twitter:description"]'];
  
    selectors.forEach((selector) => {
      const metaTag = document.querySelector(selector);
      if (metaTag && metaTag.content) {
        metaTag.content = metaTag.content.replace(/24\/7\s/i, '');
      }
    });
  }
  
  })();
```
Code in code embed for schema:

## Plans Section
For US locale that have plans active, the items are displayed using an iframe embed below:

For iframe responsiveness it broadcast it's height and webflow assign the height of the iframe from the postmessage. 

```
window.addEventListener(
    'message',
    function (event) {
      let data = event.data;
      if (data && data.type === 'RESIZE') {
        const iframe = document.getElementById('plans-iframe');
        if (iframe) {
          const newHeight = data.height + 'px';
          iframe.style.height = newHeight;
        }
      }
    },
    false,
  );
```
