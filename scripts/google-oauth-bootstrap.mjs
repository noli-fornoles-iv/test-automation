/**
 * One-time Google OAuth bootstrap for the google-sheets MCP server.
 *
 * The npm `mcp-google-sheets` server does not perform interactive browser
 * auth itself — it expects a token file to already exist. This script runs
 * the interactive OAuth flow once (using your Desktop OAuth Client ID/Secret),
 * opens the browser, and writes the resulting token to TOKEN_PATH.
 *
 * Usage (from repo root, after filling .cursor/mcp.env):
 *   . .\scripts\setup-mcp-env.ps1
 *   node scripts/google-oauth-bootstrap.mjs
 */
import { createServer } from 'http';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import { OAuth2Client } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const clientId = process.env.GOOGLE_SHEETS_CLIENT_ID;
const clientSecret = process.env.GOOGLE_SHEETS_CLIENT_SECRET;
const tokenPath =
  process.env.GOOGLE_SHEETS_TOKEN_PATH ||
  process.env.TOKEN_PATH ||
  `${process.env.USERPROFILE || process.env.HOME}/.mcp-google-sheets-token.json`;

if (!clientId || !clientSecret) {
  console.error('Missing GOOGLE_SHEETS_CLIENT_ID / GOOGLE_SHEETS_CLIENT_SECRET.');
  console.error('Run:  . .\\scripts\\setup-mcp-env.ps1   then retry.');
  process.exit(1);
}

const PORT = Number(process.env.OAUTH_BOOTSTRAP_PORT) || 4455;
const redirectUri = `http://localhost:${PORT}`;
const oauth2Client = new OAuth2Client({ clientId, clientSecret, redirectUri });

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, redirectUri);
    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400).end('No authorization code received.');
      return;
    }
    const { tokens } = await oauth2Client.getToken(code);
    // Write UTF-8 without BOM — mcp-google-sheets JSON.parse fails on BOM.
    writeFileSync(tokenPath, Buffer.from(JSON.stringify(tokens, null, 2), 'utf8'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h2>Google authentication complete.</h2>You can close this tab and return to Cursor.');
    console.log(`\nToken written to: ${tokenPath}`);
    console.log('Done. Restart Cursor (or reload MCP) to activate the google-sheets MCP server.');
    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500).end('Auth failed: ' + err.message);
    console.error('Auth failed:', err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('Opening browser for Google sign-in...');
  console.log('If it does not open, paste this URL manually:\n');
  console.log(authUrl + '\n');
  const opener =
    process.platform === 'win32'
      ? `start "" "${authUrl}"`
      : process.platform === 'darwin'
        ? `open "${authUrl}"`
        : `xdg-open "${authUrl}"`;
  exec(opener);
});
