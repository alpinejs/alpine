# Alpine.js Development Guidelines

## Pull Request Evaluation Criteria

When evaluating pull requests for Alpine.js, assess the following:

### 1. Tests
- Are tests provided for the change?
- Do existing tests still pass?
- For configuration changes (package.json, build scripts), tests may not be required

### 2. Code Style
- Does the code match Alpine's existing patterns?
- Check indentation, naming conventions, and structure
- For package.json changes, ensure consistency with other packages in the monorepo

### 3. Code Quality
- Is the code clean and maintainable?
- Is the change focused and minimal?
- Are there any unnecessary changes or complexity?
- Does this PR contain changes that should apply elsewhere?

### 4. Simplicity
- Is this a simple, focused change?
- Does it follow Alpine's philosophy of simplicity?
- Could it be implemented more simply?
- Are the proposed additions intuitive for users? or do they require extra knowledge that they have to dig for.

### 5. Precedent
- Does this PR (both public facing additions and internal implementation) follow established precedents in the project
- Does it use terms that are unfamiliar to the project as of yet?

### 6. Description Quality
- Is there a clear explanation of what/why/how?
- Are breaking changes documented?
- Is backward compatibility addressed?

### 7. Community Engagement
- Are there comments, reviews, or discussions?
- Has it been approved by maintainers?
- Are there any conflicting opinions or unresolved concerns?

### Mergeability Rating
Based on the above, rate as:
- **HIGH**: Ready to merge (all criteria met, approved)
- **MEDIUM**: Needs attention (technically sound but missing reviews/tests)
- **LOW**: Requires work (has issues or conflicts to resolve)

## Project Structure

Alpine.js is a monorepo with packages in `/packages/`:
- Each package has its own package.json
- Build outputs go to `dist/` with `.cjs.js`, `.esm.js`, and `.min.js` versions
- Tests use Jest framework
- CI runs on GitHub Actions

## Common Commands

```bash
# Review PRs
gh pr list                    # List open PRs
gh pr view [number]          # View PR details
gh pr diff [number]          # View code changes
gh pr checks [number]        # Check CI status
gh api repos/alpinejs/alpine/pulls/[number]/comments  # View comments

# Testing
npm test                     # Run all tests
npm run build               # Build all packages
```

## Summary

After assessing the pull request on the above qualities, provide a summary explaining the problem this PR addresses and the fix, and why it's a good or bad fix. Do it in plain language as if you are personally advising me on what the PR is and weather or not I should merge it. And if not, what might need to be addressed first. If things need to be addressed, offer to address them yourself.

Please use code snippets to establish a starting point and and ending point if helpful. For example, when explaining the problem, it is often easier to provide a brief explanation alongside a code snippet of what is currently problematic, then when explaining the solution, showing what new code will allow a fix if applicable.