import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Start Session (Create)
export const createSession = async (req, res) => {
    try {
        const { device_id, user_id } = req.body;

        if (!device_id) {
            return res.status(400).json({ message: "Device ID is required to start a session" });
        }

        // Verify Device Exists
        const device = await prisma.device.findUnique({
             where: { id: device_id } 
        });

        if (!device) {
             // Try searching by serial_number if ID fail
             const deviceBySn = await prisma.device.findUnique({
                 where: { serial_number: device_id }
             });
             
             if (!deviceBySn) {
                 return res.status(404).json({ message: "Device not found" });
             }
             // Use the UUID
             req.body.deviceUUID = deviceBySn.id;
        } else {
             req.body.deviceUUID = device.id;
        }

        const newSession = await prisma.session.create({
            data: {
                device_id: req.body.deviceUUID,
                user_id: user_id || null, // Optional
                start_time: new Date(),
            }
        });

        res.status(201).json(newSession);
    } catch (error) {
        console.error("Start Session Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// End Session (Update end_time)
export const endSession = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedSession = await prisma.session.update({
            where: { id: id },
            data: {
                end_time: new Date()
            }
        });

        res.json(updatedSession);
    } catch (error) {
        console.error("End Session Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get Sessions by Device
export const getSessionsByDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        console.log(`[DEBUG] Fetching sessions for deviceId (SN): ${deviceId}`);

        const whereClause = (deviceId === 'all' || !deviceId) ? {} : { 
            device: {
                serial_number: deviceId 
            }
        };

        console.log(`[DEBUG] Fetching sessions with filter:`, whereClause);

        const sessions = await prisma.session.findMany({
            where: whereClause,
            include: {
                device: {
                    select: { device_name: true, serial_number: true }
                }
            },
            orderBy: { start_time: 'desc' },
            take: 20
        });

        console.log(`[DEBUG] Found ${sessions.length} sessions`);
        res.json(sessions);
    } catch (error) {
         console.error("Get Sessions Error:", error);
         res.status(500).json({ error: error.message });
    }
}

// Get Single Session
export const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await prisma.session.findUnique({
            where: { id: id },
            include: {
                device: {
                    select: { device_name: true, serial_number: true }
                }
            }
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json(session);
    } catch (error) {
        console.error("Get Session Error:", error);
        res.status(500).json({ error: error.message });
    }
};
