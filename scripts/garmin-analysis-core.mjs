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

function formatPace(secondsPerKm) {
  if (secondsPerKm === null || !Number.isFinite(secondsPerKm)) return "Not available";
  const totalSeconds = Math.round(secondsPerKm);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}/km`;
}

function isRun(activity) {
  return ["running", "treadmill_running"].includes(String(activity?.type || "").toLowerCase());
}

function isTreadmillRun(activity) {
  return String(activity?.type || "").toLowerCase() === "treadmill_running";
}

function safeRun(activity) {
  if (!activity) return null;
  const distanceKm = (number(activity.distance_meters) || 0) / 1000;
  const durationSeconds = number(activity.duration_seconds) || 0;
  return {
    distanceKm: round(distanceKm, 1),
    durationMinutes: round(durationSeconds / 60, 0),
    pace: distanceKm > 0 ? formatPace(durationSeconds / distanceKm) : "Not available",
    averageHeartRate: number(activity.avg_hr_bpm),
    maxHeartRate: number(activity.max_hr_bpm),
    elevationGainMeters: round(number(activity.elevation_gain_meters) || 0, 0),
  };
}


function formatDuration(seconds) {
  const total = Math.max(0, Math.round(number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}

const historicalRoadRaceWindows = [
  { name: "JPMorganChase Corporate Challenge 2024", date: "2024-11-21", distanceKm: 5.6, toleranceKm: 0.7 },
  { name: "JPMorganChase Corporate Challenge 2025", date: "2025-10-30", distanceKm: 5.6, toleranceKm: 0.7 },
  { name: "ASICS Hong Kong Half-Marathon Championships 2025", date: "2025-12-21", distanceKm: 21.0975, toleranceKm: 1.0 },
];

function calendarDayGap(a, b) {
  const left = new Date(`${a}T00:00:00Z`).getTime();
  const right = new Date(`${b}T00:00:00Z`).getTime();
  return Math.abs(Math.round((left - right) / 86400000));
}

function summarizeHistoricalRoadRaces(activities) {
  const outdoorRuns = activities.filter(isRun).filter((item) => !isTreadmillRun(item));
  return historicalRoadRaceWindows.map((race) => {
    const candidates = outdoorRuns
      .map((activity) => {
        const activityDate = String(activity.start_time || "").slice(0, 10);
        const distanceKm = (number(activity.distance_meters) || 0) / 1000;
        const dateGap = activityDate ? calendarDayGap(activityDate, race.date) : 99;
        const distanceGap = Math.abs(distanceKm - race.distanceKm);
        return { activity, activityDate, distanceKm, dateGap, distanceGap };
      })
      .filter((item) => item.dateGap <= 1 && item.distanceGap <= race.toleranceKm)
      .sort((a, b) => (a.dateGap * 10 + a.distanceGap) - (b.dateGap * 10 + b.distanceGap));
    const match = candidates[0];
    if (!match) {
      return {
        name: race.name,
        eventDate: race.date,
        finishTime: null,
        distanceKm: race.distanceKm,
        pace: null,
        confidence: "Pending local Garmin match",
        matchBasis: "Exact event date plus distance; activity title ignored",
      };
    }
    const durationSeconds = number(match.activity.duration_seconds) || 0;
    return {
      name: race.name,
      eventDate: race.date,
      finishTime: formatDuration(durationSeconds),
      distanceKm: round(match.distanceKm, 2),
      pace: match.distanceKm > 0 ? formatPace(durationSeconds / match.distanceKm) : null,
      confidence: match.dateGap === 0 ? "High" : "Review",
      matchBasis: "Event date plus outdoor distance; Garmin activity title ignored",
    };
  });
}

function summarizeRecentSessions(activities, generatedAt) {
  const end = new Date(generatedAt).getTime();
  const start = end - 7 * 86400000;
  return activities
    .filter((activity) => {
      const time = new Date(activity.start_time).getTime();
      return Number.isFinite(time) && time >= start && time <= end;
    })
    .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)))
    .map((activity) => {
      const type = String(activity.type || "other").replaceAll("_", " ");
      const distanceKm = (number(activity.distance_meters) || 0) / 1000;
      return {
        date: String(activity.start_time || "").slice(0, 10),
        modality: isRun(activity) ? (isTreadmillRun(activity) ? "Treadmill run" : "Outdoor run") : type,
        distanceKm: distanceKm > 0 ? round(distanceKm, 2) : null,
        durationMinutes: round((number(activity.duration_seconds) || 0) / 60, 0),
        averageHeartRate: number(activity.avg_hr_bpm),
      };
    });
}

function summarizeRunning(activities, generatedAt, raw) {
  const generatedMs = new Date(generatedAt).getTime();
  const recentStart = generatedMs - 28 * 86400000;
  const runs = activities.filter(isRun).filter((item) => !Number.isNaN(new Date(item.start_time).getTime()));
  const recent = runs.filter((item) => new Date(item.start_time).getTime() >= recentStart);
  const outdoor = recent.filter((item) => !isTreadmillRun(item));
  const treadmill = recent.filter(isTreadmillRun);
  const distance = (items) => items.reduce((sum, item) => sum + (number(item.distance_meters) || 0), 0) / 1000;
  const totalRecentKm = distance(recent);
  const outdoorKm = distance(outdoor);
  const treadmillKm = distance(treadmill);

  const latestOutdoor = [...outdoor].sort((a, b) => String(b.start_time).localeCompare(String(a.start_time)))[0] || null;
  const latestOutdoorDistance = (number(latestOutdoor?.distance_meters) || 0) / 1000;
  const comparableTreadmill = [...treadmill]
    .filter((item) => {
      const km = (number(item.distance_meters) || 0) / 1000;
      return latestOutdoorDistance > 0 && km >= latestOutdoorDistance * 0.7 && km <= latestOutdoorDistance * 1.3;
    })
    .sort((a, b) => String(b.start_time).localeCompare(String(a.start_time)))[0] || null;

  const weekly = new Map();
  for (const item of runs) {
    const week = activityWeekKey(item);
    if (!week) continue;
    const current = weekly.get(week) || { week, distanceKm: 0, durationHours: 0, outdoorKm: 0, treadmillKm: 0, runs: 0 };
    const km = (number(item.distance_meters) || 0) / 1000;
    current.distanceKm += km;
    current.durationHours += (number(item.duration_seconds) || 0) / 3600;
    current.runs += 1;
    if (isTreadmillRun(item)) current.treadmillKm += km;
    else current.outdoorKm += km;
    weekly.set(week, current);
  }
  const weeklyRunLoad = [...weekly.values()]
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-8)
    .map((item) => ({
      ...item,
      distanceKm: round(item.distanceKm, 1),
      durationHours: round(item.durationHours, 1),
      outdoorKm: round(item.outdoorKm, 1),
      treadmillKm: round(item.treadmillKm, 1),
    }));

  const predictions = raw.racePredictions?.predictions && typeof raw.racePredictions.predictions === "object"
    ? Object.entries(raw.racePredictions.predictions).map(([distanceName, value]) => ({
      distance: distanceName.replaceAll("_", " "),
      time: value?.time || "Not available",
    }))
    : [];
  const personalBestTypes = new Set(["Fastest 5K", "Fastest 10K"]);
  const personalBests = Array.isArray(raw.personalRecords)
    ? raw.personalRecords
      .filter((item) => personalBestTypes.has(item?.record_type))
      .map((item) => ({ distance: item.record_type.replace("Fastest ", ""), time: item.value || "Not available" }))
    : [];

  const latestOutdoorSafe = safeRun(latestOutdoor);
  const treadmillSafe = safeRun(comparableTreadmill);
  let outdoorComparison = "A comparable treadmill run is not available.";
  if (latestOutdoorSafe && treadmillSafe && latestOutdoorSafe.averageHeartRate !== null && treadmillSafe.averageHeartRate !== null) {
    const outdoorSeconds = (number(latestOutdoor?.duration_seconds) || 0) / latestOutdoorDistance;
    const treadmillKmValue = (number(comparableTreadmill?.distance_meters) || 0) / 1000;
    const treadmillSeconds = treadmillKmValue > 0 ? (number(comparableTreadmill?.duration_seconds) || 0) / treadmillKmValue : null;
    const paceGap = treadmillSeconds === null ? null : Math.round(outdoorSeconds - treadmillSeconds);
    const hrGap = latestOutdoorSafe.averageHeartRate - treadmillSafe.averageHeartRate;
    outdoorComparison = `The latest comparable outdoor run was ${Math.abs(paceGap || 0)} sec/km ${paceGap !== null && paceGap >= 0 ? "slower" : "faster"} with average heart rate ${Math.abs(hrGap)} bpm ${hrGap >= 0 ? "higher" : "lower"} than the treadmill comparison.`;
  }

  return {
    recent28Days: {
      runs: recent.length,
      distanceKm: round(totalRecentKm, 1),
      outdoorRuns: outdoor.length,
      treadmillRuns: treadmill.length,
      outdoorKm: round(outdoorKm, 1),
      treadmillKm: round(treadmillKm, 1),
      outdoorSharePercent: totalRecentKm > 0 ? round((outdoorKm / totalRecentKm) * 100, 0) : 0,
      treadmillSharePercent: totalRecentKm > 0 ? round((treadmillKm / totalRecentKm) * 100, 0) : 0,
    },
    weeklyRunLoad,
    latestOutdoorRun: latestOutdoorSafe,
    comparableTreadmillRun: treadmillSafe,
    outdoorComparison,
    racePredictions: predictions,
    personalBests,
    historicalRaces: summarizeHistoricalRoadRaces(activities),
    recentSessions: summarizeRecentSessions(activities, generatedAt),
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
  const runningProfile = summarizeRunning(activities, generatedAt, raw);

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
    runningProfile,
    proposedChanges,
    safeguards: [
      "Pain at or above 4/10 always overrides Garmin and stops quality training.",
      "Raw daily health records, activity names and locations remain private on this computer.",
      "Workout and historical-race matching uses dates, distance, duration and activity type; Garmin activity titles are ignored.",
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
