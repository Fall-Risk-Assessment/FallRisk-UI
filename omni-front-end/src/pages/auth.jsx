import { ArrowRight, HeartPulse, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../css/auth.css';

export const AuthPage = () => {
  const navigate = useNavigate();
  return (
    <main className="demo-login">
      <section className="login-intro">
        <img src={logo} alt="CareConnect Medical Technology" />
        <span className="eyebrow">BALANCE & FALL-RISK ASSESSMENT</span>
        <h1>ระบบติดตามการทรงตัว<br /><small>Clinical balance monitoring</small></h1>
        <p>เลือกบทบาทเพื่อเข้าชมระบบสาธิต / Choose a demo role to explore the assessment experience.</p>
        <div className="login-note"><ShieldCheck size={18} />ระบบสาธิตใช้ข้อมูลจำลองเท่านั้น / Demo data only</div>
      </section>
      <section className="role-picker" aria-labelledby="role-picker-title">
        <span className="eyebrow">DEMO ACCESS</span>
        <h2 id="role-picker-title">เลือกมุมมองการใช้งาน</h2>
        <p>Choose how you would like to view the system.</p>
        <button className="role-option" onClick={() => navigate('/admin/dashboard')}>
          <span className="role-icon"><HeartPulse size={27} /></span><span><strong>ผู้ดูแลระผู้วิจัย</strong><small>Admin / Clinical & research dashboard</small></span><ArrowRight size={20} />
        </button>
        <button className="role-option" onClick={() => navigate('/patient/dashboard')}>
          <span className="role-icon"><ShieldCheck size={27} /></span><span><strong>ผู้รับบริการ</strong><small>Patient / Assessment results</small></span><ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
};
