import api from "../api/axios";

export const profileService = {
    getProfiles: () => api.get("/admin/get-profiles"), // Alias for consistent naming if needed, or use getAdminProfiles route
    // Checking deviceProfile.jsx: api.get("/admin/get-profiles")
    getDeviceProfiles: () => api.get("/admin/get-device-profiles"), // Used in Inventory for selection list
    createProfile: (data) => api.post("/admin/create-profile", data),
    updateProfile: (id, data) => api.put(`/admin/update-profile/${id}`, data),
    deleteProfile: (id) => api.delete(`/admin/delete-profile/${id}`),
};
