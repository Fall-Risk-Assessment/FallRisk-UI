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
- `cd omni-back-end/platform-service && npm run dev` starts the API with Nodemon and dotenv.
- `cd omni-back-end/ingest-service && npm run dev` starts telemetry ingestion with Nodemon.
- `cd omni-back-end/serial-bridge && npm start` starts serial-to-MQTT forwarding.
- From `omni-back-end/ingest-service/Test/`, run `node verify_api.js`, `node verify_influx.js`, or `node verify_hardening.js` for focused integration checks.

## Coding Style & Naming Conventions

Use ES modules, semicolons, and the existing file's indentation (typically two spaces in React and four in backend services). React components use PascalCase exports; hooks begin with `use`; functions and variables use camelCase. Existing page filenames are camelCase (for example, `sessionDetail.jsx`). Keep route, controller, and service responsibilities separated. Run `npm run lint` before submitting frontend changes.

## Testing Guidelines

No repository-wide test runner or coverage threshold is configured. Add deterministic verification scripts beside the affected service and name them `verify_<behavior>.js`; avoid depending on production data. For UI changes, at minimum run lint and build, then manually exercise affected routes. Backend integration checks require the relevant PostgreSQL, InfluxDB, and MQTT environment settings.

## Commit & Pull Request Guidelines

Recent history primarily follows Conventional Commit prefixes such as `feat:`. Use concise, imperative subjects such as `fix: reject malformed telemetry payloads`; keep unrelated changes in separate commits. Pull requests should summarize behavior, list services and configuration affected, include validation commands/results, link the issue when available, and attach screenshots for visible UI changes. Never commit `.env`, credentials, database URLs, or generated `dist/`, coverage, and log files.
