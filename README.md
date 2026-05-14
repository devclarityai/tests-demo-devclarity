# tests-demo-devclarity

Playwright tests against the Demo DevClarity app.

## Setup

```bash
npm install
npx playwright install
```

## Run

```bash
npm run test:e2e
```

## MCP Servers

This workspace uses MCP (Model Context Protocol) servers for AI-assisted testing.

### VS Code configuration

VS Code reads MCP servers from `.vscode/mcp.json`. After editing, run **MCP: List Servers** from the Command Palette to verify and start them.

### Enable Jira (Atlassian) MCP

Add the `atlassian` entry to `.vscode/mcp.json`:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "atlassian": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.atlassian.com/v1/sse"]
    }
  }
}
```

Then:

1. Open the Command Palette and run **MCP: List Servers**.
2. Select `atlassian` and start it.
3. On first run, `mcp-remote` opens a browser window to authenticate with your Atlassian account. Approve the OAuth prompt.
4. Once connected, Jira and Confluence tools become available to the AI agent (search issues, read tickets, add comments, etc.).

Requirements:

- Node.js (for `npx`)
- Access to an Atlassian Cloud site
- Browser available for the one-time OAuth flow


