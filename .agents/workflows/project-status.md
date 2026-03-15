---
description: Comprehensive scorecard showing Enterprise Maturity and Industry Feature Benchmarking.
---

# Project Analytics & Maturity Scorecard (Phased Interactive Approach)

This workflow provides a deep-dive audit of the project's health, enterprise DNA, and its competitive standing relative to industry standards and local projects.

## Phase 1: Deep Artifact & Profile Scan
1. **Pillar Audit**: Execute a multi-directory scan to verify:
   - **Infrastructure (0-100%)**: Multi-stage Docker files, centralized `Makefile`, persistent volumes.
   - **Reliability (0-100%)**: Test coverage presence, active test categories (Unit/Integration).
   - **Observability (0-100%)**: Prometheus/Loki/Grafana sidecars and configurations.
   - **Security (0-100%)**: Lock level adherence, SSH alias config, `.env` consistency.
   - **Docs (0-100%)**: Swagger/OpenAPI health, change-log activity.
2. **Current Completion**: Calculate task/feature progress from `task-tracker.csv` and `feature-register.csv`.

## Phase 2: Industry & Local Benchmarking
3. **Industry Feature Benchmark**:
   - Identify the project domain (e.g., E-commerce, Logistics, FinTech).
   - Compare the current `feature-register.csv` against an "Industry-Standard Feature List" for that domain.
   - Report the Gap: (e.g., "Industry Standard: 30 Features | Current: 20 Features | Maturity: 66%").
4. **Local Leaderboard**: Compare the primary maturity score against the average score of other projects in `c:/Proj/personal/` and `c:/Proj/work/`.

## Phase 3: Executive Scorecard Generation
5. **Scorecard Presentation**: Provide a visual, categorized report including:
   - **The Enterprise Maturity Index**: Weighted average of all 6 Pillars.
   - **Feature Completeness**: Count vs Industry Standard.
   - **Release Readiness**: "Ready for Production" (Yes/No).
   - **Competitive Standing**: "Better than 80% of local projects."
6. **Dashboard Sync**: Automatically update `progress-dashboard.md` with these newly calculated KPIs.

// turbo
7. Display the scorecard in the chat.
