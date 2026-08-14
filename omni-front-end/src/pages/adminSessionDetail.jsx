import { ArrowLeft, Download, FileBarChart2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { BilingualHeading, DemoNotice, RiskBadge } from '../components/clinical';
import { getPatient, getSession, signalSeries } from '../services/mockDataService';
import '../css/clinical.css';

const tooltipStyle = { background: '#fff', border: '1px solid #eadde3', borderRadius: '10px', color: '#2d2428' };

export const AdminSessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = getSession(sessionId);
  const patient = getPatient(session.patientId);
  return <div className="clinical-page"><button className="back-link" onClick={() => navigate('/admin/patients')}><ArrowLeft size={17} />กลับไปรายชื่อผู้รับบริการ</button>
    <div className="page-heading"><BilingualHeading as="h1" th="รายละเอียดการประเมิน" en={`Technical session review · ${session.id}`} /><button className="secondary-action"><Download size={17} />ส่งออกรายงาน</button></div>
    <section className="clinical-card session-meta"><div><span className="avatar">{patient.initials}</span><span><strong>{patient.name}</strong><br />{patient.id} · {patient.age} ปี</span></div><div><strong>{session.date}</strong><br />ระยะเวลา {session.duration}</div><RiskBadge risk={session.risk} /></section>
    <section className="metric-grid"><article className="clinical-card metric-card"><BilingualHeading as="h3" th="คะแนนการทรงตัว" en="Balance score" /><strong className="metric-value">{session.score}/100</strong></article><article className="clinical-card metric-card"><BilingualHeading as="h3" th="ความนิ่ง" en="Stability" /><strong className="metric-value">{session.stability}%</strong></article><article className="clinical-card metric-card"><BilingualHeading as="h3" th="ความสมดุล" en="Weight symmetry" /><strong className="metric-value">{session.symmetry}%</strong></article><article className="clinical-card metric-card"><BilingualHeading as="h3" th="ท่าทาง" en="Detected posture" /><strong className="metric-value metric-text">{session.posture}</strong></article></section>
    <section className="two-column"><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="การเคลื่อนไหวดิบ" en="Raw mmWave motion signal" /><FileBarChart2 size={20} color="var(--primary)" /></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={signalSeries}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="movement" stroke="var(--chart-secondary)" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div></article><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="แรงกดและการโอนตัว" en="Pressure and sway trend" /></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={signalSeries}><defs><linearGradient id="pressureGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#DB5F8E" stopOpacity={.3} /><stop offset="95%" stopColor="#DB5F8E" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="pressure" stroke="var(--primary)" fill="url(#pressureGradient)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div></article></section>
    <section className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="สรุปการตีความ" en="Clinical interpretation" /><DemoNotice compact /></div><p style={{ margin: 0, color: 'var(--text-secondary)' }}>{session.recommendation}</p></section>
  </div>;
};
