# 🌐 Omni Project: Backend API & Service Documentation

เอกสารนี้รวบรวมรายละเอียดของระบบ Backend สำหรับ Omni Project ซึ่งเป็นแพลตฟอร์ม IoT สำหรับรับส่งข้อมูลจากอุปกรณ์ต่างๆ (เช่น Matrix Sensor, Temperature Sensor) ขึ้นสู่ระบบ Cloud เพื่อแสดงผลแบบ Real-time และเก็บข้อมูลย้อนหลัง

---

## 🏗️ System Architecture (โครงสร้างระบบ)

ระบบ Backend ของเราเป็นแบบ **Microservices Architecture** ซึ่งประกอบด้วย 3 ส่วนหลัก:

1.  **Ingest Service** (`omni-back-end/ingest-service`)
    - **หน้าที่:** เป็นประตูด่านหน้าด่านแรกที่รับข้อมูลดิบจาก Hardware ผ่าน MQTT หรือ HTTP
    - **การทำงาน:**
      - เชื่อมต่อกับ MQTT Broker เพื่อรับข้อมูลจาก Topic `iot/+/telemetry`
      - ตรวจสอบความถูกต้องของข้อมูล (Validation) และ Format ตาม Device Profile
      - บันทึกข้อมูลลง **InfluxDB** (Database สำหรับ Time-series data)
    - **Tech Stack:** NodeJS, InfluxDB Client, MQTT Client

2.  **Platform Service** (`omni-back-end/platform-service`)
    - **หน้าที่:** API Server หลักสำหรับการจัดการระบบ (Core Business Logic)
    - **การทำงาน:**
      - จัดการผู้ใช้งาน (User Management) และการเข้าสู่ระบบ (Authentication)
      - จัดการอุปกรณ์ (Device Management) และสร้าง Device Profiles
      - ให้บริการ REST API แก่ Frontend
      - ทำหน้าที่เป็น **Socket.IO Server** เพื่อส่งข้อมูล Real-time ไปยัง Frontend (`liveMonitor`)
    - **Tech Stack:** NodeJS, Express, PostgreSQL (Prisma ORM), Socket.IO

3.  **Serial Bridge** (`omni-back-end/serial-bridge`)
    - **หน้าที่:** เชื่อมต่ออุปกรณ์ USB/Serial Port เข้ากับระบบ MQTT (สำหรับกรณีต่อตรงกับคอมพิวเตอร์)
    - **การทำงาน:** อ่านค่าจาก Serial Port และส่งขึ้น MQTT Topic

---

## 🚀 การติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. Prerequisites (สิ่งที่ต้องมี)

ก่อนรันระบบ ตรวจสอบให้แน่ใจว่าเครื่องของคุณมี:

- **Node.js** (v18 หรือใหม่กว่า)
- **PostgreSQL** (สำหรับเก็บ User/Device Data)
- **InfluxDB v2** (สำหรับเก็บ Sensor Data)
- **Mosquitto MQTT Broker** (หรือใช้ Cloud Broker)

_(หมายเหตุ: แนะนำให้รัน Database และ Broker ผ่าน Docker ใช้งานง่ายกว่า)_

### 2. ตั้งค่า Environment Variables (.env)

สร้างไฟล์ `.env` ในแต่ละ Service ตามตัวอย่าง:

**สำหรับ `platform-service/.env`:**

```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/omni_db"
JWT_SECRET="mySuperSecretKey123"
MQTT_BROKER="mqtt://localhost:1883"
```

**สำหรับ `ingest-service/.env`:**

```env
INFLUX_URL="http://localhost:8086"
INFLUX_TOKEN="my-token-from-influxdb"
INFLUX_ORG="my-org"
INFLUX_BUCKET="omni-sensor-data"
MQTT_BROKER="mqtt://localhost:1883"
```

### 3. รันโปรแกรม (Running)

เปิด Terminal แยก 2 จอ:

**จอที่ 1: Start Platform Service**

```bash
cd omni-back-end/platform-service
npm install
npx prisma migrate dev --name init # สร้าง Database Tables ครั้งแรก
npm run dev
```

_Log ควรขึ้นว่า: `Platform Service running on http://0.0.0.0:4000`_

**จอที่ 2: Start Ingest Service**

```bash
cd omni-back-end/ingest-service
npm install
node index.js
```

_Log ควรขึ้นว่า: `🚀 Ingest Service starting...` และ `Connected to MQTT`_

---

## 🔌 API Documentation

Endpoint ทั้งหมดอยู่ที่ `http://localhost:4000/api`

### 🔑 1. Authentication (ยืนยันตัวตน)

_ใช้สำหรับ Login เพื่อรับ Token ไปใช้งาน API อื่นๆ_

