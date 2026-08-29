# [Webflow / AWS / React] New locale go live checklist

Tab: Resources
Source: https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=3d9c9ae8-4eb3-4670-8041-0f4388c4e5f2
Updated: 2026-06-08T18:21:44.459Z

**Sitemap.xml update in AWS**

Update `SUPPORTED_LOCALES` list in `IaC/webapp-frontend/lib/resources/files/lambdas/webhook-lambda/handler/index.js` 

**React updates? if any.  If none, mention this in the document**

No updates needed if all iframes are already done and tested before launch.

## **Webflow updates**

### Hreflang
- Update Project settings > Head code
- Add locale to the array
- 

### Set robots meta tags to index
- Update Project settings > Head code
- Remove the locale in noindex paths

### Update Webflow CMS
- Countries Collection →  `find gym url` field updated to the locale’s new /find-gym url
- The Find Gym Url will contain an old find-gym URL for the country's old wordpress site and top level domain
- This needs to be updated to www.anytimefitness.com/{locale}/find-gym
- **Example)**
- **old -> ** www.anytimefitness.co.in/find-gym
- **new -> ** www.anytimefitness.com/en-in/find-gym
- Turn ON Migrated switch field in countries collection
- 

### NON US banner component
- Update `NON US banner `component
- Set `isMigrated: true`
- 
**SEO Updates**

Google Search console - submit new sitemap
