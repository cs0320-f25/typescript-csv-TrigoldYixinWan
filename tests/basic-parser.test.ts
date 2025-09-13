import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const PEOPLE_CSV_PATH1 = path.join(__dirname, "../data/people1.csv");
const PEOPLE_CSV_PATH2 = path.join(__dirname, "../data/people2.csv");
const PEOPLE_CSV_PATH3 = path.join(__dirname, "../data/people3.csv");
const PEOPLE_CSV_PATH4 = path.join(__dirname, "../data/people4.csv");
const PEOPLE_CSV_PATH5 = path.join(__dirname, "../data/people5.csv");
const PEOPLE_CSV_PATH6 = path.join(__dirname, "../data/people6.csv");
const PEOPLE_CSV_PATH7 = path.join(__dirname, "../data/people7.csv");


test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

// 1. empty file 
test("empty file return blank array", async () => {
  
  const results = await parseCSV(PEOPLE_CSV_PATH1);
  expect(results).toEqual([]);        
  expect(results).toHaveLength(0);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});


// 2. non-aligned row
test("rows with missing or extra columns are preserved as-is", async () => {

  const results = await parseCSV(PEOPLE_CSV_PATH2)

  expect(results).toEqual([
    ["name","age","job"],
    ["Alice","23","police"],
    ["Bob","thirty"],                 
    ["Charlie","25","artist","Extra"],
    ["Nim","22","accountant"] 
  ]);
});

  test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
  });


// 3. empty row(what's happen for the next rows)
test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

// 4.GPT: string contains comma 
test("parseCSV yields arrays excluding the empty rows", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});
// 5. \t \n
test("test context with \t", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH5)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toStrictEqual(["Alice    Smith", "23"]); // not transfer
  expect(results[2]).toEqual(["Bob", "thirty"]);
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});


// 6. wrong path
test("throws if file path is wrong", async () => {
  const badPath = PEOPLE_CSV_PATH6;

  await expect(parseCSV(badPath))
    .rejects.toThrow(); 
});




// 7. large size(1000character)
test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH7)
  
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toStrictEqual(["xX7pV1cKf2gNq4YtR5jLw8BmZ6sP0aHnE9uT3vD1rJkC7oG5yQxF8lW2iU4zS0bM9eA6dN3hR7tK1pV5cJ8mQ2gL4wX0uF9sY3nB6aH7iO1rD5vE2kT8zP0qC4lU9jG3xW6F0mS8bA7nZ1uH3tV9cK5oL2rJ6yE4dX0gP8iQ7wM1fN3sT9vR5kC2xB4aU6lW0jO8qY7hG1mD3pF9nV5cR2tK4zL0eS8iA7dJ1wX3oM9uH5bQ2yN6gP4fC0rE8vT7kU1lF3X9mW5iO2aB4sN0dH8tV7pC1gL3rJ6yE9zK5uQ2fM4wS0vR8kT7nD1xF3cU6lG9jA5hY2bP4oN0eH8qV7tC1mK3rJ6wX9iU5nB2dL4sF0vR8kT7gE1pM3yQ6cA9lW5jS2hG4", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH7)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});