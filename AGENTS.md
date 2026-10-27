# Repository Guidelines

## Project Structure & Module Organization

- `omni-front-end/` contains the React 19/Vite application. Place routed views in `src/pages/`, reusable UI in `src/components/`, API access in `src/services/` or `src/api/`, hooks in `src/hooks/`, and styles in `src/css/`.
- `omni-back-end/platform-service/` provides the Express API, authentication, Prisma/PostgreSQL models, MQTT subscriptions, and Socket.IO relay.
- `omni-back-end/ingest-service/` validates MQTT telemetry and writes to InfluxDB. Device schemas live in `device_profiles/`; verification scripts live in `Test/`.
- `omni-back-end/serial-bridge/` forwards Arduino serial data to MQTT.
- `hardware-prototypes/` holds Arduino sketches and pressure-mat Python visualizers. Root Markdown files document system workflows and recording behavior.

## Build, Test, and Development Commands

Install dependencies separately in each JavaScript package with `npm install`.

- `cd omni-front-end && npm run dev` starts the Vite development server.
- `cd omni-front-end && npm run build` creates the production bundle in `dist/`.
- `cd omni-front-end && npm run lint` runs ESLint over JavaScript and JSX.
- `cd omni-front-end && npx @google/design.md lint DESIGN.md` validates frontend design tokens and specification adherence.
- `cd omni-back-end/platform-service && npm run dev` starts the API with Nodemon and dotenv.
- `cd omni-back-end/ingest-service && npm run dev` starts telemetry ingestion with Nodemon.
- `cd omni-back-end/serial-bridge && npm start` starts serial-to-MQTT forwarding.
- From `omni-back-end/ingest-service/Test/`, run `node verify_api.js`, `node verify_influx.js`, or `node verify_hardening.js` for focused integration checks.
- `graphify query "<question>"` queries symbols, calls, and relationships from the codebase knowledge graph.
- `graphify update .` incrementally updates the AST knowledge graph across the repository.

## Design System & UI Consistency (`DESIGN.md`)

