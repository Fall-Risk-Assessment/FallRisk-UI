import { BatteryMedium, Radio, Wrench } from 'lucide-react';
import { BilingualHeading, DemoNotice } from '../components/clinical';
import { devices } from '../services/mockDataService';
import '../css/clinical.css';

export const AdminDevices = () => <div className="clinical-page"><div className="page-heading"><BilingualHeading as="h1" th="อุปกรณ์และเซ็นเซอร์" en="Sensor availability" /><DemoNotice compact /></div>
  <section className="metric-grid"><article className="clinical-card metric-card"><div className="metric-top"><BilingualHeading as="h3" th="พร้อมใช้งาน" en="Online" /><span className="metric-icon"><Radio size={20} /></span></div><strong className="metric-value">3/4</strong><span className="metric-change positive">รับสัญญาณปกติ</span></article><article className="clinical-card metric-card"><div className="metric-top"><BilingualHeading as="h3" th="ต้องตรวจสอบ" en="Needs service" /><span className="metric-icon"><Wrench size={20} /></span></div><strong className="metric-value">1</strong><span className="metric-change negative">Balance Mat C ออฟไลน์</span></article></section>
  <section className="device-grid">{devices.map((device) => <article className="clinical-card device-card" key={device.id}><div className="device-card-top"><span className="metric-icon"><Radio size={20} /></span><span className={`device-state ${device.status}`}>{device.status === 'online' ? 'เชื่อมต่อแล้ว' : 'ไม่เชื่อมต่อ'}</span></div><BilingualHeading as="h2" th={device.name} en={`${device.type} / ${device.en}`} /><div className="device-card-footer"><span className="bilingual-label">{device.location}<br />Last seen: {device.lastSeen}</span><span className="device-state"><BatteryMedium size={17} />{device.battery}%</span></div></article>)}</section>
</div>;
