/**
 * Build AF-Automation local knowledge base from a Google Sheets MCP dump.
 *
 * Sheet data is fetched by the Cursor agent via MCP server `user-google-sheets`
 * (authenticated Google account) — not via public CSV/htmlview export.
 *
 * Agent sync flow (see `.cursor/skills/af-automation-agent/sync-via-mcp.md`):
 * 1. MCP list_sheets + get_sheet_data for every tab
 * 2. Write `.cursor/knowledge-base/.mcp-sheet-dump.json`
 * 3. Run: node scripts/sync-knowledge-base.mjs [--skip-links]
 *
 * Sheet structure (v3 — Agent Reference Sheet):
 * - Definition, Coverage, Local Config, Resources, Testplan, Tickets
 * - Flow tabs (Book A Tour, Contact Us, …) with Test Case ID / Feature Tag /
 *   TC Coverage / Supported Locales / JIRA / Page / Test Case / Notes
 *
 * Source of truth:
 * https://docs.google.com/spreadsheets/d/1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg
 * Agent guide:
 * https://docs.google.com/document/d/1EsVer_Pzh5WiMEv1s1pyV-FssHyVc65f/edit
 *
 * Usage:
 *   node scripts/sync-knowledge-base.mjs [--skip-links]
 *   node scripts/sync-knowledge-base.mjs --from-dump <path> [--skip-links]
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KB_DIR = join(ROOT, '.cursor', 'knowledge-base');
const SHEETS_DIR = join(KB_DIR, 'sheets');
const LINKS_DIR = join(KB_DIR, 'links');
const DEFAULT_DUMP_PATH = join(KB_DIR, '.mcp-sheet-dump.json');

const SHEET_ID = '1jk3Jat-tjmVfujDf5Kz8Il8tLpBSu_dhr_1a5MDaxgg';

const args = process.argv.slice(2);
const SKIP_LINKS = args.includes('--skip-links');
const dumpFlagIdx = args.indexOf('--from-dump');
const DUMP_PATH =
  dumpFlagIdx >= 0 && args[dumpFlagIdx + 1]
    ? resolve(args[dumpFlagIdx + 1])
    : DEFAULT_DUMP_PATH;

const AGENT_GUIDE_DOC =
  'https://docs.google.com/document/d/1EsVer_Pzh5WiMEv1s1pyV-FssHyVc65f/edit';

const MCP_SYNC_HELP = `
Knowledge base sync no longer downloads the sheet via public HTTP (htmlview/CSV export).

Use Google Sheets MCP (authenticated), then build local files:

  1. Agent: follow .cursor/skills/af-automation-agent/sync-via-mcp.md
     - MCP server: user-google-sheets
     - list_sheets + get_sheet_data for each tab
     - Write ${DEFAULT_DUMP_PATH}
  2. Build: npm run sync:knowledge-base
     (or: node scripts/sync-knowledge-base.mjs --from-dump <path>)

Missing dump: ${DUMP_PATH}
`.trim();

/** System tabs — not flow scenario sources. */
const SYSTEM_TABS = new Set([
  'Definition',
  'Coverage',
  'Local Config',
  'Resources',
  'Testplan',
  'Tickets',
  // Legacy aliases (removed from sheet v3; kept for older exports)
  'Conditional Scenarios',
  'Special Case',
  'Local-Config',
  'LocalConfig',
]);

