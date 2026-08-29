# QA process

Tab: Resources
Source: https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=8bf91525-f868-42ef-9998-5e02e90cd576
Updated: 2026-06-29T23:59:38.780Z

# **QA Process SOP**
QA Process Flow chart

## **1. Purpose**
This document outlines the step-by-step Quality Assurance (QA) process for validating tickets from development through testing on SIT, UAT, and production deployment. It ensures all tickets are properly tested, bugs are tracked, and issues are resolved before marking work as Done.

## **2. Scope**
This process applies to:

- All development tickets requiring QA validation.
- QA engineers, developers, and stakeholders involved in SIT, UAT, and Production validation.

## **3. Roles & Responsibilities**
- **Developer:** Implements code changes, fixes reported bugs, and updates ticket statuses. 
- Must leave a Jira comment specifying which environment (SIT, UAT, or PROD) the ticket has been deployed to.  Snapshot of the work provided.
- **QA Engineer:** Creates test plans, executes tests, reports bugs, verifies fixes, and ensures readiness for SIT/UAT/Prod.
- **QA Lead:** Makes final call on time allocation or regression depth when hotfixes or last-minute changes arise.
- **Project Manager & Tech Lead:** Enforces developer adherence to process - especially when ensuring all environments are clearly noted by developers in Jira comments and verifies QA sign-off before any ticket is closed or moved to “Done.”

## **4. Process Steps**

### **Step 1: Development Phase**
- Developer marks the ticket as **“In Progress.”**
- QA creates a **Test Plan** in the test pad for the ticket.
- Once development is complete, the main ticket is marked as **“Ready for QA.”**
- Important -> Developers must indicate the deployment environment in the Jira comment section before assigning the ticket to QA.

### **Step 2: QA Initial Testing (SIT)**
- QA picks up the ticket.
- Marks it as **“QA In Progress.”**
- Changes the assignee to their name.
- Starts a **Test Run** in the test pad for relevant devices.
- **Bug Check:**
- If **bugs are found:**
- Log bugs in Jira as subtasks of Main ticket with status **“To Do”**.
- Assign them to the developer.
- Update the main ticket status to **“SIT Failed.”**
- If **no bugs are found:**
- Change status to **“Ready for UAT.”**
- Assign the Main ticket back to the developer.
**Exception: **For simple Webflow-only changes, testing in SIT is sufficient enought to push to PROD.

- If the Webflow item passes SIT and no React dependencies exist, QA can mark “Ready for PROD.”
- QA should proactively monitor “Ready for UAT” tickets older than 2 days to ensure no untested items move to PROD via unrelated Webflow pushes.

### **Step 3: Developer Fixes**
- Developer resolves the reported bugs.
- Marks bug tickets and the main ticket as **“Ready for QA.”**
- QA retests:
- If bugs persist → cycle repeats until fixed.
- If bugs are resolved → move forward.

**🔍 Triage Process for “Odd Behavior” Bug Tickets**

When QA encounters unexpected or inconsistent behavior in the flows, follow this workflow:

