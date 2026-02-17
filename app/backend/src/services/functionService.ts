import { db } from "../db";
import type { FunctionRow, SourceRow } from "../types";

export class FunctionService {
  getSource(functionId: string) {
    const fn = db
      .prepare(
        `
      SELECT file, line, end_line
      FROM nodes
      WHERE id = ?
    `,
      )
      .get(functionId) as FunctionRow | undefined;

    if (!fn) {
      throw new Error("Function not found");
    }

    const source = db
      .prepare(
        `
      SELECT content
      FROM sources
      WHERE file = ?
    `,
      )
      .get(fn.file) as SourceRow | undefined;

    if (!source) {
      throw new Error("Source not found");
    }

    return {
      file: fn.file,
      startLine: fn.line,
      endLine: fn.end_line,
      content: source.content,
    };
  }
}
