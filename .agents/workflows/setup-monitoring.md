---
description: Setup enterprise-grade monitoring (Prometheus, Grafana, Loki) with Makefile integration.
---

# Enterprise Monitoring Setup Workflow (Phased Interactive Approach)

This workflow injects a complete Observability Stack (LPG: Loki, Prometheus, Grafana) into the current project, including "Golden Signal" dashboards and Makefile shortcuts.

## Phase 1: Code-Level Preparation
1. **Actuator Audit (Java)**: Check `pom.xml` for `spring-boot-starter-actuator` and `micrometer-registry-prometheus`.
   - If missing: Propose adding them.
   - Update `application.yml` to expose `/actuator/prometheus`.
2. **Prom Client Check (Node)**: Check `package.json` for `prom-client`.
   - If missing: Propose adding it.

## Phase 2: Infrastructure Injection (The Sidecar)
3. **Generate Configs**: Create a `monitoring/` directory in the project root containing:
   - `prometheus/prometheus.yml`: Configured to scrape the `api` service.
   - `grafana/provisioning/`: Standard datasources (Prometheus, Loki) and default dashboards.
   - `loki/loki-config.yml`: For log aggregation.
4. **Docker Overlay**: Create `docker-compose.monitoring.yml` defining:
   - `prometheus` service.
   - `grafana` service (pre-seeded with dashboards).
   - `loki` service.
   - `promtail` service (to ship logs from containers to Loki).

## Phase 3: Makefile Integration
5. **Add Makefile Targets**: Inject the following commands into the project's `Makefile`:
   - `monitor-up`: Start the monitoring stack.
   - `monitor-down`: Stop the monitoring stack.
   - `monitor-logs`: View logs for the monitoring containers.
   - `monitor-clean`: Wipe monitoring data volumes.

## Phase 4: Verification & Handover
6. **Report**:
   - Provide the URLs: Grafana (usually `http://localhost:3000`), Prometheus (`http://localhost:9090`).
   - Confirm: "Phase 4 Complete: Monitoring is now integrated. Run `make monitor-up` to start."
