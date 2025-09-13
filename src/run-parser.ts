import { z, ZodType } from "zod";
import * as fs from "fs";
import * as readline from "readline";

/*
  Example of how to run the parser outside of a test suite.
*/
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

async function parseCSVWithHeader(path: string): Promise<{ header: string[]; rows: string[][] }> {
  const all = await readRows(path);
  if (all.length === 0) return { header: [], rows: [] };
  const [header, ...rows] = all;
  return { header, rows };
}

// NEW: map object according to the header
function mapRowsToObjects(header: string[], rows: string[][]): Array<Record<string, string | undefined>> {
  return rows.map((row) => {
    const obj: Record<string, string | undefined> = {};
    for (let i = 0; i < header.length; i++) {
      obj[header[i]] = row[i];
    }
    return obj;
  });
}

// override

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
  .transform((t) => ({ name: t[0], age: t[1] }));
type Person = z.infer<typeof PersonRowSchema>;

async function main() {
  // without schema
  const raw = await parseCSV(DATA_FILE);
  console.log("raw:", raw);

  // with schema (tuple -> object)
  const people: Person[] = await parseCSV(DATA_FILE, PersonRowSchema);
  console.log("people:", people);

  // get header and "inject"
  const { header, rows } = await parseCSVWithHeader(DATA_FILE);
  console.log("header:", header);            
  console.log("first data row:", rows[0]);   

  const objects = mapRowsToObjects(header, rows);
  console.log("objects (by header):", objects.slice(0, 2)); 

  // valid obj
  const PersonByKeySchema = z.object({
    name: z.string(),
    age: z.coerce.number().positive(),
  });

  // checked row by row
  const checked = objects.map((obj, i) => {
    const res = PersonByKeySchema.safeParse(obj);
    if (!res.success) {
      throw new Error(`object row ${i} failed: ${JSON.stringify(res.error.issues)}`);
    }
    return res.data;
  });
  console.log("checked (by key schema):", checked.slice(0, 2));
}