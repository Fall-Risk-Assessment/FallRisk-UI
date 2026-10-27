import { Activity, ArrowRight, Check, ChevronRight, ClipboardCheck, Database, FlaskConical, LayoutDashboard, LogOut, Monitor, Plus, RotateCcw, Users, X } from 'lucide-react';
import { createElement, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BilingualHeading } from './clinical';
import { Modal } from './common/Modal';
import { completeness } from '../services/workflowStore';
import { useWorkflow } from '../hooks/useWorkflow';
import { dateTime } from '../utils/assessmentFormat';

const statusLabels = {
  draft: ['แบบร่าง', 'Draft', 'neutral'], pending_review: ['รอทบทวน', 'Awaiting review', 'rose'], changes_requested: ['รอแก้ไข', 'Corrections requested', 'warning'], approved: ['ทบทวนแล้ว', 'Demo approved', 'success'],
  recording: ['กำลังบันทึก', 'Recording', 'rose'], completed: ['บันทึกครบ', 'Completed', 'success'], incomplete: ['ไม่ครบถ้วน', 'Incomplete', 'warning'], aborted: ['ยุติการบันทึก', 'Aborted', 'neutral'],
  failed: ['ไม่สำเร็จ', 'Failed', 'danger'], partial: ['มีข้อมูลบางส่วน', 'Partial evidence', 'warning'], available: ['มีหลักฐานจำลอง', 'Available', 'success'], ready: ['พร้อมจำลอง', 'Ready', 'success'], unselected: ['ยังไม่เลือก', 'Not selected', 'neutral'],
  stale: ['สัญญาณค้าง', 'Stale', 'warning'], offline: ['ไม่เชื่อมต่อ', 'Offline', 'danger'], uncalibrated: ['ยังไม่พร้อม', 'Calibration needed', 'warning'],
};

export function Badge({ status, children }) {
  const [th, en, tone] = statusLabels[status] || ['ยังไม่มีข้อมูล', 'Not recorded', 'neutral'];
  return <span className={`ws-badge ${tone}`}><span className="ws-dot" />{children || <>{th}<span className="badge-en">{en}</span></>}</span>;
}

export function Heading({ th, en, children, eyebrow }) {
  return <div className="ws-heading"><div>{eyebrow && <div className="ws-eyebrow">{eyebrow}</div>}<BilingualHeading as="h1" th={th} en={en} /></div><div className="ws-heading-actions">{children}</div></div>;
}

export function Empty({ title, children }) {
  return <div className="ws-empty"><ClipboardCheck size={30} strokeWidth={1.4} /><h3>{title}</h3><p>{children}</p></div>;
}

export function Missing({ entity = 'Record' }) {
  return <div className="ws-page"><Heading th="ไม่พบรายการนี้" en={`${entity} not found`} /><section className="ws-card"><Empty title="No substitute record was opened">ตรวจรหัสหรือลิงก์อีกครั้ง / Check the ID or return to the workspace.</Empty><Link className="ws-button secondary" to="/staff">กลับหน้าหลัก / Workspace</Link></section></div>;
}

export function AssessmentTable({ assessments, empty = 'ยังไม่มีรายการ / No assessments yet' }) {
  const { data } = useWorkflow();
  if (!assessments.length) return <Empty title={empty}>เริ่มจากเลือกผู้เข้าร่วม / Select a participant to begin.</Empty>;
  return <div className="ws-table-wrap"><table className="ws-table"><thead><tr><th>ผู้เข้าร่วม / Participant</th><th>การบันทึก / Evidence</th><th>สถานะทบทวน / Review</th><th>แก้ไขล่าสุด / Updated</th><th><span className="sr-only">Open assessment</span></th></tr></thead><tbody>{assessments.map((assessment) => {
    const participant = data.participants.find((item) => item.id === assessment.participantId);
    const complete = completeness(assessment).length === 0;
    return <tr key={assessment.id}><td><div className="ws-person"><span className="ws-avatar">{participant.code.slice(-2)}</span><span><strong>{participant.name || participant.code}</strong><small>{participant.code} · TUG · r{assessment.revision}</small></span></div></td><td><div className="ws-cell-stack"><strong>{assessment.attempts.length} ครั้ง / attempts</strong><small className={complete ? 'text-success' : ''}>{complete ? 'พร้อมทบทวน / Evidence complete' : 'ยังไม่ครบ / Needs preparation or evidence'}</small></div></td><td><Badge status={assessment.reviewStatus} /></td><td className="ws-muted">{dateTime(assessment.updatedAt)}</td><td><Link className="ws-icon-link" aria-label={`Open ${participant.code} assessment`} to={`/staff/assessments/${assessment.id}`}><ArrowRight size={19} /></Link></td></tr>;
  })}</tbody></table></div>;
}

