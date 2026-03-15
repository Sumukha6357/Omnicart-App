---
description: A 3-phase interactive workflow for safely committing and pushing code to remote repositories.
---

# Secure Git Push Tracker (Phased Interactive Approach)

This workflow strictly controls how code is staged, tracked, and pushed to external repositories (GitHub, Bitbucket, etc.) to ensure no sensitive files or compiled binaries are leaked, and the correct SSH alias is used.

**Note to Agent:** This should NEVER be run automatically at the end of a feature. The user must explicitly ask to "push" or trigger `/secure-push`.

## Phase 1: Security & Tracking Audit
1. **Scan the Project**: Locate the `.gitignore` and `.dockerignore` files (create them if they don't exist).
2. **Audit Tracking**: 
   - Ensure `.env`, node_modules, `dist/`, `target/`, `.idea/`, and `.vscode/` are strictly ignored.
   - Verify no large static binaries or sensitive keys are currently staged.
3. **Report & Wait**: List out the files that will be staged/tracked. Say: *"Phase 1 Complete: Ignore files updated. Here is what I am about to commit: [List]. Is this correct?"* **Wait for user confirmation.**

## Phase 2: Remote Sync & SSH Routing
4. **Select Alias**: STOP and ask the user: *"Phase 2: Which SSH alias from your `~/.ssh/config` should I use for this push? (e.g., 'work', 'personal', 'github', 'bitbucket')"*.
5. **Conditional Remote Sync**: Once the alias is provided, I MUST verify the remote state:
   - Run `git fetch [remote]` using the confirmed alias.
   - **Check for Gaps**: Check if the local branch is behind the remote (e.g., `git status -uno` or checking rev-list).
   - **IF NEW COMMITS EXIST**: Execute `git pull [remote] [branch]`. If a merge conflict occurs, STOP and report.
   - **IF IN SYNC**: Skip the pull step and report: *"Phase 2: Remote is already in sync. No pull required."*
6. **Configure Multi-User Git**: Ensure the remote URL is correctly mapped to the chosen alias (e.g., `git remote set-url origin git@[alias]:user/repo.git`).
7. **Report**: Confirm synchronization status and readiness for the push.

## Phase 3: Execution & Final Report
7. **Commit & Push**: 
   - Execute `git add .`
   - Prompt the user for a commit message OR auto-generate one based on recent file changes.
   - Execute `git push` using the confirmed alias destination.
8. **Final Report**: Generate a clean summary showing:
   - The Commit Hash.
   - The exact files pushed.
   - The Repository Destination and Alias used.
   - Confirm "Push Successful."
