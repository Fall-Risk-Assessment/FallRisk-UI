import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import "../css/session.css";

export const Sessions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');

  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // If no deviceId, maybe fetch all? For now, we expect deviceId.
        // If deviceId is missing, we could fetch generic or show empty.
        // Let's assume deviceId is provided or handle gracefully.
        const idToFetch = deviceId || "all"; 
        
        let data = [];
        if (deviceId) {
             const res = await dashboardService.getSessions(deviceId);
             data = res.data;
        } else {
            // Placeholder: If no device selected, maybe fetch recent sessions from all?
            // Currently backend only supports getSessionsByDevice nicely.
            // We'll leave it empty or mock for now if no ID.
            data = [];
        }

        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [deviceId]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const calculateDuration = (start, end) => {
    if (!end) return "Ongoing";
    const diffMs = new Date(end) - new Date(start);
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  return (
    <div className="session-container">
      <div className="session-header">
        <h1>Sessions History</h1>
        {deviceId && <span className="subtitle">Device: {deviceId}</span>}
      </div>

      {isLoading ? (
        <p>Loading sessions...</p>
      ) : (
        <table className="session-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <tr key={session.id}>
                  <td>{new Date(session.start_time).toLocaleDateString()}</td>
                  <td>{new Date(session.start_time).toLocaleTimeString()}</td>
                  <td>{calculateDuration(session.start_time, session.end_time)}</td>
                  <td>
                    <span className={`status-badge ${session.end_time ? 'completed' : 'active'}`}>
                        {session.end_time ? "Completed" : "Recording..."}
                    </span>
                  </td>
                  <td>
                    <button 
                        className="btn-view" 
                        onClick={() => navigate(`/sessions/${session.id}`)}
                        disabled={!session.end_time}
                    >
                        View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No sessions found {deviceId ? `for this device` : "(Select a device to view sessions)"}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      
      <div style={{marginTop: '20px'}}>
        <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};
