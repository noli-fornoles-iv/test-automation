/**
 * EN-US club 9993999 may surface as Woodbury (Test1) or Woodbury! (Test2)
 * (PROD list cards, SIT tracking, Special Case). Treat those labels as the same gym.
 * Do not change Local Config / test-data.json to force one name.
 */

/** Optional bang + TEST1 or TEST2 — matches WOODBURY! (TEST1) and WOODBURY! (TEST2). */
export const US_WOODBURY_TEST_STUDIO_ALIAS_PATTERN =
  /woodbury!?\s*\(\s*test\s*[12]\s*\)/i;

export function normalizeGymName(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

export function isUsWoodburyTestStudioAlias(name: string | undefined): boolean {
  return US_WOODBURY_TEST_STUDIO_ALIAS_PATTERN.test(normalizeGymName(name));
}

export function gymNamesAreEquivalent(
  actual: string | undefined,
  expected: string,
): boolean {
  const actualNorm = normalizeGymName(actual);
  const expectedNorm = normalizeGymName(expected);
  if (actualNorm === expectedNorm) {
    return true;
  }
  return isUsWoodburyTestStudioAlias(actual) && isUsWoodburyTestStudioAlias(expected);
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Gym-card filter for location search. Woodbury Test1/Test2 aliases share one pattern
 * so GYM DETAILS / SELECT GYM can proceed when PROD lists TEST1 and Local Config is TEST2.
 */
export function gymNameMatchPattern(gymName: string): RegExp {
  const trimmed = gymName.trim();
  if (isUsWoodburyTestStudioAlias(trimmed)) {
    return new RegExp(
      US_WOODBURY_TEST_STUDIO_ALIAS_PATTERN.source,
      US_WOODBURY_TEST_STUDIO_ALIAS_PATTERN.flags,
    );
  }
  return new RegExp(escapeRegExp(trimmed), 'i');
}
