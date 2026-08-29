import fs from 'fs';
import path from 'path';
import { logger } from '@utils/logger';

const reportHistory = path.join('allure-report', 'history');
const resultsDir = 'allure-results';

function copyHistory() {
  try {
    if (fs.existsSync(reportHistory)) {
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir);
      }

      const destHistory = path.join(resultsDir, 'history');

      // Remove old history if exists
      if (fs.existsSync(destHistory)) {
        fs.rmSync(destHistory, { recursive: true, force: true });
      }

      // Copy folder
      fs.cpSync(reportHistory, destHistory, { recursive: true });

      logger.info('History copied successfully.');
    } else {
      logger.info('No history folder found');
    }
  } catch (error) {
    logger.error('Error copying history:', error);
  }
}

copyHistory();
