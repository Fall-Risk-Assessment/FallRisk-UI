import { useState, useEffect } from "react";
import { deviceService } from "../services/deviceService.jsx";
import { profileService } from "../services/profileService.jsx";
import { userService } from "../services/userService.jsx";

export const useDeviceInventory = () => {
    const [deviceList, setDeviceList] = useState([]);
    const [profileList, setProfileList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({
        device_name: "",
        serial_number: "",
        profile_id: "",
        project_name: ""
    });

    async function fetchDevices() {
        try {
            const response = await deviceService.getDevices();
            setDeviceList(response.data);
        } catch (error) {
            console.error("Failed to fetch devices:", error);
        }
    }

    async function fetchProfiles() {
        try {
            const response = await profileService.getDeviceProfiles();
            setProfileList(response.data);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        }
    }

    async function fetchProjects() {
        try {
            const response = await userService.getProjects();
            setProjectList(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void Promise.all([fetchDevices(), fetchProfiles(), fetchProjects()]);
        }, 0);
        return () => window.clearTimeout(timer);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            try {
                await deviceService.deleteDevice(id);
                fetchDevices();
            } catch (error) {
                console.error("Failed to delete device:", error);
                alert("Failed to delete device");
            }
        }
    };

    const handleEdit = (device) => {
        setEditingId(device.id);
        const selectedProfile = profileList.find(p => p.name === device.profileName);
        setShowForm(true);
        setFormData({
            device_name: device.name,
            serial_number: device.serialNumber,
            profile_id: selectedProfile ? selectedProfile.id : "",
            project_name: device.project && device.project !== "-" ? device.project : ""
        });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.device_name || !formData.profile_id) {
                alert("Device Name and Profile are required");
                return;
            }

            const payload = {
                device_name: formData.device_name,
                serial_number: formData.serial_number,
                profile_id: formData.profile_id,
                project_name: formData.project_name || null
            };

            if (editingId) {
                await deviceService.updateDevice(editingId, payload);
                alert("Device updated successfully!");
            } else {
                await deviceService.createDevice(payload);
                alert("Device created successfully!");
            }

            resetForm();
            fetchDevices();
        } catch (error) {
            console.error("Failed to save device:", error);
            alert("Failed to save device: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            device_name: "",
            serial_number: "",
            profile_id: "",
            project_name: ""
        });
    };

    return {
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
    };
};
