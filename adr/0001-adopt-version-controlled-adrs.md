# 0001 — Adopt version-controlled ADRs with mandatory maintenance

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** Repository documentation and all future coding tasks.
- **Decision evidence / authority:** Project owner; explicit approval of this ADR collection and mandatory agent-maintenance plan in the current task.

## Status

Accepted

Decision acceptance, implementation presence, and verification are separate. The status applies only to the scope above.

## Context

Architectural reasoning is currently spread across requirements, service documentation, and task discussions. Later agents can see code without knowing whether it represents an accepted direction, a prototype shortcut, or an unconfirmed historical choice. The project owner explicitly requires an ADR update before every coding task finishes.

The root `adr/` directory is visible to Git; `Docs/*` is currently ignored. A small Markdown log keeps the decision history available alongside source without adding a documentation service.

## Decision

Use one numbered Markdown record per significant architectural decision, with an index and reusable template. Keep Status, Context, Decision, and Consequences; add scope, dates, alternatives, sources, and implementation/verification evidence. Use Proposed, Accepted, Rejected, Deprecated, or Superseded as appropriate. Acceptance concerns the decision within its stated scope, not whether all implementation or operational checks have passed.

The mandatory coding-agent workflow is:

1. **Before coding:** read [the ADR index](README.md) and the accepted records relevant to the task. Follow their decisions within their stated scope; proposed records describe unconfirmed choices, not binding policy.
2. **Before finishing every coding task:** update the ADR documentation to match the actual implementation, reasoning, tradeoffs, and verification results. This is a required completion step for features, fixes, refactors, and configuration or schema changes; do not defer it to a later task.
3. **For architectural changes:** create a numbered ADR using [the template](template.md), or append dated implementation evidence to the relevant record when the decision remains unchanged. If a change replaces an accepted decision, create a superseding ADR and add reciprocal links/status updates; preserve the original rationale. New decisions remain Proposed unless the user or accountable decision-maker has explicitly accepted them. Code presence alone is not approval.
4. **For tasks without architectural changes:** append a concise entry to the ADR index's coding-task history with the date, change summary, relevant ADRs, verification, and the exact statement **“No architectural decision changed.”** An existing task entry may be updated while that same task is still in progress; a later task gets a new entry.
5. **For incomplete work:** update the ADR documentation before the final handoff to record what was implemented, remaining work, and verification gaps. Do not describe incomplete work as complete or imply production, hardware, or clinical acceptance from prototype checks.
6. **In the final response:** identify the ADRs or ADR-index history entry updated, together with material verification gaps.

Accepted rationale is retained. Add dated evidence when implementation changes without changing the decision. A replacement decision gets a new numbered record; update the old status and both supersession links. Record creation dates separately from historical decision dates. Do not invent approvers or backdate acceptance.

## Consequences

- **Benefits:** future developers can reconstruct why the implementation has its current boundaries, and every coding handoff leaves a documentation trail.
- **Costs:** even small fixes require a short index entry, and links/statuses need maintenance. The history is a compact handoff log rather than a replacement for Git history.
- **Limits:** Markdown instructions establish a project rule, not an automated enforcement mechanism. The initial records do not ratify every existing technology choice.
- **Revisit when:** the log becomes difficult to navigate or the team identifies a concrete need for automated checks; tooling is not required for this first collection.

## Alternatives

- Rely on source and commit messages alone: insufficient for distinguishing rationale, scope, and approval.
- Keep decisions only in ignored local planning documents: future clones may lack them.
- Introduce an external ADR platform or mandatory tooling now: adds operational work before a demonstrated need.

## Implementation and verification

### 2026-10-26 — Initial record

The collection, index, and matching AGENTS.md section are introduced by this documentation task. Check record structure, links, numbering, Git visibility, and consistency of the six maintenance requirements. No runtime changes or integration tests are required for this documentation-only task.

## Sources

- Project owner's approved ADR plan and explicit instruction that every coding task must update ADR documentation, 2026-10-26, current conversation.
- [Agent instructions](../AGENTS.md#architecture-decision-records--mandatory-coding-task-completion).
- [Nygard template](https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en-001/templates/decision-record-template-by-michael-nygard/index.md) and [ADR repository guidance](https://github.com/architecture-decision-record/architecture-decision-record).
