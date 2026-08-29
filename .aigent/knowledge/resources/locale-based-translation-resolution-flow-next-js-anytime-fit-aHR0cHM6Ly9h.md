# Locale Based Translation Resolution Flow [Next JS] – Anytime Fitness

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=a1275d82-c3a8-4534-941b-865a1c54a311
Updated: 2026-05-05T07:42:13.592Z

## Overview
This document explains how translations are resolved and delivered in the **Anytime Fitness Next JS application** using **Crowdin OTA** and the **i18n framework**.It describes the translation flow from **user request** to **rendered UI**, ensuring translations are always accurate and fallback-safe.

 PS: Similar flow is in use for Storybook with a separate i18n instance.

## High Level Flow
- Server resolves translations.
- Client initializes the translation system (i18n).

## End-to-End Translation Flow
- **User requests an iframe with  a specific locale**
- Example: `/en-us`, `/ar-sa`, etc.
- **Server resolves the locale**
- `RootLayout` extracts and normalizes the locale from the URL parameters.
- **Server requests translations from Crowdin OTA**
- The OTA client fetches the latest translations dynamically.
- **Server loads fallback translations**
- Ensures default strings are available if Crowdin fails or is missing keys.
- **Server merges Crowdin and fallback translations**
- CrowdIn translations **override** fallback translations where available.
- **Server sends the final translation configuration to the client**
- Configuration includes active locale, resources, and merged translations.
- **Client receives translations**
- `ClientLayout` initialises the i18n engine (`i18next`) with server-provided translations and client configuration.
- **Client makes translations available to all components**
- `I18nextProvider` provide translations across the component tree.
- `LocaleProvider`  provides the determined locale.
- **Components render translated content**
- Components wrapped in `I18nextProvider` render the relevant translation using the i18n translations hook.

## Key Principles
- **Crowdin OTA** provides the most up-to-date translations dynamically.
- **Fallback translations** guarantee UI stability if Crowdin fails or is missing keys.
- **Server-side resolution** ensures pre-rendered translations and avoids any language flickers.
- **Client-side initialization** makes translations reactive in React components immediately.

## Reference Files
- Root Layout: `app/[locale]/layout.tsx`
- Client Layout: `app/[locale]/client-layout.tsx`
- i18n Helpers: `utils/i18n.ts`
