# คู่มือการทำงานและการรันระบบ Omni Project (ฉบับปรับปรุง Data Flow)

เอกสารนี้อธิบายความาสัมพันธ์ของแต่ละส่วนในระบบ วิธีการรัน และเส้นทางการไหลของข้อมูลแบบละเอียด

---

## 1. ภาพรวมระบบ (Architecture Overview)

ระบบประกอบด้วย 5 ส่วนหลักที่ทำงานร่วมกัน:

1.  **Arduino (Device)**: `Hardware`
    - ทำหน้าที่: อ่านค่าจาก Sensor (Pressure Mat, Distance, Temp)
    - การส่งข้อมูล: ส่งผ่านสาย USB (Serial Port) เข้ามาที่คอมพิวเตอร์
2.  **Serial Bridge (เดิมคือ Gateway)**: `Backend (Bridge)`
    - ทำหน้าที่: เป็นคนกลางคอยอ่านข้อมูลจาก USB แล้วโยนใส่ตะกร้ากลาง (MQTT)
    - สำคัญ: ไม่เก็บข้อมูล แปลงข้อมูลดิบให้เป็น JSON แล้วส่งต่อทันที
3.  **MQTT Broker**: `Infrastructure`
    - ทำหน้าที่: เป็นไปรษณีย์กลาง (Message Broker) ใครอยากส่งก็ส่งมาที่นี่ ใครอยากรับก็มารอรับที่นี่
4.  **Platform Service**: `Backend (Main API)`
    - ทำหน้าที่: สมองกลหลัก เชื่อมต่อ Database และส่งข้อมูล Real-time ไปหน้าเว็บ
    - สำคัญ: รับข้อมูลจาก MQTT แล้วยิงต่อให้ Frontend ผ่าน Socket.IO
5.  **Frontend**: `Web Application`
    - ทำหน้าที่: แสดงผลกราฟและข้อมูลให้ผู้ใช้เห็น

---

## 2. ขั้นตอนการรันระบบ (Step-by-Step)

ต้องเปิด Terminal (หน้าต่างคำสั่ง) ทั้งหมด 5 หน้าต่างแยกกัน และรันค้างไว้ทุกตัวครับ

### 🟢 Terminal 1: MQTT Broker (ไปรษณีย์กลาง)

ต้องรันตัวนี้ก่อนเพื่อนเสมอ ถ้าตัวนี้ไม่เปิด ตัวอื่นจะคุยกันไม่รู้เรื่อง
(ถ้าติดตั้งแบบ Service ไว้แล้ว มันจะรันเอง แต่ถ้ารันมือให้ใช้คำสั่งนี้)

```bash
# ตัวอย่างสำหรับ Mosquitto
mosquitto -v
```

_(ถ้าคุณใช้ Windows Service อยู่แล้ว ข้ามข้อนี้ได้เลยครับ แค่เช็คว่า Service 'Mosquitto' รันอยู่ก็พอ)_

### 🟢 Terminal 2: Serial Bridge (ตัวรับข้อมูลจาก Arduino)

ตัวนี้จะอ่านข้อมูลจากสาย USB Port ที่เสียบ Arduino อยู่

```bash
cd omni-back-end/serial-bridge
npm start
```

_สังเกต: ถ้าขึ้นว่า `Connected to MQTT` และ `Serial Port Opened` แปลว่าพร้อมทำงาน_

### 🟢 Terminal 3: Platform Service (สมองกลหลัก)

ตัวนี้จะทำหน้าที่เป็น Web Server และ Socket Server

```bash
cd omni-back-end/platform-service
npm start
```

_สังเกต: ดูที่ Log ว่า `Connected to MQTT` และ `API Server running on port 4000`_

### 🟢 Terminal 4: Frontend (หน้าเว็บ)

```bash
cd omni-front-end
npm run dev
```

_เมื่อรันเสร็จ ให้เปิด Browser ไปที่ `http://localhost:5173`_

### 🟢 Terminal 5: Database (Prisma Studio) _[เปิดเมื่อต้องการดูข้อมูล]_

```bash
cd omni-back-end/platform-service
npx prisma studio
```

_ใช้สำหรับเข้าไปดูข้อมูลใน Database ผ่านหน้าเว็บ_

---

## 3. เจาะลึก Data Flow (ข้อมูลวิ่งยังไง?)

สมมติ Arduino อ่านค่า Sensor วัดระยะทางได้ `25.5 cm` **นี่คือการเดินทางของเลข 25.5**:

### Step 1: Arduino -> Serial Bridge

