---
description: Module-wise logic audit to suggest granular functional enhancements (Auth, Validation, File Handling, etc).
---

# Deep Logic Audit & Functional Enhancements (Phased Interactive Approach)

This workflow performs a microscopic scan of the project's codebase (Controllers, Services, Models) to identify missing functional patterns and suggest logic-level upgrades.

## Phase 1: Modular Logic Scan
1. **Controller Audit**: Scan for missing standard patterns:
   - Request Validation (DTOs, JSR-303, Zod, etc).
   - Global Error Handling / Exception Trapping.
   - Rate Limiting or Idempotency keys.
2. **Service Layer Audit**: Scan for:
   - Business Logic isolation (Leaky abstractions).
   - Caching opportunities (Redis/Memcached).
   - Logging and Tracing (Audit trails for sensitive data).
3. **Model & Auth Audit**:
   - Relationship optimizations.
   - Security (JWT, Forgot Password flows, MFA possibilities).
   - File/Media handling logic (Photo uploads, storage abstraction).

## Phase 2: Module-Wise Gap Report
4. **Logic Scorecard**: Present a report categorized by code module:
   - **`user-module`**: Missing "Forgot Password" flow and "Profile Photo" storage logic.
   - **`logistics-engine`**: Missing "Idempotent Transaction" checks.
   - **`api-gateway`**: Missing "JWT Refresh Token" rotation.
5. **Logic Improvements List**: Propose specific code implementations (Form validation, Password hashing upgrades, etc).

## Phase 3: Selection & Implementation Gate
6. **STOP**: This workflow is **READ-ONLY** by default.
7. **Requirement Sync**: Ask the user: *"Which logic enhancements should I add to the 'task-tracker.csv' for implementation?"*
8. **Action**: Only upon explicit "GO" for a specific item will I generate the code using the standard autonomous development protocol.

// turbo
9. Run `/sync-hub` to ensure the new logic is tracked across all layers.
