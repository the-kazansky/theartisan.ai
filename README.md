# CPG IDE

## Overview

An interactive web-based IDE for exploring a Code Property Graph (CPG).

## Tech Stack

- Backend: Node.js + Express + better-sqlite3
- Frontend: Vue 3 + Cytoscape
- Database: SQLite (pre-generated CPG)

## Setup

1. Download `cpg.db` from the latest Release. Place it in the project root.

2. Run:
   `docker compose up`

3. Open:
   http://localhost:5173

The `cpg.db` (~1GB) is pre-generated and included to ensure reproducibility.

## Design Notes

The goal of this project was not to render the entire CPG (which would be impractical), but to make it explorable in meaningful slices.

Instead of loading the full graph (~600k nodes), the application focuses on:

- Package-level overview
- 1-hop call graph exploration
- Direct symbol search
- Inline source code inspection

Each view intentionally limits the number of nodes rendered to keep interaction fast and readable.

### Architecture

The backend (Node.js + SQLite) is responsible for returning small, well-scoped graph slices.
The frontend (Vue + Cytoscape) focuses entirely on interactive visualization and navigation.

Queries rely on existing CPG views (_v_function_summary_, _dashboard_package_graph_, _sources_).

### Performance

- Graph expansion is capped
- Only indexed lookups are used
- No full-graph traversal is performed

The app runs smoothly on the full ~1GB database

### Trade-offs

Call graph exploration is limited to 1 hop.

Advanced analyses (taint, deeper slicing) are not exposed in the UI.

The focus was clarity, interactivity, and practical usability over feature breadth.