- Arduino ส่งข้อมูลผ่านสาย USB เป็นข้อความดิบ:
  ```text
  device_01|profile_distance_v1|{"distance": 25.5}
  ```

### Step 2: Serial Bridge -> MQTT Broker

- `bridge.js` อ่านเจอข้อความด้านบน
- ทำการแยกข้อความ (Parse) เป็น JSON:
  ```json
  {
    "device_id": "device_01",
    "profile_id": "profile_distance_v1",
    "distance": 25.5,
    "timestamp": "2024-01-28T10:00:00Z"
  }
  ```
- **Publish (ประกาศ)** ข้อมูลนี้ขึ้นไปบน MQTT Topic: `iot/device_01/telemetry`

### Step 3: MQTT Broker -> Platform Service

- `platform-service` ที่ subscribe (รอฟัง) Topic `iot/+/telemetry` อยู่ ได้รับข้อมูลทันที
- Backend รู้แล้วว่ามีข้อมูลใหม่มา แต่จะไม่เก็บลง DB (ในโหมด Live)
- Backend **Emit (ยิง)** ข้อมูลนี้ออกทาง Socket.IO ทันที ด้วยชื่อ Event: `sensor-data`

### Step 4: Platform Service -> Frontend

- หน้าเว็บ (`liveMonitor.jsx`) ที่เชื่อมต่อ Socket `localhost:4000` รอฟัง Event `sensor-data` อยู่
- **(New Feature) Auto-Switching**: หากได้รับข้อมูลจากอุปกรณ์ใหม่ที่ไม่ได้เลือกอยู่ (แต่มัน Active) ระบบจะสลับหน้าจอไปแสดงผลอุปกรณ์นั้นให้ทันที เพื่อแก้ปัญหาจอดำ
- เมื่อได้รับข้อมูล `{ "distance": 25.5, ... }`
- เมื่อได้รับข้อมูล `{ "distance": 25.5, ... }`
- React State จะถูกอัปเดต (`setTelemetryData`)
- **กราฟบนหน้าจอก็จะขยับเส้นขึ้นไปที่เลข 25.5 ทันที!**

---

## 4. โครงสร้าง Database ใหม่ (หลังจากลบ Project)

ตอนนี้โครงสร้างเรียบง่ายมากครับ ไม่มี Project มาขั้นกลางแล้ว:

- **Users**: เก็บข้อมูลผู้ใช้งาน (Username, Password, Role)
- **Device Profiles**: แม่แบบของอุปกรณ์ (เช่น "Pressure Mat 16x16" หรือ "Distance Sensor V1")
- **Devices**: ตัวอุปกรณ์จริง (มี Serial Number) **ผูกกับ Device Profile โดยตรง**
- **System Logs**: เก็บประวัติการทำงานของอุปกรณ์

**รูปแบบความสัมพันธ์:**
`Device` 🔗 เชื่อมโยงกับ -> `Device Profile` (1 Profile มีได้หลาย Device)

---

## 5. Git Commit Summary (สำหรับใช้งาน)

คุณสามารถใช้ข้อความด้านล่างนี้สำหรับการ Commit ครับ:

```text
refactor: rename gateway to bridge and remove project schema

- Renamed `serial-gateway` -> `serial-bridge` and `gateway.js` -> `bridge.js` to clarify its role.
- Removed `Project` model and all related relationships from Prisma Schema.
- Refactored `deviceController` and `adminController` to remove project logic.
- Updated `prisma/seed.js` to seed only Users and Devices/Profiles.
- Added `prisma.seed` configuration to `package.json`.
```

---

## 6. อธิบายโค้ดการเชื่อมต่อ Arduino (`bridge.js`)

โค้ดในไฟล์ `bridge.js` ทำงานเหมือน "ล่าม" ครับ คอยฟังภาษา Arduino แล้วแปลเป็นภาษา JSON ที่เว็บเข้าใจ โดยมีจุดสำคัญ 3 จุดครับ:

#### **จุดที่ 1: การเปิดประตูฟัง (Open Serial Port)**

ตรงนี้คือการบอกให้โปรแกรมเริ่มฟังเสียงจากสาย USB (COM Port) โดยตั้งความเร็ว (Baud Rate) ให้ตรงกับที่ Arduino ส่งมา

```javascript
// บรรทัด 18-19: สร้างการเชื่อมต่อ
const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
// สำคัญมาก: ใช้ ReadlineParser เพื่อบอกว่า "1 ข้อความ = 1 บรรทัด (\n)"
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
```

