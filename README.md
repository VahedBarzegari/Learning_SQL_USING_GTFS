# SQL Tutorial Toolkit

A browser-based **Transit SQL Workbench** for learning and practicing SQL on realistic public-transit data. Everything runs locally in the page: no server or account required.

## What it does

Import a **GTFS** feed as a `.zip` file, build an in-memory **SQLite** database, then write and run queries in a full SQL editor. Curated **examples** help you explore joins, aggregations, and typical transit schemas. **Results** show tabular output from your queries, and the **Tables** panel lists imported tables with a short row preview.

## Stack

- [SQLite](https://sqlite.org/) via [sql.js](https://sql.js.org/) (WebAssembly)
- [CodeMirror](https://codemirror.net/) for the editor
- [JSZip](https://stuk.github.io/jszip/) and [Papa Parse](https://www.papaparse.com/) for GTFS / CSV handling

## How to run

Serve the repository root over HTTP (recommended so the SQL WASM asset loads reliably), for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` and use **Choose GTFS `.zip`** to import, **Build SQLite database**, and **Run** your SQL.
