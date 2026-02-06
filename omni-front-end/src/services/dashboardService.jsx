import api from "../api/axios";

export const dashboardService = {
    getAdminProfiles: () => api.get("/admin/get-profiles"),
    getAdminDevices: () => api.get("/admin/get-devices"),
    getTelemetry: (id) => api.get(`/admin/get-telemetry/${id}`),
    createProfile: (data) => api.post("/admin/create-profile", data),

    // Session Recording
    startSession: (deviceId, userId) => api.post("/admin/create-session", { device_id: deviceId, user_id: userId }),
    endSession: (sessionId) => api.put(`/admin/end-session/${sessionId}`),
    getSessions: (deviceId) => api.get(`/admin/get-sessions/${deviceId}`),
    getSession: (id) => api.get(`/admin/get-session/${id}`),
    getSessionData: (id) => api.get(`/admin/get-session-data/${id}`),
    downloadSessionCsv: (id) => api.get(`/admin/export-session/${id}`, { responseType: 'blob' }),
};