const FLOW_TO_FEATURE = {
  'Book A Tour Standalone': 'BookATourStandalone',
  'Book A Tour': 'BookATourStandalone',
  'Contact Us': 'ContactUs',
  CorporateMembership: 'CorporateMembership',
  'Corporate Membership': 'CorporateMembership',
  'Event Book A Tour': 'EventsBookATour',
  'Events Find Your Fitphoria': 'EventsFindYourFitphoria',
  'Events Free Trial Pass': 'EventsFreeTrialPass',
  'Events Join Online': 'EventsJoinOnline',
  'Events Train For Your Life': 'EventsTrainForYourLife',
  'Events Promo': 'EventsPromo',
  'Hsa Fsa Membership': 'HsaFsaMembership',
  'Local Offer': 'LocalOffer',
  'MCO Offer': 'MCOOffer',
  'Member Offer': 'MemberOffer',
  'Membership Inquiry': 'MembershipInquiry',
  'Own A Gym': 'OwnAGym',
  'Try Us Free Apple Fitness Free Trial Offer': 'TryUsFreeAppleFitnessFreeTrialOffer',
  'Try Us Free Apple Fitness Plus Subscriber': 'TryUsFreeAppleFitnessPlusSubscriber',
  'Try Us Free': 'TryUsFree',
  'Invite a friend': 'InviteAFriend',
  'Invite a friend + Share Invitation Link Generation': 'InviteAFriend',
  'Share Invitation Link Generation': 'InviteAFriend',
  'Find a gym': 'FindAGym',
  'Find A Gym': 'FindAGym',
  'Location Search on static pages': 'LocationSearchOnStaticPages',
  'Cancel Membership': 'CancelMembership',
  'Cancel membership': 'CancelMembership',
};

const LOCALE_TAG_MAP = {
  US: { locale: 'EN-US', folder: 'en-us', tag: 'US' },
  AU: { locale: 'EN-AU', folder: 'en-au', tag: 'AU' },
  AE: { locale: 'EN-AE', folder: 'en-ae', tag: 'AE' },
  SA: { locale: 'AR-SA', folder: 'ar-sa', tag: 'SA' },
  ZA: { locale: 'EN-ZA', folder: 'en-za', tag: 'ZA' },
  GB: { locale: 'EN-GB', folder: 'en-gb', tag: 'GB' },
  IE: { locale: 'EN-IE', folder: 'en-ie', tag: 'IE' },
  IN: { locale: 'EN-IN', folder: 'en-in', tag: 'IN' },
  'EN-CA': { locale: 'EN-CA', folder: 'en-ca', tag: 'EN-CA' },
  'FR-CA': { locale: 'FR-CA', folder: 'fr-ca', tag: 'FR-CA' },
  AT: { locale: 'DE-AT', folder: 'de-at', tag: 'AT' },
  DE: { locale: 'DE-DE', folder: 'de-de', tag: 'DE' },
  IT: { locale: 'IT-IT', folder: 'it-it', tag: 'IT' },
  TH: { locale: 'TH-TH', folder: 'th-th', tag: 'TH' },
  PH: { locale: 'EN-PH', folder: 'en-ph', tag: 'PH' },
  SG: { locale: 'EN-SG', folder: 'en-sg', tag: 'SG' },
  NZ: { locale: 'EN-NZ', folder: 'en-nz', tag: 'NZ' },
  ID: { locale: 'EN-ID', folder: 'en-id', tag: 'ID' },
};

const CONFIG_KEYS = ['Rudderstack', 'Data Layer', 'Global Pixel', 'GTM', 'Jenkins'];

