export const STORAGE_KEY = 'omni.tug-workspace.v1';
export const PROTOCOL = { name: 'Timed Up and Go', code: 'TUG', version: 'demo-0.1', status: 'Draft · awaiting clinical review' };
export const CHECKLIST = [
  { id: 'identity', th: 'ยืนยันผู้เข้าร่วมที่เลือก', en: 'Confirm the selected participant' },
  { id: 'space', th: 'ตรวจพื้นที่และการช่วยเหลือ', en: 'Confirm the supervised demo setup' },
  { id: 'sources', th: 'ตรวจภาพจำลองและแผ่นรอง', en: 'Check both simulated evidence sources' },
];
export const SCENARIOS = {
  success: 'บันทึกปกติ / Successful recording',
  'partial-start': 'แผ่นรองเริ่มไม่สำเร็จ / Partial start',
  'camera-disconnect': 'กล้องหลุดหลัง 5 วินาที / Camera disconnect at 5s',
  'mat-disconnect': 'แผ่นรองหลุดหลัง 5 วินาที / Mat disconnect at 5s',
  'save-failure': 'บันทึกในเบราว์เซอร์ไม่สำเร็จ / Save fails once',
  'unverified-sync': 'ไม่ทราบการตรงกันของเวลา / Unverified alignment',
};
export const ACTORS = {
  operator: { id: 'demo-operator', role: 'operator', name: 'Demo operator' },
  reviewer: { id: 'demo-reviewer', role: 'reviewer', name: 'Demo clinical reviewer' },
};

const uid = () => globalThis.crypto.randomUUID();
const stamp = (now) => new Date(now).toISOString();
const elapsed = (start, end) => Math.max(0, new Date(end).getTime() - new Date(start).getTime());
const clone = (value) => structuredClone(value);
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
const event = (action, actor, at, detail = '') => ({ id: uid(), action, actor: actor.name, actorId: actor.id, at, detail });
export const isEditable = (assessment) => ['draft', 'changes_requested'].includes(assessment.reviewStatus);

export function completeness(assessment) {
  const missing = [];
  if (!CHECKLIST.every(({ id }) => assessment.checklist[id])) missing.push('Preparation checklist is incomplete.');
  if (!assessment.attempts.some((attempt) => attempt.status === 'completed' && attempt.usable && attempt.evidence.length === 2 && attempt.evidence.every((source) => source.status === 'available'))) {
    missing.push('At least one usable attempt needs both camera and pressure evidence.');
  }
  return missing;
}

export function seedWorkflow(now = Date.now()) {
  const at = stamp(now);
  const participants = ['A', 'B', 'C', 'D'].map((letter, index) => ({ id: `participant-${index + 1}`, code: `DEMO-00${index + 1}`, name: `ผู้เข้าร่วมตัวอย่าง ${letter}`, createdAt: at }));
  const makeAttempt = (id, status = 'completed') => ({
    id, startedAt: stamp(now - 18000), endedAt: at, heartbeatAt: at, durationMs: 18000,
    status, usable: status === 'completed', reason: status === 'incomplete' ? 'Browser refreshed during a simulated recording.' : '',
    scenario: 'success', alignment: 'simulated', notes: 'Synthetic example for workflow review. No clinical interpretation.', manualDurationSeconds: null,
    markers: [{ id: `${id}-marker`, label: 'Observation for review / จุดสังเกต', offsetMs: 8000, author: ACTORS.operator.name, at }],
    evidence: ['camera', 'mat'].map((source) => ({ id: `${id}-${source}`, type: source, deviceId: `${source}-01`, status: status === 'completed' ? 'available' : 'partial', durationMs: 18000, startedAt: stamp(now - 18000), endedAt: at })),
  });
  const assessments = participants.map((participant, index) => ({
    id: `assessment-${index + 1}`, participantId: participant.id, protocol: clone(PROTOCOL), createdAt: at, updatedAt: at,
    operator: ACTORS.operator.name, revision: 1, reviewStatus: ['pending_review', 'draft', 'changes_requested', 'draft'][index],
    checklist: { identity: index !== 1, space: index !== 1, sources: index !== 1 },
    devices: { camera: 'camera-01', mat: 'mat-01' }, scenario: 'success', reviewNote: '',
    attempts: index === 1 ? [] : [makeAttempt(`attempt-${index + 1}`, index === 3 ? 'incomplete' : 'completed')],
    history: [event('Created demo assessment', ACTORS.operator, at)], revisions: [],
  }));
  assessments[2].history.push(event('Requested corrections', ACTORS.reviewer, at, 'Please clarify the operator observation before resubmitting.'));
  return { version: 1, participants, assessments, devices: [
    { id: 'camera-01', type: 'camera', name: 'Demo Camera 01', location: 'Demo assessment room', status: 'ready' },
    { id: 'mat-01', type: 'mat', name: 'Demo Pressure Mat 01', location: 'Demo assessment room', status: 'ready' },
  ] };
}

