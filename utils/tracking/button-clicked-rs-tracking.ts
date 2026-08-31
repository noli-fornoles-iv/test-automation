import { expect, Locator, Page } from '@playwright/test';
import { Helpers } from '@utils/helpers';
import {
  retrieveRudderstackNetworkLogs,
  rudderstackRequests,
  verifyNoEventTracked,
  type RudderStackRequest,
} from '@utils/rudderstack';

/** AFW-3951 — Button Clicked Rudderstack event name (Testpad 28427). */
export const BUTTON_CLICKED_EVENT = 'Button Clicked';

/** SIT test gyms from approved Testpad plan. */
export const BUTTON_CLICKED_TEST_CLUB_ID = '9993999';
export const BUTTON_CLICKED_THANK_YOU_CLUB_ID = '9991402';

export type ButtonClickedSurface = 'webflow' | 'react';

export type ButtonClickedInventory = {
  elementId?: string | 'non-empty';
  placement?: string | 'non-empty';
  text?: string | 'non-empty';
  locationId?: string | null | 'non-empty';
};

export type ButtonClickedRequest = RudderStackRequest & {
  status?: number;
};

export type ButtonClickedPayloadExpectations = ButtonClickedInventory & {
  surface?: ButtonClickedSurface;
  requireStatus200?: boolean;
  forbidPropertiesChannel?: boolean;
};

const RS_ELEMENT_ID_ATTRS = ['data-rs-element-id', 'data-element-id', 'data-rs-id'] as const;
const RS_PLACEMENT_ATTRS = ['data-rs-placement', 'data-placement'] as const;

