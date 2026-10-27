# TUG staff workspace prototype

Implemented against `Docs/Fall_Risk_Software_Requirements_and_Plan.md`, version 0.1, 26 October 2026.

This frontend demonstrates the operator-to-reviewer journey with synthetic participants, illustrated camera frames, and generated relative pressure samples. It does not record video, contact devices, authenticate staff, or establish clinical validity. The protocol and preparation checklist remain drafts awaiting clinical review.

## Run and explore

```sh
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173`. Choose **Assessment operator** or **Clinical reviewer**. Both roles use the same staff workspace; the header can switch roles when no attempt is recording.

1. Open Participants and create a synthetic participant with a unique code. The display name is optional.
2. Start a TUG assessment. Explicitly select the simulated camera and mat, then confirm all three preparation checks.
3. Choose a demo scenario and start an attempt. Add labelled observation markers and operator notes. Notes save on leaving the field or using Save observations.
4. Stop the attempt, or abort with a reason. Repeat attempts are retained alongside earlier evidence. Optional manually entered clinical timing is separate from recording duration.
5. Open the assessment record. Select attempts, seek the illustrated replay, inspect pressure samples, and use markers to find observations.
6. Submit a complete draft. Switch to the reviewer role to add observations, request corrections, or approve the demo revision.
7. Switch back to the operator to correct and resubmit, or create an amendment to an approved revision. The approved snapshot remains available in the revision selector.

The seed data includes an assessment awaiting review, an empty draft, a correction request, and an interrupted recording. Legacy admin routes redirect to matching staff pages. Unknown participant/assessment IDs show a missing-record page rather than another person's sample.

## Demonstration scenarios

| Scenario | Expected result |
| --- | --- |
| Successful recording | Both sources finalize as available; the attempt can satisfy the demo completeness check. |
| Partial start | The mat fails to start. Camera evidence is preserved; submission remains blocked until a usable attempt exists. |
| Camera or mat disconnect | The affected source stops at five seconds. Its partial evidence remains available; the other source continues. |
| Save fails once | Finishing keeps the same attempt in memory and shows a failed-save banner. Retry saves that snapshot without creating another attempt. |
| Unverified alignment | Camera and pressure have independent replay controls. No synchronized measurement is offered. |
| Refresh during capture | The unfinished attempt reopens as incomplete, with evidence through the last saved heartbeat and saved observations retained. |
| Unusable attempt | A reason is required; the attempt remains visible and stops satisfying completeness. |
| Unavailable storage | Saving never reports success. Corrupt/unsupported saved data is preserved until an explicit demo reset. |

Use Device readiness to simulate ready, stale, offline, and calibration-needed states. Both selected sources must be ready before starting. These labels do not establish hardware readiness or calibration.

## Local data and boundaries

The browser uses the versioned local-storage key `omni.tug-workspace.v1`; role selection uses session storage. Use one active tab for a demonstration. This is not shared storage or a multi-user system.

Recording status, evidence completeness, local save status, and clinical review status are separate. Submission needs the preparation checklist and at least one usable, completed attempt with both simulated sources. Earlier incomplete or aborted attempts remain in the record. Approval records the demo reviewer, time, observations, and a preserved snapshot; it does not imply an assessment is clinically validated or eligible for AI training.

No backend/API/database changes were made. Real capture, server-enforced permissions, media storage, AI, BBS, export, and patient self-service remain future work.

## Validation record — 26 October 2026

- `npm run test:workflow`: 16 deterministic Node tests for identity linkage, source selection, recording states, failure paths, persistence, corrections, approval and amendment snapshots.
- `npm run lint` and `npm run build`: required frontend checks. The build retains the existing large-bundle advisory.
- `npx @google/design.md lint DESIGN.md`: zero errors and zero warnings. A temporary npm cache was needed after the normal cache reported insufficient space.
- React server-render smoke checks: all eleven main/missing-record routes and reviewer controls rendered. These checks do not verify browser layout or interaction.
- Desktop browser inspection reached the entry, workspace, preparation, recording and draft-record screens. Browser control/screen capture was intermittent (transport, window and macOS capture-service errors), so the complete interaction matrix and tablet/mobile visual checks remain unverified.
- The verified entry screenshot is saved in `Docs/ui-prototype/entry-desktop.png`. An unrelated tab captured during a browser-window change was removed from project artifacts.
- `graphify update .` was run after code changes. Existing unrelated workspace edits were preserved.

M1 in the software delivery plan is **not** complete: its actual-device, permissions, storage and clinical acceptance gates remain separate from this UI prototype.
