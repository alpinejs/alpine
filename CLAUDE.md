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

### 4. Simplicity
- Is this a simple, focused change?
- Does it follow Alpine's philosophy of simplicity?
- Could it be implemented more simply?

### 5. Description Quality
- Is there a clear explanation of what/why/how?
- Are breaking changes documented?
- Is backward compatibility addressed?

### 6. Community Engagement
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