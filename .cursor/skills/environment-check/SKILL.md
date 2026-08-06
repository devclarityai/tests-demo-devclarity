---
name: environment-check
description: Verify and repair the local environment for Playwright-based QA training - node and npm, repo dependencies, browser binaries, playwright-cli, the Playwright MCP server, and .playwright.env - then prove it works with one smoke test. Covers macOS, Windows (PowerShell), and WSL.
disable-model-invocation: true
---

# Environment Check

Get one machine from "I cloned the repo" to "I can run a Playwright test and drive a real browser from my AI coding tool" in about ten minutes, and produce a short, honest list of anything still blocked.

This runs during Environment Setup Session 2, part two, with an instructor in the room. Speed matters, but a clear blocked list matters more than a forced pass. Anything you cannot fix in the room becomes a named follow-up before Foundational Training.

## Rules

1. **Verify everything first, then fix.** Run all seven checks and print the report before you change anything. The attendee needs the whole picture, not a surprise install.
2. **Ask before you install.** State the exact command, and say whether it changes the project or the whole machine. Wait for a yes. Global installs and anything needing `sudo` always get an explicit ask.
3. **One fix at a time.** Apply a fix, re-run only that check, report the result, move on.
4. **Never invent secrets.** `BASE_URL`, credentials, and API keys come from the attendee. Do not guess values, do not read them out, and never commit `.playwright.env`.
5. **Escalate instead of grinding.** Two failed attempts on the same check means stop. Mark it `BLOCKED`, and tell the attendee to post the check ID and the error text in the session chat.
6. **Stay in your lane.** This skill changes environment, dependencies, and tool config only. Do not edit tests, page objects, `playwright.config.ts`, or any application code.

## Step 0: Detect platform and tool

Record both before running checks. They change almost every fix command.

**Platform.** Run `uname -s`:

| Result | Platform |
|---|---|
| `Darwin` | macOS |
| `Linux`, and `/proc/version` contains `microsoft` | WSL |
| `Linux`, no `microsoft` | Linux |
| command not found | Windows (PowerShell) |

**AI coding tool.** Ask if it is not obvious from what is already in the repo. This determines where MCP config goes:

| Tool | MCP config path |
|---|---|
| Claude Code | `.mcp.json` (repo root) |
| Cursor | `.cursor/mcp.json` |
| GitHub Copilot / VS Code | `.vscode/mcp.json` |
| Codex | `~/.codex/config.toml` |

Confirm you are in the practice repo root before continuing: `package.json` and `playwright.config.ts` are both present.

## The seven checks

Run all of them. Do not stop at the first failure.

| ID | Check | Pass condition | Command |
|---|---|---|---|
| C1 | Runtime | node 20 or newer, npm resolves | `node --version && npm --version` |
| C2 | Repo dependencies | `@playwright/test` resolves locally | `npm ls @playwright/test --depth=0` |
| C3 | Browser binaries | exits 0 | `npx playwright install chromium` |
| C4 | playwright-cli | exits 0 | `playwright-cli --version` |
| C5 | Playwright MCP | config entry present and server starts | see below |
| C6 | Environment file | `.playwright.env` present, all keys filled, `BASE_URL` responds | see below |
| C7 | Smoke test | one test passes | `npx playwright test tests/auth/login.spec.ts --project=chromium --reporter=list` |

C3 is idempotent. If the browsers are already installed it returns in a second or two, so running it is also the check.

**C5, in two parts.** First, the config: read the path from Step 0 and confirm it contains a `playwright` server entry pointing at `@playwright/mcp`. Second, that the package actually starts: `npx @playwright/mcp@latest --version`. Config on disk is not the same as a connected server, and the tool only picks up new config on restart, so finish by asking the attendee to confirm from inside their tool (`/mcp` in Claude Code, MCP settings pane in Cursor, **MCP: List Servers** in VS Code).

