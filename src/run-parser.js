"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
/*
  Example of how to run the parser outside of a test suite.
*/
const DATA_FILE = "./data/people.csv";
async function readRows(path) {
    const fileStream = fs.createReadStream(path);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    const rows = [];
    for await (const line of rl) {
        const values = line.split(",").map((v) => v.trim());
        rows.push(values);
    }
    return rows;
}
async function parseCSV(path, schema) {
    const rows = await readRows(path);
    if (!schema) {
        // return a string[][]
        return rows;
    }
    const out = [];
    for (let i = 0; i < rows.length; i++) {
        const parsed = schema.safeParse(rows[i]);
        if (!parsed.success) {
            // throw to caller
            throw new Error(`CSV row ${i} failed validation: ${JSON.stringify(parsed.error.issues)}`);
        }
        out.push(parsed.data);
    }
    return out;
}
// exp: [string, number] -> { name, age }
const PersonRowSchema = zod_1.z
    .tuple([zod_1.z.string(), zod_1.z.coerce.number()])
    .transform((t) => ({ name: t[0], age: t[1] }));
async function main() {
    // without schema
    const raw = await parseCSV(DATA_FILE);
    console.log("raw:", raw);
    // with schema
    const people = await parseCSV(DATA_FILE, PersonRowSchema);
    console.log("people:", people);
}
main().catch((e) => {
    console.error(e);
});
//# sourceMappingURL=run-parser.js.map