import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/session.css";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { dashboardService } from "../services/dashboardService";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // 1. Fetch Session Info
        const res = await dashboardService.getSession(id);
        setSession(res.data);
        
        // 2. Fetch Telemetry Data (JSON)
        try {
            const telemRes = await dashboardService.getSessionData(id);
            const data = Array.isArray(telemRes.data) ? telemRes.data : [];
            
            // Map _time to time for Recharts
            const formattedData = data.map(d => ({
                ...d,
                time: d._time ? new Date(d._time).toLocaleTimeString() : d.timestamp
            }));
            setTelemetry(formattedData);
        } catch (err) {
            console.warn("Failed to load telemetry", err);
        }

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

  const handleDownloadCsv = () => {
      const url = dashboardService.downloadSessionCsv(id);
      window.open(url, '_blank');
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

        <Card 
            className="timeline-card" 
            title="Recorded Data" 
            titleClassName="info-label"
            headerAction={
                <Button 
                   onClick={handleDownloadCsv}
                   variant="outline"
                   style={{ fontSize: '12px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                     <polyline points="7 10 12 15 17 10"></polyline>
                     <line x1="12" y1="15" x2="12" y2="3"></line>
                   </svg>
                   Download CSV
                </Button>
            }
        >
          <div className="timeline-placeholder" style={{ height: '400px', display: 'block' }}>
            {telemetry.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetry}>
                        <XAxis dataKey="time" minTickGap={50} stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="distance" stroke="#2563eb" dot={false} strokeWidth={2} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="temperature" stroke="#dc2626" dot={false} strokeWidth={2} />
                        <Line type="monotone" dataKey="humidity" stroke="#16a34a" dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: '150px' }}>
                  <p style={{ color: '#666' }}>No data recorded for this session.</p>
                </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};