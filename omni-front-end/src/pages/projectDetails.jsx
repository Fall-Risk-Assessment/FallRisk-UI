import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/projectDetails.css";
// import "../css/modal.css"; // Replaced by Common Modal
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { Modal } from "../components/common/Modal";
import { Card } from "../components/common/Card";

// Helper for formatting time
const formatTime = (isoString) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Threshold for Online Status
const IS_ONLINE_THRESHOLD_MS = 60000; // 1 minute

export const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [projectDevices, setProjectDevices] = useState([]);
    const [pageTitle, setPageTitle] = useState("Device Inventory");
    const [isLoading, setIsLoading] = useState(true);

    // Add Device Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [profileList, setProfileList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [newDeviceData, setNewDeviceData] = useState({
        device_name: "",
        serial_number: "",
        profile_id: "",
        project_name: ""
    });

    const [editingDevice, setEditingDevice] = useState(null);

    const fetchProjectData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: allDevices } = await api.get("/admin/get-devices");

            // Logic: 'id' in URL is Profile ID (Profile Key)
            const devicesInProfile = allDevices.filter(d => d.profileKey === id);

            let targetDevices = [];
            let title = "Unknown Profile";

            if (devicesInProfile.length > 0) {
                targetDevices = devicesInProfile;
                title = devicesInProfile[0].profileName || id;
                // If we found devices, set the default profile_id for adding new ones
                setNewDeviceData(prev => ({ ...prev, profile_id: devicesInProfile[0].profileKey })); // Assuming profileKey is UUID or acceptable format
            } else {
                // Fallback: Check if it's a device ID
                const mainDevice = allDevices.find(d => String(d.id) === id || String(d.serialNumber) === id);
                if (mainDevice) {
                    title = mainDevice.profileName || mainDevice.name;
                    if (mainDevice.profileKey) {
                        targetDevices = allDevices.filter(d => d.profileKey === mainDevice.profileKey);
                    } else {
                        targetDevices = [mainDevice];
                    }
                } else {
                    title = id;
                    targetDevices = [];
                }
            }

            setPageTitle(title);

            // Fetch Telemetry
            const devicesWithData = await Promise.all(
                targetDevices.map(async (device) => {
                    try {
                        const lookupId = device.serialNumber || device.name;
                        const { data: telRes } = await api.get(`/admin/get-telemetry/${lookupId}`);
                        const telemetry = telRes.data || [];
                        const latestPoint = telemetry[telemetry.length - 1];

                        const isOnline = latestPoint &&
                            (new Date() - new Date(latestPoint.time) < IS_ONLINE_THRESHOLD_MS);

                        return {
                            ...device,
                            history: telemetry,
                            latestValue: latestPoint?.value ?? null,
                            isOnline: !!isOnline,
                            lastUpdated: latestPoint ? latestPoint.time : null
                        };
                    } catch (e) {
                        return { ...device, isOnline: false, lastUpdated: null };
                    }
                })
            );

            setProjectDevices(devicesWithData);

        } catch (error) {
            console.error("Failed to load project details", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchProfiles = async () => {
        try {
            const response = await api.get("/admin/get-device-profiles");
            setProfileList(response.data);
            // Auto-select profile if it matches ID
            const match = response.data.find(p => p.profile_id === id);
            if (match) {
                setNewDeviceData(prev => ({ ...prev, profile_id: match.id }));
            }
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get("/admin/get-projects");
            setProjectList(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleAddDevice = async () => {
        try {
            if (!newDeviceData.device_name || !newDeviceData.profile_id) {
                alert("Device Name and Profile are required");
                return;
            }

            const payload = {
                device_name: newDeviceData.device_name,
                serial_number: newDeviceData.serial_number,
                profile_id: newDeviceData.profile_id,
                project_name: newDeviceData.project_name || null
            };

            await api.post("/admin/create-device", payload);
            alert("Device added successfully!");
            setShowAddModal(false);
            setNewDeviceData({ device_name: "", serial_number: "", profile_id: "", project_name: "" });
            fetchProjectData();
        } catch (error) {
            console.error("Failed to add device:", error);
            alert("Failed to add device: " + (error.response?.data?.message || error.message));
        }
    };

    const openAddModal = () => {
        fetchProfiles();
        fetchProjects();
        setShowAddModal(true);
    };

    const handleEditDevice = (device) => {
        console.log("Edit device:", device);
        setEditingDevice(device);
        setNewDeviceData({
            device_name: device.name || "",
            serial_number: device.serialNumber || "",
            // Use profileKey from device if available, otherwise try matching via other means
            profile_id: device.profileKey || (profileList.find(p => p.name === device.type)?.id) || "",
            project_name: device.projectName || ""
        });
        // Ensure profiles are loaded
        fetchProfiles();
        setShowAddModal(true);
    };

    const handleUpdateDevice = async () => {
        try {
            if (!newDeviceData.device_name || !newDeviceData.profile_id) {
                alert("Device Name and Profile are required");
                return;
            }

            const payload = {
                device_name: newDeviceData.device_name,
                serial_number: newDeviceData.serial_number,
                profile_id: newDeviceData.profile_id,
                project_name: newDeviceData.project_name || null,
                // Status not exposed in form yet, but could be added
            };

            await api.put(`/admin/update-device/${editingDevice.id}`, payload);

            alert("Device updated successfully!");
            setShowAddModal(false);
            setEditingDevice(null);
            setNewDeviceData({ device_name: "", serial_number: "", profile_id: "", project_name: "" });
            fetchProjectData(); // Refresh to show changes from backend
        } catch (error) {
            console.error("Failed to update device:", error);
            alert("Failed to update device: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteDevice = async (deviceId) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            try {
                await api.delete(`/admin/delete-device/${deviceId}`);
                // Remove locally to be snappy
                setProjectDevices(prev => prev.filter(d => d.id !== deviceId));
                // fetchProjectData(); // Optional: ensure sync
            } catch (error) {
                console.error("Failed to delete device:", error);
                alert("Failed to delete device: " + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="project-details-container">
            <div className="project-header">
                <h1 className="project-title">{pageTitle}</h1>
                <div className="header-actions">
                    <Button
                        className="btn-add-device"
                        onClick={openAddModal}
                    >
                        + Add Device
                    </Button>
                </div>
            </div>

            <div className="quick-stats">
                <Card className="stat-box" style={{ padding: '16px' }}>
                    <h3>{projectDevices.length}</h3>
                    <p>Total Devices</p>
                </Card>
                <Card className="stat-box" style={{ padding: '16px' }}>
                    <h3>{projectDevices.filter(d => d.isOnline).length}</h3>
                    <p>Devices Online</p>
                </Card>
                <Card className="stat-box" style={{ padding: '16px' }}>
                    <h3>{projectDevices.filter(d => d.isOnline).length > 0 ? "Active" : "Idle"}</h3>
                    <p>Status</p>
                </Card>
            </div>

            {/* View Live Button (Between Sections) */}
            <div className="view-live-btn-wrapper">
                <Button
                    className="view-live-btn"
                    onClick={() => navigate(`/live-monitor?profile=${id}`)}
                >
                    View Live Monitor
                </Button>
            </div>

            {/* Add/Edit Device Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingDevice(null);
                    setNewDeviceData({ device_name: "", serial_number: "", profile_id: "", project_name: "" });
                }}
                title={editingDevice ? "Edit Device" : "New Device"}
                footer={
                    <>
                        <Button
                            onClick={editingDevice ? handleUpdateDevice : handleAddDevice}
                            className="btn-submit"
                        >
                            {editingDevice ? "Update Device" : "Create Device"}
                        </Button>
                        <Button
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingDevice(null);
                                setNewDeviceData({ device_name: "", serial_number: "", profile_id: "", project_name: "" });
                            }}
                            className="btn-cancel"
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                <div className="add-user-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Device Name */}
                    <div>
                        <Input
                            label="Device Name (Friendly)"
                            placeholder="e.g., Living Room Sensor"
                            value={newDeviceData.device_name}
                            onChange={(e) => setNewDeviceData({ ...newDeviceData, device_name: e.target.value })}
                        />
                    </div>

                    {/* Serial Number */}
                    <div>
                        <Input
                            label="Hardware ID (Serial Number)"
                            placeholder="e.g., Arduino_Ult_01"
                            value={newDeviceData.serial_number}
                            onChange={(e) => setNewDeviceData({ ...newDeviceData, serial_number: e.target.value })}
                        />
                        <small className="helper-text" style={{ fontSize: '11px', color: '#666', marginTop: '-12px', display: 'block' }}>Must match the ID in your Arduino Code</small>
                    </div>

                    {/* Device Profile */}
                    <div>
                        <Select
                            label="Device Profile (Type)"
                            value={newDeviceData.profile_id}
                            onChange={(e) => setNewDeviceData({ ...newDeviceData, profile_id: e.target.value })}
                            options={[
                                { value: "", label: "Select Profile" },
                                ...profileList.map(p => ({
                                    value: p.id,
                                    label: `${p.name} (Type: ${p.type || 'N/A'})`
                                }))
                            ]}
                        />
                    </div>

                </div>
            </Modal>

            {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading Project Data...</div>
            ) : projectDevices.length > 0 ? (
                <div className="device-grid">
                    {projectDevices.map((device) => (
                        <Card
                            key={device.id}
                            className="project-device-card"
                            title={device.name}
                            titleClassName="device-name"
                            headerAction={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className={`status-badge ${device.isOnline ? 'online' : 'offline'}`}
                                        style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', backgroundColor: device.isOnline ? '#dcfce7' : '#f3f4f6', color: device.isOnline ? '#166534' : '#6b7280' }}>
                                        {device.isOnline ? 'ONLINE' : 'OFFLINE'}
                                    </div>
                                    <Button
                                        className="profile-card-action-btn"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditDevice(device);
                                        }}
                                        title="Edit Device"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </Button>
                                    <Button
                                        className="profile-card-action-btn"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteDevice(device.id);
                                        }}
                                        title="Delete Device"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </Button>
                                </div>
                            }
                        >
                            <div className="device-info-row">
                                Type: {device.type || "Sensor"}
                            </div>
                            <div className="device-info-row">
                                Serial: {device.serialNumber}
                            </div>
                            <div className="device-info-row">
                                Updated: {formatTime(device.lastUpdated)}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>No Devices Found</h3>
                    <p>There are no devices in this project yet.</p>
                    <Button
                        className="btn-add-device"
                        onClick={openAddModal}
                    >
                        + Add Device
                    </Button>
                </div>
            )}
        </div>
    );
};
