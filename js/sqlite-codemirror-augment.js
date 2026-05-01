/**
 * CodeMirror's bundled `text/x-sqlite` dialect tags `count` as a keyword but leaves out
 * many other aggregates and common functions, so they paint as plain identifiers and
 * miss `.cm-keyword` styling in this app.
 * @see https://github.com/codemirror/codemirror5/blob/master/mode/sql/sql.js
 */
(function (global) {
  if (typeof global.CodeMirror === "undefined") return;
  var mm = global.CodeMirror.mimeModes || {};
  var mime = mm["text/x-sqlite"];
  if (!mime || mime.name !== "sql" || !mime.keywords || typeof mime.keywords !== "object") return;

  var extra =
    /* aggregates & reporting */
    "min max avg sum total group_concat " +
    /* window (SQLite 3.25+) — used in lab presets */
    "row_number rank dense_rank ntile lag lead first_value last_value " +
    /* core funcs learners hit often */
    "abs coalesce hex ifnull iif instr length printf quote random round rtrim ltrim trim substr typeof unicode " +
    "strftime date time datetime julianday cast";

  extra
    .trim()
    .split(/\s+/)
    .forEach(function (w) {
      if (w) mime.keywords[w.toLowerCase()] = true;
    });
})(typeof window !== "undefined" ? window : globalThis);
