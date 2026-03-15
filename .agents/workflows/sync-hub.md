---
description: Run the automated audit and sync logic to keep the Governance Hub updated.
---

# Feature Sync & Layer Audit (Phased Interactive Approach)

This workflow performs a deep cross-layer audit (DB -> API -> Web) to identify synchronization gaps and brings the Governance Hub's trackers in line with the actual code state.

## Phase 1: Cross-Layer Feature Audit
1. **Requirement Extraction**: Read `feature-register.csv` and `task-tracker.csv`.
2. **Horizontal Scan**: Scan the following layers for each feature:
   - **Database**: Check migrations, schemas, or models.
   - **API (Backend)**: Check controllers, services, and endpoints.
   - **Web (Frontend)**: Check components, hooks, and pages.
3. **Synchronization Mapping**: Generate a "Sync Matrix":
   - Feature A: [DB: 100%] | [API: 50%] | [Web: 0%]
   - Feature B: [DB: 100%] | [API: 100%] | [Web: 100%]

## Phase 2: Gap Report & Proposal
4. **Display Report**: STOP. Show the user the Sync Matrix.
5. **Analyze Missing Logic**: For any feature not at 100% across all layers, identify the specific missing files or functions.
6. **Ask for Permission**: *"Phase 2 Complete: I have identified [X] synchronization gaps. Do you want me to automatically sync (implement) the missing logic across these layers?"*

## Phase 3: Autonomous Synchronization (Action)
7. **Sync Logic**: IF permission is granted, proceed to:
   - Generate missing DB migrations.
   - Scaffolding missing API endpoints/logic.
   - Creating missing Web components/UI.
8. **Update Trackers**: Once synced, update `feature-register.csv` and `progress-dashboard.md` to reflect the new 100% status.

// turbo
9. Run `/project-status` to refresh the maturity index.
