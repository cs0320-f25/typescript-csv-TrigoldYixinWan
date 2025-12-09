import * as path from "path";
const { parseCSVWithHeader, mapRowsToObjects } = require("../src/run-parser");

/**
 * Quick smoke test: read a CSV and print JSON objects to terminal.
 * This is for demo/logging only; no strict assertions beyond basic shape.
 */
describe("print CSV as JSON", () => {
  const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

  test("log JSON objects mapped by header", async () => {
    const { header, rows } = await parseCSVWithHeader(PEOPLE_CSV_PATH);
    const objects = mapRowsToObjects(header, rows);
    // Print the first few objects as pretty JSON
    // Note: Jest will capture console output; this is intentional for terminal visibility.
    console.log("CSV -> JSON objects:");
    console.log(JSON.stringify(objects, null, 2));

    // Basic sanity checks so the test is meaningful
    expect(Array.isArray(objects)).toBe(true);
    expect(objects.length).toBeGreaterThan(0);
    expect(objects[0]).toHaveProperty("name");
  });
});
