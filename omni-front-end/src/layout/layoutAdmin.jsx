import { Activity, ClipboardList, LogOut, MonitorCog, Users } from 'lucide-react';
import { createElement } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/layout.css';

const menuItems = [
  { label: 'ภาพรวม', en: 'Overview', path: '/admin/dashboard', icon: Activity },
  { label: 'ติดตามสด', en: 'Live assessment', path: '/admin/live-assessment', icon: MonitorCog },
  { label: 'รายชื่อผู้รับบริการ', en: 'Patients', path: '/admin/patients', icon: Users },
  { label: 'อุปกรณ์', en: 'Sensors', path: '/admin/devices', icon: ClipboardList },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="layout-container">
      <aside className="sidebar" aria-label="Admin navigation">
        <div className="logo"><img src={logo} alt="CareConnect Medical Technology" /></div>
        <div className="role-caption">
          <strong>ผู้ดูแลระผู้วิจัย</strong><span>Clinical & research view</span>
        </div>
        <nav className="nav-menu">
          {menuItems.map(({ label, en, path, icon }) => (
            <button key={path} onClick={() => navigate(path)} className={`nav-btn ${location.pathname.startsWith(path) ? 'active' : ''}`}>
              {createElement(icon, { size: 18, 'aria-hidden': true })}<span><strong>{label}</strong><small>{en}</small></span>
            </button>
          ))}
        </nav>
        <button className="nav-logout" onClick={() => navigate('/login')}><LogOut size={17} />ออกจากระบบ</button>
      </aside>
      <div className="main-area">
        <header className="top-nav"><div className="top-role"><span className="top-avatar">DR</span><span><strong>ดร. อนุชา ศรีสุข</strong><small>Clinician demo account</small></span></div></header>
        <main className="content-scroll"><Outlet /></main>
      </div>
    </div>
  );
};