function normalizeLocationId(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function normalizeText(value: unknown): string {
  return Helpers.normalizeText(value === null || value === undefined ? '' : String(value));
}

export async function readButtonClickedInventoryFromLocator(
  locator: Locator,
): Promise<Required<Pick<ButtonClickedInventory, 'elementId' | 'placement' | 'text'>>> {
  let elementId = '';
  for (const attr of RS_ELEMENT_ID_ATTRS) {
    const value = ((await locator.getAttribute(attr).catch(() => null)) ?? '').trim();
    if (value) {
      elementId = value;
      break;
    }
  }

  let placement = '';
  for (const attr of RS_PLACEMENT_ATTRS) {
    const value = ((await locator.getAttribute(attr).catch(() => null)) ?? '').trim();
    if (value) {
      placement = value;
      break;
    }
  }

  const text = normalizeText(await locator.innerText().catch(async () => locator.textContent()));

  if (!elementId || !placement) {
    throw new Error(
      `AFW-3951: clicked control missing RS inventory attributes (element_id="${elementId}", placement="${placement}")`,
    );
  }

  return { elementId, placement, text: text || 'non-empty' };
}

export function filterButtonClickedEvents(requests: RudderStackRequest[]): ButtonClickedRequest[] {
  return requests.filter(r => r.postDataJSON?.event === BUTTON_CLICKED_EVENT) as ButtonClickedRequest[];
}

export function countButtonClickedEvents(requests: RudderStackRequest[], since = 0): number {
  return filterButtonClickedEvents(requests.slice(since)).length;
}

export async function bindButtonClickedResponseStatusCapture(
  page: Page,
  collection: ButtonClickedRequest[],
): Promise<void> {
  page.on('response', async response => {
    if (!/dataplane\.rudderstack\.com|rudderstack\.com\/v1\//i.test(response.url())) {
      return;
    }
    if (response.request().method() !== 'POST') {
      return;
    }
    const postData = response.request().postData();
    if (!postData) {
      return;
    }
    try {
      const parsed = JSON.parse(postData) as { messageId?: string; batch?: unknown[] };
      const attachStatus = (messageId?: string) => {
        if (!messageId) return;
        const match = [...collection]
          .reverse()
          .find(item => String(item.postDataJSON?.messageId ?? '') === String(messageId));
        if (match) {
          match.status = response.status();
        }
      };
      if (Array.isArray(parsed.batch)) {
        for (const item of parsed.batch) {
          if (item && typeof item === 'object') {
            attachStatus(String((item as { messageId?: string }).messageId ?? ''));
          }
        }
      } else {
        attachStatus(parsed.messageId);
      }
    } catch {
      // Ignore non-JSON payloads.
    }
  });
}

export async function enableButtonClickedRudderstackCapture(page: Page): Promise<ButtonClickedRequest[]> {
  const collection = (await rudderstackRequests(page)) as ButtonClickedRequest[];
  await bindButtonClickedResponseStatusCapture(page, collection);
  return collection;
}

function assertInventoryValue(
  actual: string | null | undefined,
  expected: string | 'non-empty' | null | undefined,
  label: string,
): void {
  if (expected === undefined) {
    return;
  }
  if (expected === 'non-empty') {
    expect(actual, `${label} should be non-empty`).toBeTruthy();
    return;
  }
  if (expected === null) {
    expect(normalizeLocationId(actual), `${label} should be null`).toBeNull();
    return;
  }
  expect(normalizeText(actual), `${label}`).toBe(normalizeText(expected));
}

export function assertButtonClickedPayload(
  request: ButtonClickedRequest,
  expectations: ButtonClickedPayloadExpectations,
): void {
  const payload = request.postDataJSON;
  expect(payload?.event, 'Rudderstack event').toBe(BUTTON_CLICKED_EVENT);
  expect(payload?.type, 'Rudderstack type').toBe('track');
  expect(payload?.channel, 'Rudderstack channel').toBe('web');

  const properties = payload?.properties ?? {};

  if (expectations.elementId !== undefined) {
    assertInventoryValue(properties.element_id, expectations.elementId, 'element_id');
  }
  if (expectations.placement !== undefined) {
    assertInventoryValue(properties.placement, expectations.placement, 'placement');
  }
  if (expectations.text !== undefined) {
    if (expectations.text === 'non-empty') {
      assertInventoryValue(properties.text, 'non-empty', 'text');
    } else {
      expect(normalizeText(properties.text).toLowerCase(), 'text').toBe(
        normalizeText(expectations.text).toLowerCase(),
      );
    }
  }
  if (expectations.locationId !== undefined) {
    if (expectations.locationId === 'non-empty') {
      expect(normalizeLocationId(properties.location_id), 'location_id').toBeTruthy();
    } else {
      assertInventoryValue(properties.location_id, expectations.locationId, 'location_id');
    }
  }

  if (expectations.forbidPropertiesChannel) {
    expect(
      properties.channel,
      'properties.channel should be absent on Button Clicked payloads',
    ).toBeUndefined();
  }

  if (expectations.requireStatus200) {
    expect(request.status, 'dataplane HTTP status').toBe(200);
  }
}

export async function waitForButtonClickedAfterClick(
  requests: RudderStackRequest[],
  baselineCount: number,
  timeoutMs = 8000,
): Promise<ButtonClickedRequest> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const events = filterButtonClickedEvents(requests);
    if (events.length > baselineCount) {
      return events[events.length - 1];
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(
    `AFW-3951: ${BUTTON_CLICKED_EVENT} did not fire after click (before=${baselineCount}, after=${filterButtonClickedEvents(requests).length})`,
  );
}

export async function captureLatestButtonClicked(
  requests: RudderStackRequest[],
  expectations: ButtonClickedPayloadExpectations,
): Promise<ButtonClickedRequest> {
  const matched = await retrieveRudderstackNetworkLogs(requests, BUTTON_CLICKED_EVENT);
  assertButtonClickedPayload(matched as ButtonClickedRequest, expectations);
  return matched as ButtonClickedRequest;
}

export async function assertButtonClickedDidNotFireSince(
  requests: RudderStackRequest[],
  baselineCount: number,
): Promise<void> {
  const after = filterButtonClickedEvents(requests).length;
  expect(after, `${BUTTON_CLICKED_EVENT} should not fire again`).toBe(baselineCount);
}

export async function verifyButtonClickedNotTracked(
  requests: RudderStackRequest[],
): Promise<void> {
  await verifyNoEventTracked(requests, BUTTON_CLICKED_EVENT);
}

export function storeCalendarReferencePayload(
  scenarioContext: { buttonClickedCalendarReference?: ButtonClickedPayloadExpectations },
  request: ButtonClickedRequest,
): void {
  const properties = request.postDataJSON?.properties ?? {};
  scenarioContext.buttonClickedCalendarReference = {
    elementId: String(properties.element_id ?? ''),
    placement: String(properties.placement ?? ''),
  };
}
