import { db } from "../db";

export class PackageService {
  getPackageGraph() {
    const stmt = db.prepare(`
      SELECT source, target, weight
      FROM dashboard_package_graph
      ORDER BY weight DESC
      LIMIT 600
    `);

    return stmt.all();
  }

  getFunctionsByPackage(pkg: string) {
    const stmt = db.prepare(`
      SELECT id, name, file, line
      FROM v_function_summary
      WHERE package = ?
      ORDER BY name
      LIMIT 200
    `);

    return stmt.all(pkg);
  }
}
