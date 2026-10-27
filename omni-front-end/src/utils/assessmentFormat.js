export const dateTime = (value) => new Date(value).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const duration = (milliseconds = 0) => `${String(Math.floor(milliseconds / 60000)).padStart(2, '0')}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}`;
