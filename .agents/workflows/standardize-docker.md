---
description: Optimize Docker Compose overlays and standardize the Makefile interface.
---

# Docker & Makefile Standardization Workflow (Phased Interactive Approach)

This workflow ensures that Docker Compose utilizes true "Diff-Only" overlays (DRY principle) and that the Makefile provides accurate, environment-specific commands for managing containers.

## Phase 1: Service Discovery & Interaction
1. **No Random searching**: I MUST read the **`infrastructure-map.md`** and **`features-and-services.md`** as the exclusive source of truth for the project's service structure.
2. **Identity Audit**: Based on the repository's metadata, I MUST identify all potential services (e.g., `api`, `web`, `db`, `redis`).
3. **Interactive Selection**:
   - **Initial Setup**: List all detected services and ask: *"I've detected the following services. Which ones do you want to dockerize? (e.g., skip 'db' if you manage it on a separate server)."*
   - **Existing Setup**: If Docker is already initialized, list the current services as **"Cached Services"** and ask: *"I see these services are already dockerized. Do you want to **add** a new service, **remove** an existing one, or just **patch-upgrade** the current ones?"*
4. **MANDATORY STOP**: Do NOT proceed to Phase 2 until the user provides the list of services for inclusion. 

## Phase 2: Infrastructure & Hardcoding Audit (Refined)
5. **Hardcoding & SSL Check**:
   - Scan only the **selected services** in `docker-compose.yml` and overlays.
   - **SSL Mandate**: Verify the presence of `SSL_MODE` in the root `.env`. Ensure the `DATABASE_URL` uses the `${SSL_MODE:-false}` variable.
   - **Protocol**: Replace all hardcoded values with `${VAR:-DEFAULT}` syntax in the selected service blocks.
6. **Dockerfile & Build Stability Audit**: 
   - **Dockerignore Check**: I MUST verify that a `.dockerignore` file exists in each selected service directory containing at least `node_modules`, `dist`, `.next`, and `.env`. This prevents host machine binaries from corrupting the container build.
   - **OS Dependency Check (Prisma)**: If the project uses Prisma/ORMs with Alpine Linux, I MUST verify that `openssl` is explicitly installed in BOTH builder and runner stages (e.g., `RUN apk add --no-cache openssl`).
   - **Build Verification**: Ensure the Dockerfile properly compiles code (e.g., `npm run build`) and copies the resulting `dist`/`.next` artifacts into the final stage. If the local `dist` folder was mapped into the container, it will cause "Cannot find module '/app/dist'" errors when `up` is run without `build`.
7. **Database Seeding Audit**: 
   - I MUST verify that the project has a database seeding mechanism (e.g., `prisma/seed.ts`).
   - **Clean Seed Protocol**: Seed data MUST include a Super Admin (`admin@gullygroup.in` with a default `password`) and exactly one default user per role to prevent cluster clutter.
   - **Docker Automation**: The `migrations` service in `docker-compose.yml` MUST automatically run the seed script immediately after migrations (e.g., `command: sh -c "npx prisma migrate deploy && npx prisma db seed"` or its equivalent).
8. **Report Findings**: 
   - State: *"Phase 2 Complete: Hardcoding, Caching, & Seeding audit finished for [Selected Services]."*
   - **Wait for Approval**: Ask the user: *"Phase 3: Should I execute the patch-upgrade and update the Makefile (decoupling 'build' from 'up')?"*

## Phase 3: Execution & Environment Ingestion
8. **Refactor Docker Infrastructure**: 
   - I MUST only modify/generate logic for the **user-approved services**.
   - I MUST ensure the project contains the complete 4-file set (Master, Dev, Prod, Local) using the master templates from `c:/Proj/ai-governance/_templates/infrastructure/`.
   - **Idempotency**: I will ONLY create or modify files that are missing or drift from the Global Standard.
9. **Triple-Sync Env Coordination**: 
   - I MUST trigger the **Triple-Sync Environment** protocol to ensure all variables from the selected services are mirrored in `root/.env`, `api/.env`, and `web/.env`.
   - **Automated String Assembly**: Re-assemble the `DATABASE_URL` in all literal `.env` files based on the latest components.
10. **Refactor Makefile**: 
    - Rewrite the Makefile to include environment-specific commands, explicitly **decoupling** `build` from `up`.
    - **Protocol**: `make dev-build` MUST use `build --no-cache`, and `make dev-up` MUST just use `up -d` (without `--build`).
    - Example mapping: `dev-build: $(DC) $(BASE) $(DEV) build --no-cache` and `dev-up: $(DC) $(BASE) $(DEV) up -d`.
11. **Final Report**: Run `make help` and confirm that all environment profiles (Dev/Prod/Local) for the selected services are active, explicitly noting the separated build/up flow.
