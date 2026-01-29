import { useState, useEffect } from "react";
import { profileService } from "../services/profileService.jsx";

export const useDeviceProfile = () => {
    const [profiles, setProfiles] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        profile_id: "",
        name: "",
        type: "32x32 Grid",
        dataFormat: "",
        description: ""
    });

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const response = await profileService.getProfiles();
            setProfiles(response.data);
        } catch (error) {
            console.error("Failed to fetch profiles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (profile) => {
        setEditingId(profile.id);
        setFormData({
            profile_id: profile.profile_id,
            name: profile.name,
            type: profile.type || "32x32 Grid",
            dataFormat: profile.dataFormat || "JSON",
            description: profile.description || ""
        });
        setShowCreateForm(true);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.profile_id || !formData.name) {
                alert("Profile ID and Name are required");
                return;
            }

            if (editingId) {
                await profileService.updateProfile(editingId, formData);
                alert("Profile updated successfully!");
            } else {
                await profileService.createProfile(formData);
                alert("Profile created successfully!");
            }

            fetchProfiles();
            resetForm();
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save profile: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            try {
                await profileService.deleteProfile(id);
                fetchProfiles();
            } catch (error) {
                console.error("Failed to delete profile:", error);
                alert("Failed to delete profile");
            }
        }
    };

    const resetForm = () => {
        setShowCreateForm(false);
        setEditingId(null);
        setFormData({
            profile_id: "",
            name: "",
            type: "32x32 Grid",
            dataFormat: "",
            description: ""
        });
    };

    return {
        profiles,
        showCreateForm,
        setShowCreateForm,
        isLoading,
        editingId,
        formData,
        handleInputChange,
        handleEdit,
        handleSubmit,
        handleDelete,
        resetForm
    };
};
