import { ArrowRight, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BilingualHeading, DemoNotice, RiskBadge } from '../components/clinical';
import { getPatient, getSessionsForPatient } from '../services/mockDataService';
import '../css/clinical.css';

export const PatientHistory = () => {
  const navigate = useNavigate();
  const history = getSessionsForPatient(getPatient('PT-001').id);
  return <div className="clinical-page"><div className="page-heading"><BilingualHeading as="h1" th="ประวัติผลการประเมิน" en="My assessment history" /><DemoNotice compact /></div>
    <article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="ผลสามครั้งล่าสุด" en="Recent results" /><CalendarClock size={20} color="var(--primary)" /></div><div className="progress-list">{history.map((session) => <div className="progress-item" key={session.id}><div className="cell-stack"><strong>{session.date.split(',')[0]}</strong><small>{session.date.split(',')[1]?.trim()}</small></div><div><div className="progress-bar"><span style={{ width: `${session.score}%` }} /></div><small className="bilingual-label">คะแนนการทรงตัว / Balance score {session.score}/100</small></div><div style={{ display: 'grid', justifyItems: 'end', gap: 7 }}><RiskBadge risk={session.risk} /><button className="text-button" onClick={() => navigate(`/patient/history/${session.id}`)}>ดูผล <ArrowRight size={14} /></button></div></div>)}</div></article>
    <p className="patient-disclaimer">คุณจะเห็นเฉพาะผลสรุปและคำแนะนำสำหรับตนเอง / Technical sensor data is available to your care team only.</p>
  </div>;
};
