import api from "../api/axios";

export const dashboardService = {
    getAdminProfiles: () => api.get("/admin/get-profiles"),
    getAdminDevices: () => api.get("/admin/get-devices"),
    getTelemetry: (id) => api.get(`/admin/get-telemetry/${id}`),
    createProfile: (data) => api.post("/admin/create-profile", data),
};
