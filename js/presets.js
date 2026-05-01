/**
 * Starter queries grouped by difficulty (easy / medium / hard).
 * Regenerate: node scripts/emit-presets.cjs (counts per tier follow emit-presets.cjs)
 * `tables`: every table listed must exist before the prompt is enabled.
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
      title: "Peek stop_times — ordered timetable sample",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_sequence, departure_time FROM stop_times ORDER BY trip_id, stop_sequence LIMIT 50;`,
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
    },
    {
      title: "Show all routes",
      tables: ["routes"],
      sql: `SELECT * FROM routes;`,
    },
    {
      title: "Show route_id and route_long_name",
      tables: ["routes"],
      sql: `SELECT route_id, route_long_name FROM routes;`,
    },
    {
      title: "Show first 10 stops",
      tables: ["stops"],
      sql: `SELECT * FROM stops LIMIT 10;`,
    },
    {
      title: "Show all trips",
      tables: ["trips"],
      sql: `SELECT * FROM trips;`,
    },
    {
      title: "Show stop names only",
      tables: ["stops"],
      sql: `SELECT stop_name FROM stops;`,
    },
    {
      title: "Show route types",
      tables: ["routes"],
      sql: `SELECT route_type FROM routes;`,
    },
    {
      title: "Show agency info",
      tables: ["agency"],
      sql: `SELECT * FROM agency;`,
    },
    {
      title: "Show unique route types",
      tables: ["routes"],
      sql: `SELECT DISTINCT route_type FROM routes;`,
    },
    {
      title: "Show unique stop names",
      tables: ["stops"],
      sql: `SELECT DISTINCT stop_name FROM stops;`,
    },
    {
      title: "Show first 5 trips",
      tables: ["trips"],
      sql: `SELECT * FROM trips LIMIT 5;`,
    },
    {
      title: "Find all bus routes",
      tables: ["routes"],
      sql: `SELECT * FROM routes WHERE route_type = 3;`,
    },
    {
      title: "Find stops containing 'Toronto'",
      tables: ["stops"],
      sql: `SELECT * FROM stops WHERE stop_name LIKE '%Toronto%';`,
    },
    {
      title: "Trips for route 10",
      tables: ["trips"],
      sql: `SELECT * FROM trips WHERE route_id = '10';`,
    },
    {
      title: "Stops with latitude > 43.7",
      tables: ["stops"],
      sql: `SELECT * FROM stops WHERE stop_lat > 43.7;`,
    },
    {
      title: "Stop times for a trip",
      tables: ["stop_times"],
      sql: `SELECT * FROM stop_times WHERE trip_id = '1001';`,
    },
    {
      title: "Routes starting with 5",
      tables: ["routes"],
      sql: `SELECT * FROM routes WHERE route_short_name LIKE '5%';`,
    },
    {
      title: "Trips direction 0",
      tables: ["trips"],
      sql: `SELECT * FROM trips WHERE direction_id = 0;`,
    },
    {
      title: "Stops with 'Station'",
      tables: ["stops"],
      sql: `SELECT * FROM stops WHERE stop_name LIKE '%Station%';`,
    },
    {
      title: "Trips with WEEKDAY service",
      tables: ["trips"],
      sql: `SELECT * FROM trips WHERE service_id = 'WEEKDAY';`,
    },
    {
      title: "Stop_times first stops",
      tables: ["stop_times"],
      sql: `SELECT * FROM stop_times WHERE stop_sequence = 1;`,
    },
    {
      title: "Sort stops by name",
      tables: ["stops"],
      sql: `SELECT * FROM stops ORDER BY stop_name;`,
    },
    {
      title: "Sort routes descending",
      tables: ["routes"],
      sql: `SELECT * FROM routes ORDER BY route_id DESC;`,
    },
    {
      title: "Sort trips by route",
      tables: ["trips"],
      sql: `SELECT * FROM trips ORDER BY route_id;`,
    },
    {
      title: "Sort stops by latitude",
      tables: ["stops"],
      sql: `SELECT * FROM stops ORDER BY stop_lat DESC;`,
    },
    {
      title: "Sort stop_times",
      tables: ["stop_times"],
      sql: `SELECT * FROM stop_times ORDER BY trip_id, stop_sequence;`,
    },
    {
      title: "Count routes",
      tables: ["routes"],
      sql: `SELECT COUNT(*) FROM routes;`,
    },
    {
      title: "Count stops",
      tables: ["stops"],
      sql: `SELECT COUNT(*) FROM stops;`,
    },
    {
      title: "Trips per route",
      tables: ["trips"],
      sql: `SELECT route_id, COUNT(*) FROM trips GROUP BY route_id;`,
    },
    {
      title: "Stops per trip",
      tables: ["stop_times"],
      sql: `SELECT trip_id, COUNT(*) FROM stop_times GROUP BY trip_id;`,
    },
    {
      title: "Distinct route types count",
      tables: ["routes"],
      sql: `SELECT COUNT(DISTINCT route_type) FROM routes;`,
    },
    {
      title: "Count station stops",
      tables: ["stops"],
      sql: `SELECT COUNT(*) FROM stops WHERE stop_name LIKE '%Station%';`,
    },
    {
      title: "Max stop_sequence",
      tables: ["stop_times"],
      sql: `SELECT MAX(stop_sequence) FROM stop_times;`,
    },
    {
      title: "Min stop_sequence",
      tables: ["stop_times"],
      sql: `SELECT MIN(stop_sequence) FROM stop_times;`,
    },
    {
      title: "Avg stop_sequence",
      tables: ["stop_times"],
      sql: `SELECT AVG(stop_sequence) FROM stop_times;`,
    },
    {
      title: "Trips per service",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) FROM trips GROUP BY service_id;`,
    },
    {
      title: "Routes with >10 trips",
      tables: ["trips"],
      sql: `SELECT route_id, COUNT(*) FROM trips GROUP BY route_id HAVING COUNT(*) > 10;`,
    },
    {
      title: "Trips with >20 stops",
      tables: ["stop_times"],
      sql: `SELECT trip_id, COUNT(*) FROM stop_times GROUP BY trip_id HAVING COUNT(*) > 20;`,
    },
    {
      title: "Duplicate route names",
      tables: ["routes"],
      sql: `SELECT route_long_name, COUNT(DISTINCT route_id) FROM routes GROUP BY route_long_name HAVING COUNT(DISTINCT route_id) > 1;`,
    },
    {
      title: "Busy stops",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(*) FROM stop_times GROUP BY stop_id HAVING COUNT(*) > 50;`,
    },
    {
      title: "Busy services",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) FROM trips GROUP BY service_id HAVING COUNT(*) > 100;`,
    },
    {
      title: "Route type counts",
      tables: ["routes"],
      sql: `SELECT route_type, COUNT(*) FROM routes GROUP BY route_type;`,
    },
    {
      title: "Stops grouped by name",
      tables: ["stops"],
      sql: `SELECT stop_name, COUNT(*) FROM stops GROUP BY stop_name;`,
    },
    {
      title: "Trips per direction",
      tables: ["trips"],
      sql: `SELECT direction_id, COUNT(*) FROM trips GROUP BY direction_id;`,
    },
    {
      title: "Duplicate stop names",
      tables: ["stops"],
      sql: `SELECT stop_name, COUNT(*) FROM stops GROUP BY stop_name HAVING COUNT(*) > 1;`,
    },
    {
      title: "Stops per route",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, COUNT(*) FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY t.route_id;`,
    },
    {
      title: "Trips with route names",
      tables: ["routes","trips"],
      sql: `SELECT t.trip_id, r.route_long_name FROM trips t JOIN routes r ON t.route_id = r.route_id;`,
    },
    {
      title: "Stop names per trip",
      tables: ["stops","stop_times"],
      sql: `SELECT st.trip_id, s.stop_name FROM stop_times st JOIN stops s ON st.stop_id = s.stop_id;`,
    },
    {
      title: "Trip with short name",
      tables: ["routes","trips"],
      sql: `SELECT t.trip_id, r.route_short_name FROM trips t JOIN routes r ON t.route_id = r.route_id;`,
    },
    {
      title: "Stop sequence for trip",
      tables: ["stops","stop_times"],
      sql: `SELECT st.stop_sequence, s.stop_name FROM stop_times st JOIN stops s ON st.stop_id = s.stop_id WHERE st.trip_id = '1001' ORDER BY st.stop_sequence;`,
    },
    {
      title: "Count stops per route",
      tables: ["routes","trips","stop_times"],
      sql: `SELECT r.route_id, COUNT(*) FROM routes r JOIN trips t ON r.route_id = t.route_id JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY r.route_id;`,
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
      title: "Trips aggregated by direction_id",
      tables: ["trips"],
      sql: `SELECT direction_id, COUNT(*) AS trips FROM trips GROUP BY direction_id ORDER BY CAST(direction_id AS INTEGER);`,
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
      title: "Stop_times morning window (TEXT time compare)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, departure_time FROM stop_times WHERE departure_time >= '06:00:00' AND departure_time < '11:00:00' ORDER BY departure_time LIMIT 50;`,
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
      title: "Top calendar services ranked by scheduled trip totals",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) AS trips FROM trips GROUP BY service_id ORDER BY trips DESC LIMIT 25;`,
    },
    {
      title: "Count trips per route ordered descending",
      tables: ["trips"],
      sql: `SELECT route_id, COUNT(*) AS trips FROM trips GROUP BY route_id ORDER BY trips DESC;`,
    },
    {
      title: "Find routes with no trips",
      tables: ["routes","trips"],
      sql: `SELECT r.route_id FROM routes r LEFT JOIN trips t ON r.route_id = t.route_id WHERE t.trip_id IS NULL;`,
    },
    {
      title: "Count stops per route (distinct)",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, COUNT(DISTINCT st.stop_id) FROM trips t JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY t.route_id;`,
    },
    {
      title: "Find trips with maximum stops",
      tables: ["stop_times"],
      sql: `SELECT trip_id, COUNT(*) AS stops FROM stop_times GROUP BY trip_id ORDER BY stops DESC LIMIT 5;`,
    },
    {
      title: "First stop of each trip",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_id FROM stop_times WHERE stop_sequence = 1;`,
    },
    {
      title: "Last stop of each trip",
      tables: ["stop_times"],
      sql: `SELECT trip_id, stop_id FROM stop_times WHERE stop_sequence = (SELECT MAX(stop_sequence) FROM stop_times st2 WHERE st2.trip_id = stop_times.trip_id);`,
    },
    {
      title: "Join trips with routes and filter buses",
      tables: ["routes","trips"],
      sql: `SELECT t.trip_id, r.route_long_name FROM trips t JOIN routes r ON t.route_id = r.route_id WHERE r.route_type = 3;`,
    },
    {
      title: "Count trips per direction",
      tables: ["trips"],
      sql: `SELECT route_id, direction_id, COUNT(*) FROM trips GROUP BY route_id, direction_id;`,
    },
    {
      title: "Find stops used by most trips",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) AS trips FROM stop_times GROUP BY stop_id ORDER BY trips DESC LIMIT 10;`,
    },
    {
      title: "Average stops per trip",
      tables: ["stop_times"],
      sql: `SELECT AVG(cnt) FROM (SELECT trip_id, COUNT(*) AS cnt FROM stop_times GROUP BY trip_id);`,
    },
    {
      title: "Trips with duplicate stop_sequence",
      tables: ["stop_times"],
      sql: `SELECT trip_id FROM stop_times GROUP BY trip_id, stop_sequence HAVING COUNT(*) > 1;`,
    },
    {
      title: "Routes with both directions",
      tables: ["trips"],
      sql: `SELECT route_id FROM trips GROUP BY route_id HAVING COUNT(DISTINCT direction_id) = 2;`,
    },
    {
      title: "Count trips per service_id ordered",
      tables: ["trips"],
      sql: `SELECT service_id, COUNT(*) FROM trips GROUP BY service_id ORDER BY COUNT(*) DESC;`,
    },
    {
      title: "Stops not used in stop_times",
      tables: ["stops","stop_times"],
      sql: `SELECT s.stop_id FROM stops s LEFT JOIN stop_times st ON s.stop_id = st.stop_id WHERE st.stop_id IS NULL;`,
    },
    {
      title: "Trips with missing stop_sequence",
      tables: ["stop_times"],
      sql: `SELECT * FROM stop_times WHERE stop_sequence IS NULL;`,
    },
    {
      title: "Find earliest departure per trip",
      tables: ["stop_times"],
      sql: `SELECT trip_id, MIN(departure_time) FROM stop_times GROUP BY trip_id;`,
    },
    {
      title: "Find latest departure per trip",
      tables: ["stop_times"],
      sql: `SELECT trip_id, MAX(departure_time) FROM stop_times GROUP BY trip_id;`,
    },
    {
      title: "Trips with only one stop",
      tables: ["stop_times"],
      sql: `SELECT trip_id FROM stop_times GROUP BY trip_id HAVING COUNT(*) = 1;`,
    },
    {
      title: "Count stops per route and direction",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, t.direction_id, COUNT(*) FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY t.route_id, t.direction_id;`,
    },
    {
      title: "Find most common stop name",
      tables: ["stops"],
      sql: `SELECT stop_name, COUNT(*) FROM stops GROUP BY stop_name ORDER BY COUNT(*) DESC LIMIT 1;`,
    },
    {
      title: "Routes sharing same long name",
      tables: ["routes"],
      sql: `SELECT route_long_name, COUNT(*) FROM routes GROUP BY route_long_name HAVING COUNT(*) > 1;`,
    },
    {
      title: "Trips per route ordered",
      tables: ["trips"],
      sql: `SELECT route_id, COUNT(*) FROM trips GROUP BY route_id ORDER BY COUNT(*) DESC;`,
    },
    {
      title: "Stops appearing in multiple routes",
      tables: ["trips","stop_times"],
      sql: `SELECT st.stop_id FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY st.stop_id HAVING COUNT(DISTINCT t.route_id) > 1;`,
    },
    {
      title: "Trips with same stop pattern count",
      tables: ["stop_times"],
      sql: `SELECT COUNT(*) FROM (SELECT trip_id, GROUP_CONCAT(stop_id) FROM stop_times GROUP BY trip_id);`,
    },
    {
      title: "Count distinct stops per service",
      tables: ["trips","stop_times"],
      sql: `SELECT t.service_id, COUNT(DISTINCT st.stop_id) FROM trips t JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY t.service_id;`,
    },
    {
      title: "Find busiest route by stop_times",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, COUNT(*) FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY t.route_id ORDER BY COUNT(*) DESC LIMIT 1;`,
    },
    {
      title: "Trips with gaps in stop_sequence",
      tables: ["stop_times"],
      sql: `SELECT trip_id FROM stop_times GROUP BY trip_id HAVING MAX(stop_sequence) - COUNT(*) > 0;`,
    },
    {
      title: "Stops with highest sequence number",
      tables: ["stop_times"],
      sql: `SELECT stop_id, MAX(stop_sequence) FROM stop_times GROUP BY stop_id ORDER BY MAX(stop_sequence) DESC LIMIT 5;`,
    },
    {
      title: "Trips sorted by number of stops",
      tables: ["stop_times"],
      sql: `SELECT trip_id, COUNT(*) FROM stop_times GROUP BY trip_id ORDER BY COUNT(*) DESC;`,
    },
    {
      title: "Count routes per agency",
      tables: ["routes"],
      sql: `SELECT agency_id, COUNT(*) FROM routes GROUP BY agency_id;`,
    },
    {
      title: "Trips without stop_times",
      tables: ["trips","stop_times"],
      sql: `SELECT t.trip_id FROM trips t LEFT JOIN stop_times st ON t.trip_id = st.trip_id WHERE st.trip_id IS NULL;`,
    },
    {
      title: "Find route with most trips",
      tables: ["trips"],
      sql: `SELECT route_id FROM trips GROUP BY route_id ORDER BY COUNT(*) DESC LIMIT 1;`,
    },
    {
      title: "Stops used by only one trip",
      tables: ["stop_times"],
      sql: `SELECT stop_id FROM stop_times GROUP BY stop_id HAVING COUNT(DISTINCT trip_id) = 1;`,
    },
    {
      title: "Trips per hour (if time exists)",
      tables: ["stop_times"],
      sql: `SELECT SUBSTR(departure_time,1,2) AS hour, COUNT(*) FROM stop_times GROUP BY hour;`,
    },
    {
      title: "Find routes with no stops",
      tables: ["routes","trips","stop_times"],
      sql: `SELECT r.route_id FROM routes r LEFT JOIN trips t ON r.route_id = t.route_id LEFT JOIN stop_times st ON t.trip_id = st.trip_id WHERE st.stop_id IS NULL;`,
    },
    {
      title: "Trips with same first stop",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(*) FROM stop_times WHERE stop_sequence = 1 GROUP BY stop_id ORDER BY COUNT(*) DESC;`,
    },
    {
      title: "Trips with same last stop",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(*) FROM stop_times WHERE stop_sequence = (SELECT MAX(stop_sequence) FROM stop_times st2 WHERE st2.trip_id = stop_times.trip_id) GROUP BY stop_id ORDER BY COUNT(*) DESC;`,
    },
    {
      title: "Count stops per route_long_name",
      tables: ["routes","trips","stop_times"],
      sql: `SELECT r.route_long_name, COUNT(*) FROM routes r JOIN trips t ON r.route_id = t.route_id JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY r.route_long_name;`,
    },
    {
      title: "Trips with no direction_id",
      tables: ["trips"],
      sql: `SELECT * FROM trips WHERE direction_id IS NULL;`,
    },
    {
      title: "Count trips per route_type",
      tables: ["routes","trips"],
      sql: `SELECT r.route_type, COUNT(*) FROM trips t JOIN routes r ON t.route_id = r.route_id GROUP BY r.route_type;`,
    },
    {
      title: "Stops grouped by latitude band",
      tables: ["stops"],
      sql: `SELECT ROUND(stop_lat,1), COUNT(*) FROM stops GROUP BY ROUND(stop_lat,1);`,
    },
    {
      title: "Trips grouped by shape_id",
      tables: ["trips"],
      sql: `SELECT shape_id, COUNT(*) FROM trips GROUP BY shape_id;`,
    },
    {
      title: "Routes with multiple shapes",
      tables: ["trips"],
      sql: `SELECT route_id FROM trips GROUP BY route_id HAVING COUNT(DISTINCT shape_id) > 1;`,
    },
    {
      title: "Find stops with highest usage",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(*) FROM stop_times GROUP BY stop_id ORDER BY COUNT(*) DESC LIMIT 10;`,
    },
    {
      title: "Trips with identical stop count",
      tables: ["stop_times"],
      sql: `SELECT COUNT(*), cnt FROM (SELECT trip_id, COUNT(*) AS cnt FROM stop_times GROUP BY trip_id) GROUP BY cnt;`,
    },
    {
      title: "Find most frequent departure hour",
      tables: ["stop_times"],
      sql: `SELECT SUBSTR(departure_time,1,2) AS hour, COUNT(*) FROM stop_times GROUP BY hour ORDER BY COUNT(*) DESC LIMIT 1;`,
    },
    {
      title: "Stops per route ordered descending",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, COUNT(DISTINCT st.stop_id) FROM trips t JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY t.route_id ORDER BY COUNT(*) DESC;`,
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
      title: "Rank stops by DISTINCT trips served (heavy stops)",
      tables: ["stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT trip_id) AS distinct_trips
FROM stop_times
GROUP BY stop_id
ORDER BY distinct_trips DESC
LIMIT 30;`,
    },
    {
      title: "Calculate headway (avg time diff between trips per route)",
      tables: ["trips","stop_times"],
      sql: `SELECT route_id, AVG(diff) AS avg_headway FROM (  SELECT t.route_id,         (strftime('%s', st2.departure_time) - strftime('%s', st1.departure_time)) AS diff  FROM stop_times st1  JOIN stop_times st2     ON st1.trip_id != st2.trip_id  JOIN trips t ON st1.trip_id = t.trip_id  WHERE st1.stop_sequence = 1 AND st2.stop_sequence = 1) GROUP BY route_id;`,
    },
    {
      title: "Find longest trip duration",
      tables: ["stop_times"],
      sql: `SELECT trip_id, MAX(departure_time) - MIN(departure_time) AS duration FROM stop_times GROUP BY trip_id ORDER BY duration DESC LIMIT 5;`,
    },
    {
      title: "Detect inconsistent stop_sequence gaps",
      tables: ["stop_times"],
      sql: `SELECT trip_id FROM stop_times GROUP BY trip_id HAVING MAX(stop_sequence) != COUNT(*);`,
    },
    {
      title: "Find routes with most overlapping stops",
      tables: ["trips","stop_times"],
      sql: `SELECT t1.route_id, t2.route_id, COUNT(*) AS common_stops FROM stop_times st1 JOIN stop_times st2 ON st1.stop_id = st2.stop_id JOIN trips t1 ON st1.trip_id = t1.trip_id JOIN trips t2 ON st2.trip_id = t2.trip_id WHERE t1.route_id != t2.route_id GROUP BY t1.route_id, t2.route_id ORDER BY common_stops DESC LIMIT 10;`,
    },
    {
      title: "Identify duplicate trip patterns",
      tables: ["stop_times"],
      sql: `SELECT GROUP_CONCAT(stop_id), COUNT(*) FROM stop_times GROUP BY trip_id HAVING COUNT(*) > 1;`,
    },
    {
      title: "Find routes with inconsistent directions",
      tables: ["trips"],
      sql: `SELECT route_id FROM trips GROUP BY route_id HAVING COUNT(DISTINCT direction_id) != 2;`,
    },
    {
      title: "Calculate average speed (distance/time if shape_dist_traveled exists)",
      tables: ["stop_times"],
      sql: `SELECT trip_id, MAX(shape_dist_traveled) /  (MAX(departure_time) - MIN(departure_time)) AS speed FROM stop_times GROUP BY trip_id;`,
    },
    {
      title: "Find routes with highest stop density",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, COUNT(*) / COUNT(DISTINCT st.trip_id) AS avg_stops FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY t.route_id ORDER BY avg_stops DESC;`,
    },
    {
      title: "Detect trips with loops (repeated stops)",
      tables: ["stop_times"],
      sql: `SELECT trip_id FROM stop_times GROUP BY trip_id, stop_id HAVING COUNT(*) > 1;`,
    },
    {
      title: "Rank routes by trip count",
      tables: ["trips"],
      sql: `SELECT route_id, RANK() OVER (ORDER BY COUNT(*) DESC) AS rank FROM trips GROUP BY route_id;`,
    },
    {
      title: "Find longest route (most unique stops)",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, COUNT(DISTINCT st.stop_id) AS stops FROM trips t JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY t.route_id ORDER BY stops DESC LIMIT 1;`,
    },
    {
      title: "Detect missing departure times",
      tables: ["stop_times"],
      sql: `SELECT * FROM stop_times WHERE departure_time IS NULL;`,
    },
    {
      title: "Compute trip duration per route",
      tables: ["trips","stop_times"],
      sql: `SELECT t.route_id, AVG(MAX(st.departure_time) - MIN(st.departure_time)) FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY t.route_id;`,
    },
    {
      title: "Identify routes sharing identical stop sets",
      tables: ["trips","stop_times"],
      sql: `SELECT route_id, GROUP_CONCAT(DISTINCT stop_id) FROM trips t JOIN stop_times st ON t.trip_id = st.trip_id GROUP BY route_id;`,
    },
    {
      title: "Find stops with highest transfer potential",
      tables: ["trips","stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT route_id) FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY stop_id ORDER BY COUNT(*) DESC LIMIT 10;`,
    },
    {
      title: "Trips with irregular time gaps",
      tables: ["stop_times"],
      sql: `SELECT trip_id FROM ( SELECT trip_id, (strftime('%s', departure_time) -   LAG(strftime('%s', departure_time)) OVER (PARTITION BY trip_id ORDER BY stop_sequence)) AS gap FROM stop_times) WHERE gap < 0;`,
    },
    {
      title: "Compute route coverage (bounding box)",
      tables: ["stops"],
      sql: `SELECT MIN(stop_lat), MAX(stop_lat), MIN(stop_lon), MAX(stop_lon) FROM stops;`,
    },
    {
      title: "Find most central stop (used in most routes)",
      tables: ["trips","stop_times"],
      sql: `SELECT stop_id, COUNT(DISTINCT route_id) FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY stop_id ORDER BY COUNT(*) DESC LIMIT 1;`,
    },
    {
      title: "Detect trips with missing stops",
      tables: ["trips","stop_times"],
      sql: `SELECT trip_id FROM trips WHERE trip_id NOT IN (SELECT DISTINCT trip_id FROM stop_times);`,
    },
    {
      title: "Calculate average headway per hour",
      tables: ["stop_times"],
      sql: `SELECT SUBSTR(departure_time,1,2) AS hour, AVG(diff) FROM ( SELECT departure_time, (strftime('%s', departure_time) -  LAG(strftime('%s', departure_time)) OVER (ORDER BY departure_time)) AS diff FROM stop_times WHERE stop_sequence = 1) GROUP BY hour;`,
    },
    {
      title: "Find longest gap between trips per route",
      tables: ["trips","stop_times"],
      sql: `SELECT route_id, MAX(diff) FROM ( SELECT t.route_id, (strftime('%s', st2.departure_time) -  strftime('%s', st1.departure_time)) AS diff FROM stop_times st1 JOIN stop_times st2 ON st1.trip_id != st2.trip_id JOIN trips t ON st1.trip_id = t.trip_id) GROUP BY route_id;`,
    },
    {
      title: "Identify routes with extreme travel times",
      tables: ["trips","stop_times"],
      sql: `SELECT route_id, MAX(duration) - MIN(duration) FROM ( SELECT t.route_id, MAX(st.departure_time) - MIN(st.departure_time) AS duration FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id GROUP BY st.trip_id) GROUP BY route_id;`,
    },
    {
      title: "Stops farthest apart (rough)",
      tables: ["stops"],
      sql: `SELECT s1.stop_id, s2.stop_id, ((s1.stop_lat - s2.stop_lat)*(s1.stop_lat - s2.stop_lat) +  (s1.stop_lon - s2.stop_lon)*(s1.stop_lon - s2.stop_lon)) AS dist FROM stops s1, stops s2 ORDER BY dist DESC LIMIT 1;`,
    },
    {
      title: "Identify peak route usage per hour",
      tables: ["trips","stop_times"],
      sql: `SELECT route_id, hour, COUNT(*) FROM ( SELECT t.route_id, SUBSTR(st.departure_time,1,2) AS hour FROM stop_times st JOIN trips t ON st.trip_id = t.trip_id) GROUP BY route_id, hour ORDER BY COUNT(*) DESC;`,
    }
  ],
};
