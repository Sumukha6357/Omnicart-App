---
description: Scan project for potential feature enhancements, tech stack upgrades, and industry-relevant services.
---

# Project Enhancement Roadmap (Phased Interactive Approach)

This workflow scans the current project to identify gaps and propose a roadmap for future features, performance optimizations, and security enhancements.

## Phase 1: Deep Scan & Delta Analysis
1. **Analyze Current State**: Scan `api/`, `web/`, and `features-and-services.md` to map out implemented logic.
2. **Industry Alignment**: Compare the current feature set against industry standards for the project's domain (Logistics, E-commerce, etc.).
3. **Identify "Low Hanging Fruit"**: Find areas where basic improvements (e.g., adding caching, improving error handling, or adding missing standard endpoints) would have high impact.

## Phase 2: Technical Debt & Modernization Audit
4. **Stack Review**: Check for outdated dependencies, non-standard naming, or missing enterprise patterns (e.g., lack of Rate Limiting, Missing Logging in specific modules).
5. **Architectural Gaps**: Identify if the project would benefit from new infrastructure (e.g., adding Redis for performance, Loki for better log search, or a Message Queue for async tasks).

## Phase 3: The Enhancement Report (Reporting Only)
6. **Roadmap Presentation**: Provide a categorized list of recommendations:
    - **🚀 Feature Enhancements**: New user-facing functionalities based on industry standards.
    - **⚡ Performance Upgrades**: Caching, indexing, and bundle optimization.
    - **🛡️ Security & Hardening**: Rate limiting, security headers, and dependency patches.
    - **🏗️ Infrastructure Sidecars**: New services (Redis, Loki, etc.) that would add value.
7. **STOP**: This workflow is **READ-ONLY**. I will not modify any files. 
8. **Final Confirmation**: Ask the user: *"Which of these enhancements would you like me to create a Task Tracker entry for? (Implementation requires separate manual instructions)."*
