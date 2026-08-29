# Technical Guide: Updating Submit Cancellation Link

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=6c336b0c-c86d-4264-957d-4d436c34fe6e
Updated: 2026-05-06T20:57:34.675Z

### **Overview**
The **Submit Cancellation Request** page in Webflow uses a custom script to integrate with Clubwise. Because each region (UK, AU, USA, etc.) uses a different Clubwise database, the `bureauLink` property must be manually verified and updated for every locale launch.

Clubwise is a 3rd party MMS vendor used by some countries including Australia, UK, Ireland, and South Africa.

The submit cancellation request page is only available for countries using clubwise.

### **Step 1: Extract the Correct Link (Legacy Audit)**
Before updating Webflow, you must confirm the correct URL from the existing WordPress site for that specific locale.

- Navigate to the **legacy WordPress cancellation page** (e.g., `anytimefitness.co.uk/cancellation-request/`).
- Open your browser's **Developer Tools** (Right-click > **Inspect**).
- Go to the **Sources** or **Network** tab and locate the following file:
- `https://bureau.clubwise.com/[LOCALE_ID]/widgets/v1/CancellationPortal/membership_cancel.js`
- Search within the file (`Ctrl+F`) for the string: `bureauLink`.
- **Copy the URL** value associated with it (e.g., `https://ma1.clubwise.net/bawidget/`).

### **Step 2: Update the Webflow Embed**
Once you have the locale-specific URL, apply it to the new Webflow static page.

- Open the **Webflow Designer** and navigate to the **Submit Cancellation** page.
- Locate the **Custom Code Embed** element with the class name: `src-form-html`.
- Click into the code editor.
- **Go to Line 13**, which defines the `bureauLink` property.
- Replace the existing URL with the one you extracted in Step 1.

### **Step 3: Verification**
- **Publish** the page to dev/sit domain.
- Load the page and verify that the first step of the cancellation form (Identification) loads correctly.
- Need to verify with client if the form works correctly upon updating the url.

### **Quick Reference Table**

| Locale | Expected Bureau Link |
| --- | --- |
| Australia (EN-AU) | https://ma1.clubwise.com.au/bawidget/ |
| United Kingdom (EN-GB) | https://bureau.clubwise.com/anytimeuk/ |
| Ireland (EN-IE) | https://bureau.clubwise.com/anytimeuk/ |
