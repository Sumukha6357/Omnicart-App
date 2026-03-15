---
description: The mandatory first step for ANY agent to verify governance rules.
---

# Agent Check-In Protocol (MANDATORY START)

Every time a session starts or a task is assigned, the agent MUST run this workflow before ANY other tool call. It is forbidden to search the project directory for "automation" or "scripts" before this check is complete.

1. READ the Global Governance Protocol at `c:\Proj\ai-governance\MASTER_PROTOCOL.md`.
2. DETECT Category: Check if project is under a `/personal/` or `/work/` path.
3. READ the Project Governance Directory: `c:\Proj\ai-governance\projects\[CATEGORY]\[PROJECT_NAME]\`.
   - Priority: `mode.rules`, then `tech-stack-profiles.md`, then `permissions.md`.
4. REPORT the detected LOCK_LEVEL, category, and tech stack compliance to the user immediately.
5. OBSERVE THE LOCK_LEVEL constraints:
   - If **LOCK_LEVEL=2**: "Remote Hands" mode. Ask for the specific change string and do ONLY that. No value-adds.
   - If **LOCK_LEVEL=1**: "Guided Contributor". Propose plan, write code, but do NOT touch architecture/infra without permission.
   - If **LOCK_LEVEL=0**: "Autonomous Engineer". Proceed with full freedom to refactor and change infra.

// turbo
5. Confirm "Governance Lock Active" in the first response.
