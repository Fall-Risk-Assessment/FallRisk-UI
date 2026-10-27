# 0004 — Separate relational metadata from time-series telemetry storage

- **Recorded:** 2026-10-26
- **Decision date:** Unknown; record authored 2026-10-26.
- **Scope:** Retrospective backend storage boundary; the prototype local store is covered by ADR-0006.
- **Decision evidence / authority:** Original deciders and approval are not recorded. Retention needs software-team confirmation.

## Status

Proposed

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

The platform Prisma schema targets PostgreSQL for staff accounts, roles, devices, profiles, sessions, and related metadata. Ingest code writes telemetry to InfluxDB; platform code queries telemetry using a device ID and time range.

The current backend Session references one device and an optional staff user. It does not implement the prototype's participant/assessment/attempt model. Existing time-range queries must not be described as an established multi-source evidence-linking contract.

## Decision

Propose retaining PostgreSQL for relational application metadata and InfluxDB for sensor time-series data while their suitability is verified against the agreed capture workflow. Keep identity linkage and availability explicit when data spans stores.

This is a proposal to retain an observed storage split. It does not select video/object storage, define a production schema migration, or assert atomic consistency between stores. The original selection rationale is unknown.

## Consequences

- **Potential benefits:** metadata relationships and time-indexed sensor queries can use their existing storage paths without an immediate migration.
- **Costs:** backup, retention, access, recovery, and reconciliation must cover more than one store.
- **Current limitations:** source shows write and query code, not proof that metadata and all required evidence are durably available together. A successful live display or ingestion log must not be equated with a complete saved assessment.
- **Revisit when:** real capture volume, query needs, operational capacity, or retention requirements support a different storage approach.

## Alternatives

- Use PostgreSQL for metadata and telemetry: simplifies store coordination but needs workload and query evaluation.
- Retain the existing two-store approach: reuses current paths but requires consistency and recovery work.
- Use local browser storage: suitable only for the isolated synthetic prototype, not a replacement for shared clinical records.

These are retrospective comparisons; no historical benchmark or team selection process is claimed.

## Implementation and verification

### 2026-10-26 — Initial record

Prisma, writer, and query source confirm the observed split. No database migration, persistence test, restore exercise, workload benchmark, or cross-store consistency check is performed by this documentation task. Team confirmation and integration evidence are still required before acceptance.

## Sources

- [Prisma schema](../omni-back-end/platform-service/prisma/schema.prisma).
- [InfluxDB writer](../omni-back-end/ingest-service/influxWriter.js).
- [Platform telemetry queries](../omni-back-end/platform-service/services/influxService.js).
- [Session controller](../omni-back-end/platform-service/controllers/sessionController.js).
- [ADR-0007](0007-link-assessments-attempts-and-evidence-by-id.md).
