import { ArrowRight, Camera, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Clock3, FilePenLine, Footprints, Search, TriangleAlert, Users } from 'lucide-react';
import { createElement, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Modal } from '../components/common/Modal';
import { PROTOCOL } from '../services/workflowStore';
import { AssessmentTable, Badge, Empty, Heading, Missing, NewAssessmentLink } from '../components/staffWorkspace';
import { useWorkflow } from '../hooks/useWorkflow';
import { dateTime } from '../utils/assessmentFormat';

export function Workspace({ reviewOnly = false }) {
  const { data, role } = useWorkflow();
  const [filter, setFilter] = useState(reviewOnly ? 'pending_review' : 'all');
  const counts = {
    draft: data.assessments.filter((item) => item.reviewStatus === 'draft').length,
    interrupted: data.assessments.filter((item) => item.attempts.some((attempt) => ['incomplete', 'aborted'].includes(attempt.status))).length,
    pending_review: data.assessments.filter((item) => item.reviewStatus === 'pending_review').length,
    changes_requested: data.assessments.filter((item) => item.reviewStatus === 'changes_requested').length,
  };
  const cards = [
    ['draft', 'แบบร่าง', 'Draft assessments', FilePenLine, 'neutral'], ['interrupted', 'การบันทึกไม่ครบ', 'Interrupted evidence', TriangleAlert, 'warning'],
    ['pending_review', 'รอทบทวน', 'Awaiting clinical review', ClipboardCheck, 'rose'], ['changes_requested', 'รอแก้ไข', 'Corrections requested', Clock3, 'blue'],
  ];
  const assessments = [...data.assessments].filter((item) => filter === 'all' || (filter === 'interrupted' ? item.attempts.some((attempt) => ['incomplete', 'aborted'].includes(attempt.status)) : item.reviewStatus === filter)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return <div className="ws-page"><Heading eyebrow={reviewOnly ? 'EVIDENCE BEFORE INTERPRETATION' : 'FROM PREPARATION TO REVIEW'} th={reviewOnly ? 'ทบทวนการประเมิน' : 'งานประเมินของทีม'} en={reviewOnly ? 'Clinical review queue' : 'Assessment workspace'}>{role === 'operator' && <NewAssessmentLink />}</Heading>
    {!reviewOnly && <section className="ws-welcome"><div><span className="ws-eyebrow">TUG · SUPERVISED WORKFLOW</span><h2>บันทึกครบ ทบทวนได้ง่ายขึ้น</h2><p>Keep each attempt, observation and source together.<br />เริ่มจากผู้เข้าร่วม แล้วเตรียมการบันทึกครั้งถัดไป</p><Link className="ws-text-link" to="/staff/participants">เปิดรายชื่อผู้เข้าร่วม / Find a participant <ArrowRight size={16} /></Link></div><div className="ws-welcome-steps"><div><span>01</span><p>เตรียม<strong>Prepare</strong></p></div><ChevronRight size={18} /><div><span>02</span><p>บันทึก<strong>Record</strong></p></div><ChevronRight size={18} /><div><span>03</span><p>ทบทวน<strong>Review</strong></p></div></div></section>}
    <section className="ws-stat-grid" aria-label="Workflow counts">{cards.map(([key, th, en, Icon, tone]) => <button className={`ws-stat-card ${filter === key ? 'selected' : ''}`} key={key} onClick={() => setFilter(key)} aria-pressed={filter === key}><div className="ws-stat-top"><span className={`ws-stat-icon ${tone}`}>{createElement(Icon, { size: 19 })}</span><ArrowRight size={15} /></div><strong className="ws-stat-number">{counts[key]}</strong><span>{th}</span><small>{en}</small></button>)}</section>
    <section className="ws-card ws-worklist"><div className="ws-section-heading"><div><h2>{reviewOnly ? 'รายการสำหรับทบทวน' : 'รายการประเมิน'}</h2><p>{reviewOnly ? 'Inspect evidence and record a traceable decision.' : 'Records linked to participants. No generated scores or risk classifications.'}</p></div><span className="ws-subtle-count">{assessments.length} records</span></div><div className="ws-filter-tabs" role="group" aria-label="Filter assessments">{[['all', 'ทั้งหมด / All'], ['draft', 'แบบร่าง / Draft'], ['pending_review', 'รอทบทวน / Review'], ['changes_requested', 'รอแก้ไข / Corrections'], ['approved', 'ทบทวนแล้ว / Approved']].map(([value, label]) => <button key={value} aria-pressed={filter === value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><AssessmentTable assessments={assessments} /></section>
    <div className="ws-bottom-note"><CircleHelp size={16} /><span>Completeness, recording status and clinical review are separate. A demo approval does not validate a clinical result.</span></div>
  </div>;
}

export function Participants() {
  const { data, role, act } = useWorkflow();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const participants = data.participants.filter((item) => `${item.code} ${item.name}`.toLowerCase().includes(query.toLowerCase()));
  const create = (event) => {
    event.preventDefault();
    const result = act({ type: 'ADD_PARTICIPANT', code, name });
    if (result.ok) { setOpen(false); setCode(''); setName(''); navigate(`/staff/participants/${result.id}`); }
  };
  return <div className="ws-page"><Heading eyebrow="THE RIGHT PERSON, THE RIGHT RECORD" th="ผู้เข้าร่วมการประเมิน" en="Participant directory">{role === 'operator' && <button className="ws-button" onClick={() => setOpen(true)}><Users size={17} />เพิ่มผู้เข้าร่วม / Add participant</button>}</Heading><section className="ws-card"><div className="ws-section-heading"><label className="ws-search"><Search size={18} /><span className="sr-only">Search participants</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหารหัสหรือชื่อ / Search code or name" /></label><span className="ws-muted">{participants.length} participants</span></div><div className="ws-participant-grid">{participants.map((participant) => {
    const assessments = data.assessments.filter((item) => item.participantId === participant.id);
    return <Link to={`/staff/participants/${participant.id}`} className="ws-participant-card" key={participant.id}><div className="ws-participant-top"><span className="ws-avatar">{participant.code.slice(-2)}</span><span className="ws-eyebrow">SYNTHETIC PARTICIPANT</span><ArrowRight size={18} /></div><h2>{participant.name || participant.code}</h2><p>{participant.code}</p><div className="ws-participant-footer"><span>{assessments.length} การประเมิน / assessments</span><span>เปิดประวัติ / Open history</span></div></Link>;
  })}</div>{!participants.length && <Empty title="ไม่พบผู้เข้าร่วม / No participants found">Try a different code or create a synthetic participant.</Empty>}</section><Modal isOpen={open} onClose={() => setOpen(false)} title="เพิ่มผู้เข้าร่วมตัวอย่าง / Add participant"><form className="ws-form" onSubmit={create}><p className="ws-muted">Use synthetic information only. A participant reference is separate from a staff account.</p><label>รหัสผู้เข้าร่วม / Participant code<input required maxLength={40} value={code} onChange={(event) => setCode(event.target.value)} placeholder="e.g. DEMO-005" autoComplete="off" /></label><label>ชื่อแสดงผล / Display name <span className="ws-muted">(optional)</span><input maxLength={100} value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" /></label><div className="ws-actions"><button type="button" className="ws-button secondary" onClick={() => setOpen(false)}>Cancel</button><button className="ws-button" type="submit">สร้างผู้เข้าร่วม / Create participant</button></div></form></Modal></div>;
}

export function ParticipantDetail() {
  const { participantId } = useParams();
  const { data, role } = useWorkflow();
  const participant = data.participants.find((item) => item.id === participantId);
  if (!participant) return <Missing entity="Participant" />;
  const assessments = data.assessments.filter((item) => item.participantId === participantId);
  return <div className="ws-page"><Link className="ws-back" to="/staff/participants">← ผู้เข้าร่วม / Participants</Link><Heading th={participant.name || participant.code} en={participant.code} eyebrow="SYNTHETIC PARTICIPANT">{role === 'operator' && <NewAssessmentLink participantId={participant.id} />}</Heading><section className="ws-context-card"><span className="ws-avatar">{participant.code.slice(-2)}</span><div><strong>Participant reference</strong><p>{participant.code} · Created {dateTime(participant.createdAt)}</p></div><div className="ws-context-end">{assessments.length}<small>linked assessments</small></div></section><section className="ws-card"><div className="ws-section-heading"><div><h2>ประวัติการประเมิน</h2><p>Assessment history · Evidence remains linked to this participant.</p></div></div><AssessmentTable assessments={assessments} /></section></div>;
}

export function NewAssessment() {
  const { data, role, act } = useWorkflow();
  const [params] = useSearchParams();
  const [participantId, setParticipantId] = useState(params.get('participantId') || '');
  const navigate = useNavigate();
  if (params.get('participantId') && !data.participants.some((item) => item.id === params.get('participantId'))) return <Missing entity="Participant" />;
  if (role !== 'operator') return <div className="ws-card"><Empty title="Operator workflow">Choose the demo operator role to prepare an assessment.</Empty></div>;
  const create = (event) => {
    event.preventDefault();
    const result = act({ type: 'CREATE_ASSESSMENT', participantId });
    if (result.ok) navigate(`/staff/assessments/${result.id}/record`);
  };
  return <div className="ws-page"><Link className="ws-back" to="/staff">← งานประเมิน / Workspace</Link><Heading eyebrow="STEP 01 · SELECT & PREPARE" th="เริ่มการประเมิน TUG" en="Prepare a new assessment" /><div className="ws-setup-grid"><section className="ws-card"><div className="ws-section-heading"><div><h2>เลือกผู้เข้าร่วม</h2><p>Confirm the participant before creating a linked record.</p></div><Users size={22} /></div><form className="ws-form" onSubmit={create}><label>ผู้เข้าร่วม / Participant<select required value={participantId} onChange={(event) => setParticipantId(event.target.value)}><option value="">เลือกผู้เข้าร่วม / Select a participant</option>{data.participants.map((item) => <option key={item.id} value={item.id}>{item.code} · {item.name || 'Unnamed synthetic participant'}</option>)}</select></label><div className="ws-info"><ClipboardCheck size={20} /><div><strong>{PROTOCOL.name} · {PROTOCOL.version}</strong><p>Draft protocol awaiting clinical review. This checklist demonstrates preparation; it is not an approved clinical protocol.</p></div></div><button className="ws-button" disabled={!participantId}>สร้างแบบร่างและเตรียมอุปกรณ์ / Prepare recording <ArrowRight size={17} /></button></form></section><aside className="ws-card ws-setup-aside"><span className="ws-eyebrow">WHAT HAPPENS NEXT</span><h2>หนึ่งการประเมิน<br />หลายครั้งทดลองได้</h2><p>One assessment can contain several attempts. Each keeps its own camera reference, pressure evidence, observations and recording status.</p><ol><li>Confirm the preparation checklist</li><li>Record with both simulated sources</li><li>Check evidence and submit for review</li></ol></aside></div></div>;
}

export function Devices() {
  const { data, role, act } = useWorkflow();
  const active = data.assessments.some((item) => item.attempts.some((attempt) => attempt.status === 'recording'));
  return <div className="ws-page"><Heading eyebrow="KNOW WHAT IS AVAILABLE" th="ความพร้อมของอุปกรณ์" en="Device readiness & simulation" /><div className="ws-info"><TriangleAlert size={20} /><div><strong>Demo controls only / การจำลองเท่านั้น</strong><p>These controls do not contact hardware. Readiness and calibration labels are fictional states for testing the interface.</p></div></div><div className="ws-device-grid">{data.devices.map((device) => {
    const Icon = device.type === 'camera' ? Camera : Footprints;
    return <section className="ws-card" key={device.id}><div className="ws-section-heading"><span className="ws-device-icon"><Icon size={26} /></span><Badge status={device.status} /></div><h2>{device.name}</h2><p className="ws-muted">{device.id} · {device.location}</p><dl className="ws-definition"><div><dt>แหล่งข้อมูล / Source</dt><dd>{device.type === 'camera' ? 'Illustrated camera frames' : 'Generated relative pressure samples'}</dd></div><div><dt>การสอบเทียบ / Calibration</dt><dd>Unverified · simulated only</dd></div><div><dt>การเชื่อมต่อจริง / Hardware connection</dt><dd>Not connected in this prototype</dd></div></dl><label className="ws-field">จำลองความพร้อม / Simulate readiness<select value={device.status} disabled={role !== 'operator' || active} onChange={(event) => act({ type: 'DEVICE_STATUS', id: device.id, status: event.target.value })}><option value="ready">Ready · พร้อมจำลอง</option><option value="stale">Stale · สัญญาณค้าง</option><option value="offline">Offline · ไม่เชื่อมต่อ</option><option value="uncalibrated">Calibration needed · ยังไม่พร้อม</option></select></label></section>;
  })}</div><div className="ws-bottom-note"><CheckCircle2 size={17} /><span>Both sources must be ready before a new attempt starts. Disconnect and partial-start scenarios are selected inside recording setup.</span></div></div>;
}
