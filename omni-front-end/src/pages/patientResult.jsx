import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BilingualHeading, DemoNotice, ResultCallout, RiskBadge } from '../components/clinical';
import { getSession } from '../services/mockDataService';
import '../css/clinical.css';

export const PatientResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = getSession(sessionId);
  return <div className="clinical-page"><button className="back-link" onClick={() => navigate('/patient/history')}><ArrowLeft size={17} />กลับไปประวัติผลการประเมิน</button><div className="page-heading"><BilingualHeading as="h1" th="ผลการทรงตัวของคุณ" en="Assessment result" /><DemoNotice compact /></div>
    <section className="clinical-card patient-hero"><div className="patient-hero-copy"><span className="eyebrow">{session.id}</span><h1>{session.date}</h1><p>ผลของคุณถูกสรุปให้เพื่อใช้ติดตามการฝึกทรงตัวครั้งต่อไป</p><div style={{ marginTop: 16 }}><RiskBadge risk={session.risk} /></div></div><div className="score-ring" style={{ '--score': session.score }}><div><strong>{session.score}</strong><span>Balance score<br />out of 100</span></div></div></section>
    <section className="result-grid"><article className="clinical-card result-stat"><BilingualHeading as="h2" th="ความนิ่ง" en="Stability" /><strong>{session.stability}%</strong></article><article className="clinical-card result-stat"><BilingualHeading as="h2" th="ความสมดุล" en="Weight symmetry" /><strong>{session.symmetry}%</strong></article><article className="clinical-card result-stat"><BilingualHeading as="h2" th="ท่าทาง" en="Overall posture" /><strong className="metric-text">{session.posture}</strong></article></section>
    <section className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="คำแนะนำ" en="Recommendation" /><CheckCircle2 size={21} color="var(--primary)" /></div><ResultCallout risk={session.risk}><strong>ผลสรุปปัจจุบัน</strong><p>{session.recommendation}</p></ResultCallout></section>
    <p className="patient-disclaimer">ผลนี้ใช้เพื่อการติดตามเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ / This result supports monitoring and is not a medical diagnosis.</p>
  </div>;
};