| Method | Endpoint         | คำอธิบาย    | Body Parameters                                                                          |
| :----- | :--------------- | :---------- | :--------------------------------------------------------------------------------------- |
| `POST` | `/auth/register` | สมัครสมาชิก | `{ "username": "admin", "email": "admin@test.com", "password": "123", "role": "ADMIN" }` |
| `POST` | `/auth/login`    | เข้าสู่ระบบ | `{ "email": "admin@test.com", "password": "123" }`                                       |

> **⚠️ หมายเหตุ:** Default Password สำหรับ User ใหม่จะเป็น Hash ที่ปลอดภัย ในช่วง Demo สามารถใช้ `role: "ADMIN"` ได้เลย ระบบจะ auto-create Role ให้ถ้ายังไม่มี

### 👥 2. User & Admin Management

_ต้องแนบ Header `Authorization: Bearer <TOKEN>`_

| Method   | Endpoint                 | คำอธิบาย                         |
| :------- | :----------------------- | :------------------------------- |
| `GET`    | `/admin/get-users`       | ดูรายชื่อ User ทั้งหมด           |
| `GET`    | `/admin/get-user/:id`    | ดูรายละเอียด User ตาม ID         |
| `POST`   | `/admin/create-user`     | สร้าง User ใหม่ (Admin เท่านั้น) |
| `PUT`    | `/admin/update-user/:id` | แก้ไขข้อมูล User                 |
| `DELETE` | `/admin/delete-user/:id` | ลบ User                          |

### 📟 3. Device Management (จัดการอุปกรณ์)

_ใช้สำหรับลงทะเบียนอุปกรณ์และดูสถานะ_

| Method   | Endpoint                    | คำอธิบาย                          | Parameters                                                                       |
| :------- | :-------------------------- | :-------------------------------- | :------------------------------------------------------------------------------- |
| `GET`    | `/admin/get-devices`        | ดูรายการอุปกรณ์ทั้งหมดในระบบ      | -                                                                                |
| `POST`   | `/admin/create-device`      | เพิ่มอุปกรณ์ใหม่                  | `{ "device_name": "Mat-01", "profile_id": "uuid...", "serial_number": "SN001" }` |
| `PUT`    | `/admin/update-device/:id`  | แก้ไขอุปกรณ์                      | `{ "device_name": "NewName" }`                                                   |
| `DELETE` | `/admin/delete-device/:id`  | ลบอุปกรณ์                         | -                                                                                |
| `GET`    | `/admin/get-profiles`       | ดูรายการ Profile อุปกรณ์ที่รองรับ | -                                                                                |
| `POST`   | `/admin/create-profile`     | สร้าง Profile ใหม่ (Advanced)     | `{ "name": "...", "type": "...", "dataFormat": "JSON" }`                         |
| `PUT`    | `/admin/update-profile/:id` | แก้ไข Profile                     | `{ "name": "NewName" }`                                                          |

> **💡 Note:** การสร้าง Device จำเป็นต้องเลือก **Device Profile** (เช่น `pressure_mat_32x32` หรือ `dht11_sensor`) เพื่อให้ระบบรู้ว่าจะจัดการข้อมูลอย่างไร

---

## 🛠️ รายละเอียดเพิ่มเติม (Technical Details)

### 📌 Database Schema (Postgres)

- **User**: เก็บข้อมูลผู้ใช้, Role, Password Hash
- **Role**: สิทธิ์การใช้งาน (ADMIN, OPERATOR, USER)
- **Device**: เก็บรายชื่ออุปกรณ์และ Serial Number
- **DeviceProfile**: แม่แบบของอุปกรณ์ (บอกว่าอุปกรณ์นี้ส่งข้อมูลแบบไหน)
- **Session**: (Optional) เก็บประวัติการใช้งานอุปกรณ์เป็นรอบๆ

### 📌 Real-time Communication

ระบบใช้ **MQTT** เป็น Pipeline หลักในการส่งข้อมูล:

1.  Device ส่งค่าเข้า Topic: `iot/<device_id>/telemetry`
2.  Platform Service จะ Subscribe Topic นี้ และ Forward ข้อมูลผ่าน **Socket.IO** ไปยังหน้าเว็บ
3.  Frontend รอรับ Event `sensor-data` หรือ `matrix-data` เพื่อวาดกราฟทันที

### ⚠️ Demo Configuration Note

สำหรับการนำเสนอ (Demo) ครั้งนี้:

- ระบบ **Role Authentication** บางส่วนถูกปิดไว้ (`// Removed requireRole('ADMIN')`) เพื่อความสะดวกในการทดสอบ API
- การสร้าง User และ Device สามารถทำได้โดยไม่ต้องเป็น Admin
- ข้อมูล Password ถูก Hash ด้วย `bcrypt` เพื่อความปลอดภัยตามมาตรฐาน

---

👨‍💻 **Developed by Omni Project Team**
ขอให้การนำเสนอผ่านไปด้วยดีครับ!
