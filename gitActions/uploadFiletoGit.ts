import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import fetch from "node-fetch";

function loadGitConfig(): Record<string, string> {
  const configPath = path.resolve("gitActions", "gitConfig.conf");
  if (!fs.existsSync(configPath))
    throw new Error(`❌ Config file not found: ${configPath}`);

  const content = fs.readFileSync(configPath, "utf-8");
  const config: Record<string, string> = {};

  const regex = /^\s*([\w-]+)\s*=\s*["']?([^"'\n]+)["']?\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const [, key, value] = match;
    config[key.trim()] = value.trim();
  }

  return config;
}

function getFolderSize(dir: string): number {
  return fs.readdirSync(dir).reduce((total, item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      return total + getFolderSize(fullPath);
    }
    return total + stats.size;
  }, 0);
}

const TEXT_FILE_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".md",
  ".json",
  ".txt",
  ".js",
  ".css",
  ".xml",
  ".svg",
  ".csv",
  ".log",
]);

const SECRET_PATTERNS: { pattern: RegExp; replacement: string }[] = [
  {
    pattern: /sk\.ey[A-Za-z0-9._-]+/g,
    replacement: "[REDACTED-MAPBOX-SECRET]",
  },
  {
    pattern: /pk\.ey[A-Za-z0-9._-]+/g,
    replacement: "[REDACTED-MAPBOX-PUBLIC]",
  },
  {
    pattern: /access_token=sk\.[^&\s"'<>]+/gi,
    replacement: "access_token=[REDACTED-MAPBOX-SECRET]",
  },
  {
    pattern: /access_token=pk\.[^&\s"'<>]+/gi,
    replacement: "access_token=[REDACTED-MAPBOX-PUBLIC]",
  },
  {
    pattern: /github_pat_[A-Za-z0-9_]{20,}/g,
    replacement: "[REDACTED-GITHUB-PAT]",
  },
  {
    pattern: /ghp_[A-Za-z0-9]{20,}/g,
    replacement: "[REDACTED-GITHUB-PAT]",
  },
  {
    pattern: /gho_[A-Za-z0-9]{20,}/g,
    replacement: "[REDACTED-GITHUB-OAUTH]",
  },
  {
    pattern: /x-access-token:[A-Za-z0-9_]+@/g,
    replacement: "x-access-token:[REDACTED]@",
  },
];

const UPLOAD_EXCLUDED_DIRS = new Set(["trace"]);
const UPLOAD_EXCLUDED_FILE_EXTENSIONS = new Set([".zip", ".har"]);

function isLikelyTextFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_FILE_EXTENSIONS.has(ext)) return true;
  if (UPLOAD_EXCLUDED_FILE_EXTENSIONS.has(ext)) return false;

  const fd = fs.openSync(filePath, "r");
  try {
    const buffer = Buffer.alloc(4096);
    const bytesRead = fs.readSync(fd, buffer, 0, 4096, 0);
    return !buffer.subarray(0, bytesRead).includes(0);
  } finally {
    fs.closeSync(fd);
  }
}

function sanitizeContent(content: string): { content: string; redactionCount: number } {
  let sanitized = content;
  let redactionCount = 0;

  for (const { pattern, replacement } of SECRET_PATTERNS) {
    const matches = sanitized.match(pattern);
    if (matches) {
      redactionCount += matches.length;
      sanitized = sanitized.replace(pattern, replacement);
    }
  }

  return { content: sanitized, redactionCount };
}

function copyFileForUpload(srcPath: string, destPath: string): number {
  if (!isLikelyTextFile(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    return 0;
  }

  const original = fs.readFileSync(srcPath, "utf-8");
  const { content, redactionCount } = sanitizeContent(original);
  fs.writeFileSync(destPath, content, "utf-8");
  return redactionCount;
}

function copyFolderForUpload(src: string, dest: string): number {
  if (!fs.existsSync(src))
    throw new Error(`❌ Source folder not found: ${src}`);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  let totalRedactions = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && UPLOAD_EXCLUDED_DIRS.has(entry.name)) {
      console.log(`🔒 Skipping sensitive folder: ${entry.name}/`);
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      totalRedactions += copyFolderForUpload(srcPath, destPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (UPLOAD_EXCLUDED_FILE_EXTENSIONS.has(ext)) {
        console.log(`🔒 Skipping sensitive file: ${entry.name}`);
        continue;
      }
      totalRedactions += copyFileForUpload(srcPath, destPath);
    }
  }

  return totalRedactions;
}

