import { z } from "zod";

/**
 * Queue JSON representation (FIFO) using a singly linked list of nodes.
 * We model a queue as an object `{ size, head }`, where `head` is the first node.
 * Each node is `{ value: T, next: Node | null }`. Tail is the node with `next: null`.
 *
 * Notes:
 * - We use z.lazy for recursion. Zod needs a thunk to resolve self-references.
 * - size is informational here; we can optionally refine to check consistency.
 */

export type QueueNode<T> = { value: T; next: QueueNode<T> | null };
export type Queue<T> = { size: number; head: QueueNode<T> | null };

/**
 * Factory to build a Queue schema parameterized by the element schema `elem`.
 * Example: `const NumberQueueSchema = makeQueueSchema(z.number())`.
 */
export function makeQueueSchema<T>(elem: z.ZodType<T>) {
  const NodeSchema: z.ZodType<QueueNode<T>> = z.lazy(() =>
    z.object({
      value: elem,
      next: z.union([NodeSchema, z.null()]),
    })
  );

  const QueueSchema: z.ZodType<Queue<T>> = z
    .object({
      size: z.number().int().nonnegative(),
      head: z.union([NodeSchema, z.null()]),
    })
    // Optional refinement: ensure `size` matches node count.
    .superRefine((q, ctx) => {
      let count = 0;
      let cur = q.head;
      // Guard against extremely deep lists; simple traversal.
      while (cur) {
        count++;
        cur = cur.next;
        if (count > 100_000) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Queue too deep (possible cycle or huge size)",
          });
          break;
        }
      }
      if (count !== q.size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `size (${q.size}) does not match node count (${count})`,
        });
      }
    });

  return QueueSchema;
}

// Example schemas and data for quick usage/tests
export const NumberQueueSchema = makeQueueSchema(z.number());

export const exampleQueueEmpty: Queue<number> = { size: 0, head: null };

export const exampleQueue123: Queue<number> = {
  size: 3,
  head: {
    value: 1,
    next: { value: 2, next: { value: 3, next: null } },
  },
};

export const exampleQueueBadSize: Queue<number> = {
  size: 2, // should be 3
  head: {
    value: 1,
    next: { value: 2, next: { value: 3, next: null } },
  },
};
