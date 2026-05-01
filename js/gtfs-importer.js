/**
 * Load GTFS text files from a JSZip archive into an in-browser SQLite database (sql.js).
 * All imported columns use TEXT affinity so learners can practise CAST(...) when needed.
 */
(function (global) {
  /** Files larger than this are unchecked by default in the UI */
  var LARGE_BYTES = 15 * 1024 * 1024;

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
   * Enumerate CSV-like *.txt tables inside an already-loaded ZIP.
   * @param {JSZip} zipRoot
   * @returns {{zipPath:string,filename:string,suggestedTable:string,bytes:number,defaultChecked:boolean}[]}
   */
  function describeTxtFiles(zipRoot) {
    var out = [];
    zipRoot.forEach(function (relPath, entry) {
      if (entry.dir) return;
      if (relPath.indexOf("__MACOSX") !== -1) return;
      if (!/\.txt$/i.test(relPath)) return;

      var name = basename(relPath);
      if (!name || name[0] === ".") return;

      var size = typeof entry.uncompressedSize === "number" ? entry.uncompressedSize : 0;

      out.push({
        zipPath: relPath,
        filename: name,
        suggestedTable: tableNameFromTxtFilename(name),
        bytes: size,
        defaultChecked: size <= LARGE_BYTES,
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
    LARGE_BYTE_THRESHOLD: LARGE_BYTES,
    describeTxtFiles: describeTxtFiles,
    buildDatabase: buildDatabase,
    formatBytes: formatBytes,
  };
})(typeof window !== "undefined" ? window : globalThis);
