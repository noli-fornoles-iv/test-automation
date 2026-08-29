# Navigation and Footer

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=cd7b8575-ca9c-4322-9e15-194eceed41a0
Updated: 2026-05-04T10:33:47.780Z

### PurposeBrands NavBar
**Page Usage & Scope**

On every page where the NavBar has itemsThe old Component "Localization NavBar" has been dreprecated and updated to this one. For that we are following Purpose Brand Shared Webflow Component guidelines. See here: ﻿

[WebflowNav Bar | Shared Component Library](https://shared-component-library.webflow.io/components/navbar)﻿  

**Functionality & Behaviour**

This Component main function is to facilitate User to navigate across the site in any language. The Component should be on every page with a Navigation NavBar. There are some pages that don’t have it and we use “NavBar Just Brand Component” insteadThis Component has inside the Skip Navigation functionality, so you don't need to add Skip Navigation Component if you have this one 

**Important QA Notes:**

- **Local Gym Page (local landing page) - **The Navigation Bar's CTA button changes on the LLP gym pages dependant on the gym status.  
- See: [https://otbeat.atlassian.net/browse/AFW-2492](https://otbeat.atlassian.net/browse/AFW-2492) 
- See: [https://otbeat.atlassian.net/browse/AFW-3041](https://otbeat.atlassian.net/browse/AFW-3041)
- **Ireland (IE) and United Kingdom (GB) | Member Benefits Link** - This is an external link on purpose.  Do not link to /member-benefits page.

**Configuration & Settings**

All properties are set up by Locale. You can still configure the CTA just in case there is a page with different configuration. Here the Properties panel:

You should also check the Tablet/Mobile items when you set up a Locale: 

For any of the NavBar items you can set up by Locale:

- Visibility 
- Text to be display
- Page where it links whether it is a page or an external page
- Aria Label for the button. We only use Aria Labels when opening in a new tab, we don't want to be redundat
 For the CTA you can set up:

- Link
- Text
- Variant
- Id (this is only used for connecting the button to the Calendly Component)
- Visibility
 All these properties default values can be edited for each Locale. You can also override the CTA properties per page if needed. RTL ConfigurationRecently we introduced Locales for Arab countries, so for example for ar-sa, check that everything goes right to left: items, expanding, etc.This means that  all Navbars for RTL Locales should have the variant RTL

### NavBar Just Brand 
**Page Usage & Scope**

This Component works same way as NavBar but has no properties.  

**Functionality & Behaviour**

The Component is used in pages where a Booking process is being executed, so we don’t want to disturb the User with any other thing. That is the reason why there are no NavBar links or CTAs in the Component 

**Configuration & Settings**

The Component is used in pages where a Booking process is being executed, so we don’t want to disturb the User with any other thing. That is the reason why there are no NavBar links or CTAs in the ComponentOnly the Brand logo could be changed just in case there is a rebranding 

**Component Preview**

### PurposeBrands Footer
**Page Usage & Scope**

The Footer Component helps the User navigate across the site in every page at every Locale, so the User doesn’t need to scroll back up and can navigate from the Footer 

**Functionality & Behaviour**

On every page 

**Configuration & Settings**

Footer is edited per Locale, so you can change any item and properties per Locale, that means:

- Company items and links
- Gyms items and links
- Members items and links
- Shop items and links
- Social items and links
 All the default values properties can be set up for each Locale.You can play with visibility if a Locale does not have some of them, for example for Shop items, just place them as hidden.The Footer Component is connected both to:

- Component Footer Locale Modal (where you get Language Selector)
- One Trust functionality (Cookie Settings)
 **Component Preview**

### Skip Navigation
**Page Usage & Scope**On all pages with Localization NavBar. The Component should be present on every page where there is a Navigation Bar. There are some cases where the Navigation Bar just has a logo, not needed for this casesDynamic pages should have also this Component present.

 **Functionality & Behaviour**This Component was created for Accessibility reasons as request from the Client.Whenever a User is navigating at the Anytime Fitness App, he can do it with the keyboard, in this case when a User escapes main menu a “Skip Navigation” buttons appears, the User can click on that button and will jump into ContentNote that it is not needed on pages with Component "PurposeBrands NavBar" as that Component has already the button

 **Configuration & Settings**The Component is usually on top of the HTML Elements of the page. Right after it you will have the “Localization NavBar Component”The main wrapper (class “.main-wrapper·) should have an id in every page so with that reference we can skip Navigation Bar and get to the Content directlyWe are using “main-content” id for this main-wrapper The properties for both, Skip navigation Component and main-wrapper should be define in the properties panel on the right

 **Component Preview**

### Non US Banner 
**Page Usage & Scope**This Component is on the top of the page, availabe at following pages:

- Employee Wellness
- Blog
- Employment
- Membership Enquiry
- Contact Us
- Schedule an appointment
- Invite friend
- Try us free
- Home
- Training
- Membership
- Find Gym
 **Functionality & Behaviour**It shows a dropdown to change the language. If User changes language he is redirected to the proper site or to the proper Locale.Can be closed at any moment. **Configuration & Settings**This Component is made up with Code **Component Preview**
