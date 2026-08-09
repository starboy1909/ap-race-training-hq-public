import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GarminMcpClient, delay } from "./garmin-mcp-client.mjs";
import { analyzeGarminDataset, publicView } from "./garmin-analysis-core.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const privateDir = path.join(repoRoot, ".garmin-private");
const publicPath = path.join(repoRoot, "src", "data", "garmin-weekly.json");
const uvxPath = process.env.GARMIN_UVX_PATH || "C:\\Users\\Amar\\AppData\\Roaming\\Python\\Python312\\Scripts\\uvx.exe";
const healthDays = Math.min(90, Math.max(28, Number(process.env.GARMIN_HEALTH_DAYS || 56)));
const maxActivityPages = Math.min(100, Math.max(1, Number(process.env.GARMIN_ACTIVITY_PAGES || 100)));

if (!existsSync(uvxPath)) throw new Error(`uvx was not found at ${uvxPath}. Run scripts/setup-garmin.ps1 first.`);

const enabledTools = [
  "get_activities", "get_stats", "get_training_readiness", "get_body_battery",
  "get_training_status", "get_training_load_trend", "get_training_load_balance",
  "get_hrv_trend", "get_vo2max_trend", "get_body_composition", "get_endurance_score",
  "get_hill_score", "get_race_predictions", "get_personal_record",
];

function isoDate(date) { return date.toISOString().slice(0, 10); }
function daysAgo(days) {
  const value = new Date();
  value.setUTCHours(0, 0, 0, 0);
  value.setUTCDate(value.getUTCDate() - days);
  return isoDate(value);
}

async function optional(client, name, args = {}) {
  try { return await client.call(name, args); }
  catch (error) { return { unavailable: error instanceof Error ? error.message : String(error) }; }
}

async function getAllActivities(client) {
  const activities = [];
  for (let page = 0; page < maxActivityPages; page += 1) {
    const result = await client.call("get_activities", { start: page * 100, limit: 100 });
    if (!result || result.unavailable) break;
    const batch = Array.isArray(result.activities) ? result.activities : [];
    activities.push(...batch);
    process.stdout.write(`Activities: ${activities.length}\r`);
    if (!result.has_more || batch.length < 100) break;
    await delay(300);
  }
  process.stdout.write(`Activities collected: ${activities.length}\n`);
  return activities;
}

async function getDailyStats(client) {
  const stats = [];
  for (let offset = healthDays - 1; offset >= 0; offset -= 1) {
    const date = daysAgo(offset);
    const result = await optional(client, "get_stats", { date });
    if (result && !result.unavailable) stats.push({ date, ...result });
    process.stdout.write(`Health history: ${healthDays - offset}/${healthDays}\r`);
    await delay(220);
  }
  process.stdout.write(`Health days collected: ${stats.length}\n`);
  return stats;
}

async function saveAnalysis(raw, archiveRaw = true) {
  const analysis = analyzeGarminDataset(raw, raw.capturedAt);
  await mkdir(privateDir, { recursive: true });
  if (archiveRaw) {
    const stamp = raw.capturedAt.replaceAll(":", "-").replace(".", "-");
    await writeFile(path.join(privateDir, `garmin-raw-${stamp}.json`), `${JSON.stringify(raw, null, 2)}\n`, "utf8");
    await writeFile(path.join(privateDir, "latest-raw.json"), `${JSON.stringify(raw, null, 2)}\n`, "utf8");
  }
  await writeFile(path.join(privateDir, "latest-analysis.json"), `${JSON.stringify(analysis, null, 2)}\n`, "utf8");
  await writeFile(publicPath, `${JSON.stringify(publicView(analysis), null, 2)}\n`, "utf8");
  console.log(`\n${analysis.decision.label}`);
  console.log(analysis.summary);
  for (const change of analysis.proposedChanges) console.log(`- [${change.status}] ${change.action}`);
  console.log(`Private raw archive: ${path.join(privateDir, "latest-raw.json")}`);
  console.log(`Public derived summary: ${publicPath}`);
}

if (process.argv.includes("--from-cache")) {
  const raw = JSON.parse(await readFile(path.join(privateDir, "latest-raw.json"), "utf8"));
  await saveAnalysis(raw, false);
  process.exit(0);
}

const client = new GarminMcpClient({ uvxPath, enabledTools });
try {
  await client.start();
  const today = isoDate(new Date());
  const loadStart = daysAgo(55);
  const hrvStart = daysAgo(29);
  const vo2Start = daysAgo(89);
  const bodyStart = daysAgo(364);
  const activities = await getAllActivities(client);
  const dailyStats = await getDailyStats(client);
  const raw = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    parameters: { healthDays, maxActivityPages },
    activities,
    dailyStats,
    bodyBattery: await optional(client, "get_body_battery", { start_date: loadStart, end_date: today }),
    trainingReadiness: await optional(client, "get_training_readiness", { date: today }),
    trainingStatus: await optional(client, "get_training_status", { date: today }),
    trainingLoadTrend: await optional(client, "get_training_load_trend", { start_date: loadStart, end_date: today }),
    trainingLoadBalance: await optional(client, "get_training_load_balance", { date: today }),
    hrvTrend: await optional(client, "get_hrv_trend", { start_date: hrvStart, end_date: today }),
    vo2maxTrend: await optional(client, "get_vo2max_trend", { start_date: vo2Start, end_date: today }),
    bodyComposition: await optional(client, "get_body_composition", { start_date: bodyStart, end_date: today }),
    enduranceScore: await optional(client, "get_endurance_score", { start_date: vo2Start, end_date: today }),
    hillScore: await optional(client, "get_hill_score", { start_date: vo2Start, end_date: today }),
    racePredictions: await optional(client, "get_race_predictions"),
    personalRecords: await optional(client, "get_personal_record"),
  };
  await saveAnalysis(raw);
} finally {
  await client.stop();
}
