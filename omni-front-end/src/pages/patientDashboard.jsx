import { ArrowRight, CalendarDays, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { BilingualHeading, DemoNotice, ResultCallout, RiskBadge } from '../components/clinical';
import { getPatient, getSessionsForPatient } from '../services/mockDataService';
import '../css/clinical.css';

const tooltipStyle = { background: '#fff', border: '1px solid #eadde3', borderRadius: '10px', color: '#2d2428' };

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const patient = getPatient('PT-001');
  const history = getSessionsForPatient(patient.id);
  const latest = history[0];
  const chartData = [...history].reverse().map((session, index) => ({ name: `ครั้งที่ ${index + 1}`, score: session.score }));

  return <div className="clinical-page patient-page"><div className="page-heading"><BilingualHeading as="h1" th="ผลการประเมินของคุณ" en="Your balance assessment" /><DemoNotice compact /></div>
    <section className="clinical-card patient-hero"><div className="patient-hero-copy"><span className="eyebrow">ผลล่าสุด / LATEST RESULT</span><h1>คุณมีการทรงตัวอยู่ในเกณฑ์ดี</h1><p>{latest.date} · การประเมินใช้เวลา {latest.duration}</p><div style={{ marginTop: 16 }}><RiskBadge risk={latest.risk} /></div></div><div className="score-ring" style={{ '--score': latest.score }}><div><strong>{latest.score}</strong><span>Balance score<br />out of 100</span></div></div></section>
    <section className="result-grid"><article className="clinical-card result-stat"><BilingualHeading as="h2" th="ดีขึ้นจากครั้งก่อน" en="Change from last time" /><strong style={{ color: 'var(--success)' }}>+{patient.change} points</strong></article><article className="clinical-card result-stat"><BilingualHeading as="h2" th="ความนิ่ง" en="Stability" /><strong>{latest.stability}%</strong></article><article className="clinical-card result-stat"><BilingualHeading as="h2" th="ความสมดุล" en="Weight symmetry" /><strong>{latest.symmetry}%</strong></article></section>
    <section className="two-column"><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="แนวโน้มการทรงตัว" en="Your progress" /><TrendingUp size={20} color="var(--primary)" /></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="patientScore" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#DB5F8E" stopOpacity={.3} /><stop offset="95%" stopColor="#DB5F8E" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="score" name="Balance score" stroke="var(--primary)" fill="url(#patientScore)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div></article><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="คำแนะนำสำหรับคุณ" en="Next steps" /><CalendarDays size={20} color="var(--primary)" /></div><ResultCallout risk={latest.risk}><strong>ผลโดยรวมอยู่ในเกณฑ์ดี</strong><p>{latest.recommendation}</p></ResultCallout><button className="text-button" style={{ marginTop: 16 }} onClick={() => navigate(`/patient/history/${latest.id}`)}>ดูผลการประเมินครั้งนี้ <ArrowRight size={15} /></button></article></section>
    <p className="patient-disclaimer">ผลนี้ใช้เพื่อการติดตามเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ / This result supports monitoring and is not a medical diagnosis.</p>
  </div>;
};
