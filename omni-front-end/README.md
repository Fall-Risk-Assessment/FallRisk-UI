# Omni Project Frontend (ส่วนหน้าบ้าน)

โปรเจกต์ **Omni Frontend** แอปพลิเคชันนี้ถูกพัฒนาขึ้นเพื่อเป็นส่วนติดต่อผู้ใช้ (User Interface) สำหรับระบบ Omni Project โดยใช้เทคโนโลยีที่ทันสมัยเพื่อให้ได้ประสบการณ์การใช้งานที่ดีเยี่ยม

## 🚀 เกี่ยวกับโปรเจกต์

Omni Frontend เป็นเว็บแอปพลิเคชันที่สร้างด้วย **React** และ **Vite** มุ่งเน้นความรวดเร็วและประสิทธิภาพในการทำงาน เชื่อมต่อกับ Backend เพื่อแสดงผลข้อมูลแบบ Real-time และจัดการข้อมูลต่างๆ ภายในระบบ

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

โปรเจกต์นี้ขับเคลื่อนด้วยเทคโนโลยีหลักดังนี้:

- **[React 19](https://react.dev/)**: Library หลักสำหรับการสร้าง User Interface
- **[Vite](https://vitejs.dev/)**: Build tool ที่รวดเร็วสำหรับการพัฒนาเว็บสมัยใหม่
- **[Recharts](https://recharts.org/)**: Library สำหรับการสร้างกราฟและ Data Visualization
- **[Socket.io-client](https://socket.io/)**: สำหรับการเชื่อมต่อและรับส่งข้อมูลแบบ Real-time
- **[Axios](https://axios-http.com/)**: สำหรับการทำ HTTP Requests ไปยัง API
- **[React Router Dom](https://reactrouter.com/)**: สำหรับการจัดการ Routing ภายในแอปพลิเคชัน

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

โครงสร้างไฟล์และโฟลเดอร์หลักภายใน `src`:

- `src/pages`: หน้าเว็บหลักต่างๆ ของแอปพลิเคชัน
- `src/components`: UI Components ที่สามารถนำกลับมาใช้ซ้ำได้
- `src/services`: ไฟล์สำหรับเชื่อมต่อ API และจัดการ Authentication
- `src/hooks`: Custom React Hooks สำหรับ Logic ที่ใช้บ่อย
- `src/layout`: การจัดการ Layout หลักของหน้าเว็บ
- `src/css`: ไฟล์ Stylesheet (CSS) แยกตามส่วนต่างๆ

## 📦 การติดตั้งและเริ่มต้นใช้งาน (Getting Started)

ทำตามขั้นตอนด้านล่างเพื่อรันโปรเจกต์บนเครื่องของคุณ:

### 1. ติดตั้ง Dependencies
เปิด Terminal และรันคำสั่ง:

```bash
npm install
```

### 2. รันโหมด Development
เพื่อเริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา:

```bash
npm run dev
```
แอปพลิเคชันจะเปิดขึ้นที่ [http://localhost:5173](http://localhost:5173) (หรือพอร์ตที่ระบุใน Terminal)

### 3. Build สำหรับ Production
เมื่อต้องการนำขึ้นใช้งานจริง ให้รันคำสั่ง:

```bash
npm run build
```
ไฟล์สำหรับ Production จะถูกสร้างในโฟลเดอร์ `dist`

### 4. ตรวจสอบ Code (Linting)
เพื่อตรวจสอบความถูกต้องของโค้ดด้วย ESLint:

```bash
npm run lint
```
