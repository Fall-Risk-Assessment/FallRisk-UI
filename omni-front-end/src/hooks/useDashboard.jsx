import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService.jsx";
import { profileService } from "../services/profileService.jsx";

export const useDashboard = () => {
    const [profiles, setProfiles] = useState([]);
    const [stats, setStats] = useState({ totalDevices: 0, totalProfiles: 0 });
    const [isLoading, setIsLoading] = useState(false);

    // New Profile Modal State
    const [showCreateProfile, setShowCreateProfile] = useState(false);
    const [newProfileData, setNewProfileData] = useState({
        profile_id: "",
        name: "",
        type: "32x32 Grid",
        dataFormat: "",
        description: ""
    });

    // Edit Profile State
    const [editingProfileId, setEditingProfileId] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Profiles
            const { data: profileList } = await dashboardService.getAdminProfiles();

            // 2. Fetch Devices for stats
            const { data: allDevices } = await dashboardService.getAdminDevices();

            // 3. Fetch Telemetry for Online Status (Parallel)
            const devicesWithStatus = await Promise.all(
                allDevices.map(async (device) => {
                    try {
                        const lookupId = device.serialNumber || device.name;
                        const { data: telRes } = await dashboardService.getTelemetry(lookupId);
                        const telemetry = telRes.data || [];
                        const latestPoint = telemetry[telemetry.length - 1];
                        const isOnline = latestPoint && (new Date() - new Date(latestPoint.time) < 60000); // 1 min threshold
                        return { ...device, isOnline };
                    } catch {
                        return { ...device, isOnline: false };
                    }
                })
            );

            // 4. Group Counts by Profile
            const profileStats = {};
            profileList.forEach(p => {
                profileStats[p.profile_id] = { ...p, deviceCount: 0, onlineCount: 0 };
            });

            devicesWithStatus.forEach(device => {
                const pid = device.profileKey; // This comes from backend as profile.profile_id
                if (pid && profileStats[pid]) {
                    profileStats[pid].deviceCount++;
                    if (device.isOnline) profileStats[pid].onlineCount++;
                }
            });

            const finalProfiles = Object.values(profileStats);

            setProfiles(finalProfiles);
            setStats({
                totalDevices: devicesWithStatus.length,
                totalProfiles: finalProfiles.length
            });

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleCreateProfile = async () => {
        if (!newProfileData.profile_id || !newProfileData.name) {
            alert("Profile ID and Name are required");
            return;
        }
        try {
            await dashboardService.createProfile(newProfileData);
            alert("Profile Created!");
            setShowCreateProfile(false);
            setNewProfileData({ profile_id: "", name: "", type: "32x32 Grid", dataFormat: "", description: "" });
            fetchDashboardData();
        } catch (e) {
            console.error(e);
            alert("Failed");
        }
    };

    const handleEditProfile = (profile) => {
        setEditingProfileId(profile.id);
        setNewProfileData({
            profile_id: profile.profile_id,
            name: profile.name,
            type: profile.type || "32x32 Grid",
            dataFormat: profile.dataFormat || "",
            description: profile.description || ""
        });
        setShowCreateProfile(true);
    };

    const handleUpdateProfile = async () => {
        // Placeholder for update logic
        console.log("Updating profile", editingProfileId, newProfileData);
        alert("Update functionality coming soon!");
        setShowCreateProfile(false);
        setNewProfileData({ profile_id: "", name: "", type: "32x32 Grid", dataFormat: "", description: "" });
        setEditingProfileId(null);
    };

    const handleDeleteProfile = async (id) => {
        const profileToDelete = profiles.find(p => p.id === id);

        if (profileToDelete && profileToDelete.deviceCount > 0) {
            alert(`Cannot delete profile "${profileToDelete.name}" because it has ${profileToDelete.deviceCount} active device(s) linked to it.\n\nPlease delete the devices first.`);
            return;
        }

        if (window.confirm("Are you sure you want to delete this profile?")) {
            try {
                await profileService.deleteProfile(id);
                fetchDashboardData(); // Refresh dashboard
            } catch (error) {
                console.error("Failed to delete profile:", error);
                alert("Failed to delete profile");
            }
        }
    };

    return {
        profiles,
        stats,
        isLoading,
        showCreateProfile,
        setShowCreateProfile,
        newProfileData,
        setNewProfileData,
        fetchDashboardData,

        handleCreateProfile,
        editingProfileId,
        setEditingProfileId, // Exported in case we need to clear it directly
        handleEditProfile,
        handleUpdateProfile,
        handleDeleteProfile
    };
};
