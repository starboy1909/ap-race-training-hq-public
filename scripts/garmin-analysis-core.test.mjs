import assert from "node:assert/strict";
import test from "node:test";
import { analyzeGarminDataset, publicView } from "./garmin-analysis-core.mjs";

function stats(days, overrides = {}) {
  return Array.from({ length: days }, (_, index) => ({
    date: `2026-07-${String(index + 1).padStart(2, "0")}`,
    sleeping_seconds: 8 * 3600,
    resting_heart_rate_bpm: 48,
    avg_stress_level: 28,
    body_battery_highest: 78,
    ...overrides,
  }));
}

test("keeps the plan when recovery signals are positive", () => {
  const result = analyzeGarminDataset({ dailyStats: stats(28), activities: [] }, "2026-08-09T00:00:00Z");
  assert.equal(result.decision.tone, "green");
  assert.equal(result.proposedChanges[0].status, "KEEP");
});

test("reduces load when multiple recovery signals are adverse", () => {
  const result = analyzeGarminDataset({
    dailyStats: stats(28, { sleeping_seconds: 5.5 * 3600, resting_heart_rate_bpm: 60, avg_stress_level: 65, body_battery_highest: 25 }),
    activities: [],
    hrvTrend: { trend: [{ status: "LOW" }] },
    trainingLoadTrend: { trend: [{ acwr: 1.7 }] },
  }, "2026-08-09T00:00:00Z");
  assert.equal(result.decision.tone, "red");
  assert.match(result.proposedChanges[0].action, /Reduce planned volume/);
});

test("uses the after-wakeup readiness snapshot when Garmin returns a list", () => {
  const result = analyzeGarminDataset({
    dailyStats: stats(28, { sleeping_seconds: 6.7 * 3600 }),
    activities: [],
    trainingReadiness: [
      { context: "UPDATE_REALTIME_VARIABLES", score: 46 },
      { context: "AFTER_WAKEUP_RESET", score: 55, level: "MODERATE" },
    ],
  }, "2026-08-09T00:00:00Z");
  assert.equal(result.decision.tone, "amber");
  assert.equal(result.metrics.find((item) => item.label === "Readiness")?.value, "55");
});

test("public output excludes private analysis fields", () => {
  const result = analyzeGarminDataset({ dailyStats: stats(28), activities: [] }, "2026-08-09T00:00:00Z");
  assert.equal("privateAnalysis" in publicView(result), false);
});
