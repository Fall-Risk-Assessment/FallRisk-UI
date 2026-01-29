import api from "../api/axios";

export const userService = {
    getUsers: () => api.get("/admin/get-users"),
    getProjects: () => api.get("/admin/get-projects"),
    createUser: (data) => api.post("/admin/create-user", data),
    updateUser: (id, data) => api.put(`/admin/update-user/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/delete-user/${id}`),
};
