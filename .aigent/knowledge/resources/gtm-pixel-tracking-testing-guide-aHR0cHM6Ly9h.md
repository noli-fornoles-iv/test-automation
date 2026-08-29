# GTM + Pixel Tracking Testing Guide

Tab: Resources
Source: https://app.getguru.com/folders/iGjErE5T/Tools-and-Softwares?activeCard=35da4339-e336-461f-8b15-e849d13bc72f
Updated: 2026-02-26T15:43:47.093Z

## 🎯 Purpose
This guide is for **QA testers new to GTM and pixel tracking**. It walks you through exactly how to test GTM events and verify pixel tracking using Tag Assistant — with real examples from Anytime Fitness.

Pixels are tiny invisible images or scripts that **fire when certain events happen** (like form submissions). They send info to platforms like Facebook Ads, TikTok, or Google Analytics.

GTM controls **when these pixels fire** by listening to **dataLayer events** and triggers configured inside GTM.

## 🧱 GTM Concepts
Think of **Google Tag Manager (GTM)** as your website’s **"control center for tracking."** It lets you track what users do — like clicking buttons or submitting forms — without constantly changing the site’s code.

Here are the 4 core building blocks:

### 🏷 1. **Tags = Messengers**
Tags are code snippets that **send data** to external platforms like:

- Google Analytics
- Facebook Pixel
- TikTok Ads, etc.
🧠 Think of them as:

*“Hey Google, someone just submitted a form!”*

### 🎯 2. **Triggers = When to Fire**
Triggers detect **when** a tag should fire, like watching for a form to be submitted, a button clicked, or an API call completed.

🧠 Think of them as:

*“Only fire the tag if a form is submitted.”*

### 📦 3. **Variables = Data Carriers**
Variables are extracted from the data layer and used by tags to send precise data. Example:

- `club_id`
- `form_name`
- `lead_type`
🧠 Think of them as:

*“Which form? For what club?”*

### 📥 4. **Data Layer = The Inbox**
The **data layer** is a JavaScript object where the site stores all important info. GTM reads this data when deciding what tags to fire.

🧠 Think of it as:

*“The mailbox where the site drops messages like: ‘form_success just happened!’”*

You can type `window.dataLayer` in the browser console to inspect what's been logged.

Example:

```
js
{
  event: 'form_success',
  form_name: 'online_join',
  prospect_id: 'abc123',
  club_id: '12345',
  lead_status: 'new_lead'
}
```

### 🔗 How it All Connects (Example)
- User submits a Free Trial form
- `form_success` is pushed to the data layer
- GTM sees the trigger and fires the correct tag
- Variables (e.g., `club_id`, `form_name`) are included
- Data is sent to GA4, Meta, or TikTok

## 🛠️ Tools Required for QA Testing

### 1. Tag Assistant (Google Official Tool)

