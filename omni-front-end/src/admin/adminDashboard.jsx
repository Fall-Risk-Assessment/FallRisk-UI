import { Activity, AlertTriangle, ArrowUpRight, ClipboardCheck, Radio, Users } from 'lucide-react';
import { createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { BilingualHeading, DemoNotice, RiskBadge } from '../components/clinical';
import { patients, sessions } from '../services/mockDataService';
import '../css/clinical.css';

const metrics = [
  { th: 'ประเมินวันนี้', en: 'Assessments today', value: '18', detail: '+4 จากเมื่อวาน', icon: ClipboardCheck, tone: 'positive' },
  { th: 'กำลังประเมิน', en: 'Active sessions', value: '2', detail: 'ห้องประเมิน 1, 2', icon: Radio, tone: '' },
  { th: 'เซ็นเซอร์พร้อมใช้', en: 'Sensors online', value: '3/4', detail: '1 อุปกรณ์รอตรวจสอบ', icon: Activity, tone: '' },
  { th: 'รอทบทวนผล', en: 'Flagged results', value: '2', detail: 'ต้องติดตามโดยทีมรักษา', icon: AlertTriangle, tone: 'negative' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const recentSessions = sessions.slice(0, 5);

  return <div className="clinical-page">
    <div className="page-heading">
      <BilingualHeading as="h1" th="ภาพรวมการประเมิน" en="Clinical assessment overview" />
      <DemoNotice compact />
    </div>

    <section className="metric-grid" aria-label="Today's assessment metrics">
      {metrics.map(({ th, en, value, detail, icon, tone }) => <article key={en} className="clinical-card metric-card">
        <div className="metric-top"><BilingualHeading as="h3" th={th} en={en} /><span className="metric-icon">{createElement(icon, { size: 20 })}</span></div>
        <strong className="metric-value">{value}</strong><span className={`metric-change ${tone}`}>{detail}</span>
      </article>)}
    </section>

    <section className="two-column">
      <article className="clinical-card">
        <div className="clinical-card-header"><BilingualHeading as="h2" th="ผลประเมินล่าสุด" en="Recent assessment sessions" /><button className="text-button" onClick={() => navigate('/admin/patients')}>ดูผู้รับบริการ <ArrowUpRight size={15} /></button></div>
        <div className="table-wrap"><table className="clinical-table"><thead><tr><th>ผู้รับบริการ</th><th>คะแนน</th><th>ความเสี่ยง</th><th></th></tr></thead><tbody>
          {recentSessions.map((session) => { const patient = patients.find((item) => item.id === session.patientId); return <tr key={session.id}><td><div className="person-cell"><span className="avatar">{patient.initials}</span><span><strong>{patient.name}</strong><small>{session.date}</small></span></div></td><td><strong>{session.score}<small>/100</small></strong></td><td><RiskBadge risk={session.risk} /></td><td><button className="text-button" onClick={() => navigate(`/admin/sessions/${session.id}`)}>ดูรายละเอียด</button></td></tr>; })}
        </tbody></table></div>
      </article>
      <aside className="clinical-card">
        <div className="clinical-card-header"><BilingualHeading as="h2" th="รายการที่ควรติดตาม" en="Needs review" /></div>
        <div className="alerts-list">
          <div className="alert-item"><AlertTriangle size={19} /><div><strong>นางมาลี วัฒนา</strong><p>ผลการทรงตัวอยู่ในระดับที่ควรทบทวน / Score 44</p></div></div>
          <div className="alert-item"><AlertTriangle size={19} /><div><strong>Balance Mat C</strong><p>ไม่พบการเชื่อมต่อมานาน 12 นาที</p></div></div>
        </div>
      </aside>
    </section>

    <section className="two-column">
      <article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="ผู้รับบริการล่าสุด" en="Patients at a glance" /><Users size={20} color="var(--primary)" /></div><div className="activity-list">
        {patients.slice(0, 3).map((patient) => <div className="activity-item" key={patient.id}><span className="avatar">{patient.initials}</span><div><strong>{patient.name}</strong><p>{patient.id} · คะแนนล่าสุด {patient.score}/100</p></div><RiskBadge risk={patient.risk} /></div>)}
      </div></article>
      <article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="ระบบสด" en="Live system status" /></div><div className="activity-list"><div className="activity-item"><Radio color="var(--success)" /><div><strong>ห้องประเมิน 1</strong><p>PT-002 · กำลังเก็บข้อมูล</p></div></div><div className="activity-item"><Radio color="var(--success)" /><div><strong>ห้องประเมิน 2</strong><p>พร้อมเริ่มรอผู้รับบริการ</p></div></div></div></article>
    </section>
  </div>;
};
