import { useEffect, useMemo, useState } from 'react';

const riskLabels = {
  low: { th: 'ความเสี่ยงต่ำ', en: 'Low risk' },
  medium: { th: 'ความเสี่ยงปานกลาง', en: 'Moderate risk' },
  high: { th: 'ต้องติดตามใกล้ชิด', en: 'Needs attention' },
};

export const patients = [
  { id: 'PT-001', name: 'นางสาวสุดา สุขใจ', initials: 'สส', age: 68, lastAssessment: '2026-08-06 09:30', score: 82, change: 6, risk: 'low', status: 'พร้อมติดตาม' },
  { id: 'PT-002', name: 'นายสมชาย มั่นคง', initials: 'สช', age: 72, lastAssessment: '2026-08-06 09:12', score: 61, change: -3, risk: 'medium', status: 'กำลังประเมิน' },
  { id: 'PT-003', name: 'นางมาลี วัฒนา', initials: 'มว', age: 75, lastAssessment: '2026-08-05 15:45', score: 44, change: -8, risk: 'high', status: 'รอทบทวนผล' },
  { id: 'PT-004', name: 'นายประเสริฐ ดีมาก', initials: 'ปด', age: 65, lastAssessment: '2026-08-05 13:20', score: 76, change: 2, risk: 'low', status: 'พร้อมติดตาม' },
  { id: 'PT-005', name: 'นางสมศรี พันธ์ดี', initials: 'สพ', age: 70, lastAssessment: '2026-08-04 10:00', score: 58, change: 1, risk: 'medium', status: 'รอนัดถัดไป' },
];

const makeSession = (id, patientId, date, score, risk, stability, symmetry, posture, duration) => ({
  id,
  patientId,
  date,
  score,
  risk,
  stability,
  symmetry,
  posture,
  duration,
  recommendation: risk === 'high'
    ? 'ควรปรึกษานักกายภาพบำบัดเพื่อทบทวนแผนฝึกทรงตัว'
    : 'ฝึกยืนทรงตัวและเดินตามคำแนะนำของนักกายภาพบำบัดอย่างสม่ำเสมอ',
});

export const sessions = [
  makeSession('AS-260806-01', 'PT-001', '6 ส.ค. 2569, 09:30', 82, 'low', 88, 94, 'ยืนทรงตัวได้ดี', '03:24'),
  makeSession('AS-260730-02', 'PT-001', '30 ก.ค. 2569, 10:15', 76, 'low', 81, 89, 'ยืนทรงตัวได้ดี', '03:19'),
  makeSession('AS-260723-03', 'PT-001', '23 ก.ค. 2569, 09:50', 71, 'medium', 74, 86, 'โอนเล็กน้อย', '03:30'),
  makeSession('AS-260806-04', 'PT-002', '6 ส.ค. 2569, 09:12', 61, 'medium', 63, 78, 'เอนไปทางซ้าย', '03:10'),
  makeSession('AS-260805-05', 'PT-003', '5 ส.ค. 2569, 15:45', 44, 'high', 48, 63, 'ไม่สมดุล', '03:03'),
  makeSession('AS-260805-06', 'PT-004', '5 ส.ค. 2569, 13:20', 76, 'low', 80, 91, 'ยืนทรงตัวได้ดี', '03:16'),
  makeSession('AS-260804-07', 'PT-005', '4 ส.ค. 2569, 10:00', 58, 'medium', 60, 75, 'โอนเล็กน้อย', '03:21'),
];

export const devices = [
  { id: 'SEN-01', name: 'Balance Mat A', type: 'แผ่นรองแรงกด', en: 'Pressure mat', location: 'ห้องประเมิน 1', status: 'online', battery: 92, lastSeen: 'เมื่อสักครู่' },
  { id: 'SEN-02', name: 'Motion Radar B', type: 'เซ็นเซอร์การเคลื่อนไหว', en: 'mmWave radar', location: 'ห้องประเมิน 1', status: 'online', battery: 100, lastSeen: 'เมื่อสักครู่' },
  { id: 'SEN-03', name: 'Balance Mat C', type: 'แผ่นรองแรงกด', en: 'Pressure mat', location: 'ห้องประเมิน 2', status: 'offline', battery: 18, lastSeen: '12 นาทีที่แล้ว' },
  { id: 'SEN-04', name: 'Motion Radar D', type: 'เซ็นเซอร์การเคลื่อนไหว', en: 'mmWave radar', location: 'ห้องฝึกกายภาพ', status: 'online', battery: 76, lastSeen: '2 นาทีที่แล้ว' },
];

export const getPatient = (id) => patients.find((patient) => patient.id === id) || patients[0];
export const getSessionsForPatient = (patientId) => sessions.filter((session) => session.patientId === patientId);
export const getSession = (id) => sessions.find((session) => session.id === id) || sessions[0];
export const getRiskLabel = (risk) => riskLabels[risk] || riskLabels.low;

export const createPressureMatrix = (centerX = 16, centerY = 16, spread = 6) => Array.from({ length: 1024 }, (_, index) => {
  const row = Math.floor(index / 32);
  const column = index % 32;
  const distance = Math.hypot(row - centerY, column - centerX);
  return Math.max(0, Math.min(1, 1 - distance / spread));
});

export const signalSeries = Array.from({ length: 18 }, (_, index) => ({
  time: `${String(9 + Math.floor(index / 6)).padStart(2, '0')}:${String((index % 6) * 10).padStart(2, '0')}`,
  movement: 24 + Math.round(Math.sin(index * 0.75) * 14 + (index % 4) * 3),
  sway: 14 + Math.round(Math.cos(index * 0.62) * 7 + (index % 3) * 2),
  pressure: 48 + Math.round(Math.sin(index * 0.42) * 18),
}));

export const useLiveAssessment = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setFrame((current) => (current + 1) % 24), 1100);
    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => {
    const centerX = 16 + Math.sin(frame / 3) * 3.2;
    const centerY = 16 + Math.cos(frame / 4) * 2.3;
    return {
      pressureData: createPressureMatrix(centerX, centerY, 6.5),
      center: { x: centerX, y: centerY },
      movement: 30 + Math.round(Math.sin(frame / 2) * 8),
      posture: frame % 8 > 5 ? 'โอนเล็กน้อย' : 'ยืนทรงตัวได้ดี',
    };
  }, [frame]);
};
