import stepOrder from './rules/bdd-step-order.mjs';

/** Local ESLint plugin for playwright-bdd step files. */
export default {
  meta: { name: 'bdd', version: '1.0.0' },
  rules: {
    'step-order': stepOrder,
  },
};