function sanitizeFolderInPlace(dir: string): number {
  let totalRedactions = 0;

  for (const filePath of getAllFiles(dir)) {
    const ext = path.extname(filePath).toLowerCase();
    if (UPLOAD_EXCLUDED_FILE_EXTENSIONS.has(ext)) {
      fs.rmSync(filePath, { force: true });
      console.log(`🔒 Removed sensitive file: ${path.relative(dir, filePath)}`);
      continue;
    }

    if (!isLikelyTextFile(filePath)) continue;

    const original = fs.readFileSync(filePath, "utf-8");
    const { content, redactionCount } = sanitizeContent(original);
    if (redactionCount > 0) {
      fs.writeFileSync(filePath, content, "utf-8");
      totalRedactions += redactionCount;
    }
  }

  return totalRedactions;
}

function copyFolderRecursive(src: string, dest: string): void {
  copyFolderForUpload(src, dest);
}

function createTimestampedReportFolder(projectName: string): string {
  const baseDir = path.resolve(`reports/validation/${projectName}`);
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const now = new Date();
  const estTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );

  const month = String(estTime.getMonth() + 1).padStart(2, "0");
  const day = String(estTime.getDate()).padStart(2, "0");
  const year = estTime.getFullYear();
  let hours = estTime.getHours();
  const minutes = String(estTime.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const hourStr = String(hours).padStart(2, "0");

  const timestamp = `${month}-${day}-${year}-${hourStr}-${minutes}-${ampm}-EST`;
  const folderPath = path.join(baseDir, timestamp);
  fs.mkdirSync(folderPath, { recursive: true });

  console.log(`📂 Created new report folder: ${folderPath}`);
  return folderPath;
}

function getAllFiles(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((item) => {
    const fullPath = path.join(dir, item);
    return fs.statSync(fullPath).isDirectory()
      ? getAllFiles(fullPath)
      : [fullPath];
  });
}

function createUploadBranchName(): string {
  const now = new Date();
  const estTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const stamp = [
    estTime.getFullYear(),
    String(estTime.getMonth() + 1).padStart(2, "0"),
    String(estTime.getDate()).padStart(2, "0"),
    String(estTime.getHours()).padStart(2, "0"),
    String(estTime.getMinutes()).padStart(2, "0"),
    String(estTime.getSeconds()).padStart(2, "0"),
  ].join("-");
  return `auto-report-upload/${stamp}`;
}

async function createAndMergePullRequest(
  owner: string,
  repo: string,
  token: string,
  head: string,
  base: string,
  title: string,
): Promise<void> {
  const createRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        title,
        head,
        base,
        body: "Automated test report upload",
      }),
    },
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create PR: ${createRes.status} ${err}`);
  }

  const pr = (await createRes.json()) as { number: number; html_url: string };
  console.log(`📬 Created PR #${pr.number}: ${pr.html_url}`);

  const mergeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/merge`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        commit_title: title,
        merge_method: "squash",
      }),
    },
  );

  if (!mergeRes.ok) {
    const err = await mergeRes.text();
    throw new Error(
      `Failed to merge PR #${pr.number}: ${mergeRes.status} ${err}`,
    );
  }

  console.log(`✅ PR #${pr.number} merged into ${base}`);
}

