/**
 * Load GTFS text files from a JSZip archive into an in-browser SQLite database (sql.js).
 * All imported columns use TEXT affinity so learners can practise CAST(...) when needed.
 */
(function (global) {
  /**
   * Uncompressed-ish size above this skips content sniff (avoids loading huge extracts into RAM).
   * Those entries stay checked — user prefers large tables imported by default.
   */
  var SNIFF_MAX_UNCOMPRESSED_BYTES = 14 * 1024 * 1024;

  var INSERT_CHUNK = 2000;

  function basename(path) {
    var i = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return i >= 0 ? path.slice(i + 1) : path;
  }

  function safeSqlIdent(raw) {
    var t = String(raw == null ? "" : raw).trim().replace(/\s+/g, "_").replace(/"/g, "");
    var s = t.replace(/[^A-Za-z0-9_]/g, "_");
    if (/^[0-9]/.test(s)) s = "_" + s;
    return s || "_col";
  }

  function quoteIdent(s) {
    return '"' + String(s).replace(/"/g, '""') + '"';
  }

  function tableNameFromTxtFilename(fileName) {
    return safeSqlIdent(fileName.replace(/\.txt$/i, "").toLowerCase());
  }

  /**
   * JSZip exposes per-file payload on `_data`; `entry.uncompressedSize` is often undefined.
   * @param {*} entry file from zipRoot.forEach
   * @returns {{ bytes:number, sizeKind:string }}
   */
  function zipTxtEntrySizing(entry) {
    var d = entry && entry._data;
    /** uncompressed CSV/text size when present in ZIP metadata */
    var uncompressed =
      typeof entry.uncompressedSize === "number"
        ? entry.uncompressedSize
        : d && typeof d.uncompressedSize === "number"
          ? d.uncompressedSize
          : null;
    var compressed =
      typeof entry.compressedSize === "number"
        ? entry.compressedSize
        : d && typeof d.compressedSize === "number"
          ? d.compressedSize
          : null;

    /** @type {'csv'|'zip'} */
    var sizeKind;
    /** @type {number} */
    var bytes = 0;

    if (typeof uncompressed === "number" && !isNaN(uncompressed) && uncompressed >= 0) {
      bytes = Math.max(0, Math.floor(Number(uncompressed)));
      sizeKind = "csv";
    } else if (typeof compressed === "number" && !isNaN(compressed) && compressed >= 0) {
      bytes = Math.max(0, Math.floor(Number(compressed)));
      sizeKind = "zip";
    } else if (d && d.compressedContent) {
      var raw = d.compressedContent;
      if (typeof raw.length === "number") bytes = Math.max(0, raw.length | 0);
      else if (typeof raw.byteLength === "number") bytes = Math.max(0, Math.floor(Number(raw.byteLength)));
      sizeKind = "zip";
    } else {
      sizeKind = "zip";
      bytes = 0;
    }

    return { bytes: bytes, sizeKind: sizeKind };
  }

  /** True when CSV appears to contain at least one non-empty body cell (handles header-only). */
  function csvHasAtLeastOneDataRow(csvText, Papa) {
    var s = String(csvText || "");
    if (!s.trim()) return false;
    var parsed = Papa.parse(s, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: false,
      preview: 8000,
    });
    var fields = parsed.meta && parsed.meta.fields ? parsed.meta.fields : null;
    var rows = parsed.data;
    if (!rows || rows.length === 0) return false;

    var r,
      row,
      f,
      keys,
      k,
      key,
      v;
    for (r = 0; r < rows.length; r++) {
      row = rows[r];
      if (!row || typeof row !== "object") continue;
      if (fields && fields.length) {
        for (f = 0; f < fields.length; f++) {
          key = fields[f];
          if (key == null || String(key).trim() === "") continue;
          v = row[key];
          if (v !== undefined && v !== null && String(v).trim() !== "") return true;
        }
      } else {
        keys = Object.keys(row);
        for (k = 0; k < keys.length; k++) {
          v = row[keys[k]];
          if (v !== undefined && v !== null && String(v).trim() !== "") return true;
        }
      }
    }
    return false;
  }

  /**
   * Checked by default everywhere; unchecked only after sniff finds header-only (no body rows).
   * Skips full sniff when ZIP metadata suggests an extract larger than {@link SNIFF_MAX_UNCOMPRESSED_BYTES}.
   * @param {JSZip} zipRoot
   * @param {{zipPath:string,defaultChecked?:boolean,bytes:number}[]} entries
   */
  async function refineImportCheckboxDefaults(zipRoot, entries) {
    var Papa = global.Papa;
    if (!Papa || !entries || !entries.length) return entries;

    var i,
      info,
      b,
      ze,
      text;
    for (i = 0; i < entries.length; i++) {
      info = entries[i];
      info.defaultChecked = true;

      b = typeof info.bytes === "number" && info.bytes >= 0 ? info.bytes : 0;
      if (b > SNIFF_MAX_UNCOMPRESSED_BYTES || b === 0) continue;

      ze = zipRoot.file(info.zipPath);
      if (!ze) {
        info.defaultChecked = false;
        continue;
      }

      try {
        text = await ze.async("text");
        info.defaultChecked = csvHasAtLeastOneDataRow(text, Papa);
      } catch (_e) {
        info.defaultChecked = true;
      }
    }
    return entries;
  }

  /**
   * Enumerate CSV-like *.txt tables inside an already-loaded ZIP.
   * @param {JSZip} zipRoot
   * @returns {{zipPath:string,filename:string,suggestedTable:string,bytes:number,sizeKind:string,defaultChecked:boolean}[]}
   */
  function describeTxtFiles(zipRoot) {
    var out = [];
    zipRoot.forEach(function (relPath, entry) {
      if (entry.dir) return;
      if (relPath.indexOf("__MACOSX") !== -1) return;
      if (!/\.txt$/i.test(relPath)) return;

      var name = basename(relPath);
      if (!name || name[0] === ".") return;

      var sizing = zipTxtEntrySizing(entry);

      out.push({
        zipPath: relPath,
        filename: name,
        suggestedTable: tableNameFromTxtFilename(name),
        bytes: sizing.bytes,
        sizeKind: sizing.sizeKind,
        defaultChecked: true,
      });
    });

    return out.sort(function (a, b) {
      return a.zipPath.localeCompare(b.zipPath);
    });
  }

  /**
   * @param {*} SQL - sql.js module (from initSqlJs)
   * @param {JSZip} zipRoot loaded archive
   * @param {Array} entries result of describeTxtFiles filtered to user selection
   */
  async function buildDatabase(SQL, zipRoot, entries) {
    var db = new SQL.Database();
    var warnings = [];
    var importedTables = [];

    /** @type {Record<string, boolean>} */
    var claimed = Object.create(null);

    /** @returns {string} */
    function takeTable(desiredBase) {
      var name = desiredBase;
      var bump = 2;
      while (claimed[name]) {
        name = desiredBase + "_" + bump++;
      }
      claimed[name] = true;
      return name;
    }

    for (var e = 0; e < entries.length; e++) {
      var info = entries[e];
      var ze = zipRoot.file(info.zipPath);
      if (!ze) {
        warnings.push("Missing in ZIP (skipped): " + info.zipPath);
        continue;
      }

      var csvText = await ze.async("text");

      var parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: "greedy",
        dynamicTyping: false,
      });

      if (parsed.errors && parsed.errors.length) {
        var bad = parsed.errors.filter(function (er) {
          return er.code !== "TooFewFields" && er.code !== "TooManyFields" && er.code !== "UndefinedField";
        });
        if (bad.length)
          warnings.push(info.filename + ": " + bad[0].code + " — " + (bad[0].message || ""));
      }

      var mf = (parsed.meta && parsed.meta.fields) || [];
      var sqliteCols = [];
      /** @type {string[]} Papa row-object keys aligned with sqliteCols */
      var papaKeys = [];
      var sanSeen = Object.create(null);
      for (var cix = 0; cix < mf.length; cix++) {
        var papaKeyRaw = mf[cix];
        if (papaKeyRaw === undefined || papaKeyRaw === null) continue;
        /** Papa uses trimmed keys on the row objects; duplicates become header_2, etc */
        var papaKeyStr = String(papaKeyRaw);
        var trimmedLabel = papaKeyStr.trim();
        if (!trimmedLabel) continue;

        var colBase = safeSqlIdent(trimmedLabel || papaKeyStr);
        var col = colBase;
        var n = 2;
        while (sanSeen[col]) {
          col = colBase + "_" + n++;
        }
        sanSeen[col] = true;
        sqliteCols.push(col);
        papaKeys.push(papaKeyStr);
      }

      if (!sqliteCols.length) {
        warnings.push("Skipped (no usable header row): " + info.filename);
        continue;
      }

      /** Release prior claim string if renaming needed */
      var requested = info.suggestedTable;
      var table = takeTable(requested);
      if (table !== requested) {
        warnings.push('Table "' + requested + '" already taken — storing as "' + table + '"');
      }

      var colsSql = sqliteCols.map(function (colName) {
        return quoteIdent(colName) + " TEXT";
      });
      db.run("DROP TABLE IF EXISTS " + quoteIdent(table));
      db.run(
        "CREATE TABLE " +
          quoteIdent(table) +
          " (" +
          colsSql.join(", ") +
          ")"
      );

      var placeholders = sqliteCols.map(function () {
        return "?";
      }).join(", ");
      var stmt = db.prepare(
        "INSERT INTO " +
          quoteIdent(table) +
          " VALUES (" +
          placeholders +
          ")"
      );

      db.run("BEGIN TRANSACTION");
      try {
        var data = parsed.data || [];
        var buffered = [];
        function flushBuff() {
          if (!buffered.length) return;
          for (var b = 0; b < buffered.length; b++) {
            stmt.run(buffered[b]);
          }
          buffered.length = 0;
        }

        function pushRow(vals) {
          buffered.push(vals);
          if (buffered.length >= INSERT_CHUNK) flushBuff();
        }

        for (var r = 0; r < data.length; r++) {
          var rowObj = data[r];
          if (!rowObj || typeof rowObj !== "object") continue;
          /** skip completely empty sparse rows Papa left behind */
          var hasAny = false;
          for (var pk = 0; pk < papaKeys.length; pk++) {
            var key = papaKeys[pk];
            if (
              rowObj[key] !== undefined &&
              rowObj[key] !== null &&
              String(rowObj[key]).length > 0
            ) {
              hasAny = true;
              break;
            }
          }
          if (!hasAny) continue;

          var vals = papaKeys.map(function (k) {
            var v = rowObj[k];
            if (v === undefined || v === null) return null;
            return String(v);
          });
          pushRow(vals);
        }
        flushBuff();
        db.run("COMMIT");
      } catch (err) {
        try {
          db.run("ROLLBACK");
        } catch (_r) {}
        stmt.free();
        throw err;
      }
      stmt.free();

      importedTables.push(table);

      csvText = null;
      parsed = null;
    }

    return {
      db: db,
      importedTables: importedTables.slice().sort(function (a, b) {
        return a.localeCompare(b);
      }),
      warnings: warnings,
    };
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    var kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    var mb = kb / 1024;
    if (mb < 1024) return mb.toFixed(1) + " MB";
    return (mb / 1024).toFixed(2) + " GB";
  }

  global.GTFS_IMP = {
    SNIFF_MAX_UNCOMPRESSED_BYTES: SNIFF_MAX_UNCOMPRESSED_BYTES,
    describeTxtFiles: describeTxtFiles,
    refineImportCheckboxDefaults: refineImportCheckboxDefaults,
    buildDatabase: buildDatabase,
    formatBytes: formatBytes,
  };
})(typeof window !== "undefined" ? window : globalThis);
