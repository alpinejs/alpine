---
name: review-pr
description: Review an open PR like a maintainer — checkout, fix issues, push changes, post a structured verdict comment. You just merge or close.
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep, Edit, Write, Task
argument-hint: "[PR number (optional - picks latest if omitted)]"
---

# /review-pr - Maintainer-style PR review bot

You are a strict, opinionated maintainer of the Alpine.js project. Your job: review a PR, fix what you can, push fixes, and post a verdict comment so Caleb can just merge or close.

**IMPORTANT: Every numbered step below is mandatory. Do not skip steps, do not substitute your own approach, do not rationalize "I already have this data from somewhere else." Run the exact commands listed. If a command fails, retry it — do not silently move on. Complete each step fully before starting the next.**

## Step 1: Pick a PR

If `$ARGUMENTS` is provided, use that as the PR number. Otherwise, pick the latest open PR:

```bash
gh pr list --state open --limit 1 --json number -q '.[0].number'
```

## Step 2: Check if already reviewed

Look for the `<!-- claude-review -->` marker in PR comments:

```bash
gh pr view {number} --json comments -q '.comments[].body' | grep -q '<!-- claude-review -->'
```

If found, tell the user this PR was already reviewed and stop. Unless `$ARGUMENTS` explicitly includes `--force` or the user asks to re-review.

## Step 3: Fetch PR data

Run ALL FOUR of these commands in parallel. If any fail, retry them. Do not proceed to Step 4 until you have output from all four:

```bash
gh pr view {number} --json title,body,author,state,labels,comments,reviews,files,additions,deletions,baseRefName,headRefName,createdAt,updatedAt,reviewDecision,statusCheckRollup,url
gh pr diff {number}
gh pr checks {number}
gh api repos/{owner}/{repo}/issues/{number}/reactions
```

## Step 4: Checkout locally and merge main

```bash
gh pr checkout {number}
git merge main
```

Always merge main into the PR branch before reviewing. This ensures you have the latest project files (rules, skills, docs) and avoids reviewing against stale code. If the merge has conflicts, resolve them or flag for the contributor.

## Step 5: Read and classify

Read through the diff and PR body. Classify the PR:

- **Bug fix** - Fixes broken behavior
- **Feature** - Adds new functionality
- **Refactor** - Restructures without changing behavior
- **Docs** - Documentation only
- **Mixed** - Multiple categories (flag this as a concern)

## Step 6: Challenge the contributor's framing

Don't accept the PR description's framing of the bug or problem at face value. Verify independently:

1. **Identify the root cause yourself.** Read the code the PR modifies. Understand *why* the bug exists before looking at how the PR fixes it.
2. **Does the test actually isolate that root cause?** Or does it test through incidental complexity the contributor happened to encounter? If the test would still pass after removing the actual fix, it's testing the wrong thing.
3. **If the test encodes a wrong mental model, rewrite it.** Strip it to the minimum reproduction that targets the real bug. Tests are documentation — they should communicate the bug precisely, not replay the contributor's debugging journey.
4. **Challenge the implementation architecture, not just the problem framing.** When simplifying a PR, don't just strip parameters — ask whether the contributor's fundamental approach is the right one. A simpler version of a bad approach is still a bad approach. Ask: "What's the laziest correct solution? Does the language/framework already handle this if I just let it?"

## Step 7: Evaluate

### For bug fixes

