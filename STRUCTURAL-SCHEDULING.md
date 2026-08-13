# Structural scheduling spike

## Problem boundary

This spike targets one class of glitch:

1. Application state changes before Alpine's scheduled flush begins.
2. A structural effect and effects inside the structure depend on that state.
3. The inner effects can run while the structure or its injected scope still represents the previous state.
4. Whole-flush deduping then prevents a corrective rerun.

The goal is to prevent consumers from observing stale structure. The goal is not to make arbitrary effect graphs converge or to redefine recursive `x-effect` behavior.

## Proposed invariant

Before Alpine runs an ordinary effect, it drains every pending structural effect. Structural effects run parent before child based on their current logical-tree depth, with creation order as the tie-breaker.

Alpine keeps its existing whole-flush dedupe contract: a job runs at most once during a flush.

The implementation marks `x-for`, `x-if`, and `x-html` as structural. Promoting only `x-for` makes it run ahead of an `x-if` or `x-html` ancestor that is trying to remove it, allowing the loop to evaluate invalidated state before it is destroyed. Focused tests cover both compositions.

`x-html` also needs to destroy Alpine's old child tree before replacing `innerHTML`. Without that lifecycle cleanup, removed descendant effects remain queued even when `x-html` runs first.

## Why parent-before-child is required

A structural phase by itself is insufficient for nested loops.

The adversarial test has an inner `x-for` whose range depends on both outer application state and the outer loop's injected scope. If the inner loop runs first, it creates five rows from mixed new/old state. The outer loop then refreshes its scope, but whole-flush dedupe suppresses the inner loop's corrective run.

The test fails with five rows when structural jobs preserve notification order. It passes with three rows when structural effects are ordered by creation sequence, which puts the parent effect before effects created inside it.

## Prototype mechanics

- Structural element-bound effects retain their owner element and receive a monotonically increasing creation order.
- An effect can opt into the `structural` scheduler phase.
- When structural work is pending, the unprocessed queue tail is sorted by current logical depth and then creation order; ordinary jobs retain FIFO order after structural work.
- Logical depth follows teleport-back links and shadow hosts rather than relying only on physical DOM placement.
- If an ordinary job schedules structural work, the unprocessed tail is sorted again before the next job without moving work ahead of jobs that already ran.
- A single Set dedupes job identities for the entire flush.
- `dequeueJob` retains its existing pending-work semantics.

## Evidence so far

- Exact Alpine #4851 reproduction passes.
- A nested keyed-range scope reproduction passes.
- A nested structural-on-structural reproduction fails without parent ordering and passes with it.
- Full Vitest: 177 passed and 1 skipped.
- Focused Cypress: 103 passed across `x-for`, `x-if`, `x-html`, `x-model`, `$nextTick`, and mutation cleanup.
- The complete Cypress suite passes.
- Production build passes.

Synthetic Node/V8 scheduler-only timings show small queues paying sub-microsecond to low-microsecond overhead and 1,000-job queues improving because Set membership replaces repeated array scans. These are directional only; browser/DOM benchmarks remain required.

## Alternatives

### Pending-only dedupe plus recursion limit

This permits any completed job to requeue until the graph stabilizes or reaches a run ceiling. It fixes the examples, but changes Alpine's global effect contract and accepts arbitrary re-entrancy. It is the better design only if Alpine intends to become a stabilization scheduler.

### Make `x-for` synchronous

This establishes its scope before scheduled consumers, but processes intermediate state between multiple synchronous assignments and forfeits batching. It can perform avoidable DOM reconciliation and exposes partially applied application updates.

### Rerun descendants from `x-for`

Calling element effects after scope refresh is local but incomplete for nested descendants, duplicates work, and couples `x-for` to effects it does not own. Traversing the subtree would be a second scheduler hidden inside the directive.

### Defer scope refresh to another microtask

This causes a corrective flush but temporarily separates DOM reconciliation from scope correctness. Nested structures and cleanup can observe the split state.

### Depend on Vue subscriber order

Resubscribing `x-for` or manipulating dependency insertion order might make it notify first, but that would encode an undocumented engine detail rather than an Alpine scheduling invariant.

## Known boundary

Structural-first scheduling guarantees ordering for work invalidated before the flush and for structural work added while draining the queue. It does not guarantee convergence when ordinary/user effects mutate structural dependencies after other ordinary effects have already completed. Supporting that broader case would require additional phases or completed-job requeueing and is intentionally outside this spike.

## Next gates

1. Validate logical depth ordering through teleports, morphing, cloning, moved nodes, and same-handler move-plus-invalidation cases.
2. Run the full Cypress matrix, not only the focused structural/cleanup suites.
3. Add browser benchmarks for many sibling and nested `x-for` effects.
4. Test integration against Livewire morph and transaction batching.
5. Decide whether scheduler metadata should live on runner functions, as Vue does with job flags and IDs, or in private WeakMaps.
6. Verify that the three-directive structural set is closed under every supported nesting order; do not add leaf directives to the phase.
