import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/session.css";
import { Card } from "../components/common/Card";
import { dashboardService } from "../services/dashboardService";

export const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await dashboardService.getSession(id);
        setSession(res.data);
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  if (loading) return <div className="session-detail-container">Loading...</div>;
  if (!session) return <div className="session-detail-container">Session not found</div>;

  const calculateDuration = (start, end) => {
    if (!end) return "Ongoing";
    const diffMs = new Date(end) - new Date(start);
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  return (
    <div className="session-detail-container" style={{ padding: '20px', display: 'block' }}>
       <button 
        className="btn-back" 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px' }}
      >
        ← Back
      </button>

      <div className="session-main-content">
        <Card title="Session Details">
          <div className="session-info-row">
            <div>
              <p className="info-label">DEVICE</p>
              <p className="info-value" style={{ color: '#2563eb' }}>
                {session.device?.device_name || session.device_id}
              </p>
            </div>
             <div>
              <p className="info-label">START TIME</p>
              <p className="info-value" style={{ fontSize: '16px' }}>
                {new Date(session.start_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="info-label">DURATION</p>
              <p className="info-value">{calculateDuration(session.start_time, session.end_time)}</p>
            </div>
            <div>
              <p className="info-label">STATUS</p>
              <span className={`status-badge ${session.end_time ? 'completed' : 'active'}`}>
                 {session.end_time ? "Completed" : "Recording..."}
              </span>
            </div>
          </div>
        </Card>

        <Card className="timeline-card" title="Recorded Data" titleClassName="info-label">
          <div className="timeline-placeholder">
             {/* Placeholder for now until generic InfluxDB Graph is implemented */}
             <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '10px' }}>📊 Data Playback</p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                   Historical data for this session is stored in InfluxDB.<br/>
                   (Playback Visualization coming soon)
                </p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};