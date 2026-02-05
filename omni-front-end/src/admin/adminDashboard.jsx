import React from "react";
import "../css/adminDashboard.css";
import { Card } from "../components/common/Card";

export const AdminDashboard = () => {
  /* Stats with Icons */
  const stats = [
    {
      label: "Total Users",
      value: "147",
      change: "+12 this month",
      trendClass: "trend-up",
      iconClass: "icon-blue",
      color: "#2196F3",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      label: "Device Profiles",
      value: "8",
      change: "3 active types",
      trendClass: "trend-neutral",
      iconClass: "icon-teal",
      color: "#00b894",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      )
    },
    {
      label: "Active Sessions",
      value: "23",
      change: "Real-time",
      trendClass: "trend-up",
      iconClass: "icon-green",
      color: "#8b8d8bff",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      )
    },
    {
      label: "System Alerts",
      value: "2",
      change: "Needs attention",
      trendClass: "trend-down",
      iconClass: "icon-red",
      color: "#ef4444",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    },
  ];

  return (
    <div className="admin-container">
      {/* ส่วนบน: Stats Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat, idx) => (
          <Card key={idx} className="metric-card" style={{ borderLeft: `5px solid ${stat.color}` }}>
            <div className={`metric-icon ${stat.iconClass}`}>
              {stat.icon}
            </div>
            <span className="metric-label">{stat.label}</span>
            <h3 className="metric-value">{stat.value}</h3>
            <span className={`metric-trend ${stat.trendClass}`}>
              {stat.change}
            </span>
          </Card>
        ))}
      </div>

      <div className="admin-middle-row">
        {/* ส่วนกลางขวา: Quick Actions (Swapped to Left) */}
        <Card className="card flex-1" title="Quick Actions" titleClassName="section-title">
          <div className="quick-actions-list">
            {[
              { title: "New Project", desc: "Define a new project" },
              { title: "Add New User", desc: "Create account and assign role" },
              { title: "View System Logs", desc: "Check API performance and errors" }
            ].map((action, idx) => (
              <div key={idx} className="quick-action-item">
                <h4 className="quick-action-title">{action.title}</h4>
                <p className="quick-action-desc">{action.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ส่วนกลางซ้าย: Recent User Activity (Swapped to Right) */}
        <Card className="card flex-1" title="Recent User Activity">
          <div className="user-activity-list">
            {["Sarah Chen", "Dr. Martinez", "John Smith"].map((user, i) => (
              <div key={i} className="user-activity-item">
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21C20 18.2386 17.7614 16 15 16H9C6.23858 16 4 18.2386 4 21" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="#95A5A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="activity-text"><strong>{user}</strong> started a new session</p>
                  <p className="activity-time">{i + 2} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ส่วนล่าง: Project Data Isolation & System Status */}
      <div className="admin-bottom-row">
        <Card className="card flex-3" title="Project Data Isolation">
          <div className="project-grid">
            {["Yoga Research Lab", "Physical Therapy Clinic", "Sports Performance"].map((project, idx) => (
              <div key={idx} className="project-card">
                <h4 className="project-title">{project}</h4>
                <div className="mt-auto">
                  <div className="project-stat-row">
                    <span>Users</span><span className="project-stat-val">{45 + idx * 10}</span>
                  </div>
                  <div className="project-stat-row">
                    <span>Devices</span><span className="project-stat-val">{3 + idx}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Status (Moves here) */}
        <Card className="card flex-1" title="System Status">
          <div className="system-status-list">
            {[
              { label: "API Server", status: "Online" },
              { label: "Database", status: "Online" },
              { label: "ML Service", status: "Online" },
              { label: "Storage", status: "78% Used" }
            ].map((item, idx) => (
              <div key={idx} className="system-status-item">
                <span className="status-label">{item.label}</span>
                <div className="status-badge-outline">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};