# 0006 — Isolate the UI prototype from live integrations

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** Temporary synthetic, single-active-tab UI prototype only; not a production storage or capture decision.
- **Decision evidence / authority:** Project owner; explicitly selected a working UI prototype and simulation of both evidence sources.

## Status

Accepted

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

The first UI delivery needs to demonstrate the full operator/reviewer journey before real capture contracts, shared storage, and server permissions are agreed. The project owner chose a working local prototype with simulated camera and pressure evidence instead of existing-API-only or full-stack delivery.

This boundary matters for later agents: backend services exist in the repository, but the currently routed assessment UI is not connected to them.

Requirement drivers are FR-06 (recording quality and failure handling) and NFR-01 (confirm required evidence availability before reporting completion). The prototype illustrates these states; local browser saves do not satisfy the production durability requirement.

## Decision

Keep this UI delivery independent of live services. Generate illustrated camera frames and deterministic pressure samples, and label them as simulated and uncalibrated. Persist synthetic workflow snapshots in versioned browser localStorage using `omni.tug-workspace.v1`; keep the demo role in sessionStorage. Use React shared state and a small workflow service without a new state-management dependency.

Keep recording state, evidence completeness, local-save state, and review status distinct. Retry failed saves with the same in-memory snapshot and IDs. Recover unfinished recordings as incomplete, and require explicit reset for unreadable saved data. Describe success as saved in this browser, not as server durability or a real evidence upload.

## Consequences

- **Benefits:** repeatable success/failure scenarios and retrievable demo records can support workflow review without device or backend setup.
- **Costs:** browser storage has limits, can be cleared, and is not shared or access-controlled. Use one active tab for a demonstration; multi-user consistency is not provided.
- **Limits:** illustrated frames are not video files, generated samples are not calibrated pressure, and demo roles are not an authentication boundary. No real-participant use is established.
- **Revisit when:** the capture contract and server access/storage requirements are agreed. A live-integration ADR must address migration and recovery before this boundary changes.

## Alternatives

- Connect only currently available APIs: leaves important assessment and evidence operations unavailable until backend changes exist.
- Deliver the complete backend/capture workflow immediately: materially expands scope and depends on unresolved interfaces.
- Use a real webcam with a simulated mat: adds permission and media-storage work; both-source simulation was selected instead.

## Implementation and verification

### 2026-10-26 — Initial record

The provider, workflow store, and evidence viewer implement this isolation. The prototype guide records 16 prior Node workflow tests and their scope; full interaction/responsive checks remain incomplete. Simulation and browser persistence cannot pass the software plan's actual-device and production-record acceptance gates.

## Sources

- Project owner's prototype-delivery and both-source-simulation choices, 2026-10-26, current conversation.
- [Workflow provider](../omni-front-end/src/context/WorkflowProvider.jsx), [workflow store](../omni-front-end/src/services/workflowStore.js), [evidence viewer](../omni-front-end/src/components/EvidenceViewer.jsx).
- [Workflow tests](../omni-front-end/Test/verify_workflow.test.mjs).
- [Prototype guide](../omni-front-end/TUG_PROTOTYPE.md).
- [ADR-0005](0005-use-one-staff-assessment-workspace.md), [ADR-0007](0007-link-assessments-attempts-and-evidence-by-id.md).
- [Requirements traceability](../Docs/Fall_Risk_Software_Requirements_and_Plan.md#7-business-to-feature-traceability) (local planning reference; see index source-availability note).
