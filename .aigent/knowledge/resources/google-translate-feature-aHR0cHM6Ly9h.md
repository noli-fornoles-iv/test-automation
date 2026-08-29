# Google Translate Feature

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=6c8eb4aa-0a47-41e7-a092-7d9735974a15
Updated: 2026-05-04T08:50:43.475Z

## **PURPOSE**
When the Webflow parent page uses Google Translate (browser widget) and the HTML root gets the class `translated-ltr`, the embedded Next.js iframe should:

- Switch UI strings to the “desired locale” bundle (we use DEFAULT_LOCALE / en-us strings from locale-config/translations.json via i18n).
- Keep regional/market behavior tied to the URL locale (e.g. ar-sa) where we intentionally do so (LocaleProvider, phone rules, RTL, etc.).
- Prefer English location display fields from API payloads by overlaying `translations.en` on location objects (no API locale override for locations).
- Adjust Mapbox / map UI language where needed (map remount on language change).
- Optionally adjust Webflow DOM for ar-sa when translated (e.g. unhide `.home-gymfinder`).

## **HIGH-LEVEL ARCHITECTURE**
PARENT (Webflow) — file: IaC/webapp-frontend/lib/resources/wfjs/project-settings/head.js

- Observes `document.documentElement` `class` attribute with a MutationObserver.
- When `translated-ltr` is present, posts to the iframe: `{ googleTranslateUseDesiredLocaleStrings: true }` When not present: `{ googleTranslateUseDesiredLocaleStrings: false }`
- Also posts on iframe `load` and once immediately after setting `iframe.src` to handle “already translated on first paint” and “iframe navigates after about:blank” races.
- ar-sa home: when `translated-ltr` and path locale is ar-sa, removes `hidden` from `.home-gymfinder` (does NOT add `hidden` back per product decision).
CHILD (Next.js iframe) — core wiring

- app/[locale]/client-layout.tsx
- Listens for parent postMessage `googleTranslateUseDesiredLocaleStrings`.
- Persists flag in sessionStorage (locale-config/google-translate.ts helpers).
- Notifies same-tab listeners via a custom event (hooks/useGoogleTranslateUseDesiredLocaleStrings.ts).
- Switches i18n language via getI18nLanguageForGoogleTranslate(locale, flag) → DEFAULT_LOCALE when on.
- LocaleProvider stays on URL `locale` prop; optional country display tweak via preferDesiredLanguageCountryName.
- locale-config/google-translate.ts
- Session storage keys + getters/setters for the boolean flag.
- GOOGLE_TRANSLATE_DESIRED_LANGUAGE_CODE derived from DEFAULT_LOCALE (language part).
- getI18nLanguageForGoogleTranslate.
- hooks/useGoogleTranslateUseDesiredLocaleStrings.ts
- React hook + notifyGoogleTranslateUseDesiredLocaleStringsChanged for reactive updates.
- locale-config/utils/index.ts
- isI18nKey helper (heuristic for i18n key strings vs literal error text).

## **SEARCH FIELD (CustomSearchField)**
File: app/[locale]/location-finder/custom-search-field.component.tsx

- localizedParams.language uses GOOGLE_TRANSLATE_DESIRED_LANGUAGE_CODE when Google Translate desired-locale mode is active (via useGoogleTranslateUseDesiredLocaleStrings).
- SearchField translations.searchErrorText passes an i18n KEY string (not t(...)) so errors can re-render when language changes.
- Inline errors render with: isI18nKey(error) ? t(error) : error
- NOTE: We intentionally do NOT re-call mapbox-search to “translate” typed input without a new API call (per product constraint).

## **LEAD FORM / PHONE / MAPBOX CURRENT LOCALE**
- components/lead-form/lead-form.tsx
- translations.currentLocale = locale.id so shared LeadForm phone default country follows market locale even when i18n is DEFAULT_LOCALE.
- components/location-selector/location-selector.tsx
- mapProps.language switches with desired-locale mode.
- BaseLocationSelector keyed by mapLanguage so map labels remount when language changes.

## **LOCATION DATA (translations.en overlay)**
- utils/location-translations.ts + applyEnglishTranslationToLocations (uses translations.en on LocationSearchItem).
- hooks/useLocations.ts stores raw items, derives displayed list when flag/hook indicates desired-locale mode.
- Similar patterns: locations-widget, find-your-location-searchbar, location-finder/page.tsx (uses i18n.language === DEFAULT_LOCALE for overlay + map key), nearest-locations (LocationList keyed by i18n.language + mapItemsAfterFetch).
- app/api/mapbox-search/route.ts
- Reverse geocode uses `language=en` in Mapbox URL (place strings).

## **FRANCHISE LEADS FORM ERRORS**
- app/[locale]/franchise-leads/page.tsx
- LeadForm keyed by i18n.language so validation messages refresh after language toggle (shared library caches resolved strings).

# **MINIMUM STEPS FOR OTHER CODEBASE (IFRAME CHILD + WEBFLOW/PARENT)**

## **PARENT MINIMUM**
- In the parent page script that owns the iframe:
- Detect Google Translate state reliably (commonly `document.documentElement.classList.contains('translated-ltr')` for LTR-after-translation on RTL locales).
- PostMessage to iframe origin (strict targetOrigin, not "*"): `{ googleTranslateUseDesiredLocaleStrings: boolean }`
- Fire on:
- MutationObserver on `<html class>`
- iframe `load`
- initial sync after setting iframe.src (order: attach load listener, set src, then sync)

## **CHILD MINIMUM**
- Single listener in root client layout:
- On message: persist boolean (sessionStorage) + set React state + broadcast same-tab event.
- i18n:
- When true: changeLanguage to your “desired strings” bundle (we use DEFAULT_LOCALE).
- When false: changeLanguage back to URL locale.
- Market vs copy split (recommended):
- Keep “regional” context from URL locale (LocaleProvider) for phone/RTL/market rules.
- Use i18n only for translated UI strings when desired-locale mode is on.
- Any list/map that caches API-derived display strings:
- Either derive from raw + overlay on toggle, or remount keyed by language (pick smallest change per surface).
- Shared-library widgets that bake translated strings at init:
- Remount with `key={i18n.language}` on the smallest wrapper that owns validation or map language.

## **NOTES / LIMITATIONS**
- Google Translate does not translate cross-origin iframe content; this is why the iframe must switch i18n itself.
- Do not assume `translated-ltr` means “English” globally; it means “LTR display mode after translation” in Google’s model — we mapped it to our desired-locale strings bundle by product choice.
- Avoid re-calling APIs solely to translate free-typed search text unless explicitly accepted.
