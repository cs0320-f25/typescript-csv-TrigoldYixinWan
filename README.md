# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.

- #### Step 2: Use an LLM to help expand your perspective.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 
    I was thinking of the problem of exception of a CSV file: empty, missed row, and NaN data. LLM offer more perspertive from the user(caller) perspective. I think the most important point is about the schema, that the caller can't recognize the type of data. As a caller, I want effectively use the parser, so that auto-schema wrapping is an important function.
    Besides, the escape character is also a problem I found with the help of GPT. 

### Design Choices


### 1340 Supplement
A FIFO queue as JSON using a node-based linked structure is selected because it’s logic fits the csv processor quite well.
- Queue: `{ size: number, head: Node | null }`
- Node: `{ value: T, next: Node | null }`
- `size` allows an integrity check; we refine to ensure the node count matches `size`.
- - `z.lazy` enables recursion for `Node`.
 #### Proof of correctness
 This queue is represented as a JSON “chained node” structure, where each node is { value: T, next: Node|null } and the queue itself is { size, head }. Zod uses z.lazy to ensure the recursive structure is valid, while the elem parameter guarantees consistent types for each value (e.g., all numbers or all strings). Simultaneously, in `.superRefine`, we traverse the linked list starting from the head and count nodes. Validation only passes when the count exactly matches `size`, guaranteeing the structure is finite, contains no intermediate breaks, and aligns declared length with actual nodes. An empty queue `{ size: 0, head: null }` is explicitly supported. Test cases demonstrate rejection for empty queues, valid chains, type constraints, and mismatched sizes, collectively forming the most critical correctness guarantees.
<!-- - #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved -->
#### Errors/Bugs: header not recognized, 
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:6~8 hours
#### Link to GitHub Repo:  

### Supplemental Challenge: Queue schema (CSCI 1340)

We represent a FIFO queue as JSON using a node-based linked structure, validated via Zod v4:

- Queue: `{ size: number, head: Node | null }`
- Node: `{ value: T, next: Node | null }`

Why this shape:
- `z.lazy` enables recursion for `Node`.
- `size` allows an integrity check; we refine to ensure the node count matches `size`.

Where to look:
- File: `src/schemas/queue.ts` — `makeQueueSchema<T>(elem: z.ZodType<T>)` builds a generic `Queue<T>` schema; examples `NumberQueueSchema`, `exampleQueueEmpty`, `exampleQueue123`.
- Tests: `tests/queue-schema.test.ts` cover valid and invalid cases and generic element types.

Limitations and notes for hand-in:
- Enforcing FIFO operations is behavioral (runtime), not a JSON constraint; the schema validates structure only.
- Very deep queues may require streaming checks; cycles are not representable in JSON and would violate the schema.
- A hard maximum length could be added via `.refine` with configuration if needed.