export function StaffShell() {
  const { data, role, actor, chooseRole, storageError, savedAt, retrySave, resetDemo, message, dismissMessage } = useWorkflow();
  const [resetOpen, setResetOpen] = useState(false);
  const navigate = useNavigate();
  if (!role) return <Navigate to="/login" replace />;
  const active = data?.assessments.find((assessment) => assessment.attempts.some((attempt) => attempt.status === 'recording'));
  const reviewCount = data?.assessments.filter((assessment) => assessment.reviewStatus === 'pending_review').length || 0;
  const nav = [
    ['/staff', 'งานประเมิน', 'Workspace', LayoutDashboard], ['/staff/participants', 'ผู้เข้าร่วม', 'Participants', Users],
    ['/staff/review', 'ทบทวนการประเมิน', 'Clinical review', ClipboardCheck], ['/staff/devices', 'ความพร้อมอุปกรณ์', 'Device readiness', Monitor],
  ];
  return <div className="ws-shell">
    <a className="ws-skip" href="#workspace-main">Skip to content</a>
    <aside className="ws-sidebar"><Link to="/staff" className="ws-brand"><span className="ws-brand-mark"><Activity size={27} /></span><span>omni<span className="ws-brand-caption">CARE WORKSPACE</span></span></Link>
      <div className="ws-nav-label">ASSESSMENT TO REVIEW</div><nav aria-label="Staff navigation">{nav.map(([to, th, en, Icon]) => <NavLink end={to === '/staff'} key={to} to={to} className={({ isActive }) => `ws-nav-link ${isActive ? 'active' : ''}`}>{createElement(Icon, { size: 19 })}<span><strong>{th}</strong><small>{en}</small></span>{to === '/staff/review' && <span className="ws-count">{reviewCount}</span>}</NavLink>)}</nav>
      <div className="ws-sidebar-bottom"><div className="ws-prototype-card"><FlaskConical size={19} /><strong>Prototype · TUG first</strong><p>ข้อมูลและหลักฐานจำลอง<br />Synthetic records & evidence</p><span>Draft protocol · demo-0.1</span></div><button className="ws-reset" onClick={() => setResetOpen(true)} disabled={Boolean(active)}><RotateCcw size={15} />รีเซ็ตข้อมูลตัวอย่าง / Reset demo</button></div>
    </aside>
    <div className="ws-main"><header className="ws-topbar"><div className="ws-breadcrumb">Staff workspace <ChevronRight size={14} /><strong>TUG prototype</strong></div><div className="ws-account"><span className="ws-avatar small">{role === 'operator' ? 'OP' : 'CR'}</span><label><span className="sr-only">Demo role</span><select aria-label="Demo role" value={role} disabled={Boolean(active)} onChange={(event) => chooseRole(event.target.value)}><option value="operator">Demo operator</option><option value="reviewer">Demo clinical reviewer</option></select></label><button className="ws-icon-link" disabled={Boolean(active)} aria-label="Leave demo role" onClick={() => { chooseRole(null); navigate('/login'); }}><LogOut size={18} /></button></div></header>
      <div className="ws-demo-strip"><FlaskConical size={15} /><span>UI PROTOTYPE · หลักฐานจำลองเท่านั้น / Simulated evidence · Roles demonstrate workflow, not production authorization.</span></div>
      {storageError ? <div className="ws-save-error" role="alert"><Database size={20} /><div><strong>ยังไม่ได้บันทึก / Not saved</strong><p>{storageError} Do not close this tab before retrying.</p></div>{data && <button className="ws-button secondary" onClick={retrySave}>ลองบันทึกอีกครั้ง / Retry save</button>}</div> : savedAt && <div className="ws-save-line" role="status"><Check size={13} />Saved in this browser · {dateTime(savedAt)}<span>Demo workspace · {actor.name}</span></div>}
      {active && <div className="ws-active-banner"><span className="ws-live-dot" />มีการบันทึกที่กำลังดำเนินการ / An attempt is recording<Link to={`/staff/assessments/${active.id}/record`}>กลับไปบันทึก / Return to recording <ArrowRight size={15} /></Link></div>}
      <main id="workspace-main" className="ws-content">{data ? <Outlet /> : <section className="ws-card"><Empty title="Unable to open this browser’s demo data">The existing data has been preserved. Reset the demo explicitly to replace it with synthetic records.</Empty><button className="ws-button" onClick={() => setResetOpen(true)}>Reset demo data</button></section>}</main>
      {message && <div className="ws-toast" role="alert"><span>{message}</span><button aria-label="Dismiss message" onClick={dismissMessage}><X size={17} /></button></div>}
    </div>
    <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)} title="รีเซ็ตข้อมูลตัวอย่าง / Reset demo data" footer={<><button className="ws-button secondary" onClick={() => setResetOpen(false)}>ยกเลิก / Cancel</button><button className="ws-button danger" onClick={() => { resetDemo(); setResetOpen(false); navigate('/staff'); }}>Reset synthetic records</button></>}><p>This replaces all local demo participants, attempts, observations and review history in this browser. It does not affect a backend.</p></Modal>
  </div>;
}

export function NewAssessmentLink({ participantId, children }) {
  return <Link className="ws-button" to={participantId ? `/staff/assessments/new?participantId=${encodeURIComponent(participantId)}` : '/staff/assessments/new'}><Plus size={17} />{children || 'เริ่มประเมิน TUG / New assessment'}</Link>;
}
