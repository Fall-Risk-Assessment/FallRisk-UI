import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTORS, CHECKLIST, completeness, loadWorkflow, pressureFrame, recoverWorkflow, saveWorkflow, seedWorkflow, STORAGE_KEY, transition } from '../src/services/workflowStore.js';

const now = Date.parse('2026-10-26T09:00:00+07:00');
function fixture() {
  let data = seedWorkflow(now);
  const send = (action, actor = ACTORS.operator, time = now) => {
    const result = transition(data, { assessmentId: 'assessment-2', ...action }, actor, time);
    data = result.data;
    return result;
  };
  const prepare = () => CHECKLIST.forEach(({ id }) => send({ type: 'CHECK', key: id, value: true }));
  return { send, prepare, get data() { return data; }, get assessment() { return data.assessments.find((item) => item.id === 'assessment-2'); } };
}
function memoryStorage() {
  const map = new Map();
  return { getItem: (key) => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
}

test('participants remain distinct through multiple attempts and save/reopen', () => {
  const f = fixture();
  f.prepare();
  for (const id of ['one', 'two']) {
    f.send({ type: 'START', attemptId: id });
    f.send({ type: 'FINISH', attemptId: id }, ACTORS.operator, now + 18000);
  }
  const storage = memoryStorage();
  saveWorkflow(storage, f.data);
  const reopened = loadWorkflow(storage);
  assert.equal(reopened.assessments[1].participantId, 'participant-2');
  assert.deepEqual(reopened.assessments[1].attempts.map((item) => item.id), ['one', 'two']);
  assert.equal(reopened.assessments[0].participantId, 'participant-1');
  assert.equal(reopened.assessments[0].attempts.length, 1);
  assert.notEqual(reopened.assessments[1].attempts[0].evidence[0].id, reopened.assessments[1].attempts[1].evidence[0].id);
});

test('participant codes are required and unique regardless of case', () => {
  const f = fixture();
  assert.throws(() => f.send({ type: 'ADD_PARTICIPANT', code: ' demo-001 ', name: '' }), /already exists/);
  assert.throws(() => f.send({ type: 'ADD_PARTICIPANT', code: ' ', name: '' }), /participant code/);
  const result = f.send({ type: 'ADD_PARTICIPANT', code: ' NEW-001 ', name: '' });
  assert.equal(f.data.participants.find((item) => item.id === result.id).code, 'NEW-001');
});

test('missing IDs never open or create a substitute participant or assessment', () => {
  const f = fixture();
  assert.throws(() => f.send({ type: 'CREATE_ASSESSMENT', participantId: 'missing' }), /not found/);
  assert.throws(() => f.send({ type: 'CHECK', assessmentId: 'missing', key: 'identity', value: true }), /not found/);
  assert.equal(f.data.assessments.length, 4);
});

test('preparation, device readiness and one active attempt are enforced', () => {
  const f = fixture();
  assert.throws(() => f.send({ type: 'START' }), /checklist/);
  f.prepare();
  for (const status of ['offline', 'stale', 'uncalibrated']) {
    f.send({ type: 'DEVICE_STATUS', id: 'mat-01', status });
    assert.throws(() => f.send({ type: 'START' }), /must be ready/);
  }
  f.send({ type: 'DEVICE_STATUS', id: 'mat-01', status: 'ready' });
  f.send({ type: 'START', attemptId: 'active' });
  assert.throws(() => f.send({ type: 'START' }), /already recording/);
  assert.throws(() => f.send({ type: 'DEVICE_STATUS', id: 'camera-01', status: 'offline' }), /Finish the active/);
});

test('normal capture preserves markers, observations and separate manual timing', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'START', attemptId: 'normal' });
  f.send({ type: 'MARKER', attemptId: 'normal', label: 'Review this point' }, ACTORS.operator, now + 4000);
  f.send({ type: 'ATTEMPT_NOTE', attemptId: 'normal', notes: 'Operator note' });
  f.send({ type: 'FINISH', attemptId: 'normal' }, ACTORS.operator, now + 18000);
  f.send({ type: 'ATTEMPT_NOTE', attemptId: 'normal', notes: 'Operator note', manualDurationSeconds: 13.2 });
  const attempt = f.assessment.attempts[0];
  assert.equal(attempt.markers[0].offsetMs, 4000);
  assert.equal(attempt.durationMs, 18000);
  assert.equal(attempt.manualDurationSeconds, 13.2);
  assert.equal(attempt.notes, 'Operator note');
  assert.equal(completeness(f.assessment).length, 0);
  assert.throws(() => f.send({ type: 'FINISH', attemptId: 'normal' }), /no longer recording/);
  assert.throws(() => f.send({ type: 'START', attemptId: 'normal' }), /already exists/);
  assert.throws(() => f.send({ type: 'ATTEMPT_NOTE', attemptId: 'normal', notes: '', manualDurationSeconds: -1 }), /must be positive/);
});

