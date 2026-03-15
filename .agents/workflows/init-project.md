---
description: Initialize a new project with the Global AI Governance Hub.
---

# Initialize Project Governance (Phased Interactive Approach)

Follow these phases to safely onboard a new project into the governance system.

## Phase 1: Orchestration Setup (Fast-Tracked if Existing)
1.  **Detect Project**: Determine the project name and category (Work/Personal) from the current directory path.
2.  **Check Hub**: IF `c:/Proj/ai-governance/projects/[CATEGORY]/[PROJECT_NAME]` exists, skip template copying. (Preserve existing metadata).
3.  **Setup Structure**: If new, create directory and copy `c:/Proj/ai-governance/_templates/`.

## Phase 2: Tech Stack (New Clone vs. New Start)
4.  **Auto-Scan**: Check for `pom.xml`, `package.json`, `docker-compose.yml`, and `.env.example`.
5.  **Evaluate & Discover**:
    - **SCENARIO A: HUB EXISTS**: Report: *"Phase 2: Project metadata already synced. Bypassing discovery."*
    - **SCENARIO B: HUB NEW + CLONED CODE (Files Found)**: 
        1. **Discovery**: Automatically parse the discovered files to populate `tech-stack-profiles.md`, `infrastructure-map.md`, and `features-and-services.md`.
        2. **Report**: *"Phase 2: Newly cloned project detected. Governance metadata has been auto-generated from the source code."*
        3. **Reminder**: Prompt the user to run `/enforce-structure` later to fix `.env` files (which are usually missing from Git).
    - **SCENARIO C: HUB NEW + EMPTY FOLDER (New Start)**: 
        1. **Ask**: STOP. Ask user: *"Phase 2: This is a fresh project. What backend and database types should I provision?"*
        2. **Wait**: Do not proceed until stack is defined.

## Phase 3: Governance Locking (The Re-Ask Gate)
6.  **Ask for Lock Level**: STOP. **Always ask this during re-initialization.**
    > AI: *"Phase 3: Set or Update Security Lock Level? [0 (Exp), 1 (Dev), 2 (Prod)]."* 
    > (You can change this to 'Enterprise-ify' or 'Lockdown' the project at any time.)
7.  **Secure**: Update individual project's `mode.rules`.

## Phase 4: Skill Provisioning (The Upgrade Gate)
8.  **Ask for Profile**: **ALWAYS ask this during (re)initialization.**
    > AI: *"Phase 4: Select Complexity Profile [🏢 Enterprise, 📦 Minimal, 🛑 Production, 🧩 Custom]."*
    - **🏢 Enterprise**: Automatically enable ✅ ALL available global skills in `permissions.md`.
    - **📦 Minimal**: Only enable essential skills (`/check-in`, `/push`, `/structure`, `/lint`).
    - **🧩 Custom (Interactive Selection)**: 
        1. **Show List**: I MUST immediately fetch and display the master list from `c:/Proj/ai-governance/global-workflows/list-page.md`.
        2. **User Picks**: Wait for the user to list specific commands or categories.
        3. **Provision**: Enable ONLY those checked skills in the project's `permissions.md`.
    - **🛑 Production**: Warn the user of limited automation and disable all advanced skills by default.
9.  **Persist & Upgrade**:
    - If this is a re-initialization, allow the user to **Add New Skills** while keeping current ones or reset to a new profile entirely.
    - Update the project specific `permissions.md` checkboxes (✅/❌).
10. **Inject Symlinks**: Force-refresh the `.agents/workflows` junction point to ensure all global skills are physically available in the project's local environment.
11. **Final Summary**: List the final count of authorized skills and confirm that the project is now ready for autonomous work.

// turbo
10. Run the initial`/check-in`.
