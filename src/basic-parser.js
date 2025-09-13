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
exports.parseCSV = parseCSV;
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when
 * mousing over this function name. Try it in run-parser.ts!
 *
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this
 * in class. For now, just leave the "async" and "await" where they are.
 * You shouldn't need to alter them.
 *
 * @param path The path to the file being loaded.
 * @returns a "promise" to produce a 2-d array of cell values
 */
async function parseCSV(path) {
    // This initial block of code reads from a file in Node.js. The "rl"
    // value can be iterated over in a "for" loop. 
    const fileStream = fs.createReadStream(path);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity, // handle different line endings
    });
    // Create an empty array to hold the results
    let result = [];
    // We add the "await" here because file I/O is asynchronous. 
    // We need to force TypeScript to _wait_ for a row before moving on. 
    // More on this in class soon!
    for await (const line of rl) {
        const values = line.split(",").map((v) => v.trim());
        result.push(values);
    }
    return result;
}
//# sourceMappingURL=basic-parser.js.map