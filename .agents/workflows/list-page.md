---
description: List all available Global AI Governance workflows and their purpose.
---

# 📖 AI Governance Hub: Skills & Workflows Index

This page serves as a master reference for all specialized automation tools (slash commands) and background autonomous processes.

### 🎮 Interactive Skills (Slash Commands)
| Command | Name | Description | Automation Level |
| :--- | :--- | :--- | :--- |
| **`/check-in`** | **Security Check-In** | **MANDATORY.** Validates permissions. | 🟢 User-Triggered |
| **`/init-project`** | **Onboarding** | Scans tech and sets lock levels. | 🟢 User-Triggered (3-Phase) |
| **`/project-status`** | **Maturity Audit** | Scorecard for Enterprise Grade & Industry Benchmarking. | 🟢 User-Triggered (3-Phase) |
| **`/project-enhancements`** | **Roadmap Suggestions**| Proposes new features and tech upgrades based on scan. | 🟡 Read-Only Report |
| **`/logic-enhancements`** | **Logic Audit** | Module-wise audit for Auth, Validation, and File Logic. | 🟡 Read-Only Report |
| **`/secure-push`** | **Secure Push** | Git audit + Remote Sync (Pull) + SSH alias selection. | 🛑 User-Triggered (3-Phase) |
| **`/enforce-structure`**| **Restructuring** | Normalizes folders and `.env` files. | 🟡 Hybrid (Audit + Approve) |
| **`/standardize-docker`**| **Docker Sync** | DRY Overlays & Makefile updates. | 🟡 Hybrid (Audit + Approve) |
| **`/standardize-docs`** | **Doc Gen** | Manual deep update of all project docs. | 🟡 Hybrid (Audit + Approve) |
| **`/setup-monitoring`** | **Observability** | Injects Prometheus/Grafana stack. | 🟢 User-Triggered |
| **`/setup-cicd`** | **Pipeline Gen** | Generates GitHub/Bitbucket pipelines. | 🛑 User-Triggered (3-Phase) |
| **`/verify-build`** | **Build Verify** | Sequential API/Web compilation check. | 🟢 User-Triggered |
| **`/generate-tests`** | **Test Gen** | Strategy selection and suite setup. | 🟢 User-Triggered |
| **`/premium-ux-audit`** | **UI/UX Audit** | Wireframe analysis and tiered design system injection. | 🟡 Read-Only Report |
| **`/sync-hub`** | **Layer Sync Audit** | Cross-layer audit (DB/API/Web) & auto-sync implementation. | 🟡 Hybrid (Audit + Action) |
| **`/lint-and-heal`** | **Self-Healing**| Iterative code repair/linting loop. | 🟢 User-Triggered |

---

### 🤖 Autonomous background Processes (Implicit Sync)
These processes run **automatically** without any command, as defined in the `MASTER_PROTOCOL.md`.

| Task | Trigger | Purpose |
| :--- | :--- | :--- |
| **Testing & Bug Sync** | Any File Edit | Auto-runs active tests, logs logic bugs to `bug-log.csv`. |
| **Documentation Sync** | Feature Finish | Auto-updates `swagger.yaml` and architecture docs. |
| **Instruction Logging** | Chat Activity | Appends user steps to `chat_walkthroughs.md`. |
| **Profile Audit** | Every Tool Call | Verifies if an action violates the project's tech profile. |
| **Requirement Sync**| Every Requirement| Auto-logs features to CSV and tracks progress on dashboard. |
| **Session Continuity**| Every Session | Auto-reads trackers after check-in to resume work. |

---

### 🏛️ Automation Philosophy: What is Synced?
- **WHAT IS AUTOMATED**: Repetitive verification (tests), repetitive manual documentation (Architecture/API sync), and metadata tracking (logs). These are "Safe Actions" that increase visibility without breaking production.
- **WHAT IS FORBIDDEN FROM AUTOMATION**: Code pushes, remote infrastructure changes, and production file edits (in Level 2). These are "High-Risk Actions" that strictly require a **Human-in-the-Loop** to prevent data loss or service interruption.

*To force an update of any autonomous task manually, you can run their matching slash command (e.g., `/standardize-docs`).*
