import { ClipboardCheck, Home, LogOut } from 'lucide-react';
import { createElement } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/layout.css';

const menuItems = [
  { label: 'ผลประเมินล่าสุด', en: 'Latest result', path: '/patient/dashboard', icon: Home },
  { label: 'ประวัติผลประเมิน', en: 'My history', path: '/patient/history', icon: ClipboardCheck },
];

export const LayoutUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="layout-container patient-layout">
      <aside className="sidebar" aria-label="Patient navigation">
        <div className="logo"><img src={logo} alt="CareConnect Medical Technology" /></div>
        <div className="role-caption"><strong>ผลการทรงตัว</strong><span>Balance assessment results</span></div>
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
        <header className="top-nav"><div className="top-role"><span className="top-avatar">SS</span><span><strong>คุณสุดา สุขใจ</strong><small>Patient demo account</small></span></div></header>
        <main className="content-scroll"><Outlet /></main>
      </div>
    </div>
  );
};
