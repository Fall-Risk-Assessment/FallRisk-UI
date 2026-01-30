import { useState, useEffect } from "react";
import { userService } from "../services/userService.jsx";

export const useUserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        Username: "",
        email: "",
        password: "",
        role: "User",
        project: "Yoga Research Lab",
        status: "Active"
    });

    // Filter State
    const [filterRole, setFilterRole] = useState("All Roles");
    const [filterProject, setFilterProject] = useState("All Projects");

    useEffect(() => {
        fetchUsers();
        fetchProjects();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getUsers();
            setUserList(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await userService.getProjects();
            setProjectList(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        const titleCaseRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();

        setFormData({
            Username: user.name,
            email: user.email,
            password: "",
            role: titleCaseRole,
            project: user.project,
            status: user.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                username: formData.Username,
                email: formData.email,
                password: formData.password || "default123",
                role_name: formData.role,
                project_name: formData.project,
                status: formData.status
            };

            if (editingId) {
                await userService.updateUser(editingId, payload);
                alert("User updated successfully!");
            } else {
                if (!formData.Username || !formData.email || !formData.password) {
                    alert("Please fill in all required fields (Username, Email, Password)");
                    return;
                }
                await userService.createUser(payload);
                alert("User created successfully!");
            }
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error("Failed to save user:", error);
            alert("Failed to save user: " + (error.response?.data?.message || error.message));
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            Username: "",
            email: "",
            password: "",
            role: "User",
            project: "Yoga Research Lab",
            status: "Active"
        });
    };

    // Filter Logic
    const filteredUserList = userList.filter(user => {
        const matchesRole = filterRole === "All Roles" || (user.role && user.role.toLowerCase() === filterRole.toLowerCase());
        const matchesProject = filterProject === "All Projects" || (user.project && user.project.toLowerCase() === filterProject.toLowerCase());
        return matchesRole && matchesProject;
    });

    return {
        userList,
        projectList,
        showForm,
        setShowForm,
        editingId,
        setEditingId,
        formData,
        setFormData,
        handleInputChange,
        handleEdit,
        handleDelete,
        handleSubmit,
        resetForm,
        // Filter Exports
        filteredUserList,
        filterRole,
        setFilterRole,
        filterProject,
        setFilterProject
    };
};
