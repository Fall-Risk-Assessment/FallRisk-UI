import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import mqtt from 'mqtt';

// --- CONFIGURATION ---
const MQTT_BROKER = 'mqtt://localhost:1883';
const args = process.argv.slice(2);
const BAUD_RATE = parseInt(process.env.BAUD_RATE) || parseInt(args[0]) || 460800; // Default to 460800 if not set
console.log(`ℹ️ Configured Baud Rate: ${BAUD_RATE}`);

// --- MQTT SETUP ---
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
    console.log('✅ Connected to MQTT Broker');
});

// --- STATE VARIABLES ---
let port;
let parser;
let currentDeviceId = "unknown_device";
let currentProfileId = "unknown_profile";

// Parsing State
let isReadingMatrix = false;
let matrixBuffer = [];

// --- AUTO-DISCOVERY & CONNECTION LOGIC ---
async function autoConnect() {
    try {
        if (port && port.isOpen) return;

        console.log("🔎 Scanning Serial Ports...");
        const ports = await SerialPort.list();
        
        // Filter logic: Find ports that look like Arduino or USB Serial
        const validPort = ports.find(p => 
            p.manufacturer?.includes('Arduino') || 
            (p.path.startsWith('COM') && p.path !== 'COM1' && p.path !== 'COM2') ||
            p.path.includes('usb')
        );

        if (!validPort) {
            console.log("⚠️ No suitable Arduino found. Retrying in 5s...");
            setTimeout(autoConnect, 5000);
            return;
        }

        console.log(`🔌 Found Potential Device: ${validPort.path} (${validPort.manufacturer || 'Generic'})`);
        connectToPort(validPort.path);

    } catch (err) {
        console.error("Scanning Error:", err);
        setTimeout(autoConnect, 5000);
    }
}

function connectToPort(path) {
    if (port && port.isOpen) return;

    port = new SerialPort({ path: path, baudRate: BAUD_RATE, autoOpen: false });
    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.open((err) => {
        if (err) {
            console.error(`❌ Failed to open ${path}:`, err.message);
            console.log("Retry scanning in 5s...");
            setTimeout(autoConnect, 5000);
            return;
        }
        console.log(`✅ Serial Port Opened: ${path}`);
    });

    port.on('close', () => {
        console.warn('⚠️ Port Closed. Reconnecting...');
        port = null; // Clear port instance
        setTimeout(autoConnect, 3000);
    });

    port.on('error', (err) => {
        console.error('❌ Port Error:', err.message);
        if (!port.isOpen) {
             setTimeout(autoConnect, 5000); 
        }
    });

    // Attach data listener
    parser.on('data', handleSerialData);
}

// --- DATA HANDLING LOGIC ---
function handleSerialData(data) {
    try {
        const cleanData = data.toString().replace(/[\x00-\x1F\x7F]/g, "").trim();

        // --- HANDSHAKE PARSING ---
        if (cleanData.startsWith("HANDSHAKE|")) {
            const parts = cleanData.split('|');
            if (parts.length >= 3) {
                currentDeviceId = parts[1];
                currentProfileId = parts[2];
                console.log(`🤝 Handshake Received! Device: ${currentDeviceId}, Profile: ${currentProfileId}`);
            }
            return;
        }

        // --- MATRIX PARSING (Dynamic Size) ---
        if (cleanData === "TABLE") {
            // If we have a previous buffer filled, publish it now (End of previous frame)
            if (matrixBuffer.length > 0) {
                 const payload = {
                    device_id: currentDeviceId, 
                    profile_id: currentProfileId,
                    data: matrixBuffer,
                    timestamp: new Date().toISOString()
                };
                mqttClient.publish(`iot/${payload.device_id}/telemetry`, JSON.stringify(payload));
                console.log(`🚀 Published Matrix Frame: ${matrixBuffer.length} rows (ID: ${currentDeviceId})`);
            }
            
            // Start new frame
            isReadingMatrix = true;
            matrixBuffer = [];
            return;
        }

        if (isReadingMatrix) {
            // Validate row data
            const row = cleanData.split(' ').map(Number);
            
            // Heuristic: If it looks like a valid row of numbers, add it
            if (row.length > 1 && !row.some(isNaN)) {
                matrixBuffer.push(row);
            } else if (cleanData.includes('|')) {
                // Safety: If we see a pipe '|', it might be a standard packet interrupt
                isReadingMatrix = false;
                // Don't return, let it flow to standard parsing below
            } else {
                return; // Ignore garbage lines
            }
            return; // Stay in matrix mode
        }

        // --- STANDARD PARSING ---
        // Expected Format: "DEVICE_ID|PROFILE_ID|JSON_DATA"
        console.log(`📥 Received: ${cleanData}`);

        const parts = cleanData.split('|');
        if (parts.length < 3) {
            return;
        }

        const deviceId = parts[0];
        const profileId = parts[1];
        const rawJson = parts.slice(2).join('|');
        const metrics = JSON.parse(rawJson);

        const payload = {
            device_id: deviceId,
            profile_id: profileId,
            timestamp: new Date().toISOString(),
            ...metrics
        };

        const topic = `iot/${deviceId}/telemetry`;
        mqttClient.publish(topic, JSON.stringify(payload));
        console.log(`🚀 Published to [${topic}]`);

    } catch (err) {
        console.error('❌ Error processing serial data:', err);
        isReadingMatrix = false; // Reset on error
        matrixBuffer = [];
    }
}

// Start the process
autoConnect();
