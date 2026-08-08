export type Race = {
  startIso: string;
  date: string;
  name: string;
  type: string;
  status: string;
  priority: string;
  location: string;
  note: string;
  category: "campaign" | "opportunity" | "hyrox";
  sourceLabel: string;
  sourceUrl?: string;
  checked: string;
};

export type ProcamEvent = {
  order: string;
  date: string;
  name: string;
  feature: string;
  registration: string;
  fit: string;
  sourceUrl: string;
};

export const races: Race[] = [
  { startIso: "2026-07-25", date: "25 Jul 2026", name: "HYROX Delhi", type: "Pro Doubles Men", status: "DONE", priority: "Context", location: "Delhi", note: "1:27:54 · AG 14 · Overall 91. Partner-paced running and a larger station share make this a team result, not Amar's individual fitness baseline.", category: "campaign", sourceLabel: "RESULT", checked: "25 Jul 2026" },
  { startIso: "2026-08-30", date: "30 Aug 2026", name: "PEGASUS Tsuen Wan 10K", type: "Road 10K", status: "REGISTERED", priority: "B", location: "Hong Kong", note: "Post-Delhi run benchmark; result resets September training paces.", category: "campaign", sourceLabel: "USER CONFIRMED", checked: "5 Aug 2026" },
  { startIso: "2026-11-04", date: "4 Nov 2026", name: "JPM Corporate Challenge", type: "5.6K road", status: "DATE TBC", priority: "B", location: "Hong Kong", note: "Working date from the season plan; confirm when the JPM team publishes the final date.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },
  { startIso: "2026-12-20", date: "20 Dec 2026", name: "Shenzhen Marathon", type: "Road marathon option", status: "DECIDE", priority: "C", location: "Shenzhen", note: "Lottery-gated. Honest default is skip unless recovery and HYROX priorities stay green.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },
  { startIso: "2027-01-03", date: "3 Jan 2027", name: "Xiamen Marathon", type: "January road option", status: "DECIDE", priority: "C", location: "Xiamen", note: "One of three January options; do not stack it with another marathon or a January HYROX.", category: "campaign", sourceLabel: "PLAN OF RECORD", checked: "5 Aug 2026" },
  { startIso: "2027-01-17", date: "17 Jan 2027", name: "Standard Chartered Hong Kong Marathon", type: "Marathon / Half / 10K option", status: "DECIDE", priority: "C", location: "Hong Kong", note: "Choose at most one January road race. This shares the date with Mumbai and follows HYROX Hong Kong by one week, so the marathon is not the default.", category: "campaign", sourceLabel: "OFFICIAL ORGANISER", sourceUrl: "https://www.hkmarathon.com/", checked: "7 Aug 2026" },

  { startIso: "2026-08-15", date: "15 Aug–12 Sep 2026", name: "AVOHK 5K Series", type: "Four road 5K races", status: "LAST CHANCE", priority: "B option", location: "Hong Kong", note: "The announced Race 1 cutoff passed on 8 Aug, but the official entry portal still showed an enabled Sign up control on 9 Aug. If the 15 Aug benchmark is wanted, enter immediately; it replaces the planned hard session rather than being stacked with it.", category: "opportunity", sourceLabel: "OFFICIAL ENTRY", sourceUrl: "https://in.njuko.com/avohk-5k-series-20261777520975561", checked: "9 Aug 2026" },
  { startIso: "2026-09-26", date: "26 Sep–14 Nov 2026", name: "AVOHK Reservoir Series", type: "12K / 11K / 7K road series", status: "REGISTER NOW", priority: "B option", location: "Hong Kong", note: "Official entry is live. Race 1 at Aberdeen on 26 Sep is the cleanest aerobic option. Race 2 on 1 Nov conflicts with Shanghai and Northern Metropolis; Race 3 on 14 Nov is too close to Guangzhou for an all-out effort.", category: "opportunity", sourceLabel: "OFFICIAL AVOHK", sourceUrl: "https://avohk.org/index.php/2026/08/04/2026-avohk-reservoir-series/", checked: "8 Aug 2026" },
  { startIso: "2026-11-01", date: "1 Nov 2026", name: "Northern Metropolis Marathon", type: "10K / Half / Marathon", status: "DECISION", priority: "Conflict", location: "Hong Kong", note: "Entries are first-come, first-served; standard categories close by 21 Sep or when full. It directly conflicts with the Shanghai HYROX window, so resolve Shanghai before entering.", category: "opportunity", sourceLabel: "OFFICIAL ORGANISER", sourceUrl: "https://hknmm.com/en/important-notes", checked: "7 Aug 2026" },
  { startIso: "2026-11-08", date: "8 Nov 2026", name: "RMAC Gold Coast 15K", type: "Road 15K", status: "REGISTER NOW", priority: "B option", location: "Hong Kong", note: "Open until 19 Oct or capacity. Strong aerobic benchmark after JPMCC, but race it controlled if Guangzhou remains the primary 21–22 Nov qualifier.", category: "opportunity", sourceLabel: "OFFICIAL ENTRY", sourceUrl: "https://www.jotform.com/262032160097449", checked: "7 Aug 2026" },
  { startIso: "2026-11-15", date: "15 Nov 2026", name: "Pocari Sweat Run Fest 10K", type: "Road 10K", status: "REGISTER NOW", priority: "C option", location: "Hong Kong", note: "Official 10K entry is live. Use only as a controlled tune-up six days before Guangzhou; no all-out effort and no separate taper.", category: "opportunity", sourceLabel: "OFFICIAL ENTRY", sourceUrl: "https://psrun2026.sportsoho.com/en/form/enrolment-form", checked: "7 Aug 2026" },
  { startIso: "2026-12-20", date: "20 Dec 2026", name: "Garmin Run Hong Kong", type: "21K / 10K road", status: "DECISION", priority: "Conflict", location: "Hong Kong", note: "Registration is open until 31 Oct or capacity. It clashes with Shenzhen Marathon and Kolkata 25K, so choose one 20 Dec race only; the 21K is the most sensible local option.", category: "opportunity", sourceLabel: "OFFICIAL GARMIN", sourceUrl: "https://www.garmin.com.hk/event/2026/garmin-run/", checked: "7 Aug 2026" },

  { startIso: "2026-10-31", date: "31 Oct–1 Nov 2026", name: "HYROX Shanghai", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Shanghai", note: "Close-to-home qualification attempt if Pro Doubles inventory and Andy are confirmed.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-shanghai-1031/", checked: "5 Aug 2026" },
  { startIso: "2026-11-21", date: "21–22 Nov 2026", name: "HYROX Guangzhou", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A", location: "Guangzhou", note: "Primary close-to-home qualifier. Register immediately when Pro Doubles sales open.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-guangzhou/", checked: "5 Aug 2026" },
  { startIso: "2026-11-26", date: "26–28 Nov 2026", name: "HYROX Gujarat · Gandhinagar", type: "Pro Doubles Men watch", status: "TRAVEL CONFLICT", priority: "Low", location: "Gandhinagar", note: "Official event window; overlaps the extended travel block and exceeds the preferred flight filter.", category: "hyrox", sourceLabel: "OFFICIAL HYROX INDIA", sourceUrl: "https://hyrox.co.in/event/hyrox-gujarat/", checked: "5 Aug 2026" },
  { startIso: "2027-01-07", date: "7–10 Jan 2027", name: "AIA HYROX Hong Kong", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A", location: "Hong Kong", note: "Home qualifier window. This takes priority over forcing a January marathon.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-hong-kong/", checked: "5 Aug 2026" },
  { startIso: "2027-01-15", date: "15–17 Jan 2027", name: "HYROX Greater Noida", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "B option", location: "Greater Noida", note: "Official dates; travel-heavy alternative one week after HYROX Hong Kong.", category: "hyrox", sourceLabel: "OFFICIAL HYROX INDIA", sourceUrl: "https://hyrox.co.in/event/hyrox-noida/", checked: "5 Aug 2026" },
  { startIso: "2027-01-21", date: "21–24 Jan 2027", name: "BYD HYROX Osaka", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Osaka", note: "Practical APAC qualifier, but never stack with Hong Kong or Noida without a recovery decision.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/byd-hyrox-osaka/", checked: "5 Aug 2026" },
  { startIso: "2027-02-11", date: "11–14 Feb 2027", name: "BYD HYROX Bangkok", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A", location: "Bangkok", note: "Primary second qualification window if no January slot is secured.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-bangkok/", checked: "5 Aug 2026" },
  { startIso: "2027-03-12", date: "12–14 Mar 2027", name: "HYROX Taipei", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Taipei", note: "Short-haul qualifier option with enough time to recover and build again before May.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-taipei/", checked: "5 Aug 2026" },
  { startIso: "2027-04-16", date: "16–18 Apr 2027", name: "HYROX Nagoya", type: "Pro Doubles Men watch", status: "SALES SOON", priority: "A option", location: "Nagoya", note: "Late but workable qualifier window; five to eight weeks remain before Worlds.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-nagoya/", checked: "5 Aug 2026" },
  { startIso: "2027-05-12", date: "12–16 May 2027", name: "HYROX Bengaluru", type: "Pro Doubles Men watch", status: "LAST CHANCE", priority: "Risk", location: "Bengaluru", note: "Event ends on the stated qualification cutoff. Treat as contingency only; result timing is dangerously tight.", category: "hyrox", sourceLabel: "OFFICIAL HYROX INDIA", sourceUrl: "https://hyrox.co.in/event/hyrox-bengaluru/", checked: "5 Aug 2026" },
  { startIso: "2027-05-13", date: "13–16 May 2027", name: "BYD HYROX Incheon", type: "Pro Doubles Men watch", status: "LAST CHANCE", priority: "Risk", location: "Incheon", note: "Also ends at the cutoff. Do not leave qualification to this race unless HYROX confirms result eligibility timing.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/hyrox-incheon/", checked: "5 Aug 2026" },
  { startIso: "2027-06-10", date: "10–13 Jun 2027", name: "PUMA HYROX World Championships", type: "Pro Doubles Men", status: "TARGET", priority: "A+", location: "Hong Kong", note: "Target event. Qualification results must be posted by 16 May 2027.", category: "hyrox", sourceLabel: "OFFICIAL HYROX", sourceUrl: "https://hyrox.com/event/puma-hyrox-world-championships-hong-kong/", checked: "5 Aug 2026" },
];

export const procamEvents: ProcamEvent[] = [
  { order: "START", date: "20 Dec 2026", name: "Tata Steel World 25K Kolkata", feature: "25K · Slam cutoff 3:45", registration: "OPENS 13 AUG · 7:00 AM IST", fit: "Possible cycle start, but conflicts with Garmin HK and Shenzhen. Choose one 20 Dec race.", sourceUrl: "https://tatasteelkolkata25k.procam.in/" },
  { order: "2", date: "17 Jan 2027", name: "Tata Mumbai Marathon", feature: "Marathon · Slam cutoff 6:30", registration: "OPEN · CLOSES 5 NOV OR WHEN FULL", fit: "Overseas marathon entry is open. Same date as Hong Kong Marathon and one week after HYROX Hong Kong.", sourceUrl: "https://tatamumbaimarathon.procam.in/race-categories/marathon/registration-date" },
  { order: "3", date: "25 Apr 2027", name: "TCS World 10K Bengaluru", feature: "Open 10K · Slam cutoff 1:25", registration: "RACE DATE CONFIRMED · REGISTRATION TBC", fit: "Good distance for the running plan, but travel cost must justify it during the final HYROX qualifier block.", sourceUrl: "https://tcsworld10k.procam.in/" },
  { order: "4", date: "2027 date TBC", name: "Vedanta Delhi Half Marathon", feature: "Half Marathon · Slam cutoff 3:30", registration: "2027 WINDOW TBC", fit: "Completes a Kolkata-start cycle. The sold-out 18 Oct 2026 edition is intentionally excluded from active opportunities.", sourceUrl: "https://vedantadelhihalfmarathon.procam.in/" },
];
