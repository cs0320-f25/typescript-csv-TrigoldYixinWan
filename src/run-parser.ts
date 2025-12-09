// CommonJS import
const { z } = require("zod");
const fs = require("fs");
const readline = require("readline");

// Type aliases for Zod generics
type ZodType<T> = import("zod").ZodType<T>;
type Infer<T> = import("zod").infer<T>;

const DATA_FILE = "./data/people.csv";

async function readRows(path: string): Promise<string[][]> {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rows: string[][] = [];
  for await (const line of rl) {
    const values = line.split(",").map((v: string) => v.trim());
    rows.push(values);
  }
  return rows;
}

async function parseCSVWithHeader(
  path: string
): Promise<{ header: string[]; rows: string[][] }> {
  const all = await readRows(path);
  if (all.length === 0) return { header: [], rows: [] };

  const [header, ...rows] = all as [string[], ...string[][]];
  return { header, rows };
}
function mapRowsToObjects(
  header: string[],
  rows: string[][]
): Array<Record<string, string | undefined>> {
  return rows.map((row) => { 
    const obj: Record<string, string | undefined> = {};
    const len = Math.min(header.length, row.length);
    for (let i = 0; i < len; i++) {
      obj[header[i]!] = row[i]; // claim a non-outbound condition
    }
    return obj;
  });
}

//  Overloads
// without schema：return string[][]
function parseCSV(path: string): Promise<string[][]>;
// with Zod schema：return T[]
function parseCSV<T>(path: string, schema: ZodType<T>): Promise<T[]>;

async function parseCSV<T>(
  path: string,
  schema?: ZodType<T>
): Promise<string[][] | T[]> {
  const rows = await readRows(path);

  if (!schema) {
    // return a string[][]
    return rows;
  }

  const out: T[] = [];
  for (let i = 0; i < rows.length; i++) {
    const parsed = schema.safeParse(rows[i]);
    if (!parsed.success) {
      // throw to caller
      throw new Error(
        `CSV row ${i} failed validation: ${JSON.stringify(parsed.error.issues)}`
      );
    }
    out.push(parsed.data);
  }
  return out;
}

// exp: [string, number] -> { name, age }
const PersonRowSchema = z
  .tuple([z.string(), z.coerce.number()])
  .transform((t: [string, number]) => ({ name: t[0], age: t[1] }));
type Person = Infer<typeof PersonRowSchema>;

