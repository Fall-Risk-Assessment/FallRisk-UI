# Architecture Decision Record index

These English records explain significant decisions in the Fall Risk project. Read the index and relevant accepted ADRs before coding, then follow the mandatory completion workflow in [AGENTS.md](../AGENTS.md#architecture-decision-records--mandatory-coding-task-completion).

The collection follows the [Michael Nygard template](https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en-001/templates/decision-record-template-by-michael-nygard/index.md), supplemented by scope, dates, alternatives, verification, and source links. See [the project template](template.md) and [ADR-0001](0001-adopt-version-controlled-adrs.md) for maintenance rules.

## Decision log

| ADR | Decision | Status | Scope / evidence boundary |
| --- | --- | --- | --- |
| [0001](0001-adopt-version-controlled-adrs.md) | Adopt version-controlled ADRs with mandatory maintenance | Accepted | Repository practice; explicitly approved in this task. |
| [0002](0002-reuse-existing-application-foundations.md) | Reuse the existing application foundations | Accepted | Current reuse direction; original technology-selection rationale unknown. |
| [0003](0003-separate-ingestion-from-platform-api.md) | Separate telemetry ingestion from the platform API | Proposed | Observed backend boundary; retention rationale awaits confirmation. |
| [0004](0004-separate-metadata-and-telemetry-storage.md) | Separate relational metadata from time-series telemetry storage | Proposed | Observed backend storage split; retention rationale awaits confirmation. |
| [0005](0005-use-one-staff-assessment-workspace.md) | Use one staff workspace for recording and clinical review | Accepted | Accepted UI prototype direction; server permissions remain open. |
| [0006](0006-isolate-the-ui-prototype.md) | Isolate the UI prototype from live integrations | Accepted | Temporary browser-local simulation; not production capture/storage. |
| [0007](0007-link-assessments-attempts-and-evidence-by-id.md) | Link participants, assessments, attempts, and evidence by stable IDs | Accepted | Local prototype identities; backend migration remains open. |
| [0008](0008-preserve-approved-assessment-revisions.md) | Preserve approved assessment revisions when creating amendments | Accepted | Local approval snapshots; not a tamper-proof clinical audit. |
| [0009](0009-use-agents-for-project-agent-configuration.md) | Use .agents for project agent configuration | Accepted | Project directory convention; relocated hook declaration is not verified native auto-loading. |

## How to read and maintain the log

- Accepted records govern their stated scope. Proposed retrospective records capture observed architecture and a proposal to retain it; they do not establish historical approval or bind a future production design.
- Record creation dates are 2026-10-26. Unknown historical decision dates and approvers remain explicitly unknown. Acceptance evidence for the prototype and this ADR practice is the project owner's explicit approval in the current task history.
- The [TUG prototype guide](../omni-front-end/TUG_PROTOTYPE.md) records implementation and verification limits. A local UI approval, source inspection, or passing unit check does not establish clinical, hardware, security, or deployment acceptance. The integrated M1 gate remains open.
- For a new decision, copy the template to the next unused four-digit ID with a lowercase, hyphenated imperative title. Never reuse an ID. Add the record to this index and link related decisions. Keep a new decision Proposed unless explicit acceptance evidence exists.
- For an unchanged decision, append a dated implementation/verification note when relevant. To replace an accepted decision, write a new ADR, mark the old one Superseded, and link both directions; retain its original rationale.
- Before finishing every coding task, update the relevant ADRs or append a coding-task history entry below. Record actual results and incomplete work; identify the updated records/index entry in the final response. See ADR-0001 and AGENTS.md for the complete mandatory rules.

### Source availability

The requirements plan at `Docs/Fall_Risk_Software_Requirements_and_Plan.md` is a local planning reference under the current `Docs/*` ignore rule. It may not be available in a fresh clone. The ADRs summarize the important decisions and boundaries in their own text and link source implementation and the prototype guide. Do not infer that linked planning artifacts, untracked source files, or tests have been committed or published merely because they exist in this working tree.

## Open production decisions

These are discovery items, not accepted designs or an instruction to implement them. Named accountable owners and dates remain unassigned unless recorded by the project team.

| Topic | Evidence/decision needed | Relevant records |
| --- | --- | --- |
| Camera/mat capture contract | Source identity, start/stop acknowledgements, failure/retry behavior, device capability and calibration evidence. | 0003, 0006, 0007 |
| Media and shared assessment storage | Storage location, linking, durable availability, upload recovery and migration from the local prototype. | 0004, 0006, 0007 |
| Server-enforced permissions | Operator/reviewer responsibility, approval authority, protected evidence access and audit integrity. | 0005, 0008 |
| Source synchronization | Clock ownership, measured alignment limits and which measurements depend on them. | 0006, 0007 |
| Retention and operational recovery | Agreed collection/use, retention, backup/restore and reconciliation across stores. | 0003, 0004, 0008 |
| Deployment and pilot operations | Intended site, configuration, support ownership, capacity and acceptance evidence. | 0002, 0003, 0004 |
| Clinical protocol and later assistance | Doctor-approved protocol/version; requirements for BBS, AI tasks and label eligibility remain separate from demo approval. | 0005, 0007, 0008 |

## Coding-task history

Every coding task must leave a dated entry when no architectural decision changes. For a task introducing or superseding decisions, link those records and record its verification/handoff here as useful context. Keep entries concise; this is not a transcript or a replacement for Git history.

Use: `Date | Task/change | Relevant ADRs | Decision impact | Verification and remaining work`. Include the exact statement **“No architectural decision changed.”** when applicable. If work is incomplete, say so and record remaining work and verification gaps. Update the same entry during one task; append a new entry for a later task.

| Date | Task/change | Relevant ADRs | Decision impact | Verification and remaining work |
| --- | --- | --- | --- | --- |
| 2026-10-26 | Establish the ADR collection and mandatory agent completion workflow; documentation only. | 0001–0008 | ADR-0001 accepts the documentation practice; 0002 and 0005–0008 record previously agreed direction; 0003–0004 remain Proposed retrospective records. No application architecture changed. | Source comparison and documentation checks passed: eight records, 67 local links/anchors, matching six-step agent rules, preserved existing guidance, Git visibility and whitespace. No runtime files, APIs or schemas changed by this task. |
| 2026-10-26 | Consolidate project agent configuration into `.agents/`; preserve hook JSON and provider-specific Graphify differences; remove project-local `.codex/`. | 0001, 0009 | ADR-0009 accepts the project agent-directory convention; no application architecture changed. | Source preservation, exact hook JSON, patch reconstruction, Git hooks/merge driver, Graphify command checks, links and whitespace verified. Native `.agents/hooks.json` auto-loading is not claimed. |
| 2026-10-26 | Create the six-slide progress presentation dated 28 October 2569, matching the existing pink deck with actual UI screenshots and source-derived Mermaid excerpts. Authoring scripts and assets remain under local `Docs/update-progress/`. | 0001, 0004–0008 | No architectural decision changed. | Six slides rendered and visually reviewed; exported package, dimensions, heading fit, font declarations and first-party import passed with zero findings/warnings. Original deck preserved. Native PowerPoint playback/font substitution was not tested. No application code, database migration, hardware or clinical acceptance changes. |

## Collection validation

### Initial collection — 2026-10-26

Checked when the initial eight records were created:

- Eight uniquely numbered records contain all required sections, the intended statuses, creation date and scope boundaries.
- All 67 local document/source links and heading anchors resolve in this workspace, including the explicitly identified local-only requirements reference.
- AGENTS.md and ADR-0001 contain the same six completion requirements; existing agent guidance and unrelated README text were preserved.
- The new ADR files are visible to Git, and whitespace/diff checks passed.
- Source claims were compared with the current router, workflow service, provider, backend entry points, ingestion path and Prisma schema.

Application test results referenced by ADRs are historical results from the prototype guide; this documentation task does not rerun or extend those checks. Backend integration, full browser/responsive verification, production security and clinical/hardware acceptance remain outside these documentation checks.


### Agent configuration consolidation — 2026-10-26

ADR-0009 records the accepted `.agents/`-only project convention. All 11 former `.codex/` files were preserved through canonical equivalents, the unchanged hook manifest, and a reversible patch for two differing files. All 12 pre-existing `.agents/` files and the Git hook/merge-driver configuration were preserved. The project-local `.codex/` directory was removed. JSON parsing, byte comparisons, patch reconstruction and Graphify command checks passed. Native `.agents/hooks.json` auto-loading is not established; see ADR-0009 and the agent configuration notes.
