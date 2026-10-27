# Project agent configuration

Use `.agents/` as the only project-owned agent configuration directory. Keep skills under `skills/`, rules under `rules/`, workflows under `workflows/`, and the preserved hook declaration in [hooks.json](hooks.json). Root [AGENTS.md](../AGENTS.md) remains the project instruction entry point. Do not recreate a project-local `.codex/` directory.

## Graphify migration — 26 October 2026

The canonical [Graphify skill](skills/graphify/SKILL.md), existing rules and workflow were preserved. The former provider-specific copy differed in its semantic-extraction dispatch instructions and compact extraction prompt. Those two differences are preserved in [codex-compatibility.patch](skills/graphify/references/codex-compatibility.patch), relative to the Graphify skill directory. The patch is reference material and is not applied automatically. Its original files were reconstructed in temporary storage and checked byte-for-byte before the duplicate directory was removed.

## Hook loading and execution

[hooks.json](hooks.json) preserves the former declaration exactly: `PreToolUse`, matcher `Bash`, command `graphify hook-check`. A runner must explicitly support or load this manifest; storing the file here does not establish automatic execution.

The [official OpenAI hook documentation](https://learn.chatgpt.com/docs/hooks#where-codex-looks-for-hooks) describes discovery next to active configuration layers, including a project-local `.codex/` layer. It does not establish native discovery of `.agents/hooks.json`. This project follows the owner's `.agents/`-only layout and does not add a native `.codex/` shim or change global user configuration.

In the installed Graphify CLI inspected during this migration, `hook-check` exits successfully as a compatibility no-op. Do not describe it as enforcing graph searches or blocking commands. The existing Graphify requirements in AGENTS.md and `.agents/rules/graphify.md` remain the agent instructions; the existing Git hooks and merge driver remain in place. Recheck hook-runner support and the installed CLI behavior before relying on lifecycle automation after an upgrade.

See [ADR-0009](../adr/0009-use-agents-for-project-agent-configuration.md) for the accepted directory decision and its limitations.
