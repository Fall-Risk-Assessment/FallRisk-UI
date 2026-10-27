# 0009 — Use .agents for project agent configuration

- **Recorded:** 2026-10-26
- **Decision date:** 2026-10-26
- **Scope:** Project-owned agent skills, rules, workflows and hook declarations in this repository. Application architecture and global user configuration are unaffected.
- **Decision evidence / authority:** Project owner's explicit instruction in the current task to remove project-local `.codex/`, use only `.agents/` for consistency, and preserve `hooks.json` under `.agents/`.

## Status

Accepted

Acceptance concerns the directory convention. It does not establish automatic hook discovery or execution by every agent host.

## Context

The project had both `.codex/skills/graphify/` and `.agents/skills/graphify/`. Most files were identical, but the provider-specific skill instructions and extraction prompt differed. The existing `.agents/` tree also contained Graphify rules and a workflow. Parallel copies could diverge and leave future agents uncertain about which version governs the project.

The old `.codex/hooks.json` declared a Bash PreToolUse command, `graphify hook-check`. The installed CLI implementation makes that command a compatibility no-op; graph guidance is supplied through agent instructions. The separate Git hooks and merge driver have no dependency on the removed directory.

## Decision

Use `.agents/` as the only project-owned agent configuration directory. Keep root AGENTS.md as the instruction entry point. Preserve the hook declaration exactly in `.agents/hooks.json`, retain the existing canonical skills/rules/workflow, and preserve the two differing provider-specific files as a reversible compatibility patch beside the canonical Graphify references. Remove the project-local `.codex/` tree only after verifying that its content is preserved.

Do not recreate the removed directory as an automatic-loading shim or change global user configuration as part of this migration. Document the hook-loading limitation explicitly: native Codex discovery of `.agents/hooks.json` is not established. A compatible runner must load it explicitly. Continue following the existing Graphify requirements independently of lifecycle hooks.

## Consequences

- **Benefits:** one project directory owns agent configuration, existing `.agents/` customizations remain intact, and the former provider-specific differences remain recoverable.
- **Costs:** a provider-specific adaptation may need deliberate review before reuse rather than automatic selection of a parallel installed skill.
- **Limitations:** the relocated JSON is a preserved declaration, not verified native Codex auto-loading. The current `graphify hook-check` no-op does not enforce graph policy. Existing Git hooks remain separate from this file.
- **Revisit when:** an agent runner supplies documented `.agents/` hook support, Graphify changes its command behavior, or the project owner explicitly changes the directory convention.

## Alternatives

- Keep both directories synchronized: retains duplicate sources of configuration and conflicts with the owner's consistency requirement.
- Overwrite the canonical skill with the provider-specific variant: would discard the existing provider-neutral instructions without an agreed reason.
- Preserve a `.codex/` loader shim or alter global settings: conflicts with the requested project-only convention or exceeds this migration's scope.
- Keep one canonical tree and archive only the differences: selected; the compatibility patch preserves the former variant without activating it automatically.

## Implementation and verification

### 2026-10-26 — Directory consolidation

The hook manifest is relocated without semantic changes. Duplicate skill content is checked against the canonical copy; the two differing files are reconstructed from the preserved patch in temporary storage and compared byte-for-byte with their former contents. Existing `.agents/` files, Git hooks and merge-driver configuration are checked for preservation. Directory removal, JSON validity, canonical skill availability, links, whitespace and Graphify command availability are checked before handoff.

Validation results: all 11 former files are preserved, all 12 pre-existing `.agents/` files are unchanged, the hook JSON is byte-identical, and temporary patch reconstruction matches both differing originals. The four Graphify Git hooks are installed, the merge driver is registered and unchanged, the command checks pass, and all 83 local links/anchors across the current ADR and agent documents resolve. Whitespace and ADR-rule consistency checks pass.

These checks do not demonstrate native hook loading or future automatic execution. No application runtime or database changes are required. The migration does not replace ADR-0001; its completion workflow continues to apply.

## Sources

- Project owner's `.agents/`-only instruction, 2026-10-26, current conversation.
- [Project instructions](../AGENTS.md#project-agent-configuration-directory).
- [Agent configuration notes](../.agents/README.md), [hook declaration](../.agents/hooks.json), and [canonical Graphify skill](../.agents/skills/graphify/SKILL.md).
- [Preserved provider-specific differences](../.agents/skills/graphify/references/codex-compatibility.patch).
- [ADR-0001](0001-adopt-version-controlled-adrs.md).
- [Official OpenAI hook-discovery documentation](https://learn.chatgpt.com/docs/hooks#where-codex-looks-for-hooks).
- Installed Graphify CLI source inspected on 2026-10-26: the `hook-check` dispatch branch exits with status zero as a compatibility no-op. This is a local observation, not a guarantee for future versions.
