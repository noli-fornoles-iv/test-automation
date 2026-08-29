# [Webflow] Cohort Release ProcessProcess

Tab: Resources
Source: https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=863829d3-8081-4f5f-9ba6-2900b9785b2a
Updated: 2026-07-02T16:55:52.052Z

- Ticket appears in the backlog.
- **Webflow Developer** begins work on the ticket.
- Developer completes the ticket and keeps personal note that its ready for PROD
- New pages for a cohort should have explicit checks before publishing:
- Cross-check the AF Locale Inventory against the page in development
- E.g.,) Should apple fitness plus be hidden?
- E.g.,) Is the navbar correct?
- Schema is matching expected values
- Check that its in the page elements
- URL's have the proper locale references 
- Meta tags are up to date (Title, description, OG image, etc.)
- [https://detailed.com/extension/](https://detailed.com/extension/)
- Alt Text for image
- Alt Text Checker (Chrome Extension): [https://chromewebstore.google.com/detail/image-alt-text-viewer/nhmihbneenlkbjjpbimhegikadfleccd](https://chromewebstore.google.com/detail/image-alt-text-viewer/nhmihbneenlkbjjpbimhegikadfleccd)
- Accessibility and Page Speed Check
- Performance [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
- Accessibility: [https://wave.webaim.org/](https://wave.webaim.org/) 
- Verify CTA buttons are working
- **Crowdin -> **Translations applied to all in-page content.   Check for common failure points, including:
- Hyperlinks translated
- React forms not translated - notify React Team if it happens
- Ensure browser translate also working.  Apply styling to any CTA button issues that happen when using browser to translate English > Locale language > back to English
- Mobile and Desktop viewports look correct
- Ensure Copy from the client's Marketing Team is up-to-date
- E.g.,) Update old wordpress URL's to the new webflow URL
- **Webflow Developers -> Daily Deployment Process**
- Webflow Developers meet each morning to safely push updates to **PROD**.
- Avoid pushing tickets to PROD that are **not related to the cohort release**.
- Push **cohort-related tickets** to PROD.
- Avoid pushing non-cohort tickets. Those are deployed during release time as per our current process of deployment.
- **Important Merge Step**
- If the ticket involves an **active page branch**, run **Check for Updates** before merging in webflow.
- This prevents accidentally **overwriting cohort work**.
- **Webflow Developers -> **updates the ticket status to **Ready for PROD**. 
- **QA Process**
- QA monitors the backlog for **Cohort tickets marked “Ready for PROD.”**
- QA moves the ticket into the **current sprint**.
- QA validates the change directly in **PROD**.
- QA Outcomes
- **PASS: **QA adds a comment with a screenshot. Ticket is marked **DONE**.
- **FAIL: **Ticket is returned to the developer with status **SIT FAILED**.

**Why deploy/test in PROD?** None of these cohorts are live yet so no impact moving them to PROD.  The tickets for these cohorts are mostly small webflow page modifications (images, text, links, blog posts) and do not need to be checked multiple times.  Using this direct process should allow us to close out tickets faster.  This only applies to cohort tickets - other webflow tickets will follow the existing process for regular releases.

**Exceptions**

- Some **complex cohort tickets** cannot be tested in PROD until their **dependencies are completed on backend work**.
- In these cases, the developer should **leave the ticket in “In Progress.”**
-  **Example: **Local Offers pages require a **test gym configured with the local offer in the AF Dashboard**
- This requires the **client to complete setup first **on the AF dashboard and sync it to webflow.  We can't test without this step.
- Once the dependency is resolved, the webflow developer can **mark the ticket as Ready for PROD**.

**Tech Lead, QA Lead, and PM Alignment**

- QA Lead -> ** QA Alignment**
- To streamline communication, please consolidate QA questions and send them to the Dev team in batches instead of raising them one by one. 
- Once clarified, responses should also be shared in the QA channel for visibility and team awareness.
- QA & Tech Lead -> ** QA Approvals** 
- Out side of this cohort process, if there is no QA approval = no PROD deployment. 
- QA sign-off should remain a mandatory checkpoint before any production release - cohort tickets are the only exception
- QA Lead ->** QA Capacity & Expectations Alignment**
- If work exceeds QA capacity, or if tickets are endorsed to QA late in the cycle, this should be communicated promptly to the PM for proper expectations alignment on timelines and delivery risks.
- QA & Tech Lead ->** Planning & Requirement Clarity** 
- This requires proactive collaboration from everyone, not just QA. If requirements are vague or clarification is needed, concerns should be raised with the PM before implementation begins. 
- Devs are also encouraged to involve QA early in identifying test scenarios, even before tickets are marked as “Ready for QA.”
- QA & Tech Lead** QA/Dev Assignment Flexibility** 
- QA and Dev ticket assignments may shift due to PTO or resource constraints, provided proper handovers are done. 
- Differences in bug counts or issue detection between QAs may also stem from product familiarity or skillset differences, which should be addressed separately with the respective leads.
