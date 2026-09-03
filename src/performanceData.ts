export type RoadResult = {
  date: string;
  event: string;
  distance: string;
  net: string;
  official: string;
  pace: string;
  result: string;
  verification: string;
};

export const roadResults: RoadResult[] = [
  {
    date: "23 Nov 2025",
    event: "Kerry Hong Kong Streetathon",
    distance: "Marathon",
    net: "4:32:49",
    official: "4:35:17",
    pace: "6:28/km",
    result: "Verified finish and checkpoint record",
    verification: "OFFICIAL RESULT",
  },
  {
    date: "21 Dec 2025",
    event: "ASICS Hong Kong Half-Marathon Championships",
    distance: "Half marathon",
    net: "1:57:13",
    official: "1:59:17",
    pace: "5:33/km",
    result: "Overall 1,077 · gender 948 · category 164",
    verification: "OFFICIAL RESULT",
  },
  {
    date: "18 Jan 2026",
    event: "Standard Chartered Hong Kong Marathon",
    distance: "Marathon",
    net: "4:23:56",
    official: "4:28:53",
    pace: "6:15/km",
    result: "Overall 7,796 · gender 6,622 · category 1,124",
    verification: "OFFICIAL RESULT",
  },
  {
    date: "7 Jun 2026",
    event: "Fearless Dragon Charity Run",
    distance: "Road 10K",
    net: "57:00",
    official: "57:48",
    pace: "5:42/km",
    result: "Overall 250/555 · gender 205/413 · category 75/122",
    verification: "OFFICIAL RESULT",
  },
  {
    date: "30 Aug 2026",
    event: "PEGASUS Tsuen Wan 10K",
    distance: "Garmin 10.17 km",
    net: "1:03:25",
    official: "—",
    pace: "6:14/km",
    result: "Symptom-managed finish; right-shin discomfort km 3–6, so this is not a clean threshold benchmark",
    verification: "GARMIN VERIFIED",
  },
];
