import Database from "better-sqlite3";
import { config } from "./config";

export const db = new Database(config.dbPath, {
  readonly: true,
});

db.pragma("journal_mode = WAL");
