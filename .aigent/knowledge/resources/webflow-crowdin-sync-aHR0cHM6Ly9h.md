# Webflow ↔ Crowdin Sync

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=c4685a09-9a89-45a9-862b-eb1ad09dcc1d
Updated: 2026-07-14T18:56:01.589Z

## Overview
This document describes how to manage the localization workflow between **Webflow** and **Crowdin**. It covers editing locale-specific copy, excluding irrelevant files from Crowdin, syncing per language, pages that should not go through Crowdin, and known issues with workarounds.

**Important:** Webflow is the source of truth for page structure and content. Crowdin is the translation management layer sitting in the middle. Changes to translated strings should always go through Crowdin — never directly in Webflow for localized content, unless the page is on the Do Not Translate in Crowdin list.
## 1. Editing Page Copy for a Specific Locale
Use this workflow whenever you need to update a string for a specific language — for example, fixing a translation, adjusting copy for a market, or applying a content update that only affects one locale.

⚠️ **Any content manually translated directly in Webflow will be overwritten the next time a Crowdin sync runs for that file or language.** Always make string edits in Crowdin, not in Webflow, unless the page is on the Do Not Translate in Crowdin list.
### Steps
- **Sync the specific file from Webflow → Crowdin**
In Crowdin, go to **Integrations → Webflow**. Trigger a sync for the specific file or page that contains the string you need to edit. Avoid syncing everything if you only need one file — this keeps the process clean and avoids overwriting other in-progress translations.