### Setup:
- Install [Tag Assistant Companion Extension](https://chrome.google.com/webstore/detail/tag-assistant-companion/jmekfmbnaedfebfnmakmokmlfpblbfdm)

- Go to: [﻿GoogleGoogle Tag Assistant](https://tagassistant.google.com/)

- Click **“Add domain.”**

- Add the website (SIT, UAT, or PROD)

- Click **Connect - **Site Opens in New Tab

- **Return to Tag Assistant Panel**
- You’ll now see the **Events Timeline**
- Each event shows:
- Name (e.g., `form_success`)
- Tags fired
- Parameters passed

## 🎯 What Are GTM Events?
In GTM, an **event** is a named action that tells GTM, *“Hey, something just happened!”*

Some examples:

- `form_loaded`: A form has appeared on screen.
- `form_success`: A user submitted the form successfully.
- `tour_appointment_scheduled`: A user booked a tour.
Each event:

- Appears in the **data layer**
- Can trigger a tag if the trigger rules match
- Carries variables like `club_id`, `form_name`, or `prospect_id`

## 🧪 How Events Work at Anytime Fitness
**Events are triggered by user actions.** Each time a form loads or a user clicks a button, a specific event is pushed to the dataLayer. GTM listens for these and fires the appropriate tag.

We test:

- Whether the **event fired**
- If the **correct parameters** were passed
- If **tag(s) fired properly**
Each event also has rules:

✅ When *should it* fire

❌ When it *should not* fire

## 🎯 Event-by-Event Breakdown
For Detailed Information about all the **DL Events and Parameters**. Please refer to this link:

[https://otbeat.atlassian.net/wiki/spaces/AFW/pages/4859396353/AF+-+Data+Layer+Events+Variables](https://otbeat.atlassian.net/wiki/spaces/AFW/pages/4859396353/AF+-+Data+Layer+Events+Variables)

**AF Pixel Catalog:** ﻿[Google SheetAF Pixel Catalog.xlsx](https://docs.google.com/spreadsheets/d/1QCd12WefRhXpzNhI6cjJ-Q3CTQKHUo8f/edit?gid=977035100#gid=977035100)

### `form_loaded`
✅ **Should fire when:**

- A **lead-generating form** (like Free Trial, Book a Tour, or Membership Inquiry) loads inside an iframe on the page.
❌ **Should NOT fire when:**

- It’s a **MapBox “Find a Gym”** widget.
- It’s a **search bar redirect** (e.g., site-wide gym finder).
- It’s a **Book a Tour add-on** page triggered by form redirect (double-firing risk).
🔑 **Expected Parameters:**

| Parameter | Description |
| --- | --- |
| event | "form_loaded" |
| form_name | Specific name of the form (matches doc) |
| form_category | "lead", "schedule appointment", etc. |
| club_id | Location identifier |
| club_name | Friendly name (e.g., “Downtown Gym”) |
| channelmix_client_id | From _ga cookie |
| channelmix_conversion_id | Randomly generated session ID |
| channelmix_timestamp | ISO timestamp when form loaded |
🛠️ **How to test:**

- Go to the lead-gen form (e.g., Try Us Free).

- Open **Tag Assistant**.
- Wait for the iframe to render.
- Look for `form_loaded` In the event stream.

- Expand the Variables tab and verify:
- `form_name` is correct
- `club_id` is populated
- No values are "undefined."

### `form_success`
✅ **Should fire when:**

- A **new prospect** submits a lead form and is successfully created via the API.
❌ **Should NOT fire when:**

- The user has already submitted the form (`prospect_id` already exists).
- It's an **addon flow** like Book a Tour after Free Trial.
🔑 **Expected Parameters:**

| Parameter | Description |
| --- | --- |
| event | "form_success" |
| form_name | Name of the form (exact match required) |
| form_category | e.g. "lead" or "schedule appointment" |
| club_id | Location identifier |
| club_name | Friendly club name |
| lead_type | "Global" or "Local" |
| lead_source_code | e.g. "FB_AD_01" or "SEO" |
| leads | Always "1" |
| duration | e.g. "7" for a 7-day pass |
| channelmix_conversion_id | Session ID for analytics tracking |
| channelmix_client_id | From the _ga cookie |
| channelmix_timestamp | Time of form submission |
🛠️ **How to test:**

- Submit a lead form with valid data.

- Wait for the API response (form success).
- Go to Tag Assistant and find `form_success`.

- Confirm the tag fired and all variables are populated.

### `tour_appointment_scheduled`
✅ **Should fire when:**

- A **Book a Tour** form is **successfully submitted,** and an appointment is booked via API.
❌ **Should NOT fire when:**

- The API call fails (e.g., network error).
🔑 **Expected Parameters:**

| Parameter | Description |
| --- | --- |
| event | "tour_appointment_scheduled" |
🛠️ **How to test:**

- Open Book a Tour flow (Any variant)

- Submit a valid appointment.
- Wait for the confirmation.
- Check Tag Assistant for `tour_appointment_scheduled`.

### `page_link_click`
✅ **Should fire when:**

- Any **clickable link** is clicked: nav bar, footer, external link, tel/email CTA.
❌ **Should NOT fire when:**

- Non-link elements (unless misconfigured)
- Duplicate if clicked twice too fast (check throttling)
🔑 **Expected Parameters:**

| Parameter | Description |
| --- | --- |
| link_location | nav/footer/body — where the click occurred |
| link_destination_type | “internal” or “external” |
| link_action_type | “email”, “phone”, “anchor”, etc. |
| is_cta_click | Yes/No based on button style |
| click_in_iframe | Yes/No — was link inside iframe? |
| element_url | Full URL of the clicked link |
| element_hostname | Domain of the link (e.g. anytimefitness.com) |
| element_path | Path of URL (e.g. /contact) |
| element_text | Text of the clicked link |
| element_id | HTML ID of element (if present) |
| element_classes | Class names applied to element |
| element_href | Raw href value |
| social_platform_name | Returns the name of the socialmedia platform |
| social_click_type | Distinguishes if a click was social share click vs an anytimefitness profile link click |
🛠️ **How to test:**

- Click a nav link, social link, or CTA.

- Open Tag Assistant → look for `Link Click`.

- Expand variables and confirm:
- `element_url` matches destination
- `link_location` = nav/footer
- `link_action_type` is accurate (e.g., phone, file, etc.)

### 🔖 3rd Party Marketing Tags
The GTM container currently includes **50+ marketing tags** added by external agencies (e.g., Google Ads, Meta/Facebook, TikTok, LinkedIn). These tags are used for **remarketing, conversion tracking, and campaign performance monitoring**.

**What QA Should Know:**

- These tags are expected to fire across various pages and user journeys.
- You may encounter them in **Google Tag Assistant**, **Preview Mode**, or browser dev tools (e.g., [doubleclick.net](http://doubleclick.net/), [facebook.com/tr/](http://facebook.com/tr/), [snapchat.com](http://snapchat.com/)).
- **While dedicated test cases may not cover them yet**, QA should:
- Be aware of their presence
- Flag **unexpected behavior**, such as:
- Tags firing multiple times
- Tags firing on the wrong pages
- Tags blocking or delaying critical scripts

### 🌍 International Locales
We are starting to roll out GTM support for **international locales** (e.g., `/en-au/` for Australia).

**What QA Should Watch For:**

- On locale-specific pages, ensure that **country-specific tags fire** (e.g., AU-specific tags on `/en-au/`).
- Tags should send data to the **correct containers/accounts** for that region.
- The full multi-country tagging strategy is **still in development**, so expectations may evolve.
Example:

✅ Australia tags fire on `/en-au/`

❌ US-specific tags should not fire on AU pages

## 📝 Summary
Imagine GTM as the backstage crew for Anytime Fitness’s website — quietly watching every move users make, from loading a form to clicking a button or booking a tour. It captures all these moments as events, packed with juicy details like which club they picked or what form they filled.

But GTM is smart — it only calls the spotlight when the moment really counts, avoiding awkward double takes or false alarms. QA testers use tools like Tag Assistant to peek behind the curtain, making sure every event is on cue and every tag fires perfectly.

This precise tracking helps Anytime Fitness understand user actions and improve their digital experience.
