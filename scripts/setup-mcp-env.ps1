# Load MCP secrets from .cursor/mcp.env into the current PowerShell session.
# Usage (from repo root):
#   . .\scripts\setup-mcp-env.ps1

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $repoRoot '.cursor\mcp.env'

if (-not (Test-Path $envFile)) {
  Write-Host "Missing $envFile" -ForegroundColor Yellow
  Write-Host "Copy .cursor/mcp.env.example to .cursor/mcp.env and fill in values."
  return
}

Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq '' -or $line.StartsWith('#')) { return }
  $eq = $line.IndexOf('=')
  if ($eq -lt 1) { return }
  $name = $line.Substring(0, $eq).Trim()
  $value = $line.Substring($eq + 1).Trim()
  if ($value -match '^%USERPROFILE%\\(.+)$') {
    $value = Join-Path $env:USERPROFILE $Matches[1]
  }
  if ($value -ne '') {
    Set-Item -Path "Env:$name" -Value $value
  }
}

# GitHub: fall back to gh CLI token when PAT not set in mcp.env
if (-not $env:GITHUB_PERSONAL_ACCESS_TOKEN -and (Get-Command gh -ErrorAction SilentlyContinue)) {
  $ghToken = gh auth token 2>$null
  if ($ghToken) {
    $env:GITHUB_PERSONAL_ACCESS_TOKEN = $ghToken.Trim()
    Write-Host 'GITHUB_PERSONAL_ACCESS_TOKEN set from gh auth token.'
  }
}

if (-not $env:GOOGLE_SHEETS_TOKEN_PATH) {
  $env:GOOGLE_SHEETS_TOKEN_PATH = Join-Path $env:USERPROFILE '.mcp-google-sheets-token.json'
}

# mcp-google-sheets reads TOKEN_PATH (not GOOGLE_SHEETS_TOKEN_PATH)
$env:TOKEN_PATH = $env:GOOGLE_SHEETS_TOKEN_PATH

# Strip UTF-8 BOM from token file if present — PowerShell Set-Content can add one,
# and mcp-google-sheets JSON.parse fails on BOM ("Unexpected token ﻿").
if (Test-Path $env:TOKEN_PATH) {
  $tokenBytes = [System.IO.File]::ReadAllBytes($env:TOKEN_PATH)
  if ($tokenBytes.Length -ge 3 -and $tokenBytes[0] -eq 0xEF -and $tokenBytes[1] -eq 0xBB -and $tokenBytes[2] -eq 0xBF) {
    [System.IO.File]::WriteAllBytes($env:TOKEN_PATH, [byte[]]$tokenBytes[3..($tokenBytes.Length - 1)])
    Write-Host 'Stripped UTF-8 BOM from Google Sheets token file.'
  }
}

# Persist GitHub token to Windows User env so Cursor sees it on restart
if ($env:GITHUB_PERSONAL_ACCESS_TOKEN) {
  [Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', $env:GITHUB_PERSONAL_ACCESS_TOKEN, 'User')
  Write-Host 'Persisted GITHUB_PERSONAL_ACCESS_TOKEN to Windows User environment.'
}

if ($env:GOOGLE_SHEETS_CLIENT_ID) {
  [Environment]::SetEnvironmentVariable('GOOGLE_SHEETS_CLIENT_ID', $env:GOOGLE_SHEETS_CLIENT_ID, 'User')
}
if ($env:GOOGLE_SHEETS_CLIENT_SECRET) {
  [Environment]::SetEnvironmentVariable('GOOGLE_SHEETS_CLIENT_SECRET', $env:GOOGLE_SHEETS_CLIENT_SECRET, 'User')
}
if ($env:GOOGLE_SHEETS_TOKEN_PATH) {
  [Environment]::SetEnvironmentVariable('GOOGLE_SHEETS_TOKEN_PATH', $env:GOOGLE_SHEETS_TOKEN_PATH, 'User')
}
if ($env:TOKEN_PATH) {
  [Environment]::SetEnvironmentVariable('TOKEN_PATH', $env:TOKEN_PATH, 'User')
}

Write-Host 'MCP environment loaded. Restart Cursor (or reload MCP) after first-time setup.'
Write-Host ''
Write-Host 'Next steps:'
Write-Host '  1. Cursor Settings - Tools and MCP - verify atlassian, github, google-sheets'
Write-Host '  2. Atlassian: click Authenticate if prompted (browser OAuth)'
Write-Host '  3. Google (first time only):  node scripts/google-oauth-bootstrap.mjs'
Write-Host '  4. AF knowledge base: agent MCP sync, then  npm run sync:knowledge-base'
