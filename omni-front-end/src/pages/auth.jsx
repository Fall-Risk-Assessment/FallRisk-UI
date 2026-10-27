import { Activity, ArrowRight, ClipboardCheck, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../hooks/useWorkflow';

export function AuthPage() {
  const { chooseRole, data } = useWorkflow();
  const navigate = useNavigate();
  const active = data?.assessments.find((assessment) => assessment.attempts.some((attempt) => attempt.status === 'recording'));
  const enter = (role) => { chooseRole(active ? 'operator' : role); navigate(active ? `/staff/assessments/${active.id}/record` : role === 'reviewer' ? '/staff/review' : '/staff'); };
  return <main className="ws-entry"><section className="ws-entry-story"><div className="ws-brand"><span className="ws-brand-mark"><Activity size={28} /></span><span>omni<span className="ws-brand-caption">CARE WORKSPACE</span></span></div><div className="ws-entry-copy"><span className="ws-eyebrow">ONE ASSESSMENT. EVERY ATTEMPT.</span><h1>ทุกหลักฐาน<br />ในบันทึกเดียว<span>Care starts with a clearer record.</span></h1><p>จากการเตรียมอุปกรณ์ สู่การบันทึกและทบทวน<br />A supervised TUG workflow, built around the people doing the work.</p><div className="ws-journey"><span>01 · Prepare</span><ArrowRight size={16} /><span>02 · Record</span><ArrowRight size={16} /><span>03 · Review</span></div></div><div className="ws-entry-foot"><FlaskConical size={19} /><span>Working UI prototype · Synthetic participants<br />Simulated camera & pressure evidence · Stored in this browser</span></div></section>
    <section className="ws-entry-roles"><span className="ws-eyebrow">EXPLORE THE WORKFLOW</span><h2>เลือกบทบาทสาธิต</h2><p className="ws-muted">Choose a role to explore the same staff workspace.</p><button className="ws-role-card" onClick={() => enter('operator')}><span className="ws-role-icon"><Activity size={25} /></span><span><strong>ผู้ดำเนินการประเมิน</strong><b>Assessment operator</b><small>Select participants, record attempts and prepare evidence.</small></span><ArrowRight size={20} /></button><button className="ws-role-card" onClick={() => enter('reviewer')}><span className="ws-role-icon blue"><ClipboardCheck size={25} /></span><span><strong>ผู้ทบทวนทางคลินิก</strong><b>Clinical reviewer</b><small>Inspect evidence, request corrections and review revisions.</small></span><ArrowRight size={20} /></button><div className="ws-entry-note"><FlaskConical size={18} /><p>Draft protocol awaiting clinical review. Demo approval is a workflow state, not clinical validation. No real capture or authentication is provided.</p></div></section>
  </main>;
}
