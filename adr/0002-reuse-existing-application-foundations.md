# 0002 — Reuse the existing application foundations

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** Development direction for the current TUG work; not retrospective approval of every backend implementation detail.
- **Decision evidence / authority:** Project owner; approved software/UI plan to reuse the existing foundations.

## Status

Accepted

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

The repository already contains a React/Vite frontend, an Express platform API with Prisma/PostgreSQL models, telemetry ingestion using InfluxDB, and a serial-to-MQTT bridge. The immediate need is a coherent participant recording and review journey. Replacing the stack would add migration and verification work without resolving the open clinical workflow and capture-interface questions.

The historical reasons and original approval dates for choosing these technologies are not recorded here. This ADR records the current reuse direction.

## Decision

Continue developing the frontend with React and Vite and reuse the Express platform and existing data foundations where they satisfy the agreed requirements. Prefer existing components, libraries, and service responsibilities over a new framework or service introduced solely for the TUG prototype.

The currently routed TUG prototype uses browser-local data; retaining the backend foundation does not mean this UI is integrated with it. Service boundaries and data-store responsibilities are examined separately in ADR-0003 and ADR-0004.

## Consequences

- **Benefits:** preserves existing implementation and avoids a speculative rewrite while the team validates the workflow.
- **Costs:** existing integration gaps and technical limitations still need explicit work; reuse does not mean keeping unsuitable code indefinitely.
- **Limits:** no performance, scale, security, or hospital-readiness claim follows from choosing to reuse the stack.
- **Revisit when:** a measured requirement or verified limitation makes a foundation unsuitable; document the replacement and migration in a new ADR.

## Alternatives

- Rewrite the frontend and backend before validating the TUG journey: increases scope and requires evidence of a benefit that is not currently available.
- Add a general platform framework or new microservice for the prototype: not required by the approved development direction.

These are present-day comparisons, not claims about alternatives evaluated by the original technology selectors.

## Implementation and verification

### 2026-10-26 — Initial record

Package manifests and source show the foundations exist. The prototype guide records prior frontend checks and their limitations. Backend/hardware integration and the software plan's M1 gate remain unverified by this ADR. No dependency, runtime, or schema change is made here.

## Sources

- [Frontend manifest](../omni-front-end/package.json).
- [Platform manifest](../omni-back-end/platform-service/package.json).
- [Prototype implementation and verification](../omni-front-end/TUG_PROTOTYPE.md).
- [Software requirements plan, section 13](../Docs/Fall_Risk_Software_Requirements_and_Plan.md#13-existing-project-reuse-gaps-and-cautions) (local planning reference; see index source-availability note).
- [ADR-0003](0003-separate-ingestion-from-platform-api.md), [ADR-0004](0004-separate-metadata-and-telemetry-storage.md).