**C6, in three parts.** `.playwright.env` exists in the repo root; `BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `API_READ_KEY`, and `API_WRITE_KEY` are all present and non-empty; and `BASE_URL` answers.

```bash
# macOS, Linux, WSL
curl -sS -o /dev/null -w "%{http_code}\n" "$BASE_URL"
```

```powershell
# Windows PowerShell
(Invoke-WebRequest -Uri $env:BASE_URL -UseBasicParsing).StatusCode
```

Any 2xx or 3xx is a pass. Report the key names only, never the values.

## Report

Print this table once, after all seven checks, before proposing anything:

```
Check                     Status    Detail
C1 Runtime                PASS      node v24.7.0, npm 11.6.0
C2 Repo dependencies      FAIL      node_modules missing
C3 Browser binaries       FAIL      chromium not installed
C4 playwright-cli         FAIL      command not found
C5 Playwright MCP         FAIL      no playwright entry in .mcp.json
C6 Environment file       FAIL      .playwright.env missing
C7 Smoke test             SKIPPED   blocked by C2, C6
```

Statuses: `PASS`, `FAIL`, `BLOCKED` (cannot be fixed on this machine, needs someone else), `SKIPPED` (a prerequisite check failed). Mark C7 `SKIPPED` rather than `FAIL` when C2, C3, or C6 failed. A failing smoke test only means something when its prerequisites passed.

Then list the proposed fixes in order, numbered, each with its command, and ask for a go-ahead.

## Fixes

### F1: Runtime (C1)

Do not install a node version manager unattended. Tell the attendee which one fits their platform and let them run it:

- macOS, Linux, WSL: `nvm` or `fnm`, then `nvm install 24 && nvm use 24`
- Windows: `winget install OpenJS.NodeJS.LTS`, or `nvm-windows`

Node older than 20 fails everything downstream, so fix this first and re-run all checks afterward.

### F2: Repo dependencies (C2)

```bash
npm ci        # preferred, package-lock.json is committed
npm install   # fall back to this if npm ci errors
```

Project-scoped, so no permission concerns. On a cold clone this is the slowest step in the session, usually one to three minutes.

### F3: Browser binaries (C3)

```bash
npx playwright install chromium
```

On WSL and Linux the browser also needs system libraries:

```bash
npx playwright install-deps chromium   # uses sudo, ask first
```

Chromium alone is enough for training. Do not install all three browser engines in the room; it triples the download for no benefit today.

### F4: playwright-cli (C4)

```bash
npm install -g @playwright/cli
```

This one is global, so ask first, and it is the single most common place a corporate laptop says no.

- **`EACCES` on macOS or Linux:** do not reach for `sudo`. Point npm at a user-owned prefix instead: `npm config set prefix ~/.npm-global`, add `~/.npm-global/bin` to `PATH` in the shell profile, open a new shell, retry.
- **Installs but `command not found` on Windows:** the npm global bin directory is not on `PATH` yet. `npm config get prefix` shows where it landed. A fresh PowerShell window usually resolves it.
- **WSL:** confirm you are using the Linux node, not a Windows install reached across `/mnt/c`. `which node` should not return a `/mnt/c/...` path.
- **Blocked by policy:** mark C4 `BLOCKED` and move on. The Playwright MCP server (C5) covers most of what training needs, so a blocked C4 is not a reason to stall the room.

### F5: Playwright MCP (C5)

Write the config for the tool identified in Step 0. For Claude Code, `.mcp.json` in the repo root:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Cursor uses the same shape at `.cursor/mcp.json`. VS Code and Copilot use a `servers` key instead of `mcpServers`, at `.vscode/mcp.json`:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

If a config file already exists, merge the `playwright` entry into it. Do not overwrite other servers the attendee already has. Then have them restart the tool and confirm the server shows as connected.

### F6: Environment file (C6)

```bash
cp .playwright.env.example .playwright.env
```

```powershell
Copy-Item .playwright.env.example .playwright.env
```

Then ask the attendee to paste the values from the session chat. Confirm `.playwright.env` is matched by `.gitignore` before moving on: `git check-ignore -v .playwright.env` should print a matching rule. If it does not, stop and say so, because the next commit would leak credentials.

### F7: Smoke test (C7)

Triage in this order:

1. **`BASE_URL` unreachable.** Training environments are review apps and sleep when idle, so the first request can be slow. Open `BASE_URL` in a browser, wait for it to wake, retry once.
2. **Login assertion fails.** Credentials are wrong or belong to a different environment. Re-check against what was posted in chat. Each attendee may have a different assigned build.
3. **Browser launch error.** Back to C3, and on WSL to `install-deps`.
4. **Stale session state.** `playwright.config.ts` reuses `storageState` from `.auth/user.json`. Delete the `.auth/` directory and re-run so the setup project regenerates it.

Anything beyond that is out of scope for the session. Mark it `BLOCKED` with the error text and move on.

## What done looks like

All seven checks `PASS`, or a short list of named blocked checks with error text captured. The second outcome is a success too: it turns a laptop problem into a tracked follow-up instead of a surprise at the start of Foundational Training.

## Final output

After the last re-run, print exactly one summary line:

```
Environment check: 7/7 passing. Blocked: none.
```

Or, when something is genuinely stuck:

```
Environment check: 5/7 passing. Blocked: C4 (global npm install denied by policy), C5 (MCP server unreachable behind proxy).
```

See `references/os-notes.md` for the longer tail of platform-specific failures: proxies and custom registries, Windows PATH and execution policy, WSL filesystem boundaries, and corporate certificate interception.
