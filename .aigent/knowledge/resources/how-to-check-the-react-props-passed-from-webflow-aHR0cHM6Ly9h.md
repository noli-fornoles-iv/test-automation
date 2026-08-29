# How to Check the React Props Passed from Webflow

Tab: Resources
Source: https://app.getguru.com/folders/cn7dnb8i/QA?activeCard=ad391b9f-f41d-4ad7-9a6b-9ed206c66603
Updated: 2026-07-16T10:51:30.714Z

You can use the following JavaScript snippet to inspect all the props that **Webflow passes to the React application** on any page containing a React form.

This is particularly useful when validating:

- Event pages
- Local offers
- Group offers
- Lead source codes
- API offer titles
- Any other data being passed from Webflow to React
The same script works across all React flows, so there's no need to maintain different scripts for different pages.

## Steps
- Open the page you want to validate.
- Open the browser's **Developer Tools** (`F12` or `Ctrl + Shift + I`).
- Navigate to the **Console** tab.
- Copy and paste the following script into the Console and press **Enter**.

```
(()=>{try{u=new URL([...document.querySelectorAll`iframe`].find(f=>f.src.includes`react`).src),console.log('React props:', location.href.includes`events`?JSON.parse(u.searchParams.get`eventProps`):Object.fromEntries(u.searchParams))}catch(e){console.log("parameters not found:",e.message)}})()
```

## OR

```
(f=>f?f.src.includes("events-2.0")?JSON.parse(decodeURIComponent(new URL(f.src).searchParams.get("eventProps"))):Object.fromEntries(new URL(f.src).searchParams.entries()):null)([...document.querySelectorAll("iframe")].find(f=>/events-2\.0|offer/.test(f.src)))
```

## 
Output
The Console will display all the props that Webflow is passing to the React iframe, making it easy to verify that the expected values are being sent.

## Example
When testing **Event Promotions** for newly created cohorts:

The **Location Search** may not work for newly created cohorts. Instead of relying on it, you can verify that the correct data is being passed to React.

Run the script above and confirm that the following props are present:

- API Offer Title
- Lead Source Codes
- Any other expected event properties
This allows you to validate that Webflow is correctly passing the required data to the React application, even before the full functionality is available.
