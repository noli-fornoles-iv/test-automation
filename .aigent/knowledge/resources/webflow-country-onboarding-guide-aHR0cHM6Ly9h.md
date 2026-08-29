# Webflow Country Onboarding Guide

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=9bfcf6d9-5248-4ef7-8b0f-3829697c3663
Updated: 2026-08-28T09:20:00.043Z

When setting up a new locale, the [AF Locale Inventory](https://docs.google.com/spreadsheets/d/1dD0vnEOuEgnuPKcrKkbUzpGv1j7VZchX/edit?gid=1799873444#gid=1799873444) will be your guide. First, open the **1. Locale Status & Flows** tab and find the row with you new locale's information. In the first columns, you'll see the tartget language, ISO code, migration target dates, etc. Once you have that information, please follow the following steps to setup the new locale on Webflow:

- At the top, click the localization icon
- Click "add new locale" and select the language and country you got from the Locale Inventory
- Keep "enable publishing to the subdirectory" off for now
- Review list of pages to be published
- Draft every page that will not be publish on the Locale

## Scan for Apple Fitness + Content
- Check the AF locale inventory to see if your locale will have Apple Fitness Plus enabled
- **ENABLED**
- Check for a ticket with details on the page.  If there are no tickets, notify the Project Manager
- Project Manager will seek out details on the Apple Fitness Plus page
- **NOT ENABLED**
- Scan and replace Apple Fitness Plus content across the pages you've created
- **⭐ Home Page**
- **1. Update Hero Banner**
- H1
- **White: **HERE FOR YOU,
- **Aqua: **ANYTIME.
- Sub paragraph
- Train for the moments that matter most. Build strength, confidence, and healthier habits with 24/7 global access, expert guidance, and a welcoming community.
- CTA
- TRY US FREE -> link to try us free page
- IF the country doesn't offer free trials, then replace with FIND GYM. Link to /locations page.
- **2. Hide Apple Fitness Plus anchor link on checkmark "Free access to Apple Fitness+ (See Details)"**
- 
- **3. Hide Apple fitness Plus Section and the Terms & Conditions**
- 
- **4. Make visible the "Everything You Need to Train Smarter." section of the page**
- **⭐ Membership Page**
- Remove the fourth section that shows apple fitness plus.  Expected outcome should be as follows:
- ⭐ **Events Promo Page**
- Ensure the apple fitness plus section is not visible
- ⭐ **LLP Page**
- Toggle Apple Fitness + to **OFF** within the Countries Collection in the Webflow CMS

## **Events Pages**
Check for "National campaign" tickets in the Jira board and ensure appropriate events page is published.  

**Couldn't find a national campaign page? **If we don't get a "National campaign" ticket for the country, we will just create a generic `events/promo` page for them.

- Translate content manually
- Ensure robots index is OFF
- Ensure its not included on sitemap using sitemap toggle
- For locales requiring an Events Promo page, translate the page content manually directly within Webflow.
- Ensure the iFrame component properties (props) in Webflow match the setup in React so both environments stay in sync.
- Use AF Webapp iFrames Crowdin translation strings to update all necessary iFrame props.

- To make the page accessible on PROD update the page settings custom code **enableRedirect** to false. 
Note: Revert back to true and update the date once we are already setting up the National offer.

## Components
- Edit Component Properties for NavBar and Footer
- If working on localized content, we should update the Locations Template Navbar component CTAs. These ctas have conditional visibility per studio status. We should update it on 3 parts of Navbar component. Please see screenshot.
- For the translations of the Navbar CTAs, we can get the values from crowdin.

## APP store badges 
- For translated locales use translated badges.
- Navbar
- Footer
- Apps page
- [App store.zip](https://content.api.getguru.com/files/view/06e4dca8-caad-4f3d-9ff0-d762337b9643)
- [Google play.zip](https://content.api.getguru.com/files/view/9c9203c6-155c-425d-9c30-e251b21235a8)
 

## CMS
- Remove CMS Items not used for the new Locale: If Country has no blogs, remove Blog items on Locale CMS
- Remove also Blog Categories items on Locale CMS
- Remove Training Sub-pages in Locale CMS
- Remove International locations items for the added locale/country
- Publish the items needed for the country since it's added with Queue to publish status e.g Accordions collection
 

### Updating CMS items
In order to prevent localization issues and cross-locale mix-ups, make sure to export the items from the primary locale, switch to the new locale you're setting up, delete the ones already there and then reimport the items you exported from the primary locale; That way you make sure each item is individual for that locale. Update CMS Country items for:

- Accordions (only in the Locale)
- Testimonials
- Purple Perks
- News & Press Releases
- Training Success Stories
- Group Offer Pages
- Any other Collection not controlled directly by Client
- Blogs: If there are no blogs be sure to delete item on the Locale. You may find that you can not delete some blog posts because they have multi-reference fields. So for that you will go to the CMS of the Locale, delete the references and the delete the blog articles. You could also find some CMS Subtraining pages referenced. In that case: Make sure you won't have Subtraining pages on that Locale so you can delete them and also their reference to articles.
 

## Schemas
First we will differentiate Schemas for Static and Dynamic pages

### Static Pages
For Static pages, we have created a Collection List for Schemas, this way we set up everything in the CMS and then build the Schema with a Code EmbedStarting point is this 

[Spreadsheet](https://docs.google.com/spreadsheets/d/1kGzy5nV_cPE9dRi44luc3D7lI0TTiUNoIaEkP6fehaE/edit?usp=sharing) so if you have to set up a new Locale, you can duplicate the Primary Locale into a new Tab. All the fields and values you see there are the same we have at Webflow, so you prepare the .csv, export it and import. You'd better wait until you have all data from the Locale, this means:

- Page url: Every url for every page, you can do this with search/replace once you know the Locale
- Home url of the new Locale
- Meta title and Meta description: Confirm with PM you will use the same for the new Locale
- Note: the schema description and the page meta description do not have to match. The schema description can be longer and more detailed, while the page meta description is the user-facing click-through copy. These serve different purposes, so do not assume a mismatch is an error. This has caused confusion in QA before.
- datePublished and dateModified: These fields are strings (because if we use Data Webflow changes formats). These values should be the day Locale is launched. Confirm with PM
- BreadcrumbList 2 might have some slight change
- General Description: This will be Anytime Fitness + Country
- inLanguage: This is the Locale code, must be Language in lowercase, Country in uppercase (en-US, en-AU, ar-SA, etc.)
- Social Media urls: Be sure to get these values and confirm with PM, if there are no values, let it empty 

 Once you have the spreadsheet ready, export csv, go to the Locale and import values there. 

 The Schema Collection has exactly the same fields:

 So every static page has a Schema Collection filtering by Page name, as follows:

 We have values in the CMS even for Draft pages (they could go to PROD in the future).If the Locale you are setting up has not all values for Social Media, you should go for each page in the Locale and delete those in the Code EmbedIf you are setting up a new Locale and by any chance you find a new page, you should add items for all Locales. There is a common pattern for the Schema, here I attach a Code block with it. The words in uppercase are what you will replace by binding with the CMS values.

```

  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "PAGE URL",
        "url": "PAGE URL",
        "name": "META-TITLE",
        "isPartOf": {
          "@id": "HOME URL#website"
        },
        "primaryImageOfPage": {
          "@id": "PAGE URL#primaryimage"
        },
        "image": {
          "@id": "PAGE URL#primaryimage"
        },
        "thumbnailUrl": "https://cdn.prod.website-files.com/66aa8fe9dc4db68f448a978f/6759b3215d7d3cb5fabf3e89_logo-purple-black-desktop.svg",
        "datePublished": "DATE PUBLISHED",
        "dateModified": "DATE MODIFIED",
        "description": "META-DESCRIPTION",
        "breadcrumb": {
          "@id": "PAGE URL#breadcrumb"
        },
        "inLanguage": "INLANGUAGE",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "PAGE URL"
            ]
          }
        ]
      },
      {
        "@type": "ImageObject",
        "inLanguage": "INLANGUAGE",
        "@id": "PAGE URL#primaryimage",
        "url": "OPENGRAPH URL PATH",
        "contentUrl": "OPENGRAPH URL PATH",
        "width": 1200,
        "height": 630
      },
      {
        "@type": "BreadcrumbList",
        "@id": "PAGE URL#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "BREADCRUMBLIST 1",
            "item": "HOME URL"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "BREADCRUMBLIST 2"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "HOME URL#website",
        "url": "HOME URL",
        "name": "GENERAL DESCRIPTION",
        "description": "GENERAL DESCRIPTION",
        "publisher": {
          "@id": "HOME URL#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "HOME URL?s={search_term_string}"
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              "valueRequired": true,
              "valueName": "search_term_string"
            }
          }
        ],
        "inLanguage": "INLANGUAGE"
      },
      {
        "@type": "Organization",
        "@id": "HOME URL#organization",
        "name": "GENERAL DESCRIPTION",
        "url": "HOME URL",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "INLANGUAGE",
          "@id": "HOME URL#logo",
          "url": "https://cdn.prod.website-files.com/66aa8fe9dc4db68f448a978f/6759b3215d7d3cb5fabf3e89_logo-purple-black-desktop.svg",
          "contentUrl": "https://cdn.prod.website-files.com/66aa8fe9dc4db68f448a978f/6759b3215d7d3cb5fabf3e89_logo-purple-black-desktop.svg",
          "width": 161,
          "height": 43,
          "caption": "GENERAL DESCRIPTION"
        },
        "image": {
          "@id": "HOME URL#logo"
        },
        "sameAs": [
          "FACEBOOK",
          "TWITTER",
          "INSTAGRAM",
          "LINKEDIN",
          "PINTEREST",
          "YOUTUBE"
        ]
      }
    ]
  }

```

###  SOCIAL MEDIA BUTTONS
Each country has their own specific social media links.  To find the social media links for the given country, there are two places to check.  

- Check the JIRA ticket board for the "Footer" ticket.  E.g.,) Canada - Footer
- Ticket will contain something like -> Facebook - https://www.facebook.com/AnytimeFitnessCanada/
- Check the old wordpress site for that country.  The old website can be googled and has a unique top level domain for that country.  E.g.,) India's old wordpress site is www.anytimefitness.co.in
Once you have a full list of social media buttons, you must update them in the following pages / components for that locale.

- Footer component
- /thank-you page
- Markup schema Collection in Webflow CMS
Do not add links for social media that is not associated to that country.  

If a platform does not exist for that country, leave it blank, then verify the schema has dropped the empty sameAs lines so there are no blank entries in the markup.

### Footer
Please check your footer links before finalizing a cohort.  If you drafted or undrafted certain legal pages, FAQs, or Own a Gym - its highly likely your footer links will need to be modify

To check this - check your footer links against the AF Local Inventory that you previously filled.

**Footer link - Franchise login **

Each country should have its own top level domain for this link https://db.anytimefitness.{insert TLD here}. Anytime fitness has a redirect system that sends user to anytimefitness.com BUT it adds query params that indicate the country. This ensures gym owners log into the AF dashboard with the correct country. Examples include:

- USA -> https://db.anytimefitness.com/
- Canada English -> https://db.anytimefitness.ca/
- Canada Quebec -> https://db.anytimefitness.quebec/ 
- Australia -> https://db.anytimefitness.com.au/
- Austria -> https://db.anytimefitness.at/
- Germany -> https://db.anytimefitness.de/
- Italy -> https://db.anytimefitness.de/
This must be done for all locales.  Test the link as well.  If you get a 404, then its possible that you have the wrong top level domain.  Check the old wordpress site for that country and you should see the proper top level domain.  

### Testing
There are several ways to test Schemas, I recommend to check on all if you are working with a new page

- Schema Validator ﻿   ﻿ This is a page where you can test by url or by Code. 
- Google Rich Result Test ﻿[GoogleRich Results Test - Google Search Console](https://search.google.com/test/rich-results)﻿
- You can check here by url or by Code
I recommend to check by Code, because there are some environments that won't work with urls (DEV, SIT, UAT) as they are protected from robots. So:

- You prepare your Schema
- You export to SIT
- View source code
- Get the Code from there
- Paste the Code in the Validator 
- You should see all checks ok:
 

- You can also test with ScreamingFrog once you have your Locale set up. There are 53 Static pages now
- Finally, best way to test this is with Google Search Console, so tell PM to check if there is a warning
 

### FAQ Page Testing
Testing this page is extremely complicated, this page has some Javascript functions that take time, so if we test the code as the rest of the other pages it will not get results because it is still executing the function in the DOM and Google Validator has a restricted time. 

 Instead we will do this:First we open the url, go to Dev Mode (F12) and go to Console, and there we paste this function to generate a JSON: 

```
(function() {  const schemas = document.querySelectorAll('script[type="application/ld+json"]');  let found = false;  schemas.forEach((s, i) => {    if (s.innerText.includes("FAQPage")) {      console.log("✅ ¡Schema FAQ founded!", "color: green; font-weight: bold;");      console.log(s.innerText);      found = true;    }  });  if (!found) console.warn("❌ Can’t find Schema on FAQPage. Revise Webflow script");})();
```
 So like this:

 Then you hit Enter and you will see the JSON generated, Next step: You will see something like this:

 So go to the bottom and click where it says “Copy”, then you go to the 

[Google Rich Text Results](https://search.google.com/test/rich-results) > Code, and there paste this:Important: You need to add lines 1 and 3

```
[PASTE HERE THE JSON]
```
 Where it says [PASTE THE JSON], paste the JSON there.And then click on “Test Code”, if you see something like this we are ok:

### Dynamic Pages
You should do it manually for every locale, just edit the Code Embed. This applies for:

- Blogs (currently only US)
- News and Press (currently only for en-AU)
- Training Subpages
- Blog Categories (currently only en-US)
 Locations page is made with JS, no need to change nothing

Note: the Locations CMS template has its own social fields, which are per-gym and separate from the static page schema. Do not confuse these with the locale-level social links used in the static schema. Updating one does not affect the other.

 

## Localization Settings
- Add new locale in webflow

## Project Settings
- Ensure that the locale is added to `noIndexProdPaths`  so that noindex meta will be added, just need to remove once the DNS cutover is done for that country, reference below:
- Upon DNS cutover need to add the locale on Project settings > Head code to ensure the hreflang will be added, reference below:
 

## Github code
- For the Non US banner component need to update the `localeMappings` object on `components/non-us-banner.js` , usually just need to update the paths and messages if there will be multiple locale supported for the country e.g en-ca, fr-ca. Upon DNS cutover need to update the `isMigrated` to true.
 

## Crowdin Translations
Any new locale spinup should receive a crowdin translation after the necessary initial pages are created.  The following process outlines steps to acheive this:

- Add the language in Crowdin dashboard
- Wait for the background process of crowdin to finish translations 
- Translate all pages by default. During spin-up, Crowdin translates every page for the locale - we do not defer translation to per-page tickets. If the client wants to change specific copy or doesn't want a particular page/section translated, they provide that and we update accordingly. This keeps us from leaving English copy scattered across the locale.
- **Sync the complete locale from Crowdin back to Webflow once everything is built and translated**
After all pages for the locale are created and Crowdin has finished translating, run a full sync of the entire locale from Crowdin to Webflow. Do this as a final pass even if individual pages already look translated. Building and translating page by page can leave some strings on the source English copy when they do not carry through on the first sync, and a complete re-sync of the whole locale catches those leftover English entries before launch. Run this sync as a team, not async. Whenever a dev is assigned a locale spin-up, once they finish the ticket they invite the other members who worked on that locale and the full Crowdin to Webflow sync is done together - one person drives/shares screen, everyone reviews. This is the final step of every spin-up and is what keeps anything from being missed.

## Locations Template H1
- Using custom element for Locations template H1
- This is not supported in crowdin so need to apply the translations using webflow designer.
- Items that needs to be translated manually are highlighted below:
