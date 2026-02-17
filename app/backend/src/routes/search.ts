import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);

  const stmt = db.prepare(`
    SELECT id, name, package, file, line
    FROM symbol_index
    WHERE name LIKE ?
    AND kind = 'function'
    ORDER BY name
    LIMIT 50
  `);

  const results = stmt.all(`%${q}%`);
  res.json(results);
});

export default router;
