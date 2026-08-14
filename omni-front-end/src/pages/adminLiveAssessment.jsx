import { Activity, CircleDot, Radio, Waves } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BilingualHeading, DemoNotice, RiskBadge } from '../components/clinical';
import { Heatmap } from '../components/Heatmap';
import { patients, signalSeries, useLiveAssessment } from '../services/mockDataService';
import '../css/clinical.css';

const tooltipStyle = { background: '#fff', border: '1px solid #eadde3', borderRadius: '10px', color: '#2d2428' };

export const AdminLiveAssessment = () => {
  const live = useLiveAssessment();
  const patient = patients[1];
  const liveSeries = signalSeries.map((item, index) => ({ ...item, movement: Math.max(0, item.movement + (index > 14 ? live.movement - 30 : 0)) }));

  return <div className="clinical-page"><div className="page-heading"><BilingualHeading as="h1" th="ติดตามการประเมินสด" en="Live balance assessment" /><DemoNotice compact /></div>
    <section className="clinical-card session-meta"><div><Radio size={18} color="var(--success)" /><span><strong>กำลังรับสัญญาณ</strong> / Live sensor stream</span></div><div><span className="avatar">{patient.initials}</span><span><strong>{patient.name}</strong><br />{patient.id} · ห้องประเมิน 1</span></div><RiskBadge risk="medium" /></section>
    <section className="live-grid"><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="การกระจายแรงกด" en="Live pressure distribution" /><Waves size={20} color="var(--primary)" /></div><div className="heatmap-wrap"><Heatmap data={live.pressureData} width={300} height={300} /></div><div className="heatmap-legend"><span><i className="legend-dot" style={{ background: '#2563eb' }} />แรงกดต่ำ</span><span><i className="legend-dot" style={{ background: '#facc15' }} />ปานกลาง</span><span><i className="legend-dot" style={{ background: '#ef4444' }} />แรงกดสูง</span></div></article>
      <article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="สัญญาณการเคลื่อนไหว" en="Raw motion and sway signal" /><Activity size={20} color="var(--primary)" /></div><div className="chart-box chart-box-tall"><ResponsiveContainer width="100%" height="100%"><LineChart data={liveSeries}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} /><Tooltip contentStyle={tooltipStyle} /><Line type="monotone" dataKey="movement" name="mmWave activity" stroke="var(--chart-secondary)" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="sway" name="Body sway" stroke="var(--primary)" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div></article></section>
    <section className="three-column"><article className="clinical-card signal-chip"><BilingualHeading as="h3" th="ท่าทาง" en="Detected posture" /><strong>{live.posture}</strong></article><article className="clinical-card signal-chip"><BilingualHeading as="h3" th="จุดถ่ายน้ำหนัก" en="Centre of pressure" /><strong>X {live.center.x.toFixed(1)} · Y {live.center.y.toFixed(1)}</strong></article><article className="clinical-card signal-chip"><BilingualHeading as="h3" th="การเคลื่อนไหว" en="Motion activity" /><strong>{live.movement}%</strong></article></section>
    <section className="two-column"><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="วิเคราะห์การทรงตัว" en="Derived balance analysis" /></div><div className="result-grid"><div className="result-stat"><span className="bilingual-label">ความสมดุล / Symmetry</span><strong>78%</strong></div><div className="result-stat"><span className="bilingual-label">ความนิ่ง / Stability</span><strong>63%</strong></div><div className="result-stat"><span className="bilingual-label">คะแนนประเมิน / Score</span><strong>61/100</strong></div></div></article><article className="clinical-card"><div className="clinical-card-header"><BilingualHeading as="h2" th="สรุปความเสี่ยง" en="Risk interpretation" /><CircleDot size={20} color="var(--warning)" /></div><RiskBadge risk="medium" /><p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>ตรวจพบการโอนน้ำหนักไปทางซ้ายเล็กน้อย ควรติดตามและทบทวนครั้งถัดไป</p></article></section>
  </div>;
};
