import { useCallback, useEffect, useRef, useState } from 'react';
import { ACTORS, loadWorkflow, saveWorkflow, seedWorkflow, transition } from '../services/workflowStore';
import { WorkflowContext } from '../hooks/useWorkflow';

function initialize() {
  try {
    return { data: loadWorkflow(window.localStorage), error: '' };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export function WorkflowProvider({ children }) {
  const [initial] = useState(initialize);
  const [data, setData] = useState(initial.data);
  const dataRef = useRef(initial.data);
  const failedRef = useRef(initial.error);
  const [storageError, setStorageError] = useState(initial.error);
  const [message, setMessage] = useState('');
  const [savedAt, setSavedAt] = useState(null);
  const [role, setRole] = useState(() => {
    try { return ACTORS[window.sessionStorage.getItem('omni.demo-role')]?.role || null; } catch { return null; }
  });

  const persist = useCallback((snapshot) => {
    try {
      saveWorkflow(window.localStorage, snapshot);
      failedRef.current = '';
      setStorageError('');
      setSavedAt(new Date().toISOString());
      return true;
    } catch (error) {
      const detail = `Not saved in this browser. ${error.message}`;
      failedRef.current = detail;
      setStorageError(detail);
      return false;
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { if (initial.data) persist(dataRef.current); }, 0);
    return () => window.clearTimeout(timer);
  }, [initial, persist]);
  useEffect(() => {
    const warn = (event) => {
      if (storageError || data?.assessments.some((item) => item.attempts.some((attempt) => attempt.status === 'recording'))) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [storageError, data]);

  const chooseRole = (nextRole) => {
    setRole(ACTORS[nextRole]?.role || null);
    try {
      if (nextRole) window.sessionStorage.setItem('omni.demo-role', nextRole);
      else window.sessionStorage.removeItem('omni.demo-role');
    } catch { /* Role selection can remain in memory when session storage is unavailable. */ }
  };

  const act = useCallback((action) => {
    if (failedRef.current) {
      setMessage('Retry the pending browser save before changing this record.');
      return { ok: false };
    }
    try {
      const result = transition(dataRef.current, action, ACTORS[role]);
      dataRef.current = result.data;
      setData(result.data);
      setMessage('');
      const finished = action.type === 'FINISH' && result.data.assessments.find((item) => item.id === action.assessmentId)?.attempts.find((item) => item.id === action.attemptId);
      if (finished && finished.scenario === 'save-failure') {
        failedRef.current = 'Simulated save failure. Your finished attempt is still in memory. Retry to save the same record.';
        setStorageError(failedRef.current);
        return { ok: true, id: result.id, saved: false };
      }
      return { ok: true, id: result.id, saved: persist(result.data) };
    } catch (error) {
      setMessage(error.message);
      return { ok: false };
    }
  }, [role, persist]);

  useEffect(() => {
    const assessment = data?.assessments.find((item) => item.attempts.some((attempt) => attempt.status === 'recording'));
    const attempt = assessment?.attempts.find((item) => item.status === 'recording');
    if (!attempt || role !== 'operator' || storageError) return;
    const timer = window.setInterval(() => act({ type: 'HEARTBEAT', assessmentId: assessment.id, attemptId: attempt.id }), 1000);
    return () => window.clearInterval(timer);
  }, [data, role, storageError, act]);

  const retrySave = () => { if (dataRef.current) persist(dataRef.current); };
  const resetDemo = () => {
    const snapshot = seedWorkflow();
    if (!persist(snapshot)) return;
    dataRef.current = snapshot;
    setData(snapshot);
    setMessage('');
  };

  return <WorkflowContext.Provider value={{ data, role, actor: ACTORS[role], chooseRole, act, savedAt, storageError, retrySave, resetDemo, message, dismissMessage: () => setMessage('') }}>{children}</WorkflowContext.Provider>;
}
