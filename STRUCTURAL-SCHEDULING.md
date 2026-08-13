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

The test fails with five rows when structural jobs preserve notification order. It passes with three rows when structural effects are ordered by current logical-tree depth. Creation order is only the deterministic tie-breaker for structural owners at the same depth.

Creation order alone is insufficient. Alpine supports moving initialized nodes, and morphing can relocate keyed nodes. A focused case moves an older `x-for` beneath a newer `x-if` immediately before invalidating their shared state. Static IDs run the older child first; current logical depth runs the removing parent first.

## Prototype mechanics

- Structural element-bound effects retain their owner element and receive a monotonically increasing creation order.
- An effect can opt into the `structural` scheduler phase.
- When structural work is pending, the unprocessed queue tail is sorted by current logical depth and then creation order; ordinary jobs retain FIFO order after structural work.
- Logical depth follows teleport-back links and shadow hosts rather than relying only on physical DOM placement.
- If an ordinary job schedules structural work, the unprocessed tail is sorted again before the next job without moving work ahead of jobs that already ran.
- The existing `queue.includes(job)` check continues to dedupe job identities for the entire flush.
- `dequeueJob` retains its existing pending-work semantics.

## Evidence so far

- Exact Alpine #4851 reproduction passes.
- A nested keyed-range scope reproduction passes.
- A nested structural-on-structural reproduction fails without parent ordering and passes with it.
- Moved initialized nodes preserve current parent-before-child ordering.
- Teleported descendants follow the teleport source's logical ancestry.
- Livewire's real request, transaction, and morph path produces 1–15 and then 13–30 with a Livewire bundle built against this branch.
- A deterministic browser stress test validates 800 seeded batches across nested keyed scopes, removing ancestors, teleports, `x-html`, reused keys, shuffled assignment order, and transaction/non-transaction flushes. It checks the complete rendered state after every flush.
- A scheduler property test validates 3,200 randomized jobs across logical depth, teleport backlinks, ordinary FIFO order, and pending-job removal.
- Both stress tests were mutation-tested: disabling structural priority fails the browser oracle on its first seeded batch, and replacing logical depth with static creation order fails the scheduler property on its first seed.
- Full Vitest: 185 passed and 1 skipped.
- Focused Cypress covers `x-for`, `x-if`, `x-html`, teleport, cloning, morphing, transaction batching, and mutation cleanup.
- The complete Cypress suite passes.
- Production build passes.
- Both GitHub Actions jobs pass.

Three alternating browser runs produced these average medians:

| Workload | `main` | spike |
| --- | ---: | ---: |
| 1,000 leaf effects | 3.50 ms | 3.40 ms |
| 100 sibling `x-for` directives with 1,000 leaves | 8.93 ms | 8.70 ms |
| 100 nested outer loops with 500 inner leaves | 3.63 ms | 3.67 ms |
| 100 `x-if` directives | 1.07 ms | 1.10 ms |
| 100 replacing `x-html` directives | 17.30 ms | 1.80 ms |

The `x-html` improvement is not scheduler magic: `main` leaves each replaced child's reactive effect subscribed, so obsolete detached effects accumulate throughout the benchmark. Destroying the old Alpine tree prevents that leak and lets the scheduler dequeue those obsolete jobs.

The final minimal version deliberately retains Alpine's existing `Array.includes` dedupe instead of mixing a queue-membership optimization into this fix. The browser measurements above were rerun after that scheduler reduction.

## Prior art

[Vue's runtime scheduler](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/scheduler.ts) explicitly orders component jobs parent before child so a parent's update can unmount a child before the child's queued update runs. It uses job IDs, an in-queue flag, and a pre-job flag. That is strong support for making structural ordering an explicit scheduler invariant rather than depending on subscriber notification order.

Alpine cannot copy Vue's static-ID rule exactly. Alpine directives can be moved and teleported independently, so current logical DOM ancestry is the meaningful relationship. This spike keeps Vue's useful properties—explicit priority, parent-first teardown, whole-flush identity dedupe—without adopting its recursive-job and post-flush machinery.

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

The scheduler's existing behavior when a job throws is also unchanged: a thrown job aborts the flush. Hardening global scheduler error recovery would be valuable, but it is independent of stale structural scope and should not ride this fix.

## Design conclusion

The smallest rule that survives the counterexamples is:

1. Keep whole-flush identity dedupe.
2. Mark only subtree-owning reactive directives (`x-for`, `x-if`, and `x-html`) as structural.
3. Before each ordinary job, run all pending structural jobs parent before child using current logical depth.
4. Preserve FIFO order for ordinary work.

Anything smaller has a demonstrated hole: `x-for` alone fails under removing ancestors, phase-only fails for nested structures, static creation order fails for moved structures, and requeueing changes the global convergence contract.
