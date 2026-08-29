import { createBdd } from 'playwright-bdd';
import * as allure from 'allure-js-commons';
import { test } from '@fixtures/base.fixture';

const { Before } = createBdd(test);

Before(async ({ $testInfo }) => {
  const featureName = $testInfo.titlePath[1] || 'Unknown Feature';
  const projectName = $testInfo.project.name || 'Default Project';

  // BEHAVIORS section
  allure.feature(featureName);
  allure.story(projectName);

  // SUITES section
  allure.parentSuite(featureName);
  allure.subSuite(projectName);
});