test('new assessments explicitly select matching sources and reassignment resets the source check', () => {
  const f = fixture();
  const result = f.send({ type: 'CREATE_ASSESSMENT', participantId: 'participant-1' });
  const assessmentId = result.id;
  CHECKLIST.forEach(({ id }) => f.send({ type: 'CHECK', assessmentId, key: id, value: true }));
  assert.throws(() => f.send({ type: 'START', assessmentId }), /must be ready/);
  assert.throws(() => f.send({ type: 'ASSIGN_DEVICE', assessmentId, source: 'camera', deviceId: 'mat-01' }), /must match/);
  f.send({ type: 'ASSIGN_DEVICE', assessmentId, source: 'camera', deviceId: 'camera-01' });
  f.send({ type: 'ASSIGN_DEVICE', assessmentId, source: 'mat', deviceId: 'mat-01' });
  assert.throws(() => f.send({ type: 'START', assessmentId }), /checklist/);
  f.send({ type: 'CHECK', assessmentId, key: 'sources', value: true });
  f.send({ type: 'START', assessmentId });
  assert.equal(f.data.assessments.at(-1).attempts[0].evidence[0].deviceId, 'camera-01');
});

test('partial start preserves the camera and cannot satisfy completeness', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'SCENARIO', value: 'partial-start' });
  f.send({ type: 'START', attemptId: 'partial' });
  f.send({ type: 'FINISH', attemptId: 'partial' }, ACTORS.operator, now + 8000);
  assert.equal(f.assessment.attempts[0].status, 'incomplete');
  assert.deepEqual(f.assessment.attempts[0].evidence.map((item) => item.status), ['available', 'failed']);
  assert.throws(() => f.send({ type: 'SUBMIT' }), /usable attempt/);
});

for (const source of ['camera', 'mat']) {
  test(`${source} disconnect retains the first five seconds and flags incompleteness`, () => {
    const f = fixture();
    f.prepare();
    f.send({ type: 'SCENARIO', value: `${source}-disconnect` });
    f.send({ type: 'START', attemptId: 'disconnect' });
    f.send({ type: 'HEARTBEAT', attemptId: 'disconnect' }, ACTORS.operator, now + 6000);
    f.send({ type: 'FINISH', attemptId: 'disconnect' }, ACTORS.operator, now + 12000);
    assert.equal(f.assessment.attempts[0].status, 'incomplete');
    const evidence = f.assessment.attempts[0].evidence.find((item) => item.type === source);
    assert.equal(evidence.status, 'partial');
    assert.equal(evidence.durationMs, 5000);
    assert.ok(completeness(f.assessment).length);
  });
}

test('abort requires a reason and preserves the attempt beside a later usable attempt', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'START', attemptId: 'abort' });
  assert.throws(() => f.send({ type: 'FINISH', attemptId: 'abort', abort: true, reason: ' ' }), /reason/);
  f.send({ type: 'FINISH', attemptId: 'abort', abort: true, reason: 'Supervised demo stopped' }, ACTORS.operator, now + 5000);
  assert.equal(f.assessment.attempts[0].status, 'aborted');
  f.send({ type: 'START', attemptId: 'repeat' }, ACTORS.operator, now + 6000);
  f.send({ type: 'FINISH', attemptId: 'repeat' }, ACTORS.operator, now + 20000);
  assert.equal(f.assessment.attempts.length, 2);
  assert.equal(completeness(f.assessment).length, 0);
});

test('refresh recovery retains only acknowledged time and preserves saved notes', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'START', attemptId: 'refresh' });
  f.send({ type: 'ATTEMPT_NOTE', attemptId: 'refresh', notes: 'Saved before refresh' });
  f.send({ type: 'HEARTBEAT', attemptId: 'refresh' }, ACTORS.operator, now + 3000);
  const recovered = recoverWorkflow(f.data);
  assert.equal(recovered.assessments[1].attempts[0].durationMs, 3000);
  assert.equal(recovered.assessments[1].attempts[0].status, 'incomplete');
  assert.equal(recovered.assessments[1].attempts[0].notes, 'Saved before refresh');
  assert.equal(f.assessment.attempts[0].status, 'recording');
  assert.deepEqual(recoverWorkflow(recovered), recovered);
});

