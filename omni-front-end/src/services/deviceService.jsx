import api from "../api/axios";

export const deviceService = {
    getDevices: () => api.get("/admin/get-devices"),
    createDevice: (data) => api.post("/admin/create-device", data),
    updateDevice: (id, data) => api.put(`/admin/update-device/${id}`, data),
    deleteDevice: (id) => api.delete(`/admin/delete-device/${id}`),
};