export function recoverWorkflow(data) {
  const next = clone(data);
  next.assessments.forEach((assessment) => assessment.attempts.forEach((attempt) => {
    if (attempt.status !== 'recording') return;
    attempt.status = 'incomplete';
    attempt.usable = false;
    attempt.endedAt = attempt.heartbeatAt || attempt.startedAt;
    attempt.durationMs = elapsed(attempt.startedAt, attempt.endedAt);
    attempt.reason = 'Browser closed or refreshed during recording. Only the last locally saved evidence is retained.';
    attempt.evidence.forEach((source) => {
      if (source.status === 'recording') Object.assign(source, { status: 'partial', endedAt: attempt.endedAt, durationMs: attempt.durationMs });
    });
    assessment.history.push(event('Recovered interrupted recording', ACTORS.operator, attempt.endedAt, attempt.reason));
  }));
  return next;
}

export function loadWorkflow(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return seedWorkflow();
  const data = JSON.parse(raw);
  requireThat(data?.version === 1 && Array.isArray(data.participants) && Array.isArray(data.assessments) && Array.isArray(data.devices), 'This browser has an unreadable or unsupported demo record. Reset explicitly to start again.');
  const ids = new Set(data.participants.map((participant) => participant.id));
  const validHistory = (history) => Array.isArray(history) && history.every((item) => item && ['id', 'action', 'actor', 'at'].every((key) => typeof item[key] === 'string'));
  const validAttempts = (attempts) => Array.isArray(attempts) && attempts.every((attempt) => attempt && typeof attempt.id === 'string' && typeof attempt.notes === 'string' &&
    ['recording', 'completed', 'incomplete', 'aborted', 'failed'].includes(attempt.status) && Number.isFinite(attempt.durationMs) && attempt.durationMs >= 0 &&
    Array.isArray(attempt.markers) && attempt.markers.every((marker) => marker && typeof marker.id === 'string' && typeof marker.label === 'string' && Number.isFinite(marker.offsetMs)) &&
    Array.isArray(attempt.evidence) && attempt.evidence.length === 2 && ['camera', 'mat'].every((type) => attempt.evidence.filter((source) => source?.type === type && typeof source.id === 'string' && typeof source.deviceId === 'string' && Number.isFinite(source.durationMs) && ['recording', 'available', 'failed', 'partial'].includes(source.status)).length === 1));
  requireThat(data.participants.every((participant) => ['id', 'code', 'name'].every((key) => typeof participant[key] === 'string')) && ids.size === data.participants.length, 'The saved participant references are unreadable. Reset explicitly to start again.');
  requireThat(data.devices.every((device) => device && ['camera', 'mat'].includes(device.type) && ['id', 'name', 'location', 'status'].every((key) => typeof device[key] === 'string')), 'The saved source references are unreadable. Reset explicitly to start again.');
  requireThat(data.assessments.every((assessment) => ['id', 'participantId', 'createdAt', 'updatedAt', 'operator'].every((key) => typeof assessment[key] === 'string') && ids.has(assessment.participantId) &&
    ['draft', 'pending_review', 'changes_requested', 'approved'].includes(assessment.reviewStatus) && Number.isInteger(assessment.revision) && validAttempts(assessment.attempts) && validHistory(assessment.history) &&
    assessment.devices && ['camera', 'mat'].every((key) => typeof assessment.devices[key] === 'string') && assessment.checklist && assessment.protocol && typeof assessment.protocol.version === 'string' &&
    Array.isArray(assessment.revisions) && assessment.revisions.every((revision) => revision.snapshot && revision.snapshot.participantId === assessment.participantId && revision.snapshot.protocol && validAttempts(revision.snapshot.attempts) && validHistory(revision.snapshot.history))), 'The saved demo has unreadable evidence or broken assessment links. Reset explicitly to start again.');
  return recoverWorkflow(data);
}