function slugify(name) {
  return name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function escapeCsvCell(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(rows) {
  return `${rows.map((row) => (row ?? []).map(escapeCsvCell).join(',')).join('\n')}\n`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
      row.push(field);
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
      field = '';
      if (ch === '\r') i++;
    } else if (ch !== '\r') {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }

  return rows;
}

function loadMcpDump(dumpPath) {
  if (!existsSync(dumpPath)) {
    throw new Error(MCP_SYNC_HELP);
  }

  let raw;
  try {
    raw = JSON.parse(readFileSync(dumpPath, 'utf-8'));
  } catch (err) {
    throw new Error(`Failed to parse MCP dump at ${dumpPath}: ${err.message}`);
  }

  const tabs = raw.tabs ?? raw.sheets ?? [];
  if (!Array.isArray(tabs) || tabs.length === 0) {
    throw new Error(
      `MCP dump at ${dumpPath} has no tabs. Expected { tabs: [{ name, values|rows, gid? }] }.`,
    );
  }

  return {
    spreadsheetId: raw.spreadsheetId ?? raw.sheetId ?? SHEET_ID,
    syncedVia: raw.syncedVia ?? 'mcp',
    fetchedAt: raw.fetchedAt ?? null,
    tabs,
  };
}

/**
 * Normalize MCP dump tabs → write sheets/*.csv and return download-shaped objects.
 * Accepts values (Sheets API / MCP get_sheet_data) or rows (already 2D arrays).
 */
function materializeTabsFromDump(dump) {
  const downloaded = [];

  for (const tab of dump.tabs) {
    const name = (tab.name ?? tab.title ?? '').trim();
    if (!name) continue;

    const values = tab.values ?? tab.rows ?? tab.data ?? [];
    if (!Array.isArray(values)) {
      throw new Error(`Tab "${name}" in MCP dump has invalid values/rows (expected 2D array)`);
    }

    const rows = values.map((row) =>
      Array.isArray(row) ? row.map((cell) => (cell == null ? '' : String(cell))) : [String(row)],
    );

    const filename = `${slugify(name)}.csv`;
    const path = join(SHEETS_DIR, filename);
    writeFileSync(path, rowsToCsv(rows), 'utf-8');

    downloaded.push({
      name,
      gid: tab.gid != null ? String(tab.gid) : tab.sheetId != null ? String(tab.sheetId) : '',
      path,
      filename,
      rows,
    });
  }

  if (downloaded.length === 0) {
    throw new Error('MCP dump produced zero usable tabs');
  }

  return downloaded;
}

async function fetchText(url, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseCoverage(rows) {
  if (rows.length < 2) return { locales: [], flows: [] };

  const localeRow = rows[1];
  const locales = [];

  for (let i = 1; i < localeRow.length; i++) {
    const code = localeRow[i]?.trim();
    if (!code) continue;
    locales.push({
      code,
      ...(LOCALE_TAG_MAP[code] ?? { locale: code, folder: code.toLowerCase(), tag: code }),
    });
  }

  const flows = rows
    .slice(2)
    .map((row) => {
      const flow = row[0]?.trim();
      if (!flow) return null;
      const availability = {};
      for (let i = 0; i < locales.length; i++) {
        const value = (row[i + 1] ?? '').trim().toUpperCase();
        availability[locales[i].code] = value === 'YES';
      }
      return {
        flow,
        featureTag: FLOW_TO_FEATURE[flow] ?? null,
        availability,
      };
    })
    .filter(Boolean);

  return { locales, flows };
}

function parseResources(rows) {
  const resources = [];
  for (let i = 1; i < rows.length; i++) {
    const [name, publicLink = '', editableLink = ''] = rows[i];
    if (!name?.trim()) continue;
    resources.push({
      name: name.trim(),
      publicLink: publicLink.trim(),
      editableLink: editableLink.trim(),
    });
  }
  return resources;
}

function parseTestplan(rows) {
  const plans = [];
  for (let i = 1; i < rows.length; i++) {
    const [flow, link = ''] = rows[i];
    if (!flow?.trim()) continue;
    plans.push({
      flow: flow.trim(),
      featureTag: FLOW_TO_FEATURE[flow.trim()] ?? null,
      testpadLink: link.trim(),
    });
  }
  return plans;
}

function parseTickets(rows) {
  const tickets = [];
  if (!rows.length) return tickets;

  const header = (rows[0] ?? []).map((c) => (c ?? '').trim().toLowerCase());
  const hasStatus = header.some((h) => h.includes('status'));
  const hasTestplan = header.some((h) => h.includes('testplan'));

  for (let i = 1; i < rows.length; i++) {
    const cols = (rows[i] ?? []).map((c) => (c ?? '').trim());
    let number = '';
    let name = '';
    let ticketLink = '';
    let testplanLink = '';
    let flow = '';
    let locale = '';
    let status = '';

    if (hasTestplan || hasStatus) {
      // Ticket Number | Ticket Name | Ticket Link | Testplan Public Link | Flow | Locale | Status
      [number = '', name = '', ticketLink = '', testplanLink = '', flow = '', locale = '', status = ''] =
        cols;
    } else {
      // Legacy: Ticket Number | Ticket Name | Link/Description | Flow | Locale
      [number = '', name = '', ticketLink = '', flow = '', locale = ''] = cols;
    }

    if (!number && !name && !ticketLink) continue;
    tickets.push({
      ticketNumber: number || null,
      ticketName: name || null,
      ticketLink: ticketLink || null,
      testplanLink: testplanLink || null,
      ticketDescription: ticketLink || null,
      flow: flow || null,
      featureTag: flow ? FLOW_TO_FEATURE[flow] ?? null : null,
      locales: locale
        ? locale
            .split(/[,/|]/)
            .map((l) => l.trim().toUpperCase())
            .filter(Boolean)
        : [],
      status: status || null,
    });
  }
  return tickets;
}

function classifyScenarioTags(featureTag) {
  if (!featureTag) return { smoke: false, regression: false, na: true };
  const upper = featureTag.toUpperCase();
  return {
    smoke: upper.includes('SMOKE'),
    regression: upper.includes('REGRESSION'),
    na: upper === 'N/A' || (!upper.includes('SMOKE') && !upper.includes('REGRESSION')),
  };
}

function parseConditionalScenarios(rows) {
  const cases = [];
  let current = null;

  for (const row of rows.slice(1)) {
    const [flow = '', scenario = '', type = '', event = '', info = ''] = row.map((c) =>
      (c ?? '').trim(),
    );
    if (flow) {
      if (current) cases.push(current);
      current = { flow, scenario, type, event, relevantInformation: info };
      continue;
    }
    if (current && info) {
      current.relevantInformation += `\n${info}`;
    }
  }
  if (current) cases.push(current);
  return cases;
}

/**
 * Local Config — centralized locale test data + tracking CONFIG flags.
 * Row 0: section labels · Row 1: group labels · Row 2: field labels · Row 3+: locale rows
 */
function parseLocalConfig(rows) {
  if (rows.length < 4) return [];

  const fieldRow = rows[2].map((c) => (c ?? '').trim());
  const locales = [];

  for (let i = 3; i < rows.length; i++) {
    const cols = rows[i].map((c) => (c ?? '').trim());
    const code = cols[0];
    if (!code || !LOCALE_TAG_MAP[code.toUpperCase()]) continue;

    const localeCode = code.toUpperCase();
    const testData = {
      search: {
        invalid: cols[1] || null,
        noNearbyLocation: cols[2] || null,
        default: cols[3] || null,
        default1: cols[4] || null,
        california: cols[5] || null,
        washington: cols[6] || null,
      },
      gym: {
        clubId: cols[7] || null,
        presaleClubId: cols[8] || null,
        secondaryClubId: cols[9] || null,
        localGymSlug: cols[10] || null,
      },
      zipCodes: {
        default: cols[11] || null,
        secondary: cols[12] || null,
        invalidLong: cols[13] || null,
        invalidShort: cols[14] || null,
        invalidAlpha: cols[15] || null,
      },
      phoneNumber: {
        default: cols[16] || null,
        secondary: cols[17] || null,
        localFormat: cols[18] || null,
        invalid: cols[19] || null,
        countryCode: cols[20] || null,
      },
    };

    const config = {};
    CONFIG_KEYS.forEach((key, idx) => {
      const raw = (cols[21 + idx] ?? '').toUpperCase();
      config[key] = raw === 'TRUE';
    });

    locales.push({
      code: localeCode,
      locale: LOCALE_TAG_MAP[localeCode]?.locale ?? localeCode,
      folder: LOCALE_TAG_MAP[localeCode]?.folder ?? localeCode.toLowerCase(),
      tag: LOCALE_TAG_MAP[localeCode]?.tag ?? localeCode,
      testData,
      config,
      fieldLabels: fieldRow,
    });
  }

  return locales;
}

function parseSupportedLocales(cell) {
  if (!cell?.trim()) return [];
  return cell
    .split(/[,/|]/)
    .map((l) => l.trim().toUpperCase())
    .filter((l) => l && l !== 'N/A');
}

/**
 * Flow tab columns (v3):
 * Test Case ID | Feature Tag | TC coverage? | Supported Locales | JIRA Ticket Reference |
 * Page | Test Case | Notes
 *
 * Legacy (v2) also supported:
 * Feature Tag | TC coverage? | Supported Locales | Page | Scenario | Notes | Element
 * (first row may be the flow title only)
 */
function parseFlowTab(rows, flowName) {
  const scenarios = [];
  let headerIdx = -1;
  let layout = 'legacy';

  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const cells = rows[i].map((c) => (c ?? '').trim().toLowerCase());
    const joined = cells.join(' | ');
    if (joined.includes('test case id') && joined.includes('feature tag') && joined.includes('tc coverage')) {
      headerIdx = i;
      layout = 'v3';
      break;
    }
    if (cells[0]?.includes('feature tag') && cells[1]?.includes('tc coverage')) {
      headerIdx = i;
      layout = 'legacy';
      break;
    }
  }

  if (headerIdx < 0) {
    return {
      flow: flowName,
      featureTag: FLOW_TO_FEATURE[flowName] ?? null,
      scenarios: [],
      totalAutomated: 0,
    };
  }

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const cols = rows[i].map((c) => (c ?? '').trim());
    let testCaseId = '';
    let featureTag = '';
    let tcCoverage = '';
    let supportedLocales = '';
    let jiraTicket = '';
    let page = '';
    let scenario = '';
    let notes = '';
    let element = '';

    if (layout === 'v3') {
      [
        testCaseId = '',
        featureTag = '',
        tcCoverage = '',
        supportedLocales = '',
        jiraTicket = '',
        page = '',
        scenario = '',
        notes = '',
      ] = cols;
    } else {
      [featureTag = '', tcCoverage = '', supportedLocales = '', page = '', scenario = '', notes = '', element = ''] =
        cols;
    }

    if (!scenario || !tcCoverage) continue;

    const coverage = tcCoverage.toUpperCase();
    if (!['YES', 'NO', 'N/A'].includes(coverage)) continue;

    scenarios.push({
      flow: flowName,
      testCaseId: testCaseId || null,
      featureTag: featureTag || null,
      tcCoverage: coverage,
      automate: coverage === 'YES',
      supportedLocales: parseSupportedLocales(supportedLocales),
      jiraTicket: jiraTicket || null,
      page: page || null,
      scenario,
      notes: notes || null,
      element: element || null,
    });
  }

  const automated = scenarios.filter((s) => s.automate);
  return {
    flow: flowName,
    featureTag: FLOW_TO_FEATURE[flowName] ?? null,
    layout,
    scenarios,
    automated,
    totalAutomated: automated.length,
    smoke: automated.filter((s) => classifyScenarioTags(s.featureTag).smoke).length,
    regressionOnly: automated.filter(
      (s) => classifyScenarioTags(s.featureTag).regression && !classifyScenarioTags(s.featureTag).smoke,
    ).length,
    smokeAndRegression: automated.filter(
      (s) => classifyScenarioTags(s.featureTag).smoke && classifyScenarioTags(s.featureTag).regression,
    ).length,
    untagged: automated.filter((s) => classifyScenarioTags(s.featureTag).na).length,
  };
}

