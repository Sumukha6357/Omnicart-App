---
description: Automated Enterprise-Grade Documentation Generation and Maintenance
---

# Enterprise Documentation Standardization Workflow

This workflow automatically creates or updates the central documentation for a project based on the physical state of the codebase, ensuring new features and endpoints are never undocumented.

## Phase 1: Context & Structure Audit
1. **Analyze Project Base**: Scan the root directory for an existing `docs/` folder.
2. **Missing Structure Check**: If the `docs/` folder (or `docs/api`, `docs/architecture`, `docs/runbooks`) does not exist, silently plan to create it.
3. **Analyze Code State**: 
   - Parse the backend (`api`) for newly added controllers, models, or DTOs to identify new endpoints.
   - Parse the frontend (`web`) or docker files for new infrastructure connections.

## Phase 2: Generation & Merging (Autonomous)
4. **Master README (`/README.md`)**:
   - Ensure the root README acts purely as a dashboard with a Quick Start guide and relative links to the `docs/` folder. Do not clutter it with endpoint data.
5. **Architectural Update (`docs/architecture/system-context.md`)**:
   - Auto-generate or append changes related to newly discovered databases, microservices, or folder structures.
6. **API Contract Update (`docs/api/endpoints.md` or `swagger.yaml`)**:
   - For every new or changed controller/route discovered in Phase 1, automatically write out the JSON payload expectations, method types (GET/POST), and authentication requirements.
7. **Runbook Sync (`docs/runbooks/environment-variables.md`)**:
   - Parse the `.env.example` file and instantly document what each environment variable does.

## Phase 3: Reporting
8. **Summary**: Provide a clean report in the chat stating which specific files were created or modified during the auto-documentation run (e.g., *"Created `endpoints.md` in `docs/`"* or *"Updated Swagger file with 2 new routes"*).
