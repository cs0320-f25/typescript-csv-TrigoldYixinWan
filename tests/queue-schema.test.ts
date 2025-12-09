import { z } from "zod";
import {
  NumberQueueSchema,
  exampleQueueEmpty,
  exampleQueue123,
  exampleQueueBadSize,
  makeQueueSchema,
} from "../src/schemas/queue";

describe("Queue Zod schema", () => {
  test("accepts empty queue", () => {
    const parsed = NumberQueueSchema.parse(exampleQueueEmpty);
    console.log("Queue (empty) JSON:\n" + JSON.stringify(parsed, null, 2));
    expect(parsed.head).toBeNull();
    expect(parsed.size).toBe(0);
  });

  test("accepts FIFO linked nodes and correct size", () => {
    const parsed = NumberQueueSchema.parse(exampleQueue123);
    console.log("Queue (1->2->3) JSON:\n" + JSON.stringify(parsed, null, 2));
    expect(parsed.size).toBe(3);
    expect(parsed.head?.value).toBe(1);
    expect(parsed.head?.next?.value).toBe(2);
    expect(parsed.head?.next?.next?.value).toBe(3);
    expect(parsed.head?.next?.next?.next).toBeNull();
  });

  test("rejects when size does not match node count", () => {
    expect(() => NumberQueueSchema.parse(exampleQueueBadSize)).toThrow();
  });

  test("supports generic element type via factory", () => {
    const StringQueueSchema = makeQueueSchema(z.string());
    const ok = {
      size: 2,
      head: { value: "a", next: { value: "b", next: null } },
    };
    const parsed = StringQueueSchema.parse(ok);
    console.log("Queue (string a->b) JSON:\n" + JSON.stringify(parsed, null, 2));
    expect(parsed.head?.value).toBe("a");
    expect(parsed.head?.next?.value).toBe("b");
  });

  test("rejects invalid element type", () => {
    const StringQueueSchema = makeQueueSchema(z.string());
    const bad = {
      size: 1,
      head: { value: 123, next: null }, // not a string
    };
    expect(() => StringQueueSchema.parse(bad)).toThrow();
  });
});