function writeFlowScenarioChecklist(flowSummary) {
  const lines = [
    `# ${flowSummary.flow} Scenario Checklist`,
    '',
    `Total TC coverage = YES: **${flowSummary.totalAutomated}**`,
    `- Smoke: **${flowSummary.smoke}**`,
    `- Regression only: **${flowSummary.regressionOnly}**`,
    `- Smoke + Regression: **${flowSummary.smokeAndRegression}**`,
    `- Untagged (N/A): **${flowSummary.untagged}**`,
    '',
    '## All automated scenarios (TC coverage = YES)',
    '',
    '| Test Case ID | Page | Test Case | Feature Tag | Supported Locales | JIRA | Notes |',
    '|--------------|------|-----------|-------------|-------------------|------|-------|',
    ...flowSummary.automated.map((s) => {
      const notes = (s.notes ?? '').replace(/\|/g, '\\|');
      const jira = s.jiraTicket ? String(s.jiraTicket).replace(/\|/g, '\\|') : '';
      return `| ${s.testCaseId ?? ''} | ${s.page ?? ''} | ${s.scenario} | ${s.featureTag ?? 'N/A'} | ${(s.supportedLocales ?? []).join(', ') || 'N/A'} | ${jira} | ${notes} |`;
    }),
    '',
    '## Smoke scenarios only',
    '',
    ...flowSummary.automated
      .filter((s) => classifyScenarioTags(s.featureTag).smoke)
      .map(
        (s) =>
          `- ${s.testCaseId ? `\`${s.testCaseId}\` ` : ''}[${s.page}] ${s.scenario} (${(s.supportedLocales ?? []).join(', ') || 'N/A'})`,
      ),
    '',
    '## By supported locale',
    '',
  ];

  const byLocale = {};
  for (const s of flowSummary.automated) {
    const locales = s.supportedLocales?.length ? s.supportedLocales : ['UNSPECIFIED'];
    for (const locale of locales) {
      byLocale[locale] = byLocale[locale] ?? [];
      byLocale[locale].push(s);
    }
  }
  for (const [locale, list] of Object.entries(byLocale).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`### ${locale} (${list.length})`);
    for (const s of list) {
      lines.push(`- ${s.testCaseId ? `\`${s.testCaseId}\` ` : ''}[${s.page}] ${s.scenario}`);
    }
    lines.push('');
  }

  lines.push(
    'Regenerate: MCP sync (`.cursor/skills/af-automation-agent/sync-via-mcp.md`) then `npm run sync:knowledge-base`',
  );

  const filename = `scenario-checklist-${slugify(flowSummary.flow)}.md`;
  writeFileSync(join(KB_DIR, filename), lines.join('\n'), 'utf-8');
  return filename;
}

function writeLocalConfigSummary(localConfigs) {
  const lines = [
    '# Local Config Summary',
    '',
    'Source: **Local Config** tab — test data + tracking/config flags per locale.',
    '',
    '| Locale | Rudderstack | Data Layer | Global Pixel | GTM | Jenkins | Club Id | Default Search |',
    '|--------|-------------|------------|--------------|-----|---------|---------|----------------|',
    ...localConfigs.map((l) => {
      const c = l.config;
      return `| ${l.code} (${l.locale}) | ${c.Rudderstack ? 'TRUE' : 'FALSE'} | ${c['Data Layer'] ? 'TRUE' : 'FALSE'} | ${c['Global Pixel'] ? 'TRUE' : 'FALSE'} | ${c.GTM ? 'TRUE' : 'FALSE'} | ${c.Jenkins ? 'TRUE' : 'FALSE'} | ${l.testData.gym.clubId ?? ''} | ${l.testData.search.default ?? ''} |`;
    }),
    '',
    'Regenerate: MCP sync (`.cursor/skills/af-automation-agent/sync-via-mcp.md`) then `npm run sync:knowledge-base`',
  ];
  const filename = 'local-config-summary.md';
  writeFileSync(join(KB_DIR, filename), lines.join('\n'), 'utf-8');
  return filename;
}

/**
 * When Resources links omit `gid=` (common after Drive sharing URL updates),
 * use these known tab gids so public CSV export still hits the right sheet.
 * Prefer URL gid when present.
 */
const RESOURCES_SHEET_GID_FALLBACKS = {
  'local status & flows': '1799873444',
  'react components': '461153220',
  pages: '603517496',
  'nav bar': '649182224',
  footer: '1298370605',
  'external subdomains': '827661881',
  'test gyms': '1928747136',
  'af pixel catalog': '977035100',
};

function extractSheetLink(url, resourceName = '') {
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetMatch) return null;
  const gidMatch = url.match(/[?&#]gid=(\d+)/);
  const fallbackGid =
    RESOURCES_SHEET_GID_FALLBACKS[resourceName.trim().toLowerCase()] ?? '0';
  return {
    sheetId: sheetMatch[1],
    gid: gidMatch?.[1] ?? fallbackGid,
  };
}

async function crawlResource(resource) {
  const { name, publicLink } = resource;
  if (!publicLink) return { name, status: 'skipped', reason: 'no public link' };

  const out = { name, publicLink, status: 'ok', files: [] };

  try {
    if (publicLink.includes('docs.google.com/spreadsheets')) {
      // Public CSV export — works for native Sheets and shared Office/Excel Drive files.
      // (Sheets MCP rejects Office files; this is the intentional non-MCP fallback.)
      const ref = extractSheetLink(publicLink, name);
      if (!ref) throw new Error('Could not parse spreadsheet URL');
      const csvUrl = `https://docs.google.com/spreadsheets/d/${ref.sheetId}/export?format=csv&gid=${ref.gid}`;
      const csv = await fetchText(csvUrl);
      const filename = `${slugify(name)}.csv`;
      const path = join(LINKS_DIR, filename);
      writeFileSync(path, csv, 'utf-8');
      out.files.push({ type: 'csv', path: `links/${filename}`, rows: parseCsv(csv).length });
    } else if (publicLink.includes('notion.site')) {
      const text = await fetchText(publicLink);
      const filename = `${slugify(name)}.html`;
      const path = join(LINKS_DIR, filename);
      writeFileSync(path, text, 'utf-8');
      out.files.push({ type: 'html', path: `links/${filename}`, bytes: text.length });
    } else {
      const text = await fetchText(publicLink);
      const filename = `${slugify(name)}.txt`;
      const path = join(LINKS_DIR, filename);
      writeFileSync(path, text, 'utf-8');
      out.files.push({ type: 'text', path: `links/${filename}`, bytes: text.length });
    }
  } catch (err) {
    out.status = 'failed';
    out.reason = err.message;
  }

  return out;
}

