import { execFileSync } from 'child_process';
import path from 'path';
import { logger } from '@utils/logger';
import environmentManager from './environment';

function cleanLeftoverTempLogs() {
  const script = path.resolve(process.cwd(), 'scripts/clean-temp-logs.mjs');
  try {
    execFileSync(process.execPath, [script, '--skip-runtime'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (error) {
    console.warn('Pre-run log cleanup failed:', error);
  }
}

async function globalSetup() {
  // Remove leftover root/.cursor/logs from prior runs before starting
  cleanLeftoverTempLogs();

  try {
    environmentManager.load();
    const config = environmentManager.getConfig();

    logger.info('Global setup complete');
    logger.info(`BASE_URL: ${config.BASE_URL}`);
    logger.info(`GEO_LOCATION: ${config.GEO_LOCATION}`);
    logger.info(`BROWSERSTACK_USERNAME: ${config.BROWSERSTACK_USERNAME}`);
  } catch (error) {
    logger.error('Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;
