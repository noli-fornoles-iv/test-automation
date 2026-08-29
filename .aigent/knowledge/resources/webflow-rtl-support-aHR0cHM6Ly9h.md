# Webflow RTL support

Tab: Resources
Source: https://app.getguru.com/folders/c57G5aoi/Webflow?activeCard=d6f62d94-7488-4532-9f13-62d2a1482c28
Updated: 2026-05-11T03:05:16.252Z

# Webflow RTL Implementation
 This guide details the architectural approach and developer steps required to implement and maintain Right-to-Left (RTL) language support (e.g., `ar-sa`) on the Webflow platform, ensuring high performance (LCP/CLS) and successful Crowdin integration.

## Foundational Architecture
 The implementation relies on the browser's native behavior triggered by Webflow's localization feature and is optimized to prevent resource loading on LTR locales.

 

### Automatic RTL Context Detection
 

- Mechanism: When a user visits a localized page designated as RTL, Webflow automatically adds the `dir="rtl"` attribute to the root `<html>` tag.
- Significance: This attribute serves as the global CSS hook (`html[dir="rtl"]`) required to activate all custom directional styling overrides.
 

### Conditional RTL Styles Component
 To ensure performance, the CSS definitions for RTL are isolated in a component that is only served to RTL locales.

- Placement: The complete block of custom RTL utility CSS is placed inside a Code Embed Component (named `RTL custom CSS`).
- Visibility Control (Crucial for Performance):
- In the Webflow Designer on the Primary Locale (e.g., `en-us`), the entire component has default hidden visibility so we don't render it in dom for other locales. Webflow excludes this component from the HTML output for all LTR locales, preventing the download of unnecessary RTL CSS, which directly boosts LCP and resource efficiency.
- 
- To enable it for rtl locales, need to update the component Props default value to Visible, so the component will be present for all rtl pages.
- 

## Strategy for Directional Overrides
 Directional CSS properties (`left`, `right`, `margin-left`) do not reverse automatically in RTL and must be manually swapped or overridden using utility classes.

 

### Custom CSS Utility Classes
 All necessary directional overrides are encapsulated in Combo Classes (`rtl-*`) defined in the custom code section. This prevents content synchronization issues.

Property  Example Use Case  Example CSS Selector  text-align  To explicitly align text that was set to left in LTR.  html[dir=rtl] .rtl-text-right { text-align: right; }  Flex/Layout  To reverse the order of items (e.g., navigation, image blocks).  html[dir=rtl] .rtl-flex-row-reverse { flex-direction: row-reverse; }  margin: auto  To center elements that rely on margin-left: auto / margin-right: auto.  html[dir=rtl] .rtl-margin-left-auto { margin-left: auto; margin-right: 0; } ** **

### Crowdin Sync Rationale
- Problem: Direct style changes to base classes in the Webflow Designer are prone to being reverted or overridden during subsequent Crowdin translation syncs.
- Solution: By applying styles only via Combo Classes (`rtl-*`), the structural fix is decoupled from the base component styling, ensuring persistence across all localization deployments.
 

## Full RTL Custom Code Snippet
 This block contains the essential utility classes to be placed in the Code Embed Component.CSS

 

```

/* --- Text and Direction --- */
html[dir=rtl] .rtl-text-right{
	text-align: right !important;
}

html[dir=rtl] .rtl-text-left{
	text-align: left !important;
}

html[dir=rtl] .rtl-direction { 
    direction: rtl !important;
}

/* --- Margins --- */
html[dir=rtl] .rtl-margin-left-auto {
	margin-left: auto;
	margin-right: 0 !important; 
}
html[dir=rtl] .rtl-margin-right-auto {
	margin-right: auto;
	margin-left: 0 !important;  
}

/* --- Positioning --- */
html[dir=rtl] .rtl-left-0 {
    left: auto !important;
    right: 0 !important;
}
html[dir=rtl] .rtl-right-0 {
    right: auto !important;
    left: 0 !important;
}

/* --- Layout Direction (Flexbox) --- */
html[dir=rtl] .rtl-flex-row-reverse {
    flex-direction: row-reverse !important;
}

/* --- Mobile Text Alignment --- */
@media screen and (max-width: 767px){
  html[dir=rtl] .rtl-text-right-mobile{
    text-align: right !important;
  }

  html[dir=rtl] .rtl-text-left-mobile{
    text-align: left !important;
  }
}

/* Flip the arrow icons 180 degrees in RTL */
html[dir=rtl] .slider-main_button {
    transform: scaleX(-1);
}

```

## Maintenance and Audit Procedure
 A systematic audit ensures every element is accounted for, when adding new rtl locale:

- Systematic Review: Revisit all static pages and Collection Templates, this is just to ensure all elements are displaying correctly, since we already applied the combo classes, we can perform below steps for specific pages that are only present for the newly added rtl locale.
- Identify Explicit Directional Styles: Look for elements that have non-default directional styles (`text-align: left`, `float: left`, `margin-right`).
- Apply Combo Class: Apply the necessary `rtl-*` utility class (e.g., applying `.rtl-text-right` to a text block that was explicitly aligned left).
- Test Live: Verify the final display on a live RTL locale domain (e.g., `ar-sa` staging site) to confirm alignment, spacing, and element order are correct.
 

## RTL Component Settings
Most of AF Webflow Components don't need any special settings for RTL. Only some need some settings, here:

 

### Localization Navbar Component
Recently we introduced Locales for Arab countries, so for example for ar-sa, we have created a variant for the Navbar. This means that  all Navbars for RTL Locales should have the variant RTL:

Once set up we will have the logo, the CTA and buttons in the correct position, starting from the right:

 

### RTL custom CSS
This is a Component adding some CSS arrangements and Queries to all RTL pages.Right now we have ar-sa Locale

No need to have the Component in Draft pages or Dynamic pages without CMS items
