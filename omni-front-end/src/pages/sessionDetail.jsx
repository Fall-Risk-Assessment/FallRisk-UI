import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added
import { sessionEvents } from "../mock/data.jsx";
import "../css/session.css";
import { Card } from "../components/common/Card";

export const SessionDetail = () => {
  const [selectedEvent, setSelectedEvent] = useState(sessionEvents[0]);
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
        <div style={{ marginBottom: '20px' }}>
          <Button
            className="btn-back-sessions"
            variant="secondary" // User asked for beauty, secondary usually looks clean, but let's check styles. Primary might be too strong? Let's stick to secondary but adding icon makes it look like a nav button.
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