- **Open the Crowdin Editor**
Navigate to the file in Crowdin and open it in the String Editor. Make sure you are viewing **"All content"** (not just "Translated") so all strings are visible — see [Known Issues](https://app.getguru.com/card/TxE5dgBc/Webflow-Crowdin-Sync#M3hZBRFHa1YV) for details on why this matters.

- **Apply your changes to the target string**
Find the string, select the correct target language, and apply your translation or copy update. Save the string in the editor (CTRL + Enter).

- **Sync that specific file or language back to Webflow**
Back in **Integrations → Webflow**, trigger a sync for only that file or that language to push the changes back. Do not run a full sync unless intentional — a broad sync can overwrite other locale work.

- **Publish in Webflow**
After the sync completes, go into Webflow and publish the relevant page. Verify the change appears correctly on the live or staging URL.
- **Screenshot + document before moving the ticket to Ready for QA**
Take a screenshot of:
- The updated string in Crowdin
- The updated page in Webflow
Attach both to the ticket before marking it **Ready for QA**. This protects the change from being silently overwritten in a future broad sync and gives QA a clear baseline to verify against.

💡 Always sync at the smallest scope possible (file → language → full) to avoid unintentional overwrites. A full sync will pull all Webflow content back into Crowdin and can overwrite your saved strings if the Webflow source has drifted.⚠️Only project admins can sync files on Crowdin
### 1.1 Updating a Live Component or Section in a secondary locale
Use this workflow when you need to **replace or update a live element** (such as a hero banner, section, or component) on a page that is already published across multiple locales. The goal is to ensure there is **zero time where a secondary locale shows untranslated or primary-locale content** on a live page.

This is the process will prevent reversion issues we have had in the past, where a new element went live before translations were in place.

⚠️ **Never hide the current live element until the replacement is fully translated and ready to publish.** Removing or hiding the old element before translations are in Webflow will expose the untranslated primary locale content to secondary locale visitors.
### Steps
- **Keep the old element visible and live while you build the replacement**
Don't touch the existing published element yet. Work on the new element/section in Webflow as a hidden element — set it to hidden across **all locales** so it doesn't accidentally go live in any locale mid-work.
- **Push the ****hidden**** new element to production in Webflow**
Publish the page with the new element still hidden in all locales. At this point, live visitors still see the original element — nothing has changed for any locale.
- **Sync the relevant Webflow page to Crowdin**
In Crowdin, go to **Integrations → Webflow** and trigger a sync for the specific page. This pulls the new hidden element's strings into Crowdin so they're ready to translate.
- **Translate the new element in Crowdin across all required locales**
Open the file in the Crowdin Editor (make sure you're viewing **"All content"**). Translate the new element's strings for every active locale. Save and confirm all translations before moving on.
- **Sync the page from Crowdin back to Webflow**
In **Integrations → Webflow**, trigger a sync for the relevant page or for each language. This pushes all the completed translations into Webflow for the new element.
- **In Webflow: unhide the new element, hide/delete the old one, and publish**
Now that the new element has translations in all locales in Webflow:
- Unhide the new element across all locales
- Hide or delete the old element across all locales
- Publish the page
Because the new element was already translated before it became visible, every locale shows the correct content from the moment it goes live.

💡 If the new element is large or translation turnaround will take time, co-ordinate with the relevant locale teams before starting. Keeping the old element live during translation means visitors aren't impacted while work is in progress.
### 

### 1.2 TRANSLATING ALT TEXTS
Alt texts for images are now handled through Crowdin, just like page copy. The process is identical to the standard string-editing workflow in Section 1 — the only difference is **where** the strings live: alt texts are found in the **Assets folder** in Crowdin, rather than in a page or CMS file.

ℹ️ Alt texts are pulled from Webflow's asset metadata. Because they're tied to assets and not to a specific page, you'll find them grouped under the Assets folder in the Crowdin file tree.

STEPS

- **Sync the new asset from the assets folder from Webflow → Crowdin**
In Crowdin, go to Integrations → Webflow. Trigger a sync for the asset so the latest alt texts are available for translation.
- **Open the asset file in the Crowdin Editor**
Navigate to the Assets folder in Crowdin and open it in the String Editor. Make sure you are viewing "All content" (not just "Translated") so all alt text strings are visible — see Known Issues for why this matters.
- **Apply your translation to the target alt text**
Find the alt text string, select the correct target language, and apply your translation. Save the string in the editor (CTRL + Enter).
- **Sync the asset file back to Webflow**
Back in Integrations → Webflow, trigger a sync for only the updated asset to push the changes back. Do not run a full sync unless intentional.
- **Publish in Webflow**
After the sync completes, go into Webflow and publish the relevant page(s) where the image appears. Verify the translated alt text appears correctly (inspect the image element or check via the page source).
- **Screenshot + document before moving the ticket to Ready for QA**
Take a screenshot of the updated alt text string in Crowdin and the corresponding image in Webflow, and attach both to the ticket before marking it Ready for QA.
💡 The same smallest-scope-possible principle applies (Assets folder → language → full). Sync only what you need to avoid overwriting other in-progress translations.⚠️ Only project admins can sync files on Crowdin.
## 2. Do Not Translate in Crowdin
The following files should **not** go through Crowdin, either because they don't require translation or because syncing them carries a high risk of overwriting sensitive or manually managed content. If localization is needed for any of these, it should be done **directly in Webflow**.

⚠️ The items below are either already excluded via the sync patterns above, or should be added to the pattern if they appear in Crowdin.
### Collections
These CMS collections contain data that doesn't benefit from translation through Crowdin, or where Crowdin sync introduces risk:

- Accordions
- Locations
- Amenities
- Staff
- Plans
- Announcements
- Schemas
- Gym Images
- Purple Perks
- Local Offer Pages
- Member Offers Pages
- News and Press Releases
- Blogs CCCs
- International Locations
- Testimonials
- Corporate Membership

### Components
These components are either globally shared, structurally complex, or maintained separately:

- Navbar
- Non US banner
- Footer
- **Events components:**
- Events - Location Search
- Events - Accordion
- Events - Apple Fitness+
- Events - Callout
- Events - CTA Block
- Events - Disclaimer
- Events - Feature Checklist
- Events - Hero Two Column Stretch
- Events - Iframe
- Events - Membership Benefits
- Events - Nearby Locations
- Events - Open Video Modal
- Events - Page CSS
- Events - Promo Iframe
- Events - Success Stories
- Events - Terms Modal
- Events - Two Column
- Events - Watch Video Button
- Events - Youtube Modal
- **Backup/Unused components:**
- Calendly AF
- Feedback Button
- Localization Footer
- Localization Navbar
- Membership/Testimonials
- Test
- Footer Locale Modal
- Locale Font CSS
- RTL custom CSS

### Pages
These pages are unused, under active development, or maintained outside of the standard localization flow:

**Unused / test pages:**

- Membership Old
- Training Old
- Test all Locations
- Branch Test
**Legal pages** — these require formal legal review per market and should not be machine-translated or translated via Crowdin without explicit approval:

- Club Rules and Regulations
- DMCA
- Offer Terms
- Text Messaging Terms
- Continued Operations Accessibility and Maintenance
- Canada Policy
- Privacy Japan
- Club Hub Terms
- afm-terms
- GDPR
- afm-tc
- Terms of Use
- Membership Terms
- Data Privacy Request
- android
- iOS
**Events —** high risk of overwriting sensitive content

- Events
- Events 2.0
**DOCS **— Internal documentation pages — no localization needed:

- Style Guide
- RTL docs
**Templates **— some CMS templates are not used — no localization needed:

- AF Terms and Conditions Template
- Training Success Stories Template
- Amenities Template
- Accordions Template
- Amenities Categories Template
- Announcements Template
- Corporate Memberships Template
- Gym Images Template
- International Locations Template
- Gym Statuses Template
- Countries Template
- States and Provinces Template
- Plans Template
- Purple Perks Template
- Schemas Template
- Staff Template

## 3. Excluding Files from Crowdin Sync
Crowdin can quickly become cluttered with CMS content that doesn't need translation — such as internal collections, components, or schema definitions. Excluding these files keeps the translation workspace focused and prevents translators from seeing irrelevant strings.

⚠️Only project admins can edit exclusion patterns
### How to configure exclusions
- In your Crowdin project, navigate to **Integrations** in the left sidebar.
- Select **Webflow** from the list of connected integrations.
- Inside the Webflow integration panel, click **Settings → Advanced**.
- Enter your exclusion patterns in the **"Hide files matching pattern"** field. Files matching these patterns will be hidden from Crowdin and will not be synced or made available for translation.

### Current exclusion patterns

```
/**/{Collections/{Accordions,Locations,Amenities,Staff,Plans,Announcements,Schemas,Gym Images,Purple Perks,Local Offer Pages,Member Offers Pages,News and Press Releases,Blogs CCCs,International Locations,Testimonials,Corporate Membership}/**,Components/**/*[Nn]av[Bb]ar*,Components/**/*[Ff]ooter*,Components/**/Apple Fitness Terms & Conditions/**,Components/**/Events -*,Components/**/*Gym Count*,Components/**/*[Tt]est*,Components/**/{Calendly AF,Feedback Button,Localization Footer,Localization Navbar,Membership/Testimonials,Locale Font CSS}/**,Pages/**/*[Oo]ld*,Pages/**/*[Tt]est*,Pages/**/{Club Rules and Regulations,DMCA,Terms of Use,Offer Terms,Text Messaging Terms,Privacy,Canada Policy,Privacy Japan,Membership Terms,Club Hub Terms,afm-terms,GDPR,afm-tc,Data Privacy Request,android,iOS,Events,Events 2.0,AF Terms and Conditions Template,Training Success Stories Template,Amenities Template,Accordions Template,Amenities Categories Template,Announcements Template,Corporate Memberships Template,Gym Images Template,International Locations Template,Gym Statuses Template,Countries Template,States and Provinces Template,Plans Template,Purple Perks Template,Schemas Template,Staff Template}*,Pages/**/Style Guide*,Pages/**/*Continued Operations*,Pages/**/*[Pp]rivacy*,Pages/**/*[Rr][Tt][Ll]*}
```

### Pattern syntax reference
Crowdin uses glob-style patterns (similar to `.gitignore`). Key syntax elements:

| Pattern | Meaning |
| --- | --- |
| ** | Matches any path segment, including nested folders. Use at the start to match regardless of depth. |
| * | Matches any characters within a single path segment (no slashes). |
| {A,B,C} | Matches any one of the comma-separated alternatives. No spaces inside braces. |
| trailing / | When a pattern ends with a slash (e.g. /**/Components/), it matches that directory and everything inside it. |
**Useful resources:**

- [Crowdin File Management & Filtering Documentation](https://support.crowdin.com/files-management/)
- [Glob Pattern Reference — Wikipedia](https://en.wikipedia.org/wiki/Glob_(programming))
- [Globster — Interactive Glob Pattern Tester](https://globster.xyz/)
💡 **Tip:** Test your patterns with an interactive glob tester before applying them in Crowdin. A mistake like a missing `**` can silently fail to exclude content you intended to hide. When adding a new CMS collection, always check whether it needs to be added to the exclusion list before the first sync.
## 4. Syncing Per Language
Syncing per language is the recommended approach when onboarding a new locale or when you need to push or pull content for a single market without affecting other languages.

### How to sync per language
- Go to **Integrations → Webflow** in your Crowdin project.
- Open the **Filter** options within the integration panel.
- Select the target language from the dropdown (e.g. Arabic (Kuwait), English (Australia)).
- Trigger the sync. Only content for the selected language will be pushed to Webflow.

ℹ️ Per-language syncs are especially important when a language is first set up in Webflow. Running a full sync before the locale is fully configured in both tools can result in incomplete or mis-routed content.
## 5. Known Issues & Workarounds

| Known Issue | Workaround |
| --- | --- |
| Strings not visible in the Editor — the default filter only shows "Translated" strings | In the Crowdin editor, switch the filter from "Translated" to "All content" to see all strings including untranslated and hidden ones. This needs to be set each time you open a file. |
| Items hidden on the primary locale may not appear in Crowdin | If a Webflow CMS item is hidden or unpublished in the primary locale, it may not be pushed to Crowdin during sync. Verify the item is visible/published in the primary locale before expecting it to appear for translation.Please note that this applies to CMS items, not pages. Pages can't be created per-locale, they need to exist on the primary locale; |
| Links and images are not updated through Crowdin | Crowdin only manages text strings — including image alt texts, which are now available under the Assets folder. However, the images themselves (the actual files) and locale-specific link URLs must still be updated directly in Webflow; they will not be synced from Crowdin. |
| Manually translated content in Webflow is overwritten on sync | Always make string edits in Crowdin, not Webflow. If a page must be translated directly in Webflow, add it to the Do Not Translate in Crowdin list and exclude it from syncs. |
| Custom elements on Webflow are not available to translate on Crowdin | Always prefer using Webflow's native elements (heading, paragraph, text block, etc.) to make sure the text is available for translation |
| List elements on Webflow are not available to translate on Crowdin | When working with lists, always input a text block inside the list item. Otherwise it won't have any strings available to translate in Crowdin. |
⚠️ Links and images being outside the Crowdin sync scope is a hard platform limitation. If your locale requires different hero images or market-specific CTAs, handle those in Webflow directly after the Crowdin sync is complete.
## 6. Additional Resources & Best Practices

### Official documentation
- [Crowdin + Webflow Integration Guide](https://support.crowdin.com/webflow-integration/)
- [Crowdin String Editor Documentation](https://support.crowdin.com/online-editor/)
- [Webflow Localization Overview](https://university.webflow.com/lesson/webflow-localization)
- [Crowdin File Filters & Exclusions](https://support.crowdin.com/files-management/)
- [Globster — Interactive Glob Pattern Tester](https://globster.xyz/)

### Best practices
- Always sync at the smallest scope possible (file → language → full) to avoid unintentional overwrites.
- Before a new locale goes live, do a dedicated per-language sync and a full QA pass on the Webflow staging environment.
- Keep the exclusion pattern list updated whenever a new CMS collection is created — make this part of the collection creation checklist.
- Use the **Crowdin Glossary** for brand terms, product names, and terms that should not be translated (e.g. "Purple Perks", specific gym product names). This prevents translators from inadvertently localizing protected terms.
- Add a mandatory **Crowdin string screenshot + Webflow page screenshot** to every localization ticket as a QA checklist requirement before it moves to Ready for QA.
- **Backups **of the translation files should be done at least on a monthly basis; Current backups stored at [this folder.](https://drive.google.com/drive/folders/10wvSUsgZVVlyRr-8WGNNzTJpqlxA_X8I)

## 7. Quick Reference

| Task | Where / How |
| --- | --- |
| Edit a string for one locale | Crowdin Editor → find file → All content → edit string → sync file/language back → publish → screenshot |
| See newly added strings on Crowdin | Crowdin → Integrations → Webflow → select the updated file → Sync to Crowdin |
| Exclude a file or folder | Crowdin → Integrations → Webflow → Settings → Advanced → Hide files matching pattern |
| Sync one language only | Crowdin → Integrations → Webflow → Filter → Select language → Sync |
| See all strings (not just translated) | Crowdin Editor → filter dropdown → All content |
| Update an image for a locale | Must be done directly in Webflow — not via Crowdin |
| Update a link for a locale | Must be done directly in Webflow — not via Crowdin |
| Check if a CMS item is missing from Crowdin | Verify the item is published/visible in the primary Webflow locale |
| Translate a page on the Do Not Sync list | Translate directly in Webflow — do not sync through Crowdin |
| Protect a manual Webflow translation from being overwritten | Add the page to the exclusion pattern list in Integrations → Webflow → Settings → Advanced |
| Translate an image's alt text | Crowdin → Integrations → Webflow → Assets folder → All content → edit string → sync Assets/language back → publish → screenshot |
