# Locale-Based Font Onboarding Guide [Next JS] - Anytime Fitness

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=d92c10bc-2eb8-441a-bfee-28789fc38a57
Updated: 2026-08-24T16:39:27.893Z

## Overview
This guide provides step-by-step instructions for onboarding a **new locale with custom fonts** in the Anytime Fitness Next.js web application.**Scope:**

- Font loading
- Font configuration
- Tailwind font consumption
The goal is to ensure **typography parity** with existing locales (e.g. `en-us`) while allowing flexibility for font providers with limited weight support.

## Core Principles
- Fonts are injected **dynamically per locale.**
- **Content** is **hidden** (max 2 seconds) till fonts are loaded to avoid flickers.
- Components **never** reference font CSS variables directly.
- Fonts are consumed **only through Tailwind utility classes.**
- **All font CSS variables must exist for every locale.**
- Font weights may vary by provider.
- **Font synthesis is mandatory** to handle missing weights safely.

## Global CSS Requirements
**File:** `global.css`

### Font Synthesis (Default)

```
* {
  font-synthesis: weight !important;
}
```
Font synthesis is required because some font providers do not supply all weights referenced by Tailwind utilities.

### Base Font Variables (Default)

```
:root {
  --font-black: Arial, sans-serif;
  --font-demi: Arial, sans-serif;
  --font-extrabold: Arial, sans-serif;
  --font-regular: Arial, sans-serif;
  --font-thin: Arial, sans-serif;
}

.theme-af {
  --font-titlelight: Arial, sans-serif;
  --font-titleregular: Arial, sans-serif;
  --font-titlemedium: Arial, sans-serif;
  --font-titlebold: Arial, sans-serif;
  --font-textbold: Arial, sans-serif;
  --font-textregular: Arial, sans-serif;
}
```
These variables act as safe defaults and are overridden by locale-injected styles.

### Body Configuration (Default)

```
body {
  visibility: hidden;
}

body.fonts-loaded {
  visibility: visible;
}
```
Initially body will be invisible till fonts are loaded, to avoid any flickers.

## Prerequisites
- Locale is defined in `locale-config` (with proper ISO code, e.g., `en-us`).
- Font files for the locale are locally available in the `public/fonts` folder.
- Available font weights are known (e.g. Regular, Bold, etc).
- CSS variable naming follows existing conventions.

## Step 1: Define Locale Font Configuration
Create a new `FontDefinitions` entry for the locale, only if needed. Each font definition will be in a separate file inside the `fonts` folder. 

In this case it will be `locale-config/fonts/index.ts` .

```
const moonFontDefinitions: FontDefinitions = {
  black: {
    family: "FMoon-Black",
    url: "/fonts/moon/f37moon-black-webfont.woff2",
    weight: 900,
    fallback: "Arial, sans-serif",
  },
  demi: {
    family: "FMoon-Demi",
    url: "/fonts/moon/f37moon-demi-webfont.woff2",
    weight: 600,
    fallback: "Arial, sans-serif",
  },
  regular: {
    family: "FMoon-Regular",
    url: "/fonts/moon/f37moon-regular-webfont.woff2",
    weight: 400,
    fallback: "Arial, sans-serif",
  },
  extrabold: {
    family: "FMoon-Extrabold",
    url: "/fonts/moon/f37moon-extrabold-webfont.woff2",
    weight: 800,
    fallback: "Arial, sans-serif",
  },
  thin: {
    family: "FMoon-Thin",
    url: "/fonts/moon/f37moon-thin-webfont.woff2",
    weight: 100,
    fallback: "Arial, sans-serif",
  },
};
```
All font families should be present, since this structure is used to generate Font Faces and CSS Variables.

## Step 2: Register Locale Font Config
**File:** `locale-config/fonts/index.ts`

By default **FMoon** fonts will be picked unless explicitly overridden.