function resolveLocalConfigTab(byName) {
  return byName['Local Config'] ?? byName['Local-Config'] ?? byName.LocalConfig ?? null;
}

function resolveConditionalTab(byName) {
  return byName['Conditional Scenarios'] ?? byName['Special Case'] ?? null;
}

async function main() {
  console.log('AF-Automation knowledge base sync (MCP dump → local KB)');
  console.log(`Sheet: ${SHEET_ID}`);
  console.log(`Dump:  ${DUMP_PATH}`);

  const dump = loadMcpDump(DUMP_PATH);
  const sheetId = dump.spreadsheetId || SHEET_ID;

  mkdirSync(SHEETS_DIR, { recursive: true });
  mkdirSync(LINKS_DIR, { recursive: true });

  const downloaded = materializeTabsFromDump(dump);
  console.log(
    `Loaded ${downloaded.length} tabs from MCP dump (${dump.syncedVia}): ${downloaded
      .map((t) => t.name)
      .join(', ')}`,
  );

  const byName = Object.fromEntries(downloaded.map((d) => [d.name, d]));

  const coverage = parseCoverage(byName.Coverage?.rows ?? []);
  const resources = parseResources(byName.Resources?.rows ?? []);
  const testplan = parseTestplan(byName.Testplan?.rows ?? []);
  const tickets = parseTickets(byName.Tickets?.rows ?? []);
  const conditionalScenarios = parseConditionalScenarios(resolveConditionalTab(byName)?.rows ?? []);
  const localConfigs = parseLocalConfig(resolveLocalConfigTab(byName)?.rows ?? []);

  const flowTabs = downloaded
    .filter((d) => !SYSTEM_TABS.has(d.name) && !LOCALE_TAG_MAP[d.name])
    .map((d) => parseFlowTab(d.rows, d.name));

  const checklistFiles = flowTabs
    .filter((f) => f.totalAutomated > 0)
    .map(writeFlowScenarioChecklist);

  const localConfigSummaryFile = writeLocalConfigSummary(localConfigs);

  const crawled = [];
  if (!SKIP_LINKS) {
    console.log(`Crawling ${resources.length} resource links...`);
    for (const resource of resources) {
      process.stdout.write(`  ${resource.name}... `);
      const result = await crawlResource(resource);
      crawled.push(result);
      console.log(result.status === 'ok' ? 'ok' : `failed (${result.reason})`);
    }
  }

  const definitionRows = byName.Definition?.rows ?? [];

  const manifest = {
    syncedAt: new Date().toISOString(),
    syncedVia: dump.syncedVia ?? 'mcp',
    mcpDumpFetchedAt: dump.fetchedAt,
    source: {
      document: AGENT_GUIDE_DOC,
      spreadsheet: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      sheetId,
    },
    sheetStructureVersion: 3,
    tabs: downloaded.map(({ name, gid, filename, rows }) => ({
      name,
      gid,
      file: `sheets/${filename}`,
      rowCount: rows.length,
      kind: SYSTEM_TABS.has(name)
        ? 'system'
        : LOCALE_TAG_MAP[name]
          ? 'legacy-locale'
          : 'flow',
    })),
    definition: {
      present: Boolean(byName.Definition),
      rowCount: definitionRows.length,
      file: byName.Definition ? `sheets/${byName.Definition.filename}` : null,
    },
    coverage,
    localConfig: localConfigs,
    resources,
    testplan,
    tickets,
    /** @deprecated Removed from sheet v3 — empty unless a legacy tab is restored */
    conditionalScenarios,
    /** @deprecated Alias for conditionalScenarios */
    specialCases: conditionalScenarios,
    flows: flowTabs,
    crawledResources: crawled,
    flowToFeature: FLOW_TO_FEATURE,
    localeTagMap: LOCALE_TAG_MAP,
  };

  const manifestPath = join(KB_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  const summaryPath = join(KB_DIR, 'summary.md');
  const yesCount = coverage.flows.reduce((acc, f) => {
    for (const [locale, enabled] of Object.entries(f.availability)) {
      if (enabled) acc[locale] = (acc[locale] ?? 0) + 1;
    }
    return acc;
  }, {});

  const ticketsDone = tickets.filter((t) => (t.status ?? '').toUpperCase() === 'DONE').length;
  const ticketsPending = tickets.length - ticketsDone;

  const summary = [
    '# AF-Automation Knowledge Base',
    '',
    `Last synced: ${manifest.syncedAt}`,
    `Synced via: **${manifest.syncedVia}** (Google Sheets MCP dump → local build)`,
    dump.fetchedAt ? `MCP dump fetched at: ${dump.fetchedAt}` : '',
    '',
    '## Sheet structure (v3)',
    '- **Definition** — overview of each tab and how the agent should use it',
    '- **Coverage** — flow × locale availability (YES/NO)',
    '- **Local Config** — locale test data + Rudderstack / Data Layer / Global Pixel / GTM / Jenkins',
    '- **Resources** — project docs and DOM references (crawl before generating)',
    '- **Testplan** — Testpad links per flow',
    '- **Tickets** — automation backlog with Status (set DONE after ticket automation)',
    '- **Flow tabs** — Test Case ID / Feature Tag / TC Coverage / Supported Locales / JIRA / Page / Test Case / Notes',
    '',
    '## Coverage by locale (YES flows)',
    ...Object.entries(yesCount).map(([locale, count]) => `- **${locale}**: ${count} flows`),
    '',
    '## Local Config',
    `- Locales: ${localConfigs.map((l) => l.code).join(', ') || '(none)'}`,
    `- Summary: [${localConfigSummaryFile}](${localConfigSummaryFile})`,
    '',
    '## Flow tabs synced',
    ...flowTabs.map(
      (f) =>
        `- **${f.flow}**: ${f.totalAutomated} TC=YES scenarios (smoke: ${f.smoke}, regression-only: ${f.regressionOnly}, smoke+regression: ${f.smokeAndRegression}, untagged: ${f.untagged})`,
    ),
    '',
    '## Scenario checklists',
    ...checklistFiles.map((f) => `- [${f}](${f})`),
    '',
    `## Tickets: ${tickets.length} (DONE: ${ticketsDone}, pending: ${ticketsPending})`,
    conditionalScenarios.length
      ? `## Legacy conditional scenarios: ${conditionalScenarios.length} rules`
      : '## Legacy conditional scenarios: none (removed from sheet v3 — use Flow Notes / Test Case)',
    '',
    '## Resource crawl',
    ...crawled.map((r) => `- ${r.name}: ${r.status}${r.reason ? ` (${r.reason})` : ''}`),
    '',
    'Regenerate: MCP sync (`.cursor/skills/af-automation-agent/sync-via-mcp.md`) then `npm run sync:knowledge-base`',
  ]
    .filter((line) => line !== '')
    .join('\n');

  writeFileSync(summaryPath, summary, 'utf-8');

  console.log('');
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Summary:  ${summaryPath}`);
  console.log('Sync complete.');
}


main().catch((err) => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