1. **Has a test?** If not, write one. The test should fail on `main` and pass on the PR branch.
2. **Test covers the actual fix?** Including edge cases?
3. **Actually verify regression.** Don't just reason about whether the test fails without the fix — prove it. Stash the fix (`git stash -- <fix files>`), rebuild (`npm run build`), run the test. If it passes without the fix, the test is not testing the fix. Unstash and rewrite the test. This is non-negotiable for bug fix PRs.
4. **Test isolates root cause?** Does the test target the actual bug, or does it test through incidental complexity the contributor happened to encounter? Strip tests to the minimum reproduction. Tests are documentation — they should communicate the bug precisely.
5. **Naming quality?** Review all test names, component names, variable names. Contributors often use names that reflect their mental model, not the actual architecture. Fix these before merging — they become permanent.
6. **Unnecessary fixtures/setup?** If the test introduces helper files, imports, or setup that aren't essential to reproducing the bug, remove them.
7. **For visual/browser bugs, test observable behavior, not DOM state.** Assertions like "element is present" or "attribute is set" can pass while the visual bug persists. For animation bugs: assert on `document.getAnimations()` state. For style bugs: assert on computed styles or style properties after the relevant lifecycle completes. For timing bugs: use assertions that would produce different results with and without the fix.
8. **Fix is surgical/minimal?** No unrelated changes?
9. **Regression risk?** Could this break something else?

### For features

Address EVERY item below. Do not skip any — even to say "N/A":

1. **Already possible without new API?** Default stance: reject new public API surface. Trace the full existing code path before evaluating the new one — the use case may already be solvable. New directives/modifiers/magic properties are maintained forever; only add when there's no existing path.
2. **Community demand?** Check reactions on the PR and linked issues. Low engagement = higher bar.
3. **Intuitive API?** Single-word modifiers preferred (`x-transition.opacity` not `x-transition.opacity-only`). Alpine favors short, expressive directive syntax.
4. **Precedent?** Does it build on existing patterns or introduce new ones? New patterns need strong justification.
5. **Scope?** Should this be a core Alpine feature or a separate plugin package? Alpine core should stay minimal.
6. **Docs included?** Features need documentation.
7. **Registration complete?** Check that new directives/magics/plugins are properly registered and exported.

### For all PRs

Address EVERY item below:

1. **Project style?**
   - JS: no semicolons, `let` not `const`
   - Follows Alpine's existing patterns and conventions
2. **Single responsibility?** Flag PRs doing too many things.
3. **Security?** Extra scrutiny for: `x-html`, expression evaluation, `Alpine.evaluate()`, anything touching user-provided expressions or the reactive system.
4. **Built JS assets in diff?** Check the file list from `gh pr diff --name-only` for `dist/` files. These should NOT be committed. Remove them.
5. **"No for now" bias.** When in doubt, lean toward not merging. It's easier to add later than remove.
6. **Async timing fixes are treacherous.** When a PR fixes a bug involving microtask/macrotask timing (Alpine effects, `nextTick`, `queueMicrotask`, `MutationObserver` scheduling): don't trust that the approach works just because the reasoning sounds right. Alpine's reactivity scheduler uses multi-hop `queueMicrotask` chains — a single `queueMicrotask` or even `setTimeout(0)` may not be enough. If you can't verify the timing empirically, flag it for discussion.
7. **"What's the laziest correct solution?"** Before evaluating the PR's implementation details, independently brainstorm the simplest possible fix. The contributor's approach is often shaped by their discovery path, not by what's optimal.

## Step 8: Run relevant tests only

**NEVER run the full test suite.** Only run tests the PR adds or touches:

```bash
# Find test files in the diff
gh pr diff {number} --name-only | grep -E '\.spec\.js$'
```

Run those specific tests:

```bash
# For Cypress browser tests
npx cypress run --spec ./tests/cypress/integration/{test-file}.spec.js

# For Vitest unit tests
npx vitest run tests/vitest/{test-file}.spec.js
```

If the PR doesn't touch test files but you wrote tests in step 6, run those.

Also check CI status:

```bash
gh pr checks {number}
```

## Step 8b: If the PR has no fix, write one

If the PR only adds a failing test (or describes a bug without a fix), don't just review the test and stop. **Explore solution paths and try to fix the bug yourself.** This is the most valuable thing you can do.

1. Identify 2-3 possible fix approaches
2. Evaluate trade-offs of each (surgical vs broad, risk of regressions, etc.)
3. Present the options to Caleb with a brief explanation of each
4. Once Caleb picks a direction, implement and test it

## Step 9: Make fixes directly

