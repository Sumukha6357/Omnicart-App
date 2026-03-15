---
description: Automated Documentation Synchronization
---

# Automated Documentation Synchronization

1. Scan the codebase for changes in Data Models, API Endpoints, Database Schema, or GraphQL definitions.
2. Based on the project's `blueprint.rules` and tech stack (e.g., Swagger, OpenAPI, Postman, Prisma, TypeORM), locate the corresponding documentation files.
3. Automatically update the Swagger/OpenAPI JSON/YAML files with new routes, parameters, and response types extracted from the code layout.
4. Auto-generate or update database mapping files and schema documentation.
5. Update Postman collections (if applicable to the project) with updated endpoints and request parameters.
6. Verify no outdated payload examples or stale models remain.
7. Record the documentation artifacts that were synchronized in the `c:/Proj/ai-governance/projects/[CATEGORY]/[PROJECT_NAME]/change-log.md`.
