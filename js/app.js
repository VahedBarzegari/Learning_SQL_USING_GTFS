(function () {
  /** @type {Blob|null} */
  var zipBlob = null;

  /** @type {JSZip|null} */
  var zipRoot = null;

  /** @type {*} */
  var sqlModule = null;

  /** @type {SQL.Database|null} */
  var currentDb = null;

  /** Imported table names keyed for starter validation */
  var tableSet = null;

  var zipTxtEntries = [];

  var sqlCm = null;

  var kwCaseApplying = false;
  var kwCaseTimer = null;
  /** debounce keyword uppercasing so typing stays responsive */
  var KW_CASE_DEBOUNCE_MS = 90;

  var els = {};

  function sqlFromEditor() {
    if (sqlCm) return sqlCm.getValue() || "";
    return (els.sqlEditor && els.sqlEditor.value) || "";
  }

  function applyKeywordCapitalization(cm) {
    if (typeof capitalizeSQLiteKeywords !== "function" || kwCaseApplying || !cm) return;
    var before = cm.getValue();
    var after = capitalizeSQLiteKeywords(before);
    if (before === after) return;
    kwCaseApplying = true;
    var cur = cm.getCursor();
    var scroll = cm.getScrollInfo();
    cm.setValue(after);
    cm.setCursor(cur);
    cm.scrollTo(scroll.left, scroll.top);
    kwCaseApplying = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    els.zipInput = document.getElementById("zipInput");
    els.importCollapse = document.getElementById("importTablesCollapse");
    els.importSummary = document.getElementById("importTablesSummary");
    els.fileList = document.getElementById("fileList");
    els.btnBuild = document.getElementById("btnBuild");
    els.status = document.getElementById("status");
    els.buildBusy = document.getElementById("buildBusy");
    els.buildBusyMsg = document.getElementById("buildBusyMsg");
    els.tablesList = document.getElementById("tablesList");
    els.datasetHint = document.getElementById("datasetHint");
    els.sqlEditor = document.getElementById("sqlEditor");
    els.btnRun = document.getElementById("btnRun");
    els.btnClear = document.getElementById("btnClear");
    els.errorBox = document.getElementById("errorBox");
    els.results = document.getElementById("results");
    els.starterList = document.getElementById("starterList");

    if (typeof CodeMirror !== "undefined") {
      sqlCm = CodeMirror.fromTextArea(els.sqlEditor, {
        mode: "text/x-sqlite",
        indentWithTabs: false,
        indentUnit: 2,
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        theme: "default",
        extraKeys: {
          "Ctrl-Enter": function () {
            if (!els.btnRun.disabled) onRunSql();
          },
          "Cmd-Enter": function () {
            if (!els.btnRun.disabled) onRunSql();
          },
        },
      });
      sqlCm.setSize(null, 300);

      if (typeof capitalizeSQLiteKeywords === "function") {
        sqlCm.on("change", function (cmInstance) {
          if (kwCaseApplying) return;
          window.clearTimeout(kwCaseTimer);
          kwCaseTimer = window.setTimeout(function () {
            applyKeywordCapitalization(cmInstance);
          }, KW_CASE_DEBOUNCE_MS);
        });
      }
    }

    initStarters();

    els.zipInput.addEventListener("change", onPickZip);

    els.btnBuild.addEventListener("click", onBuildDb);

    els.btnRun.addEventListener("click", onRunSql);

    els.btnClear.addEventListener("click", function () {
      els.results.innerHTML = '<div class="result-meta">Cleared.</div>';
      els.errorBox.classList.add("hidden");
    });
  });

  function hideError() {
    els.errorBox.classList.add("hidden");
    els.errorBox.textContent = "";
  }

  function showError(msg) {
    els.errorBox.textContent = msg;
    els.errorBox.classList.remove("hidden");
  }

  function status(msg) {
    els.status.textContent = msg || "";
  }

  /** Centered overlay + spinner while SQLite import runs (blocking UI). */
  function setBuildBusy(on, msg) {
    if (!els.buildBusy) return;
    if (on) {
      els.buildBusy.classList.remove("hidden");
      els.buildBusy.setAttribute("aria-busy", "true");
      els.buildBusy.setAttribute("aria-hidden", "false");
      document.body.classList.add("build-busy-open");
      if (els.buildBusyMsg && msg) els.buildBusyMsg.textContent = msg;
    } else {
      els.buildBusy.classList.add("hidden");
      els.buildBusy.setAttribute("aria-busy", "false");
      els.buildBusy.setAttribute("aria-hidden", "true");
      document.body.classList.remove("build-busy-open");
    }
  }

  function fmtBytes(bytes) {
    return window.GTFS_IMP ? window.GTFS_IMP.formatBytes(bytes) : bytes + " B";
  }

  function appendStarterButton(ulEl, preset) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = preset.title;
    btn.dataset.needs = JSON.stringify(preset.tables || []);
    btn.disabled = false;
    btn.addEventListener("click", function () {
      if (sqlCm) {
        sqlCm.setValue(preset.sql);
        sqlCm.focus();
      } else {
        els.sqlEditor.value = preset.sql;
        els.sqlEditor.focus();
      }
    });
    li.appendChild(btn);
    ulEl.appendChild(li);
  }

  function initStarters() {
    els.starterList.innerHTML = "";

    var byTier = window.GTFS_SQL_PRESETS;
    var tierDefs = window.GTFS_SQL_PRESET_TIERS;

    if (
      tierDefs &&
      byTier &&
      !Array.isArray(byTier) &&
      byTier.easy &&
      byTier.medium &&
      byTier.hard
    ) {
      tierDefs.forEach(function (tier) {
        var items = byTier[tier.key];
        if (!items || !items.length) return;

        var det = document.createElement("details");
        det.className = "starter-tier-block";

        var sum = document.createElement("summary");
        sum.className = "starter-tier-summary";
        sum.textContent = tier.label + " · " + items.length;

        var ul = document.createElement("ul");
        ul.className = "starter-list";

        items.forEach(function (preset) {
          appendStarterButton(ul, preset);
        });

        det.appendChild(sum);
        det.appendChild(ul);
        els.starterList.appendChild(det);
      });

      refreshStarterAvailability();
      return;
    }

    /** Fallback: legacy flat presets array */
    var presets = Array.isArray(byTier) ? byTier : [];
    var detFb = document.createElement("details");
    detFb.className = "starter-tier-block";
    var sumFb = document.createElement("summary");
    sumFb.className = "starter-tier-summary";
    sumFb.textContent = "Examples";
    var ulFb = document.createElement("ul");
    ulFb.className = "starter-list";
    presets.forEach(function (p) {
      appendStarterButton(ulFb, p);
    });
    detFb.appendChild(sumFb);
    detFb.appendChild(ulFb);
    els.starterList.appendChild(detFb);
    refreshStarterAvailability();
  }

  /** Enable starter prompts only when prerequisite tables exist in the rebuilt DB */
  function refreshStarterAvailability() {
    Array.prototype.slice.call(els.starterList.querySelectorAll("button")).forEach(function (btn) {
      var needs = [];
      try {
        needs = JSON.parse(btn.dataset.needs || "[]");
      } catch (_e) {}

      var ok =
        needs.length === 0 ||
        (tableSet !== null && needs.every(function (t) { return tableSet[String(t)] }));

      btn.disabled = !ok;

      btn.title = ok ? "Paste into editor" : 'Import tables: "' + needs.join('", "') + '" first';
    });
  }

  function ensureSqlJs() {
    return new Promise(function (resolve, reject) {
      if (sqlModule) {
        resolve(sqlModule);
        return;
      }

      if (typeof window.initSqlJs !== "function") {
        reject(new Error("initSqlJs missing"));
        return;
      }

      window
        .initSqlJs({
          locateFile: function (file) {
            return "https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/" + file;
          },
        })
        .then(function (MOD) {
          sqlModule = MOD;
          resolve(sqlModule);
        })
        .catch(reject);
    });
  }

  function stripSqlCommentsRough(sql) {
    var s = String(sql || "");
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
    return s.replace(/^\s*(?:--).*$/gm, "").trim();
  }

  /** @returns {HTMLElement} */
  function renderHtmlTable(headers, rows, maxShown) {
    var wrap = document.createElement("div");
    var note = document.createElement("div");
    note.className = "result-meta";
    wrap.appendChild(note);

    if (!headers.length) {
      note.textContent = rows && rows.length ? "Executed" : "No columns";
      return wrap;
    }

    if (!rows.length) {
      note.textContent = "Columns: " + headers.length + " · Rows: 0";
      var empty = document.createElement("div");
      empty.className = "result-meta muted";
      empty.textContent = "Query returned zero rows.";
      wrap.appendChild(empty);
      return wrap;
    }

    var limit = typeof maxShown === "number" ? Math.min(rows.length, maxShown) : rows.length;
    note.textContent =
      "Columns: " + headers.length +
      " · Rows shown: " + limit +
      (rows.length > limit ? ", truncated at " + maxShown + " rows" : "");

    var tableEl = document.createElement("table");
    tableEl.className = "data";
    var thead = document.createElement("thead");
    var trHead = document.createElement("tr");
    headers.forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = String(h);
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < limit; i++) {
      var csvRow = rows[i];
      var tr = document.createElement("tr");
      csvRow.forEach(function (cell) {
        var td = document.createElement("td");
        td.textContent = cell === null ? "NULL" : String(cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    tableEl.appendChild(thead);
    tableEl.appendChild(tbody);
    wrap.appendChild(tableEl);

    return wrap;
  }

  function execAndRender(sql) {
    if (!currentDb) {
      showError("Choose a ZIP and click “Build SQLite database”.");
      return;
    }

    hideError();

    var stripped = stripSqlCommentsRough(sql).trim();
    els.results.innerHTML = "";

    if (!stripped) {
      els.results.innerHTML =
        '<div class="result-meta muted">Nothing to execute (empty query).</div>';
      return;
    }

    if (!/;\s*$/.test(stripped)) {
      showError(
        "End each SQL statement with a semicolon (;). Example: SELECT * FROM routes LIMIT 5;",
      );
      return;
    }

    /** sql.js exec is reliable when the terminator is trimmed from a single-pass string */
    var trimmed = stripped.replace(/;\s*$/,"").trim();

    var MAX_ROWS_SHOW = 500;
    /** @type {Array<{columns:string[],values:(string|number|null)[][]}>} */
    var resultSets;

    try {
      resultSets = currentDb.exec(trimmed);
    } catch (err) {
      showError(err && err.message ? err.message : String(err));
      return;
    }

    if (!resultSets.length) {
      els.results.appendChild(renderHtmlMeta("Statement executed (no result set)."));
      return;
    }

    resultSets.forEach(function (set, idx) {
      if (resultSets.length > 1) {
        els.results.appendChild(renderHtmlMeta("Result set #" + (idx + 1)));
      }
      var rows = Array.isArray(set.values) ? set.values : [];
      var cols = Array.isArray(set.columns) ? set.columns : [];

      els.results.appendChild(renderHtmlTable(cols, rows, MAX_ROWS_SHOW));
    });
  }

  function renderHtmlMeta(text) {
    var d = document.createElement("div");
    d.className = "result-meta";
    d.textContent = text;
    return d;
  }

  function onRunSql() {
    execAndRender(sqlFromEditor());
  }

  async function onPickZip(ev) {
    var fileInput = /** @type {HTMLInputElement} */ (ev.target);
    var f = fileInput.files && fileInput.files[0];
    if (!f) return;

    if (currentDb) {
      currentDb.close();
      currentDb = null;
      tableSet = null;
      refreshStarterAvailability();
    }

    els.btnRun.disabled = true;
    els.btnClear.disabled = true;
    els.tablesList.innerHTML = "";
    status("Parsing ZIP manifest…");

    zipBlob = f;
    hideError();

    try {
      var buf = await f.arrayBuffer();
      zipRoot = await JSZip.loadAsync(buf);

      var GT = window.GTFS_IMP;

      zipTxtEntries = GT.describeTxtFiles(zipRoot);

      if (!zipTxtEntries.length)
        throw new Error("No .txt CSV tables found inside the archive.");

      if (els.importCollapse) {
        els.importCollapse.classList.remove("hidden");
        els.importCollapse.open = true;
      }
      if (els.importSummary) els.importSummary.textContent = "CSV tables in ZIP";
      els.fileList.innerHTML = "";

      zipTxtEntries.forEach(function (ent, idx) {
        var row = document.createElement("div");
        row.className = "file-row";

        var cbId = "gtfs-zip-entry-" + idx;
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = cbId;
        cb.checked = ent.defaultChecked;
        cb.dataset.zipPath = ent.zipPath;

        var lab = document.createElement("label");
        lab.htmlFor = cbId;
        lab.title = ent.zipPath + " (" + fmtBytes(ent.bytes) + ")";
        lab.textContent = ent.filename + " → table " + ent.suggestedTable;

        var sz = document.createElement("span");
        sz.className = "file-size";
        sz.textContent = fmtBytes(ent.bytes);

        row.appendChild(cb);
        row.appendChild(lab);
        row.appendChild(sz);
        els.fileList.appendChild(row);
      });

      els.btnBuild.disabled = false;
      els.btnClear.disabled = false;
      refreshStarterAvailability();
      status(zipTxtEntries.length + " CSV tables detected — choose files, then Build.");
    } catch (e) {
      showError(e && e.message ? e.message : String(e));
      els.btnBuild.disabled = true;
      if (els.importCollapse) {
        els.importCollapse.classList.add("hidden");
        els.importCollapse.open = false;
      }
      status("");
    }
  }

  async function onBuildDb() {
    if (!zipRoot || !zipTxtEntries.length) {
      showError("Load a GTFS ZIP first.");
      return;
    }

    var selected = [];

    els.fileList.querySelectorAll('input[type="checkbox"]').forEach(function (inp) {
      var path = inp.dataset.zipPath;
      var want = inp.checked && path;

      zipTxtEntries.forEach(function (e) {
        if (want && e.zipPath === path) selected.push(e);
      });
    });

    if (!selected.length) {
      showError("Select at least one table to import.");
      return;
    }

    els.btnRun.disabled = true;
    els.btnBuild.disabled = true;
    hideError();

    status("");

    setBuildBusy(true, "Preparing SQLite (sql.js)…");

    try {
      var SQL = await ensureSqlJs();
      setBuildBusy(
        true,
        "Parsing " +
          selected.length +
          " CSV table(s) into SQLite — keep this tab visible…",
      );
      var result = await window.GTFS_IMP.buildDatabase(SQL, zipRoot, selected);

      if (currentDb) {
        try {
          currentDb.close();
        } catch (_c) {}
        currentDb = null;
      }

      currentDb = result.db;

      /** @type {Record<string,true>} */
      var map = {};
      result.importedTables.forEach(function (t) {
        map[t] = true;
      });
      tableSet = map;

      els.tablesList.innerHTML = "";
      result.importedTables.forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        els.tablesList.appendChild(li);
      });

      els.btnRun.disabled = false;
      refreshStarterAvailability();

      var warnText =
        "Imported " +
        result.importedTables.length +
        " SQLite table(s)." +
        (result.warnings.length
          ? " · Warnings: " +
            result.warnings.slice(0, 12).join(" · ")
          : "");

      if (!result.importedTables.length) throw new Error("Nothing was imported");

      warnText +=
        ' · Tip: columns are TEXT — use CAST(stop_lat AS REAL) for numeric filters.';

      status(warnText);

      if (els.importCollapse) {
        els.importCollapse.open = false;
      }
      if (els.importSummary) {
        els.importSummary.textContent = "CSV import (expand to change tables)";
      }

      if (result.warnings.length > 12) {
        console.warn("[GTFS SQL Lab] extra warnings suppressed", result.warnings);
      }
    } catch (e) {
      showError(e && e.message ? e.message : String(e));
      status("");
      els.btnRun.disabled = currentDb !== null;
    } finally {
      setBuildBusy(false);
    }

    els.btnBuild.disabled = false;
  }

})();
