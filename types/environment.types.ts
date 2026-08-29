export interface EnvironmentConfig {
  BASE_URL: string;
  BROWSERSTACK_USERNAME: string;
  BROWSERSTACK_ACCESS_KEY: string;
  GEO_LOCATION: string;
  LOCALE: string;
}

export type Environment = 'prod' | 'sit' | 'uat';
