const fs = require("fs");
const readline = require("readline");

async function readRows(path: string): Promise<string[][]> {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  const rows: string[][] = [];
  for await (const line of rl) {
    const values = line.split(",").map((v: string) => v.trim());
    rows.push(values);
  }
  return rows;
}

async function parseCSVWithHeader(path: string): Promise<{ header: string[]; rows: string[][] }> {
  const all = await readRows(path);
  if (all.length === 0) return { header: [], rows: [] };
  const [header, ...rows] = all as [string[], ...string[][]];
  return { header, rows };
}

function mapRowsToObjects(header: string[], rows: string[][]): Array<Record<string, string | undefined>> {
  return rows.map((row) => {
    const obj: Record<string, string | undefined> = {};
    const len = Math.min(header.length, row.length);
    for (let i = 0; i < len; i++) obj[header[i]!] = row[i];
    return obj;
  });
}

const { z } = require("zod");
// Define a row schema and a transformed Person object
const PersonRowSchema = z
  .tuple([z.string(), z.coerce.number()])
  .transform((t: [string, number]) => ({ name: t[0], age: t[1] }));

async function main() {
  const path = "./data/people.csv";
  const { header, rows } = await parseCSVWithHeader(path);
  // Print metadata before concrete data
  const rowCount = rows.length;
  const headerCount = header.length;
  const colCounts = rows.map(r => r.length);
  const minCols = colCounts.length ? Math.min(...colCounts) : 0;
  const maxCols = colCounts.length ? Math.max(...colCounts) : 0;
  console.log("CSV metadata:");
  console.log(JSON.stringify({
    file: path,
    header,
    headerCount,
    rowCount,
    minColumns: minCols,
    maxColumns: maxCols
  }, null, 2));
  const objs = mapRowsToObjects(header, rows);
  console.log(JSON.stringify(objs, null, 2));

  // Zod transformation metadata
  const results = rows.map((r) => PersonRowSchema.safeParse(r));
  const valid = results.filter((r: any) => r.success).map((r: any) => r.data);
  const invalid = results.filter((r: any) => !r.success);
  const issues = invalid.flatMap((r: any) => r.error.issues);
  console.log("Zod transformation metadata:");
  console.log(
    JSON.stringify(
      {
        schemaKind: "tuple([string, coerce.number]).transform -> {name, age}",
        headerUsed: header,
        totalRows: rows.length,
        validCount: valid.length,
        invalidCount: invalid.length,
        sampleValid: valid.slice(0, 2),
        issues: issues,
      },
      null,
      2
    )
  );
}

main().catch((e: unknown) => {
  if (e instanceof Error) console.error(e.message);
  else console.error(String(e));
});
