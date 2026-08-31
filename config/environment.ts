import * as path from 'path';
import * as dotenv from 'dotenv';
import { EnvironmentConfig, Environment } from '../types/environment.types';
import { logger } from '../utils/logger';

class EnvironmentManager {
  private static instance: EnvironmentManager;
  private config!: EnvironmentConfig;

  private constructor() {}

  static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  /** Maps NODE_ENV to a supported .env.<env> file (sit, uat, prod). */
  private resolveEnvironmentFile(): Environment {
    const raw = (process.env.NODE_ENV || 'sit').toLowerCase();
    const aliases: Record<string, Environment> = {
      sit: 'sit',
      uat: 'uat',
      prod: 'prod',
      production: 'prod',
    };
    // bddgen/playwright may set NODE_ENV=development|test; default to SIT like the repo docs.
    return aliases[raw] ?? 'sit';
  }

  load(): void {
    const env = this.resolveEnvironmentFile();
    const envPath = path.resolve(`.env.${env}`);
    dotenv.config({ path: envPath, override: true });

    const { BASE_URL, BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY, GEO_LOCATION } = process.env;

    const LOCALE = process.env.LOCALE || 'en-us';

    // Validate required environment variables before setting config
    const required = ['BASE_URL', 'BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    let finalBaseUrl = BASE_URL!.replace(/\/$/, '');
    // PROD apex (https://anytimefitness.com) times out — always use www.
    finalBaseUrl = finalBaseUrl.replace(
      /^https?:\/\/anytimefitness\.com(?=[:/]|$)/i,
      'https://www.anytimefitness.com',
    );
    if (LOCALE && LOCALE.toLowerCase() !== 'en-us') {
      finalBaseUrl = `${finalBaseUrl}/${LOCALE.toLowerCase()}`;
    }

    // After validation, we know these variables exist, so non-null assertion is safe
    this.config = {
      BASE_URL: finalBaseUrl,
      BROWSERSTACK_USERNAME: BROWSERSTACK_USERNAME!,
      BROWSERSTACK_ACCESS_KEY: BROWSERSTACK_ACCESS_KEY!,
      GEO_LOCATION: GEO_LOCATION || 'US',
      LOCALE: LOCALE!,
    };

    logger.info(`Loaded config from ${envPath} with locale: ${LOCALE}`);
  }

  getConfig(): EnvironmentConfig {
    if (!this.config) this.load();
    return this.config;
  }

  get(key: keyof EnvironmentConfig): string {
    return this.getConfig()[key];
  }
}

export default EnvironmentManager.getInstance();