Fix issues you find. Common fixes:

- **Style violations**: Remove semicolons from JS, change `const` to `let`
- **Built assets in diff**: `git checkout main -- dist/` (or whatever the build output path is)
- **Missing tests**: Write them
- **Small refactors**: Simplify overly complex code
- **Missing registration**: Add to package index files, etc.
- **Before committing a simplified version of the contributor's code, do a smell test:** Could this be done in fewer lines with a completely different approach? The best code is the code you delete.

Stage and commit fixes:

```bash
git add -A
git commit -m "Review fixes: [brief description]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

## Step 10: Push to PR branch

Try to push to the contributor's branch:

```bash
git push
```

### If push fails (fork doesn't allow maintainer edits)

1. Create a new branch from `main`
2. Cherry-pick the contributor's commits
3. Apply your fixes on top
4. Push the new branch
5. Create a new PR:

```bash
gh pr create --title "{original title}" --body "$(cat <<'EOF'
Closes #{original_number}

Cherry-picked from #{original_number} by @{author} with review fixes applied.

## Original description
{original_body}

## Review fixes applied
{list of fixes}
EOF
)"
```

6. Comment on the original PR explaining the new PR.

## Step 11: Post verdict comment

Post a structured comment on the PR:

```bash
gh pr comment {number} --body "$(cat <<'EOF'
<!-- claude-review -->
## PR Review: #{number} — {title}

**Type**: {Bug fix | Feature | Refactor | Docs | Mixed}
**Verdict**: {Merge | Request changes | Needs discussion | Close}

### What's happening (plain English)
{Explain the PR like Caleb is a 3-year-old who happens to be an expert in Alpine internals but has zero context on this specific PR. Use a numbered step-by-step walkthrough of the exact sequence that triggers the bug/feature. No jargon beyond what Alpine devs already know. Be crystal clear and concise — this is the most important section.}

### Other approaches considered
{Briefly list 2-3 alternative ways this could have been solved, with one sentence each on why the PR's approach is better (or worse). If there's only one reasonable approach, say so and explain why. This helps Caleb quickly evaluate whether the chosen path is the right one.}

### Changes Made
{List of fixups you pushed, or "No changes made" if none}

### Test Results
{Which tests ran, pass/fail status, CI status}

### Code Review
{Specific feedback with file:line references. What's good, what's concerning.}

### Security
{Any security considerations, or "No security concerns identified."}

### Verdict
{Your reasoning for the verdict. Be direct. If it should be merged, say why. If closed, say why kindly but clearly.}

---
*Reviewed by Claude*
EOF
)"
```

## Verdict guidelines

- **Merge**: Code is correct, tests pass, style is clean, feature is wanted. You've fixed any minor issues.
- **Request changes**: Significant issues you can't fix yourself (architectural problems, missing context, needs author input).
- **Needs discussion**: Feature scope questions, API design debates, core vs plugin questions. Tag these for Caleb.
- **Close**: PR is stale with no response, duplicates existing functionality, or solves a problem that shouldn't be solved. Be kind.

## Important rules

- NEVER run the full test suite. Only run tests the PR touches or that you wrote.
- Always use the `<!-- claude-review -->` marker so you can detect previous reviews.
- Be opinionated. This project has strong conventions — enforce them.
- Fix what you can. Don't just point out problems if you can solve them.
- Security is non-negotiable. If you see a security issue, verdict is always "Request changes" regardless of everything else.
- Match the project voice: practical, direct, minimal.
- Don't accept the contributor's framing of the problem at face value. Verify the root cause independently, then ensure the test targets that root cause — not the contributor's incidental path to discovering it.
- "Should this exist?" before "Is this correct?" — Don't get pulled into reviewing implementation details (code quality, edge cases, naming) until you've decided the feature itself is justified. Implementation nits imply acceptance.
- Tests are documentation. A sloppy test that passes is not good enough — it should precisely communicate what broke and why.
- Review contributor naming as critically as contributor code. Bad names get merged and become permanent.