When creating, modifying, refactoring, or fixing any frontend views, components, or styles in `omni-front-end/`:
- **Follow `omni-front-end/DESIGN.md` Strictly:** All visual elements must adhere to the design system tokens, typography scales, spacing units, and component guidelines described in [`omni-front-end/DESIGN.md`](file:///Users/pannathorn/Desktop/Work/Freelance/กทปส/omni-project/omni-front-end/DESIGN.md).
- **Colors & Tokens:** Use CSS variables from `src/index.css` matching design tokens (`--primary`, `--primary-dark`, `--primary-soft`, `--chart-secondary`, `--success`, `--warning`, `--danger`, `--bg-main`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--border-color`). Avoid ad-hoc, hardcoded hex values or generic unstyled elements.
- **Typography & Bilingual Clarity:** Utilize the defined `IBM Plex Sans Thai` and `Inter` font stack. Preserve bilingual (Thai & English) labels and headings for clinical indicators. Adhere to WCAG AA contrast standards (minimum 4.5:1 for normal text).
- **Shapes & Radii:** Apply the established radius scale (`10px` for buttons/inputs, `14px` for metric cards/modals, `18px` for clinical cards, `9999px` for pills/badges). Never use sharp 90-degree unrounded boxes in card-based interfaces.
- **Validation:** When modifying design tokens or components, run `npx @google/design.md lint DESIGN.md` in `omni-front-end/` to ensure zero errors and zero warnings.

## Coding Style & Naming Conventions

Use ES modules, semicolons, and the existing file's indentation (typically two spaces in React and four in backend services). React components use PascalCase exports; hooks begin with `use`; functions and variables use camelCase. Existing page filenames are camelCase (for example, `sessionDetail.jsx`). Keep route, controller, and service responsibilities separated. Run `npm run lint` before submitting frontend changes.

## Testing Guidelines

No repository-wide test runner or coverage threshold is configured. Add deterministic verification scripts beside the affected service and name them `verify_<behavior>.js`; avoid depending on production data. For UI changes, at minimum run lint and build, then manually exercise affected routes. Backend integration checks require the relevant PostgreSQL, InfluxDB, and MQTT environment settings.

## Commit & Pull Request Guidelines

Recent history primarily follows Conventional Commit prefixes such as `feat:`. Use concise, imperative subjects such as `fix: reject malformed telemetry payloads`; keep unrelated changes in separate commits. Pull requests should summarize behavior, list services and configuration affected, include validation commands/results, link the issue when available, and attach screenshots for visible UI changes. Never commit `.env`, credentials, database URLs, or generated `dist/`, coverage, and log files.

## Codebase Knowledge Graph (`graphify`)

This project maintains an AST knowledge graph in `graphify-out/` detailing symbols, components, call trees, and cross-file relationships.

### Mandatory Rules for AI Agents:

1. **Mandatory Code Search via Graphify:**
   - Whenever you need to find, search, or locate code, symbols, functions, classes, components, or architecture across this project, **you MUST query graphify first** using:
     ```bash
     graphify query "<question>"
     ```
   - Do NOT start with broad `grep_search` or open raw files aimlessly. First use `graphify query` to locate the exact symbols and files.
   - Use `graphify path "<SymbolA>" "<SymbolB>"` to trace call paths and dependencies.
   - Use `graphify explain "<concept>"` to inspect focused modules.
   - Inspect raw source files only for specific line ranges identified by the graph query.

2. **Mandatory Graph Update on Any Code Changes:**
   - **Whenever you add, remove, or edit code in ANY file** within this repository (frontend views/components, backend services, serial bridge, hardware prototype visualizers), **you MUST run `graphify update .` immediately** after completing the changes:
     ```bash
     graphify update .
     ```
   - This keeps `graphify-out/graph.json`, `graphify-out/graph.html`, and `graphify-out/GRAPH_REPORT.md` accurate and in sync. It runs locally via AST extraction without requiring an LLM API key.

3. **Graph Integrity & Git Hooks:**
   - Git hooks (`post-commit`, `post-merge`, `post-checkout`, `post-rewrite`) and a custom merge driver are configured to protect graph consistency.
   - Diff changes to `graphify-out/graph.json` are expected on rebuilds; do not flag them as unnecessary churn or discard them.

## Architecture Decision Records — Mandatory Coding Task Completion

1. **Before coding:** read [the ADR index](adr/README.md) and the accepted records relevant to the task. Follow their decisions within their stated scope; proposed records describe unconfirmed choices, not binding policy.
2. **Before finishing every coding task:** update the ADR documentation to match the actual implementation, reasoning, tradeoffs, and verification results. This is a required completion step for features, fixes, refactors, and configuration or schema changes; do not defer it to a later task.
3. **For architectural changes:** create a numbered ADR using [the template](adr/template.md), or append dated implementation evidence to the relevant record when the decision remains unchanged. If a change replaces an accepted decision, create a superseding ADR and add reciprocal links/status updates; preserve the original rationale. New decisions remain Proposed unless the user or accountable decision-maker has explicitly accepted them. Code presence alone is not approval.
4. **For tasks without architectural changes:** append a concise entry to the ADR index's coding-task history with the date, change summary, relevant ADRs, verification, and the exact statement **“No architectural decision changed.”** An existing task entry may be updated while that same task is still in progress; a later task gets a new entry.
5. **For incomplete work:** update the ADR documentation before the final handoff to record what was implemented, remaining work, and verification gaps. Do not describe incomplete work as complete or imply production, hardware, or clinical acceptance from prototype checks.
6. **In the final response:** identify the ADRs or ADR-index history entry updated, together with material verification gaps.

The ADR workflow complements the existing Graphify, design, testing, and personal-knowledge instructions; it does not replace them.

## Project Agent Configuration Directory

- Use `.agents/` as the only project-owned agent configuration directory: skills in `.agents/skills/`, rules in `.agents/rules/`, workflows in `.agents/workflows/`, and hook declarations in [.agents/hooks.json](.agents/hooks.json).
- Do not create or restore a project-local `.codex/` directory. Keep root `AGENTS.md` as the instruction entry point.
- See [the agent configuration notes](.agents/README.md) and [ADR-0009](adr/0009-use-agents-for-project-agent-configuration.md) before changing this layout. Preserve existing skill customizations when consolidating copies.
- Do not assume that moving a hook declaration enables automatic execution. Native Codex discovery of `.agents/hooks.json` is not established; the installed `graphify hook-check` command is currently a compatibility no-op. Continue following the existing Graphify search/update requirements and preserve the separate Git hooks.
