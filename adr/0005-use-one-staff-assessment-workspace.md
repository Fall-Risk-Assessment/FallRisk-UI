# 0005 — Use one staff workspace for recording and clinical review

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** The supervised TUG UI prototype; production role assignments and authorization remain open.
- **Decision evidence / authority:** Project owner; explicitly selected replacement of the patient/admin demo with a staff workspace.

## Status

Accepted

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

The agreed first workflow is staff-led TUG recording followed by clinical review. Operator and reviewer responsibilities are related steps around the same participant and evidence, rather than a requirement for separate portals. The project owner selected replacement of the old patient/admin demonstration.

Patient self-service, AI suggestions, BBS implementation, and model training are not prerequisites for demonstrating this journey.

Requirement drivers are FR-01 (participant-linked assessments and attempts) and FR-07 (evidence review and concise summaries). The approved staff-first scope determines the workspace boundary.

## Decision

Use a shared staff workspace with participant selection, preparation, recording, evidence review, correction requests, and approval. Demonstrate operator and reviewer responsibilities through demo roles in the same interface. Use `/staff` routes, redirect equivalent legacy admin links, and retire patient routes to the demo entry.

Keep the workflow usable with manual observations and no AI. Apply the existing bilingual design system. Role selection demonstrates intended workflow permissions; it is not production authentication or server enforcement.

## Consequences

- **Benefits:** one record can carry context from preparation through review, and development focuses on the first agreed staff journey.
- **Costs:** action availability and recording/review states must remain understandable within one interface.
- **Limits:** this does not settle clinical delegation, approved protocol content, or production access control. Prototype completion is not M1 clinical/hardware acceptance.
- **Revisit when:** observed staff tasks or an accepted patient-facing use case justify another workspace or a different role boundary.

## Alternatives

- Keep separate patient and admin demos alongside the new flow: preserves two experiences but retains a deferred portal in the active scope.
- Replace them with the staff workspace: selected by the project owner.
- Create a separate portal for every workflow responsibility: not required by the approved first milestone.

## Implementation and verification

### 2026-10-26 — Initial record

The current router and staff pages implement the shared workspace. The prototype guide records prior lint/build, workflow checks, and partial desktop inspection; full browser interaction and tablet/mobile visual verification remain incomplete. This documentation task checks the record against source, not the complete runtime journey.

## Sources

- Project owner's staff-workspace choice and approval of the TUG UI plan, 2026-10-26, current conversation.
- [Frontend routes](../omni-front-end/src/App.jsx), [staff pages](../omni-front-end/src/pages/staffPages.jsx), [assessment pages](../omni-front-end/src/pages/tugAssessment.jsx).
- [Design system](../omni-front-end/DESIGN.md).
- [Prototype guide](../omni-front-end/TUG_PROTOTYPE.md).
- [ADR-0006](0006-isolate-the-ui-prototype.md).
- [Requirements traceability](../Docs/Fall_Risk_Software_Requirements_and_Plan.md#7-business-to-feature-traceability) (local planning reference; see index source-availability note).
