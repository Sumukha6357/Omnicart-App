---
description: Enforce standard naming conventions and environment variable configurations across the project.
---

# Structure & Env Enforcement Workflow (Phased Interactive Approach)

This workflow ensures the project complies with strict directory naming conventions (`api`, `web`, `mobile`) and environment variable propagation (`.env` and `.env.example` mirroring).

## Phase 1: Structure & Env Discovery
1. **Analyze Directories**: Scan the root directory.
   - Look for standard directories: `api` (backend), `web` (frontend), `mobile` (mobile app).
   - Identify violations: Directories named `backend`, `frontend`, `server`, `client`, or other non-standard names that contain project code.
2. **Analyze Environment Files**: Check for the presence of `.env` and `.env.example` in:
   - The project root directory.
   - The `api` directory (or identified backend equivalent).
   - The `web` or `mobile` directory (or identified frontend equivalent).
3. **Analyze Env Parity**: If files exist, compare keys between `.env` and `.env.example`.
   - **Literal Check**: Verify that all values are literal (e.g., `SSL_MODE=false`). If expansions like `${VAR}` are found in `.env`, flag as a **Protocol Violation**.
   - **Assembled URL Parity**: Ensure that `DATABASE_URL` accurately reflects the values in individual components (USER, PASS, HOST, etc.). If they drift, I MUST heal the string.
   - **Mandatory Keys**: Check for `PORT`, `API_PORT`, `WEB_PORT`, `DB_HOST`, and `SSL_MODE`.
4. **Report Findings**: 
   - If everything perfectly complies: State *"Phase 1 Complete: Project structure and environment files are 100% compliant."* **Workflow Ends here.**
   - If violations are found: State *"Phase 1 Complete: Compliance issues found."* List the exact folders that need renaming and the `.env` / `.env.example` files that need creating or synchronizing.
   - **MANDATORY STOP**: Ask the user: *"Phase 2: Should I proceed with restructuring the directories and generating the missing/unsynced environment files?"* **Do not proceed without explicit user approval.**

## Phase 2: Restructuring & Synchronization
5. **Wait for Approval**: Do not execute this phase until the user explicitly says "yes" or gives specific instructions based on the Phase 1 report.
6. **Rename Directories**: Rename non-compliant directories (e.g., `backend` -> `api`, `frontend` -> `web`) using file system operations, updating necessary import paths if required.
7. **Triple-Sync Environment Synchronization**:
   - **Root Master**: Ensure `root/.env` is the master source of truth.
   - **Triple-Mirror**: I MUST mirror the exact content of `root/.env` into both `api/.env` and `web/.env`.
   - **Hybrid Parity**: Ensure variables like `DB_HOST` are managed using the `${DB_HOST:-localhost}` syntax to support both Docker (passing `db`) and Local-Only (passing `localhost`) modes.
   - **Shadow Propagate**: If a key is updated in the root, I MUST immediately propagate the change to both child files.
   - **Idempotency**: If the files are already perfectly mirrored, skip.
8. **Final Report**: Confirm the 'Triple-Sync' is active and the project works seamlessly in both Docker and Native (Non-Docker) modes.