async function uploadAllAtOnce(
  localFolder: string,
  token: string,
  owner: string,
  repo: string,
  branch: string,
  projectFolder: string,
  uploadMode: "direct" | "pull-request" = "direct",
  pushBranch?: string,
): Promise<void> {
  console.log("🚀 Preparing to upload all files in one commit...");

  const tmpRepo = path.resolve(".tmp_upload_repo");
  if (fs.existsSync(tmpRepo))
    fs.rmSync(tmpRepo, { recursive: true, force: true });

  const repoUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
  const commitMessage = "📦 Upload test report [auto]";
  const targetPushBranch =
    uploadMode === "pull-request"
      ? createUploadBranchName()
      : (pushBranch?.trim() || branch);

  execFileSync(
    "git",
    ["clone", "--depth", "1", "--branch", branch, repoUrl, tmpRepo],
    { stdio: "inherit" },
  );

  if (uploadMode === "pull-request") {
    execFileSync("git", ["checkout", "-b", targetPushBranch], {
      cwd: tmpRepo,
      stdio: "inherit",
    });
  }

  const destPath = path.join(tmpRepo, projectFolder);
  fs.mkdirSync(destPath, { recursive: true });
  copyFolderRecursive(localFolder, destPath);

  execFileSync("git", ["config", "user.email", "actions@github.com"], {
    cwd: tmpRepo,
  });
  execFileSync("git", ["config", "user.name", "GitHub Actions Bot"], {
    cwd: tmpRepo,
  });

  execFileSync("git", ["add", "."], { cwd: tmpRepo, stdio: "inherit" });

  let hasCommit = true;
  try {
    execFileSync("git", ["commit", "-m", commitMessage], {
      cwd: tmpRepo,
      stdio: "inherit",
    });
  } catch {
    hasCommit = false;
    console.log("⚠️ Nothing to commit");
  }

  if (!hasCommit) {
    fs.rmSync(tmpRepo, { recursive: true, force: true });
    return;
  }

  if (uploadMode === "pull-request") {
    console.log(`📤 Pushing feature branch: ${targetPushBranch}`);
    execFileSync("git", ["push", "origin", targetPushBranch], {
      cwd: tmpRepo,
      stdio: "inherit",
    });
    await createAndMergePullRequest(
      owner,
      repo,
      token,
      targetPushBranch,
      branch,
      commitMessage,
    );
  } else {
    execFileSync("git", ["push", "origin", targetPushBranch], {
      cwd: tmpRepo,
      stdio: "inherit",
    });
  }

  fs.rmSync(tmpRepo, { recursive: true, force: true });
  console.log("✅ All files committed and pushed successfully!");
}

async function waitForReportToBeLive(
  url: string,
  timeoutMs = 300000,
  intervalMs = 10000,
): Promise<void> {
  console.log("⏳ Waiting for GitHub Pages to finish building...");
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        console.log(`✅ GitHub Pages is live! (${res.status})`);
        return;
      }
      console.log(`🔄 Still building...`);
    } catch {
      console.log("🔄 Still building (connection failed)...");
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  console.warn(
    "⚠️ Timeout waiting for GitHub Pages. It might still be building.",
  );
}

async function getRecentWorkflowRuns(
  owner: string,
  repo: string,
  token: string,
  branch: string,
  perPage = 5,
) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs?branch=${branch}&per_page=${perPage}`;
  const res = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch workflow runs: ${res.status}`);
  const data = (await res.json()) as {
    workflow_runs?: any[];
  };

  return data.workflow_runs ?? [];
}

async function getWorkflowJobs(
  owner: string,
  repo: string,
  runId: string,
  token: string,
) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`;
  const res = await fetch(apiUrl, {
    headers: { Authorization: `token ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  const data = (await res.json()) as {
    jobs?: any[];
  };

  return data.jobs ?? [];
}

