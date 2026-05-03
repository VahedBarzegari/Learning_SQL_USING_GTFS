/**
 * SQLite keyword uppercasing (matches CodeMirror 5 sqlite MIME keyword list loosely).
 * Skips line comments (--), block comments (slash-star), single-quoted strings, doubled-string and backtick identifiers.
 *
 * Intentionally does not upper-case `date` / `time` / `datetime` here: GTFS CSVs often use those as column names;
 * SQLite treats bare identifiers case-insensitively anyway (`date` ≡ `DATE` for columns). Editor highlighting may
 * still tint them — type `"date"` in double-quotes only if you need a distinctly-cased quoted identifier (rare).
 */
(function (global) {
  var KW_SOURCE =
    /* CodeMirror sql.js base keywords */
    "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit " +
    /* CodeMirror sqlite extension keywords */
    "abort action add after all analyze attach autoincrement before begin cascade case cast check collate column commit conflict constraint cross current_date current_time current_timestamp database default deferrable deferred detach each else end escape exclusive exists explain fail for foreign full glob if ignore immediate index indexed initially inner instead intersect isnull key left limit match natural no notnull null of offset outer plan pragma primary query raise recursive references regexp reindex release rename replace restrict right rollback row savepoint temp temporary then to transaction trigger unique using vacuum view virtual when with without " +
    /* common literals / extras */
    "true false " +
    /* aggregates & common funcs (match js/sqlite-codemirror-augment.js for editor styling) */
    "min max avg sum total group_concat row_number rank dense_rank ntile lag lead first_value last_value " +
    "abs coalesce hex ifnull iif instr length printf quote random round rtrim ltrim trim substr typeof unicode " +
    "strftime julianday cast ";

  var KW = null;

  function keywordSet() {
    if (!KW) {
      KW = new Set();
      KW_SOURCE.trim().split(/\s+/).forEach(function (w) {
        if (w) KW.add(w.toLowerCase());
      });
    }
    return KW;
  }

  function capitalizeSQLiteKeywords(sql) {
    var KEYWORDS = keywordSet();
    var out = [];
    var n = sql.length;
    var i = 0;

    while (i < n) {
      var ch = sql.charAt(i);

      if (ch === "-" && i + 1 < n && sql.charAt(i + 1) === "-") {
        out.push("--");
        i += 2;
        while (i < n && sql.charAt(i) !== "\n" && sql.charAt(i) !== "\r") out.push(sql.charAt(i++));
        continue;
      }

      if (ch === "/" && i + 1 < n && sql.charAt(i + 1) === "*") {
        out.push("/*");
        i += 2;
        while (i < n - 1) {
          if (sql.charAt(i) === "*" && sql.charAt(i + 1) === "/") {
            out.push("*/");
            i += 2;
            break;
          }
          out.push(sql.charAt(i++));
        }
        continue;
      }

      if (ch === "'") {
        out.push("'");
        i++;
        while (i < n) {
          var c = sql.charAt(i);
          if (c === "'") {
            if (i + 1 < n && sql.charAt(i + 1) === "'") {
              out.push("''");
              i += 2;
              continue;
            }
            out.push("'");
            i++;
            break;
          }
          out.push(c);
          i++;
        }
        continue;
      }

      if (ch === '"') {
        out.push('"');
        i++;
        while (i < n) {
          var d = sql.charAt(i);
          if (d === '"') {
            if (i + 1 < n && sql.charAt(i + 1) === '"') {
              out.push('""');
              i += 2;
              continue;
            }
            out.push('"');
            i++;
            break;
          }
          out.push(d);
          i++;
        }
        continue;
      }

      if (ch === "`") {
        out.push("`");
        i++;
        while (i < n) {
          var b = sql.charAt(i);
          if (b === "`") {
            if (i + 1 < n && sql.charAt(i + 1) === "`") {
              out.push("``");
              i += 2;
              continue;
            }
            out.push("`");
            i++;
            break;
          }
          out.push(b);
          i++;
        }
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        var start = i;
        i++;
        while (i < n && /[a-zA-Z0-9_]/.test(sql.charAt(i))) i++;
        var word = sql.slice(start, i);
        var lw = word.toLowerCase();
        if (KEYWORDS.has(lw)) out.push(lw.toUpperCase());
        else out.push(word);
        continue;
      }

      out.push(ch);
      i++;
    }

    return out.join("");
  }

  global.capitalizeSQLiteKeywords = capitalizeSQLiteKeywords;
})(typeof window !== "undefined" ? window : globalThis);
