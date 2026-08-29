# [Webflow/React] PROD Release Rollback Steps

Tab: Resources
Source: https://app.getguru.com/folders/izaB7xAT/Processes?activeCard=3ac9de52-a945-4a02-ae9c-9090d2a941bd
Updated: 2026-05-18T09:13:30.242Z

## React Side

### Major / Breaking Issues
If the release introduces a major breaking issue:

- Revert the PR associated with the release
- It'll trigger the deployment pipelines
- Estimated rollback time: ~12-14 minutes to restore the previous stable state

### Minor Issues
If the issue is isolated and low risk:

- Apply a targeted hotfix instead of reverting the entire release (start from UAT)
- Validate impacted flows before deploying to PROD
- After validating, propagate fix to lower environments

## Webflow Side

### Major / Breaking Issues
If the issue originates from Webflow changes:

- Check first the webflow status page before doing anything, since a fix might already be in progress.
- Navigate to `Site Settings > Backups` and restore the last known stable version.
- Verify that Collection IDs and CMS references remain unchanged after restore
- Don't perform Crowdin sync
- Notify client to avoid API sync to prevent data mismatches during the rollback window.
- Validate critical flows/pages after publishing

### Minor Issues
For smaller UI/content/configuration issues:

- Apply the fix directly in Webflow designer
- Publish to lower environments dev, sit and uat.
- Publish to prod only after validating impacted pages/components on lower environments.
- Re-test integrations dependent on CMS or page structure

## Post-Rollback Validation
After any rollback:

- Validate critical user flows (e.g. Home, LLP, Find Gym, Events, Try Us Free, Book A Tour, Email Club, etc)
- Verify forms, CMS-driven pages, and iframe integrations (e.g. LLP, Contact, Locations, etc)
- Confirm fixes in PROD before closing the incident

## Ownership
- Tech lead: Responsible for rollback execution
- QA lead: Responsible for validation after rollback
