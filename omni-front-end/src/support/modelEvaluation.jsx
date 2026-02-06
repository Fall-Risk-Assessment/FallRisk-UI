import React from "react";
import "../css/modelEvaluation.css";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

export const ModelEvaluation = () => {
    const models = [
        { id: "M-V5", name: "Pose Recognition v5", version: "5.0.0", accuracy: "94.2%", precision: "93.8%", recall: "95.0%", status: "Active (Production)" },
        { id: "M-V4", name: "Pose Recognition v4", version: "4.2.1", accuracy: "89.5%", precision: "88.0%", recall: "90.1%", status: "Archived" },
        { id: "M-V6-RC", name: "Pose Recognition v6 (RC)", version: "6.0.0-rc1", accuracy: "96.8%", precision: "97.0%", recall: "96.5%", status: "Under Review" },
    ];

    return (
        <div className="model-eval-container">
            <div className="eval-header">
                <div>
                    <h1>Model Evaluation</h1>
                    <p className="page-description">
                        Compare model performance, analyze metrics, and manage deployments.
                        Ensure the model meets success criteria before pushing to production.
                    </p>
                </div>
            </div>

            {/* Performance Overview (Top Metric) */}
            <div className="eval-grid-top">
                <Card title="Latest Model Performance (v6-RC)" className="highlight-card">
                    <div className="score-ring-container">
                        <div className="score-ring">
                            <span className="score">96.8%</span>
                            <span className="label">Accuracy</span>
                        </div>
                    </div>
                    <div className="mini-stats">
                        <div className="mini-stat">
                            <span className="label">Precision</span>
                            <span className="value">97.0%</span>
                        </div>
                        <div className="mini-stat">
                            <span className="label">Recall</span>
                            <span className="value">96.5%</span>
                        </div>
                        <div className="mini-stat">
                            <span className="label">F1-Score</span>
                            <span className="value">96.7%</span>
                        </div>
                    </div>
                </Card>

                <Card title="Confusion Matrix" className="matrix-card">
                    <div className="confusion-matrix-placeholder">
                        <div className="matrix-grid">
                            <div className="matrix-header"></div>
                            <div className="matrix-header">Sit</div>
                            <div className="matrix-header">Stand</div>
                            <div className="matrix-header">Walk</div>

                            <div className="matrix-header row">Sit</div>
                            <div className="cell high">98%</div>
                            <div className="cell low">1%</div>
                            <div className="cell low">1%</div>

                            <div className="matrix-header row">Stand</div>
                            <div className="cell low">2%</div>
                            <div className="cell high">95%</div>
                            <div className="cell medium">3%</div>

                            <div className="matrix-header row">Walk</div>
                            <div className="cell low">0%</div>
                            <div className="cell medium">4%</div>
                            <div className="cell high">96%</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Model Comparison Table */}
            <Card title="Model Version History & Comparison" className="comparison-card">
                <div className="table-responsive">
                    <table className="eval-table">
                        <thead>
                            <tr>
                                <th>Model Name</th>
                                <th>Version</th>
                                <th>Accuracy</th>
                                <th>Precision</th>
                                <th>Recall</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((m) => (
                                <tr key={m.id} className={m.status.includes("Active") ? "active-row" : ""}>
                                    <td className="fw-600">{m.name}</td>
                                    <td>{m.version}</td>
                                    <td>{m.accuracy}</td>
                                    <td>{m.precision}</td>
                                    <td>{m.recall}</td>
                                    <td>
                                        <span className={`status-dot ${getDotClass(m.status)}`}></span>
                                        {m.status}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Button className="btn-icon">Analyics</Button>
                                            {m.status !== "Active (Production)" && (
                                                <Button className="btn-outline">Deploy</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

// Helper for status dot color
const getDotClass = (status) => {
    if (status.includes("Active")) return "green";
    if (status.includes("Archived")) return "gray";
    return "blue"; // Under Review
};
