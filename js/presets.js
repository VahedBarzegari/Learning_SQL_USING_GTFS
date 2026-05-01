/**
 * Starter queries grouped by difficulty (easy / medium / hard).
 * Auto-expanded to 50 examples per tier. Regenerate: node scripts/emit-presets.cjs
 * `tables`: all listed tables must exist in the built DB before the prompt is clickable.
 */

window.GTFS_SQL_PRESET_TIERS = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

window.GTFS_SQL_PRESETS = {
  easy: [
    {
      title: "SQLite — list imported tables",
      tables: [],
      sql: `SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;`,
    },
    {
      title: "SQLite — engine version",
      tables: [],
      sql: `SELECT sqlite_version() AS version;`,
    },
    {
      title: "COUNT rows — stops",
      tables: ["stops"],
      sql: `SELECT COUNT(*) AS n FROM stops;`,
    },
    {
      title: "COUNT rows — routes",
      tables: ["routes"],
      sql: `SELECT COUNT(*) AS n FROM routes;`,
    },
    {
      title: "COUNT rows — trips",
      tables: ["trips"],
      sql: `SELECT COUNT(*) AS n FROM trips;`,
    },
    {
      title: "COUNT rows — agency",
      tables: ["agency"],
      sql: `SELECT COUNT(*) AS n FROM agency;`,
    },
    {
      title: "COUNT rows — calendar",
      tables: ["calendar"],
      sql: `SELECT COUNT(*) AS n FROM calendar;`,
    },
    {
      title: "COUNT rows — calendar_dates",
      tables: ["calendar_dates"],
      sql: `SELECT COUNT(*) AS n FROM calendar_dates;`,
    },
    {
      title: "COUNT DISTINCT route_id in trips",
      tables: ["trips"],
      sql: `SELECT COUNT(DISTINCT route_id) AS route_ids_used FROM trips;`,
    },
    {
      title: "COUNT DISTINCT trip_id",
      tables: ["trips"],
      sql: `SELECT COUNT(DISTINCT trip_id) AS trip_ids FROM trips;`,
    },
    {
      title: "COUNT DISTINCT stop_id (stops file)",
      tables: ["stops"],
      sql: `SELECT COUNT(DISTINCT stop_id) AS stop_ids FROM stops;`,
    },
    {
      title: "Routes sorted by route_id — first batch",
      tables: ["routes"],
      sql: `SELECT route_id, route_short_name FROM routes ORDER BY route_id LIMIT 35;`,
    },
    {
      title: "Routes sorted by short name — first batch",
      tables: ["routes"],
      sql: `SELECT route_id, route_short_name FROM routes ORDER BY route_short_name COLLATE NOCASE LIMIT 35;`,
    },
    {
      title: "Stops A→Z — first batch",
      tables: ["stops"],
      sql: `SELECT stop_id, stop_name FROM stops ORDER BY stop_name COLLATE NOCASE LIMIT 35;`,
    },
    {
      title: "Trips — sample trip_id and headsign",
      tables: ["trips"],
      sql: `SELECT trip_id, route_id, trip_headsign FROM trips LIMIT 40;`,
    },
    {
      title: "Filter — bus route_type = 3",
      tables: ["routes"],
      sql: `SELECT route_id, route_short_name, route_type FROM routes WHERE CAST(route_type AS INTEGER) = 3 LIMIT 35;`,
    },
    {
      title: "Filter stops — names containing “Rd”",
      tables: ["stops"],
      sql: `SELECT stop_id, stop_name FROM stops WHERE stop_name LIKE '%Rd%' LIMIT 30;`,
    },
    {
      title: "Filter stops — latitude string starts with digit",
      tables: ["stops"],
      sql: `SELECT stop_id, stop_lat FROM stops WHERE stop_lat LIKE '4%' LIMIT 25;`,
    },
    {
      title: "Trips WHERE — non-empty trip_headsign",
      tables: ["trips"],
      sql: `SELECT trip_id, trip_headsign FROM trips WHERE trip_headsign IS NOT NULL AND LENGTH(TRIM(trip_headsign)) > 2 LIMIT 30;`,
    },
    {
      title: "ORDER BY + LIMIT — shortest route short names lexically",
      tables: ["routes"],
      sql: `SELECT route_short_name FROM routes ORDER BY LENGTH(route_short_name), route_short_name LIMIT 25;`,
    },
    {
      title: "Pagination — OFFSET on routes",
      tables: ["routes"],
      sql: `SELECT route_id FROM routes ORDER BY route_id LIMIT 8 OFFSET 5;`,
    },
    {
      title: "DISTINCT agency_id values (routes)",
      tables: ["routes"],
      sql: `SELECT DISTINCT agency_id FROM routes WHERE agency_id IS NOT NULL AND TRIM(CAST(agency_id AS TEXT)) != '' ORDER BY agency_id LIMIT 40;`,
    },
    {
      title: "DISTINCT service_id (trips)",
      tables: ["trips"],
      sql: `SELECT DISTINCT service_id FROM trips ORDER BY service_id LIMIT 40;`,
    },
    {
      title: "SQLite CONCAT strings — route label",
      tables: ["routes"],
      sql: `SELECT route_id, route_short_name || ' · ' || route_long_name AS label FROM routes LIMIT 25;`,
    },
    {
      title: "SQLite UPPER on stop name snippet",
      tables: ["stops"],
      sql: `SELECT stop_id, UPPER(SUBSTR(stop_name, 1, 28)) AS start_caps FROM stops LIMIT 25;`,
    },
    {
      title: "SQLite LENGTH(stop_name)",
      tables: ["stops"],
      sql: `SELECT stop_name, LENGTH(stop_name) AS name_len FROM stops ORDER BY name_len DESC LIMIT 25;`,
    },
    {
      title: "Monday services (calendar flag)",
      tables: ["calendar"],
      sql: `SELECT service_id, monday FROM calendar WHERE COALESCE(monday, '0') IN ('1','true') ORDER BY service_id LIMIT 35;`,
    },
    {
      title: "Sunday-only style filter (logical AND flags)",
      tables: ["calendar"],
      sql: `SELECT service_id FROM calendar WHERE sunday IN ('1', 1) AND monday NOT IN ('1', 1) LIMIT 40;`,
    },
    {
      title: "Peek calendar_dates exceptions",
      tables: ["calendar_dates"],
      sql: `SELECT service_id, date, exception_type FROM calendar_dates ORDER BY date LIMIT 40;`,
    },
    {
      title: "Stop_times skim — slice 1 of rows",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 45 OFFSET 0;`,
    },
    {
      title: "Stop_times skim — slice 2 of rows",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 45 OFFSET 200;`,
    },
    {
      title: "Stop_times skim — slice 3 of rows",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 45 OFFSET 400;`,
    },
    {
      title: "Stop_times skim — slice 4 of rows",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 45 OFFSET 600;`,
    },
    {
      title: "Stop_times skim — slice 5 of rows",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 45 OFFSET 800;`,
    },
    {
      title: "Stop_times skim — slice 6 of rows",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 45 OFFSET 1000;`,
    },
    {
      title: "COUNT — stop_times timetable rows",
      tables: ["stop_times"],
      sql: `SELECT COUNT(*) AS n FROM stop_times;`,
    },
    {
      title: "COUNT — transfers rules loaded",
      tables: ["transfers"],
      sql: `SELECT COUNT(*) AS n FROM transfers;`,
    },
    {
      title: "COUNT — frequencies rows",
      tables: ["frequencies"],
      sql: `SELECT COUNT(*) AS n FROM frequencies;`,
    },
    {
      title: "Peek feed_info publisher metadata",
      tables: ["feed_info"],
      sql: `SELECT * FROM feed_info LIMIT 40;`,
    },
    {
      title: "Peek frequencies (headway-based service)",
      tables: ["frequencies"],
      sql: `SELECT trip_id, start_time, end_time, headway_secs FROM frequencies LIMIT 55;`,
    },
    {
      title: "Peek fare_attributes pricing metadata",
      tables: ["fare_attributes"],
      sql: `SELECT * FROM fare_attributes LIMIT 55;`,
    },
    {
      title: "Peek fare_rules applicability",
      tables: ["fare_rules"],
      sql: `SELECT * FROM fare_rules LIMIT 65;`,
    },
    {
      title: "Skim shapes (polyline vertices; large file if imported)",
      tables: ["shapes"],
      sql: `SELECT shape_id, shape_pt_lat, shape_pt_lon FROM shapes ORDER BY shape_id, shape_pt_sequence LIMIT 50;`,
    },
    {
      title: "Trips — DISTINCT shape_id samples",
      tables: ["trips"],
      sql: `SELECT DISTINCT shape_id FROM trips WHERE shape_id IS NOT NULL AND TRIM(CAST(shape_id AS TEXT)) != '' LIMIT 50;`,
    },
    {
      title: "Routes — DISTINCT branded colors",
      tables: ["routes"],
      sql: `SELECT DISTINCT route_color FROM routes ORDER BY route_color LIMIT 60;`,
    },
    {
      title: "Routes — DISTINCT passenger text colors",
      tables: ["routes"],
      sql: `SELECT DISTINCT route_text_color FROM routes ORDER BY route_text_color LIMIT 60;`,
    },
    {
      title: "Stops — typeof() on geographic columns",
      tables: ["stops"],
      sql: `SELECT typeof(stop_lat) AS lat_sqlite_type,
typeof(stop_lon) AS lon_sqlite_type
FROM stops
LIMIT 25;`,
    },
    {
      title: "Stop_times — morning blocks only (lexical time compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time
FROM stop_times
WHERE departure_time >= '05:00:00' AND departure_time < '08:59:59'
ORDER BY departure_time ASC
LIMIT 45;`,
    },
    {
      title: "UNION stacked tallies — routes versus stops counts",
      tables: ["routes","stops"],
      sql: `SELECT 'routes' AS layer,
CAST(COUNT(*) AS TEXT) AS qty
FROM routes
UNION ALL
SELECT 'stops', CAST(COUNT(*) AS TEXT) FROM stops;`,
    },
    {
      title: "SQLite — quote() safe string escaping demo",
      tables: [],
      sql: `SELECT quote('single-quoted literals') AS safe_literal;`,
    }
  ],

  medium: [
    {
      title: "Join trips × routes — trip counts by route_short_name",
      tables: ["trips","routes"],
      sql: `SELECT r.route_short_name,
COUNT(t.trip_id) AS trip_rows
FROM trips AS t
JOIN routes AS r ON r.route_id = t.route_id
GROUP BY r.route_short_name
ORDER BY trip_rows DESC
LIMIT 25;`,
    },
    {
      title: "LEFT JOIN orphans — routes with zero trips",
      tables: ["routes","trips"],
      sql: `SELECT r.route_id, r.route_short_name, COUNT(t.trip_id) AS trip_rows
FROM routes AS r
LEFT JOIN trips AS t ON t.route_id = r.route_id
GROUP BY r.route_id, r.route_short_name
HAVING COUNT(t.trip_id) = 0
LIMIT 35;`,
    },
    {
      title: "GROUP BY calendar exception_type counts",
      tables: ["calendar_dates"],
      sql: `SELECT exception_type, COUNT(*) AS n FROM calendar_dates GROUP BY exception_type;`,
    },
    {
      title: "GROUP BY weekday pattern — Sundays on calendar × trips",
      tables: ["calendar","trips"],
      sql: `SELECT c.sunday,
COUNT(t.trip_id) AS trips
FROM calendar AS c
JOIN trips AS t ON t.service_id = c.service_id
GROUP BY c.sunday
ORDER BY trips DESC
LIMIT 10;`,
    },
    {
      title: "Geo box with CAST(stop_lat/long AS REAL)",
      tables: ["stops"],
      sql: `SELECT stop_id, stop_lat, stop_lon
FROM stops
WHERE CAST(stop_lat AS REAL) BETWEEN 43 AND 44
AND CAST(stop_lon AS REAL) BETWEEN -80 AND -79
LIMIT 40;`,
    },
    {
      title: "Trip volume by direction_id = 0",
      tables: ["trips"],
      sql: `SELECT COUNT(*) AS n FROM trips WHERE direction_id IS NOT NULL AND CAST(direction_id AS INTEGER) = 0;`,
    },
    {
      title: "Trip volume by direction_id = 1",
      tables: ["trips"],
      sql: `SELECT COUNT(*) AS n FROM trips WHERE direction_id IS NOT NULL AND CAST(direction_id AS INTEGER) = 1;`,
    },
    {
      title: "JOIN trips and routes sample flat rows",
      tables: ["trips","routes"],
      sql: `SELECT r.route_short_name, t.service_id, t.direction_id FROM trips AS t JOIN routes AS r ON r.route_id = t.route_id ORDER BY trip_id LIMIT 40;`,
    },
    {
      title: "IN subquery — trips for first N route ids",
      tables: ["trips"],
      sql: `SELECT trip_id FROM trips WHERE route_id IN (SELECT route_id FROM trips GROUP BY route_id ORDER BY COUNT(*) DESC LIMIT 3) LIMIT 40;`,
    },
    {
      title: "EXISTS — routes referenced by trips",
      tables: ["routes","trips"],
      sql: `SELECT r.route_id FROM routes AS r WHERE EXISTS (SELECT 1 FROM trips AS t WHERE t.route_id = r.route_id) LIMIT 25;`,
    },
    {
      title: "CASE labeling route_type (small taxonomy)",
      tables: ["routes"],
      sql: `SELECT route_short_name, route_type,
CASE CAST(route_type AS INTEGER)
  WHEN 3 THEN 'bus'
  WHEN 0 THEN 'tram'
  ELSE 'other'
END AS readable
FROM routes LIMIT 35;`,
    },
    {
      title: "COALESCE headline from short or long route name",
      tables: ["routes"],
      sql: `SELECT route_id,
COALESCE(NULLIF(TRIM(route_short_name), ''), route_long_name) AS display_name
FROM routes LIMIT 30;`,
    },
    {
      title: "HAVING — services with substantive trip volumes",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) AS trips FROM trips GROUP BY service_id HAVING COUNT(*) > 50 ORDER BY trips DESC LIMIT 20;`,
    },
    {
      title: "Stop_times post-midnight departures bucket",
      tables: ["stop_times"],
      sql: `SELECT COUNT(*) AS n FROM stop_times WHERE departure_time >= '24:00:00';`,
    },
    {
      title: "Morning departures — between 6:00:00 and 7:00:00 (TEXT compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '6:00:00' AND departure_time < '7:00:00' LIMIT 35;`,
    },
    {
      title: "Morning departures — between 7:00:00 and 8:00:00 (TEXT compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '7:00:00' AND departure_time < '8:00:00' LIMIT 35;`,
    },
    {
      title: "Morning departures — between 8:00:00 and 9:00:00 (TEXT compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '8:00:00' AND departure_time < '9:00:00' LIMIT 35;`,
    },
    {
      title: "Morning departures — between 9:00:00 and 10:00:00 (TEXT compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '9:00:00' AND departure_time < '10:00:00' LIMIT 35;`,
    },
    {
      title: "Morning departures — between 10:00:00 and 11:00:00 (TEXT compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '10:00:00' AND departure_time < '11:00:00' LIMIT 35;`,
    },
    {
      title: "Join transfer rules with from_stop name",
      tables: ["transfers","stops"],
      sql: `SELECT tf.from_stop_id, s.stop_name
FROM transfers AS tf
JOIN stops AS s ON s.stop_id = tf.from_stop_id
LIMIT 35;`,
    },
    {
      title: "Transfers grouped by transfer_type value",
      tables: ["transfers"],
      sql: `SELECT transfer_type, COUNT(*) AS rows FROM transfers GROUP BY transfer_type;`,
    },
    {
      title: "Busiest boarding stops sample (trips counted)",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(*) AS pickups FROM stop_times GROUP BY stop_id ORDER BY pickups DESC LIMIT 25;`,
    },
    {
      title: "First stop_sequence per trip (aggregate MIN fallback)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, MIN(CAST(stop_sequence AS INTEGER)) AS first_seq FROM stop_times GROUP BY trip_id ORDER BY trip_id LIMIT 40;`,
    },
    {
      title: "JOIN calendar when weekend window",
      tables: ["calendar","trips"],
      sql: `SELECT c.friday,
SUM(CASE WHEN t.service_id IS NOT NULL THEN 1 ELSE 0 END) AS svc_trips
FROM calendar AS c
JOIN trips AS t ON c.service_id = t.service_id
GROUP BY c.friday
LIMIT 15;`,
    },
    {
      title: "JOIN agency to routes aggregate",
      tables: ["agency","routes"],
      sql: `SELECT a.agency_name, COUNT(*) AS routes FROM routes AS r LEFT JOIN agency AS a ON CAST(a.agency_id AS TEXT) = CAST(r.agency_id AS TEXT) GROUP BY a.agency_name ORDER BY routes DESC LIMIT 15;`,
    },
    {
      title: "Service trip density rank 1..25",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 0;`,
    },
    {
      title: "Service trip density rank 2..26",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 1;`,
    },
    {
      title: "Service trip density rank 3..27",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 2;`,
    },
    {
      title: "Service trip density rank 4..28",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 3;`,
    },
    {
      title: "Service trip density rank 5..29",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 4;`,
    },
    {
      title: "Service trip density rank 6..30",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 5;`,
    },
    {
      title: "Service trip density rank 7..31",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 6;`,
    },
    {
      title: "Service trip density rank 8..32",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 7;`,
    },
    {
      title: "Service trip density rank 9..33",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 8;`,
    },
    {
      title: "Service trip density rank 10..34",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 9;`,
    },
    {
      title: "Service trip density rank 11..35",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 10;`,
    },
    {
      title: "Service trip density rank 12..36",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 11;`,
    },
    {
      title: "Service trip density rank 13..37",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 12;`,
    },
    {
      title: "Service trip density rank 14..38",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 13;`,
    },
    {
      title: "Service trip density rank 15..39",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 14;`,
    },
    {
      title: "Service trip density rank 16..40",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 15;`,
    },
    {
      title: "Service trip density rank 17..41",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 16;`,
    },
    {
      title: "Service trip density rank 18..42",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 17;`,
    },
    {
      title: "Service trip density rank 19..43",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 18;`,
    },
    {
      title: "Service trip density rank 20..44",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 19;`,
    },
    {
      title: "Service trip density rank 21..45",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 20;`,
    },
    {
      title: "Service trip density rank 22..46",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 21;`,
    },
    {
      title: "Service trip density rank 23..47",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 22;`,
    },
    {
      title: "Service trip density rank 24..48",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 23;`,
    },
    {
      title: "Service trip density rank 25..49",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 15 OFFSET 24;`,
    }
  ],

  hard: [
    {
      title: "CTE — average trips per route",
      tables: ["trips"],
      sql: `WITH c AS (
SELECT route_id, COUNT(*) trips FROM trips GROUP BY route_id
)
SELECT AVG(CAST(trips AS REAL)) AS avg_trips_per_route FROM c;`,
    },
    {
      title: "CTE chain — totals then average comparison",
      tables: ["trips"],
      sql: `WITH svc AS (
SELECT service_id, COUNT(*) trips FROM trips GROUP BY service_id
)
SELECT service_id,
trips,
(SELECT AVG(trips) FROM svc) avg_all
FROM svc
ORDER BY trips DESC
LIMIT 30;`,
    },
    {
      title: "WINDOW ROW_NUMBER → first timetable stop per trip",
      tables: ["stop_times","stops"],
      sql: `SELECT sub.trip_id, sub.departure_time, s.stop_name
FROM (
SELECT trip_id, stop_id, departure_time,
ROW_NUMBER() OVER (PARTITION BY trip_id ORDER BY CAST(stop_sequence AS INTEGER)) rn
FROM stop_times
) sub
JOIN stops s ON s.stop_id = sub.stop_id
WHERE sub.rn = 1
LIMIT 40;`,
    },
    {
      title: "WINDOW ROW_NUMBER → last timetable stop per trip",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time, stop_sequence
FROM (
SELECT trip_id, departure_time, stop_sequence,
ROW_NUMBER() OVER (PARTITION BY trip_id ORDER BY CAST(stop_sequence AS INTEGER) DESC) rn
FROM stop_times
)
WHERE rn = 1
LIMIT 40;`,
    },
    {
      title: "DISTINCT trip count ranking by calendar service_id",
      tables: ["calendar","trips"],
      sql: `SELECT c.service_id,
COUNT(DISTINCT t.trip_id) trips_distinct
FROM calendar c
JOIN trips t ON c.service_id = t.service_id
GROUP BY c.service_id
ORDER BY trips_distinct DESC
LIMIT 30;`,
    },
    {
      title: "Rolling route leaderboard — ROW_NUMBER dense",
      tables: ["routes","trips"],
      sql: `WITH rc AS (
SELECT r.route_id, r.route_short_name, COUNT(t.trip_id) cnt
FROM routes r
JOIN trips t ON t.route_id = r.route_id
GROUP BY r.route_id, r.route_short_name
)
SELECT route_short_name, cnt,
ROW_NUMBER() OVER (ORDER BY cnt DESC) place
FROM rc
LIMIT 25;`,
    },
    {
      title: "Correlation-style — timetable rows versus trip cardinality",
      tables: ["trips","stop_times"],
      sql: `SELECT COUNT(DISTINCT t.trip_id) trips_present,
COUNT(*) timetable_rows,
CAST(COUNT(*) AS REAL)/NULLIF(COUNT(DISTINCT t.trip_id),0) rows_per_trip_approx
FROM trips t
JOIN stop_times st ON st.trip_id = t.trip_id;`,
    },
    {
      title: "THREE-WAY rollup — routes + trips + stop_times",
      tables: ["routes","trips","stop_times"],
      sql: `SELECT r.route_short_name,
COUNT(DISTINCT t.trip_id) trips,
COUNT(DISTINCT st.stop_id) stops_in_path,
COUNT(*) tt_rows
FROM routes r
JOIN trips t ON t.route_id = r.route_id
JOIN stop_times st ON st.trip_id = t.trip_id
GROUP BY r.route_short_name
ORDER BY tt_rows DESC
LIMIT 20;`,
    },
    {
      title: "UNION stack — cardinality snapshot",
      tables: ["routes","trips","stops","stop_times"],
      sql: `SELECT 'routes', COUNT(*) FROM routes
UNION ALL SELECT 'trips', COUNT(*) FROM trips
UNION ALL SELECT 'stops', COUNT(*) FROM stops
UNION ALL SELECT 'stop_times', COUNT(*) FROM stop_times;`,
    },
    {
      title: "Above-average routes (scalar subqueries)",
      tables: ["routes","trips"],
      sql: `WITH totals AS (
SELECT route_id, COUNT(*) ct FROM trips GROUP BY route_id
)
SELECT r.route_short_name, t.ct
FROM totals t JOIN routes r ON r.route_id = t.route_id
WHERE CAST(t.ct AS REAL) > (SELECT AVG(CAST(ct AS REAL)) FROM totals)
ORDER BY ct DESC
LIMIT 30;`,
    },
    {
      title: "Correlated COUNT — timetable rows referencing each stop stop_id",
      tables: ["stops"],
      sql: `SELECT s.stop_id,
(SELECT COUNT(*) FROM stop_times AS st WHERE st.stop_id = s.stop_id) AS visits
FROM stops AS s
ORDER BY visits DESC
LIMIT 30;`,
    },
    {
      title: "Transfers fan-out aggregated per from_stop_id",
      tables: ["transfers"],
      sql: `SELECT from_stop_id, COUNT(*) out_edges FROM transfers GROUP BY from_stop_id ORDER BY out_edges DESC LIMIT 30;`,
    },
    {
      title: "Transfers fan-in aggregated per to_stop_id",
      tables: ["transfers"],
      sql: `SELECT to_stop_id, COUNT(*) inbound FROM transfers GROUP BY to_stop_id ORDER BY inbound DESC LIMIT 30;`,
    },
    {
      title: "Quartiles on trip_counts per route (window NTILE)",
      tables: ["trips"],
      sql: `WITH rc AS (
  SELECT route_id, COUNT(*) AS ct FROM trips GROUP BY route_id
)
SELECT bucket, COUNT(*) AS routes_in_bucket
FROM (
  SELECT NTILE(4) OVER (ORDER BY ct) AS bucket FROM rc
) AS quartiles
GROUP BY bucket
ORDER BY bucket;`,
    },
    {
      title: "LAG-style via self-join neighbouring stop_sequence (+1)",
      tables: ["stop_times"],
      sql: `SELECT a.trip_id,
a.departure_time AS dep_here,
b.departure_time AS dep_next,
a.stop_sequence current_seq,
b.stop_sequence next_seq
FROM stop_times a
JOIN stop_times b
ON b.trip_id = a.trip_id
AND CAST(b.stop_sequence AS INTEGER) = CAST(a.stop_sequence AS INTEGER) + 1
LIMIT 35;`,
    },
    {
      title: "Calendar coverage join — widest date span per service_id",
      tables: ["calendar"],
      sql: `SELECT service_id,
CAST(start_date AS INTEGER) sd,
CAST(end_date AS INTEGER) ed,
CAST(end_date AS INTEGER) - CAST(start_date AS INTEGER) span_days_approx
FROM calendar
ORDER BY span_days_approx DESC
LIMIT 25;`,
    },
    {
      title: "EXCEPTION heavy services — LEFT JOIN aggregate",
      tables: ["calendar_dates","trips"],
      sql: `SELECT cd.service_id, COUNT(cd.date) exc_rows
FROM calendar_dates cd
LEFT JOIN trips t ON t.service_id = cd.service_id
GROUP BY cd.service_id
ORDER BY exc_rows DESC
LIMIT 30;`,
    },
    {
      title: "PRAGMA schema for trips",
      tables: ["trips"],
      sql: `PRAGMA table_info(trips);`,
    },
    {
      title: "Ranked stop visits window slice 1",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 0;`,
    },
    {
      title: "Ranked stop visits window slice 2",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 3;`,
    },
    {
      title: "Ranked stop visits window slice 3",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 6;`,
    },
    {
      title: "Ranked stop visits window slice 4",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 9;`,
    },
    {
      title: "Ranked stop visits window slice 5",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 12;`,
    },
    {
      title: "Ranked stop visits window slice 6",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 15;`,
    },
    {
      title: "Ranked stop visits window slice 7",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 18;`,
    },
    {
      title: "Ranked stop visits window slice 8",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 21;`,
    },
    {
      title: "Ranked stop visits window slice 9",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 24;`,
    },
    {
      title: "Ranked stop visits window slice 10",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 27;`,
    },
    {
      title: "Ranked stop visits window slice 11",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 30;`,
    },
    {
      title: "Ranked stop visits window slice 12",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 33;`,
    },
    {
      title: "Ranked stop visits window slice 13",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 36;`,
    },
    {
      title: "Ranked stop visits window slice 14",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 39;`,
    },
    {
      title: "Ranked stop visits window slice 15",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 42;`,
    },
    {
      title: "Ranked stop visits window slice 16",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 45;`,
    },
    {
      title: "Ranked stop visits window slice 17",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 48;`,
    },
    {
      title: "Ranked stop visits window slice 18",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 51;`,
    },
    {
      title: "Ranked stop visits window slice 19",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 54;`,
    },
    {
      title: "Ranked stop visits window slice 20",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 57;`,
    },
    {
      title: "Ranked stop visits window slice 21",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 60;`,
    },
    {
      title: "Ranked stop visits window slice 22",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 63;`,
    },
    {
      title: "Ranked stop visits window slice 23",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 66;`,
    },
    {
      title: "Ranked stop visits window slice 24",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 69;`,
    },
    {
      title: "Ranked stop visits window slice 25",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 72;`,
    },
    {
      title: "Ranked stop visits window slice 26",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 75;`,
    },
    {
      title: "Ranked stop visits window slice 27",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 78;`,
    },
    {
      title: "Ranked stop visits window slice 28",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 81;`,
    },
    {
      title: "Ranked stop visits window slice 29",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 84;`,
    },
    {
      title: "Ranked stop visits window slice 30",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 87;`,
    },
    {
      title: "Ranked stop visits window slice 31",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 90;`,
    },
    {
      title: "Ranked stop visits window slice 32",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) hits
FROM stop_times
GROUP BY stop_id
ORDER BY hits DESC
LIMIT 20 OFFSET 93;`,
    }
  ],
};
