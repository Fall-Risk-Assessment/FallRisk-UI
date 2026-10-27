import { ArrowRight, Camera, CheckCircle2, Circle, Clock3, Flag, Footprints, History, Play, Plus, Save, Square, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Modal } from '../components/common/Modal';
import { CHECKLIST, completeness, isEditable, SCENARIOS } from '../services/workflowStore';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { Badge, Empty, Heading, Missing } from '../components/staffWorkspace';
import { useWorkflow } from '../hooks/useWorkflow';
import { dateTime, duration } from '../utils/assessmentFormat';

function ParticipantBar({ assessment }) {
  const { data } = useWorkflow();
  const participant = data.participants.find((item) => item.id === assessment.participantId);
  return <section className="ws-context-card"><span className="ws-avatar">{participant.code.slice(-2)}</span><div><Link to={`/staff/participants/${participant.id}`}><strong>{participant.name || participant.code}</strong></Link><p>{participant.code} · {assessment.protocol.code} · {assessment.protocol.version} · Revision {assessment.revision}</p></div><div className="ws-context-end"><Badge status={assessment.reviewStatus} /><small>Draft protocol awaiting clinical review</small></div></section>;
}

function Preparation({ assessment, disabled = false }) {
  const { data, act } = useWorkflow();
  return <section className="ws-card ws-preparation"><div className="ws-section-heading"><div><h2>เตรียมก่อนบันทึก</h2><p>Demo preparation checklist · Not an approved clinical protocol</p></div><span className="ws-step-count">01 / 03</span></div><div className="ws-prep-grid"><div className="ws-checklist">{CHECKLIST.map((item) => <label key={item.id}><input type="checkbox" checked={Boolean(assessment.checklist[item.id])} disabled={disabled} onChange={(event) => act({ type: 'CHECK', assessmentId: assessment.id, key: item.id, value: event.target.checked })} /><span><strong>{item.th}</strong><small>{item.en}</small></span></label>)}</div><div className="ws-selected-sources">{['camera', 'mat'].map((type) => {
    const device = data.devices.find((item) => item.id === assessment.devices[type]);
    const Icon = type === 'camera' ? Camera : Footprints;
    return <div key={type}><Icon size={19} /><label><span className="sr-only">{type === 'camera' ? 'Select demo camera' : 'Select demo pressure mat'}</span><select aria-label={type === 'camera' ? 'Select demo camera' : 'Select demo pressure mat'} value={assessment.devices[type]} disabled={disabled} onChange={(event) => act({ type: 'ASSIGN_DEVICE', assessmentId: assessment.id, source: type, deviceId: event.target.value })}><option value="">{type === 'camera' ? 'เลือกกล้อง / Select camera' : 'เลือกแผ่นรอง / Select mat'}</option>{data.devices.filter((item) => item.type === type).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><small>{device ? `Assigned source · ${device.id}` : 'Select a simulated evidence source'}</small></label><Badge status={device?.status || 'unselected'} /></div>;
  })}<Link to="/staff/devices" className="ws-text-link">ตรวจความพร้อม / Device readiness <ArrowRight size={14} /></Link></div></div></section>;
}

function AttemptNotes({ assessment, attempt, readOnly = false }) {
  const { act } = useWorkflow();
  const [notes, setNotes] = useState(attempt.notes);
  const [timing, setTiming] = useState(attempt.manualDurationSeconds ?? '');
  const dirty = notes !== attempt.notes || String(timing) !== String(attempt.manualDurationSeconds ?? '');
  const save = () => { if (dirty && !readOnly) act({ type: 'ATTEMPT_NOTE', assessmentId: assessment.id, attemptId: attempt.id, notes, ...(attempt.status !== 'recording' ? { manualDurationSeconds: timing } : {}) }); };
  return <section className="ws-card"><div className="ws-section-heading"><div><h2>ข้อสังเกตของผู้ดำเนินการ</h2><p>Manual observations · No automated interpretation</p></div></div><div className="ws-form"><label>บันทึกข้อสังเกต / Observations<textarea rows={3} maxLength={4000} value={notes} readOnly={readOnly} onChange={(event) => setNotes(event.target.value)} onBlur={save} placeholder="Add an observation for the reviewer…" /></label>{attempt.status !== 'recording' && <label>เวลาทางคลินิกที่กรอกเอง / Manual clinical timing (seconds, optional)<input type="number" min="0.01" step="any" value={timing} readOnly={readOnly} onChange={(event) => setTiming(event.target.value)} onBlur={save} /><small className="ws-muted">Entered by staff. Separate from recording duration; timing rules await clinical approval.</small></label>}{!readOnly && <div className="ws-actions"><span className="ws-muted" role="status">{dirty ? 'Unsaved observation · Save or leave the field to store it.' : 'Observations match the local record.'}</span><button className="ws-button secondary" onClick={save} disabled={!dirty}><Save size={16} />บันทึกข้อสังเกต / Save observations</button></div>}</div></section>;
}

export function RecordingPage() {
  const { assessmentId } = useParams();
  const { data, role, act, storageError } = useWorkflow();
  const assessment = data.assessments.find((item) => item.id === assessmentId);
  const active = assessment?.attempts.find((item) => item.status === 'recording');
  const [now, setNow] = useState(Date.now);
  const [marker, setMarker] = useState('');
  const [abortOpen, setAbortOpen] = useState(false);
  const [reason, setReason] = useState('');
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [active]);
  if (!assessment) return <Missing entity="Assessment" />;
  const canEdit = role === 'operator' && isEditable(assessment);
  const latest = active || assessment.attempts.at(-1);
  const elapsedMs = active ? Math.max(0, now - new Date(active.startedAt).getTime()) : 0;
  const sourcesReady = ['camera', 'mat'].every((type) => data.devices.some((item) => item.id === assessment.devices[type] && item.type === type && item.status === 'ready'));
  const ready = CHECKLIST.every(({ id }) => assessment.checklist[id]) && sourcesReady;
  const addMarker = (event) => { event.preventDefault(); if (act({ type: 'MARKER', assessmentId, attemptId: active.id, label: marker }).ok) setMarker(''); };
  const finish = (abort = false) => {
    const result = act({ type: 'FINISH', assessmentId, attemptId: active.id, abort, reason });
    if (result.ok) { setAbortOpen(false); setReason(''); }
  };
  return <div className="ws-page"><Link className="ws-back" to={`/staff/assessments/${assessment.id}`}>← รายละเอียดการประเมิน / Assessment record</Link><Heading eyebrow="STEP 02 · RECORD EACH ATTEMPT" th="บันทึกการประเมิน TUG" en="Supervised recording · simulated sources"><Link className="ws-button secondary" to={`/staff/assessments/${assessment.id}`}>ตรวจหลักฐาน / Review evidence <ArrowRight size={16} /></Link></Heading><ParticipantBar assessment={assessment} />
    {!canEdit && <div className="ws-info"><TriangleAlert size={19} /><p>This revision is read-only for this role or review state. Use the operator role on a draft, or create an amendment after approval.</p></div>}
    {!active && <Preparation assessment={assessment} disabled={!canEdit || Boolean(storageError)} />}
    <section className={`ws-recording-controls ${active ? 'is-recording' : ''}`}><div><span className="ws-eyebrow">{active ? 'SIMULATED CAPTURE IN PROGRESS' : 'READY FOR ANOTHER ATTEMPT'}</span><div className="ws-recording-time">{active && <span className="ws-live-dot" />}<strong>{active ? duration(elapsedMs) : duration(latest?.durationMs)}</strong><span>ระยะเวลาบันทึก<br />Recording duration</span></div></div><div className="ws-recording-actions">{active ? <><button className="ws-button secondary" onClick={() => setAbortOpen(true)} disabled={Boolean(storageError)}><X size={17} />ยุติ / Abort</button><button className="ws-button" onClick={() => finish()} disabled={Boolean(storageError)}><Square size={16} fill="currentColor" />หยุดและเก็บหลักฐาน / Stop attempt</button></> : <><label className="ws-scenario-label">สถานการณ์จำลอง / Demo scenario<select value={assessment.scenario} disabled={!canEdit || Boolean(storageError)} onChange={(event) => act({ type: 'SCENARIO', assessmentId, value: event.target.value })}>{Object.entries(SCENARIOS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><button className="ws-button" disabled={!canEdit || !ready || Boolean(storageError)} onClick={() => act({ type: 'START', assessmentId })}><Play size={17} fill="currentColor" />{assessment.attempts.length ? 'บันทึกครั้งใหม่ / New attempt' : 'เริ่มบันทึก / Start attempt'}</button></>}</div></section>
    {!active && !ready && <p className="ws-inline-warning"><TriangleAlert size={16} />Complete all preparation checks and make both demo sources ready before starting.</p>}
    {latest ? <><div className="ws-attempt-caption"><strong>Attempt {assessment.attempts.findIndex((item) => item.id === latest.id) + 1}</strong><Badge status={latest.status} /><span className="ws-muted">{latest.id.slice(0, 12)}</span></div><EvidenceViewer key={latest.id} attempt={latest} live={Boolean(active)} elapsedMs={elapsedMs} />{active && <form className="ws-marker-form" onSubmit={addMarker}><Flag size={20} /><label><span className="sr-only">Event marker label</span><input value={marker} maxLength={200} onChange={(event) => setMarker(event.target.value)} placeholder="ระบุจุดสังเกต / Name an observation marker" required /></label><button className="ws-button secondary" disabled={Boolean(storageError)}><Plus size={17} />เพิ่มจุดสังเกต / Add marker</button><span>{active.markers.length} markers</span></form>}{latest.reason && <div className="ws-info warning"><TriangleAlert size={19} /><p>{latest.reason}</p></div>}<AttemptNotes key={`notes-${latest.id}`} assessment={assessment} attempt={latest} readOnly={!canEdit || Boolean(storageError)} /><div className="ws-card"><h3>จุดสังเกต / Event markers</h3>{latest.markers.length ? latest.markers.map((item) => <div className="ws-marker-row" key={item.id}><Flag size={15} /><strong>{duration(item.offsetMs)}</strong><span>{item.label}</span></div>) : <p className="ws-muted">No manual markers recorded.</p>}</div></> : <section className="ws-card"><Empty title="พร้อมเมื่อคุณพร้อม / Ready when you are">Confirm the checklist, choose a scenario and start the first simulated attempt.</Empty></section>}
    <Modal isOpen={abortOpen} onClose={() => setAbortOpen(false)} title="ยุติการบันทึก / Abort attempt"><form className="ws-form" onSubmit={(event) => { event.preventDefault(); finish(true); }}><p>Available evidence will be preserved and this attempt will remain marked aborted.</p><label>เหตุผล / Reason<textarea required value={reason} onChange={(event) => setReason(event.target.value)} rows={3} /></label><button className="ws-button danger" disabled={!reason.trim()}>ยุติและเก็บข้อมูลบางส่วน / Preserve & abort</button></form></Modal>
  </div>;
}

function ReviewActions({ assessment }) {
  const { role, act, storageError } = useWorkflow();
  const [note, setNote] = useState(assessment.reviewNote);
  const [dialog, setDialog] = useState('');
  const [reason, setReason] = useState('');
  const missing = completeness(assessment);
  const saveNote = () => { if (note !== assessment.reviewNote) return act({ type: 'REVIEW_NOTE', assessmentId: assessment.id, note }).ok; return true; };
  const confirm = (event) => {
    event.preventDefault();
    if (role === 'reviewer' && !saveNote()) return;
    const result = act({ type: dialog, assessmentId: assessment.id, reason });
    if (result.ok) { setDialog(''); setReason(''); }
  };
  return <section className="ws-card ws-review-actions"><div className="ws-section-heading"><div><h2>ความครบถ้วนและการทบทวน</h2><p>Evidence completeness & clinical review</p></div><ClipboardStatus complete={!missing.length} /></div><ul className="ws-completeness">{missing.length ? missing.map((item) => <li key={item}><TriangleAlert size={16} />{item}</li>) : <li><CheckCircle2 size={17} />Demo checklist complete · At least one usable attempt contains both sources.</li>}</ul>
    {role === 'operator' && isEditable(assessment) && <div className="ws-actions"><Link className="ws-button secondary" to={`/staff/assessments/${assessment.id}/record`}><Plus size={17} />เตรียม / บันทึกเพิ่ม</Link><button className="ws-button" disabled={missing.length > 0 || Boolean(storageError)} onClick={() => setDialog('SUBMIT')}>ส่งทบทวน / Submit for review <ArrowRight size={16} /></button></div>}
    {role === 'operator' && assessment.reviewStatus === 'approved' && <button className="ws-button secondary" disabled={Boolean(storageError)} onClick={() => setDialog('AMEND')}>สร้างฉบับแก้ไข / Create amendment</button>}
    {role === 'reviewer' && assessment.reviewStatus === 'pending_review' && <><label className="ws-field">ข้อสังเกตผู้ทบทวน / Reviewer observations<textarea rows={3} value={note} maxLength={4000} onChange={(event) => setNote(event.target.value)} onBlur={saveNote} /></label><div className="ws-actions"><button className="ws-button secondary" disabled={Boolean(storageError)} onClick={() => setDialog('REQUEST_CORRECTION')}>ขอแก้ไข / Request correction</button><button className="ws-button" disabled={missing.length > 0 || Boolean(storageError)} onClick={() => setDialog('APPROVE')}><CheckCircle2 size={17} />รับรองฉบับสาธิต / Approve demo revision</button></div></>}
    {assessment.reviewNote && !(role === 'reviewer' && assessment.reviewStatus === 'pending_review') && <div className="ws-review-note"><strong>Reviewer observation</strong><p>{assessment.reviewNote}</p></div>}
    <p className="ws-small-note">Demo approval records a review decision. It does not establish clinical validity, hardware accuracy or permission to use training data.</p>
    <Modal isOpen={Boolean(dialog)} onClose={() => setDialog('')} title={{ SUBMIT: 'ส่งทบทวน / Submit for review', AMEND: 'สร้างฉบับแก้ไข / Create amendment', REQUEST_CORRECTION: 'ขอแก้ไข / Request correction', APPROVE: 'รับรองฉบับสาธิต / Approve demo revision' }[dialog] || 'Confirm'}><form className="ws-form" onSubmit={confirm}><p>{dialog === 'AMEND' ? 'The approved snapshot remains unchanged. A new draft revision will be created.' : dialog === 'APPROVE' ? 'This saves your reviewer identity, time and a snapshot of this demo revision.' : dialog === 'SUBMIT' ? 'This revision becomes read-only until a reviewer requests corrections.' : 'The operator will see this explanation and can update the draft.'}</p>{dialog === 'REQUEST_CORRECTION' && <label>รายการที่ต้องแก้ไข / Correction needed<textarea required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} /></label>}<div className="ws-actions"><button type="button" className="ws-button secondary" onClick={() => setDialog('')}>Cancel</button><button type="submit" className="ws-button">ยืนยัน / Confirm</button></div></form></Modal>
  </section>;
}

function ClipboardStatus({ complete }) {
  return complete ? <span className="ws-complete-icon"><CheckCircle2 size={22} /></span> : <TriangleAlert size={22} className="text-warning" />;
}

export function AssessmentDetail() {
  const { assessmentId } = useParams();
  const { data, role, act, storageError } = useWorkflow();
  const assessment = data.assessments.find((item) => item.id === assessmentId);
  const [attemptId, setAttemptId] = useState(null);
  const [seek, setSeek] = useState(0);
  const [invalidOpen, setInvalidOpen] = useState(false);
  const [invalidReason, setInvalidReason] = useState('');
  const [revisionNumber, setRevisionNumber] = useState('current');
  if (!assessment) return <Missing entity="Assessment" />;
  const historical = revisionNumber !== 'current';
  const revision = historical ? assessment.revisions.find((item) => String(item.number) === revisionNumber) : null;
  const view = revision ? { ...assessment, ...revision.snapshot, revision: revision.number, reviewStatus: 'approved' } : assessment;
  const attempt = view.attempts.find((item) => item.id === attemptId) || view.attempts.at(-1);
  const canEdit = !historical && role === 'operator' && isEditable(assessment) && !storageError;
  const correction = [...assessment.history].reverse().find((item) => item.action === 'Requested corrections');
  return <div className="ws-page"><Link className="ws-back" to="/staff">← งานประเมิน / Workspace</Link><Heading eyebrow="STEP 03 · CHECK EVIDENCE & REVIEW" th="บันทึกการประเมิน" en={`TUG assessment · ${assessment.id.slice(0, 16)}`}><Badge status={view.reviewStatus} /></Heading><ParticipantBar assessment={view} />{assessment.reviewStatus === 'changes_requested' && correction && <div className="ws-info warning"><TriangleAlert size={20} /><div><strong>ขอแก้ไข / Correction requested</strong><p>{correction.detail}</p></div></div>}
    {assessment.revisions.length > 0 && <label className="ws-revision-select">ฉบับบันทึก / Revision<select value={revisionNumber} onChange={(event) => { setRevisionNumber(event.target.value); setAttemptId(null); setSeek(0); }}><option value="current">Current revision {assessment.revision}</option>{assessment.revisions.map((item) => <option key={item.number} value={String(item.number)}>Approved snapshot r{item.number} · {item.reviewer} · {dateTime(item.approvedAt)}</option>)}</select>{historical && <span className="ws-muted">Preserved approval snapshot · Read-only</span>}</label>}
    <section className="ws-card"><div className="ws-section-heading"><div><h2>ครั้งทดลองและหลักฐาน</h2><p>All attempts are retained, including unsuccessful recordings.</p></div><span className="ws-subtle-count">{view.attempts.length} attempts</span></div><div className="ws-attempt-tabs">{view.attempts.map((item, index) => <button key={item.id} className={attempt?.id === item.id ? 'active' : ''} onClick={() => { setAttemptId(item.id); setSeek(0); }}><strong>Attempt {index + 1}</strong><Badge status={item.status} /><small>{duration(item.durationMs)} · {item.usable ? 'Usable demo evidence' : 'Incomplete / unusable'}</small></button>)}</div>{!attempt && <Empty title="ยังไม่มีครั้งทดลอง / No attempts recorded">Prepare the sources and record a first attempt.</Empty>}</section>
    {attempt && <><div className="ws-attempt-caption"><Badge status={attempt.status} /><span>{attempt.usable ? 'Usable demo evidence' : 'Not a usable completed attempt'}</span><span className="ws-muted">Recording duration {duration(attempt.durationMs)} · Manual clinical timing: {attempt.manualDurationSeconds === null ? 'Not entered' : `${attempt.manualDurationSeconds} s`}</span></div>{attempt.reason && <div className="ws-info warning"><TriangleAlert size={18} /><p>{attempt.reason}</p></div>}<EvidenceViewer key={`${attempt.id}-${revisionNumber}`} attempt={attempt} seek={seek} onSeek={setSeek} /><div className="ws-review-grid"><section className="ws-card"><div className="ws-section-heading"><div><h2>จุดสังเกต</h2><p>Manual event markers · Select to seek available evidence</p></div><Flag size={19} /></div>{attempt.markers.length ? attempt.markers.map((item) => <button className="ws-marker-row interactive" key={item.id} onClick={() => setSeek(item.offsetMs)}><span className="ws-marker-time">{duration(item.offsetMs)}</span><span>{item.label}<small>{item.author}</small></span><Play size={15} /></button>) : <p className="ws-muted">No event markers recorded.</p>}{attempt.alignment === 'unverified' && <p className="ws-small-note">Markers seek the illustrated camera. Review pressure separately; source alignment is unverified.</p>}</section><section className="ws-card"><h2>ข้อมูลแหล่งหลักฐาน</h2><p className="ws-muted">Evidence provenance</p><dl className="ws-definition"><div><dt>Attempt ID</dt><dd className="ws-break">{attempt.id}</dd></div>{attempt.evidence.map((source) => <div key={source.id}><dt>{source.type === 'camera' ? 'Camera' : 'Pressure'} reference</dt><dd className="ws-break">{source.id}<small>{source.deviceId} · {duration(source.durationMs)} available</small></dd></div>)}<div><dt>Origin</dt><dd>Deterministically generated demo evidence</dd></div></dl></section></div><AttemptNotes key={`notes-${attempt.id}-${revisionNumber}`} assessment={assessment} attempt={attempt} readOnly={!canEdit} />{canEdit && attempt.usable && <button className="ws-text-link text-warning" onClick={() => setInvalidOpen(true)}>ทำเครื่องหมายใช้ไม่ได้ / Mark attempt unusable</button>}</>}
    {!historical && <ReviewActions key={`${assessment.id}-${assessment.revision}-${assessment.reviewStatus}`} assessment={assessment} />}
    <section className="ws-card"><div className="ws-section-heading"><div><h2>ประวัติการเปลี่ยนแปลง</h2><p>Authorship, corrections and review history</p></div><History size={20} /></div><ol className="ws-history">{[...view.history].reverse().map((item) => <li key={item.id}><Circle size={10} /><div><strong>{item.action}</strong><span>{item.actor} · {dateTime(item.at)}</span>{item.detail && <p>{item.detail}</p>}</div></li>)}</ol></section>
    <Modal isOpen={invalidOpen} onClose={() => setInvalidOpen(false)} title="ทำเครื่องหมายใช้ไม่ได้ / Mark attempt unusable"><form className="ws-form" onSubmit={(event) => { event.preventDefault(); if (act({ type: 'INVALIDATE', assessmentId, attemptId: attempt.id, reason: invalidReason }).ok) { setInvalidOpen(false); setInvalidReason(''); } }}><p>The attempt and evidence remain in the record. It will no longer satisfy submission completeness.</p><label>เหตุผล / Reason<textarea required rows={3} value={invalidReason} onChange={(event) => setInvalidReason(event.target.value)} /></label><button className="ws-button danger">Preserve & mark unusable</button></form></Modal>
  </div>;
}
