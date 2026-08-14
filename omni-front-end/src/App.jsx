import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AdminDashboard } from './admin/adminDashboard';
import { AdminDevices } from './admin/adminDevices';
import { AdminPatients } from './admin/adminPatients';
import { AdminLayout } from './layout/layoutAdmin';
import { LayoutUser } from './layout/layoutUser';
import { AdminLiveAssessment } from './pages/adminLiveAssessment';
import { AdminSessionDetail } from './pages/adminSessionDetail';
import { AuthPage } from './pages/auth';
import { PatientDashboard } from './pages/patientDashboard';
import { PatientHistory } from './pages/patientHistory';
import { PatientResult } from './pages/patientResult';

const LegacySessionRedirect = () => {
  const { sessionId } = useParams();
  return <Navigate to={`/admin/sessions/${sessionId}`} replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="live-assessment" element={<AdminLiveAssessment />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="sessions/:sessionId" element={<AdminSessionDetail />} />
        <Route path="devices" element={<AdminDevices />} />
        <Route path="profiles" element={<Navigate to="/admin/devices" replace />} />
        <Route path="inventory" element={<Navigate to="/admin/devices" replace />} />
        <Route path="users" element={<Navigate to="/admin/patients" replace />} />
      </Route>

      <Route path="/patient" element={<LayoutUser />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="history" element={<PatientHistory />} />
        <Route path="history/:sessionId" element={<PatientResult />} />
      </Route>

      <Route path="/support/*" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/patient/dashboard" replace />} />
      <Route path="/project/*" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/live-monitor" element={<Navigate to="/admin/live-assessment" replace />} />
      <Route path="/sessions/:sessionId" element={<LegacySessionRedirect />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