async function monitorGitHubActionsProgress(
  owner: string,
  repo: string,
  branch: string,
  token: string,
) {
  console.log("\n🧭 Checking GitHub Actions workflow status...");

  const runs: any[] = await getRecentWorkflowRuns(owner, repo, token, branch);
  const targetRun =
    runs.find((r) => r.status === "in_progress" || r.status === "queued") ||
    runs[0];

  if (!targetRun) {
    console.warn("⚠️ No workflow run detected — continuing anyway.");
    return;
  }

  console.log(
    `🚀 Tracking workflow: ${targetRun.name} (#${targetRun.run_number})`,
  );
  console.log(`🔗 ${targetRun.html_url}`);

  let completed = false;
  while (!completed) {
    const jobs: any[] = await getWorkflowJobs(owner, repo, targetRun.id, token);
    console.log(`📊 Workflow: ${targetRun.name} (#${targetRun.run_number})`);
    console.log("=========================================================");
    for (const job of jobs) {
      const icon =
        job.status === "completed"
          ? job.conclusion === "success"
            ? "🟢"
            : "🔴"
          : "🔄";
      console.log(
        `${icon} ${job.name}: ${job.status}${
          job.conclusion ? ` (${job.conclusion})` : ""
        }`,
      );
    }
    console.log("=========================================================");

    completed = jobs.every((job: any) => job.status === "completed");
    if (!completed) await new Promise((r) => setTimeout(r, 7000));
  }

  console.log("✅ Workflow completed!");
}

async function main(): Promise<void> {
  try {
    const config = loadGitConfig();
    const {
      PROJECT_NAME,
      GIT_ACCESS_TOKEN,
      GITHUB_OWNER,
      GITHUB_REPO,
      GITHUB_BRANCH,
      GITHUB_PUSH_BRANCH,
      UPLOAD_MODE,
      UPLOAD_PATH,
      UPLOAD_SOURCE,
    } = config;

    const uploadMode =
      UPLOAD_MODE?.toLowerCase() === "pull-request"
        ? "pull-request"
        : "direct";

    const timestampFolder = createTimestampedReportFolder(PROJECT_NAME);
    const uploadSourcePath = path.resolve(UPLOAD_SOURCE);

    console.log(`📦 Copying source files...`);
    const redactions = copyFolderForUpload(uploadSourcePath, timestampFolder);
    if (redactions > 0) {
      console.log(`🔒 Redacted ${redactions} secret value(s) from report files`);
    }

    // ✅ NEW: SIZE CHECK LOGIC
    const MAX_SIZE_MB = 25;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const folderSize = getFolderSize(timestampFolder);
    console.log(`📦 Folder size: ${(folderSize / 1024 / 1024).toFixed(2)} MB`);

    let uploadFolder = timestampFolder;

    if (folderSize > MAX_SIZE_BYTES) {
      console.warn(`⚠️ Folder too large. Uploading only index.html...`);

      const tempDir = path.join(timestampFolder, "__index_only__");
      fs.mkdirSync(tempDir, { recursive: true });

      const indexFile = path.join(timestampFolder, "index.html");

      if (!fs.existsSync(indexFile)) {
        throw new Error("❌ index.html not found");
      }

      copyFileForUpload(indexFile, path.join(tempDir, "index.html"));
      uploadFolder = tempDir;
    }

    const finalRedactions = sanitizeFolderInPlace(uploadFolder);
    if (finalRedactions > 0) {
      console.log(
        `🔒 Final scrub removed ${finalRedactions} additional secret value(s)`,
      );
    }

    const folderName = path.basename(timestampFolder);
    const projectFolder = path
      .join(PROJECT_NAME, UPLOAD_PATH, folderName)
      .replace(/\\/g, "/");

    if (uploadMode === "pull-request") {
      console.log(
        "🔀 Upload mode: pull-request (bypasses direct push restrictions on protected branches)",
      );
    } else if (GITHUB_PUSH_BRANCH) {
      console.log(
        `🔀 Upload mode: direct push to branch "${GITHUB_PUSH_BRANCH}"`,
      );
    }

    await uploadAllAtOnce(
      uploadFolder,
      GIT_ACCESS_TOKEN,
      GITHUB_OWNER,
      GITHUB_REPO,
      GITHUB_BRANCH,
      projectFolder,
      uploadMode,
      GITHUB_PUSH_BRANCH,
    );

    const reportUrl = `https://${GITHUB_OWNER}.github.io/${GITHUB_REPO}/${projectFolder}/index.html`;

    await waitForReportToBeLive(reportUrl);

    console.log(`🔗 Report: ${reportUrl}`);
  } catch (err: unknown) {
    console.error(`❌ Upload failed: ${(err as Error).message}`);
  }
}

main();
