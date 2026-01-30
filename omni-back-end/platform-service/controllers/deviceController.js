import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create Device
export const createDevice = async (req, res) => {
    try {
        const { device_name, profile_id, project_name } = req.body;

        if (!device_name || !profile_id) {
            return res.status(400).json({ message: "Device name and Profile are required" });
        }

        const serialNumber = req.body.serial_number || `UNKNOWN_${Date.now()}`;

        // Check for duplicate serial number
        const existingDevice = await prisma.device.findUnique({
            where: { serial_number: serialNumber }
        });

        if (existingDevice) {
            return res.status(400).json({ message: `Device with Serial Number '${serialNumber}' already exists.` });
        }

        // 2. Create Device
        // Note: profile_id coming from frontend is likely the UUID of the device_profile table
        const newDevice = await prisma.device.create({
            data: {
                device_name: device_name,
                serial_number: serialNumber, 
                device_profile_id: profile_id, // This is the UUID FK
                status: 'OFFLINE'
            }
        });

        res.status(201).json(newDevice);
    } catch (error) {
        console.error("Create Device Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update Device
export const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { device_name, serial_number, profile_id, status } = req.body;

        const updateData = {};
        if (device_name) updateData.device_name = device_name;
        if (serial_number) {
            // Check uniqueness if changing SN
            const existing = await prisma.device.findUnique({ where: { serial_number } });
            if (existing && existing.id !== id) {
                return res.status(400).json({ message: "Serial Number available" });
            }
            updateData.serial_number = serial_number;
        }
        if (profile_id) updateData.device_profile_id = profile_id;
        if (status) updateData.status = status;

        const updatedDevice = await prisma.device.update({
            where: { id: id },
            data: updateData
        });

        res.json(updatedDevice);
    } catch (error) {
        console.error("Update Device Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get All Devices
export const getAllDevices = async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            include: {
                profile: true
            }
        });

        const formattedDevices = devices.map(device => ({
            id: device.id,
            name: device.device_name,
            serialNumber: device.serial_number,
            project: "-", // Project removed
            profileName: device.profile.name,
            profileKey: device.profile.profile_id, // e.g. "yoga_mat_v1"
            type: device.profile.data_type, // Map data_type to type
            status: device.status,
            createdAt: device.created_at
        }));

        res.json(formattedDevices);
    } catch (error) {
        console.error("Get Devices Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete Device
export const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.device.delete({
            where: { id: id }
        });
        res.json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  