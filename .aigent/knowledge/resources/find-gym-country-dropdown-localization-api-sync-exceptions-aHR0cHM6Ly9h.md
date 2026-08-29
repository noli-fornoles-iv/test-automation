# Find Gym Country Dropdown Localization & API Sync Exceptions

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=f4f417e1-42a0-408d-b839-34aef1b01e48
Updated: 2026-06-05T07:36:23.379Z

## 1. Overview
To provide a fully localized experience, our country selection dropdowns must display country names in the user's local language. Because the **Countries collection** is excluded from Crowdin, these localized values are managed directly within Webflow using an export/import workflow.

To prevent data loss, the backend API Client Sync is configured to completely **ignore** the localized text field, leaving Webflow as the single source of truth for translation data.

## 2. CMS Architecture Changes
A new field has been added to the **Countries** collection to hold the localized strings.

- **Field Name:** `Translated Name`
- **Field Type:** Plain Text
- **API Sync Rule:** **EXCLUDED**. The API sync must completely ignore this field during all sync cycles to avoid overwriting manual translations with blanks or English defaults.

## 3. Technical Safeguards (API Sync Rule)
To protect localized content from automated deletion during backend dashboard updates, the development team has enforced the following patch logic:

- **Ignore Field Property:** The API Client Sync is strictly prohibited from touching the `Translated Name` field identifier.
- **Safe Patching:** The sync pipeline only updates functional fields (such as `Slug`, `ID`, or global system parameters) and leaves existing UI translation parameters completely untouched.

## 4. Step-by-Step Playbook: Applying Translations to New Locales
- Follow this exact operational checklist whenever a new target language or country locale is added to the system.

### Phase 1: Data Extraction & Translation Preparation
- **Switch to English (Primary Source):** In the Webflow CMS panel, make sure your view is set to the primary English locale.
- **Export the Master List:** Go to the **Countries** collection and click the **Export** button to download the master `.csv` file. This ensures you have the exact system `Slugs` and `IDs` for every country.
- **Isolate the Translation Column:** Open the exported CSV file in Excel, Google Sheets, or a CSV editor. Keep only the following columns to avoid confusion: `Item ID`, `Slug`, `Name`, and `Translated Name`.
- **Localize the Content:** Translate the country names into the new target language *only* inside the `Translated Name` column.
- *Example for Germany (DE locale):* If `Name` is "Spain", write "Spanien" in `Translated Name`.
- **Save a Locale-Specific File:** Save this file with a clear naming convention (e.g., `countries_translation_DE.csv`).

### Phase 2: Webflow CMS Import Pipeline
**Switch Locales in Webflow:** Inside the Webflow Designer dashboard, use the localization dropdown at the top left to switch your viewport from English to your new target locale (e.g., German, French, etc.).

- **Open the Collection View:** Navigate to the CMS panel and click on the **Countries** collection.
- **Initiate Import:** Click **Import**, choose your locale-specific CSV file, and select **Update existing items** (Do *not* choose "Create new items", as the countries already exist via the API sync).
- **Map the Identifier:** Map the CSV's `Item ID` or `Slug` to Webflow’s tracking identifier to ensure data maps to the correct rows.
- **Map the Translation Field:** Toggle all functional fields to **"Skip"** *except* for the translation data. Map your localized column directly to the `Translated Name` field.
- **Finalize:** Click **Import** and wait for the notification that the CMS items have been successfully updated.

### Phase 3: Layout Verification & Quality Assurance
- **Inspect the UI Element:** Navigate to your page branch and look at the country selection dropdown while viewing the new target locale.
- **Verify Conditional Swapping:** * Check countries with explicit translations to ensure the new language string renders perfectly.
- Check countries where `Translated Name` was left blank (if any) to confirm the UI cleanly defaults back to displaying the standard English `Name`.
- **DevTools Network Audit:** Open your browser's Inspector panel, run an environment update simulation, and verify that the backend API sync engine is successfully skipping the modified `Translated Name` fields without wiping them out.
