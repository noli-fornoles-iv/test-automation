# Webflow Components

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=091ea71e-6da2-4c23-8ea5-2833f0033c5f
Updated: 2026-05-05T13:38:34.875Z

Here a list of all the available Components in the project, you can see the number of instances and the pages where they are implemented (right button > Show instances)

 We can group them in different areas:

 

## Navigation and Footer
- PurposeBrands Footer
- PurposeBrands NavBar
- NavBar Just Brand
- Non US Banner
- Skip Navigation

## Blog Components
- Blog / Breadcrumb / Search
- Blog / Browse All Categories
- Blog / Header
- Blog / Navigation
- Blog / Rich Text
- Blog / Search
- Blog / Share
- Blog / Posts Care
- Blog / Posts Coach
- Blog / Posts Connect
 

## Buttons and Badges
- Badge Label
- Badge Store
- Button AF
- Button AF Long
- Button Multiline
- Button Social
- Button Text
 

## Events
- Events - Location Search
- Events - Accordion
- Events - Apple Fitness+
- Events - Callout
- Events - CTA Block
- Events - Disclaimer
- Events - Feature Checklist
- Events - Hero Two Columns Strecht
- Events - iframe
- Events - Membership Benefits
- Events - Nearby Locations
- Events - Open Video Modal
- Events - Page CSS
- Events - Promo iframe
- Events - Success Stories
- Events - Terms Modal
- Events - Watch Video Button
- Events - YouTube Modal
 

## Home
- Home / Hero
- Home / Apple Fitness
 

## Modal
- Apple Fitness Terms & Conditions
- Footer Locale Modal
- Our Partners
- Utility page Locale picker
 

## Backup
- Calendly AF
- Feedback Button
 

## Other
- RTL custom CSS
 

 Now let's dive into them one by one:

## Navigation and Footer
Navigation and Footer

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

****

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
 **Functionality & Behaviour**It 

shows a dropdown to change the language. If User changes language he is redirected to the proper site or to the proper Locale.Can be closed at any moment. 

**Configuration & Settings**

This Component is made up with Code 

**Component Preview**

 

## Blog Components

### Blog / Breadcrumb / Search
**Page Usage & Scope**

