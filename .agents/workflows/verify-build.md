---
description: Fully build and verify both Frontend (web) and Backend (api) to ensure zero build errors.
---

# Build & Verification Workflow (Phased Interactive Approach)

This workflow performs a deep build of both the `api` (Backend) and `web` (Frontend) modules to ensure the code is production-ready and free of compilation or build-time errors.

## Phase 1: Dependency & Environment Check
1. **Analyze Stack**: Identify the build tools for both modules (e.g., Maven/Gradle for `api`, NPM/Yarn for `web`).
2. **Environment Validation**: Ensure all required environment variables defined in `.env.example` are present in the local `.env` files for both modules.
3. **STOP**: Report any missing environment variables. Ask the user: *"Phase 1 Complete: Dependencies and environments are ready. Should I proceed with the full build of both API and Web?"* **Wait for user input.**

## Phase 2: Sequential Build Execution
4. **Build Backend (`api`)**:
   - Execute the standard build command (e.g., `./mvnw clean compile` or `npm run build`).
   - Parse the output for any compilation errors.
5. **Build Frontend (`web`)**:
   - Execute the standard build command (e.g., `npm run build`).
   - Monitor for TypeScript errors, linting failures, or bundling issues.
6. **Error Detection**: If any build fails, STOP. Report the exact error log and the module it occurred in.

## Phase 3: Final Verification & Reporting
7. **Cross-Service Check**: Verify that the build artifacts (e.g., `.jar`, `dist/`, `.next/`) were successfully generated.
8. **Final Report**:
   - Provide a clean summary:
     - **Backend**: ✅ Build Successful
     - **Frontend**: ✅ Build Successful
   - Confirm: "Verification Complete: The codebase is stable and ready for deployment or push."
