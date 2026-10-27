# 0007 — Link participants, assessments, attempts, and evidence by stable IDs

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** The local TUG prototype model; production contracts and backend schema migration are not defined by this record.
- **Decision evidence / authority:** Project owner; approved the participant/assessment/attempt/evidence linkage in the TUG UI plan.

## Status

Accepted

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

The workflow must reopen the right participant's attempts without reconstructing links from scattered files or timestamps. An assessment can have repeated, interrupted, or unusable attempts; camera and pressure sources may succeed independently. A staff login is not a participant reference.

The existing backend Session model has one device reference and an optional staff user. Treating that model as an already integrated multi-source assessment would hide a migration gap.

Requirement drivers are FR-01 (participant/assessment/attempt linkage), FR-04 (linked camera and pressure evidence), and FR-06 (preserving accurate failure/completeness status). The local model demonstrates the links while production capture remains open.

## Decision

Give each participant, assessment, attempt, and evidence reference a stable identity. An assessment references its participant and the protocol version used. Each attempt belongs to that assessment and owns its source references, markers, observations, recording status, and usable/incomplete state.

Create a new attempt when repeating a recording. Preserve earlier attempts and available partial evidence. Retain IDs during save retries, and show missing-record states for unknown IDs instead of substituting a sample person or assessment. Keep recording duration separate from optional staff-entered clinical timing. This is the frontend model, not an implemented production API or Prisma migration.

## Consequences

- **Benefits:** several attempts and sources remain linked to the correct participant, including when a source fails or a save is retried.
- **Costs:** identity and completeness must be validated across nested records. A future server integration must map these identities explicitly.
- **Limits:** IDs alone do not prove source synchronization, capture acknowledgements, calibrated measurements, or tamper resistance. Unverified alignment remains explicit.
- **Revisit when:** real device contracts, approved protocol requirements, or BBS item requirements require changes to the record structure.

## Alternatives

- Match evidence only by timestamps: insufficient as the sole identity mechanism and vulnerable to ambiguity across attempts.
- Overwrite an assessment's previous attempt: loses failure/repeat evidence.
- Return a default sample for an unknown ID: can display another participant's record and is excluded from this workflow.

## Implementation and verification

### 2026-10-26 — Initial record

The workflow service and provider contain the identity, retry, recovery, and completeness rules. Existing Node tests cover participant separation, multiple attempts, unknown IDs, partial starts/disconnects, and persistence retry. Those tests do not validate linkage to real camera files, telemetry ranges, or backend records.

## Sources

- [Workflow store](../omni-front-end/src/services/workflowStore.js).
- [Workflow tests](../omni-front-end/Test/verify_workflow.test.mjs).
- [Assessment UI](../omni-front-end/src/pages/tugAssessment.jsx).
- [Existing backend schema](../omni-back-end/platform-service/prisma/schema.prisma).
- [ADR-0004](0004-separate-metadata-and-telemetry-storage.md), [ADR-0006](0006-isolate-the-ui-prototype.md), [ADR-0008](0008-preserve-approved-assessment-revisions.md).
- [Requirements traceability](../Docs/Fall_Risk_Software_Requirements_and_Plan.md#7-business-to-feature-traceability) (local planning reference; see index source-availability note).
