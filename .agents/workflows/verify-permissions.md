---
description: Enforce the local AI-Skills security protocol before any code modification.
---

# Verify Permissions Workflow

Before modifying any file in this workspace, follow these steps:

1. READ the master permissions file at `c:\Proj\personal\ai-skills\permissions.md`.
2. CHECK the target file path against the "Path Mapping" table.
3. IDENTIFY the profile:
    - If **🟢 AUTO**: Proceed with the edit but document the rationale.
    - If **🟡 MANUAL**: STOP. Search `c:\Proj\personal\ai-skills\manual_instructions/` for a relevant guide. If none exists, ask the user for a manual walkthrough.
    - If **🔴 PROTECTED**: DO NOT EDIT. Explain the restriction to the user.
4. SCAN the target file content for the keyword `// AGENT: STOP`. If found, treat as **🔴 PROTECTED**.

// turbo
5. Log the permission check status for the current task in the chat.