```
export const LOCALE_FONT_OVERRIDES: Record = {
  ...Object.fromEntries(
    ARABIC_LOCALES.map(locale => [locale, ARABIC_FONT_DEFINITIONS]),
  ),
  "vi-vn": VIETNAMESE_FONT_DEFINITIONS,
  "th-th": THAI_FONT_DEFINITIONS,

  // Override Example => "ar-sa": ARABIC_FONT_DEFINITIONS
  // The base font family is FMoon, please only add overrides here.
};
```
 

```
export const getFontConfig = (locale: string): FontConfig => {
  const normalizedLocale = locale.toLowerCase();

  const fontDefs =
    LOCALE_FONT_OVERRIDES[normalizedLocale] ?? MOON_FONT_DEFINITIONS;

  const fontFaces = generateFontFaces(fontDefs);
  const cssVariables = generateCssVariables(fontDefs);
  const fontPreloads = getFontPreloads(fontDefs);

  return {
    fontFaces,
    cssVariables,
    fontPreloads,
  };
};
```

## Step 3: Load Fonts Dynamically

### Server-Side
**File:** `app/[locale]/layout.tsx`

```
const { fontFaces, cssVariables, fontPreloads } = getFontConfig(locale);

const stylesheet = `
  ${fontFaces}
  ${cssVariables}
`;

const renderFontPreloads = () => {
  return fontPreloads.map((url: string) => (
    - 
  ));
};

  {renderFontPreloads()}
  {stylesheet}

```

### Notes
- This whole process starts at the server layer but actual font load happens on browser.
- Fonts are dynamically preloaded using `<link>`  in the document `<head>` .
- Fonts Faces and CSS Variables are dynamically injected into `<style>`  in the document `<head>` .

### Client-Side
**File:** `app/[locale]/client-layout.tsx`

```
import { handleFontsLoaded } from "../../locale-config/locale-fonts";

useEffect(() => {
  const { teardown } = handleFontsLoaded();
  return teardown;
}, []);
```
 **File:** `locale-config/fonts/index.ts`

```
export const handleFontsLoaded = () => {
  const showPage = () => {
    if (!document.body.classList.contains("fonts-loaded")) {
      document.body.classList.add("fonts-loaded");
    }
  };

  document.fonts.ready.then(showPage);

  const timeoutId = setTimeout(showPage, 2000);

  return {
    teardown: () => {
      clearTimeout(timeoutId);
    },
  };
};
```

### Notes
- Client Layout uses the method `handleFontsLoaded` to handle visibility of the body.
- The method will wait a maximum of 2 seconds to show the body, this check is there as a fallback in cases fonts take to much time to load or fail to load, user should not be stuck on a blank page.

## Tailwind Font Consumption
Components must **only** use Tailwind font utilities, variables should not be used directly, although font families can be used directly.

❌ **Incorrect Usage**

```
font-family: var(--font-regular);
```
✅ **Correct Usage**

```

```

## Font Loading Flow

```
Server (SSR)
↓
Fonts are preloaded via - 
↓
@font-face and CSS variables are injected into 
↓
Browser begins fetching font files
↓
Browser signals fonts are ready (document.fonts.ready)
↓
fonts-loaded class is added to 
↓
Page becomes visible to the user
```

## Testing Checklist

### Font Loading
- Fonts load for the active locale only and are preloaded.
- Content is hidden hidden initially.
- There is No flicker.

### Tailwind Integration
- All `font-*` utilities work.
- No component references CSS variables directly.

### Fallbacks
- Fonts gracefully fall back to `Arial, sans-serif.`
- App waits maximum 2 seconds till fonts are loaded.
- App does not crash if a locale font is missing.

### Weight Handling
- Missing weights synthesize correctly.
- No visual regressions across font utilities.

## Common Gotchas
- Missing font variables for a locale.
- Using a fixed/hardcoded `font-family` directly in components (not taking other locales under consideration).
- Mismatched font-weight values in `@font-face` may cause issue if synthesis is not working properly.
- Slow font loading delaying UI.

## Reference Files
- Fonts config: `locale-config/fonts/index.ts`
- Root Layout:  `app/[locale]/layout.tsx`
- Client Layout:  `app/[locale]/client-layout.tsx`
- Talwind config: `tailwind.config.ts`
- Global css: `global.css`
