/**
 * Regenerates js/presets.js starter queries (no deliberate OFFSET/slice duplicates).
 * Run from repo root: node scripts/emit-presets.cjs
 */
"use strict";

const fs = require("fs");
const path = require("path");

const DOC_EASY_50 = require("./doc-easy-50.cjs");
const DOC_MEDIUM_50 = require("./doc-medium-50.cjs");
const DOC_HARD_50 = require("./doc-hard-50.cjs");

/** Collapse whitespace for duplicate detection (semicolon stripped). */
const normSql = (s) =>
  String(s || "")
    .replace(/;\s*$/, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const E = (title, tables, sql) => ({
  title,
  tables: tables || [],
  sql: sql.endsWith(";") ? sql : sql + ";",
});

/** @type {{easy:any[],medium:any[],hard:any[]}} */
const out = { easy: [], medium: [], hard: [] };

/* ---------- EASY (50) ---------- */
(function () {
  const e = out.easy;
  e.push(
    E(
      "SQLite — list imported tables",
      [],
      `SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;`,
    ),
  );
  e.push(E("SQLite — engine version", [], `SELECT sqlite_version() AS version;`));

  ["stops", "routes", "trips", "agency", "calendar", "calendar_dates"].forEach(
    (t) => {
      e.push(E(`COUNT rows — ${t}`, [t], `SELECT COUNT(*) AS n FROM ${t};`));
    },
  );

  e.push(E("COUNT DISTINCT route_id in trips", ["trips"], `SELECT COUNT(DISTINCT route_id) AS route_ids_used FROM trips;`));
  e.push(E("COUNT DISTINCT trip_id", ["trips"], `SELECT COUNT(DISTINCT trip_id) AS trip_ids FROM trips;`));
  e.push(E("COUNT DISTINCT stop_id (stops file)", ["stops"], `SELECT COUNT(DISTINCT stop_id) AS stop_ids FROM stops;`));

  e.push(E("Routes sorted by route_id — first batch", ["routes"], `SELECT route_id, route_short_name FROM routes ORDER BY route_id LIMIT 35;`));
  e.push(E("Routes sorted by short name — first batch", ["routes"], `SELECT route_id, route_short_name FROM routes ORDER BY route_short_name COLLATE NOCASE LIMIT 35;`));
  e.push(E("Stops A→Z — first batch", ["stops"], `SELECT stop_id, stop_name FROM stops ORDER BY stop_name COLLATE NOCASE LIMIT 35;`));
  e.push(E("Trips — sample trip_id and headsign", ["trips"], `SELECT trip_id, route_id, trip_headsign FROM trips LIMIT 40;`));

  e.push(E("Filter — bus route_type = 3", ["routes"], `SELECT route_id, route_short_name, route_type FROM routes WHERE CAST(route_type AS INTEGER) = 3 LIMIT 35;`));
  e.push(E("Filter stops — names containing “Rd”", ["stops"], `SELECT stop_id, stop_name FROM stops WHERE stop_name LIKE '%Rd%' LIMIT 30;`));
  e.push(E("Filter stops — latitude string starts with digit", ["stops"], `SELECT stop_id, stop_lat FROM stops WHERE stop_lat LIKE '4%' LIMIT 25;`));
  e.push(E("Trips WHERE — non-empty trip_headsign", ["trips"], `SELECT trip_id, trip_headsign FROM trips WHERE trip_headsign IS NOT NULL AND LENGTH(TRIM(trip_headsign)) > 2 LIMIT 30;`));

  e.push(E("ORDER BY + LIMIT — shortest route short names lexically", ["routes"], `SELECT route_short_name FROM routes ORDER BY LENGTH(route_short_name), route_short_name LIMIT 25;`));
  e.push(E("Pagination — OFFSET on routes", ["routes"], `SELECT route_id FROM routes ORDER BY route_id LIMIT 8 OFFSET 5;`));
  e.push(E("DISTINCT agency_id values (routes)", ["routes"], `SELECT DISTINCT agency_id FROM routes WHERE agency_id IS NOT NULL AND TRIM(CAST(agency_id AS TEXT)) != '' ORDER BY agency_id LIMIT 40;`));
  e.push(E("DISTINCT service_id (trips)", ["trips"], `SELECT DISTINCT service_id FROM trips ORDER BY service_id LIMIT 40;`));

  e.push(E("SQLite CONCAT strings — route label", ["routes"], `SELECT route_id, route_short_name || ' · ' || route_long_name AS label FROM routes LIMIT 25;`));
  e.push(E("SQLite UPPER on stop name snippet", ["stops"], `SELECT stop_id, UPPER(SUBSTR(stop_name, 1, 28)) AS start_caps FROM stops LIMIT 25;`));
  e.push(E("SQLite LENGTH(stop_name)", ["stops"], `SELECT stop_name, LENGTH(stop_name) AS name_len FROM stops ORDER BY name_len DESC LIMIT 25;`));

  e.push(E("Monday services (calendar flag)", ["calendar"], `SELECT service_id, monday FROM calendar WHERE COALESCE(monday, '0') IN ('1','true') ORDER BY service_id LIMIT 35;`));
  e.push(E("Sunday-only style filter (logical AND flags)", ["calendar"], `SELECT service_id FROM calendar WHERE sunday IN ('1', 1) AND monday NOT IN ('1', 1) LIMIT 40;`));
  e.push(E("Peek calendar_dates exceptions", ["calendar_dates"], `SELECT service_id, date, exception_type FROM calendar_dates ORDER BY date LIMIT 40;`));

  e.push(
    E(
      "Peek stop_times — ordered timetable sample",
      ["stop_times"],
      `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 50;`,
    ),
  );

  [
    ["COUNT — stop_times timetable rows", ["stop_times"], `SELECT COUNT(*) AS n FROM stop_times;`],
    ["COUNT — transfers rules loaded", ["transfers"], `SELECT COUNT(*) AS n FROM transfers;`],
    ["COUNT — frequencies rows", ["frequencies"], `SELECT COUNT(*) AS n FROM frequencies;`],
    ["Peek feed_info publisher metadata", ["feed_info"], `SELECT * FROM feed_info LIMIT 40;`],
    ["Peek frequencies (headway-based service)", ["frequencies"], `SELECT trip_id, start_time, end_time, headway_secs FROM frequencies LIMIT 55;`],
    ["Peek fare_attributes pricing metadata", ["fare_attributes"], `SELECT * FROM fare_attributes LIMIT 55;`],
    ["Peek fare_rules applicability", ["fare_rules"], `SELECT * FROM fare_rules LIMIT 65;`],
    [
      "Skim shapes (polyline vertices; large file if imported)",
      ["shapes"],
      `SELECT shape_id, shape_pt_lat, shape_pt_lon FROM shapes ORDER BY shape_id, shape_pt_sequence LIMIT 50;`,
    ],
    ["Trips — DISTINCT shape_id samples", ["trips"], `SELECT DISTINCT shape_id FROM trips WHERE shape_id IS NOT NULL AND TRIM(CAST(shape_id AS TEXT)) != '' LIMIT 50;`],
    ["Routes — DISTINCT branded colors", ["routes"], `SELECT DISTINCT route_color FROM routes ORDER BY route_color LIMIT 60;`],
    ["Routes — DISTINCT passenger text colors", ["routes"], `SELECT DISTINCT route_text_color FROM routes ORDER BY route_text_color LIMIT 60;`],
    [
      "Stops — typeof() on geographic columns",
      ["stops"],
      `SELECT typeof(stop_lat) AS lat_sqlite_type,\ntypeof(stop_lon) AS lon_sqlite_type\nFROM stops\nLIMIT 25;`,
    ],
    [
      "Stop_times — morning blocks only (lexical time compare)",
      ["stop_times"],
      `SELECT trip_id, departure_time\nFROM stop_times\nWHERE departure_time >= '05:00:00' AND departure_time < '08:59:59'\nORDER BY departure_time ASC\nLIMIT 45;`,
    ],
    [
      "UNION stacked tallies — routes versus stops counts",
      ["routes", "stops"],
      `SELECT 'routes' AS layer,\nCAST(COUNT(*) AS TEXT) AS qty\nFROM routes\nUNION ALL\nSELECT 'stops', CAST(COUNT(*) AS TEXT) FROM stops;`,
    ],
    ["SQLite — quote() safe string escaping demo", [], `SELECT quote('single-quoted literals') AS safe_literal;`],
  ].forEach(([title, tables, sql]) => e.push(E(title, tables, sql)));

  (function mergeDocEasyExercisesFromWord() {
    const seenNorm = new Set(e.map((o) => normSql(o.sql)));
    const before = e.length;
    for (const [title, tbls, sqlRaw] of DOC_EASY_50) {
      const sql = sqlRaw.endsWith(";") ? sqlRaw : `${sqlRaw};`;
      const n = normSql(sql);
      if (seenNorm.has(n)) continue;
      seenNorm.add(n);
      e.push(E(title, tbls, sql));
    }
    const added = e.length - before;
    if (added) console.log(`emit-presets: appended ${added} easy preset(s) from GTFS_SQL_50_Easy_Exercises.docx`);
  })();
})();

/* ---------- MEDIUM ---------- */
(function () {
  const m = out.medium;
  const seenMid = new Set();
  const easyNorm = new Set(out.easy.map((o) => normSql(o.sql)));

  const pushMid = (title, tables, sql) => {
    const p = E(title, tables, sql);
    const key = normSql(p.sql);
    if (seenMid.has(key)) return;
    seenMid.add(key);
    m.push(p);
  };

  pushMid(
    "Join trips × routes — trip counts by route_short_name",
    ["trips", "routes"],
    `SELECT r.route_short_name,\nCOUNT(t.trip_id) AS trip_rows\nFROM trips AS t\nJOIN routes AS r ON r.route_id = t.route_id\nGROUP BY r.route_short_name\nORDER BY trip_rows DESC\nLIMIT 25;`,
  );
  pushMid(
    "LEFT JOIN orphans — routes with zero trips",
    ["routes", "trips"],
    `SELECT r.route_id, r.route_short_name, COUNT(t.trip_id) AS trip_rows\nFROM routes AS r\nLEFT JOIN trips AS t ON t.route_id = r.route_id\nGROUP BY r.route_id, r.route_short_name\nHAVING COUNT(t.trip_id) = 0\nLIMIT 35;`,
  );
  pushMid("GROUP BY calendar exception_type counts", ["calendar_dates"], `SELECT exception_type, COUNT(*) AS n FROM calendar_dates GROUP BY exception_type;`);
  pushMid(
    "GROUP BY weekday pattern — Sundays on calendar × trips",
    ["calendar", "trips"],
    `SELECT c.sunday,\nCOUNT(t.trip_id) AS trips\nFROM calendar AS c\nJOIN trips AS t ON t.service_id = c.service_id\nGROUP BY c.sunday\nORDER BY trips DESC\nLIMIT 10;`,
  );
  pushMid(
    "Geo box with CAST(stop_lat/long AS REAL)",
    ["stops"],
    `SELECT stop_id, stop_lat, stop_lon\nFROM stops\nWHERE CAST(stop_lat AS REAL) BETWEEN 43 AND 44\nAND CAST(stop_lon AS REAL) BETWEEN -80 AND -79\nLIMIT 40;`,
  );

  pushMid(
    "Trips aggregated by direction_id",
    ["trips"],
    `SELECT direction_id, COUNT(*) AS trips FROM trips GROUP BY direction_id ORDER BY CAST(direction_id AS INTEGER);`,
  );

  pushMid("JOIN trips and routes sample flat rows", ["trips", "routes"], `SELECT r.route_short_name, t.service_id, t.direction_id FROM trips AS t JOIN routes AS r ON r.route_id = t.route_id ORDER BY trip_id LIMIT 40;`);
  pushMid("IN subquery — trips for first N route ids", ["trips"], `SELECT trip_id FROM trips WHERE route_id IN (SELECT route_id FROM trips GROUP BY route_id ORDER BY COUNT(*) DESC LIMIT 3) LIMIT 40;`);
  pushMid("EXISTS — routes referenced by trips", ["routes", "trips"], `SELECT r.route_id FROM routes AS r WHERE EXISTS (SELECT 1 FROM trips AS t WHERE t.route_id = r.route_id) LIMIT 25;`);
  pushMid(
    "CASE labeling route_type (small taxonomy)",
    ["routes"],
    `SELECT route_short_name, route_type,\nCASE CAST(route_type AS INTEGER)\n  WHEN 3 THEN 'bus'\n  WHEN 0 THEN 'tram'\n  ELSE 'other'\nEND AS readable\nFROM routes LIMIT 35;`,
  );

  pushMid(
    "COALESCE headline from short or long route name",
    ["routes"],
    `SELECT route_id,\nCOALESCE(NULLIF(TRIM(route_short_name), ''), route_long_name) AS display_name\nFROM routes LIMIT 30;`,
  );
  pushMid("HAVING — services with substantive trip volumes", ["trips"], `SELECT service_id, COUNT(*) AS trips FROM trips GROUP BY service_id HAVING COUNT(*) > 50 ORDER BY trips DESC LIMIT 20;`);
  pushMid("Stop_times post-midnight departures bucket", ["stop_times"], `SELECT COUNT(*) AS n FROM stop_times WHERE departure_time >= '24:00:00';`);
  pushMid(
    "Stop_times morning window (TEXT time compare)",
    ["stop_times"],
    `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '06:00:00' AND departure_time < '11:00:00' ORDER BY departure_time LIMIT 50;`,
  );

  [
    ["Join transfer rules with from_stop name", ["transfers", "stops"], `SELECT tf.from_stop_id, s.stop_name\nFROM transfers AS tf\nJOIN stops AS s ON s.stop_id = tf.from_stop_id\nLIMIT 35;`],
    ["Transfers grouped by transfer_type value", ["transfers"], `SELECT transfer_type, COUNT(*) AS rows FROM transfers GROUP BY transfer_type;`],
  ].forEach(([title, tbls, sql]) => pushMid(title, tbls, sql));

  pushMid("Busiest boarding stops sample (trips counted)", ["stop_times"], `SELECT stop_id, COUNT(*) AS pickups FROM stop_times GROUP BY stop_id ORDER BY pickups DESC LIMIT 25;`);
  pushMid(
    "First stop_sequence per trip (aggregate MIN fallback)",
    ["stop_times"],
    `SELECT trip_id, MIN(CAST(stop_sequence AS INTEGER)) AS first_seq FROM stop_times GROUP BY trip_id ORDER BY trip_id LIMIT 40;`,
  );

  [
    ["JOIN calendar when weekend window", ["calendar", "trips"], `SELECT c.friday,\nSUM(CASE WHEN t.service_id IS NOT NULL THEN 1 ELSE 0 END) AS svc_trips\nFROM calendar AS c\nJOIN trips AS t ON c.service_id = t.service_id\nGROUP BY c.friday\nLIMIT 15;`],
    ["JOIN agency to routes aggregate", ["agency", "routes"], `SELECT a.agency_name, COUNT(*) AS routes FROM routes AS r LEFT JOIN agency AS a ON CAST(a.agency_id AS TEXT) = CAST(r.agency_id AS TEXT) GROUP BY a.agency_name ORDER BY routes DESC LIMIT 15;`],
  ].forEach(([title, tbls, sql]) => pushMid(title, tbls, sql));

  pushMid(
    "Top calendar services ranked by scheduled trip totals",
    ["trips"],
    `SELECT service_id, COUNT(*) AS trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 25;`,
  );

  /** SQL CASE — GTFS workbook (adapted placeholders: MD1→trips.service_id; headway→frequencies.headway_secs) */
  [
    [
      "CASE · classify route_type (Bus / Streetcar / Other)",
      ["routes"],
      `SELECT route_id,\nCASE\n  WHEN CAST(route_type AS INTEGER) = 3 THEN 'Bus'\n  WHEN CAST(route_type AS INTEGER) = 0 THEN 'Streetcar'\n  ELSE 'Other'\nEND AS service_type\nFROM routes\nLIMIT 50;`,
    ],
    [
      "CASE · Morning vs Evening (stop_times departure)",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN departure_time < '12:00:00' THEN 'Morning'\n  ELSE 'Evening'\nEND AS period\nFROM stop_times\nLIMIT 120;`,
    ],
    [
      "CASE · Weekday vs Weekend (calendar weekday flags)",
      ["calendar"],
      `SELECT service_id,\nCASE\n  WHEN monday IN ('1', 'true') OR tuesday IN ('1', 'true') OR wednesday IN ('1', 'true')\n    OR thursday IN ('1', 'true') OR friday IN ('1', 'true')\n  THEN 'Weekday'\n  ELSE 'Weekend'\nEND AS day_type\nFROM calendar\nLIMIT 45;`,
    ],
    [
      "CASE · AM peak / PM peak / Off-peak (departure_time)",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN departure_time BETWEEN '07:00:00' AND '09:00:00' THEN 'AM Peak'\n  WHEN departure_time BETWEEN '16:00:00' AND '18:00:00' THEN 'PM Peak'\n  ELSE 'Off-Peak'\nEND AS period\nFROM stop_times\nLIMIT 120;`,
    ],
    [
      "CASE · group service_id MD1 / MD2 as Midday (trips)",
      ["trips"],
      `SELECT service_id,\nCASE\n  WHEN service_id IN ('MD1', 'MD2') THEN 'Midday'\n  ELSE CAST(service_id AS TEXT)\nEND AS service_group\nFROM trips\nLIMIT 120;`,
    ],
    [
      "CASE · trip length Short / Medium / Long (stop_sequence buckets)",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN MAX(CAST(stop_sequence AS INTEGER)) < 20 THEN 'Short'\n  WHEN MAX(CAST(stop_sequence AS INTEGER)) < 50 THEN 'Medium'\n  ELSE 'Long'\nEND AS trip_length\nFROM stop_times\nGROUP BY trip_id\nLIMIT 60;`,
    ],
    [
      "CASE · Express vs Local (numeric route_id hint ≥900)",
      ["routes"],
      `SELECT route_id,\nCASE\n  WHEN CAST(route_id AS INTEGER) >= 900 THEN 'Express'\n  ELSE 'Local Bus'\nEND AS category\nFROM routes\nLIMIT 50;`,
    ],
    [
      "CASE · load level Low / Medium / High (stops per trip)",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN MAX(CAST(stop_sequence AS INTEGER)) > 60 THEN 'High'\n  WHEN MAX(CAST(stop_sequence AS INTEGER)) > 30 THEN 'Medium'\n  ELSE 'Low'\nEND AS load_level\nFROM stop_times\nGROUP BY trip_id\nLIMIT 60;`,
    ],
    [
      "CASE · direction label Outbound / Inbound",
      ["trips"],
      `SELECT t.trip_id,\nCASE\n  WHEN CAST(t.direction_id AS INTEGER) = 0 THEN 'Outbound'\n  ELSE 'Inbound'\nEND AS direction_label\nFROM trips AS t\nLIMIT 80;`,
    ],
    [
      "CASE · headway status Missing / Low frequency / Normal (frequencies)",
      ["frequencies"],
      `SELECT trip_id,\nCASE\n  WHEN headway_secs IS NULL OR TRIM(CAST(headway_secs AS TEXT)) = '' THEN 'Missing'\n  WHEN CAST(headway_secs AS REAL) > 1800 THEN 'Low Frequency'\n  ELSE 'Normal'\nEND AS headway_status\nFROM frequencies\nLIMIT 60;`,
    ],
    [
      "CASE · Early / Late / Regular (departure_time bands)",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN departure_time < '06:00:00' THEN 'Early'\n  WHEN departure_time > '22:00:00' THEN 'Late'\n  ELSE 'Regular'\nEND AS time_band\nFROM stop_times\nLIMIT 120;`,
    ],
    [
      "CASE · first stop vs other (stop_sequence = 1)",
      ["stop_times"],
      `SELECT trip_id,\nCAST(stop_sequence AS INTEGER) AS stop_sequence,\nCASE\n  WHEN CAST(stop_sequence AS INTEGER) = 1 THEN 'First Stop'\n  ELSE 'Other'\nEND AS stop_position\nFROM stop_times\nLIMIT 120;`,
    ],
    [
      "CASE · long vs short route_long_name",
      ["routes"],
      `SELECT route_id,\nCASE\n  WHEN LENGTH(route_long_name) > 20 THEN 'Long Name'\n  ELSE 'Short Name'\nEND AS name_size\nFROM routes\nLIMIT 50;`,
    ],
    [
      "CASE · calendar start_date older vs Current (YYYYMMDD text)",
      ["calendar"],
      `SELECT service_id,\nCASE\n  WHEN CAST(start_date AS TEXT) < '20240101' THEN 'Older'\n  ELSE 'Current'\nEND AS service_era\nFROM calendar\nLIMIT 45;`,
    ],
    [
      "CASE · stop density Dense / Sparse (COUNT per trip)",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN COUNT(*) > 50 THEN 'Dense'\n  ELSE 'Sparse'\nEND AS density_label\nFROM stop_times\nGROUP BY trip_id\nLIMIT 60;`,
    ],
    [
      "CASE · direction_id textual bucket (0-dir / 1-dir)",
      ["trips"],
      `SELECT trip_id,\nCASE\n  WHEN CAST(direction_id AS TEXT) = '0' THEN '0-dir'\n  ELSE '1-dir'\nEND AS dir_bucket\nFROM trips\nLIMIT 80;`,
    ],
    [
      "CASE · route_id prefix grouping (e.g. '5%' as Streetcar hint)",
      ["routes"],
      `SELECT route_id,\nCASE\n  WHEN route_id LIKE '5%' THEN 'Streetcar'\n  ELSE 'Other'\nEND AS route_group_hint\nFROM routes\nLIMIT 50;`,
    ],
    [
      "CASE · departure time bucket AM / Midday / PM",
      ["stop_times"],
      `SELECT departure_time,\nCASE\n  WHEN departure_time < '09:00:00' THEN 'AM'\n  WHEN departure_time < '15:00:00' THEN 'Midday'\n  ELSE 'PM'\nEND AS time_bucket\nFROM stop_times\nLIMIT 120;`,
    ],
    [
      "CASE · flag missing departure_time",
      ["stop_times"],
      `SELECT trip_id,\nCASE\n  WHEN departure_time IS NULL OR TRIM(departure_time) = '' THEN 'Missing'\n  ELSE 'OK'\nEND AS dep_status\nFROM stop_times\nLIMIT 120;`,
    ],
    [
      "CASE · trip_id label with direction + concat",
      ["trips"],
      `SELECT trip_id,\nCASE\n  WHEN CAST(direction_id AS TEXT) = '0' THEN 'Dir0-' || trip_id\n  ELSE 'Dir1-' || trip_id\nEND AS trip_direction_label\nFROM trips\nLIMIT 80;`,
    ],
  ].forEach(([title, tbls, sql]) => pushMid(title, tbls, sql));

  let docMediumAdded = 0;
  let docSkippedEasyDup = 0;
  let docSkippedMidDup = 0;
  for (const [title, tbls, sqlRaw] of DOC_MEDIUM_50) {
    const p = E(title, tbls, sqlRaw);
    const k = normSql(p.sql);
    if (easyNorm.has(k)) {
      docSkippedEasyDup += 1;
      continue;
    }
    if (seenMid.has(k)) {
      docSkippedMidDup += 1;
      continue;
    }
    seenMid.add(k);
    m.push(p);
    docMediumAdded += 1;
  }
  if (docMediumAdded)
    console.log(`emit-presets: appended ${docMediumAdded} medium preset(s) from GTFS_SQL_50_Medium_Exercises.docx`);
  if (docSkippedMidDup + docSkippedEasyDup)
    console.log(
      `emit-presets: skipped ${docSkippedMidDup} duplicate-in-medium + ${docSkippedEasyDup} already-in-easy from medium doc`,
    );
})();

/* ---------- HARD ---------- */
(function () {
  const h = out.hard;
  const normEasy = new Set(out.easy.map((o) => normSql(o.sql)));
  const normMed = new Set(out.medium.map((o) => normSql(o.sql)));
  const seenHard = new Set();

  const pushHard = (title, tables, sql) => {
    const p = E(title, tables, sql);
    const key = normSql(p.sql);
    if (normEasy.has(key) || normMed.has(key) || seenHard.has(key)) return;
    seenHard.add(key);
    h.push(p);
  };

  pushHard(
    "CTE — average trips per route",
    ["trips"],
    `WITH c AS (\nSELECT route_id, COUNT(*) trips FROM trips GROUP BY route_id\n)\nSELECT AVG(CAST(trips AS REAL)) AS avg_trips_per_route FROM c;`,
  );
  pushHard(
    "CTE chain — totals then average comparison",
    ["trips"],
    `WITH svc AS (\nSELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id\n)\nSELECT service_id,\ntrips,\n(SELECT AVG(trips) FROM svc) avg_all\nFROM svc\nORDER BY trips DESC\nLIMIT 30;`,
  );
  pushHard(
    "WINDOW ROW_NUMBER → first timetable stop per trip",
    ["stop_times", "stops"],
    `SELECT sub.trip_id, sub.departure_time, s.stop_name\nFROM (\nSELECT trip_id, stop_id, departure_time,\nROW_NUMBER() OVER (PARTITION BY trip_id ORDER BY CAST(stop_sequence AS INTEGER)) rn\nFROM stop_times\n) sub\nJOIN stops s ON s.stop_id = sub.stop_id\nWHERE sub.rn = 1\nLIMIT 40;`,
  );
  pushHard(
    "WINDOW ROW_NUMBER → last timetable stop per trip",
    ["stop_times"],
    `SELECT trip_id, departure_time, stop_sequence\nFROM (\nSELECT trip_id, departure_time, stop_sequence,\nROW_NUMBER() OVER (PARTITION BY trip_id ORDER BY CAST(stop_sequence AS INTEGER) DESC) rn\nFROM stop_times\n)\nWHERE rn = 1\nLIMIT 40;`,
  );
  pushHard(
    "DISTINCT trip count ranking by calendar service_id",
    ["calendar", "trips"],
    `SELECT c.service_id,\nCOUNT(DISTINCT t.trip_id) trips_distinct\nFROM calendar c\nJOIN trips t ON c.service_id = t.service_id\nGROUP BY c.service_id\nORDER BY trips_distinct DESC\nLIMIT 30;`,
  );
  pushHard(
    "Rolling route leaderboard — ROW_NUMBER dense",
    ["routes", "trips"],
    `WITH rc AS (\nSELECT r.route_id, r.route_short_name, COUNT(t.trip_id) cnt\nFROM routes r\nJOIN trips t ON t.route_id = r.route_id\nGROUP BY r.route_id, r.route_short_name\n)\nSELECT route_short_name, cnt,\nROW_NUMBER() OVER (ORDER BY cnt DESC) place\nFROM rc\nLIMIT 25;`,
  );
  pushHard(
    "Correlation-style — timetable rows versus trip cardinality",
    ["trips", "stop_times"],
    `SELECT COUNT(DISTINCT t.trip_id) trips_present,\nCOUNT(*) timetable_rows,\nCAST(COUNT(*) AS REAL)/NULLIF(COUNT(DISTINCT t.trip_id),0) rows_per_trip_approx\nFROM trips t\nJOIN stop_times st ON st.trip_id = t.trip_id;`,
  );
  pushHard(
    "THREE-WAY rollup — routes + trips + stop_times",
    ["routes", "trips", "stop_times"],
    `SELECT r.route_short_name,\nCOUNT(DISTINCT t.trip_id) trips,\nCOUNT(DISTINCT st.stop_id) stops_in_path,\nCOUNT(*) tt_rows\nFROM routes r\nJOIN trips t ON t.route_id = r.route_id\nJOIN stop_times st ON st.trip_id = t.trip_id\nGROUP BY r.route_short_name\nORDER BY tt_rows DESC\nLIMIT 20;`,
  );
  pushHard(
    "UNION stack — cardinality snapshot",
    ["routes", "trips", "stops", "stop_times"],
    `SELECT 'routes', COUNT(*) FROM routes\nUNION ALL SELECT 'trips', COUNT(*) FROM trips\nUNION ALL SELECT 'stops', COUNT(*) FROM stops\nUNION ALL SELECT 'stop_times', COUNT(*) FROM stop_times;`,
  );
  pushHard(
    "Above-average routes (scalar subqueries)",
    ["routes", "trips"],
    `WITH totals AS (\nSELECT route_id, COUNT(*) ct FROM trips GROUP BY route_id\n)\nSELECT r.route_short_name, t.ct\nFROM totals t JOIN routes r ON r.route_id = t.route_id\nWHERE CAST(t.ct AS REAL) > (SELECT AVG(CAST(ct AS REAL)) FROM totals)\nORDER BY ct DESC\nLIMIT 30;`,
  );

  pushHard(
    "Correlated COUNT — timetable rows referencing each stop stop_id",
    ["stops"],
    `SELECT s.stop_id,\n(SELECT COUNT(*) FROM stop_times AS st WHERE st.stop_id = s.stop_id) AS visits\nFROM stops AS s\nORDER BY visits DESC\nLIMIT 30;`,
  );
  pushHard(
    "Transfers fan-out aggregated per from_stop_id",
    ["transfers"],
    `SELECT from_stop_id, COUNT(*) out_edges FROM transfers GROUP BY from_stop_id ORDER BY out_edges DESC LIMIT 30;`,
  );
  pushHard(
    "Transfers fan-in aggregated per to_stop_id",
    ["transfers"],
    `SELECT to_stop_id, COUNT(*) inbound FROM transfers GROUP BY to_stop_id ORDER BY inbound DESC LIMIT 30;`,
  );

  /* Window NTILE-ish approx using quartiles */
  pushHard(
    "Quartiles on trip_counts per route (window NTILE)",
    ["trips"],
    `WITH rc AS (\n  SELECT route_id, COUNT(*) AS ct FROM trips GROUP BY route_id\n)\nSELECT bucket, COUNT(*) AS routes_in_bucket\nFROM (\n  SELECT NTILE(4) OVER (ORDER BY ct) AS bucket FROM rc\n) AS quartiles\nGROUP BY bucket\nORDER BY bucket;`,
  );
  pushHard(
    "LAG-style via self-join neighbouring stop_sequence (+1)",
    ["stop_times"],
    `SELECT a.trip_id,\na.departure_time AS dep_here,\nb.departure_time AS dep_next,\na.stop_sequence current_seq,\nb.stop_sequence next_seq\nFROM stop_times a\nJOIN stop_times b\nON b.trip_id = a.trip_id\nAND CAST(b.stop_sequence AS INTEGER) = CAST(a.stop_sequence AS INTEGER) + 1\nLIMIT 35;`,
  );

  pushHard(
    "Calendar coverage join — widest date span per service_id",
    ["calendar"],
    `SELECT service_id,\nCAST(start_date AS INTEGER) sd,\nCAST(end_date AS INTEGER) ed,\nCAST(end_date AS INTEGER) - CAST(start_date AS INTEGER) span_days_approx\nFROM calendar\nORDER BY span_days_approx DESC\nLIMIT 25;`,
  );
  pushHard(
    "EXCEPTION heavy services — LEFT JOIN aggregate",
    ["calendar_dates", "trips"],
    `SELECT cd.service_id, COUNT(cd.date) exc_rows\nFROM calendar_dates cd\nLEFT JOIN trips t ON t.service_id = cd.service_id\nGROUP BY cd.service_id\nORDER BY exc_rows DESC\nLIMIT 30;`,
  );

  pushHard("PRAGMA schema for trips", ["trips"], `PRAGMA table_info(trips);`);

  pushHard(
    "Rank stops by DISTINCT trips served (heavy stops)",
    ["stop_times"],
    `SELECT stop_id, COUNT(DISTINCT trip_id) AS distinct_trips\nFROM stop_times\nGROUP BY stop_id\nORDER BY distinct_trips DESC\nLIMIT 30;`,
  );

  let docHardAdded = 0;
  let docSkippedEasy = 0;
  let docSkippedMed = 0;
  let docSkippedHardDup = 0;
  for (const [title, tbls, sqlRaw] of DOC_HARD_50) {
    const p = E(title, tbls, sqlRaw);
    const k = normSql(p.sql);
    if (normEasy.has(k)) docSkippedEasy++;
    else if (normMed.has(k)) docSkippedMed++;
    else if (seenHard.has(k)) docSkippedHardDup++;
    else {
      seenHard.add(k);
      h.push(p);
      docHardAdded++;
    }
  }
  if (docHardAdded)
    console.log(`emit-presets: appended ${docHardAdded} hard preset(s) from GTFS_SQL_50_Hard_Exercises.docx`);
  const docHardSkips = docSkippedEasy + docSkippedMed + docSkippedHardDup;
  if (docHardSkips)
    console.log(
      `emit-presets: skipped hard-doc ${docSkippedEasy} easy-match + ${docSkippedMed} medium-match + ${docSkippedHardDup} duplicate-hard`,
    );
})();

function fmtArr(arr) {
  return arr
    .map((o) => {
      const tabs = JSON.stringify(o.tables);
      const sql = o.sql.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
      return `    {\n      title: ${JSON.stringify(o.title)},\n      tables: ${tabs},\n      sql: \`${sql}\`,\n    }`;
    })
    .join(",\n");
}

const header = `/**
 * Starter queries grouped by difficulty (easy / medium / hard).
 * Regenerate: node scripts/emit-presets.cjs (counts per tier follow emit-presets.cjs)
 * \`tables\`: every table listed must exist before the prompt is enabled.
 */

window.GTFS_SQL_PRESET_TIERS = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

window.GTFS_SQL_PRESETS = {
  easy: [
`;

const body = `${header}${fmtArr(out.easy)}
  ],

  medium: [
${fmtArr(out.medium)}
  ],

  hard: [
${fmtArr(out.hard)}
  ],
};
`;

const target = path.join(__dirname, "..", "js", "presets.js");
fs.writeFileSync(target, body, "utf8");
console.log("Wrote", target, `easy=${out.easy.length} medium=${out.medium.length} hard=${out.hard.length}`);