test('submit, corrections, resubmit, approval and amendment preserve an immutable snapshot', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'START', attemptId: 'review' });
  f.send({ type: 'FINISH', attemptId: 'review' }, ACTORS.operator, now + 10000);
  f.send({ type: 'SUBMIT' });
  assert.throws(() => f.send({ type: 'ATTEMPT_NOTE', attemptId: 'review', notes: 'locked' }), /locked/);
  assert.throws(() => f.send({ type: 'APPROVE' }), /reviewer role/);
  assert.throws(() => f.send({ type: 'REQUEST_CORRECTION', reason: ' ' }, ACTORS.reviewer), /Explain/);
  f.send({ type: 'REQUEST_CORRECTION', reason: 'Clarify the observation' }, ACTORS.reviewer);
  f.send({ type: 'ATTEMPT_NOTE', attemptId: 'review', notes: 'Clarified' });
  f.send({ type: 'SUBMIT' });
  f.send({ type: 'REVIEW_NOTE', note: 'Reviewed synthetic evidence' }, ACTORS.reviewer);
  f.send({ type: 'APPROVE' }, ACTORS.reviewer);
  const original = structuredClone(f.assessment.revisions[0]);
  assert.equal(original.reviewer, 'Demo clinical reviewer');
  f.send({ type: 'AMEND' });
  f.send({ type: 'ATTEMPT_NOTE', attemptId: 'review', notes: 'Amended observation' });
  assert.deepEqual(f.assessment.revisions[0], original);
  assert.equal(f.assessment.revision, 2);
  assert.equal(f.assessment.reviewStatus, 'draft');
});

test('unusable evidence blocks submission and reviewer cannot record or create participants', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'START', attemptId: 'invalid' });
  f.send({ type: 'FINISH', attemptId: 'invalid' }, ACTORS.operator, now + 10000);
  f.send({ type: 'INVALIDATE', attemptId: 'invalid', reason: 'Wrong setup in this synthetic attempt' });
  assert.throws(() => f.send({ type: 'SUBMIT' }), /usable attempt/);
  assert.throws(() => f.send({ type: 'START' }, ACTORS.reviewer), /operator role/);
  assert.throws(() => f.send({ type: 'ADD_PARTICIPANT', code: 'x', name: '' }, ACTORS.reviewer), /operator/);
});

test('unverified alignment stays explicit and pressure samples are deterministic', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'SCENARIO', value: 'unverified-sync' });
  f.send({ type: 'START', attemptId: 'sync' });
  assert.equal(f.assessment.attempts[0].alignment, 'unverified');
  assert.deepEqual(pressureFrame(4), pressureFrame(4));
  assert.equal(pressureFrame(4).length, 1024);
  assert.ok(pressureFrame(4).every((value) => value >= 0 && value <= 1));
});

test('storage failure is observable and retries preserve IDs without duplicating attempts', () => {
  const f = fixture();
  f.prepare();
  f.send({ type: 'SCENARIO', value: 'save-failure' });
  f.send({ type: 'START', attemptId: 'save' });
  f.send({ type: 'FINISH', attemptId: 'save' }, ACTORS.operator, now + 10000);
  assert.throws(() => saveWorkflow({ setItem: () => { throw new Error('Quota exceeded'); } }, f.data), /Quota/);
  const storage = memoryStorage();
  saveWorkflow(storage, f.data);
  saveWorkflow(storage, f.data);
  assert.equal(loadWorkflow(storage).assessments[1].attempts.length, 1);
  assert.equal(loadWorkflow(storage).assessments[1].attempts[0].id, 'save');
});

test('corrupt and unsupported storage is never silently replaced', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, '{broken');
  assert.throws(() => loadWorkflow(storage));
  assert.equal(storage.getItem(STORAGE_KEY), '{broken');
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 999 }));
  assert.throws(() => loadWorkflow(storage), /unsupported/);
  const malformed = seedWorkflow(now);
  malformed.assessments[0].attempts[0].evidence = [];
  storage.setItem(STORAGE_KEY, JSON.stringify(malformed));
  assert.throws(() => loadWorkflow(storage), /unreadable evidence/);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).assessments[0].attempts[0].evidence.length, 0);
});
