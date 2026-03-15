---
description: Interactive CI/CD Pipeline Generation (GitHub Actions, Bitbucket Pipelines)
---

# CI/CD Pipeline Setup Workflow (Phased Interactive Approach)

This workflow sets up automated build, test, and (optional) deploy pipelines for the project. Pipelines are never generated without double confirmation and platform selection.

## Phase 1: Commitment Confirmation
1. **The Question**: STOP. Ask the user in the chat: *"Phase 1: Are you sure you want to initialize a CI/CD pipeline for this project? (Pipelines add complexity to builds and require remote configuration)."*
2. **Wait**: Do nothing until the user says "Yes" or "Proceed".

## Phase 2: Platform Selection
3. **The Question**: STOP. Ask the user in the chat: *"Phase 2: Which CI/CD platform would you like to use? (e.g., GitHub Actions, Bitbucket Pipelines, GitLab CI)"*.
4. **Wait**: Do nothing until the user provides the platform name.

## Phase 3: Infrastructure Discovery & Generation
5. **Scan Stack**: Analyze `tech-stack-profiles.md` and the `api/web` directories to identify the build tools (Maven, NPM, Gradle, etc.) and Docker requirements.
6. **Generate Pipeline**:
   - **GitHub**: Create `.github/workflows/main.yml` with Build, Test, and Docker-Build jobs.
   - **Bitbucket**: Create `bitbucket-pipelines.yml` with appropriate steps.
   - **Common Logic**: Ensure the pipeline utilizes your standard `make` commands (e.g., `make build`, `make test`) to maintain parity between local and remote environments.
7. **Report**:
   - Detail the file(s) created.
   - List the secrets/variables the user needs to configure in their Repo settings (e.g., `DOCKER_HUB_TOKEN`, `SSH_KEY`).
   - Confirm: "Phase 3 Complete: CI/CD Pipeline is ready for its first run."
