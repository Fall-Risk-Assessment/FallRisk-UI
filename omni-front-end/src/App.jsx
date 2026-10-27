import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AssessmentDetail, RecordingPage } from './pages/tugAssessment';
import { Devices, NewAssessment, ParticipantDetail, Participants, Workspace } from './pages/staffPages';
import { Missing, StaffShell } from './components/staffWorkspace';
import { WorkflowProvider } from './context/WorkflowProvider';
import { AuthPage } from './pages/auth';
import './css/workspace.css';

function LegacyAssessmentRedirect() {
  const { sessionId } = useParams();
  return <Navigate to={`/staff/assessments/${encodeURIComponent(sessionId)}`} replace />;
}

export default function App() {
  return <WorkflowProvider><Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<AuthPage />} />
    <Route path="/staff" element={<StaffShell />}>
      <Route index element={<Workspace />} />
      <Route path="participants" element={<Participants />} />
      <Route path="participants/:participantId" element={<ParticipantDetail />} />
      <Route path="assessments/new" element={<NewAssessment />} />
      <Route path="assessments/:assessmentId" element={<AssessmentDetail />} />
      <Route path="assessments/:assessmentId/record" element={<RecordingPage />} />
      <Route path="review" element={<Workspace key="review-queue" reviewOnly />} />
      <Route path="devices" element={<Devices />} />
      <Route path="*" element={<Missing entity="Page" />} />
    </Route>
    <Route path="/admin/sessions/:sessionId" element={<LegacyAssessmentRedirect />} />
    <Route path="/sessions/:sessionId" element={<LegacyAssessmentRedirect />} />
    <Route path="/admin/patients" element={<Navigate to="/staff/participants" replace />} />
    <Route path="/admin/users" element={<Navigate to="/staff/participants" replace />} />
    {['/admin/devices', '/admin/profiles', '/admin/inventory'].map((path) => <Route key={path} path={path} element={<Navigate to="/staff/devices" replace />} />)}
    {['/admin/live-assessment', '/live-monitor'].map((path) => <Route key={path} path={path} element={<Navigate to="/staff/assessments/new" replace />} />)}
    {['/admin', '/admin/dashboard', '/dashboard', '/project/*'].map((path) => <Route key={path} path={path} element={<Navigate to="/staff" replace />} />)}
    <Route path="/patient/*" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes></WorkflowProvider>;
}
