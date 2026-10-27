# 0008 — Preserve approved assessment revisions when creating amendments

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** The local prototype review workflow; production audit and reviewer authorization remain unverified.
- **Decision evidence / authority:** Project owner; approved correction history, approval snapshots, and amendments in the TUG UI plan.

## Status

Accepted

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

A reviewer needs to know which observations and evidence were approved. Changing an approved record in place would obscure the reviewed result. Recording completion, evidence completeness, a successful local save, and a clinical review decision describe different facts.

The prototype needs to demonstrate operator/reviewer handoffs without implying that browser-controlled demo identities establish clinical accountability or server authorization.

Requirement drivers are FR-08 (clinical approval and correction history) and NFR-02 (record integrity across retries and corrections). The prototype demonstrates revision behavior while production authorization and audit integrity remain open.

## Decision

Keep draft, awaiting-review, correction-requested, and approved review states separate from capture, evidence, and local-save states. Submit only when the demo checklist and at least one usable attempt with both sources are complete. Preserve unsuccessful attempts alongside the usable record.

Lock submitted revisions for operator editing until corrections are requested. Record reviewer observations, correction reasons, identity, and time. Approval stores a cloned snapshot of the revision; an operator amendment creates a new draft revision while retaining the approved snapshot for inspection. Preserve the change history rather than rewriting the prior approval.

## Consequences

- **Benefits:** reviewers and future agents can distinguish the approved snapshot from later edits and understand the correction trail.
- **Costs:** revision copies use additional local storage and the UI must distinguish historical snapshots from the current revision.
- **Limits:** the browser owner can alter local data, so this is not a tamper-proof audit log or verified identity system. Demo approval does not certify clinical validity or training-label eligibility.
- **Revisit when:** actual reviewer responsibilities, server authorization, audit requirements, or evidence-storage contracts are agreed.

## Alternatives

- Edit the approved record in place: simpler storage but loses the boundary between approved content and later changes.
- Keep only an editable approved flag: does not identify the reviewed revision.
- Build a full event-sourcing system immediately: unnecessary for demonstrating the agreed local workflow; no such production decision is made here.

## Implementation and verification

### 2026-10-26 — Initial record

The transition function implements submission, correction requests, approval snapshots, and amendments. Existing Node tests exercise locked revisions, role restrictions, required correction reasons, and snapshot preservation after amendment. They do not prove production role enforcement, tamper resistance, or clinical acceptability.

## Sources

- [Workflow transition logic](../omni-front-end/src/services/workflowStore.js).
- [Review and revision UI](../omni-front-end/src/pages/tugAssessment.jsx).
- [Workflow tests](../omni-front-end/Test/verify_workflow.test.mjs).
- [Prototype verification limits](../omni-front-end/TUG_PROTOTYPE.md#validation-record--26-october-2026).
- [ADR-0006](0006-isolate-the-ui-prototype.md), [ADR-0007](0007-link-assessments-attempts-and-evidence-by-id.md).
- [Requirements traceability](../Docs/Fall_Risk_Software_Requirements_and_Plan.md#7-business-to-feature-traceability) (local planning reference; see index source-availability note).
