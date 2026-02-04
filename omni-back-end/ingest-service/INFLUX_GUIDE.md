# InfluxDB Integration Guide

ระบบ Omni Project รองรับการเก็บข้อมูลลง InfluxDB ผ่าน **Ingest Service** โดยอัตโนมัติเมื่อมีข้อมูลเข้ามาทาง MQTT

## 1. การทำงาน (Pipeline)

1. **Device** ส่งข้อมูลเข้า Serial Bridge หรือ WiFi
2. **Serial Bridge** ส่งข้อมูลไปที่ MQTT Broker (`iot/+/telemetry`)
3. **Ingest Service** รับข้อมูลจาก MQTT
4. **Ingest Service** บันทึกข้อมูลลง InfluxDB ผ่าน `influxWriter.js`

## 2. การตั้งค่า (.env)

ไฟล์ `.env` ในโฟลเดอร์ `omni-back-end/ingest-service/` ต้องมีการตั้งค่าดั้งนี้:

```ini
# InfluxDB Connectivity
INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=my-super-secret-auth-token
INFLUX_ORG=my-org
INFLUX_BUCKET=omni_telemetry
```

> **Note:** ตรวจสอบให้แน่ใจว่า InfluxDB รันอยู่และ Bucket ถูกสร้างเรียบร้อยแล้ว

## 3. Data Schema

ข้อมูลจะถูกเก็บลง InfluxDB ตามโครงสร้างนี้:

- **Measurement:** `device_type` (เช่น `pressure_mat`, `imu`, `ultrasonic_sensor`)
- **Tags:**
  - `device_id`: ID ของอุปกรณ์ (เช่น `mat_01`)
  - `profile_id`: ID ของ Profile ที่ใช้
- **Fields:**
  - เก็บค่าตามที่ส่งมา เช่น `distance`, `temperature`, `force_avg`
  - ข้อมูล Array หรือ Matrix จะถูกแปลงเป็น JSON String

## 4. การดูข้อมูล (Querying)

คุณสามารถดูข้อมูลผ่าน InfluxDB UI (ปกติอยู่ที่ [http://localhost:8086](http://localhost:8086)) หรือเรียกผ่าน API ของ Ingest Service:

### API Endpoint

**GET** `/telemetry/:device_id?start=-1h`

**ตัวอย่าง:**

```bash
curl http://localhost:3000/telemetry/mat_01?start=-1h
```

response:

```json
{
  "count": 100,
  "data": [
    {
      "_time": "2023-10-27T10:00:00Z",
      "device_id": "mat_01",
      "force_avg": 45.5,
      ...
    }
  ]
}
```

## 5. ขั้นตอนการรันระบบ (Startup Sequence)

เพื่อให้ข้อมูลไหลจากอุปกรณ์ลงสู่ Database ได้สมบูรณ์ ต้องรัน service ตามลำดับนี้:

1. **MQTT Broker:** ต้องรันอยู่ (ปกติใช้ Mosquitto)
2. **Ingest Service:** ตัวรับข้อมูลและเขียนลง InfluxDB
   ```bash
   cd omni-back-end/ingest-service
   npm start
   ```
3. **Serial Bridge:** (จำเป็น _ถ้า_ ใช้อุปกรณ์ผ่านสาย USB/Serial) ตัวอ่านค่าจาก Arduino ส่งเข้า MQTT
   ```bash
   cd omni-back-end/serial-bridge
   node bridge.js
   ```

**สรุป:**

- ถ้าแค่เทส connection InfluxDB -> รันแค่ `test_influx.js` จบ
- ถ้าจะเก็บข้อมูลจริงจาก Sensor -> ต้องเปิด **ครบทุกตัว** (MQTT + Ingest Service + Serial Bridge)