#### **จุดที่ 2: การรับและแกะกล่องข้อความ (Receive & Parse)**

เมื่อ Arduino ส่งข้อความมา (เช่น `deviceID|profileID|{"temp": 25}`) ฟังก์ชัน `parser.on('data')` จะทำงาน

```javascript
// บรรทัด 39: เมื่อมีข้อมูลเข้ามา
parser.on('data', (data) => {
    // 1. ล้างขยะ: ตัดช่องว่างหน้าหลังและตัวอักษรแปลกปลอมออก
    const cleanData = data.toString().trim();

    // --- กรณีเป็นข้อมูลทั่วไป (Standard Parsing) ---
    // บรรทัด 83: ใช้ตัวคั่น "|" เพื่อแยกชิ้นส่วนข้อมูล
    const parts = cleanData.split('|');

    // สมมติข้อมูลคือ: "sensor01|temp_v1|{\"val\": 30}"
    // parts[0] = "sensor01" (Device ID)
    // parts[1] = "temp_v1" (Profile ID)
    // parts[2] = "{\"val\": 30}" (JSON Data)

    const deviceId = parts[0];
    const profileId = parts[1];
    const rawJson = parts.slice(2).join('|'); // เอาส่วนที่เหลือมารวมเป็น Data

    // บรรทัด 92: แปลงข้อความ JSON ให้เป็น Object จริงๆ ที่ JS ใช้งานได้
    const metrics = JSON.parse(rawJson);
```

#### **จุดที่ 3: การส่งต่อ (Publish to MQTT)**

พอได้ข้อมูลที่เป็น Object สวยงามแล้ว ก็ส่งขึ้นไปรษณีย์กลาง (MQTT) เพื่อให้ Backend นำไปใช้ต่อ

```javascript
// สร้างห่อพัสดุใหม่ รวมเวลา Timestamp เข้าไป
const payload = {
  device_id: deviceId,
  profile_id: profileId,
  timestamp: new Date().toISOString(),
  ...metrics, // แตกไส้ data ของ sensor ออกมาใส่ตรงนี้
};

// บรรทัด 102: ส่งออกไปที่ Topic "iot/ชื่ออุปกรณ์/telemetry"
const topic = `iot/${deviceId}/telemetry`;
mqttClient.publish(topic, JSON.stringify(payload));
```

---

## 7. สรุปหน้าที่ Service และผลกระทบ (Why do we need them?)

สิ่งที่แต่ละตัวทำ และถ้า **(❌) ไม่รัน** จะเกิดอะไรขึ้น:

#### 1. `omni-back-end/serial-bridge`

- **คืออะไร**: ล่ามแปลภาษา (Arduino Serial Port ↔ MQTT)
- **ทำหน้าที่**: อ่านข้อมูลดิบจาก USB และแปลงเป็น JSON ส่งให้คนอื่น
- **(❌) ถ้าไม่รัน**:
  - ข้อมูลจาก Arduino จะตันอยู่ที่คอม ไม่ถูกส่งเข้าระบบ
  - หน้าเว็บจะขึ้นว่า **"Disconnected"** หรือไม่มีข้อมูลใหม่เข้ามาเลย

#### 2. `omni-back-end/platform-service`

- **คืออะไร**: สมองกลหลัก (Main API + Socket.IO Server)
- **ทำหน้าที่**:
  1. จัดการระบบ Database (Login, User, Device List)
  2. รับข้อมูลจาก MQTT แล้วยิงสดไปที่หน้าเว็บ (Socket.IO Real-time)
- **(❌) ถ้าไม่รัน**:
  - **หน้าเว็บตายสนิท**: Login ไม่ได้, โหลดรายการอุปกรณ์ไม่ได้
  - กราฟไม่ขยับ เพราะไม่มีตัวกลางส่งข้อมูลจาก MQTT ไปให้ Frontend

#### 3. `omni-back-end/ingest-service` (ตัวเสริม)

- **คืออะไร**: นักจดบันทึก (Data Recorder)
- **ทำหน้าที่**: ดักฟัง MQTT แล้วบันทึกข้อมูลทุกค่าลง InfluxDB (Database สำหรับเก็บข้อมูลย้อนหลัง)
- **(❌) ถ้าไม่รัน**:
  - **กราฟ Real-time ยังวิ่งปกติ** (Live Monitor ทำงานได้)
  - **แต่ดูย้อนหลังไม่ได้**: ข้อมูลเก่าหายหมด ไม่มีการบันทึกประวัติไว้ จะ Export หรือดูกราฟย้อนหลังไม่ได้เลย
