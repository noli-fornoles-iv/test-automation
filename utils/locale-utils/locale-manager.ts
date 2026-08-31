import * as fs from 'fs';
import * as path from 'path';
import environmentManager from '@config/environment';
import { logger } from '@utils/logger';
import localeKeysSkip from './locale-keys-skip';

class LocaleManager {
  private static instance: LocaleManager;
  private data: Record<string, string>;
  private messages: Record<string, string>;
  private locale: string;

  private constructor() {
    this.locale = environmentManager.get('LOCALE').toLowerCase();
    const localePath = path.resolve(`resources/${this.locale}`);

    this.data = JSON.parse(fs.readFileSync(`${localePath}/test-data.json`, 'utf-8'));
    this.messages = JSON.parse(fs.readFileSync(`${localePath}/translations.json`, 'utf-8'));

    logger.info(`Loaded resources for locale: ${this.locale}`);
  }

  static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  /**
   *
   * @param obj - The JSON object to search in (either `this.data` or `this.messages`).
   * @param path - The dot-separated key path (e.g. "locations.search.invalid").
   * @param source - The file name without extension (e.g. "test-data" or "translations").
   * @returns - The resolved string value for the provided path.
   * @throws Error if the path is missing or does not resolve to a string.
   *
   * @example
   * Returns "Antique" from resources/en-us/test-data.json
   * getNestedValue(this.data, "locations.search.invalid", "test-data");
   */
  private getNestedValue(obj: Record<string, unknown>, path: string, source: string): string {
    const keys = path.split('.');
    let value: unknown = obj;

    for (const key of keys) {
      if (typeof value !== 'object' || value === null || !(key in value)) {
        throw new Error(
          `Missing key "${path}" in ${source}.json for locale "${this.locale}". ` +
            `Please ensure the key exists in resources/${this.locale}/${source}.json`,
        );
      }
      value = (value as Record<string, unknown>)[key];
    }

    if (typeof value !== 'string') {
      throw new Error(
        `Key "${path}" in ${source}.json does not resolve to a string (got ${typeof value}). ` +
          `Locale: "${this.locale}". Value: ${JSON.stringify(value)}`,
      );
    }

    return value;
  }

  /**
   *
   * @param path The dot-separated key path within test-data.json (e.g. "locations.search.noNearbyLocation").
   * @returns The resolved string value for the provided path.
   *
   * @example
   * getData("locations.search.invalid")
   */

  getData(path: string): string {
    return this.getNestedValue(this.data, path, 'test-data');
  }

  /**
   * Retrieves a localized message from `translations.json` for the current locale.
   * @param path - The dot-separated key path within translations.json (e.g. "locations.noNearbyLocations").
   * @param replaceParams - Optional key-value pairs for replacing placeholders.
   * @returns The resolved message string with any placeholders replaced.
   *
   * @example
   *  Returns: "No locations found within 50 miles of Nevada. Please try searching a different city."
   *  getMessage("locations.noNearbyLocations", { location: "Nevada" });
   *
   *  Without Params:
   *  getMessage("errors.locationSearch.invalidLocation");
   */

  getMessage(path: string, replaceParams?: Record<string, string>): string {
    const skippedKeys = localeKeysSkip[this.locale] || [];

    if (skippedKeys.includes(path)) {
      logger.info(`[LocaleManager] Key "${path}" is skipped for locale "${this.locale}".`);
      return ''; // return empty string as placeholder
    }

    let message = this.getNestedValue(this.messages, path, 'translations');

    if (replaceParams) {
      for (const [key, value] of Object.entries(replaceParams)) {
        const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
        message = message.replace(regex, value);
      }
    }
    return message;
  }

  getCurrentLocale(): string {
    return this.locale;
  }

  /**
   * Returns the translation key for the location-search placeholder text shown on the current locale.
   */
  getSearchBoxPlaceholderKey(): string {
    const stateVariantLocales = new Set([
      'en-us',
      'en-gb',
      'en-in',
      'en-au',
      'de-de',
      'de-at',
      'th-th',
      'en-ph',
      'en-id',
      'en-my',
    ]);
    return stateVariantLocales.has(this.locale)
      ? 'labels.locationSearch.searchBoxPlaceholder.cityStateOrZipCode'
      : 'labels.locationSearch.searchBoxPlaceholder.cityOrZipCode';
  }

  /**
   * Events 2.0 iframe placeholder. Falls back to the shared Location Search placeholder
   * when a locale-specific Events override is not defined.
   */
  getEventsSearchBoxPlaceholder(): string {
    const eventsKey = 'texts.headings.locationSearch.eventsPromo.searchBoxPlaceholder';
    try {
      return this.getMessage(eventsKey);
    } catch {
      return this.getMessage(this.getSearchBoxPlaceholderKey());
    }
  }

  /**
   * Events Location Search 2.0 placeholder (title-case chrome). Falls back to the shared
   * Location Search placeholder when a locale-specific override is not defined.
   */
  getEventsLocationSearch20Placeholder(): string {
    const ls20Key = 'texts.headings.locationSearch.eventsLocationSearch20.searchBoxPlaceholder';
    try {
      return this.getMessage(ls20Key);
    } catch {
      return this.getMessage(this.getSearchBoxPlaceholderKey());
    }
  }
}

export const t = LocaleManager.getInstance().getMessage.bind(LocaleManager.getInstance());
export const d = LocaleManager.getInstance().getData.bind(LocaleManager.getInstance());
export const searchBoxPlaceholderKey = LocaleManager.getInstance().getSearchBoxPlaceholderKey.bind(
  LocaleManager.getInstance(),
);
export const eventsSearchBoxPlaceholder =
  LocaleManager.getInstance().getEventsSearchBoxPlaceholder.bind(LocaleManager.getInstance());
export const eventsLocationSearch20Placeholder =
  LocaleManager.getInstance().getEventsLocationSearch20Placeholder.bind(
    LocaleManager.getInstance(),
  );
export default LocaleManager.getInstance();