- **Verify Before Escalating**
- Before tagging Devs, double-check whether the API response already explains the behavior (e.g., `can_book_appointment = false`).
- Use post message extension or tweak extension to check this.
- If the API shows the expected logic, it may not be a bug.
- **Post a Triage Message in Slack (new thread)**
- Tag developer and include:
- **Page URL**
- **Network payload and/or API response (screenshots)**
- **Relevant console logs**
- If its during PROD testing, add new thread to [anytime-fitness-internal-releases](https://teamignitevisibility.slack.com/archives/G09K02KH25V). Otherwise, just add it to [anytime-fitness-internal](https://teamignitevisibility.slack.com/archives/C09L9PYV3TJ) slack channel
- **Wait for Dev Confirmation**
- Developers will check that specific page and confirm whether the issue is a bug or expected behavior.
- **Create the Bug Ticket**
- If confirmed as a bug, QA creates the Jira ticket and shares it in the **original Slack thread**, tagging the appropriate developers.

**📣 Bug Ticket Communications**

- **If Developers Need Clarification**
- If devs misunderstand the issue and are not actioning the ticket ***or*** the fix is SIT failed for the second time:
- → Move the conversation to the **QA Slack channel** in a new thread specific to that bug. To keep our tickets professional in front of the client.
- → Tag the **React gang** or **Webflow bros** as needed. Loop in the Tech lead and PM.

### **Step 4: UAT Testing**
- Once ticket is deployed on UAT, it is marked as **“UAT”** by developer. QA verifies the bug fixes again in the **UAT environment** and performs smoke testing.
- QA marks the ticket as **“QA In Progress.”**
- Changes the assignee to their name.
- **Bug Check:**
- If **bugs are found:**
- Report bugs in Jira as subtasks of Main Ticket with status **“To Do”**.
- Assign to the developer.
- Update ticket status to **“UAT Failed.”**
- If **no bugs are found:**
- Change ticket status to **“Ready for Prod.”**
- Assign to the developer.
**Code Freeze: **Enforce a **code freeze policy** 24 hours before release. Tickets submitted for RFQA on UAT day require QA Lead approval.

Any new UAT or scope changes within 48 hours of release must trigger PM–QA Lead escalation to adjust testing time or scope.

### **Step 5: Production Deployment**
- After deployment, QA performs **regression testing** in Production.
- QA marks the ticket as **“QA In Progress.”**
- Changes the assignee to their name.
- **Bug Check:**
- If **bugs are found:**
- Report them in Jira as new bugs/hotfixes.
- Re-test after deployment.
- If **no bugs are found:**
- Mark all bug tickets as **“Done.”**
- Mark the Main ticket and QA ticket as **“Done.”**
**Scope of regression testing in PROD: **QA's can do brief “smoke testing only” if automation already covered UAT regression successfully. If QA Automation is unavailable, conduct regression in UAT and then focus on high-impact flows (lead forms, location pages, critical APIs).  We should not be doing thorough regression testing in PROD unless we cannot reliably do it in UAT.

## **5. End of Process**
The QA process concludes when the main ticket and all related bug tickets are successfully marked as **“Done.” **

With the exception of PM during hotfix, tickets must not be marked as **Done** by non-QA team members. Closure confirmation must come from QA after validation.

**
****Note:****
Follow this clickup template, if bug is failed or passed:
**[https://app.clickup.com/t/86b4gq1t0](https://app.clickup.com/t/86b4gq1t0)

## **Tech Lead, QA Lead, and PM Coordination**
- QA Lead -> ** QA Alignment**
- To streamline communication, please consolidate QA questions and send them to the Dev team in batches instead of raising them one by one. 
- Once clarified, responses should also be shared in the QA channel for visibility and team awareness.
- QA & Tech Lead -> ** QA Approvals** 
- If there is no QA approval = no PROD deployment. 
- QA sign-off should remain a mandatory checkpoint before any production release - only exception is for locales that have not been made live via cohort development process (see: [cohort release process](https://app.getguru.com/card/c4danRAi/Cohort-Release-Process-for-Webflow-TicketsProcess))
- QA Lead ->** QA Capacity & Expectations Alignment**
- If work exceeds QA capacity, or if tickets are endorsed to QA late in the cycle, this should be communicated promptly to the PM for proper expectations alignment on timelines and delivery risks.
- QA & Tech Lead ->** Planning & Requirement Clarity** 
- This requires proactive collaboration from everyone, not just QA. If requirements are vague or clarification is needed, concerns should be raised with the PM before implementation begins. 
- Devs are also encouraged to involve QA early in identifying test scenarios, even before tickets are marked as “Ready for QA.”
- QA & Tech Lead** QA/Dev Assignment Flexibility** 
- QA and Dev ticket assignments may shift due to PTO or resource constraints, provided proper handovers are done. 
- Differences in bug counts or issue detection between QAs may also stem from product familiarity or skillset differences, which should be addressed separately with the respective leads.