export function saveWorkflow(storage, data) {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ponytail: a small local transition function; replace browser storage when a real capture API is agreed.
export function transition(data, action, actor, now = Date.now()) {
  requireThat(actor && ACTORS[actor.role], 'Choose a demo role first.');
  const next = clone(data);
  const at = stamp(now);
  if (action.type === 'ADD_PARTICIPANT') {
    requireThat(actor.role === 'operator', 'Only the demo operator can create participants.');
    const code = action.code.trim();
    requireThat(code && code.length <= 40, 'Enter a participant code of 1–40 characters.');
    requireThat(!next.participants.some((participant) => participant.code.toLowerCase() === code.toLowerCase()), 'This participant code already exists.');
    const participant = { id: action.id || uid(), code, name: action.name.trim().slice(0, 100), createdAt: at };
    next.participants.push(participant);
    return { data: next, id: participant.id };
  }
  if (action.type === 'DEVICE_STATUS') {
    requireThat(actor.role === 'operator', 'Device simulation controls belong to the operator.');
    requireThat(!next.assessments.some((item) => item.attempts.some((attempt) => attempt.status === 'recording')), 'Finish the active attempt before changing readiness.');
    const device = next.devices.find((item) => item.id === action.id);
    requireThat(device && ['ready', 'stale', 'offline', 'uncalibrated'].includes(action.status), 'Unknown device or readiness state.');
    device.status = action.status;
    return { data: next };
  }
  if (action.type === 'CREATE_ASSESSMENT') {
    requireThat(actor.role === 'operator', 'Only the demo operator can start an assessment.');
    requireThat(next.participants.some((participant) => participant.id === action.participantId), 'Participant not found. Select an existing participant.');
    const assessment = { id: action.id || uid(), participantId: action.participantId, protocol: clone(PROTOCOL), createdAt: at, updatedAt: at, operator: actor.name,
      revision: 1, reviewStatus: 'draft', checklist: {}, devices: { camera: '', mat: '' }, scenario: 'success', attempts: [], reviewNote: '', revisions: [], history: [event('Created assessment', actor, at)] };
    next.assessments.push(assessment);
    return { data: next, id: assessment.id };
  }
  const assessment = next.assessments.find((item) => item.id === action.assessmentId);
  requireThat(assessment, 'Assessment not found. No substitute record has been opened.');
  const reviewerAction = ['REVIEW_NOTE', 'REQUEST_CORRECTION', 'APPROVE'].includes(action.type);
  requireThat(actor.role === (reviewerAction ? 'reviewer' : 'operator'), reviewerAction ? 'Clinical review requires the demo reviewer role.' : 'Recording and editing require the demo operator role.');
  if (reviewerAction) requireThat(assessment.reviewStatus === 'pending_review', 'Only submitted assessments can be reviewed.');
  else if (action.type !== 'AMEND') requireThat(isEditable(assessment), 'This revision is locked. Request corrections or create an amendment.');
  const active = assessment.attempts.find((attempt) => attempt.status === 'recording');
  const attempt = assessment.attempts.find((item) => item.id === action.attemptId);
  switch (action.type) {
    case 'ASSIGN_DEVICE':
      requireThat(!active && ['camera', 'mat'].includes(action.source), 'Select a source before recording.');
      requireThat(action.deviceId === '' || next.devices.some((device) => device.id === action.deviceId && device.type === action.source), 'The device must match the evidence source.');
      assessment.devices[action.source] = action.deviceId;
      assessment.checklist.sources = false;
      break;
    case 'CHECK':
      requireThat(!active && CHECKLIST.some((item) => item.id === action.key), 'Preparation cannot change during recording.');
      assessment.checklist[action.key] = Boolean(action.value);
      break;
    case 'SCENARIO':
      requireThat(!active && Object.hasOwn(SCENARIOS, action.value), 'Choose a valid scenario before recording.');
      assessment.scenario = action.value;
      break;
    case 'START': {
      requireThat(!next.assessments.some((item) => item.attempts.some((entry) => entry.status === 'recording')), 'One attempt is already recording.');
      requireThat(CHECKLIST.every(({ id }) => assessment.checklist[id]), 'Complete the preparation checklist first.');
      requireThat(['camera', 'mat'].every((type) => next.devices.some((device) => device.id === assessment.devices[type] && device.type === type && device.status === 'ready')), 'Both selected demo sources must be ready.');
      const id = action.attemptId || uid();
      requireThat(!assessment.attempts.some((item) => item.id === id), 'This attempt already exists.');
      assessment.attempts.push({ id, startedAt: at, heartbeatAt: at, endedAt: null, durationMs: 0, status: 'recording', usable: false, scenario: assessment.scenario,
        alignment: assessment.scenario === 'unverified-sync' ? 'unverified' : 'simulated', reason: '', notes: '', manualDurationSeconds: null, markers: [],
        evidence: ['camera', 'mat'].map((type) => ({ id: uid(), type, deviceId: assessment.devices[type], startedAt: at, endedAt: null, durationMs: 0, status: assessment.scenario === 'partial-start' && type === 'mat' ? 'failed' : 'recording' })) });
      assessment.history.push(event('Started attempt', actor, at));
      return { data: next, id };
    }
    case 'HEARTBEAT':
    case 'FINISH': {
      requireThat(attempt?.status === 'recording', 'This attempt is no longer recording.');
      attempt.heartbeatAt = at;
      const durationMs = elapsed(attempt.startedAt, at);
      const disconnectedType = { 'camera-disconnect': 'camera', 'mat-disconnect': 'mat' }[attempt.scenario];
      if (disconnectedType && durationMs >= 5000) {
        const source = attempt.evidence.find((item) => item.type === disconnectedType);
        if (source.status === 'recording') Object.assign(source, { status: 'partial', durationMs: 5000, endedAt: stamp(new Date(attempt.startedAt).getTime() + 5000) });
      }
      if (action.type === 'FINISH') {
        requireThat(!action.abort || action.reason?.trim(), 'Enter a reason for aborting the attempt.');
        const allRecording = attempt.evidence.every((source) => source.status === 'recording');
        attempt.status = action.abort ? 'aborted' : allRecording ? 'completed' : 'incomplete';
        attempt.usable = attempt.status === 'completed';
        attempt.reason = action.abort ? action.reason.trim() : allRecording ? '' : 'One source failed to start or disconnected. Available evidence is preserved.';
        attempt.endedAt = at;
        attempt.durationMs = durationMs;
        attempt.evidence.forEach((source) => {
          if (source.status === 'recording') Object.assign(source, { status: action.abort ? 'partial' : 'available', durationMs, endedAt: at });
        });
        assessment.history.push(event(action.abort ? 'Aborted attempt' : 'Finished attempt', actor, at, attempt.reason));
      }
      break;
    }
    case 'MARKER':
      requireThat(attempt?.status === 'recording' && action.label.trim(), 'Enter an observation label during recording.');
      attempt.markers.push({ id: uid(), label: action.label.trim().slice(0, 200), offsetMs: elapsed(attempt.startedAt, at), author: actor.name, at });
      break;
    case 'ATTEMPT_NOTE':
      requireThat(attempt, 'Attempt not found.');
      attempt.notes = action.notes.slice(0, 4000);
      if (action.manualDurationSeconds !== undefined) {
        requireThat(attempt.status !== 'recording', 'Enter clinical timing after recording.');
        const value = action.manualDurationSeconds === '' ? null : Number(action.manualDurationSeconds);
        requireThat(value === null || (Number.isFinite(value) && value > 0), 'Manual clinical timing must be positive, or left empty.');
        attempt.manualDurationSeconds = value;
      }
      assessment.history.push(event('Updated operator observation', actor, at));
      break;
    case 'INVALIDATE':
      requireThat(attempt && attempt.status !== 'recording' && action.reason.trim(), 'A stopped attempt and an explanation are required.');
      attempt.usable = false;
      attempt.reason = action.reason.trim();
      assessment.history.push(event('Marked attempt unusable', actor, at, attempt.reason));
      break;
    case 'SUBMIT':
      requireThat(!active && completeness(assessment).length === 0, completeness(assessment).join(' ') || 'Finish recording first.');
      assessment.reviewStatus = 'pending_review';
      assessment.history.push(event('Submitted for clinical review', actor, at));
      break;
    case 'REVIEW_NOTE':
      assessment.reviewNote = action.note.slice(0, 4000);
      assessment.history.push(event('Updated reviewer observation', actor, at));
      break;
    case 'REQUEST_CORRECTION':
      requireThat(action.reason.trim(), 'Explain the correction needed.');
      assessment.reviewStatus = 'changes_requested';
      assessment.history.push(event('Requested corrections', actor, at, action.reason.trim()));
      break;
    case 'APPROVE':
      requireThat(completeness(assessment).length === 0, 'Incomplete assessments cannot be approved.');
      assessment.reviewStatus = 'approved';
      assessment.history.push(event('Approved demo revision', actor, at));
      assessment.revisions.push({ number: assessment.revision, approvedAt: at, reviewer: actor.name,
        snapshot: clone({ participantId: assessment.participantId, protocol: assessment.protocol, checklist: assessment.checklist, attempts: assessment.attempts, reviewNote: assessment.reviewNote, history: assessment.history }) });
      break;
    case 'AMEND':
      requireThat(assessment.reviewStatus === 'approved', 'Only approved records need an amendment.');
      assessment.revision += 1;
      assessment.reviewStatus = 'draft';
      assessment.reviewNote = '';
      assessment.history.push(event('Created amendment', actor, at));
      break;
    default:
      throw new Error('Unknown workflow action.');
  }
  assessment.updatedAt = at;
  return { data: next };
}

export function pressureFrame(seconds) {
  return Array.from({ length: 1024 }, (_, index) => {
    const x = index % 32;
    const y = Math.floor(index / 32);
    const left = Math.hypot(x - 11 - Math.sin(seconds) * 1.5, y - 17);
    const right = Math.hypot(x - 22, y - 15 - Math.cos(seconds) * 1.5);
    return Math.max(0, 1 - Math.min(left, right) / 7) * (0.7 + Math.sin(seconds / 2) * 0.2);
  });
}
