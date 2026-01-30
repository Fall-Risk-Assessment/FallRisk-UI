import React from "react";
import "../css/userManagement.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { useDeviceInventory } from "../hooks/useDeviceInventory.jsx";

export const DeviceInventory = () => {
    const {
        deviceList,
        profileList,
        projectList,
        showForm,
        setShowForm,
        editingId,
        formData,
        handleInputChange,
        handleDelete,
        handleEdit,
        handleSubmit,
        resetForm
    } = useDeviceInventory();

    return (
        <div>
            <div className="user-management-header device-inventory-header">
                <div>
                    <h2 className="header-title">Device Inventory</h2>
                    <p className="header-subtitle">Manage physical devices and assign them to projects</p>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="color-btn"
                    >
                        + Add Device
                    </Button>
                )}
            </div>

            <Modal
                className="device-inventory-modal"
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title={editingId ? "Edit Device" : "New Device"}
                footer={
                    <>
                        <Button
                            onClick={handleSubmit}
                            variant="primary"
                            className="color-btn"
                        >
                            {editingId ? "Update Device" : "Create Device"}
                        </Button>
                        <Button
                            onClick={resetForm}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <div className="add-user-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {/* Device Name */}
                    <div>
                        <Input
                            label="Device Name (Friendly)"
                            name="device_name"
                            placeholder="e.g., Living Room Sensor"
                            value={formData.device_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Serial Number / Hardware ID */}
                    <div>
                        <Input
                            label="Hardware ID (Serial Number)"
                            name="serial_number"
                            placeholder="e.g., Arduino_Ult_01"
                            value={formData.serial_number}
                            onChange={handleInputChange}
                        />
                        <small className="helper-text" style={{ display: 'block', marginTop: '-12px', marginBottom: '16px', color: '#666', fontSize: '12px' }}>Must match the ID in your Arduino Code</small>
                    </div>

                    {/* Device Profile */}
                    <div>
                        <Select
                            label="Device Profile (Type)"
                            name="profile_id"
                            value={formData.profile_id}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select Profile" }, // Default option
                                ...profileList.map(profile => ({
                                    value: profile.id,
                                    label: `${profile.name} (Type: ${profile.type || 'N/A'})`
                                }))
                            ]}
                        />
                    </div>
                </div>
            </Modal>

            <div className="user-table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Device Name</th>
                            <th>Hardware ID</th>
                            <th>Profile</th>
                            <th>Project</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceList.map((device) => (
                            <tr key={device.id}>
                                <td>
                                    <strong>{device.name}</strong>
                                </td>
                                <td>
                                    <code>{device.serialNumber || '-'}</code>
                                </td>
                                <td>{device.profileName}</td>
                                <td>{device.project}</td>
                                <td>
                                    <span className={`status-badge ${device.status}`}>
                                        {device.status}
                                    </span>
                                </td>
                                <td>{new Date(device.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Button
                                            className="table-action-btn"
                                            aria-label="Edit"
                                            onClick={() => handleEdit(device)}
                                            variant="outline"
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </Button>
                                        <Button
                                            className="table-action-btn"
                                            aria-label="Delete"
                                            onClick={() => handleDelete(device.id)}
                                            variant="outline"
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {deviceList.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No devices found. Add one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
