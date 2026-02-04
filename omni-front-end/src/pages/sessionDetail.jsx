import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/session.css";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
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
      <div className="session-main-content">
        <div style={{ marginBottom: '20px' }}>
          <Button
            className="btn-back-sessions"
            variant="secondary"
            onClick={() => navigate('/sessions')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', color: '#4b5563', backgroundColor: 'white', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Sessions
          </Button>
        </div>
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
                Historical data for this session is stored in InfluxDB.<br />
                (Playback Visualization coming soon)
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};