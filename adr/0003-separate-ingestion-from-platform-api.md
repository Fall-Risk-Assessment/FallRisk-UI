# 0003 — Separate telemetry ingestion from the platform API

- **Recorded:** 2026-10-26
- **Decision date:** Unknown; record authored 2026-10-26.
- **Scope:** Retrospective documentation and proposal to retain an observed backend boundary; no live TUG integration is asserted.
- **Decision evidence / authority:** Original deciders and approval are not recorded. Retention needs software-team confirmation.

## Status

Proposed

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

The source separates the platform API from telemetry ingestion. The platform exposes authentication/admin routes and relays MQTT messages through Socket.IO. The ingest service has MQTT/HTTP entry points, profile validation, and an InfluxDB writer. The serial bridge is a separate device-facing process.

In the MQTT ingest path, recording commands maintain an in-memory set of active device IDs. The platform's live relay subscribes independently; a relayed sample does not establish that it passed ingest validation or was persisted. The new staff UI currently consumes neither backend path.

## Decision

Propose retaining a separate ingest process for validating and writing telemetry and a platform process for user-facing APIs and live relay. Document their independent delivery/failure semantics and the serial bridge's device-facing role before connecting real TUG capture.

This record does not introduce another service, redesign the command protocol, or claim the existing boundary was formally approved. The rationale below is retrospective analysis, pending confirmation.

## Consequences

- **Potential benefits:** ingestion and platform changes can be reasoned about separately; telemetry processing does not have to live inside route handlers.
- **Costs:** multiple processes, broker configuration, and failure paths must be operated and checked together.
- **Current limitations:** the MQTT recording set is process-local, so restart recovery is not established. Live relay and persistence can disagree. Production readiness requires explicit acknowledgements, error handling, and reconciliation evidence.
- **Revisit when:** the capture contract, operational capacity, or measured load shows a different boundary is preferable.

## Alternatives

- Merge ingestion into the platform process: fewer processes, but couples user-facing requests and telemetry processing.
- Keep a separate ingest process: matches the observed structure, with coordination and recovery costs.

These alternatives are analyzed for this record; prior team evaluation is unknown.

## Implementation and verification

### 2026-10-26 — Initial record

Source inspection confirms separate processes, the MQTT recording gate, and the independent platform relay. This task does not run MQTT, database, restart-recovery, or end-to-end device checks. Confirmation of the boundary and tests of its failure semantics are prerequisites for marking this record Accepted.

## Sources

- [Platform entry point](../omni-back-end/platform-service/index.js).
- [Ingest entry point](../omni-back-end/ingest-service/index.js), [MQTT handling](../omni-back-end/ingest-service/mqttClient.js), [processing](../omni-back-end/ingest-service/ingestLogic.js).
- [Ingest documentation](../omni-back-end/ingest-service/README.md).
- [Serial bridge](../omni-back-end/serial-bridge/bridge.js).
- [ADR-0006](0006-isolate-the-ui-prototype.md).
