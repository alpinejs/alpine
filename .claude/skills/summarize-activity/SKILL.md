---
name: summarize-activity
description: Summarize recent GitHub activity — discussions, PRs, issues, events, traffic — into an actionable report so you can stay on top of the project without reading everything.
disable-model-invocation: true
allowed-tools: Bash, Read, Task
argument-hint: "[timeframe: 24h (default), 48h, 7d, 1w]"
---

# /summarize-activity - GitHub activity digest

You generate a concise, actionable summary of recent Alpine.js GitHub activity for Caleb.

**IMPORTANT: Every numbered step below is mandatory. Do not skip steps, do not substitute your own approach. Run the exact commands listed. If a command fails, retry it — do not silently move on. Complete each step fully before starting the next.**

## Step 1: Parse timeframe

Parse `$ARGUMENTS` into a cutoff timestamp. Supported formats:
- `24h`, `48h`, `72h` — hours (default: `24h` if no argument)
- `7d`, `14d`, `30d` — days
- `1w`, `2w` — weeks (1w = 7d)

Compute the ISO 8601 cutoff timestamp:

```bash
# Example for 24h:
date -u -v-24H '+%Y-%m-%dT%H:%M:%SZ'
# Example for 7d:
date -u -v-7d '+%Y-%m-%dT%H:%M:%SZ'
```

Store the cutoff timestamp and the human-readable timeframe label (e.g., "last 24 hours", "last 7 days") for use in later steps.

## Step 2: Fetch activity in parallel

Run ALL FIVE of these commands in parallel using the Bash tool. If any fail, retry them. Do not proceed to Step 3 until you have output from all five.

**Owner/repo:** `alpinejs/alpine`

### 2a. Discussions (GraphQL)

```bash
gh api graphql -f query='
{
  repository(owner: "alpinejs", name: "alpine") {
    discussions(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        title
        url
        author { login }
        category { name }
        comments { totalCount }
        body
        answer { author { login } body createdAt }
        createdAt
        updatedAt
      }
    }
  }
}'
```

### 2b. Pull Requests

```bash
gh pr list --repo alpinejs/alpine --state all --limit 50 --json number,title,url,author,state,labels,createdAt,updatedAt,additions,deletions,headRefName,baseRefName,reviewDecision,comments
```

### 2c. Issues

```bash
gh issue list --repo alpinejs/alpine --state all --limit 50 --json number,title,url,author,state,labels,createdAt,updatedAt,comments
```

### 2d. Events

```bash
gh api repos/alpinejs/alpine/events --paginate --jq '.[] | {type, actor: .actor.login, created_at: .created_at, payload_action: .payload.action, ref: .payload.ref, ref_type: .payload.ref_type}' | head -100
```

### 2e. Traffic & stars

```bash
gh api repos/alpinejs/alpine/traffic/views 2>/dev/null; echo "---SEPARATOR---"; gh api repos/alpinejs/alpine/traffic/clones 2>/dev/null; echo "---SEPARATOR---"; gh api repos/alpinejs/alpine --jq '{stargazers_count, forks_count, open_issues_count, watchers_count}'
```

Note: Traffic endpoints require push access. If they return 403, skip traffic data and note it in the report.

## Step 3: Fetch comment threads for active items

For discussions that have comments updated within the timeframe, fetch full comment bodies via GraphQL. Batch up to 10 discussions per query:

```bash
gh api graphql -f query='
{
  repository(owner: "alpinejs", name: "alpine") {
    discussion(number: {NUMBER}) {
      comments(last: 10) {
        nodes {
          author { login }
          body
          createdAt
          updatedAt
        }
      }
    }
  }
}'
```

For the most active PRs and issues (those with comments updated in timeframe), fetch recent comments:

```bash
gh api repos/alpinejs/alpine/issues/{number}/comments --jq '.[] | select(.updated_at > "{CUTOFF}") | {user: .user.login, body: .body, created_at: .created_at}'
```

Only fetch threads that are clearly within the timeframe. Don't fetch everything — be selective.

## Step 4: Filter by timeframe

Discard anything with `updatedAt` / `updated_at` before the cutoff timestamp. Keep items where:
- The item was created within the timeframe
- The item received new comments within the timeframe
- The item changed state (opened, closed, merged) within the timeframe

## Step 5: Analyze and write report

Output a markdown report with these sections. Be concise — this is a digest, not a novel.

---

### Report format:

```markdown
# Alpine.js Activity — {timeframe label}
_{start date} to {end date}_

## TL;DR
{2-3 sentences. What's the pulse? Any fires? Anything exciting? Give Caleb the vibe in 10 seconds.}

## Needs Your Attention
{Actionable items only. Each with a recommended next step: reply, merge, close, investigate, etc.}

- **[Title](url)** by @author — {why it needs attention}. **Action:** {specific recommendation}

{If nothing needs attention, say "Nothing urgent right now."}

## Hot Discussions
{Discussions with the most activity or notable sentiment. Include key quotes if illuminating.}

- **[Title](url)** ({category}) — {N} comments — {brief summary, sentiment note}

{If no notable discussions, say "Quiet on the discussion front."}

## PR Activity

### Opened
- **[#N Title](url)** by @author — {one-line summary} {+additions/-deletions}

### Merged
- **[#N Title](url)** by @author — {one-line summary}

### Closed (not merged)
- **[#N Title](url)** by @author — {one-line summary, why closed if clear}

{Omit empty subsections.}

## Issue Activity

### Opened
- **[#N Title](url)** by @author — {one-line summary}

### Closed
- **[#N Title](url)** — {one-line summary}

{Omit empty subsections.}

## Repo Pulse
| Metric | Value |
|--------|-------|
| Stars | {total} |
| Views (14d) | {count} |
| Clones (14d) | {count} |
| Open issues | {count} |
| PRs opened | {count in timeframe} |
| PRs merged | {count in timeframe} |
| PRs closed | {count in timeframe} |

{If traffic data is unavailable (403), omit those rows and note "Traffic data requires push access."}
```

---

## Important rules

- Every item must include a `[title](url)` link so Caleb can click through.
- Include @author for attribution.
- Keep summaries to ONE line per item. This is a digest.
- The "Needs Your Attention" section is the most important. Be opinionated about what deserves Caleb's time.
- If a discussion or issue has heated sentiment, note it (e.g., "heated", "confused users", "strong demand").
- Omit empty sections entirely — don't show "No activity" headers.
- For PRs, mention if CI is failing when relevant.
- Don't editorialize beyond what's helpful for triage. Be practical, not chatty.
