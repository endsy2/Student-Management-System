import { parse } from 'csv-parse/sync';

/** Parses a CSV buffer into an array of row objects keyed by header. */
export function parseCsv(buffer: Buffer): Record<string, string>[] {
  return parse(buffer, {
    columns: (header: string[]) => header.map((h) => h.trim()),
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];
}