The Component is present on every blog page. It is located just after the HeaderThese pages are:

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
- Blog Category page ﻿[AnytimefitnessNutrition - Anytime Fitness](https://www.anytimefitness.com/blog-categories/nutrition)﻿ . There are 10 blog Category pages right now, this is connected to CMS Blog Categories
- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

The Component search keywords across all blog posts. This is the same functionality that old WordPress site hadFor the Breadcrumb: It is binding data from the CMS as follows:Blog / Blog Category Name / Blog Name 

**Configuration & Settings**

Component is connected to Github repository code, using JS. 

**Component Preview**

### 

### Blog / Search
Similar to Blog / Breadcrumb / Search but has not breadcrump

**Page Usage & Scope**

The Component is present on every blog page. It is located just after the HeaderThese pages are:

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
- Blog Category page ﻿[AnytimefitnessNutrition - Anytime Fitness](https://www.anytimefitness.com/blog-categories/nutrition)﻿ . There are 10 blog Category pages right now, this is connected to CMS Blog Categories
- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

The Component search keywords across all blog posts. This is the same functionality that old WordPress site had

 **Configuration & Settings**

Component is connected to Github repository code, using JS.

 **Component Preview**

  

### Blog / Browse All Categories
**Page Usage & Scope**

The Component is present on every blog page at the bottom of the page. These pages are:

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
- Blog Category page ﻿[AnytimefitnessNutrition - Anytime Fitness](https://www.anytimefitness.com/blog-categories/nutrition)﻿ . There are 10 blog Category pages right now, this is connected to CMS Blog Categories
- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

The Component shows six of the tend Blog Categories (CMS) at the bottom of these pages and links each one with its Blog Category page. Currently linking to:

- Getting Started [https://www.anytimefitness.com/blog-categories/getting-started](https://www.anytimefitness.com/blog-categories/getting-started)
- Nutrition [https://www.anytimefitness.com/blog-categories/nutrition](https://www.anytimefitness.com/blog-categories/nutrition)
- How To [https://www.anytimefitness.com/blog-categories/how-to](https://www.anytimefitness.com/blog-categories/how-to)
- Workouts [https://www.anytimefitness.com/blog-categories/workouts](https://www.anytimefitness.com/blog-categories/workouts)
- Ask A Coach [https://www.anytimefitness.com/blog-categories/ask-a-coach](https://www.anytimefitness.com/blog-categories/ask-a-coach)
- Member Success [https://www.anytimefitness.com/blog-categories/member-success](https://www.anytimefitness.com/blog-categories/member-success)
 The other Categories (Coach, Care, Connect, CCC) are not shown, reason for this is we strictly followed old WordPress site which just showed these onessearch keywords across all blog posts. This is the same functionality that old WordPress site had 

**Configuration & Settings**

Component is connected to CMS Blog Categories. There is a field in this CMS called "Displayed in the category filtering" if it is ON, Category will be shown here

 **Component Preview**

 

### Blog / Header
**Page Usage & Scope**

The Component is present on every blog post page at the top of the page. 

- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

Blog Header takes info from CMS Blogs CCC. Make sure you fill in these fields in your blog post:

- Name
- Main image
- Subheader
- Publish Date
- Author
 **Configuration & Settings**

Component is connected to CMS Blogs CCC. If fields are not filled it will show empty.Share buttons are ready to share the Blog Post to the Social Media platform related. 

**Component Preview**

  

### Blog / Navigation
**Page Usage & Scope**

This Component is not being used anymore, but Client could use it any moment. It comes from the old WordPress site, it was used on Blog pagesThese pages are:

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
- Blog Category page ﻿[AnytimefitnessNutrition - Anytime Fitness](https://www.anytimefitness.com/blog-categories/nutrition)﻿ . There are 10 blog Category pages right now, this is connected to CMS Blog Categories
- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

The Component allows User to navigate on the Blog Categories with over/click depending on desktop/mobile.  **Configuration & Settings**

All Blog Categories are shown on navigation 

**Component Preview**

### Blog / Rich Text
**Page Usage & Scope**

The Component is present on every blog post page after the Header 

- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

This Component is a Webflow Rich TextBlog binding the info from CMS Blogs CSS at field "Body"I has a custom code element with CSS Styles at ".blog-rich-text-styles" (inside the Component) Due to limited options for Rich Text you will find some code embeds in them, here a references of thes pieces of code ﻿

[Codepencodepen.io/collection/OyLKmK](https://codepen.io/collection/OyLKmK)﻿ Mainly they are use for layouts, receipts, grey box, and similar UI elements. There is a blog post that you can use for this as guide. It is a draft, so in the CMS Blogs CSS search for "Blog custom layouts", so you can add easily these peaces of code embeds:

 **Configuration & Settings**

For spacing, you should arrange it inside Webflow Rich Text, no need to change anything. The Client is sending detailed info for any heading, grey text, image, alt text or whatever whenever they want to make a new blog post 

**Component Preview**

 

 

### Blog / Share
**Page Usage & Scope**

This Component is used on every blog post

- Blog Post Template ﻿[AnytimefitnessHow to Read Nutrition Labels for Weight Loss: 5 Tips From a Nutrition Coach | Anytime Fitness](https://www.anytimefitness.com/blog/how-to-read-nutrition-labels-for-weight-loss-5-tips-from-a-nutrition-coach)﻿ There are 486 Blog Posts right now, this is connected to CMS Blogs CCCs
 **Functionality & Behaviour**

The Component allows User to share current blog post on the selected Social Media platform: Facebook, X (Twitter), LinkedIn, Pinterest or Mail 

**Configuration & Settings**

Don't need anything as behavior is set 

**Component Preview**

 

### Blog / Posts Care
**Page Usage & Scope**

This Component is used on blog page (static)

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
 **Functionality & Behaviour**

The Component is showing last articles of the CMS Blogs CCC filtering by Blog Category. The filtering is following what Anytime Fitness had in old WordPress site.  

**Configuration & Settings**

You could change the filtering tin the CMS settings right panel 

**Component Preview**

   

### Blog / Posts Coach
**Page Usage & Scope**

This Component is used on blog page (static)

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
 **Functionality & Behaviour**

The Component is showing last articles of the CMS Blogs CCC filtering by Blog Category. The filtering is following what Anytime Fitness had in old WordPress site.  

**Configuration & Settings**

You could change the filtering tin the CMS settings right panel 

**Component Preview**

  

### Blog / Posts Connect
**Page Usage & Scope**

This Component is used on blog page (static)

- Blog page ﻿[AnytimefitnessCoach Care Connect - Anytime Fitness](https://www.anytimefitness.com/blog)﻿ 
 **Functionality & Behaviour**

The Component is showing last articles of the CMS Blogs CCC filtering by Blog Category. The filtering is following what Anytime Fitness had in old WordPress site.  

**Configuration & Settings**

You could change the filtering tin the CMS settings right panel 

**Component Preview**

## Buttons & Badges
Buttons and Badges 

### Badge Label
**Page Usage & Scope**

Badge label can be used in any page 

**Functionality & Behaviour**

It has a merely decorative function to tag content with a label.  

**Configuration & Settings**

This Component has 10 Variants, all for Style, you can see the different combinations at the Style guide at ﻿

[Webflowbranch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#badges-labels](https://branch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#badges-labels)﻿  

**Component Preview**

 

 

### Badge Store
**Page Usage & Scope**

This Component is used on Apple Fitness and Apps page 

**Functionality & Behaviour**

Shows whether Apple Store logo or the Google Play Store, and links to the Anytime Fitness App so User can download it easily 

**Configuration & Settings**

This Component has properties that User can set up on the right panel. So you can play with visibility for it, depending on which Apple Store or Google Play logos you want to show. Say for example you want to show Apple Black and Google Play, you could have two instances of the Component, on the first one you would have visible the Apple black one, and on the second one the Google Play one. You can add the link to the store and decide if you want it for same Tab or new Tab.

 

**Component Preview**

****

 

### Button AF
**Page Usage & Scope**

This is probably the most used Component across all the site as it has 120 instances in many pages.It is also used inside slots on other Components, for example in the NavBar, in the Home Hero or in the Apple Fitness+ Components 

**Functionality & Behaviour**

This Component has 12 different variants according to different styles. You can check at the Style Guide here ﻿

[Webflowbranch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons](https://branch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons)﻿  

**Configuration & Settings**

Note that text properties by now are not translated in Crowdin so you should be aware.Every button has different properties where you can set:

- Link properties
- Text
- Variant
- id (if needed)
- Visibility
 

**Component Preview**

****

 

### Button AF Long
**Page Usage & Scope**

This is similar to Button AF but you can use it when texts are longer 

**Functionality & Behaviour**

This Component has 12 different variants according to different styles. You can check at the Style Guide here ﻿

[Webflowbranch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons](https://branch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons)﻿  

**Configuration & Settings**

You can set up:

- Link Properties
- Text
- Variant

  **Component Preview**

 

### Button Multiline
**Page Usage & Scope**

This is similar to Button AF but you can have texts in two different lines 

**Functionality & Behaviour**

This Component has 6 different variants according to different styles. You can check at the Style Guide here ﻿

[Webflowbranch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons](https://branch--style-guide-anytime-fitness-global-b75033.webflow.io/style-guide#buttons)﻿  

**Configuration & Settings**

You can set:

- Link Properties
- Primary Label text
- Secondary Label text
- Variant
 

**Component Preview**

****

  

### Button Social
**Page Usage & Scope**

Currently is not used but was used on previous versions 

**Functionality & Behaviour**

The button is an .svg that you can replace. Functionality is for sharing content across Social Media 

**Configuration & Settings**

You can set:

- Button Properties
- svg used
 

**Component Preview**

****

 

 

### Button Text
**Page Usage & Scope**

Currently not in use 

**Functionality & Behaviour**

Works as a mix as the UI is like a Badge Label and behauvior is like Button AF 

**Configuration & Settings**

You can set:

- Link Properties
- Text
- Variants (has 3)

 **Component Preview**

## 

## Events
Event Components are present on all Event pages which are the following:

You could find some of them in Draft status, depending on the moment.

 These pages have all the same structrue, they are created from a Webflow Template Page called Events Template. This is the page structure for all the Events pages:

 And these are all the Events Components used across Event pages, all have lots of properties so a Marketer could word easily with them

 Not let's see these Events Components one by one:

 

### Events - Location Search
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

You can search gyms in an area: City, Address, State and the Component will give you results.For any result you can go to the "Free Trial page" or to the "Local Gym page" 

**Configuration & Settings**

There are lots of properties you can set on the right panel. Also you can set properties for the iframe embeddedYou can set up different properties:

- Section id, visibility, desktop and mobile background
- Heading tag and text
- Summary: text and visibility
- iframe has lots of properties you can check them on the Component instance, you will find a tooltip when you hover

  **Component Preview**

 

### Events - Accordion
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

Shows different FAQs. Component is connected to Collection List CMS Accordions, the Component has the ability to filter for the needed ones 

**Configuration & Settings**

You can set up different properties:

- Section id and visibility
- Gray Background on/off
- Heading: Tag, heading part1, heading part 2, Accordion heading tag
- Summarty text: Text an Visibility
- Accordion Collection: Filter by, Sort by
 

**Component Preview**

  

### Events - Apple Fitness+
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

Show features and agreement with Apple Fitness+ 

**Configuration & Settings**

It has properties for Section, left column and right column

- Section: id and visibility
- Left Column: logo, heading tag and text, summary text, button text and link properties, disclaimer text, terms link text, logo alt text
- Right Column: Image and Alt text
 

**Component Preview**

****

  

### Events - Callout 
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

Works like a Call to Action giving more info about the Event 

**Configuration & Settings**

You have different properties you can set:

- Section: id, visibility and grey background
- Heading: tag, eyebrow text, heading text part 1, heading text part 2. Visibility for: text purple, text orange, text aqua, eyebrow
- Summary text (this is a rich text you can edit directly on properties)

 **Component Preview**

 

### Events - CTA Block
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

Shows a Title and different button options to help User find what he wants 

**Configuration & Settings**

You can set up all these properties (showing by group):

- Variant (currently there are two: Block heading and Base)
- Section: id, visibility and grey background
- Heading: tag, text part 1, text part 2, and visibility for text purple, text aqua and text orange
- Summary: text and visibility
- Links 1 to 4: Text and link properties
- Button variant: This affects the three firsts buttons
 

**Component Preview**

****

 

 

 

### Events - Disclaimer
**Page Usage & Scope**

On Events pages with promo 

**Functionality & Behaviour**

Show information about the Event 

**Configuration & Settings**

You can set up the following properties:

- Section: id, visibility, grey background, dark background
- Heading: Tag and text
- Content: This is a Rich Text
 **Component Preview**

 

### Events - Feature Checklist
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

Shows different features of the event 

**Configuration & Settings**

You can set up different properties:

- Section: id, mobile heading text, mobile subheading text
- List items (1 to 5): Text and Visibility
- Apple Fitness+ Visibility: Shows/hides last list item which is Apple Fitness+
 

**Component Preview** 

### Events - Hero Two Columns Strecht
**Page Usage & Scope**

On all Events pages. Placed on the top of the page as Hero 

**Functionality & Behaviour**

Has main information about the Event, the main heading of the page, a main picture and a Call to Action button. 

**Configuration & Settings**

There are lots of properties you can set up, they are grouped in the following:

- Variant (Base or Inline banner text)
- Section: id and visibility
- Heading: tag, eyebrow, Heading text part 1,2 and 3, visibility for text aqua, orange, red and eyebrow
- Summary: Rich Text and Visibility
- Button: Link properties, label, id, variant and visibility
- Disclaimer: Visibility and Rich Text
- Image: img and alt text
 

**Component Preview**

****

  

### Events - iframe
**Page Usage & Scope**

Wherever Component Location Search is used. Inside Component Location Search, you will find Events iframe which controls the iframe inside 

**Functionality & Behaviour**

Takes an iframe and populates all its properties to the Location Search Component 

**Configuration & Settings**

There is a lot you can set up here, but taking into account this component populates all these properties into Location Search Component

 **Component Preview**

 

### Events - Membership Benefits
**Page Usage & Scope**

On all Events pages.  

**Functionality & Behaviour**

Showing Membership benefits features 

**Configuration & Settings**

You can set up the following properties:

- Variant (Base or Inline Text Heading)
- Section: id and visibility
- Heading: Tag, Text Part 1, 2 and 3, visibility for text part3 text aqua, orange and red
- Summary: Text and Visibility
- Cards Heading Tag
- Card (1 to 3): Image, image alt tex, heading text, summary text, all button properties, card visibility
 

**Component Preview**

****

  

### Events - Nearby Locations
**Page Usage & Scope**

Almost on all Events pages 

**Functionality & Behaviour**

Shows an iframe to look for nearby locations 

**Configuration & Settings**

Properties you can set up:

- Section: id, visibility, grey background
- Heading: tag, text, violet, neutral black and purple visibility 
 

**Component Preview**

 

### Events - Open Video Modal
**Page Usage & Scope**

Could be on Events pages, currently without instances 

**Functionality & Behaviour**

Opens a Modal with a video 

**Configuration & Settings**

Currently no settings 

**Component Preview**

Currently no preview

 

 

### Events - Page CSS  
**Page Usage & Scope**

On all Events pages 

**Functionality & Behaviour**

This is a Code Component in order to change add to the page CSS 

**Configuration & Settings**

Just double click on the Component and add the CSS you need for that particular page 

**Component Preview**

This Component has not preview

 

### Events - Promo iframe  
**Page Usage & Scope**

Could be on all Events pages. Currently no instances

 **Functionality & Behaviour**

- It adds an iframe. 
 **Configuration & Settings**

You can set up:

- Slug
- Variant 
- Event name
- Locale
 **Component Preview**

No preview available right now

 

### Events - Success Stories
**Page Usage & Scope**

On Events pages 

**Functionality & Behaviour**

Shows a section with User testimonials, usually linked to US Blog pages 

**Configuration & Settings**

All these properties can be set:

- Section: id, visibility, grey background
- Summary: Text and visibility
- Heading: Tag, text part 1 and 2, visibility for text purple, orange and aqua
- Card headings:  Heading tag, visibility for Purple, Black and violet heading, h1 subheading tag, Subheading black, violet and purple visibility
- Button: Variant, Icon Visibility, Open Link, Open Modal, Modal Button Variant
- Collection: Filters and Sort
 

**Component Preview**

****

 

 

### Events - Terms Modal
**Page Usage & Scope**

On Events pages 

**Functionality & Behaviour**

Opens a Modal center in the stage with Terms and Conditions 

**Configuration & Settings**

No properties here. Modal is triggered from Component Events - Apple Fitness+ with button "See details" using Webflow Native Interactions 

**Component Preview**

  

 

### Events - Watch Video Button 
**Page Usage & Scope**

On all Events pages. This Component is inside Events - Success Stories.  

**Functionality & Behaviour**

The Button is connecting with CMS Training Success Stories and field Linked Blog 

**Configuration & Settings**

All is set up, linked to the CMS. Could be that instead of a blog post, Clients wants a video, in that case there is a field for that data-video

 

**Component Preview**

****

  

### Events - YouTube Modal
**Page Usage & Scope**

On Events pages. Currently not active 

**Functionality & Behaviour**

Opens a modal window with a YouTube video 

**Configuration & Settings**

No properties here 

**Component Preview**

Not available right now

## Home

### Home / Hero  
**Page Usage & Scope**

The Component is present in the Home page on the top for most of the Locales 

**Functionality & Behaviour**

This Component has a lot of properties and even a Button AF Component inside.Take into account that properties values are not spread in Crowdin, you may need to update properties once you set up a new Locale. 

**Configuration & Settings**

You can set up different properties:

- h1 white text
- h1 aqua text
- Main Paragraph
- Main Image
- Terms & Conditions text
- Disclaimer text
- Disclaimer link: Usually instead of a page/url it links to a section id (there should be other section in the page with the id)
- Call to Action Button

  **Component Preview**

  

### Home / Apple Fitness  
**Page Usage & Scope**

This Component is present on Home and Locations Template (dynamic) 

**Functionality & Behaviour**

Whatever 

**Configuration & Settings**

There is a lot you can set up on Component Properties:

- Apple Logo
- Main text
- Main paragraph
- Right Image
- Call to Action Button Properties (Compoment Button AF)
- Disclaimer Text, Link, Visibility, Variant, etc.

  **Component Preview**

 

## Modal

### Apple Fitness Terms & Conditions
**Page Usage & Scope**

Used on the followin pages:

- Promo
- Train for your life
- Free Trial
- HSA/FSA
- Membership
 **Functionality & Behaviour**

This is a Modal. It is triggered by a button with Webflow Native Interactions.Be aware, do not edit this interactions as it may affect other pages. 

**Configuration & Settings**

There is also some accessibility compliance for the Modal so User can navigate with keyboard 

**Component Preview**

  

### Our Partners
**Page Usage & Scope**

This Component is used in Membership page on en-au LocaleIt has the names of all partners of AF. 

**Functionality & Behaviour**

This is a Modal. It is triggered by a button with Webflow Native Interactions.Be aware, do not edit this interactions as it may affect other pages.

**Configuration & Settings**

There is also some accessibility compliance for the Modal so User can navigate with keyboard 

**Component Preview**

 

### Footer Locale Modal
**Page Usage & Scope**

Used on all pages. It is on the Footer clicking on the current Locale (you will see a Global icon with the Country name) 

**Functionality & Behaviour**

The Footer Locale Modal helps User choose between the different Countries/Languages. Once you click a full screen window is available with all Countries ordered by Continent. Every country has a flag, country name and language, and User can select to change to other country.It is retrieving data from CMS Countries  

**Configuration & Settings**

Everthing is disposed so if a new country is added on the CMS, it will appear in the list 

**Component Preview**

  

### Utility page Locale picker
**Page Usage & Scope**

This Component is used on these pages:

- 404
- Search Results
It is on the Footer clicking on the current Locale (you will see a Global icon with the Country name) 

 **Functionality & Behaviour**

Helps User choose between the different Countries/Languages. Once you click a full screen window is available with all Countries ordered by Continent. Every country has a flag, country name and language, and User can select to change to other country.It is retrieving data from CMS Countries 

 **Configuration & Settings**

Everthing is disposed so if a new country is added on the CMS, it will appear in the list 

**Component Preview**

 

## Backup Components

### Calendly AF
**Page Usage & Scope**

The Calendly Component is not used anymore. It was used in the previous old WordPress site and in the first US Webflow version 

**Functionality & Behaviour**

We have even removed the the code for the Calendly third party inclusion on Site Settings > Custom Code, this way we don't load unnecessary scripts 

**Configuration & Settings**

What the Component does is opening a Calendly window so as to set a Call with the Client 

**Component Preview**

No current preview

 

### Feedback Button
**Page Usage & Scope**

Feedback Button is not used anymore. We use it with code instead. So at Site Settings > Custom Code > Footer Code we have the code to add that Feedback button that you see the whole site 

**Functionality & Behaviour**

This is the code to launch the Feedback Button (Site Settings > Custom Code > Footer Code)

```
function loadMedaliaScript() {  const blockedLocales = ['en-ae'];  const path = window.location.pathname.toLowerCase();  const isBlocked = blockedLocales.some(locale => path.startsWith('/' + locale));  if (!isBlocked) {    const s = document.createElement('script');    s.defer = true;    s.src = "https://nebula-cdn.kampyle.com/wu/474274/onsite/embed.js";    document.body.appendChild(s);  }}loadMedaliaScript();
```
 **Configuration & Settings**

No need to add this component anymore 

**Component Preview**
