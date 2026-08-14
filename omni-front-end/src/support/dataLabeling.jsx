import React from "react";
import "../css/dataLabeling.css";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

export const DataLabeling = () => {
    // Mock data for datasets
    const datasets = [
        { id: "DS-2023-001", name: "Morning Routine V1", samples: 1200, labeled: 1200, status: "Completed", date: "2023-10-15" },
        { id: "DS-2023-002", name: "Gym Workout A", samples: 850, labeled: 400, status: "In Progress", date: "2023-10-20" },
        { id: "DS-2023-003", name: "Office Ergonomics", samples: 2000, labeled: 0, status: "Pending", date: "2023-10-22" },
        { id: "DS-2023-004", name: "Walking Variations", samples: 500, labeled: 0, status: "Pending", date: "2023-10-25" },
    ];

    return (
        <div className="data-labeling-container">
            <div className="labeling-header">
                <div>
                    <h1>Data Labeling</h1>
                    <p className="page-description">
                        Curate and label datasets to improve model accuracy.
                        High-quality labeled data is the foundation of effective machine learning.
                    </p>
                </div>
                <Button className="import-btn">
                    + Import New Data
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="labeling-stats-grid">
                <Card className="stat-card">
                    <h3>Total Samples</h3>
                    <div className="stat-value">4,550</div>
                </Card>
                <Card className="stat-card">
                    <h3>Labeled</h3>
                    <div className="stat-value text-green">1,600</div>
                    <div className="stat-sub">35% coverage</div>
                </Card>
                <Card className="stat-card">
                    <h3>Pending</h3>
                    <div className="stat-value text-orange">2,950</div>
                    <div className="stat-sub">Action Required</div>
                </Card>
            </div>

            {/* Datasets List */}
            <Card title="Datasets & Sessions" className="datasets-card">
                <div className="table-responsive">
                    <table className="labeling-table">
                        <thead>
                            <tr>
                                <th>Dataset Name</th>
                                <th>Date Created</th>
                                <th>Samples</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datasets.map((ds) => (
                                <tr key={ds.id}>
                                    <td className="fw-500">{ds.name}</td>
                                    <td>{ds.date}</td>
                                    <td>{ds.samples}</td>
                                    <td>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${(ds.labeled / ds.samples) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">
                                            {ds.labeled} / {ds.samples}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${ds.status.toLowerCase().replace(" ", "-")}`}>
                                            {ds.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Button className="action-btn-sm" onClick={() => console.log("Label", ds.id)}>
                                            {ds.status === "Completed" ? "Review" : "Label"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Labeling Interface Placeholder (e.g. for the next step) */}
            <Card title="Quick Labeling Queue (Preview)" className="quick-label-card">
                <div className="placeholder-labeling-ui">
                    <div className="frame-viewer">
                        {/* Placeholder for video frame or sensor visual */}
                        <div className="frame-placeholder">
                            <span>Visualization Area</span>
                        </div>
                    </div>
                    <div className="label-controls">
                        <h4>Select Activity</h4>
                        <div className="label-buttons">
                            <button className="label-tag">Sitting</button>
                            <button className="label-tag">Standing</button>
                            <button className="label-tag">Walking</button>
                            <button className="label-tag">Running</button>
                            <button className="label-tag add-new">+ Add Label</button>
                        </div>
                        <div className="control-actions">
                            <Button variant="secondary">Skip</Button>
                            <Button>Save & Next</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
