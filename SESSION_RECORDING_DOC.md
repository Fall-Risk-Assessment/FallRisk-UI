# คู่มือการใช้งานระบบบันทึก Session (Session Recording Feature)

## 1. ภาพรวม (Overview)

ระบบ Session Recording ช่วยให้ผู้ใช้งานสามารถ **"บันทึกข้อมูลการใช้งานอุปกรณ์"** (เช่น Yoga Mat) ในช่วงเวลาที่ต้องการ เพื่อเก็บประวัติไว้ดูย้อนหลัง โดยระบบจะทำงานร่วมกันระหว่าง:

- **PostgreSQL:** เก็บข้อมูล Metadata (ใครบันทึก, เริ่มกี่โมง, จบกี่โมง, ใช้อุปกรณ์ตัวไหน)
- **InfluxDB:** เก็บข้อมูล Sensor Data ดิบ (ค่าแรงกด Pressure Mat, อุณหภูมิ, ระยะทาง) ตลอดช่วงเวลา

---

## 2. วิธีการใช้งาน (User Guide)

### 2.1 การเริ่มบันทึก (Start Recording)

1. ไปที่หน้า **Live Monitor**
2. เลือกอุปกรณ์ที่ต้องการดูข้อมูล (หรือดูผ่าน Matrix Mode)
3. กดปุ่ม **🔵 START REC**
4. ระบบจะแจ้งเตือนว่า "Recording Started!" และปุ่มจะเปลี่ยนเป็น **🔴 STOP REC**

### 2.2 การหยุดบันทึก (Stop Recording)

1. เมื่อบันทึกเสร็จแล้ว ให้กดปุ่ม **🔴 STOP REC**
2. ระบบจะบันทึกเวลาจบการทำงานลง Database

### 2.3 การดูประวัติย้อนหลัง (View History)

1. ที่หน้า Live Monitor ให้กดปุ่ม **🟢 Sessions** (ข้างปุ่ม Record)
2. ระบบจะแสดงรายการ **Sessions History** ของอุปกรณ์นั้นๆ
   - **Date:** วันที่บันทึก
   - **Device:** ชื่ออุปกรณ์
   - **Duration:** ระยะเวลาที่อัด
   - **Status:** สถานะ (Completed = เสร็จสิ้น, Recording... = กำลังอัด)
3. กดปุ่ม **View** เพื่อดูรายละเอียดเพิ่มเติม (เวลาเริ่ม/จบ ละเอียด)
4. (New) กดปุ่ม **Download CSV** เพื่อดาวน์โหลดไฟล์ข้อมูลดิบทั้งหมดของ Session นั้น (หากมีการ Implement ปุ่มแล้ว)

### 2.4 การดาวน์โหลดข้อมูล CSV (Export Data)

ผู้ดูแลระบบหรือผู้ใช้งานสามารถดึงข้อมูลดิบ (Telemetry Data) ออกมาเป็นไฟล์ CSV ได้ผ่าน API Endpoint (ดูรายละเอียดในหัวข้อ 3.2)

- ข้อมูลที่ได้: Timestamp, Device ID, และค่า Sensor ทุกตัวในช่วงเวลานั้น
- การนำไปใช้: นำไปวิเคราะห์ต่อใน Excel, Python หรือ MATLAB ได้ทันที

---

## 3. ข้อมูลทางเทคนิค (Technical Details)

### 3.1 Database Schema (PostgreSQL)

ตาราง `sessions` ถูกเพิ่มเข้ามาในระบบ `platform-service` เพื่อเก็บข้อมูล:

- `id` (UUID): รหัส Session
- `device_id` (String): Serial Number ของอุปกรณ์
- `start_time` (DateTime): เวลาเริ่ม
- `end_time` (DateTime): เวลาจบ
- `user_id` (String): ID ของผู้ใช้งาน (ถ้ามี)

### 3.2 Backend API (Platform Service)

เพิ่ม File: `controllers/sessionController.js`

- `POST /api/admin/create-session`: สร้าง Session ใหม่ (Start)
- `PUT /api/admin/end-session/:id`: อัปเดตเวลาจบ (Stop)
- `GET /api/admin/get-sessions/:deviceId`: ดึงรายการตามอุปกรณ์
- `GET /api/admin/get-session/:id`: ดึงรายละเอียด Session เดียว
- `GET /api/admin/export-session/:id`: **(New)** ดาวน์โหลดไฟล์ CSV ของ Session นั้นๆ (Query จาก InfluxDB)

### 3.3 Frontend Implementation

แก้ไข/เพิ่มไฟล์:

- `pages/liveMonitor.jsx`: เพิ่ม Logic ปุ่ม Start/Stop และการส่ง Device ID
- `pages/session.jsx`: หน้าแสดงรายการ (History List)
- `pages/sessionDetail.jsx`: หน้าแสดงรายละเอียด (Detail View)
- `services/dashboardService.jsx`: เชื่อมต่อ API Backend
