# MCP

## Current status

The deployed portfolio does not connect to an MCP server and does not expose tool access to visitors. Its functionality is fully client-side and static.

## Development boundary

MCP tools may be used by development assistants for repository inspection, browser verification, or deployment workflows, but that tooling is not part of the public website.

## Future integration rules

- Do not expose MCP credentials or tool endpoints in client bundles.
- Place privileged tool calls behind a server-side authorization boundary.
- Document the purpose, permissions, data flow, and failure behavior of every new integration.
- Add explicit user consent for any tool that acts on a visitor’s data or external account.
