import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BilingualHeading, DemoNotice, RiskBadge } from '../components/clinical';
import { patients, sessions } from '../services/mockDataService';
import '../css/clinical.css';

export const AdminPatients = () => {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('all');
  const navigate = useNavigate();
  const filtered = useMemo(() => patients.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (risk === 'all' || patient.risk === risk);
  }), [query, risk]);

  return <div className="clinical-page"><div className="page-heading"><BilingualHeading as="h1" th="รายชื่อผู้รับบริการ" en="Patient assessment list" /><DemoNotice compact /></div>
    <article className="clinical-card"><div className="clinical-card-header"><div className="filter-bar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อหรือรหัสผู้รับบริการ / Search patient" /></div><SlidersHorizontal size={17} color="var(--text-secondary)" /><select className="select-field" value={risk} onChange={(event) => setRisk(event.target.value)} aria-label="Filter by risk"><option value="all">ทุกระดับความเสี่ยง</option><option value="low">ความเสี่ยงต่ำ</option><option value="medium">ปานกลาง</option><option value="high">ต้องติดตาม</option></select></div><span className="bilingual-label">{filtered.length} รายการ / records</span></div>
      <div className="table-wrap"><table className="clinical-table"><thead><tr><th>ผู้รับบริการ</th><th>ผลล่าสุด</th><th>แนวโน้ม</th><th>ความเสี่ยง</th><th></th></tr></thead><tbody>{filtered.map((patient) => { const lastSession = sessions.find((session) => session.patientId === patient.id); return <tr key={patient.id}><td><div className="person-cell"><span className="avatar">{patient.initials}</span><span><strong>{patient.name}</strong><small>{patient.id} · {patient.age} ปี</small></span></div></td><td className="cell-stack"><strong>{patient.score}/100</strong><small>{patient.lastAssessment}</small></td><td><span className={`metric-change ${patient.change >= 0 ? 'positive' : 'negative'}`}>{patient.change >= 0 ? '+' : ''}{patient.change} points</span></td><td><RiskBadge risk={patient.risk} /></td><td><button className="text-button" onClick={() => navigate(`/admin/sessions/${lastSession?.id || sessions[0].id}`)}>ดูการประเมิน</button></td></tr>; })}</tbody></table></div>
      {!filtered.length && <div className="empty-state">ไม่พบรายการที่ตรงกับการค้นหา / No matching patients</div>}
    </article></div>;
};
