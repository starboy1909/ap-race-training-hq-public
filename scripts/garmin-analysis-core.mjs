const number = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;

export function average(values) {
  const clean = values.map(number).filter((value) => value !== null);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : null;
}

function round(value, digits = 1) {
  return value === null ? null : Number(value.toFixed(digits));
}

function pctChange(current, baseline) {
  if (current === null || baseline === null || baseline === 0) return null;
  return ((current - baseline) / baseline) * 100;
}

function metric(label, value, trend, flag = "neutral") {
  return { label, value, trend, flag };
}

function daysBetween(start, end) {
  return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
}

function activityWeekKey(activity) {
  const date = new Date(activity.start_time);
  if (Number.isNaN(date.getTime())) return null;
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day);
  return date.toISOString().slice(0, 10);
}

function summarizeActivities(activities) {
  const weeks = new Map();
  const types = new Map();
  for (const activity of activities) {
    const week = activityWeekKey(activity);
    if (week) {
      const current = weeks.get(week) || { seconds: 0, distance: 0, count: 0 };
      current.seconds += number(activity.duration_seconds) || 0;
      current.distance += number(activity.distance_meters) || 0;
      current.count += 1;
      weeks.set(week, current);
    }
    const type = String(activity.type || "other").replaceAll("_", " ");
    types.set(type, (types.get(type) || 0) + 1);
  }
  const orderedWeeks = [...weeks.entries()].sort(([a], [b]) => a.localeCompare(b));
  const completedWeeks = orderedWeeks.slice(-5, -1).map(([, value]) => value);
  const latest = completedWeeks.at(-1) || null;
  const prior = completedWeeks.length > 1 ? {
    seconds: average(completedWeeks.slice(0, -1).map((item) => item.seconds)),
    distance: average(completedWeeks.slice(0, -1).map((item) => item.distance)),
  } : null;
  return {
    latest,
    prior,
    types: [...types.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
  };
}

function latestTrendEntry(value) {
  return value?.trend?.length ? value.trend.at(-1) : null;
}

export function analyzeGarminDataset(raw, generatedAt = new Date().toISOString()) {
  const stats = Array.isArray(raw.dailyStats) ? raw.dailyStats.filter((item) => item && typeof item === "object") : [];
  const activities = Array.isArray(raw.activities) ? raw.activities : [];
  const last7 = stats.slice(-7);
  const prior21 = stats.slice(-28, -7);
  const sleep7 = average(last7.map((item) => number(item.sleeping_seconds) === null ? null : item.sleeping_seconds / 3600));
  const sleepPrior = average(prior21.map((item) => number(item.sleeping_seconds) === null ? null : item.sleeping_seconds / 3600));
  const rhr7 = average(last7.map((item) => item.resting_heart_rate_bpm));
  const rhrPrior = average(prior21.map((item) => item.resting_heart_rate_bpm));
  const stress7 = average(last7.map((item) => item.avg_stress_level));
  const stressPrior = average(prior21.map((item) => item.avg_stress_level));
  const battery7 = average(last7.map((item) => item.body_battery_highest ?? item.body_battery_current));
  const batteryPrior = average(prior21.map((item) => item.body_battery_highest ?? item.body_battery_current));
  const hrvLatest = latestTrendEntry(raw.hrvTrend);
  const loadLatest = latestTrendEntry(raw.trainingLoadTrend);
  const vo2Latest = number(raw.vo2maxTrend?.latest_vo2_max ?? loadLatest?.vo2_max);
  const vo2Change = number(raw.vo2maxTrend?.change);
  const enduranceScore = number(raw.enduranceScore?.current_score);
  const trainingStatus = raw.trainingStatus?.training_status_feedback ?? raw.trainingStatus?.training_status ?? loadLatest?.training_status;
  const readiness = Array.isArray(raw.trainingReadiness)
    ? (raw.trainingReadiness.find((item) => item?.context === "AFTER_WAKEUP_RESET") || raw.trainingReadiness[0] || {})
    : (raw.trainingReadiness && typeof raw.trainingReadiness === "object" ? raw.trainingReadiness : {});
  const activity = summarizeActivities(activities);

  const sleepDelta = pctChange(sleep7, sleepPrior);
  const rhrDelta = rhr7 === null || rhrPrior === null ? null : rhr7 - rhrPrior;
  const stressDelta = stress7 === null || stressPrior === null ? null : stress7 - stressPrior;
  const batteryDelta = battery7 === null || batteryPrior === null ? null : battery7 - batteryPrior;
  const volumeDelta = pctChange(activity.latest?.seconds ?? null, activity.prior?.seconds ?? null);

  let risk = 0;
  const reasons = [];
  const readinessScore = number(readiness.readiness_score ?? readiness.score ?? readiness.training_readiness_score);
  if (readinessScore !== null && readinessScore < 50) { risk += 3; reasons.push("low Garmin Training Readiness"); }
  else if (readinessScore !== null && readinessScore < 70) { risk += 1; reasons.push("moderate Garmin Training Readiness"); }
  if (sleep7 !== null && sleep7 < 6) { risk += 3; reasons.push("seven-day sleep below 6 hours"); }
  else if (sleep7 !== null && sleep7 < 7) { risk += 1; reasons.push("seven-day sleep below 7 hours"); }
  if (battery7 !== null && battery7 < 35) { risk += 3; reasons.push("low Body Battery trend"); }
  else if (battery7 !== null && battery7 < 55) { risk += 1; reasons.push("moderate Body Battery trend"); }
  if (rhrDelta !== null && rhrDelta >= 5) { risk += 2; reasons.push("resting heart rate elevated from baseline"); }
  if (stress7 !== null && stress7 > 55) { risk += 2; reasons.push("high recent stress"); }
  if (hrvLatest && /low|unbalanced|poor/i.test(String(hrvLatest.status || hrvLatest.feedback || ""))) {
    risk += 2;
    reasons.push("HRV status is not balanced");
  }
  if (loadLatest && number(loadLatest.acwr) !== null && loadLatest.acwr > 1.5) {
    risk += 3;
    reasons.push("acute-to-chronic load ratio is high");
  }
  if (volumeDelta !== null && volumeDelta > 20) { risk += 2; reasons.push("completed weekly duration rose more than 20%"); }

  const tone = risk >= 5 ? "red" : risk >= 2 ? "amber" : "green";
  const label = tone === "red" ? "GARMIN · RECOVER" : tone === "amber" ? "GARMIN · MODIFY" : "GARMIN · PROCEED";
  const proposedChanges = [];
  if (tone === "red") {
    proposedChanges.push({
      scope: "Next 7 days",
      action: "Reduce planned volume by 20–30%, remove RPE 8–10 work, and replace the next quality session with 30–45 minutes of easy Zone 1–2 movement or full rest.",
      rationale: reasons.join("; ") || "Multiple recovery signals are adverse.",
      status: "AUTO-SAFE",
    });
  } else if (tone === "amber") {
    proposedChanges.push({
      scope: "Next 7 days",
      action: "Reduce planned volume by 10–15%, retain at most one quality exposure, and cap all other work at RPE 6.",
      rationale: reasons.join("; ") || "Recovery is mixed rather than clearly positive.",
      status: "AUTO-SAFE",
    });
  } else {
    proposedChanges.push({
      scope: "Next 7 days",
      action: "Keep the current prescription. Do not add volume automatically; progress only through the existing injury and technique gates.",
      rationale: "The available recovery and load signals do not require a reduction.",
      status: "KEEP",
    });
  }

  if (sleep7 !== null && sleep7 < 7) {
    proposedChanges.push({
      scope: "Recovery support",
      action: "Create a 30-minute longer sleep opportunity before quality sessions; if morning readiness is below 50 or Body Battery is below 35, use the recovery swap instead.",
      rationale: `Seven-day sleep averages ${round(sleep7)} hours despite otherwise positive recovery signals.`,
      status: "SUPPORT",
    });
  }

  const balance = raw.trainingLoadBalance && typeof raw.trainingLoadBalance === "object" ? raw.trainingLoadBalance : {};
  for (const [key, labelName] of [["aerobic_low", "low aerobic"], ["aerobic_high", "high aerobic"], ["anaerobic", "anaerobic"]]) {
    if (balance[key]?.status === "below") {
      proposedChanges.push({
        scope: "Training mix",
        action: `Review whether one existing session should be reallocated toward ${labelName} work without increasing total weekly load.`,
        rationale: `Garmin Load Focus reports ${labelName} below its personal target range.`,
        status: "REVIEW",
      });
    }
  }

  const firstActivity = activities
    .map((item) => item.start_time)
    .filter(Boolean)
    .sort()[0] || null;
  const metrics = [
    metric("7-day sleep", sleep7 === null ? "Not available" : `${round(sleep7)} h`, sleepDelta === null ? "No baseline" : `${sleepDelta >= 0 ? "+" : ""}${round(sleepDelta)}% vs prior`, sleep7 !== null && sleep7 < 7 ? "watch" : "good"),
    metric("Body Battery", battery7 === null ? "Not available" : `${round(battery7)}`, batteryDelta === null ? "No baseline" : `${batteryDelta >= 0 ? "+" : ""}${round(batteryDelta)} vs prior`, battery7 !== null && battery7 < 55 ? "watch" : "good"),
    metric("Resting HR", rhr7 === null ? "Not available" : `${round(rhr7)} bpm`, rhrDelta === null ? "No baseline" : `${rhrDelta >= 0 ? "+" : ""}${round(rhrDelta)} bpm vs prior`, rhrDelta !== null && rhrDelta >= 5 ? "watch" : "good"),
    metric("Stress", stress7 === null ? "Not available" : `${round(stress7)}`, stressDelta === null ? "No baseline" : `${stressDelta >= 0 ? "+" : ""}${round(stressDelta)} vs prior`, stress7 !== null && stress7 > 55 ? "watch" : "good"),
    metric("HRV", hrvLatest?.weekly_avg_hrv_ms ? `${hrvLatest.weekly_avg_hrv_ms} ms` : (hrvLatest?.status || "Not available"), hrvLatest?.status || "Trend unavailable", /low|unbalanced|poor/i.test(String(hrvLatest?.status || "")) ? "watch" : "good"),
    metric("Load ratio", loadLatest?.acwr ? `${loadLatest.acwr}` : "Not available", loadLatest?.acwr_status || loadLatest?.training_status || "Trend unavailable", loadLatest?.acwr > 1.5 ? "watch" : "good"),
    metric("Readiness", readinessScore === null ? "Not available" : `${round(readinessScore, 0)}`, readiness.level || readiness.feedback || "Context unavailable", readinessScore !== null && readinessScore < 70 ? "watch" : "good"),
    metric("Training status", trainingStatus ? String(trainingStatus).replaceAll("_", " ") : "Not available", raw.trainingLoadBalance?.feedback ? `Load focus ${String(raw.trainingLoadBalance.feedback).toLowerCase()}` : "Load focus unavailable", "good"),
    metric("VO₂ max", vo2Latest === null ? "Not available" : `${round(vo2Latest)}`, vo2Change === null ? "Long trend unavailable" : `${vo2Change >= 0 ? "+" : ""}${round(vo2Change)} over review range`, vo2Change !== null && vo2Change < -1 ? "watch" : "good"),
    metric("Endurance score", enduranceScore === null ? "Not available" : `${round(enduranceScore, 0)}`, raw.enduranceScore?.classification ? String(raw.enduranceScore.classification) : "Classification unavailable", "good"),
    metric("Last full week", activity.latest ? `${round(activity.latest.seconds / 3600)} h` : "Not available", volumeDelta === null ? "No prior baseline" : `${volumeDelta >= 0 ? "+" : ""}${round(volumeDelta)}% duration vs prior weeks`, volumeDelta !== null && volumeDelta > 20 ? "watch" : "good"),
  ];

  const trainingMix = activity.types.map(([type, count]) => ({ type, count }));
  const summary = `${label.replace("GARMIN · ", "")} for the next training week. ` +
    (reasons.length ? `Key signals: ${reasons.join(", ")}.` : "Recovery, health and training-load trends are within the available personal baselines.");

  return {
    status: "ready",
    generatedAt,
    reviewWindow: stats.length ? `${stats[0].date || "unknown"} to ${stats.at(-1).date || "unknown"}` : null,
    decision: { tone, label },
    summary,
    coverage: {
      healthDays: stats.length,
      activities: activities.length,
      activityHistoryStart: firstActivity ? firstActivity.slice(0, 10) : null,
    },
    metrics,
    trainingMix,
    proposedChanges,
    safeguards: [
      "Pain at or above 4/10 always overrides Garmin and stops quality training.",
      "Raw daily health records, activity names and locations remain private on this computer.",
      "Garmin signals may reduce load automatically; increases and race-plan changes require review.",
    ],
    privateAnalysis: {
      riskScore: risk,
      reasons,
      latestCompletedWeek: activity.latest,
      priorCompletedWeeksAverage: activity.prior,
      daysOfActivityHistory: firstActivity ? daysBetween(firstActivity, generatedAt) : null,
    },
  };
}

export function publicView(analysis) {
  const { privateAnalysis: _private, ...safe } = analysis;
  return safe;
}
